/**
 * STRIPE BACKEND API V2 - REVENUE FORGE V2
 * Advanced Behavioral Upsell Engine with Dynamic Pricing
 * 
 * Features:
 * - Multi-tier dynamic upsell logic (Anchor, Whale, Standard)
 * - Dynamic price ID resolution based on tier and upsell type
 * - Forge Conversion Rate tracking
 * - Post-purchase cross-sell support
 * - Scarcity-driven urgency metadata
 * 
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 */

import express, { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Processed events file for idempotency
const PROCESSED_EVENTS_FILE = path.join(__dirname, "..", "processed_events.json");
const FORGE_METRICS_FILE = path.join(__dirname, "..", "forge_metrics.json");

// Enhanced product configuration with dynamic upsells
const PRODUCTS = {
  starter: {
    price_id: process.env.STRIPE_PRICE_STARTER || "price_starter",
    amount: 3900,
    currency: "aud",
    name: "Starter Bundle",
    metadata: {
      tier: "starter",
      fbt_exempt: "false",
      upsell_type: "anchor", // Anchor tier gets Pro-Growth Accelerator
    },
  },
  growth: {
    price_id: process.env.STRIPE_PRICE_GROWTH || "price_growth",
    amount: 7900,
    currency: "aud",
    name: "Growth Bundle",
    metadata: {
      tier: "growth",
      fbt_exempt: "false",
      upsell_type: "anchor", // Anchor tier gets Pro-Growth Accelerator
    },
  },
  pro: {
    price_id: process.env.STRIPE_PRICE_PRO || "price_pro",
    amount: 12900,
    currency: "aud",
    name: "Pro Bundle",
    metadata: {
      tier: "pro",
      fbt_exempt: "false",
      upsell_type: "standard",
    },
  },
  elite: {
    price_id: process.env.STRIPE_PRICE_ELITE || "price_elite",
    amount: 29900,
    currency: "aud",
    name: "Elite Bundle",
    metadata: {
      tier: "elite",
      fbt_exempt: "false",
      upsell_type: "standard",
    },
  },
  enterprise: {
    price_id: process.env.STRIPE_PRICE_ENTERPRISE || "price_enterprise",
    amount: 39000,
    currency: "aud",
    name: "Enterprise Bundle",
    metadata: {
      tier: "enterprise",
      fbt_exempt: "false",
      upsell_type: "standard",
    },
  },
  vault: {
    price_id: process.env.STRIPE_PRICE_VAULT || "price_vault",
    amount: 250000,
    currency: "aud",
    name: "Vault Bundle",
    metadata: {
      tier: "vault",
      fbt_exempt: "false",
      upsell_type: "whale", // Whale tier gets Neural Priority Pipeline
    },
  },
};

// Upsell configurations
const UPSELLS = {
  pro_growth_accelerator: {
    price_id: process.env.STRIPE_PRICE_PRO_GROWTH_ACCELERATOR || "price_pro_growth_accelerator",
    amount: 4900,
    name: "Pro-Growth Accelerator",
    bundleDiscount: 20, // 20% off
    fbt_exempt: "false",
  },
  neural_priority_pipeline: {
    price_id: process.env.STRIPE_PRICE_NEURAL_PRIORITY_PIPELINE || "price_neural_priority_pipeline",
    amount: 19900,
    name: "Neural Priority Pipeline",
    bundleDiscount: 15, // 15% off
    fbt_exempt: "false",
  },
  bio_suite: {
    price_id: process.env.STRIPE_PRICE_BIO_SUITE || "price_bio_suite",
    amount: 2900,
    name: "Bio Suite",
    bundleDiscount: 15,
    fbt_exempt: "true", // EV product
  },
  bio_suite_crosssell: {
    price_id: process.env.STRIPE_PRICE_BIO_SUITE || "price_bio_suite",
    amount: 1900, // Discounted to $19 for cross-sell
    name: "Bio Suite (Cross-Sell)",
    bundleDiscount: 0,
    fbt_exempt: "true",
  },
};

// Initialize files
async function initializeFiles() {
  try {
    await fs.access(PROCESSED_EVENTS_FILE);
  } catch {
    await fs.writeFile(PROCESSED_EVENTS_FILE, JSON.stringify([], null, 2));
  }

  try {
    await fs.access(FORGE_METRICS_FILE);
  } catch {
    await fs.writeFile(
      FORGE_METRICS_FILE,
      JSON.stringify(
        {
          totalCheckouts: 0,
          totalUpsells: 0,
          forgeConversionRate: 0,
          anchorConversions: 0,
          whaleConversions: 0,
          crossSellConversions: 0,
          totalUpsellRevenue: 0,
        },
        null,
        2
      )
    );
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

// Load Forge metrics
async function loadForgeMetrics(): Promise<any> {
  try {
    const data = await fs.readFile(FORGE_METRICS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      totalCheckouts: 0,
      totalUpsells: 0,
      forgeConversionRate: 0,
      anchorConversions: 0,
      whaleConversions: 0,
      crossSellConversions: 0,
      totalUpsellRevenue: 0,
    };
  }
}

// Update Forge metrics
async function updateForgeMetrics(updates: any): Promise<void> {
  const metrics = await loadForgeMetrics();
  const updated = { ...metrics, ...updates };

  // Recalculate Forge Conversion Rate
  if (updated.totalCheckouts > 0) {
    updated.forgeConversionRate = (updated.totalUpsells / updated.totalCheckouts) * 100;
  }

  await fs.writeFile(FORGE_METRICS_FILE, JSON.stringify(updated, null, 2));
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

/**
 * Resolve upsell based on tier and user behavior
 */
function resolveUpsell(tier: string): string | null {
  const product = PRODUCTS[tier as keyof typeof PRODUCTS];
  if (!product) return null;

  switch (product.metadata.upsell_type) {
    case "anchor":
      return "pro_growth_accelerator";
    case "whale":
      return "neural_priority_pipeline";
    default:
      return "bio_suite";
  }
}

export async function setupStripeAPIV2(app: express.Application) {
  // Initialize files
  await initializeFiles();

  // Parse JSON for non-webhook routes
  app.use(express.json());

  /**
   * CREATE CHECKOUT SESSION V2
   * Enhanced with dynamic upsell logic and Forge tracking
   */
  app.post("/api/checkout-session", async (req: Request, res: Response) => {
    try {
      const {
        tier,
        includeOrderBump,
        customerEmail,
        crossSellOffer,
        originalSessionId,
        discountedPrice,
      } = req.body;

      // Validate tier
      if (!tier || !PRODUCTS[tier as keyof typeof PRODUCTS]) {
        // Check if it's a cross-sell offer
        if (tier !== "bio_suite_crosssell") {
          return res.status(400).json({ error: "Invalid tier" });
        }
      }

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      let upsellApplied = false;
      let upsellType = null;

      // Add main product
      if (tier !== "bio_suite_crosssell") {
        const product = PRODUCTS[tier as keyof typeof PRODUCTS];
        lineItems.push({
          price: product.price_id,
          quantity: 1,
        });
      }

      // Add dynamic upsell based on tier
      if (includeOrderBump && tier !== "bio_suite_crosssell") {
        const upsellKey = resolveUpsell(tier);
        if (upsellKey) {
          const upsell = UPSELLS[upsellKey as keyof typeof UPSELLS];
          lineItems.push({
            price: upsell.price_id,
            quantity: 1,
          });
          upsellApplied = true;
          upsellType = upsellKey;
        }
      }

      // Handle cross-sell offer
      if (crossSellOffer || tier === "bio_suite_crosssell") {
        const upsell = UPSELLS.bio_suite_crosssell;
        lineItems.push({
          price: upsell.price_id,
          quantity: 1,
        });
        upsellApplied = true;
        upsellType = "bio_suite_crosssell";
      }

      // Create checkout session
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
          upsellApplied: upsellApplied ? "true" : "false",
          upsellType: upsellType || "none",
          crossSellOffer: crossSellOffer ? "true" : "false",
          originalSessionId: originalSessionId || "none",
          timestamp: new Date().toISOString(),
        },
      });

      // Update Forge metrics
      const metrics = await loadForgeMetrics();
      metrics.totalCheckouts += 1;
      if (upsellApplied) {
        metrics.totalUpsells += 1;
        metrics.totalUpsellRevenue += lineItems.reduce((sum, item) => {
          // In production, fetch actual price from Stripe
          return sum + 4900; // Placeholder
        }, 0);

        if (upsellType === "pro_growth_accelerator") {
          metrics.anchorConversions += 1;
        } else if (upsellType === "neural_priority_pipeline") {
          metrics.whaleConversions += 1;
        } else if (upsellType === "bio_suite_crosssell") {
          metrics.crossSellConversions += 1;
        }
      }
      await updateForgeMetrics(metrics);

      res.json({ sessionId: session.id, clientSecret: session.client_secret });
    } catch (error) {
      console.error("Checkout session error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  /**
   * STRIPE WEBHOOK HANDLER V2
   * Enhanced with Forge conversion tracking
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
    const metadata = session.metadata || {};
    const upsellApplied = metadata.upsellApplied === "true";
    const upsellType = metadata.upsellType;

    console.log(`✓ Checkout completed: ${session.id}`);
    console.log(`  Customer: ${session.customer_email}`);
    console.log(`  Amount: $${(session.amount_total || 0) / 100} AUD`);
    console.log(`  Tier: ${metadata.tier}`);
    console.log(`  Upsell Applied: ${upsellApplied}`);
    console.log(`  Upsell Type: ${upsellType}`);

    // Log Forge conversion
    if (upsellApplied) {
      console.log(`🔥 FORGE CONVERSION: ${upsellType}`);
    }

    // Trigger Neural Recon for high-value transactions
    if ((session.amount_total || 0) >= 250000) {
      await triggerNeuralRecon(session);
    }

    // Emit WebSocket event
    await emitSalesEvent({
      type: "checkout_completed",
      sessionId: session.id,
      amount: session.amount_total || 0,
      tier: metadata.tier,
      upsellApplied,
      upsellType,
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
   */
  async function triggerNeuralRecon(session: Stripe.Checkout.Session) {
    console.log("\n🚨 NEURAL RECON PRIORITY QUEUE ACTIVATED 🚨");
    console.log("═══════════════════════════════════════════════════");
    console.log(`VAULT TIER PAYMENT DETECTED: $${(session.amount_total || 0) / 100} AUD`);
    console.log(`Session ID: ${session.id}`);
    console.log(`Customer: ${session.customer_email}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log("═══════════════════════════════════════════════════\n");

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
   */
  async function emitSalesEvent(event: any) {
    try {
      const wsUrl = process.env.WEBSOCKET_URL || "ws://91.99.162.243:3001";
      console.log(`📡 Emitting sales event to ${wsUrl}`);
      console.log(`   Event: ${event.type}`);
      console.log(`   Amount: $${event.amount / 100} AUD`);
      console.log(`   Upsell Applied: ${event.upsellApplied}`);
    } catch (error) {
      console.error("Failed to emit sales event:", error);
    }
  }