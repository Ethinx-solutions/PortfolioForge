# ETHINX 5-TIER STRIPE DEPLOYMENT EXECUTION GUIDE

## Zero-Fill Deployment Instructions

This guide provides step-by-step instructions for deploying the complete ETHINX 5-tier product suite to Stripe Live Mode with visual parity enforcement and T-Dog trust seal integration.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] Stripe account created and verified
- [ ] Stripe API key obtained (LIVE MODE - starts with `sk_live_`)
- [ ] Google Cloud Platform project created
- [ ] GCP service account key downloaded
- [ ] Node.js 14+ installed
- [ ] Google Cloud SDK (`gcloud` CLI) installed
- [ ] All required npm packages installed

---

## 🚀 DEPLOYMENT WORKFLOW

### PHASE 1: ENVIRONMENT SETUP

#### Step 1.1: Install Dependencies

```bash
# Install Node.js packages
npm install stripe dotenv chalk @google-cloud/storage

# Verify installations
npm list stripe dotenv chalk @google-cloud/storage
```

#### Step 1.2: Set Environment Variables

```bash
# For Stripe Live Mode
export STRIPE_API_KEY=sk_live_your_actual_live_key_here

# For Google Cloud
export GCP_PROJECT_ID=your-gcp-project-id
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Verify
echo $STRIPE_API_KEY
echo $GCP_PROJECT_ID
```

#### Step 1.3: Authenticate with Google Cloud

```bash
# Login to GCP
gcloud auth login

# Set project
gcloud config set project $GCP_PROJECT_ID

# Verify
gcloud config list
```

---

### PHASE 2: GCS BUCKET SETUP

#### Step 2.1: Create GCS Bucket

```bash
# Make script executable
chmod +x setup-gcs-ethinx-vault.sh

# Run setup script
./setup-gcs-ethinx-vault.sh
```

**Expected Output:**
```
✓ gcloud CLI found
✓ Authenticated
✓ Project: your-project-id
✓ Bucket created: gs://ethinx-data-vault
✓ Region: australia-southeast1 (Sydney)
✓ Versioning enabled
✓ Lifecycle policy configured
✓ CORS policy configured
✓ Created: gs://ethinx-data-vault/Digital_Originals/Starter/
✓ Created: gs://ethinx-data-vault/Digital_Originals/Professional/
✓ Created: gs://ethinx-data-vault/Digital_Originals/Ultimate/
✓ Created: gs://ethinx-data-vault/Spark_Enhanced/
✓ Created: gs://ethinx-data-vault/Spark_Technical_Baseline/
✓ Created: gs://ethinx-data-vault/Neural_Recon_Strike/
```

#### Step 2.2: Verify Bucket Creation

```bash
# List bucket contents
gsutil ls -r gs://ethinx-data-vault/

# Check bucket configuration
gsutil versioning get gs://ethinx-data-vault/
gsutil lifecycle get gs://ethinx-data-vault/
gsutil cors get gs://ethinx-data-vault/
```

---

### PHASE 3: STRIPE PRODUCT DEPLOYMENT

#### Step 3.1: Deploy to Stripe Live Mode

```bash
# Make script executable
chmod +x deploy-stripe-live-5tier.js

# Run deployment script
node deploy-stripe-live-5tier.js
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════════╗
║  ETHINX 5-TIER STRIPE LIVE MODE DEPLOYMENT                ║
║  Zero-Fill Execution                                       ║
╚════════════════════════════════════════════════════════════╝

🔐 Validating Stripe Live Mode...

✓ Live Mode Confirmed
  Account: your-email@example.com
  Country: AU
  Currency: aud

🚀 DEPLOYING 5-TIER PRODUCT SUITE

📦 Creating: Digital Originals Starter
   Price: $39 AUD
   ✓ Product created: prod_XXXXX
   ✓ Price created: price_XXXXX
   ✓ Amount: $39 AUD

[... more products ...]

📊 DEPLOYMENT SUMMARY

DEPLOYED PRODUCTS:

1. Digital Originals Starter
   Product ID: prod_XXXXX
   Price ID: price_XXXXX

2. Digital Originals Professional
   Product ID: prod_XXXXX
   Price ID: price_XXXXX

[... more products ...]

✅ DEPLOYMENT COMPLETE
```

