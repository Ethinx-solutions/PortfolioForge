# ETHINX STRIPE DEPLOYMENT GUIDE
## Complete Integration & Product Catalog Deployment

---

## 🚀 DEPLOYMENT OVERVIEW

This guide walks you through deploying the complete ETHINX product suite to Stripe, including:

1. **Neural Recon Strike** ($2,500 AUD) - Premium execution layer
2. **Digital Originals Tier** ($39-$129 AUD) - Brand asset libraries
3. **Add-ons** ($25-$29 AUD) - One-click upsells

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] Stripe account created and verified
- [ ] Stripe API key obtained (live or test mode)
- [ ] Node.js installed locally
- [ ] `stripe` npm package installed
- [ ] STRIPE_API_KEY environment variable set
- [ ] Webhook endpoint configured (for payment confirmations)
- [ ] Email notifications configured
- [ ] Tax rates configured for AUD

---

## 🔑 STEP 1: SET UP STRIPE API KEY

### Option A: Using Environment Variables (Recommended)

```bash
# On macOS/Linux
export STRIPE_API_KEY=sk_live_your_actual_key_here

# On Windows (PowerShell)
$env:STRIPE_API_KEY="sk_live_your_actual_key_here"

# Verify it's set
echo $STRIPE_API_KEY
```

### Option B: Using .env File

Create `.env` file in project root:
```
STRIPE_API_KEY=sk_live_your_actual_key_here
```

Then load in your script:
```javascript
require('dotenv').config();
```

---

## 📦 STEP 2: INSTALL DEPENDENCIES

```bash
# Install Stripe CLI (for testing webhooks)
brew install stripe/stripe-cli/stripe

# Install Node Stripe package
npm install stripe

# Verify installation
npm list stripe
```

---

## 🎯 STEP 3: DEPLOY PRODUCTS TO STRIPE

### Option A: Using Deployment Script

```bash
# Run the deployment script
node stripe-deploy-ethinx-products.js
```

**Expected Output:**
```
🚀 ETHINX STRIPE PRODUCT DEPLOYMENT
====================================

📦 Creating: Neural Recon Strike...
   ✓ Product created: prod_XXXXX
   ✓ Price created: price_XXXXX
   ✓ Amount: 2500 AUD

📦 Creating: Digital Originals Starter...
   ✓ Product created: prod_XXXXX
   ✓ Price created: price_XXXXX
   ✓ Amount: 39 AUD

[... more products ...]

✅ DEPLOYMENT COMPLETE
====================================
```

### Option B: Manual Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products** → **Add Product**
3. For each product:
   - Enter name and description
   - Set type (Service or Good)
   - Add pricing (AUD currency)
   - Add metadata
   - Save

---

## 🔗 STEP 4: CONFIGURE CHECKOUT

### Create Checkout Session (Backend)

```javascript
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.priceId, // From deployed products
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://www.ethinx.solutions/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.ethinx.solutions/cancel',
      customer_email: req.body.email,
      metadata: {
        product_name: req.body.productName,
        customer_id: req.body.customerId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Frontend Integration (React)

```javascript
import { loadStripe } from '@stripe/js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

async function handleCheckout(priceId, productName) {
  const stripe = await stripePromise;

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: priceId,
      productName: productName,
      email: userEmail,
      customerId: userId,
    }),
  });

  const { sessionId } = await response.json();

  const result = await stripe.redirectToCheckout({ sessionId });

  if (result.error) {
    console.error(result.error.message);
  }
}
```

---

## 🪝 STEP 5: CONFIGURE WEBHOOKS

### Create Webhook Endpoint

```bash
# Listen for Stripe events locally (for testing)
stripe listen --forward-to localhost:3000/webhook
```

### Handle Webhook Events

```javascript
const express = require('express');
const app = express();

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful payment
      console.log('Payment successful:', session.id);
      // Send confirmation email
      // Grant product access
      // Update user database
      break;

    case 'payment_intent.payment_failed':
      // Handle failed payment
      console.log('Payment failed');
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({received: true});
});
```

---

## 📧 STEP 6: CONFIGURE EMAIL NOTIFICATIONS

### Stripe Email Settings

1. Go to **Settings** → **Email Settings**
2. Configure:
   - Receipt emails (enable)
   - Customer emails (enable)
   - Custom branding (ETHINX logo)
   - Email templates

### Custom Email Template

```html
<h1>Welcome to ETHINX</h1>
<p>Thank you for your purchase!</p>

