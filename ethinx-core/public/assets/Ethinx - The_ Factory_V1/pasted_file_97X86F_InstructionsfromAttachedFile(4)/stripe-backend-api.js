/**
 * ETHINX STRIPE BACKEND API
 * Express.js endpoint for creating Stripe checkout sessions
 * 
 * SETUP:
 * 1. Install: npm install express stripe dotenv cors
 * 2. Set env: STRIPE_SECRET_KEY=sk_live_your_key
 * 3. Run: node stripe-backend-api.js
 * 4. Server runs on http://localhost:3001
 */

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * CONFIGURATION
 */
const STRIPE_CONFIG = {
  successUrl: process.env.SUCCESS_URL || 'https://www.ethinx.solutions/success?session_id={CHECKOUT_SESSION_ID}',
  cancelUrl: process.env.CANCEL_URL || 'https://www.ethinx.solutions/cancel',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};

/**
 * MIDDLEWARE
 */
app.use(cors());
app.use(express.json());

/**
 * LOGGING MIDDLEWARE
 */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * HEALTH CHECK ENDPOINT
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    stripe: 'connected'
  });
});

/**
 * CREATE CHECKOUT SESSION ENDPOINT
 * 
 * POST /api/create-checkout-session
 * Body: { priceId, email, metadata }
 */
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, email, metadata } = req.body;

    // Validate input
    if (!priceId) {
      return res.status(400).json({ error: 'priceId is required' });
    }

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    console.log(`Creating checkout session for ${email} with price ${priceId}`);

    /**
     * Create Stripe checkout session
     * Using Embedded Checkout for seamless experience
     */
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${STRIPE_CONFIG.successUrl}`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      customer_email: email,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      locale: 'en',
    });

    console.log(`Checkout session created: ${session.id}`);

    res.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create checkout session',
    });
  }
});

/**
 * WEBHOOK ENDPOINT
 * Handles Stripe events (payment success, failure, etc.)
 * 
 * POST /api/webhooks/stripe
 */
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Received webhook event: ${event.type}`);

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    case 'checkout.session.async_payment_succeeded':
      await handleCheckoutSessionAsyncPaymentSucceeded(event.data.object);
      break;

    case 'checkout.session.async_payment_failed':
      await handleCheckoutSessionAsyncPaymentFailed(event.data.object);
      break;

    case 'charge.succeeded':
      await handleChargeSucceeded(event.data.object);
      break;

    case 'charge.failed':
      await handleChargeFailed(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * EVENT HANDLERS
 */

async function handleCheckoutSessionCompleted(session) {
  console.log(`✓ Payment successful for ${session.customer_email}`);
  console.log(`  Session ID: ${session.id}`);
  console.log(`  Amount: ${session.amount_total / 100} ${session.currency.toUpperCase()}`);
  console.log(`  Metadata:`, session.metadata);

  // TODO: Send confirmation email
  // TODO: Create user account
  // TODO: Grant product access
  // TODO: Log transaction
}

async function handleCheckoutSessionAsyncPaymentSucceeded(session) {
  console.log(`✓ Async payment succeeded for ${session.customer_email}`);
  // Handle async payment success
}

async function handleCheckoutSessionAsyncPaymentFailed(session) {
  console.log(`✗ Async payment failed for ${session.customer_email}`);
  // Handle async payment failure
}

async function handleChargeSucceeded(charge) {
  console.log(`✓ Charge succeeded: ${charge.id}`);
  console.log(`  Amount: ${charge.amount / 100} ${charge.currency.toUpperCase()}`);
  console.log(`  Customer: ${charge.customer}`);
}

async function handleChargeFailed(charge) {
  console.log(`✗ Charge failed: ${charge.id}`);
  console.log(`  Reason: ${charge.failure_message}`);
}

/**
 * RETRIEVE SESSION ENDPOINT
 * Get checkout session details
 * 
 * GET /api/checkout-session/:sessionId
 */
app.get('/api/checkout-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      id: session.id,
      status: session.payment_status,
      customer_email: session.customer_email,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      created: session.created,
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * ERROR HANDLING
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

/**
 * 404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/**
 * START SERVER
 */
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║  ETHINX STRIPE BACKEND API                                 ║`);
  console.log(`║  Server running on http://localhost:${PORT}                          ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
  console.log(`✓ Stripe API Key: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'NOT SET'}`);
  console.log(`✓ Webhook Secret: ${process.env.STRIPE_WEBHOOK_SECRET ? 'Configured' : 'NOT SET'}`);
  console.log(`✓ Success URL: ${STRIPE_CONFIG.successUrl}`);
  console.log(`✓ Cancel URL: ${STRIPE_CONFIG.cancelUrl}\n`);
});

module.exports = app;
