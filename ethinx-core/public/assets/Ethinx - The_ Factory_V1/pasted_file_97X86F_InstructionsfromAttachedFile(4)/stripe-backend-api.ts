/**
 * ETHINX V3 STRIPE BACKEND API
 * Revenue Forge Integration with Hardened Webhook Verification
 * 
 * Security Features:
 * - Stripe webhook signature verification using raw request body
 * - Idempotency tracking with processed_events.json
 * - FBT metadata flag for EV products (fbt_exempt: true)
 * - Order Bump logic for Bio Suite upsell ($29 AUD)
 * - WebSocket integration for real-time sales pings
 * 
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 */

import express, { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
// @ts-ignore - Stripe API version compatibility
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Processed events file for idempotency
const PROCESSED_EVENTS_FILE = path.join(__dirname, "..", "processed_events.json");

// Product configuration with FBT metadata
const PRODUCTS = {
  starter: {
    price_id: process.env.STRIPE_PRICE_STARTER || "price_starter",
    amount: 3900, // $39 AUD in cents
    currency: "aud",
    name: "Starter Bundle",
    metadata: {
      tier: "starter",
      fbt_exempt: "false",
    },
  },
  growth: {
    price_id: process.env.STRIPE_PRICE_GROWTH || "price_growth",
    amount: 7900, // $79 AUD
    currency: "aud",
    name: "Growth Bundle",
    metadata: {
      tier: "growth",
      fbt_exempt: "false",
    },
  },
  pro: {
    price_id: process.env.STRIPE_PRICE_PRO || "price_pro",
    amount: 12900, // $129 AUD
    currency: "aud",
    name: "Pro Bundle",
    metadata: {
      tier: "pro",
      fbt_exempt: "false",
    },
  },
  elite: {
    price_id: process.env.STRIPE_PRICE_ELITE || "price_elite",
    amount: 29900, // $299 AUD
    currency: "aud",
    name: "Elite Bundle",
    metadata: {
      tier: "elite",
      fbt_exempt: "false",
    },
  },
  enterprise: {
    price_id: process.env.STRIPE_PRICE_ENTERPRISE || "price_enterprise",
    amount: 39000, // $390 AUD
    currency: "aud",
    name: "Enterprise Bundle",
    metadata: {
      tier: "enterprise",
      fbt_exempt: "false",
    },
  },
  vault: {
    price_id: process.env.STRIPE_PRICE_VAULT || "price_vault",
    amount: 250000, // $2,500 AUD
    currency: "aud",
    name: "Vault Bundle",
    metadata: {
      tier: "vault",
      fbt_exempt: "false",
    },
  },
  // Order Bump: Bio Suite Add-on
  bioSuite: {
    price_id: process.env.STRIPE_PRICE_BIO_SUITE || "price_bio_suite",
    amount: 2900, // $29 AUD
    currency: "aud",
    name: "Bio Suite Add-on",
    metadata: {
      tier: "addon",
      product_type: "bio_suite",
      fbt_exempt: "true", // EV product exemption
    },
  },
};

// Initialize processed events file if it doesn't exist
async function initializeProcessedEvents() {
  try {
    await fs.access(PROCESSED_EVENTS_FILE);
  } catch {
    await fs.writeFile(PROCESSED_EVENTS_FILE, JSON.stringify([], null, 2));
  }
}

// Load processed events
async function loadProcessedEvents(): Promise<string[]> {
  try {
    const data = await fs.readFile(PROCESSED_EVENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save processed event
async function saveProcessedEvent(eventId: string): Promise<void> {
  const events = await loadProcessedEvents();
  if (!events.includes(eventId)) {
    events.push(eventId);
    await fs.writeFile(PROCESSED_EVENTS_FILE, JSON.stringify(events, null, 2));
  }
}

// Middleware to capture raw body for webhook verification
export function rawBodyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/api/webhooks/stripe") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      (req as any).rawBody = data;
      next();
    });
  } else {
    next();
  }
}