#### Step 3.2: Verify Stripe Deployment

```bash
# Check Stripe dashboard
# Go to: https://dashboard.stripe.com/products

# Or use Stripe CLI
stripe products list --limit 10
stripe prices list --limit 10
```

---

### PHASE 4: VISUAL PARITY ENFORCEMENT

#### Step 4.1: Review Visual Parity Configuration

```bash
# Review configuration
cat visual-parity-config.json | jq '.color_system'

# Extract CSS template
cat visual-parity-config.json | jq '.css_template.content' -r > ethinx-visual-parity.css

# Extract HTML template
cat visual-parity-config.json | jq '.html_template.content' -r > ethinx-template.html
```

#### Step 4.2: Integrate Visual Parity into Your Project

```bash
# Copy CSS to your project
cp ethinx-visual-parity.css /path/to/your/project/src/styles/

# Copy HTML template
cp ethinx-template.html /path/to/your/project/templates/

# Update your main stylesheet to import
echo '@import "styles/ethinx-visual-parity.css";' >> /path/to/your/project/src/main.css
```

#### Step 4.3: Validate Visual Parity

Use the validation checklist in `visual-parity-config.json`:

- [ ] All primary colors are #D4AF37
- [ ] All backgrounds are #000000
- [ ] All text is #F5F5F5 or #D4AF37
- [ ] All border-radius values are 0px
- [ ] Headings use Orbitron font
- [ ] Body text uses Rajdhani font
- [ ] T-Dog badge appears on checkout
- [ ] All buttons use primary button style

---

### PHASE 5: TRUST SEAL INTEGRATION

#### Step 5.1: Add T-Dog Trust Seal to Checkout

```html
<!-- Add to your checkout page header -->
<div class="trust-seal">
  <img 
    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/LWspXAtQPmwsxVEJ.png"
    alt="T-Dog Certified"
    width="40"
    height="40"
  >
  <span>T-Dog Certified</span>
</div>
```

#### Step 5.2: Add T-Dog Badge to Product Cards

```html
<!-- Add to product card footer -->
<div class="product-footer">
  <img 
    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/LWspXAtQPmwsxVEJ.png"
    alt="T-Dog Certified"
    width="32"
    height="32"
    class="trust-seal-icon"
  >
</div>
```

#### Step 5.3: Add T-Dog Badge to Success Page

```html
<!-- Add to success page -->
<div class="success-container">
  <img 
    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/LWspXAtQPmwsxVEJ.png"
    alt="T-Dog Certified"
    width="64"
    height="64"
    class="trust-seal-hero"
  >
  <h1>Welcome to ETHINX</h1>
  <p>You're now T-Dog Certified</p>
</div>
```

---

### PHASE 6: CHECKOUT INTEGRATION

#### Step 6.1: Integrate Stripe Checkout

```bash
# Copy checkout integration code
cp stripe-checkout-integration.js /path/to/your/project/src/
```

#### Step 6.2: Update Your Backend

```javascript
// In your backend (Node.js/Express)
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: 'https://www.ethinx.solutions/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.ethinx.solutions/cancel',
      customer_email: req.body.email,
      metadata: {
        trustSeal: 'tdog-certified',
        visualBrand: 'metallic-gold-black'
      }
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Step 6.3: Update Your Frontend

```javascript
// In your frontend (React/Vue/etc)
import { loadStripe } from '@stripe/js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

