import React, { useState } from 'react';
import { Zap, Lock, Check } from 'lucide-react';

export function StripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Initialize Stripe checkout
      // This would connect to your backend to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: 'neural-recon-strike',
          price: 2500,
          currency: 'AUD',
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe checkout
      if (window.Stripe) {
        const stripe = window.Stripe(process.env.REACT_APP_STRIPE_KEY);
        stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stripe Checkout Header with ETHINX Wordmark */}
      <div className="bg-black border-b-2 border-yellow-500 p-6 flex items-center justify-between">
        {/* ETHINX Wordmark - Stripe Checkout Version */}
        <img 
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663310720290/imhUxoWBjAUUXWET.png"
          alt="ETHINX"
          className="h-10 w-auto object-contain"
          style={{ aspectRatio: '1.5 / 1' }}
        />
        
        {/* Secure Badge */}
        <div className="flex items-center gap-2 text-yellow-300 font-rajdhani font-bold">
          <Lock size={16} />
          <span className="text-sm">SECURE CHECKOUT</span>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="bg-gray-950 border-2 border-yellow-500/30 p-8 space-y-8">
        {/* Product Summary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-yellow-400 font-orbitron">
            NEURAL RECON STRIKE
          </h2>
          <p className="text-yellow-100 font-rajdhani font-bold">
            Premium AI-powered prompt pack for building $100K+ MRR digital businesses
          </p>

          {/* Features */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-yellow-200">
              <Check size={20} className="text-yellow-400" />
              <span className="font-rajdhani font-bold">48 AI-Optimized Prompts</span>
            </div>
            <div className="flex items-center gap-3 text-yellow-200">
              <Check size={20} className="text-yellow-400" />
              <span className="font-rajdhani font-bold">Revenue Predictor Dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-yellow-200">
              <Check size={20} className="text-yellow-400" />
              <span className="font-rajdhani font-bold">Gamification System Access</span>
            </div>
            <div className="flex items-center gap-3 text-yellow-200">
              <Check size={20} className="text-yellow-400" />
              <span className="font-rajdhani font-bold">Founder Community Access</span>
            </div>
            <div className="flex items-center gap-3 text-yellow-200">
              <Check size={20} className="text-yellow-400" />
              <span className="font-rajdhani font-bold">T-Dog Certified Badge</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="bg-black border-2 border-yellow-500 rounded-lg p-6 space-y-2">
          <div className="text-sm text-yellow-300 font-rajdhani font-bold">TOTAL PRICE</div>
          <div className="text-4xl font-black text-yellow-400 font-orbitron">
            $2,500 AUD
          </div>
          <div className="text-xs text-yellow-600 font-rajdhani">
            One-time payment. Instant access.
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-black font-black py-4 px-6 rounded-lg transition-all shadow-lg shadow-yellow-500/50 font-orbitron text-lg flex items-center justify-center gap-3"
        >
          <Zap size={24} />
          {isLoading ? 'PROCESSING...' : 'PROCEED TO PAYMENT'}
        </button>

        {/* Security Notice */}
        <div className="text-center text-xs text-yellow-600 font-rajdhani">
          Powered by Stripe. Your payment information is secure and encrypted.
        </div>
      </div>

      {/* Money-Back Guarantee */}
      <div className="bg-black border-2 border-yellow-500/30 p-4 text-center">
        <p className="text-yellow-300 font-rajdhani font-bold text-sm">
          ✓ 30-Day Money-Back Guarantee • No Questions Asked
        </p>
      </div>
    </div>
  );
}
