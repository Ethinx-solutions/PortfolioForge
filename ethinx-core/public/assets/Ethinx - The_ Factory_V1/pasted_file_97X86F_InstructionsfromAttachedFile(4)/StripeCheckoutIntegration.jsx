/**
 * ETHINX STRIPE CHECKOUT INTEGRATION
 * React Component for Neural Recon Strike ($2,500 AUD)
 * 
 * Features:
 * - Live Stripe integration (use your sk_live_ key)
 * - Industrial aesthetic (0px border-radius, Metallic Gold, Pure Black)
 * - T-Dog Certified trust seal
 * - Aggressive technical tone
 * - Ready for local execution
 * 
 * SETUP:
 * 1. Install: npm install @stripe/react-stripe-js @stripe/js
 * 2. Set env: REACT_APP_STRIPE_PUBLIC_KEY=pk_live_your_key
 * 3. Import in App.tsx: <StripeCheckoutIntegration />
 */

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

/**
 * CONFIGURATION
 * Update these with your live Stripe keys
 */
const STRIPE_CONFIG = {
  publicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_live_your_key_here',
  products: {
    neuralReconStrike: {
      priceId: 'price_XXXXX', // Replace with your actual price ID from deployment
      name: 'Neural Recon Strike',
      amount: 250000, // $2,500 AUD in cents
      currency: 'aud',
      description: 'The Execution Layer for Solo Operators'
    }
  },
  api: {
    createCheckoutSession: '/api/create-checkout-session',
    handleSuccess: '/success',
    handleCancel: '/cancel'
  }
};

/**
 * COLORS & STYLES (Industrial Aesthetic)
 */
const ETHINX_COLORS = {
  primary: '#D4AF37',      // Metallic Gold
  background: '#000000',   // Pure Black
  text: '#F5F5F5',        // Off-White
  border: '#D4AF37',      // Metallic Gold borders
};

const INDUSTRIAL_STYLES = {
  borderRadius: '0px',
  fontFamily: "'Orbitron', sans-serif",
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

/**
 * STRIPE CHECKOUT COMPONENT
 */
export function StripeCheckoutIntegration() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  // Initialize Stripe
  useEffect(() => {
    const stripe = loadStripe(STRIPE_CONFIG.publicKey);
    setStripePromise(stripe);
  }, []);

  /**
   * Create checkout session on backend
   */
  const createCheckoutSession = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(STRIPE_CONFIG.api.createCheckoutSession, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: STRIPE_CONFIG.products.neuralReconStrike.priceId,
          email: email,
          metadata: {
            product: 'Neural Recon Strike',
            tier: 'enterprise',
            trustSeal: 'tdog-certified',
            visualBrand: 'metallic-gold-black'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (err) {
      setError(err.message || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  // Show embedded checkout
  if (clientSecret) {
    return (
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    );
  }

  // Show checkout form
  return (
    <div
      style={{
        background: ETHINX_COLORS.background,
        color: ETHINX_COLORS.text,
        padding: '48px 24px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          border: `2px solid ${ETHINX_COLORS.border}`,
          borderRadius: INDUSTRIAL_STYLES.borderRadius,
          padding: '48px',
          boxShadow: `0 0 40px ${ETHINX_COLORS.primary}40`,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/XGjIsdSWHFHiMGDT.png"
            alt="ETHINX"
            style={{ height: '48px', marginBottom: '16px' }}
          />
          <h1
            style={{
              ...INDUSTRIAL_STYLES,
              fontSize: '36px',
              color: ETHINX_COLORS.primary,
              margin: '0 0 8px 0',
            }}
          >
            Neural Recon Strike
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: ETHINX_COLORS.text,
              margin: '0 0 24px 0',
              letterSpacing: '0.05em',
            }}
          >
            The Execution Layer for Solo Operators
          </p>
        </div>

        {/* Product Details */}
        <div
          style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: `1px solid ${ETHINX_COLORS.primary}40`,
            borderRadius: INDUSTRIAL_STYLES.borderRadius,
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '14px', color: ETHINX_COLORS.text }}>
              Product
            </span>
            <span
              style={{
                fontSize: '14px',
                color: ETHINX_COLORS.primary,
                fontWeight: 'bold',
              }}
            >
              {STRIPE_CONFIG.products.neuralReconStrike.name}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: `1px solid ${ETHINX_COLORS.primary}40`,
            }}
          >
            <span
              style={{
                fontSize: '16px',
                color: ETHINX_COLORS.text,
                fontWeight: 'bold',
              }}
            >
              Total
            </span>
            <span
              style={{
                fontSize: '28px',
                color: ETHINX_COLORS.primary,
                fontWeight: 'bold',
                ...INDUSTRIAL_STYLES,
              }}
            >
              $2,500 AUD
            </span>
          </div>
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              color: ETHINX_COLORS.primary,
              marginBottom: '8px',
              ...INDUSTRIAL_STYLES,
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: `1px solid ${ETHINX_COLORS.primary}`,
              borderRadius: INDUSTRIAL_STYLES.borderRadius,
              color: ETHINX_COLORS.text,
              fontSize: '14px',
              fontFamily: "'Rajdhani', sans-serif",
              boxSizing: 'border-box',
              transition: 'all 0.3s ease',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = `0 0 20px ${ETHINX_COLORS.primary}40`;
              e.target.style.borderColor = ETHINX_COLORS.primary;
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: 'rgba(255, 107, 107, 0.1)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: INDUSTRIAL_STYLES.borderRadius,
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '12px',
              color: '#FF6B6B',
            }}
          >
            {error}
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={createCheckoutSession}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: loading ? ETHINX_COLORS.primary + '60' : ETHINX_COLORS.primary,
            color: ETHINX_COLORS.background,
            border: 'none',
            borderRadius: INDUSTRIAL_STYLES.borderRadius,
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = '#E8C547';
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = `0 0 30px ${ETHINX_COLORS.primary}60`;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.background = ETHINX_COLORS.primary;
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>

        {/* Trust Seal */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '24px',
            fontSize: '12px',
            color: ETHINX_COLORS.primary,
          }}
        >
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/LWspXAtQPmwsxVEJ.png"
            alt="T-Dog Certified"
            style={{ width: '24px', height: '24px' }}
          />
          <span>T-Dog Certified</span>
        </div>

        {/* Security Note */}
        <p
          style={{
            fontSize: '11px',
            color: ETHINX_COLORS.text,
            textAlign: 'center',
            marginTop: '16px',
            opacity: 0.7,
          }}
        >
          Secure payment processing by Stripe. Your data is encrypted and protected.
        </p>
      </div>
    </div>
  );
}

export default StripeCheckoutIntegration;
