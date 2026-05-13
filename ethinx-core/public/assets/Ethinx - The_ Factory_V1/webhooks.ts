import type { Express, Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { insertSalesEvent, insertNeuralAlert, computeAndStoreMetrics, getSalesEventByExternalId } from "./db";
import { ENV } from "./_core/env";

/**
 * Webhook endpoints for receiving real-time events from:
 * 1. Hetzner backend (authenticated via HMAC-SHA256 signature)
 * 2. Stripe webhooks (checkout.session.completed)
 * 3. Manual event injection (authenticated, for testing)
 *
 * Security:
 * - HMAC-SHA256 signature verification on Hetzner & manual endpoints
 * - Rate limiting per IP
 * - Structured request logging
 * - Input validation and sanitization
 */

// ─── Tier Mapping ───────────────────────────────────────────────
const STRIPE_TIER_MAP: Record<string, "Starter" | "Growth" | "Pro" | "Elite" | "Enterprise" | "Vault"> = {
  // Map your Stripe price IDs to tiers here, e.g.:
  // "price_1Abc123": "Starter",
  // "price_2Def456": "Growth",
};

const VALID_TIERS = ["Starter", "Growth", "Pro", "Elite", "Enterprise", "Vault"] as const;
const VALID_EVENT_TYPES = ["checkout", "upsell", "cross_sell", "refund"] as const;

// ─── Rate Limiter ───────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean up stale rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitMap.entries()).forEach(([ip, entry]) => {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  });
}, 300_000);

// ─── HMAC-SHA256 Signature Verification ─────────────────────────

/**
 * Generate an HMAC-SHA256 signature for a payload.
 * The Hetzner backend must use this same algorithm:
 *
 *   const signature = crypto
 *     .createHmac("sha256", WEBHOOK_SECRET)
 *     .update(JSON.stringify(payload))
 *     .digest("hex");
 *
 * Then send it as: X-Webhook-Signature: sha256=<signature>
 */
function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;

  // Accept both "sha256=<hex>" and raw "<hex>" formats
  const providedSig = signature.startsWith("sha256=")
    ? signature.slice(7)
    : signature;

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedSig, "hex"),
      Buffer.from(expectedSig, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Legacy auth: simple API key comparison.
 * Used as a fallback when HMAC signature is not provided.
 */
function verifyApiKey(req: Request, secret: string): boolean {
  const apiKey = req.headers["x-api-key"] as string
    || req.headers["authorization"]?.replace("Bearer ", "");
  if (!apiKey || !secret) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(apiKey),
      Buffer.from(secret)
    );
  } catch {
    return false;
  }
}

// ─── Structured Logger ──────────────────────────────────────────
function logWebhook(source: string, action: string, details: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    source,
    action,
    ...details,
  };
  console.log(`[Webhook/${source}] ${JSON.stringify(entry)}`);
}

// ─── Helpers ────────────────────────────────────────────────────
function getAlertPriority(tier: string): "standard" | "high" | "critical" {
  if (tier === "Vault") return "critical";
  if (tier === "Enterprise") return "high";
  return "standard";
}

function isValidTier(tier: string): tier is typeof VALID_TIERS[number] {
  return VALID_TIERS.includes(tier as any);
}

function sanitizeString(str: unknown, maxLength = 200): string {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLength);
}

// ─── Middleware: Rate Limiter ────────────────────────────────────
function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    logWebhook("system", "rate_limited", { ip });
    return res.status(429).json({ error: "Too many requests. Try again later." });
  }
  next();
}

// ─── Middleware: Auth (HMAC or API Key) ──────────────────────────
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const secret = ENV.webhookSecret;

  // If no secret is configured, reject all requests in production
  if (!secret) {
    if (ENV.isProduction) {
      logWebhook("system", "auth_failed", { reason: "no_secret_configured" });
      return res.status(500).json({ error: "Webhook secret not configured" });
    }
    // In development, allow unauthenticated requests with a warning
    logWebhook("system", "auth_bypass", { reason: "dev_mode_no_secret" });
    return next();
  }

  // Method 1: HMAC-SHA256 signature (preferred)
  const signature = req.headers["x-webhook-signature"] as string;
  if (signature) {
    const rawBody = JSON.stringify(req.body);
    if (verifyHmacSignature(rawBody, signature, secret)) {
      logWebhook("system", "auth_success", { method: "hmac" });
      return next();
    }
    logWebhook("system", "auth_failed", { method: "hmac", reason: "invalid_signature" });
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  // Method 2: API Key / Bearer token (legacy fallback)
  if (verifyApiKey(req, secret)) {
    logWebhook("system", "auth_success", { method: "api_key" });
    return next();
  }

  logWebhook("system", "auth_failed", { reason: "no_valid_credentials" });
  return res.status(401).json({ error: "Unauthorized. Provide X-Webhook-Signature or X-Api-Key header." });
}