async function handleCheckout(priceId, email) {
  const stripe = await stripePromise;
  
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: priceId,
      email: email
    })
  });
  
  const { sessionId } = await response.json();
  
  const result = await stripe.redirectToCheckout({ sessionId });
  
  if (result.error) {
    console.error(result.error.message);
  }
}
```

---

### PHASE 7: TESTING & VALIDATION

#### Step 7.1: Test Checkout Flow

1. Navigate to your landing page
2. Click a product CTA button
3. Verify Stripe checkout loads with:
   - [ ] Pure Black background (#000000)
   - [ ] Metallic Gold accents (#D4AF37)
   - [ ] T-Dog Certified badge visible
   - [ ] 0px border-radius on all elements

#### Step 7.2: Test Payment Processing

Use Stripe test card:
- **Card Number:** 4242 4242 4242 4242
- **Expiry:** 12/25
- **CVC:** 123

#### Step 7.3: Verify Success Page

After successful payment:
- [ ] Success page displays
- [ ] T-Dog Certified badge visible
- [ ] Confirmation email sent
- [ ] Stripe dashboard shows transaction

#### Step 7.4: Check Deployment Logs

```bash
# Review deployment log
cat stripe-deployment-log.json | jq '.'

# Review upsell configuration
cat stripe-upsell-config.json | jq '.'
```

---

### PHASE 8: PRODUCTION DEPLOYMENT

#### Step 8.1: Final Validation

- [ ] All products deployed to Stripe Live Mode
- [ ] GCS bucket created in Sydney region
- [ ] Visual parity enforced (colors, fonts, borders)
- [ ] T-Dog trust seal integrated
- [ ] Checkout flow tested
- [ ] Success page verified
- [ ] Email confirmations working
- [ ] Deployment logs saved

#### Step 8.2: Deploy to Production

```bash
# Build your project
npm run build

# Deploy to your hosting provider
npm run deploy

# Verify live site
curl https://www.ethinx.solutions
```

#### Step 8.3: Monitor Performance

```bash
# Monitor Stripe transactions
stripe events list --limit 10

# Check GCS bucket usage
gsutil du -s gs://ethinx-data-vault/

# Monitor error logs
tail -f /var/log/ethinx-errors.log
```

---

## 📊 DEPLOYMENT ARTIFACTS

After successful deployment, you'll have:

1. **Stripe Products & Prices**
   - 6 products (5-tier + add-ons)
   - 6 price IDs (one per product)
   - Live Mode deployment

2. **GCS Bucket**
   - `gs://ethinx-data-vault/` in Sydney region
   - 6 subdirectories for each product tier
   - Versioning and lifecycle policies enabled

3. **Configuration Files**
   - `stripe-deployment-log.json` - Deployment record
   - `stripe-upsell-config.json` - Upsell configuration
   - `stripe-checkout-integration.js` - Checkout code
   - `visual-parity-config.json` - Visual guidelines
   - `ethinx-visual-parity.css` - CSS styles
   - `ethinx-template.html` - HTML template

4. **Integration Code**
   - Backend checkout endpoint
   - Frontend checkout handler
   - T-Dog trust seal integration
   - Visual parity enforcement

---

## 🚨 TROUBLESHOOTING

### Issue: "Invalid API Key"
**Solution:** Verify STRIPE_API_KEY starts with `sk_live_` (not `sk_test_`)

### Issue: "GCS Bucket Already Exists"
**Solution:** Use existing bucket or delete and recreate:
```bash
gsutil rm -r gs://ethinx-data-vault/
```

### Issue: "Checkout Not Loading"
**Solution:** Verify Stripe public key is set in frontend environment

### Issue: "T-Dog Badge Not Showing"
**Solution:** Verify image URL is accessible and CORS is configured

### Issue: "Payment Declined"
**Solution:** Check Stripe dashboard for fraud detection or payment method issues

---

## 📞 SUPPORT

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **GCP Documentation:** https://cloud.google.com/docs
- **ETHINX Support:** support@ethinx.solutions

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Environment variables set
- [ ] GCP authenticated
- [ ] GCS bucket created
- [ ] Stripe products deployed
- [ ] Visual parity enforced
- [ ] T-Dog trust seal integrated
- [ ] Checkout flow tested
- [ ] Success page verified
- [ ] Email confirmations working
- [ ] Deployment logs saved
- [ ] Production deployment complete
- [ ] Performance monitoring active

---

**ETHINX 5-Tier Stripe Deployment is complete. All products are live and ready to generate revenue. 🚀**
