/**
 * SUCCESS PAGE - POST-PURCHASE CROSS-SELL
 * Revenue Forge V2: "Last Chance" Stealth Cross-Sell
 * 
 * Features:
 * - Checks purchase metadata for upsell acceptance
 * - If Bio Suite NOT purchased: shows $19 "Last Chance" offer (10 min window)
 * - Countdown timer with urgency messaging
 * - One-time offer with $10 discount
 * - Tracks conversion metrics
 * 
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Check, Clock, Zap, X } from "lucide-react";

interface PurchaseMetadata {
  sessionId: string;
  tier: string;
  amount: number;
  includeOrderBump: boolean;
  upsellType?: string;
  timestamp: string;
}

export default function SuccessPage() {
  const [location] = useLocation();
  const [purchaseMetadata, setPurchaseMetadata] = useState<PurchaseMetadata | null>(null);
  const [showCrossSell, setShowCrossSell] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [crossSellAccepted, setCrossSellAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse session ID from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      // In production, fetch session metadata from backend
      // For now, simulate with mock data
      const mockMetadata: PurchaseMetadata = {
        sessionId,
        tier: "pro",
        amount: 12900,
        includeOrderBump: false, // Trigger cross-sell if false
        timestamp: new Date().toISOString(),
      };

      setPurchaseMetadata(mockMetadata);

      // Show cross-sell if Bio Suite was NOT purchased
      if (!mockMetadata.includeOrderBump) {
        setShowCrossSell(true);
      }
    }
  }, []);

  // Countdown timer for "Last Chance" offer
  useEffect(() => {
    if (!showCrossSell || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowCrossSell(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCrossSell, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCrossSellAccept = async () => {
    setIsProcessing(true);
    try {
      // Create a new checkout session for the cross-sell offer
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tier: "bio_suite_crosssell",
          includeOrderBump: false,
          customerEmail: "customer@example.com",
          crossSellOffer: true,
          originalSessionId: purchaseMetadata?.sessionId,
          discountedPrice: 1900, // $19 AUD (normally $29)
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create cross-sell checkout session");
      }

      const { sessionId } = await response.json();
      setCrossSellAccepted(true);

      // Redirect to Stripe checkout
      if (typeof window !== "undefined" && window.location) {
        window.location.href = `/checkout?session_id=${sessionId}`;
      }
    } catch (error) {
      console.error("Cross-sell error:", error);
      alert("Failed to process cross-sell offer. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCrossSellDismiss = () => {
    setShowCrossSell(false);
    // Track dismissal for analytics
    console.log("Cross-sell offer dismissed");
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)} AUD`;
  };

  const urgencyLevel = timeRemaining <= 120 ? "critical" : "high";

  return (
    <div className="min-h-screen bg-black text-white font-rajdhani">
      {/* Header */}
      <header className="border-b-2 border-yellow-600/50 bg-black/95">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 flex items-center justify-center" style={{ borderRadius: 0 }}>
              <Check className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-green-400 tracking-widest">
                PAYMENT SUCCESSFUL
              </h1>
              <p className="text-xs text-gray-400">Thank you for your purchase</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Success Confirmation */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gray-900 border-2 border-green-600 p-8" style={{ borderRadius: 0 }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-600 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
                <Check className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-orbitron font-bold text-white mb-2 tracking-widest">
                TRANSACTION COMPLETE
              </h2>
              <p className="text-gray-300">
                Your {purchaseMetadata?.tier.toUpperCase()} tier purchase has been confirmed.
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-3 text-sm mb-8">
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Session ID:</span>
                <span className="text-gray-300 font-mono">{purchaseMetadata?.sessionId.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Tier:</span>
                <span className="text-yellow-600 font-bold">{purchaseMetadata?.tier.toUpperCase()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white font-bold">{formatCurrency(purchaseMetadata?.amount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timestamp:</span>
                <span className="text-gray-300">
                  {purchaseMetadata?.timestamp ? new Date(purchaseMetadata.timestamp).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-950/20 border border-blue-600/30 p-4" style={{ borderRadius: 0 }}>
              <p className="text-sm text-blue-300">
                ✓ A confirmation email has been sent to your registered email address. Check your inbox for access details and next steps.
              </p>
            </div>
          </div>
        </div>

        {/* "Last Chance" Cross-Sell Offer */}
        {showCrossSell && !crossSellAccepted && (
          <div className="max-w-2xl mx-auto">
            {/* Urgency Banner */}
            {urgencyLevel === "critical" && (
              <div className="mb-4 p-3 bg-red-950 border-2 border-red-500 text-center" style={{ borderRadius: 0 }}>
                <p className="text-sm font-bold text-red-300 tracking-widest">
                  ⚠️ OFFER EXPIRES IN {formatTime(timeRemaining)} — DON'T MISS OUT
                </p>
              </div>
            )}

            {/* Cross-Sell Card */}
            <div
              className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-2 border-yellow-600 p-8"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-xl font-orbitron font-bold text-yellow-600 tracking-widest">
                      LAST CHANCE OFFER
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Complete your setup with the Bio Suite at an exclusive one-time discount.
                  </p>
                </div>

                <button
                  onClick={handleCrossSellDismiss}
                  className="p-2 hover:bg-gray-800 transition-colors flex-shrink-0"
                  style={{ borderRadius: 0 }}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Offer Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Original Price */}
                <div className="bg-gray-900/50 p-4" style={{ borderRadius: 0 }}>
                  <p className="text-xs text-gray-400 mb-1 font-orbitron tracking-widest">REGULAR PRICE</p>
                  <p className="text-lg text-gray-400 line-through">$29.00 AUD</p>
                </div>

                {/* Discounted Price */}
                <div className="bg-green-950/30 border border-green-600/50 p-4" style={{ borderRadius: 0 }}>
                  <p className="text-xs text-green-400 mb-1 font-orbitron tracking-widest">TODAY ONLY</p>
                  <p className="text-2xl font-bold text-green-400">$19.00 AUD</p>
                  <p className="text-xs text-green-300 mt-1">Save $10 (34% OFF)</p>
                </div>
              </div>

              {/* Bio Suite Features */}
              <div className="mb-6 p-4 bg-gray-900/50" style={{ borderRadius: 0 }}>
                <p className="text-sm font-semibold text-white mb-3">What You Get:</p>
                <div className="space-y-2">
                  {[
                    "Advanced Analytics Dashboard",
                    "Priority Email Support",
                    "Custom Report Templates",
                    "API Access",
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6 p-4 bg-gray-900/50 border border-yellow-600/30" style={{ borderRadius: 0 }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-orbitron tracking-widest">
                    OFFER EXPIRES IN
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span
                      className={`text-lg font-bold font-mono ${
                        urgencyLevel === "critical" ? "text-red-400" : "text-yellow-600"
                      }`}
                    >
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCrossSellAccept}
                  disabled={isProcessing}
                  className={`flex-1 py-3 px-4 font-orbitron font-bold tracking-widest transition-all ${
                    isProcessing
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-yellow-600 text-black hover:bg-yellow-500 active:bg-yellow-700"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {isProcessing ? "PROCESSING..." : "YES, ADD BIO SUITE"}
                </button>
                <button
                  onClick={handleCrossSellDismiss}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 font-orbitron font-bold tracking-widest bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
                  style={{ borderRadius: 0 }}
                >
                  NO THANKS
                </button>
              </div>

              {/* Money-Back Guarantee */}
              <div className="mt-6 p-3 bg-blue-950/20 border border-blue-600/30" style={{ borderRadius: 0 }}>
                <p className="text-xs text-blue-300">
                  🛡️ 30-day money-back guarantee. If you're not satisfied, we'll refund your purchase.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cross-Sell Already Accepted */}
        {crossSellAccepted && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-green-950/30 border-2 border-green-600 p-8 text-center" style={{ borderRadius: 0 }}>
              <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-orbitron font-bold text-green-400 mb-2 tracking-widest">
                BIO SUITE ADDED
              </h3>
              <p className="text-gray-300">
                Redirecting to checkout to complete your Bio Suite purchase...
              </p>
            </div>
          </div>
        )}

        {/* No Cross-Sell (Already Purchased) */}
        {!showCrossSell && !crossSellAccepted && purchaseMetadata?.includeOrderBump && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-950/20 border border-blue-600/30 p-8 text-center" style={{ borderRadius: 0 }}>
              <Check className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-orbitron font-bold text-blue-400 mb-2 tracking-widest">
                COMPLETE SETUP
              </h3>
              <p className="text-gray-300">
                You've already added the Bio Suite to your purchase. Your setup is complete!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-yellow-600/30 mt-12 py-6 text-center text-gray-500 text-xs">
        <p>ETHINX Revenue Forge • Post-Purchase Cross-Sell • Powered by Stripe</p>
      </footer>
    </div>
  );
}
