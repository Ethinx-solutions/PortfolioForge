# ETHINX REACT STRIPE CHECKOUT INTEGRATION GUIDE

## Complete Setup for Neural Recon Strike ($2,500 AUD)

This guide provides step-by-step instructions for integrating Stripe checkout into your React application with the industrial aesthetic (0px border-radius, Metallic Gold, Pure Black).

---

## 📋 PRE-INTEGRATION CHECKLIST

- [ ] React project created (Create React App, Vite, or Next.js)

- [ ] Node.js 14+ installed

- [ ] npm or yarn package manager ready

- [ ] Stripe account created and verified

- [ ] Stripe API keys obtained (LIVE MODE)

- [ ] Product deployed to Stripe (from deployment script)

- [ ] Backend API ready (Node.js/Express)

---

## 🚀 STEP-BY-STEP INTEGRATION

### STEP 1: INSTALL DEPENDENCIES

```bash
# Install Stripe React libraries
npm install @stripe/react-stripe-js @stripe/js

# Install other dependencies
npm install react-router-dom axios dotenv

# Optional: Install styling libraries
npm install tailwindcss postcss autoprefixer
```

### STEP 2: ENVIRONMENT SETUP

Create a `.env` file in your project root:

```bash
# Copy template
cp .env.stripe.template .env

# Edit .env with your actual keys
nano .env
```

Fill in your actual keys:

```
# Stripe Public Key (LIVE MODE)
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_actual_key_here

# Backend API URL
REACT_APP_API_URL=http://localhost:3001

# Neural Recon Strike Price ID (from deployment )
REACT_APP_NEURAL_RECON_PRICE_ID=price_XXXXX
```

### STEP 3: CREATE BACKEND API

Set up your Express backend to handle Stripe checkout sessions:

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express stripe dotenv cors

# Copy backend code
cp ../stripe-backend-api.js ./server.js

# Create .env for backend
cat > .env << 'EOF'
STRIPE_SECRET_KEY=sk_live_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PORT=3001
NODE_ENV=development
EOF

# Start backend server
node server.js
```

**Expected output:**

```
╔════════════════════════════════════════════════════════════╗
║  ETHINX STRIPE BACKEND API                                 ║
║  Server running on http://localhost:3001                   ║
╚════════════════════════════════════════════════════════════╝

✓ Stripe API Key: Configured
✓ Webhook Secret: Configured
✓ Success URL: https://www.ethinx.solutions/success?session_id={CHECKOUT_SESSION_ID}
✓ Cancel URL: https://www.ethinx.solutions/cancel
```

### STEP 4: INTEGRATE CHECKOUT COMPONENT

Copy the React component to your project:

```bash
# Copy checkout component
cp StripeCheckoutIntegration.jsx src/components/

# Copy success page
cp SuccessPage.jsx src/pages/
```

### STEP 5: UPDATE YOUR APP.jsx

Add the checkout component and routes:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutIntegration from './components/StripeCheckoutIntegration';
import SuccessPage from './pages/SuccessPage';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY );

function App() {
  return (
    <Router>
      <Routes>
        {/* Checkout page */}
        <Route 
          path="/checkout" 
          element={
            <Elements stripe={stripePromise}>
              <StripeCheckoutIntegration />
            </Elements>
          } 
        />

        {/* Success page */}
        <Route path="/success" element={<SuccessPage />} />

        {/* Cancel page */}
        <Route path="/cancel" element={<CancelPage />} />

        {/* Home page */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### STEP 6: ADD CHECKOUT BUTTON TO LANDING PAGE

Add a button to trigger the checkout:

```jsx
import { useNavigate } from 'react-router-dom';

