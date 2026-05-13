/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  T-DOG EMPIRE OS — Stripe Webhook Relay Service                ║
 * ║  Deployed on Hetzner (91.99.162.243) via PM2                   ║
 * ║  Receives Stripe checkout events and relays them to the        ║
 * ║  Empire OS Dashboard webhook endpoint.                         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Port: 3002
 * Endpoints:
 *   POST /api/webhooks/stripe   — Stripe webhook receiver (with signature verification)
 *   POST /api/relay/manual      — Manual event injection (API key auth)
 *   GET  /health                — Health check
 *   GET  /                      — Service info
 */

const express = require("express");
const crypto = require("crypto");
const https = require("https");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3002;

// ─── Configuration ──────────────────────────────────────────────
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const DASHBOARD_WEBHOOK_SECRET = process.env.DASHBOARD_WEBHOOK_SECRET || "";
const DASHBOARD_URL = process.env.DASHBOARD_URL || "";
const RELAY_API_KEY = process.env.RELAY_API_KEY || DASHBOARD_WEBHOOK_SECRET;

// ─── Stripe Price ID → Tier Mapping ─────────────────────────────
// Update these with your actual Stripe price IDs
const TIER_MAP = {
  // Starter tier ($39)
  "price_starter_monthly": "Starter",
  "price_starter_annual": "Starter",
  // Growth tier ($79)
  "price_growth_monthly": "Growth",
  "price_growth_annual": "Growth",
  // Pro tier ($149)
  "price_pro_monthly": "Pro",
  "price_pro_annual": "Pro",
  // Elite tier ($299)
  "price_elite_monthly": "Elite",
  "price_elite_annual": "Elite",
  // Enterprise tier ($999)
  "price_enterprise_monthly": "Enterprise",
  "price_enterprise_annual": "Enterprise",
  // Vault tier ($2,500+)
  "price_vault": "Vault",
};

// Amount-based tier fallback when no price ID match
function inferTierFromAmount(amountCents) {
  if (amountCents >= 250000) return "Vault";
  if (amountCents >= 99900) return "Enterprise";
  if (amountCents >= 29900) return "Elite";
  if (amountCents >= 14900) return "Pro";
  if (amountCents >= 7900) return "Growth";
  return "Starter";
}

// ─── Structured Logger ──────────────────────────────────────────
function log(action, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    service: "empire-os-relay",
    action,
    ...details,
  };
  console.log(JSON.stringify(entry));
}

// ─── HMAC Signature Generator ───────────────────────────────────
function generateDashboardSignature(payload) {
  return "sha256=" + crypto
    .createHmac("sha256", DASHBOARD_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
}

// ─── Forward Event to Empire OS Dashboard ───────────────────────
async function forwardToDashboard(eventData) {
  if (!DASHBOARD_URL) {
    log("forward_skipped", { reason: "no_dashboard_url" });
    return { success: false, error: "DASHBOARD_URL not configured" };
  }

  const payload = JSON.stringify(eventData);
  const signature = generateDashboardSignature(payload);
  const url = new URL("/api/webhook/hetzner", DASHBOARD_URL);
  const isHttps = url.protocol === "https:";
  const transport = isHttps ? https : http;

  return new Promise((resolve) => {
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "X-Webhook-Signature": signature,
        "User-Agent": "T-Dog-Empire-Relay/1.0",
      },
      timeout: 10000,
    };

    const req = transport.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          log("forward_success", {
            statusCode: res.statusCode,
            eventId: parsed.eventId,
            customer: eventData.customer,
          });
          resolve({ success: true, statusCode: res.statusCode, data: parsed });
        } catch {
          log("forward_parse_error", { statusCode: res.statusCode, body: data.slice(0, 200) });
          resolve({ success: false, error: `Parse error: ${data.slice(0, 100)}` });
        }
      });
    });

    req.on("error", (err) => {
      log("forward_error", { error: err.message });
      resolve({ success: false, error: err.message });
    });

    req.on("timeout", () => {
      req.destroy();
      log("forward_timeout", { url: DASHBOARD_URL });
      resolve({ success: false, error: "Request timed out" });
    });

    req.write(payload);
    req.end();
  });
}

// ─── Stripe Raw Body Middleware ─────────────────────────────────
// Stripe requires the raw body for signature verification
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }));

// All other routes use JSON parsing
app.use((req, res, next) => {
  if (req.path === "/api/webhooks/stripe") return next();
  express.json()(req, res, next);
});

