import paddleWebhook from './paddle.js';

export default function registerWebhooks(app) {
  // ALL webhooks mount here — raw body preserved
  app.use('/webhooks', paddleWebhook);
  console.log('📡 [System] Webhooks mounted at /webhooks');
}
