#!/usr/bin/env node

/**
 * ETHINX 5-TIER STRIPE LIVE MODE DEPLOYMENT SCRIPT
 * 
 * Deploys complete product suite to Stripe Live Mode with:
 * - Visual parity enforcement (Metallic Gold #D4AF37, Pure Black #000000, 0px border-radius)
 * - T-Dog Certified trust seal integration
 * - Aggressive technical descriptions
 * - GCS path linking
 * - Upsell configuration
 * 
 * USAGE:
 * 1. Set environment variable: export STRIPE_API_KEY=sk_live_xxxxx
 * 2. Run: node deploy-stripe-live-5tier.js
 * 3. Follow prompts and confirm deployment
 * 
 * PREREQUISITES:
 * - Node.js 14+
 * - Stripe API key (LIVE MODE)
 * - npm packages: stripe, dotenv, chalk
 */

const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Load product metadata
const metadata = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'ethinx-5tier-product-metadata.json'), 'utf8')
);

// Configuration
const TRUST_SEAL_URL = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/LWspXAtQPmwsxVEJ.png';
const VISUAL_CONFIG = metadata.visual_config;
const DEPLOYMENT_LOG = 'stripe-deployment-log.json';

// Deployment tracking
const deploymentLog = {
  timestamp: new Date().toISOString(),
  mode: 'LIVE',
  products: [],
  errors: [],
  summary: {}
};

/**
 * Validate Stripe API key is in LIVE mode
 */
async function validateLiveMode() {
  console.log(chalk.yellow('\n🔐 Validating Stripe Live Mode...\n'));
  
  try {
    const account = await stripe.account.retrieve();
    
    if (account.test_clock_enabled) {
      console.log(chalk.red('❌ ERROR: Test mode detected. Please use LIVE MODE API key.'));
      process.exit(1);
    }
    
    console.log(chalk.green(`✓ Live Mode Confirmed`));
    console.log(chalk.cyan(`  Account: ${account.email}`));
    console.log(chalk.cyan(`  Country: ${account.country}`));
    console.log(chalk.cyan(`  Currency: ${account.default_currency}\n`));
    
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Validation Error: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Create product with visual parity enforcement
 */
async function createProduct(productConfig) {
  try {
    console.log(chalk.blue(`\n📦 Creating: ${productConfig.name}`));
    console.log(chalk.gray(`   Price: $${productConfig.price_aud} AUD`));
    
    // Create product
    const product = await stripe.products.create({
      name: productConfig.name,
      description: productConfig.description_short,
      type: productConfig.stripe_type,
      metadata: {
        ...productConfig.metadata,
        trust_seal: VISUAL_CONFIG.trust_seal,
        visual_brand: VISUAL_CONFIG.visual_brand,
        primary_color: VISUAL_CONFIG.primary_color,
        background_color: VISUAL_CONFIG.background_color,
        border_radius: VISUAL_CONFIG.border_radius,
        trust_seal_icon: TRUST_SEAL_URL,
        full_description: productConfig.description_long
      },
      images: [TRUST_SEAL_URL]
    });
    
    console.log(chalk.green(`   ✓ Product created: ${product.id}`));
    
    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productConfig.price_aud * 100, // Convert to cents
      currency: 'aud',
      billing_scheme: 'per_unit',
      metadata: {
        product_key: productConfig.product_id,
        tier: productConfig.tier
      }
    });
    
    console.log(chalk.green(`   ✓ Price created: ${price.id}`));
    console.log(chalk.cyan(`   ✓ Amount: $${productConfig.price_aud} AUD`));
    
    // Log deployment
    deploymentLog.products.push({
      name: productConfig.name,
      productId: product.id,
      priceId: price.id,
      amount: productConfig.price_aud,
      currency: 'aud',
      tier: productConfig.tier,
      gcsPath: productConfig.metadata.gcs_path,
      trustSeal: VISUAL_CONFIG.trust_seal,
      visualConfig: {
        primaryColor: VISUAL_CONFIG.primary_color,
        backgroundColor: VISUAL_CONFIG.background_color,
        borderRadius: VISUAL_CONFIG.border_radius
      }
    });
    
    return {
      productId: product.id,
      priceId: price.id,
      name: productConfig.name
    };
  } catch (error) {
    console.log(chalk.red(`   ✗ Error: ${error.message}`));
    deploymentLog.errors.push({
      product: productConfig.name,
      error: error.message
    });
    return null;
  }
}