// ─── Stripe Webhook Endpoint ────────────────────────────────────
app.post("/api/webhooks/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  // Verify Stripe signature if secret is configured
  if (STRIPE_WEBHOOK_SECRET && sig) {
    try {
      // Manual Stripe signature verification (no stripe SDK dependency)
      const elements = sig.split(",");
      let timestamp = "";
      let signatures = [];

      for (const element of elements) {
        const [key, value] = element.split("=");
        if (key === "t") timestamp = value;
        if (key === "v1") signatures.push(value);
      }

      if (!timestamp || signatures.length === 0) {
        log("stripe_auth_failed", { reason: "malformed_signature" });
        return res.status(400).json({ error: "Invalid Stripe signature format" });
      }

      // Check timestamp tolerance (5 minutes)
      const tolerance = 300;
      const currentTime = Math.floor(Date.now() / 1000);
      if (Math.abs(currentTime - parseInt(timestamp)) > tolerance) {
        log("stripe_auth_failed", { reason: "timestamp_expired" });
        return res.status(400).json({ error: "Stripe webhook timestamp expired" });
      }

      // Verify signature
      const signedPayload = `${timestamp}.${req.body.toString()}`;
      const expectedSig = crypto
        .createHmac("sha256", STRIPE_WEBHOOK_SECRET)
        .update(signedPayload)
        .digest("hex");

      const isValid = signatures.some((sig) => {
        try {
          return crypto.timingSafeEqual(
            Buffer.from(sig, "hex"),
            Buffer.from(expectedSig, "hex")
          );
        } catch {
          return false;
        }
      });

      if (!isValid) {
        log("stripe_auth_failed", { reason: "invalid_signature" });
        return res.status(401).json({ error: "Invalid Stripe signature" });
      }

      log("stripe_auth_success", { method: "stripe_signature" });
    } catch (err) {
      log("stripe_auth_error", { error: err.message });
      return res.status(400).json({ error: `Webhook verification failed: ${err.message}` });
    }
  } else if (STRIPE_WEBHOOK_SECRET) {
    log("stripe_auth_failed", { reason: "no_signature_header" });
    return res.status(401).json({ error: "Missing stripe-signature header" });
  } else {
    log("stripe_auth_bypass", { reason: "no_webhook_secret_configured" });
  }

  // Parse the event
  let event;
  try {
    event = typeof req.body === "string" ? JSON.parse(req.body) : JSON.parse(req.body.toString());
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  log("stripe_event_received", { type: event.type, id: event.id });

  // Process checkout.session.completed events
  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    if (!session) {
      return res.status(400).json({ error: "Missing session data" });
    }

    // Resolve tier from metadata, price ID, or amount
    const priceId = session.metadata?.priceId
      || session.line_items?.data?.[0]?.price?.id
      || "";
    const tier = session.metadata?.tier
      || TIER_MAP[priceId]
      || inferTierFromAmount(session.amount_total || 0);

    const customerName = session.customer_details?.name
      || session.customer_email?.split("@")[0]
      || "Unknown Customer";

    const eventData = {
      customer: customerName,
      customerEmail: session.customer_email || "",
      amountCents: session.amount_total || 0,
      currency: (session.currency || "aud").toUpperCase(),
      tier,
      eventType: session.metadata?.eventType || "checkout",
      externalId: `stripe_${event.id}`,
      stripeSessionId: session.id,
      metadata: {
        stripeEventType: event.type,
        paymentStatus: session.payment_status,
        priceId,
        mode: session.mode,
      },
    };

    log("stripe_checkout_processed", {
      customer: customerName,
      tier,
      amountCents: session.amount_total,
      stripeEventId: event.id,
    });

    // Forward to Empire OS Dashboard
    const result = await forwardToDashboard(eventData);

    // Also emit to local vega-bridge if running
    try {
      const io = require("socket.io-client");
      const bridge = io("http://localhost:3005", { timeout: 3000 });
      bridge.on("connect", () => {
        bridge.emit("command", {
          action: "inference_real_estate",
          txnId: session.id,
          tier,
          amount: session.amount_total,
        });
        setTimeout(() => bridge.disconnect(), 1000);
      });
      bridge.on("connect_error", () => bridge.disconnect());
    } catch {
      // vega-bridge integration is optional
    }

    return res.json({
      received: true,
      relayed: result.success,
      dashboardEventId: result.data?.eventId,
    });
  }

  // Handle payment_intent.succeeded for additional tracking
  if (event.type === "payment_intent.succeeded") {
    log("stripe_payment_succeeded", { id: event.data?.object?.id });
    return res.json({ received: true, handled: false, note: "payment_intent tracked" });
  }

  // Acknowledge all other events
  return res.json({ received: true, handled: false });
});

// ─── Manual Event Injection ─────────────────────────────────────
app.post("/api/relay/manual", async (req, res) => {
  // Verify API key
  const apiKey = req.headers["x-api-key"] || req.headers["authorization"]?.replace("Bearer ", "");
  if (!RELAY_API_KEY || !apiKey) {
    return res.status(401).json({ error: "API key required" });
  }

  try {
    if (!crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(RELAY_API_KEY))) {
      return res.status(401).json({ error: "Invalid API key" });
    }
  } catch {
    return res.status(401).json({ error: "Invalid API key" });
  }

  const result = await forwardToDashboard(req.body);
  return res.json(result);
});

// ─── Health Check ───────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "operational",
    service: "empire-os-relay",
    port: PORT,
    dashboardUrl: DASHBOARD_URL ? "configured" : "NOT SET",
    stripeWebhookSecret: STRIPE_WEBHOOK_SECRET ? "configured" : "NOT SET",
    dashboardWebhookSecret: DASHBOARD_WEBHOOK_SECRET ? "configured" : "NOT SET",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── Service Info ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    name: "T-DOG Empire OS — Stripe Webhook Relay",
    version: "1.0.0",
    description: "Receives Stripe checkout events and relays them to the Empire OS Dashboard",
    endpoints: {
      stripe: "POST /api/webhooks/stripe",
      manual: "POST /api/relay/manual",
      health: "GET /health",
    },
  });
});

// ─── Start Server ───────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  log("server_started", { port: PORT });
  console.log(`╔══════════════════════════════════════════════════╗`);
  console.log(`║  T-DOG EMPIRE OS — Stripe Relay LIVE on :${PORT}   ║`);
  console.log(`╚══════════════════════════════════════════════════╝`);
  console.log(`Dashboard URL: ${DASHBOARD_URL || "NOT SET"}`);
  console.log(`Stripe Secret: ${STRIPE_WEBHOOK_SECRET ? "CONFIGURED" : "NOT SET"}`);
});