export function NeuralReconStrikeCard() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: '#000000',
        border: '2px solid #D4AF37',
        borderRadius: '0px',
        padding: '48px',
      }}
    >
      <h2 style={{ color: '#D4AF37', fontFamily: 'Orbitron' }}>
        Neural Recon Strike
      </h2>
      <p style={{ color: '#F5F5F5' }}>
        The Execution Layer for Solo Operators
      </p>
      <p style={{ color: '#D4AF37', fontSize: '32px', fontWeight: 'bold' }}>
        $2,500 AUD
      </p>

      <button
        onClick={() => navigate('/checkout')}
        style={{
          background: '#D4AF37',
          color: '#000000',
          border: 'none',
          borderRadius: '0px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        Get Started
      </button>
    </div>
  );
}
```

### STEP 7: CONFIGURE STRIPE WEBHOOK (PRODUCTION)

For production, configure webhooks to handle payment events:

```bash
# Using Stripe CLI (for local testing)
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Get webhook signing secret
stripe listen --print-secret
```

Add to your `.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_cli
```

### STEP 8: TEST CHECKOUT FLOW

1. **Start backend server:**

   ```bash
   cd backend
   node server.js
   ```

1. **Start React app:**

   ```bash
   npm start
   ```

1. **Navigate to checkout:**
  - Go to [http://localhost:3000/checkout](http://localhost:3000/checkout)
  - Enter your email
  - Click "Proceed to Checkout"

1. **Test payment with Stripe test card:**
  - Card Number: `4242 4242 4242 4242`
  - Expiry: `12/25`
  - CVC: `123`
  - Click "Pay"

1. **Verify success:**
  - Should redirect to success page
  - Should show confirmation details
  - Check backend logs for webhook events

---

## 🎨 CUSTOMIZATION

### Change Colors

Edit `ETHINX_COLORS` in `StripeCheckoutIntegration.jsx`:

```jsx
const ETHINX_COLORS = {
  primary: '#D4AF37',      // Metallic Gold
  background: '#000000',   // Pure Black
  text: '#F5F5F5',        // Off-White
  border: '#D4AF37',      // Metallic Gold borders
};
```

### Change Fonts

Edit `INDUSTRIAL_STYLES`:

```jsx
const INDUSTRIAL_STYLES = {
  borderRadius: '0px',           // Keep at 0px for industrial look
  fontFamily: "'Orbitron', sans-serif",  // Change font family
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
```

### Change Product Details

Edit `STRIPE_CONFIG`:

```jsx
const STRIPE_CONFIG = {
  products: {
    neuralReconStrike: {
      priceId: 'price_XXXXX',  // Your actual price ID
      name: 'Neural Recon Strike',
      amount: 250000,  // Amount in cents
      currency: 'aud',
      description: 'The Execution Layer for Solo Operators'
    }
  }
};
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Never Expose Secret Keys

```jsx
// ❌ WRONG - Never do this
const STRIPE_SECRET = 'sk_live_xxxxx';  // NEVER in frontend!

// ✅ CORRECT - Keep in backend .env only
// Backend .env
STRIPE_SECRET_KEY=sk_live_xxxxx
```

### 2. Use Environment Variables

```jsx
// ✅ CORRECT - Use public key in frontend
const publicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
```

### 3. Validate on Backend

```javascript
// Backend should validate all requests
app.post('/api/create-checkout-session', async (req, res ) => {
  // Validate email
  if (!req.body.email) {
    return res.status(400).json({ error: 'Email required' });
  }

  // Validate price ID
  if (!req.body.priceId) {
    return res.status(400).json({ error: 'Price ID required' });
  }

  // Create session
  // ...
});
```

### 4. Use HTTPS in Production

```bash
# Always use HTTPS for production
SUCCESS_URL=https://www.ethinx.solutions/success
CANCEL_URL=https://www.ethinx.solutions/cancel
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Stripe public key not found"

**Solution:** Check `.env` file:

```bash
# Verify key is set
echo $REACT_APP_STRIPE_PUBLIC_KEY

# Should output: pk_live_xxxxx
```

### Issue: "Failed to create checkout session"

**Solution:** Check backend is running:

```bash
# Verify backend is running
curl http://localhost:3001/health

# Should return: { "status": "ok" }
```

### Issue: "CORS error"

**Solution:** Update CORS in backend:

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://www.ethinx.solutions'],
  credentials: true
} ));
```

### Issue: "Payment declined"

**Solution:** Check Stripe dashboard for fraud detection or use different test card:

- Visa: `4242 4242 4242 4242`

- Mastercard: `5555 5555 5555 4444`

- Amex: `3782 822463 10005`

### Issue: "Webhook not firing"

**Solution:** Verify webhook secret:

```bash
# Get webhook signing secret
stripe listen --print-secret

# Add to .env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 📊 MONITORING & ANALYTICS

### Check Stripe Dashboard

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)

1. Click "Payments" → "Payments"

1. See all transactions

1. Click transaction to see details

### Check Backend Logs

```bash
# Tail backend logs
tail -f backend.log

# Should show:
# [2026-02-05T06:09:07Z] POST /api/create-checkout-session
# Creating checkout session for user@example.com with price price_XXXXX
# Checkout session created: cs_test_XXXXX
```

### Monitor Errors

```bash
# Check for errors
grep "error" backend.log

# Check for failed payments
stripe events list --type charge.failed
```

---

## 🚀 DEPLOYMENT

### Deploy Frontend

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod

# Or deploy to Netlify
netlify deploy --prod
```

### Deploy Backend

```bash
# Deploy to Railway/Render/Heroku
# Update environment variables with production keys

# Test production deployment
curl https://your-production-domain.com/health
```

### Update Environment Variables

```bash
# Production .env
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_production_key
REACT_APP_API_URL=https://your-api-domain.com
SUCCESS_URL=https://www.ethinx.solutions/success
CANCEL_URL=https://www.ethinx.solutions/cancel
```

---

## ✅ PRODUCTION CHECKLIST