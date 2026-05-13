/**
 * ORDER BUMP V2 - ADVANCED BEHAVIORAL UPSELL ENGINE
 * Revenue Forge V2 with Multi-Tier Dynamic Logic
 * 
 * Features:
 * - Anchor Tier: Pro-Growth Accelerator ($49) for Starter/Growth tiers
 * - Whale Tier: Neural Priority Pipeline ($199) for Vault tier
 * - Scarcity Engine: Real-time priority slots counter (3-5 remaining)
 * - Risk Reversal: T-Dog Certified badge with compliance guarantee
 * - Dynamic pricing based on selected tier
 * 
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 */

import React, { useState, useEffect } from "react";
import { Check, X, Zap, Shield, AlertCircle } from "lucide-react";

interface OrderBumpV2Props {
  selectedTier: string;
  basePrice: number;
  onToggle?: (enabled: boolean, upsellType: string, upsellPrice: number) => void;
  onCheckout?: (includeOrderBump: boolean, upsellMetadata: any) => void;
}

interface UpsellConfig {
  type: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  bundleDiscount: number;
  guarantee: string;
  priceId?: string;
}

// Upsell configurations by tier
const UPSELL_CONFIGS: { [key: string]: UpsellConfig } = {
  starter: {
    type: "pro_growth_accelerator",
    name: "Pro-Growth Accelerator",
    price: 4900, // $49 AUD
    description: "Unlock advanced analytics and priority support to scale faster",
    features: [
      "Advanced Analytics Dashboard",
      "Priority Email Support",
      "Custom Report Templates",
      "Growth Benchmarking",
    ],
    bundleDiscount: 20, // 20% off
    guarantee: "30-day money-back guarantee",
    priceId: process.env.REACT_APP_PRICE_PRO_GROWTH_ACCELERATOR,
  },
  growth: {
    type: "pro_growth_accelerator",
    name: "Pro-Growth Accelerator",
    price: 4900, // $49 AUD
    description: "Unlock advanced analytics and priority support to scale faster",
    features: [
      "Advanced Analytics Dashboard",
      "Priority Email Support",
      "Custom Report Templates",
      "Growth Benchmarking",
    ],
    bundleDiscount: 20, // 20% off
    guarantee: "30-day money-back guarantee",
    priceId: process.env.REACT_APP_PRICE_PRO_GROWTH_ACCELERATOR,
  },
  vault: {
    type: "neural_priority_pipeline",
    name: "Neural Priority Pipeline",
    price: 19900, // $199 AUD
    description: "Guaranteed 60-minute turnaround with dedicated support",
    features: [
      "60-Minute Turnaround Guarantee",
      "Dedicated Account Manager",
      "Priority Queue Access",
      "Custom Integration Support",
      "Quarterly Business Reviews",
    ],
    bundleDiscount: 15, // 15% off
    guarantee: "SLA-backed 60-minute response time",
    priceId: process.env.REACT_APP_PRICE_NEURAL_PRIORITY_PIPELINE,
  },
};

// Tiers that trigger upsells
const UPSELL_ELIGIBLE_TIERS = ["starter", "growth", "vault"];