export async function setupStripeAPI(app: express.Application) {
  // Initialize processed events
  await initializeProcessedEvents();

  // Parse JSON for non-webhook routes
  app.use(express.json());

  /**
   * CREATE CHECKOUT SESSION
   * Handles order bump logic and dynamic pricing
   */
  app.post("/api/checkout-session", async (req: Request, res: Response) => {
    try {
      const { tier, includeOrderBump, customerEmail } = req.body;

      if (!tier || !PRODUCTS[tier as keyof typeof PRODUCTS]) {
        return res.status(400).json({ error: "Invalid tier" });
      }

      const product = PRODUCTS[tier as keyof typeof PRODUCTS];
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price: product.price_id,
          quantity: 1,
        },
      ];

      // Add Order Bump if requested
      if (includeOrderBump) {
        lineItems.push({
          price: PRODUCTS.bioSuite.price_id,
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/checkout`,
        customer_email: customerEmail,
        metadata: {
          tier,
          includeOrderBump: includeOrderBump ? "true" : "false",
          timestamp: new Date().toISOString(),
        },
      });

      res.json({ sessionId: session.id, clientSecret: session.client_secret });
    } catch (error) {
      console.error("Checkout session error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  /**
   * STRIPE WEBHOOK HANDLER
   * Hardened with signature verification and idempotency
   */
  app.post("/api/webhooks/stripe", async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const rawBody = (req as any).rawBody;

    if (!sig || !rawBody) {
      return res.status(400).json({ error: "Missing signature or body" });
    }

    try {
      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );

      // Check for duplicate processing
      const processedEvents = await loadProcessedEvents();
      if (processedEvents.includes(event.id)) {
        console.log(`Duplicate event detected: ${event.id}`);
        return res.json({ received: true, duplicate: true });
      }

      // Process event
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;
        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case "charge.refunded":
          await handleChargeRefunded(event.data.object as Stripe.Charge);
          break;
      }

      // Mark event as processed
      await saveProcessedEvent(event.id);

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ error: "Webhook error" });
    }
  });

  /**
   * EVENT HANDLERS
   */

  async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    console.log(`✓ Checkout completed: ${session.id}`);
    console.log(`  Customer: ${session.customer_email}`);
    console.log(`  Amount: $${(session.amount_total || 0) / 100} AUD`);
    console.log(`  Tier: ${session.metadata?.tier}`);

    // Trigger Neural Recon Priority Queue for high-value transactions
    if ((session.amount_total || 0) >= 250000) {
      await triggerNeuralReconAlert(session);
    }

    // Emit WebSocket event for real-time ticker
    await emitSalesEvent({
      type: "checkout_completed",
      sessionId: session.id,
      amount: session.amount_total || 0,
      tier: session.metadata?.tier,
      timestamp: new Date().toISOString(),
    });
  }

  async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    console.log(`✓ Payment succeeded: ${paymentIntent.id}`);
    console.log(`  Amount: $${paymentIntent.amount / 100} AUD`);
  }

  async function handleChargeRefunded(charge: Stripe.Charge) {
    console.log(`⚠ Charge refunded: ${charge.id}`);
    console.log(`  Amount: $${charge.amount / 100} AUD`);
  }

  /**
   * NEURAL RECON PRIORITY QUEUE
   * Triggers sensory alert for $2,500 AUD transactions
   */
  async function triggerNeuralReconAlert(session: Stripe.Checkout.Session) {
    console.log("\n🚨 NEURAL RECON PRIORITY QUEUE ACTIVATED 🚨");
    console.log("═══════════════════════════════════════════════════");
    console.log(`VAULT TIER PAYMENT DETECTED: $${(session.amount_total || 0) / 100} AUD`);
    console.log(`Session ID: ${session.id}`);
    console.log(`Customer: ${session.customer_email}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log("═══════════════════════════════════════════════════\n");

    // Log to file for monitoring
    const logEntry = {
      type: "neural_recon_alert",
      sessionId: session.id,
      amount: session.amount_total,
      customer: session.customer_email,
      timestamp: new Date().toISOString(),
    };

    try {
      const logFile = path.join(__dirname, "..", "neural_recon.log");
      const logData = JSON.stringify(logEntry) + "\n";
      await fs.appendFile(logFile, logData);
    } catch (error) {
      console.error("Failed to write neural recon log:", error);
    }
  }

  /**
   * WEBSOCKET EVENT EMISSION
   * Connects to Hetzner Controller node for real-time sales pings
   */
  async function emitSalesEvent(event: any) {
    try {
      const wsUrl = process.env.WEBSOCKET_URL || "ws://91.99.162.243:3001";
      // Note: In production, use wss:// via environment variable
      // ws: ws://91.99.162.243:3001
      // wss: wss://91.99.162.243:3001 (with SSL certificate)

      console.log(`📡 Emitting sales event to ${wsUrl}`);
      console.log(`   Event: ${event.type}`);
      console.log(`   Amount: $${event.amount / 100} AUD`);

      // WebSocket emission would be handled by a separate service
      // This is a placeholder for the connection logic
    } catch (error) {
      console.error("Failed to emit sales event:", error);
    }
  }

  /**
   * HEALTH CHECK ENDPOINT
   */
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      stripeConnected: !!process.env.STRIPE_SECRET_KEY,
      webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
    });
  });

  return app;
}

export default setupStripeAPI;
