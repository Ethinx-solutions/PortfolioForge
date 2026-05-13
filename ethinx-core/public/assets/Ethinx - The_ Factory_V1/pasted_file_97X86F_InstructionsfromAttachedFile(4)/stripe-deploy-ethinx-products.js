/**
 * ETHINX STRIPE PRODUCT DEPLOYMENT SCRIPT
 * Deploy complete product suite to Stripe
 * 
 * Usage: node stripe-deploy-ethinx-products.js
 * 
 * Prerequisites:
 * - Stripe API key set in STRIPE_API_KEY environment variable
 * - Node.js with stripe package installed
 */

const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const PRODUCTS = {
  // TIER 1: NEURAL RECON STRIKE
  neuralReconStrike: {
    name: 'Neural Recon Strike',
    description: 'The Execution Layer for solo operators. Automated backend decision-intelligence for building $100K+ MRR businesses in 4 weeks.',
    type: 'service',
    metadata: {
      tier: 'premium',
      category: 'founder-tools',
      audience: 'solo-operators',
      outcome: '$100K+ MRR',
      timeline: '4 weeks',
      support_level: 'premium',
      product_id: 'neural-recon-strike-2500'
    },
    images: [
      'https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/cYompxaoZjxqIyhY.png'
    ],
    price: {
      amount: 250000, // $2,500 AUD in cents
      currency: 'aud',
      recurring: null,
      billing_scheme: 'per_unit'
    }
  },

  // TIER 2: DIGITAL ORIGINALS - STARTER
  digitalOriginalsStarter: {
    name: 'Digital Originals Starter',
    description: 'Entry-level professional presence. Essential brand assets for solo founders launching their first digital product.',
    type: 'good',
    metadata: {
      tier: 'starter',
      category: 'brand-assets',
      audience: 'solo-founders',
      setup_time: '2 hours',
      templates_included: '20',
      product_id: 'digital-originals-starter-39'
    },
    price: {
      amount: 3900, // $39 AUD in cents
      currency: 'aud',
      recurring: null,
      billing_scheme: 'per_unit'
    }
  },

  // TIER 2: DIGITAL ORIGINALS - PROFESSIONAL
  digitalOriginalsProfessional: {
    name: 'Digital Originals Professional',
    description: 'Standard brand asset library. Complete professional branding system for scaling founders.',
    type: 'good',
    metadata: {
      tier: 'professional',
      category: 'brand-assets',
      audience: 'scaling-founders',
      setup_time: '4 hours',
      templates_included: '50',
      video_assets: '10',
      product_id: 'digital-originals-professional-79'
    },
    price: {
      amount: 7900, // $79 AUD in cents
      currency: 'aud',
      recurring: null,
      billing_scheme: 'per_unit'
    }
  },

  // TIER 2: DIGITAL ORIGINALS - ULTIMATE
  digitalOriginalsUltimate: {
    name: 'Digital Originals Ultimate',
    description: 'Full-scale high-fidelity deployment kit. Enterprise-grade branding system with custom consultation.',
    type: 'good',
    metadata: {
      tier: 'ultimate',
      category: 'brand-assets',
      audience: 'enterprise-founders',
      setup_time: '8 hours',
      templates_included: '100',
      video_assets: '30',
      consultation_hours: '1',
      support_level: 'priority',
      product_id: 'digital-originals-ultimate-129'
    },
    price: {
      amount: 12900, // $129 AUD in cents
      currency: 'aud',
      recurring: null,
      billing_scheme: 'per_unit'
    }
  },

  // ADD-ON: BIO SUITE
  bioSuite: {
    name: 'Bio Suite',
    description: 'Professional bio system. 10 conversion-optimized bio variations for every platform.',
    type: 'service',
    metadata: {
      category: 'copywriting',
      audience: 'all-founders',
      variations_per_platform: '10',
      platforms_included: '5',
      setup_time: '30 minutes',
      product_id: 'addon-bio-suite-29'
    },
    price: {
      amount: 2900, // $29 AUD in cents
      currency: 'aud',
      recurring: null,
      billing_scheme: 'per_unit'
    }
  },

  // ADD-ON: 3-HOUR RUSH
  threeHourRush: {
    name: '3-Hour Rush',
    description: 'Priority processing and delivery. Get your assets in 3 hours instead of 24.',
    type: 'service',
    metadata: {
      category: 'service-acceleration',
      audience: 'all-founders',
      delivery_time: '3 hours',
      revisions_included: '2',
      support_level: 'priority',
      product_id: 'addon-3hour-rush-25'
    },
    price: {
      amount: 2500, // $25 AUD in cents
      currency: 'aud',
      recurring: null,
      billing_scheme: 'per_unit'
    }
  }
};

async function deployProducts() {
  console.log('🚀 ETHINX STRIPE PRODUCT DEPLOYMENT');
  console.log('====================================\n');

  const deployedProducts = {};

  for (const [key, productConfig] of Object.entries(PRODUCTS)) {
    try {
      console.log(`📦 Creating: ${productConfig.name}...`);

      // Create product
      const product = await stripe.products.create({
        name: productConfig.name,
        description: productConfig.description,
        type: productConfig.type,
        metadata: productConfig.metadata,
        images: productConfig.images || []
      });

      console.log(`   ✓ Product created: ${product.id}`);

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productConfig.price.amount,
        currency: productConfig.price.currency,
        billing_scheme: productConfig.price.billing_scheme,
        metadata: {
          product_key: key
        }
      });

      console.log(`   ✓ Price created: ${price.id}`);
      console.log(`   ✓ Amount: ${productConfig.price.amount / 100} ${productConfig.price.currency.toUpperCase()}\n`);

      deployedProducts[key] = {
        productId: product.id,
        priceId: price.id,
        amount: productConfig.price.amount / 100,
        currency: productConfig.price.currency
      };

    } catch (error) {
      console.error(`   ✗ Error creating ${productConfig.name}:`, error.message);
    }
  }

  // Summary
  console.log('\n====================================');
  console.log('✅ DEPLOYMENT COMPLETE');
  console.log('====================================\n');

  console.log('DEPLOYED PRODUCTS:\n');
  Object.entries(deployedProducts).forEach(([key, data]) => {
    console.log(`${key}:`);
    console.log(`  Product ID: ${data.productId}`);
    console.log(`  Price ID: ${data.priceId}`);
    console.log(`  Amount: ${data.amount} ${data.currency.toUpperCase()}\n`);
  });

  // Save to file for reference
  const fs = require('fs');
  fs.writeFileSync(
    '/home/ubuntu/stripe-deployed-products.json',
    JSON.stringify(deployedProducts, null, 2)
  );

  console.log('📋 Product IDs saved to: stripe-deployed-products.json');
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Configure upsell sequences in Stripe Dashboard');
  console.log('2. Set up webhook integrations');
  console.log('3. Test checkout flow');
  console.log('4. Deploy to production');
  console.log('5. Monitor conversion rates\n');
}

// Run deployment
deployProducts().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
});