<h2>Your Order</h2>
<p>Product: {{product_name}}</p>
<p>Amount: {{amount}} {{currency}}</p>
<p>Order ID: {{order_id}}</p>

<h2>Next Steps</h2>
<p>Your access will be granted immediately.</p>
<p><a href="https://www.ethinx.solutions/dashboard">Go to Dashboard</a></p>

<p>Questions? Contact us at support@ethinx.solutions</p>
```

---

## 💰 STEP 7: CONFIGURE TAX RATES

### Set Up AUD Tax Rates

```bash
# Create tax rate for AUD (if applicable)
# Go to Settings → Tax Rates → Add Tax Rate
# Name: Australia GST
# Tax Rate: 10%
# Country: AU
```

---

## 🧪 STEP 8: TEST CHECKOUT FLOW

### Test Card Numbers

```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
Amex: 3782 822463 10005
```

### Test Expiry & CVC
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

### Test Payment Flow

1. Navigate to checkout page
2. Enter test card number
3. Complete payment
4. Verify success page loads
5. Check Stripe Dashboard for transaction
6. Verify webhook event received
7. Confirm email sent

---

## 🎯 STEP 9: CONFIGURE UPSELL SEQUENCES

### Recommended Upsell Flow

**After Neural Recon Strike Purchase:**
1. Show success page with Digital Originals Professional offer
2. Send email with Bio Suite offer
3. Follow up with 3-Hour Rush offer

### Implementation (Stripe Billing)

```javascript
// After successful payment, redirect to upsell
const upsellPage = (productPurchased) => {
  const upsells = {
    'neural-recon-strike': [
      { product: 'digital-originals-professional', discount: '10%' },
      { product: 'bio-suite', discount: '15%' },
    ],
    'digital-originals-starter': [
      { product: 'neural-recon-strike', discount: '5%' },
      { product: 'bio-suite', discount: '20%' },
    ],
  };

  return upsells[productPurchased] || [];
};
```

---

## 📊 STEP 10: MONITOR & OPTIMIZE

### Key Metrics to Track

- **Conversion Rate** - % of visitors who purchase
- **Average Order Value** - Total revenue / number of orders
- **Upsell Rate** - % of customers who buy add-ons
- **Refund Rate** - % of orders refunded
- **Customer Acquisition Cost** - Marketing spend / new customers
- **Lifetime Value** - Total revenue per customer

### Stripe Analytics Dashboard

1. Go to **Analytics** → **Transactions**
2. View:
   - Revenue by product
   - Payment success rate
   - Top products
   - Customer trends
   - Geographic data

### Optimization Strategies

- **A/B Test** checkout page copy
- **Adjust Pricing** based on conversion rates
- **Optimize Upsells** based on acceptance rates
- **Improve Copy** based on abandonment rates
- **Add Trust Signals** (guarantees, testimonials)
- **Reduce Friction** (fewer form fields, faster checkout)

---

## 🔐 SECURITY CHECKLIST

- [ ] Use HTTPS only
- [ ] Never log API keys
- [ ] Rotate API keys regularly
- [ ] Use webhook signing verification
- [ ] Validate all user input
- [ ] Store customer data securely
- [ ] Comply with PCI DSS
- [ ] Enable 2FA on Stripe account
- [ ] Monitor for suspicious activity
- [ ] Test security regularly

---

## 🚨 TROUBLESHOOTING

### Issue: "Invalid API Key"
**Solution:** Verify STRIPE_API_KEY environment variable is set correctly

### Issue: "Product not found"
**Solution:** Check product ID matches exactly (case-sensitive)

### Issue: "Webhook not received"
**Solution:** Verify webhook endpoint is publicly accessible and webhook secret is correct

### Issue: "Payment declined"
**Solution:** Check card details, verify currency, check fraud detection settings

### Issue: "Customer email not received"
**Solution:** Check email settings in Stripe Dashboard, verify email address is correct

---

## 📞 SUPPORT

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **ETHINX Support:** support@ethinx.solutions

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Stripe account created and verified
- [ ] API key configured
- [ ] Products created in Stripe
- [ ] Pricing configured (AUD)
- [ ] Checkout integration implemented
- [ ] Webhooks configured
- [ ] Email notifications set up
- [ ] Tax rates configured
- [ ] Test checkout flow completed
- [ ] Upsell sequences configured
- [ ] Analytics dashboard set up
- [ ] Security checklist completed
- [ ] Monitoring and optimization plan in place
- [ ] Go live!

---

**ETHINX Stripe deployment is complete. Monitor performance and optimize based on data. 🚀**
