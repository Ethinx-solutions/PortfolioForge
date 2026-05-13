# ETHINX V3 CONTROL CONSOLE
## Revenue Forge Integration Guide

**Version:** 3.0  
**Date:** February 6, 2026  
**Status:** Production Ready  
**Design:** Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)

---

## 📋 OVERVIEW

The ETHINX V3 Control Console is a comprehensive revenue management system integrating:

- **Launch Sentry**: Real-time sales ticker with live transaction monitoring
- **Neural Recon Priority Queue**: High-value transaction detection ($2,500+ AUD)
- **Order Bump Upsell**: Bio Suite add-on ($29 AUD) with dynamic pricing
- **Stripe Integration**: Hardened webhook verification with idempotency
- **WebSocket Integration**: Real-time sales pings from Hetzner Controller (ws://91.99.162.243:3001)

---

## 🏗️ ARCHITECTURE

### Backend Components

#### 1. **Stripe Backend API** (`server/stripe-backend-api.ts`)

**Features:**
- Hardened webhook signature verification using raw request body
- Idempotency tracking with `processed_events.json`
- FBT metadata flag for EV products (`fbt_exempt: true`)
- Order Bump logic for Bio Suite upsell
- Neural Recon Priority Queue triggers

**Key Functions:**

```typescript
// Create checkout session with order bump logic
POST /api/checkout-session
{
  tier: "pro",
  includeOrderBump: true,
  customerEmail: "customer@example.com"
}

// Stripe webhook handler with signature verification
POST /api/webhooks/stripe
Headers: stripe-signature: t=<timestamp>,v1=<signature>
```

**Product Configuration:**

```typescript
const PRODUCTS = {
  starter: { price_id: "price_starter", amount: 3900, tier: "starter" },
  growth: { price_id: "price_growth", amount: 7900, tier: "growth" },
  pro: { price_id: "price_pro", amount: 12900, tier: "pro" },
  elite: { price_id: "price_elite", amount: 29900, tier: "elite" },
  enterprise: { price_id: "price_enterprise", amount: 39000, tier: "enterprise" },
  vault: { price_id: "price_vault", amount: 250000, tier: "vault" },
  bioSuite: { price_id: "price_bio_suite", amount: 2900, fbt_exempt: true }
};
```

**Security:**
- Raw request body verification for webhook signatures
- Idempotency validation against `processed_events.json`
- Duplicate event detection and logging
- FBT compliance metadata for EV products

---

### Frontend Components

#### 1. **Launch Sentry** (`client/src/components/LaunchSentry.tsx`)

**Purpose:** Real-time sales dashboard with live transaction ticker

**Features:**
- WebSocket connection to Hetzner Controller
- Real-time sales event streaming
- Statistics: Total Revenue, Transaction Count, Average Order Value
- Live transaction ticker (last 20 transactions)
- Neural Recon alert integration
- Connection status indicator

**Metrics Displayed:**
```
- Total Revenue: Cumulative AUD amount
- Transactions: Count of completed transactions
- Average Order Value: Mean transaction amount
- WS Status: Connection state (LIVE/OFFLINE)
```

**Event Types:**
- `checkout_completed`: Standard transaction
- `payment_succeeded`: Payment confirmation
- `neural_recon_alert`: High-value transaction ($2,500+)

---

#### 2. **Neural Recon Priority Queue** (`client/src/components/NeuralReconPriorityQueue.tsx`)

**Purpose:** High-value transaction detection with sensory alerts

**Features:**
- Monitors for transactions ≥ $2,500 AUD (250000 cents)
- Full-screen overlay alert with visual emphasis
- CSS pulse animation for sensory feedback
- Haptic vibration (if device supports)
- Audio notification (1kHz sine wave, 500ms duration)
- Alert history tracking (last 20 alerts)
- Console logging with visual emphasis

**Alert Trigger:**
```
🚨 NEURAL RECON PRIORITY QUEUE ACTIVATED 🚨
═══════════════════════════════════════════════════
VAULT TIER PAYMENT DETECTED
Amount: $2,500.00 AUD
Tier: VAULT
Session: <session_id>
Timestamp: <timestamp>
═══════════════════════════════════════════════════
```

**Sensory Feedback:**
- CSS pulse animation (2s cycle)
- Haptic pattern: [200, 100, 200, 100, 500] ms
- Audio tone: 1kHz sine wave, 500ms duration
- Alert duration: 8 seconds

---

#### 3. **Order Bump Component** (`client/src/components/OrderBump.tsx`)

**Purpose:** Pre-checkout upsell for Bio Suite add-on

**Features:**
- Toggle checkbox for Bio Suite inclusion
- Dynamic pricing calculation
- 15% bundle discount when both products selected
- Feature comparison table
- FBT compliance notice
- Checkout button with loading state

**Pricing Logic:**
```
Base Price: Selected tier amount
Bio Suite: $29 AUD (2900 cents)
Bundle Discount: 15% off Bio Suite when both selected
Total: Base + Bio Suite - Discount

Example (Pro tier):
- Pro Bundle: $129 AUD
- Bio Suite: $29 AUD
- Discount (15%): -$4.35 AUD
- Total: $153.65 AUD
```

**Features Included in Bio Suite:**
- Advanced Analytics
- Priority Support
- Custom Integrations
- API Access

---

#### 4. **WebSocket Service** (`client/src/services/websocket-service.ts`)

**Purpose:** Real-time connection to Hetzner Controller for sales pings

**Configuration:**
```typescript
interface WebSocketConfig {
  url: string;                    // Default: ws://91.99.162.243:3001
  reconnectInterval: number;      // Default: 5000ms
  maxReconnectAttempts: number;   // Default: 10
  heartbeatInterval: number;      // Default: 30000ms
}
```

**Connection Lifecycle:**
1. Connect to WebSocket server
2. Send heartbeat every 30 seconds
3. Listen for sales events and high-value transactions
4. Auto-reconnect on disconnect (max 10 attempts)
5. Emit custom events for React components

**Event Types:**
- `connected`: WebSocket connection established
- `disconnected`: WebSocket connection closed
- `sales_event`: Standard transaction received
- `high_value_transaction`: $2,500+ transaction detected
- `heartbeat_ack`: Server heartbeat acknowledgment

**Production Deployment:**
```
Development: ws://91.99.162.243:3001
Production: wss://91.99.162.243:3001 (with SSL certificate)

Configure via environment variable:
REACT_APP_WEBSOCKET_URL=wss://91.99.162.243:3001
```

---

#### 5. **Control Console Page** (`client/src/pages/ControlConsole.tsx`)

**Purpose:** Consolidated dashboard for all Revenue Forge features

**Tabs:**
1. **Dashboard**: Launch Sentry real-time ticker
2. **Checkout**: Product tier selection + Order Bump
3. **Neural Recon**: High-value transaction alerts
4. **Settings**: Configuration and status

**Product Tiers:**
```
Starter:    $39 AUD (3900 cents)
Growth:     $79 AUD (7900 cents)
Pro:        $129 AUD (12900 cents)
Elite:      $299 AUD (29900 cents)
Enterprise: $390 AUD (39000 cents)
Vault:      $2,500 AUD (250000 cents)
```

---

## 🔐 SECURITY IMPLEMENTATION

### Stripe Webhook Verification

**Raw Body Verification:**
```typescript
// Middleware captures raw request body
app.use(rawBodyMiddleware);

// Webhook handler verifies signature
const event = stripe.webhooks.constructEvent(
  rawBody,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

**Environment Variables Required:**
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ELITE=price_...
STRIPE_PRICE_ENTERPRISE=price_...
STRIPE_PRICE_VAULT=price_...
STRIPE_PRICE_BIO_SUITE=price_...
WEBSOCKET_URL=ws://91.99.162.243:3001
```

### Idempotency Tracking

**File:** `processed_events.json`

```json
[
  "evt_1234567890abcdef",
  "evt_0987654321fedcba",
  ...
]
```

**Logic:**
1. Receive webhook event
2. Check if event ID in `processed_events.json`
3. If duplicate: log and return success (idempotent)
4. If new: process event and add to file

### FBT Compliance

**Metadata Flag:**
```typescript
metadata: {
  tier: "addon",
  product_type: "bio_suite",
  fbt_exempt: "true"  // EV product exemption
}
```

---

## 🎨 DESIGN SYSTEM

### Colors
- **Background**: Pure Black (#000000)
- **Accent**: Metallic Gold (#D4AF37)
- **Text**: Off-White (#F5F5F5)
- **Alert**: Red (#EF4444)
- **Success**: Green (#22C55E)

### Typography
- **Headings**: Orbitron (Uppercase, 0.05em letter-spacing)
- **Body**: Rajdhani (Regular weight)

### Geometry
- **Border Radius**: 0px (Industrial aesthetic)
- **Borders**: 2-4px solid
- **Spacing**: 4px, 8px, 16px, 24px, 32px

---

## 🚀 DEPLOYMENT

### Prerequisites
1. Stripe Live Mode account with products configured
2. Hetzner Controller node running at 91.99.162.243:3001
3. Environment variables configured
4. SSL certificate for production WebSocket (wss://)

### Environment Setup

```bash
# Backend
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ELITE=price_...
STRIPE_PRICE_ENTERPRISE=price_...
STRIPE_PRICE_VAULT=price_...
STRIPE_PRICE_BIO_SUITE=price_...
WEBSOCKET_URL=ws://91.99.162.243:3001
FRONTEND_URL=https://yourdomain.com

# Frontend
REACT_APP_WEBSOCKET_URL=ws://91.99.162.243:3001
```

### Build & Deploy

```bash
# Build
pnpm run build

# Deploy
# Copy dist/ to your hosting provider
# Configure environment variables
# Start server: node dist/index.js
```

---

## 📊 MONITORING & LOGGING

### Console Logs

**Launch Sentry:**
```
✓ Launch Sentry connected to Hetzner Controller
📊 Sales Event: checkout_completed
   Amount: $129.00 AUD
   Tier: pro
```

**Neural Recon:**
```
🚨 NEURAL RECON PRIORITY QUEUE ACTIVATED 🚨
═══════════════════════════════════════════════════
VAULT TIER PAYMENT DETECTED
Amount: $2,500.00 AUD
Tier: VAULT
Session: cs_live_...
Timestamp: 2026-02-06T21:30:45.123Z
═══════════════════════════════════════════════════
```

### Log Files

**Backend:**
- `processed_events.json`: Idempotency tracking
- `neural_recon.log`: High-value transaction alerts

**Frontend:**
- Browser console: Real-time events
- Network tab: WebSocket messages

---

## 🧪 TESTING

### Manual Testing Checklist

- [ ] WebSocket connects to Hetzner Controller
- [ ] Launch Sentry displays real-time transactions
- [ ] Neural Recon triggers for $2,500+ transactions
- [ ] Order Bump checkbox toggles correctly
- [ ] Bundle discount calculates correctly
- [ ] Checkout session creation succeeds
- [ ] Stripe webhook verification works
- [ ] Idempotency prevents duplicate processing
- [ ] FBT metadata included in Bio Suite
- [ ] Reconnection works after disconnect

### Test Transactions

**Stripe Test Mode:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

**High-Value Test:**
- Select Vault tier ($2,500 AUD)
- Add Bio Suite ($29 AUD)
- Proceed to checkout
- Verify Neural Recon alert triggers

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**WebSocket Connection Fails:**
- Check Hetzner Controller is running
- Verify firewall allows WebSocket connections
- Check browser console for connection errors
- Ensure URL is correct (ws:// for dev, wss:// for prod)

**Stripe Webhook Not Triggering:**
- Verify webhook endpoint is publicly accessible
- Check webhook signing secret is correct
- Verify raw body middleware is in place
- Check Stripe dashboard for failed webhook attempts

**Idempotency Errors:**
- Ensure `processed_events.json` is writable
- Check file permissions in deployment
- Verify event IDs are being tracked
- Clear file if corrupted (will reprocess events)

**Neural Recon Not Alerting:**
- Check transaction amount is ≥ $2,500 AUD
- Verify Neural Recon component is mounted
- Check browser console for errors
- Ensure audio/haptic permissions granted

---

## 📝 CHANGELOG

### Version 3.0 (Current)
- ✓ Launch Sentry real-time ticker
- ✓ Neural Recon Priority Queue
- ✓ Order Bump upsell logic
- ✓ Hardened Stripe webhook verification
- ✓ WebSocket integration to Hetzner Controller
- ✓ FBT compliance metadata
- ✓ Industrial aesthetic design system

---

## 🎯 NEXT STEPS

1. **Configure Stripe Products**: Set up all 6 product tiers in Stripe Live Mode
2. **Deploy Hetzner Controller**: Ensure WebSocket server is running
3. **Set Environment Variables**: Configure all required secrets
4. **Test Webhook**: Verify Stripe webhook delivery
5. **Monitor Transactions**: Watch Launch Sentry for real-time sales
6. **Scale Infrastructure**: Add load balancing as transaction volume increases

---

**Built with ETHINX Revenue Forge • Powered by Stripe + Hetzner • Industrial Aesthetic**