// ─── Core Event Processing ──────────────────────────────────────
async function processIncomingEvent(source: "hetzner" | "stripe" | "manual", event: Record<string, any>): Promise<{
  success: boolean;
  eventId?: number;
  deduplicated?: boolean;
  error?: string;
  statusCode: number;
}> {
  // Validate required fields
  const customer = sanitizeString(event.customer);
  const amountCents = Number(event.amountCents || event.amount_cents);
  const tier = sanitizeString(event.tier);

  if (!customer) return { success: false, error: "Missing required field: customer", statusCode: 400 };
  if (!amountCents || amountCents <= 0) return { success: false, error: "amountCents must be a positive number", statusCode: 400 };
  if (!tier || !isValidTier(tier)) return { success: false, error: `Invalid tier. Must be one of: ${VALID_TIERS.join(", ")}`, statusCode: 400 };

  const eventType = event.eventType || event.event_type || "checkout";
  if (!VALID_EVENT_TYPES.includes(eventType as any)) {
    return { success: false, error: `Invalid eventType. Must be one of: ${VALID_EVENT_TYPES.join(", ")}`, statusCode: 400 };
  }

  // Deduplicate by externalId
  const externalId = sanitizeString(event.externalId || event.external_id)
    || `${source}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  if (event.externalId || event.external_id) {
    const existing = await getSalesEventByExternalId(externalId);
    if (existing) {
      logWebhook(source, "deduplicated", { externalId, existingId: existing.id });
      return { success: true, eventId: existing.id, deduplicated: true, statusCode: 200 };
    }
  }

  // Insert event
  const eventId = await insertSalesEvent({
    externalId,
    customer,
    customerEmail: sanitizeString(event.customerEmail || event.customer_email, 320) || undefined,
    amountCents,
    currency: sanitizeString(event.currency, 3).toUpperCase() || "AUD",
    tier: tier as any,
    eventType: eventType as any,
    source,
    stripeSessionId: sanitizeString(event.stripeSessionId || event.stripe_session_id) || undefined,
    metadata: event.metadata,
    eventTimestamp: new Date(),
  });

  // Auto-trigger Neural Alert for high-value transactions ($2,500+)
  if (amountCents >= 250000) {
    await insertNeuralAlert({
      salesEventId: eventId,
      customer,
      amountCents,
      tier: tier as any,
      priority: getAlertPriority(tier),
    });
    logWebhook(source, "neural_alert_triggered", { eventId, customer, amountCents, tier, priority: getAlertPriority(tier) });
  }

  // Recompute metrics
  try {
    await computeAndStoreMetrics();
  } catch (e) {
    logWebhook(source, "metrics_recompute_failed", { error: String(e) });
  }

  logWebhook(source, "event_ingested", {
    eventId,
    customer,
    tier,
    amountCents,
    eventType,
  });

  return { success: true, eventId, deduplicated: false, statusCode: 200 };
}

// ─── Route Registration ─────────────────────────────────────────
export function registerWebhookRoutes(app: Express) {

  // ─── Hetzner Backend Event Ingestion ────────────────────────────
  // Authenticated via HMAC-SHA256 signature or API key
  app.post("/api/webhook/hetzner",
    rateLimitMiddleware,
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const result = await processIncomingEvent("hetzner", req.body);
        return res.status(result.statusCode).json(result);
      } catch (error) {
        logWebhook("hetzner", "error", { error: String(error) });
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // ─── Stripe Webhook ─────────────────────────────────────────────
  // Note: For production, add Stripe signature verification
  app.post("/api/webhook/stripe",
    rateLimitMiddleware,
    async (req: Request, res: Response) => {
      try {
        const event = req.body;

        if (event.type === "checkout.session.completed") {
          const session = event.data?.object;
          if (!session) {
            return res.status(400).json({ error: "Missing session data" });
          }

          const tier = session.metadata?.tier
            || STRIPE_TIER_MAP[session.metadata?.priceId]
            || "Starter";

          const customerName = sanitizeString(
            session.customer_details?.name
            || session.customer_email?.split("@")[0]
            || "Unknown"
          );

          const result = await processIncomingEvent("stripe", {
            externalId: `stripe_${event.id}`,
            customer: customerName,
            customerEmail: session.customer_email,
            amountCents: session.amount_total || 0,
            currency: session.currency || "aud",
            tier,
            eventType: session.metadata?.eventType || "checkout",
            stripeSessionId: session.id,
            metadata: { stripeEvent: event.type, paymentStatus: session.payment_status },
          });

          logWebhook("stripe", "checkout_completed", {
            customer: customerName,
            tier,
            amount: session.amount_total,
          });

          return res.status(result.statusCode).json({ received: true, ...result });
        }

        // Always acknowledge Stripe events we don't handle
        return res.json({ received: true, handled: false });
      } catch (error) {
        logWebhook("stripe", "error", { error: String(error) });
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // ─── Manual Event Injection (authenticated, for testing) ───────
  app.post("/api/webhook/manual",
    rateLimitMiddleware,
    authMiddleware,
    async (req: Request, res: Response) => {
      try {
        const result = await processIncomingEvent("manual", req.body);
        return res.status(result.statusCode).json(result);
      } catch (error) {
        logWebhook("manual", "error", { error: String(error) });
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // ─── Health Check ───────────────────────────────────────────────
  app.get("/api/webhook/health", (_req: Request, res: Response) => {
    return res.json({
      status: "operational",
      endpoints: [
        { path: "POST /api/webhook/hetzner", auth: "HMAC-SHA256 or API Key" },
        { path: "POST /api/webhook/stripe", auth: "Stripe Signature (planned)" },
        { path: "POST /api/webhook/manual", auth: "HMAC-SHA256 or API Key" },
      ],
      security: {
        hmac: "SHA256",
        rateLimitPerMinute: RATE_LIMIT_MAX,
        signatureHeader: "X-Webhook-Signature",
        apiKeyHeader: "X-Api-Key",
      },
      timestamp: new Date().toISOString(),
    });
  });
}

// Export for testing
export { verifyHmacSignature, verifyApiKey, checkRateLimit, sanitizeString, isValidTier, getAlertPriority };