export const OrderBumpV2: React.FC<OrderBumpV2Props> = ({
  selectedTier,
  basePrice,
  onToggle,
  onCheckout,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prioritySlotsRemaining, setPrioritySlotsRemaining] = useState(5);
  const [upsellConfig, setUpsellConfig] = useState<UpsellConfig | null>(null);

  // Initialize upsell configuration based on selected tier
  useEffect(() => {
    const config = UPSELL_CONFIGS[selectedTier];
    setUpsellConfig(config || null);
    setIsSelected(false); // Reset selection when tier changes

    // Initialize random priority slots (3-5 remaining)
    setPrioritySlotsRemaining(Math.floor(Math.random() * 3) + 3);
  }, [selectedTier]);

  // Decrement priority slots randomly to create urgency
  useEffect(() => {
    if (!upsellConfig) return;

    const interval = setInterval(() => {
      setPrioritySlotsRemaining((prev) => {
        const newValue = Math.max(1, prev - Math.floor(Math.random() * 2));
        return newValue;
      });
    }, 8000 + Math.random() * 4000); // Every 8-12 seconds

    return () => clearInterval(interval);
  }, [upsellConfig]);

  // Check if tier is eligible for upsell
  if (!UPSELL_ELIGIBLE_TIERS.includes(selectedTier) || !upsellConfig) {
    return null; // No upsell for ineligible tiers
  }

  const handleToggle = () => {
    const newState = !isSelected;
    setIsSelected(newState);
    if (onToggle) {
      onToggle(newState, upsellConfig.type, upsellConfig.price);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      if (onCheckout) {
        onCheckout(isSelected, {
          upsellType: upsellConfig.type,
          upsellPrice: upsellConfig.price,
          bundleDiscount: upsellConfig.bundleDiscount,
          selectedTier,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = basePrice + (isSelected ? upsellConfig.price : 0);
  const savings = isSelected
    ? Math.round((upsellConfig.price * upsellConfig.bundleDiscount) / 100)
    : 0;

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)} AUD`;
  };

  // Determine urgency level based on slots remaining
  const urgencyLevel =
    prioritySlotsRemaining <= 2
      ? "critical"
      : prioritySlotsRemaining <= 3
        ? "high"
        : "medium";

  return (
    <div className="w-full bg-black text-white font-rajdhani">
      {/* Scarcity Engine Banner */}
      {urgencyLevel !== "medium" && (
        <div
          className={`p-3 text-center text-sm font-bold tracking-widest ${
            urgencyLevel === "critical"
              ? "bg-red-950 text-red-300"
              : "bg-orange-950 text-orange-300"
          }`}
          style={{ borderRadius: 0 }}
        >
          ⚡ PRIORITY SLOTS FILLING FAST: {prioritySlotsRemaining} REMAINING
        </div>
      )}

      {/* Main Upsell Card */}
      <div
        className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-2 border-yellow-600 p-6"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-orbitron font-bold text-yellow-600 tracking-widest">
                {upsellConfig.name.toUpperCase()}
              </h3>
              {urgencyLevel === "critical" && (
                <span className="text-xs bg-red-600 text-white px-2 py-1 font-bold">
                  URGENT
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300">{upsellConfig.description}</p>
          </div>

          {/* Toggle Checkbox */}
          <button
            onClick={handleToggle}
            className={`w-6 h-6 flex items-center justify-center border-2 flex-shrink-0 transition-all ${
              isSelected
                ? "bg-yellow-600 border-yellow-600"
                : "bg-transparent border-gray-600 hover:border-yellow-600"
            }`}
            style={{ borderRadius: 0 }}
            disabled={isLoading}
          >
            {isSelected && <Check className="w-4 h-4 text-black" />}
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {upsellConfig.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Scarcity Counter */}
        <div className="mb-6 p-3 bg-gray-900/50 border border-yellow-600/30" style={{ borderRadius: 0 }}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-orbitron tracking-widest">
              PRIORITY SLOTS REMAINING
            </span>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 ${
                    idx < prioritySlotsRemaining ? "bg-yellow-600" : "bg-gray-700"
                  }`}
                  style={{ borderRadius: 0 }}
                />
              ))}
              <span className="text-sm font-bold text-yellow-600 ml-2">
                {prioritySlotsRemaining}/5
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-gray-900/50 p-4 mb-6" style={{ borderRadius: 0 }}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{selectedTier.toUpperCase()} TIER:</span>
              <span className="text-white">{formatCurrency(basePrice)}</span>
            </div>

            {isSelected && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">{upsellConfig.name.toUpperCase()}:</span>
                  <span className="text-white">{formatCurrency(upsellConfig.price)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>BUNDLE DISCOUNT ({upsellConfig.bundleDiscount}%):</span>
                  <span>-{formatCurrency(savings)}</span>
                </div>
              </>
            )}

            <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold">
              <span className="text-yellow-600">TOTAL:</span>
              <span className="text-yellow-600 text-lg">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Risk Reversal Badge & Guarantee */}
        <div className="mb-6 p-4 bg-blue-950/20 border border-blue-600/30" style={{ borderRadius: 0 }}>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-300 mb-1">
                🛡️ T-DOG CERTIFIED
              </p>
              <p className="text-xs text-blue-200">
                {upsellConfig.guarantee} • Hardened Security & FBT Compliance Guaranteed
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`w-full py-3 px-4 font-orbitron font-bold tracking-widest transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-yellow-600 text-black hover:bg-yellow-500 active:bg-yellow-700"
          }`}
          style={{ borderRadius: 0 }}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent animate-spin" />
              PROCESSING...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              PROCEED TO CHECKOUT
            </>
          )}
        </button>

        {/* Value Proposition */}
        {isSelected && (
          <div className="mt-4 p-3 bg-green-950/30 border border-green-600/50" style={{ borderRadius: 0 }}>
            <p className="text-xs text-green-300">
              ✓ You're saving {formatCurrency(savings)} with the bundle discount!
            </p>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-yellow-600">
              <th className="text-left py-3 px-4 text-gray-400 font-orbitron tracking-widest">
                FEATURE
              </th>
              <th className="text-center py-3 px-4 text-gray-400 font-orbitron tracking-widest">
                {selectedTier.toUpperCase()}
              </th>
              <th className="text-center py-3 px-4 text-yellow-600 font-orbitron tracking-widest">
                + {upsellConfig.name.toUpperCase()}
              </th>
            </tr>
          </thead>
          <tbody>
            {upsellConfig.features.map((feature, idx) => (
              <tr key={idx} className="border-b border-gray-800">
                <td className="py-3 px-4 text-gray-300">{feature}</td>
                <td className="text-center">
                  {idx === 0 ? (
                    <Check className="w-5 h-5 text-green-400 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-gray-600 mx-auto" />
                  )}
                </td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-400 mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Guarantee Notice */}
      <div className="mt-6 p-4 bg-purple-950/20 border border-purple-600/30" style={{ borderRadius: 0 }}>
        <p className="text-xs text-purple-300">
          ℹ {upsellConfig.guarantee}. If you're not satisfied, we'll refund your purchase within 30 days.
        </p>
      </div>
    </div>
  );
};

export default OrderBumpV2;
