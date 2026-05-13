export const documentationSections = {
  overview: {
    title: 'Overview',
    icon: '📖',
    description: 'Complete guide to integrating Stripe checkout into React applications',
    content: []
  },
  
  checklist: {
    title: 'Pre-Integration Checklist',
    icon: '✓',
    description: 'Everything you need before starting',
    content: [
      {
        type: 'heading',
        text: 'Requirements'
      },
      {
        type: 'list',
        items: [
          'React project created (Create React App, Vite, or Next.js)',
          'Node.js 14+ installed',
          'npm or yarn package manager ready',
          'Stripe account created and verified',
          'Stripe API keys obtained (LIVE MODE)',
          'Product deployed to Stripe (from deployment script)',
          'Backend API ready (Node.js/Express)'
        ]
      }
    ]
  },

  installation: {
    title: 'Step 1: Install Dependencies',
    icon: '📦',
    description: 'Install required packages',
    content: [
      {
        type: 'heading',
        text: 'Install Stripe Libraries'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Install Stripe React packages',
        code: `npm install @stripe/react-stripe-js @stripe/js

# Install other dependencies
npm install react-router-dom axios dotenv

# Optional: Install styling libraries
npm install tailwindcss postcss autoprefixer`
      },
      {
        type: 'paragraph',
        text: 'These packages provide React components and utilities for integrating Stripe checkout into your application.'
      }
    ]
  },

  environment: {
    title: 'Step 2: Environment Setup',
    icon: '⚙️',
    description: 'Configure environment variables',
    content: [
      {
        type: 'heading',
        text: 'Create .env File'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Copy template and edit',
        code: `# Copy template
cp .env.stripe.template .env

# Edit with your actual keys
nano .env`
      },
      {
        type: 'heading',
        text: 'Environment Variables'
      },
      {
        type: 'code',
        language: 'bash',
        title: '.env configuration',
        code: `# Stripe Public Key (LIVE MODE)
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_actual_key_here

# Backend API URL
REACT_APP_API_URL=http://localhost:3001

# Neural Recon Strike Price ID (from deployment)
REACT_APP_NEURAL_RECON_PRICE_ID=price_XXXXX`
      },
      {
        type: 'warning',
        text: '⚠️ Never commit .env files to version control. Add .env to .gitignore'
      }
    ]
  },

  backend: {
    title: 'Step 3: Create Backend API',
    icon: '🔧',
    description: 'Set up Express server for Stripe',
    content: [
      {
        type: 'heading',
        text: 'Initialize Backend'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Backend setup',
        code: `# Create backend directory
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
node server.js`
      },
      {
        type: 'tip',
        text: '💡 The backend server should output a startup message confirming all keys are configured'
      }
    ]
  },

  integration: {
    title: 'Step 4: Integrate Components',
    icon: '⚛️',
    description: 'Add checkout components to React',
    content: [
      {
        type: 'heading',
        text: 'Copy Components'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Copy React components',
        code: `# Copy checkout component
cp StripeCheckoutIntegration.jsx src/components/

# Copy success page
cp SuccessPage.jsx src/pages/`
      },
      {
        type: 'heading',
        text: 'Update App.jsx'
      },
      {
        type: 'code',
        language: 'jsx',
        title: 'App.jsx with Stripe integration',
        code: `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutIntegration from './components/StripeCheckoutIntegration';
import SuccessPage from './pages/SuccessPage';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/checkout" 
          element={
            <Elements stripe={stripePromise}>
              <StripeCheckoutIntegration />
            </Elements>
          } 
        />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;`
      }
    ]
  },

  button: {
    title: 'Step 5: Add Checkout Button',
    icon: '🔘',
    description: 'Create CTA button for checkout',
    content: [
      {
        type: 'heading',
        text: 'Neural Recon Strike Card'
      },
      {
        type: 'code',
        language: 'jsx',
        title: 'Checkout button component',
        code: `import { useNavigate } from 'react-router-dom';

export function NeuralReconStrikeCard() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#000000',
      border: '2px solid #D4AF37',
      borderRadius: '0px',
      padding: '48px',
    }}>
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
}`
      }
    ]
  },

  testing: {
    title: 'Step 6: Test Checkout Flow',
    icon: '🧪',
    description: 'Test the complete payment flow',
    content: [
      {
        type: 'heading',
        text: 'Start Services'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal 1: Start backend',
        code: `cd backend
node server.js`
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Terminal 2: Start React app',
        code: `npm start`
      },
      {
        type: 'heading',
        text: 'Test Payment'
      },
      {
        type: 'list',
        items: [
          'Navigate to http://localhost:3000/checkout',
          'Enter your email address',
          'Click "Proceed to Checkout"',
          'Use test card: 4242 4242 4242 4242',
          'Expiry: 12/25, CVC: 123',
          'Click "Pay"',
          'Should redirect to success page'
        ]
      },
      {
        type: 'tip',
        text: '💡 Check backend logs for webhook events and payment confirmation'
      }
    ]
  },

  webhooks: {
    title: 'Step 7: Configure Webhooks',
    icon: '🔗',
    description: 'Handle Stripe payment events',
    content: [
      {
        type: 'heading',
        text: 'Local Testing with Stripe CLI'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Forward webhook events to local server',
        code: `# Install Stripe CLI (if not already installed)
# https://stripe.com/docs/stripe-cli

# Forward events to your local backend
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Get webhook signing secret
stripe listen --print-secret`
      },
      {
        type: 'heading',
        text: 'Add to Backend .env'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Backend .env with webhook secret',
        code: `STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
PORT=3001`
      },
      {
        type: 'warning',
        text: '⚠️ Webhook secret is required for production. Configure in Stripe dashboard under Settings → Webhooks'
      }
    ]
  },

  deployment: {
    title: 'Step 8: Deploy to Production',
    icon: '🚀',
    description: 'Deploy frontend and backend',
    content: [
      {
        type: 'heading',
        text: 'Build Frontend'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Build and deploy React app',
        code: `# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod

# Or deploy to Netlify
netlify deploy --prod`
      },
      {
        type: 'heading',
        text: 'Deploy Backend'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Deploy Node.js backend',
        code: `# Deploy to Railway/Render/Heroku
# Update environment variables with production keys

# Test production deployment
curl https://your-production-domain.com/health`
      },
      {
        type: 'heading',
        text: 'Update Environment Variables'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Production .env',
        code: `REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_production_key
REACT_APP_API_URL=https://your-api-domain.com
SUCCESS_URL=https://www.ethinx.solutions/success
CANCEL_URL=https://www.ethinx.solutions/cancel`
      }
    ]
  },

  security: {
    title: 'Security Best Practices',
    icon: '🔒',
    description: 'Keep your integration secure',
    content: [
      {
        type: 'heading',
        text: 'Never Expose Secret Keys'
      },
      {
        type: 'code',
        language: 'jsx',
        title: 'Wrong vs Correct',
        code: `// ❌ WRONG - Never do this
const STRIPE_SECRET = 'sk_live_xxxxx';  // NEVER in frontend!

// ✅ CORRECT - Keep in backend .env only
// Backend .env
STRIPE_SECRET_KEY=sk_live_xxxxx`
      },
      {
        type: 'heading',
        text: 'Use Environment Variables'
      },
      {
        type: 'code',
        language: 'jsx',
        title: 'Correct way to use keys',
        code: `// ✅ CORRECT - Use public key in frontend
const publicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

// ✅ CORRECT - Use secret key only in backend
const secretKey = process.env.STRIPE_SECRET_KEY;`
      },
      {
        type: 'heading',
        text: 'Validate on Backend'
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Backend validation',
        code: `app.post('/api/create-checkout-session', async (req, res) => {
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
});`
      },
      {
        type: 'tip',
        text: '💡 Always use HTTPS in production. Stripe requires secure connections for payment processing.'
      }
    ]
  },

  troubleshooting: {
    title: 'Troubleshooting',
    icon: '🐛',
    description: 'Common issues and solutions',
    content: [
      {
        type: 'heading',
        text: 'Issue: "Stripe public key not found"'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Check .env configuration',
        code: `# Verify key is set
echo $REACT_APP_STRIPE_PUBLIC_KEY

# Should output: pk_live_xxxxx`
      },
      {
        type: 'heading',
        text: 'Issue: "Failed to create checkout session"'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Verify backend is running',
        code: `# Check backend health
curl http://localhost:3001/health

# Should return: { "status": "ok" }`
      },
      {
        type: 'heading',
        text: 'Issue: "CORS error"'
      },
      {
        type: 'code',
        language: 'javascript',
        title: 'Update CORS in backend',
        code: `app.use(cors({
  origin: ['http://localhost:3000', 'https://www.ethinx.solutions'],
  credentials: true
}));`
      },
      {
        type: 'heading',
        text: 'Issue: "Payment declined"'
      },
      {
        type: 'list',
        items: [
          'Check Stripe dashboard for fraud detection',
          'Use different test cards:',
          '  • Visa: 4242 4242 4242 4242',
          '  • Mastercard: 5555 5555 5555 4444',
          '  • Amex: 3782 822463 10005'
        ]
      },
      {
        type: 'heading',
        text: 'Issue: "Webhook not firing"'
      },
      {
        type: 'code',
        language: 'bash',
        title: 'Get webhook signing secret',
        code: `# Get webhook signing secret
stripe listen --print-secret

# Add to .env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx`
      }
    ]
  }
};