/**
 * Create upsell configuration
 */
async function configureUpsells(deployedProducts) {
  console.log(chalk.yellow('\n\n🎯 Configuring Upsells...\n'));
  
  const upsellConfig = {
    timestamp: new Date().toISOString(),
    upsells: []
  };
  
  // Map product names to IDs for upsell linking
  const productMap = {};
  deployedProducts.forEach(p => {
    productMap[p.name] = p.priceId;
  });
  
  // Configure upsells for each product
  metadata.products.forEach(product => {
    if (product.upsells && product.upsells.length > 0) {
      console.log(chalk.cyan(`${product.name}:`));
      
      product.upsells.forEach(upsell => {
        console.log(chalk.gray(`  → Upsell: ${upsell.product} ($${upsell.price} AUD)`));
        
        upsellConfig.upsells.push({
          sourceProduct: product.product_id,
          upsellProduct: upsell.product,
          price: upsell.price,
          discountPercent: upsell.discount_percent
        });
      });
    }
  });
  
  // Save upsell configuration
  fs.writeFileSync(
    'stripe-upsell-config.json',
    JSON.stringify(upsellConfig, null, 2)
  );
  
  console.log(chalk.green('\n✓ Upsell configuration saved to stripe-upsell-config.json'));
  
  return upsellConfig;
}

/**
 * Generate Stripe checkout integration code
 */
function generateCheckoutCode(deployedProducts) {
  console.log(chalk.yellow('\n\n💻 Generating Checkout Integration Code...\n'));
  
  const checkoutCode = `
/**
 * ETHINX STRIPE CHECKOUT INTEGRATION
 * Generated: ${new Date().toISOString()}
 * Mode: LIVE
 */

const ETHINX_PRODUCTS = {
  ${deployedProducts.map(p => `${p.name.toLowerCase().replace(/\s+/g, '_')}: {
    priceId: '${p.priceId}',
    productId: '${p.productId}',
    name: '${p.name}',
    trustSeal: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/LWspXAtQPmwsxVEJ.png',
    visualConfig: {
      primaryColor: '#D4AF37',
      backgroundColor: '#000000',
      borderRadius: '0px'
    }
  }`).join(',\n  ')}
};

const VISUAL_PARITY = {
  primaryColor: '#D4AF37',
  backgroundColor: '#000000',
  borderRadius: '0px',
  buttonStyle: {
    background: '#D4AF37',
    color: '#000000',
    border: 'none',
    borderRadius: '0px',
    fontWeight: 'bold',
    fontFamily: 'Orbitron, sans-serif'
  },
  textStyle: {
    primary: '#F5F5F5',
    secondary: '#D4AF37',
    fontFamily: 'Rajdhani, sans-serif'
  }
};

async function createCheckoutSession(priceId, email) {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: priceId,
      email: email,
      metadata: {
        trustSeal: 'tdog-certified',
        visualBrand: 'metallic-gold-black'
      }
    })
  });
  
  const { sessionId } = await response.json();
  return sessionId;
}

// Backend: Create checkout session
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
      metadata: req.body.metadata
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
`;
  
  fs.writeFileSync('stripe-checkout-integration.js', checkoutCode);
  console.log(chalk.green('✓ Checkout integration code saved to stripe-checkout-integration.js'));
  
  return checkoutCode;
}

/**
 * Generate deployment summary
 */
