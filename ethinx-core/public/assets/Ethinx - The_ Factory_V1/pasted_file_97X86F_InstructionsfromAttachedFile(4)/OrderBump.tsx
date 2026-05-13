/**
 * ORDER BUMP COMPONENT
 * Bio Suite Add-on Upsell ($29 AUD)
 * 
 * Pre-checkout upsell logic with dynamic pricing
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 */

import React, { useState } from "react";
import { Check, X, Zap } from "lucide-react";

interface OrderBumpProps {
  selectedTier: string;
  basePrice: number;
  onToggle?: (enabled: boolean) => void;
  onCheckout?: (includeOrderBump: boolean) => void;
}

const BIO_SUITE_PRICE = 2900; // $29 AUD in cents

export const OrderBump: React.FC<OrderBumpProps> = ({
  selectedTier,
  basePrice,
  onToggle,
  onCheckout,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    const newState = !isSelected;
    setIsSelected(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      if (onCheckout) {
        onCheckout(isSelected);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = basePrice + (isSelected ? BIO_SUITE_PRICE : 0);
  const savings = isSelected ? Math.round((BIO_SUITE_PRICE * 0.15) * 100) / 100 : 0; // 15% bundle discount

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)} AUD`;
  };

  return (
    <div className="w-full bg-black text-white font-rajdhani">
      {/* Order Bump Card */}
      <div
        className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-2 border-yellow-600 p-6"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-orbitron font-bold text-yellow-600 tracking-widest">
                ORDER BUMP
              </h3>
              <span className="text-xs bg-red-600 text-white px-2 py-1 font-bold">LIMITED TIME</span>
            </div>
            <p className="text-sm text-gray-300">
              Add the <span className="font-bold text-yellow-600">Bio Suite</span> to unlock advanced features
            </p>
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

        {/* Bio Suite Features */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">Advanced Analytics</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">Priority Support</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">Custom Integrations</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-300">API Access</span>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-gray-900/50 p-4 mb-6" style={{ borderRadius: 0 }}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{selectedTier.toUpperCase()} Bundle:</span>
              <span className="text-white">{formatCurrency(basePrice)}</span>
            </div>

            {isSelected && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bio Suite Add-on:</span>
                  <span className="text-white">{formatCurrency(BIO_SUITE_PRICE)}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Bundle Discount (15%):</span>
                  <span>-{formatCurrency(savings)}</span>
                </div>
              </>
            )}

            <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold">
              <span className="text-yellow-600">Total:</span>
              <span className="text-yellow-600 text-lg">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`w-full py-3 px-4 font-orbitron font-bold tracking-widest transition-all ${
            isLoading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-yellow-600 text-black hover:bg-yellow-500 active:bg-yellow-700"
          }`}
          style={{ borderRadius: 0 }}
        >
          {isLoading ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
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
              <th className="text-left py-3 px-4 text-gray-400 font-orbitron tracking-widest">Feature</th>
              <th className="text-center py-3 px-4 text-gray-400 font-orbitron tracking-widest">
                {selectedTier.toUpperCase()}
              </th>
              <th className="text-center py-3 px-4 text-yellow-600 font-orbitron tracking-widest">
                + BIO SUITE
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800">
              <td className="py-3 px-4 text-gray-300">Core Features</td>
              <td className="text-center">
                <Check className="w-5 h-5 text-green-400 mx-auto" />
              </td>
              <td className="text-center">
                <Check className="w-5 h-5 text-green-400 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-3 px-4 text-gray-300">Advanced Analytics</td>
              <td className="text-center">
                <X className="w-5 h-5 text-gray-600 mx-auto" />
              </td>
              <td className="text-center">
                <Check className="w-5 h-5 text-green-400 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-3 px-4 text-gray-300">Priority Support</td>
              <td className="text-center">
                <X className="w-5 h-5 text-gray-600 mx-auto" />
              </td>
              <td className="text-center">
                <Check className="w-5 h-5 text-green-400 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-3 px-4 text-gray-300">Custom Integrations</td>
              <td className="text-center">
                <X className="w-5 h-5 text-gray-600 mx-auto" />
              </td>
              <td className="text-center">
                <Check className="w-5 h-5 text-green-400 mx-auto" />
              </td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-3 px-4 text-gray-300">API Access</td>
              <td className="text-center">
                <X className="w-5 h-5 text-gray-600 mx-auto" />
              </td>
              <td className="text-center">
                <Check className="w-5 h-5 text-green-400 mx-auto" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FBT Compliance Notice */}
      <div className="mt-6 p-4 bg-blue-950/20 border border-blue-600/30" style={{ borderRadius: 0 }}>
        <p className="text-xs text-blue-300">
          ℹ Bio Suite is classified as an EV product and is FBT-exempt under Australian tax law.
        </p>
      </div>
    </div>
  );
};

export default OrderBump;
