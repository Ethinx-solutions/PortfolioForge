const io = require('socket.io');
const http = require('http');
const express = require('express');
const fal = require("@fal-ai/serverless-client");
const fs = require('fs');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const PORT = 3005;
const TERRITORY_ID = 'vegas';

// ── Stripe ────────────────────────────────────────────────────────────────────
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// ── Supabase ──────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Dashboard Relay ───────────────────────────────────────────────────────────
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://ethinx-dash-mz7rowca.manus.space';
const DASHBOARD_WEBHOOK_SECRET = process.env.DASHBOARD_WEBHOOK_SECRET || '';

// ── Express + Socket.IO ───────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const serverIo = io(server);

// Configure Fal.ai
fal.config({ credentials: process.env.FAL_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Write to Supabase with 3x exponential backoff
// ─────────────────────────────────────────────────────────────────────────────
async function writeToSupabaseWithRetry(table, record, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const { error } = await supabase.from(table).insert(record);
    if (!error) return { success: true };

    console.error(`[SUPABASE] Write attempt ${attempt} failed:`, error.message);

    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      console.log(`[SUPABASE] Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  return { success: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Broadcast to Empire Sentry feed on the dashboard
// ─────────────────────────────────────────────────────────────────────────────
async function broadcastToSentry(event) {
  try {
    const payload = JSON.stringify(event);
    const crypto = require('crypto');
    const sig = crypto
      .createHmac('sha256', DASHBOARD_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    await fetch(`${DASHBOARD_URL}/api/trpc/system.webhookEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-signature': sig
      },
      body: payload
    });
    console.log(`[SENTRY] Broadcast: ${event.title}`);
  } catch (err) {
    console.error('[SENTRY] Broadcast failed:', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE: Process 70/30 Revenue Split
// ─────────────────────────────────────────────────────────────────────────────
async function processRevenueSplit(eventType, stripeObject) {
  const grossAmount = stripeObject.amount_total || stripeObject.amount_paid || 0;
  const productName = stripeObject.metadata?.product_name
    || stripeObject.lines?.data?.[0]?.description
    || 'Unknown Product';

  const operatorShare = Math.round(grossAmount * 0.70);
  const coreShare     = Math.round(grossAmount * 0.30);

  const grossFormatted    = (grossAmount / 100).toFixed(2);
  const operatorFormatted = (operatorShare / 100).toFixed(2);
  const coreFormatted     = (coreShare / 100).toFixed(2);

  console.log(`[REVENUE] ${eventType} | Gross: $${grossFormatted} | Operator: $${operatorFormatted} | Core: $${coreFormatted}`);

  // ── Step 1: Write to Supabase ledger ──────────────────────────────────────
  const record = {
    territory_id:     TERRITORY_ID,
    stripe_event_id:  stripeObject.id,
    event_type:       eventType,
    product_name:     productName,
    gross_amount:     grossAmount,
    operator_share:   operatorShare,
    core_share:       coreShare,
    currency:         stripeObject.currency || 'usd',
    created_at:       new Date().toISOString()
  };

  const { success: dbSuccess } = await writeToSupabaseWithRetry('organization_revenue', record);

  if (!dbSuccess) {
    // ── Fail-safe: CRITICAL event to Sentry ──────────────────────────────
    console.error('[CRITICAL] Supabase write failed after 3 retries. Revenue integrity breach.');
    await broadcastToSentry({
      type:      'CRITICAL',
      title:     `CRITICAL: Vegas Revenue Write Failed — ${productName}`,
      message:   `Supabase ledger write failed after 3 retries. Manual reconciliation required. Gross: $${grossFormatted}`,
      territory: TERRITORY_ID,
      style:     'border-left: 4px solid #FF0000',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // ── Step 2: Broadcast REVENUE event to Empire Sentry ─────────────────────
  await broadcastToSentry({
    type:      'REVENUE',
    title:     `Vegas Revenue Event: ${productName}`,
    message:   `70/30 Split Executed. EthinX Core: $${coreFormatted}. Territory: Vegas.`,
    territory: TERRITORY_ID,
    gross:     grossFormatted,
    operator:  operatorFormatted,
    core:      coreFormatted,
    style:     'border-left: 4px solid #C9A84C',
    timestamp: new Date().toISOString()
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// STRIPE WEBHOOK ENDPOINT
// ─────────────────────────────────────────────────────────────────────────────
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[STRIPE] Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[STRIPE] Event received: ${event.type}`);

  if (event.type === 'checkout.session.completed' || event.type === 'invoice.paid') {
    await processRevenueSplit(event.type, event.data.object);
  }

  res.json({ received: true });
});

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'VEGA Bridge LIVE', territory: TERRITORY_ID }));

// ─────────────────────────────────────────────────────────────────────────────
// SOCKET.IO — Existing T-Dog Terminal Logic (preserved)
// ─────────────────────────────────────────────────────────────────────────────
serverIo.on('connection', (socket) => {
  console.log('[SYSTEM] T-Dog Terminal Linked');

  socket.on('command', async (data) => {
    const txnId = data.txnId || Date.now();
    console.log(`[PLANNING] Triggering AI for TXN: ${txnId}`);
    socket.emit('log', {
      header: "PROPOSED WORKFLOW",
      details: `Generating Real Estate PNG for TXN: ${txnId}`,
      next: "Awaiting T-Dog Confirmation..."
    });
  });

  socket.on('confirm_execution', async (auth) => {
    if (auth.pin === '2247') {
      console.log('[EXECUTION] Firing Fal.ai Flux Engine...');
      try {
        const result = await fal.subscribe("fal-ai/flux/dev", {
          input: {
            prompt: "A modern luxury real estate property, architectural photography, sunset lighting, professional, 4k",
            image_size: "landscape_16_9",
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") console.log('[FLUX] Generating image...');
          }
        });

        const imageUrl = result.images[0].url;
        const txnId = Date.now();
        const filePath = `/var/www/ethinx_solutions/renders/TXN_${txnId}.png`;
        await downloadImage(imageUrl, filePath);
        console.log(`[SUCCESS] Image saved to: ${filePath}`);
        socket.emit('log', { header: "SUCCESS", details: `Asset Created: ${filePath}`, next: "Standing by." });
      } catch (error) {
        console.error('[ERROR] Fal.ai generation failed:', error);
        socket.emit('log', { header: "ERROR", details: `Failed: ${error.message}`, next: "Standing by." });
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Download image
// ─────────────────────────────────────────────────────────────────────────────
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(); });
      fileStream.on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
    }).on('error', reject);
  });
}

server.listen(PORT, () => console.log(`VEGA Bridge LIVE on port ${PORT}`));