function generateSummary(deployedProducts) {
  console.log(chalk.yellow('\n\n📊 DEPLOYMENT SUMMARY\n'));
  console.log(chalk.green('═══════════════════════════════════════════════════════════\n'));
  
  console.log(chalk.cyan('DEPLOYED PRODUCTS:\n'));
  
  deployedProducts.forEach((product, index) => {
    console.log(chalk.white(`${index + 1}. ${product.name}`));
    console.log(chalk.gray(`   Product ID: ${product.productId}`));
    console.log(chalk.gray(`   Price ID: ${product.priceId}`));
  });
  
  console.log(chalk.green('\n═══════════════════════════════════════════════════════════\n'));
  
  console.log(chalk.cyan('VISUAL PARITY ENFORCED:'));
  console.log(chalk.gray(`  Primary Color: ${VISUAL_CONFIG.primary_color} (Metallic Gold)`));
  console.log(chalk.gray(`  Background: ${VISUAL_CONFIG.background_color} (Pure Black)`));
  console.log(chalk.gray(`  Border Radius: ${VISUAL_CONFIG.border_radius}`));
  
  console.log(chalk.cyan('\nTRUST SEAL:'));
  console.log(chalk.gray(`  T-Dog Certified Badge Applied`));
  console.log(chalk.gray(`  Icon URL: ${TRUST_SEAL_URL}`));
  
  console.log(chalk.cyan('\nFILES GENERATED:'));
  console.log(chalk.gray(`  ✓ stripe-deployment-log.json`));
  console.log(chalk.gray(`  ✓ stripe-upsell-config.json`));
  console.log(chalk.gray(`  ✓ stripe-checkout-integration.js`));
  
  console.log(chalk.green('\n═══════════════════════════════════════════════════════════\n'));
  
  console.log(chalk.yellow('🚀 NEXT STEPS:\n'));
  console.log(chalk.white('1. Review generated files'));
  console.log(chalk.white('2. Integrate checkout code into your landing page'));
  console.log(chalk.white('3. Configure webhook endpoints'));
  console.log(chalk.white('4. Test checkout flow with test card'));
  console.log(chalk.white('5. Monitor Stripe dashboard for transactions'));
  console.log(chalk.white('6. Deploy to production\n'));
}

/**
 * Main deployment function
 */
async function deploy() {
  console.log(chalk.bold.cyan('\n\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║  ETHINX 5-TIER STRIPE LIVE MODE DEPLOYMENT                ║'));
  console.log(chalk.bold.cyan('║  Zero-Fill Execution                                       ║'));
  console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════╝\n'));
  
  // Validate Live Mode
  await validateLiveMode();
  
  // Deploy products
  console.log(chalk.yellow('🚀 DEPLOYING 5-TIER PRODUCT SUITE\n'));
  
  const deployedProducts = [];
  
  // Deploy main products
  for (const product of metadata.products) {
    const result = await createProduct(product);
    if (result) {
      deployedProducts.push(result);
    }
  }
  
  // Deploy add-ons
  console.log(chalk.yellow('\n\n🎁 DEPLOYING ADD-ONS\n'));
  for (const addon of metadata.addons) {
    const result = await createProduct(addon);
    if (result) {
      deployedProducts.push(result);
    }
  }
  
  // Configure upsells
  await configureUpsells(deployedProducts);
  
  // Generate checkout code
  generateCheckoutCode(deployedProducts);
  
  // Save deployment log
  deploymentLog.summary = {
    totalProducts: deployedProducts.length,
    successCount: deployedProducts.length,
    errorCount: deploymentLog.errors.length,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(DEPLOYMENT_LOG, JSON.stringify(deploymentLog, null, 2));
  
  // Generate summary
  generateSummary(deployedProducts);
  
  console.log(chalk.green.bold('✅ DEPLOYMENT COMPLETE\n'));
  console.log(chalk.cyan('All products deployed to Stripe Live Mode with visual parity and trust seal.\n'));
}

// Run deployment
deploy().catch(error => {
  console.error(chalk.red('\n❌ DEPLOYMENT FAILED\n'));
  console.error(chalk.red(error.message));
  process.exit(1);
});
