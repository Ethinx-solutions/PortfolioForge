import express from "express";
import { stripe } from "../core/stripe.js";
import { saveMemory, getMemory } from "../memory/store.js";
import { log } from "../core/logger.js";

const router = express.Router();

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  // ── SIGNATURE VALIDATION ───────────────────────────────
  let event;
  if (secret && secret !== "whsec_your_webhook_secret_here") {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
      log("Webhook", "error", `Signature validation failed: ${err.message}`);
      return res.status(400).json({ error: `Webhook signature invalid: ${err.message}` });
    }
  } else {
    // Dev mode — no secret configured, parse raw but warn loudly
    try {
      event = JSON.parse(req.body);
      log("Webhook", "warn", "⚠️  Stripe webhook running WITHOUT signature validation — set STRIPE_WEBHOOK_SECRET");
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }
  }

  // ── EVENT HANDLERS ─────────────────────────────────────
  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id || session.customer;
        await saveMemory(`user:${userId}:plan`, "pro");
        await saveMemory(`user:${userId}:subscribedAt`, new Date().toISOString());
        // Increment live metrics
        const subs = ((await getMemory("metrics:activeSubs")) || 0) + 1;
        const rev  = ((await getMemory("metrics:totalRevenue")) || 0) + (session.amount_total || 0) / 100;
        const mrr  = ((await getMemory("metrics:mrr")) || 0) + 29;
        await saveMemory("metrics:activeSubs", subs);
        await saveMemory("metrics:totalRevenue", rev);
        await saveMemory("metrics:mrr", mrr);
        log("Webhook", "info", `💰 Payment success — ${userId} → pro (MRR now $${mrr})`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await saveMemory(`user:${sub.customer}:plan`, "free");
        const subs = Math.max(0, ((await getMemory("metrics:activeSubs")) || 1) - 1);
        const mrr  = Math.max(0, ((await getMemory("metrics:mrr")) || 29) - 29);
        await saveMemory("metrics:activeSubs", subs);
        await saveMemory("metrics:mrr", mrr);
        log("Webhook", "warn", `⚠️  Subscription cancelled — ${sub.customer} (MRR now $${mrr})`);
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object;
        log("Webhook", "error", `❌ Payment failed — customer: ${inv.customer}`);
        break;
      }

      case "customer.created": {
        const cust = event.data.object;
        const signups = ((await getMemory("metrics:signups")) || 0) + 1;
        await saveMemory("metrics:signups", signups);
        log("Webhook", "info", `👤 New customer: ${cust.email}`);
        break;
      }

      default:
        log("Webhook", "info", `Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    log("Webhook", "error", `Handler error for ${event.type}: ${err.message}`);
    return res.status(500).json({ error: "Handler failed" });
  }

  res.sendStatus(200);
});

export default router;
