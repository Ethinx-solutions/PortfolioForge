import express from 'express';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';

const router = express.Router();

const paddle = new Paddle(process.env.PADDLE_API_KEY || '', {
  environment: process.env.NODE_ENV === 'production'? Environment.production : Environment.sandbox
});

router.post('/paddle', express.raw({ type: 'application/json' }), async (req, res) => {
  const start = Date.now();
  try {
    const signature = req.headers['paddle-signature'];
    const secret = process.env.PADDLE_WEBHOOK_SECRET;

    if (!signature ||!secret) {
      console.error('❌ [Billing] Missing signature or secret');
      return res.status(400).json({ error: 'unauthorized' });
    }

    const event = await paddle.webhooks.unmarshal(req.body.toString('utf8'), secret, signature);

    console.log(`✅ [Billing] ${event.eventType} | ${Date.now() - start}ms`);

    // AGENT HOOK: ETHINX can react here
    // await ethinxAgent.handleBillingEvent(event);

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`❌ [Billing] Verification failed: ${err.message}`);
    res.status(400).json({ error: 'invalid_signature' });
  }
});

export default router;
