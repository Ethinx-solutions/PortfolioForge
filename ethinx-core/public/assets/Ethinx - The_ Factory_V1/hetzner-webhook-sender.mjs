#!/usr/bin/env node

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  T-DOG EMPIRE OS — Hetzner Webhook Sender                  ║
 * ║  Deploy this script on your Hetzner server (91.99.162.243)  ║
 * ║  to push sales events to the Empire OS Dashboard.           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * SETUP:
 *   1. Copy this file to your Hetzner server
 *   2. Set the WEBHOOK_SECRET environment variable (same as the dashboard)
 *   3. Set the DASHBOARD_URL environment variable to your dashboard's public URL
 *
 * USAGE:
 *   # As a module (import into your existing backend):
 *   import { sendSalesEvent } from './hetzner-webhook-sender.mjs';
 *   await sendSalesEvent({ customer: 'Parker B.', amountCents: 3900, tier: 'Starter' });
 *
 *   # As a CLI test tool:
 *   WEBHOOK_SECRET=your_secret DASHBOARD_URL=https://your-dashboard.manus.space \
 *     node hetzner-webhook-sender.mjs --test
 *
 *   # Send a specific event:
 *   WEBHOOK_SECRET=your_secret DASHBOARD_URL=https://your-dashboard.manus.space \
 *     node hetzner-webhook-sender.mjs \
 *       --customer "Parker B." \
 *       --amount 3900 \
 *       --tier Starter \
 *       --type checkout
 */

import crypto from "crypto";
import https from "https";
import http from "http";

// ─── Configuration ──────────────────────────────────────────────
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:3000";
const WEBHOOK_PATH = "/api/webhook/hetzner";

// ─── HMAC Signature Generator ───────────────────────────────────
function generateSignature(payload, secret) {
  return "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}

// ─── Send Sales Event ───────────────────────────────────────────
/**
 * Send a sales event to the Empire OS Dashboard.
 *
 * @param {Object} event - The sales event data
 * @param {string} event.customer - Customer name (required)
 * @param {number} event.amountCents - Amount in cents (required)
 * @param {string} event.tier - Tier: Starter|Growth|Pro|Elite|Enterprise|Vault (required)
 * @param {string} [event.eventType] - Event type: checkout|upsell|cross_sell|refund (default: checkout)
 * @param {string} [event.customerEmail] - Customer email
 * @param {string} [event.externalId] - External ID for deduplication
 * @param {string} [event.currency] - Currency code (default: AUD)
 * @param {string} [event.stripeSessionId] - Stripe session ID if applicable
 * @param {Object} [event.metadata] - Additional metadata
 * @returns {Promise<Object>} Response from the dashboard
 */
export async function sendSalesEvent(event) {
  if (!WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET environment variable is not set");
  }

  const payload = JSON.stringify({
    customer: event.customer,
    amountCents: event.amountCents,
    tier: event.tier,
    eventType: event.eventType || "checkout",
    customerEmail: event.customerEmail,
    externalId: event.externalId,
    currency: event.currency || "AUD",
    stripeSessionId: event.stripeSessionId,
    metadata: event.metadata,
  });

  const signature = generateSignature(payload, WEBHOOK_SECRET);
  const url = new URL(WEBHOOK_PATH, DASHBOARD_URL);
  const isHttps = url.protocol === "https:";
  const transport = isHttps ? https : http;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
        "X-Webhook-Signature": signature,
        "User-Agent": "T-Dog-Empire-Hetzner/1.0",
      },
    };

    const req = transport.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

// ─── CLI Mode ───────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes("--test")) {
  // Run a quick test with sample data
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  T-DOG EMPIRE OS — Webhook Connection Test  ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");
  console.log(`Dashboard URL: ${DASHBOARD_URL}`);
  console.log(`Webhook Path:  ${WEBHOOK_PATH}`);
  console.log(`Secret Set:    ${WEBHOOK_SECRET ? "YES" : "NO (REQUIRED!)"}`);
  console.log("");

  if (!WEBHOOK_SECRET) {
    console.error("ERROR: Set WEBHOOK_SECRET environment variable first.");
    process.exit(1);
  }

  const testEvents = [
    { customer: "Test Commander", amountCents: 3900, tier: "Starter", eventType: "checkout" },
    { customer: "Growth Tester", amountCents: 7900, tier: "Growth", eventType: "checkout" },
    { customer: "Whale Corp", amountCents: 250000, tier: "Vault", eventType: "checkout" },
  ];

  console.log("Sending 3 test events...\n");

  for (const event of testEvents) {
    try {
      const result = await sendSalesEvent(event);
      console.log(`✓ ${event.tier.padEnd(12)} | ${event.customer.padEnd(20)} | $${(event.amountCents / 100).toFixed(2).padStart(10)} | Event ID: ${result.data.eventId}`);
    } catch (error) {
      console.error(`✗ ${event.tier.padEnd(12)} | ${event.customer.padEnd(20)} | ERROR: ${error.message}`);
    }
  }

  console.log("\nTest complete. Check your Empire OS Dashboard for live data.");
} else if (args.includes("--customer")) {
  // Send a specific event from CLI args
  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const event = {
    customer: getArg("--customer"),
    amountCents: parseInt(getArg("--amount") || "0", 10),
    tier: getArg("--tier") || "Starter",
    eventType: getArg("--type") || "checkout",
    customerEmail: getArg("--email"),
    externalId: getArg("--id"),
  };

  if (!event.customer || !event.amountCents) {
    console.error("Usage: node hetzner-webhook-sender.mjs --customer 'Name' --amount 3900 --tier Starter");
    process.exit(1);
  }

  try {
    const result = await sendSalesEvent(event);
    console.log("Event sent successfully:", result.data);
  } catch (error) {
    console.error("Failed to send event:", error.message);
    process.exit(1);
  }
}
