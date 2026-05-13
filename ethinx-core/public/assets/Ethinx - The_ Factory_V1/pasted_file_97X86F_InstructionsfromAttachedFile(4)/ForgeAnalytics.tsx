/**
 * FORGE ANALYTICS COMPONENT
 * Revenue Forge V2: Conversion Rate Tracking & Metrics
 * 
 * Features:
 * - Real-time Forge Conversion Rate tracking
 * - Upsell breakdown by type (Anchor, Whale, Cross-Sell)
 * - Total upsell revenue calculation
 * - Live metrics dashboard
 * 
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 */

import React, { useState, useEffect } from "react";
import { TrendingUp, Zap, DollarSign, Target } from "lucide-react";

interface ForgeMetrics {
  totalCheckouts: number;
  totalUpsells: number;
  forgeConversionRate: number;
  anchorConversions: number;
  whaleConversions: number;
  crossSellConversions: number;
  totalUpsellRevenue: number;
}

export const ForgeAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<ForgeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch Forge metrics from backend
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/forge-metrics");
        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }
        const data = await response.json();
        setMetrics(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to fetch Forge metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();

    // Refresh metrics every 10 seconds
    const interval = setInterval(fetchMetrics, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="bg-gray-900 border border-yellow-600/30 p-6" style={{ borderRadius: 0 }}>
        <p className="text-gray-400 text-center">Loading Forge metrics...</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)} AUD`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="w-full bg-black text-white font-rajdhani">
      {/* Header */}
      <div className="border-b-2 border-yellow-600/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600 flex items-center justify-center" style={{ borderRadius: 0 }}>
              <Target className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-orbitron font-bold text-yellow-600 tracking-widest">
                FORGE ANALYTICS
              </h2>
              <p className="text-xs text-gray-400 mt-1">Revenue Forge V2 Conversion Metrics</p>
            </div>
          </div>
          {lastUpdated && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Last updated</p>
              <p className="text-xs text-gray-300">{lastUpdated.toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-yellow-600/30">
        {/* Forge Conversion Rate */}
        <div className="bg-gray-900 p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest">
            FORGE CONVERSION RATE
          </p>
          <p className="text-3xl font-bold text-yellow-600">
            {formatPercentage(metrics.forgeConversionRate)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {metrics.totalUpsells} of {metrics.totalCheckouts} checkouts
          </p>
        </div>

        {/* Total Checkouts */}
        <div className="bg-gray-900 p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest">
            TOTAL CHECKOUTS
          </p>
          <p className="text-3xl font-bold text-blue-400">{metrics.totalCheckouts}</p>
          <p className="text-xs text-gray-500 mt-2">All transactions</p>
        </div>

        {/* Total Upsells */}
        <div className="bg-gray-900 p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest">
            TOTAL UPSELLS
          </p>
          <p className="text-3xl font-bold text-green-400">{metrics.totalUpsells}</p>
          <p className="text-xs text-gray-500 mt-2">Accepted offers</p>
        </div>

        {/* Upsell Revenue */}
        <div className="bg-gray-900 p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest">
            UPSELL REVENUE
          </p>
          <p className="text-2xl font-bold text-green-400">
            {formatCurrency(metrics.totalUpsellRevenue)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Additional revenue</p>
        </div>
      </div>

      {/* Upsell Breakdown */}
      <div className="p-6">
        <h3 className="text-lg font-orbitron font-bold text-yellow-600 mb-4 tracking-widest">
          UPSELL BREAKDOWN
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {/* Anchor Tier Conversions */}
          <div className="bg-gray-900 border-l-4 border-blue-600 p-4" style={{ borderRadius: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Anchor Tier</p>
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-400">{metrics.anchorConversions}</p>
            <p className="text-xs text-gray-400 mt-2">Pro-Growth Accelerator</p>
            <p className="text-xs text-gray-500 mt-1">Starter/Growth tiers</p>
          </div>

          {/* Whale Tier Conversions */}
          <div className="bg-gray-900 border-l-4 border-red-600 p-4" style={{ borderRadius: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Whale Tier</p>
              <TrendingUp className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-red-400">{metrics.whaleConversions}</p>
            <p className="text-xs text-gray-400 mt-2">Neural Priority Pipeline</p>
            <p className="text-xs text-gray-500 mt-1">Vault tier ($2,500+)</p>
          </div>

          {/* Cross-Sell Conversions */}
          <div className="bg-gray-900 border-l-4 border-green-600 p-4" style={{ borderRadius: 0 }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Cross-Sell</p>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-400">{metrics.crossSellConversions}</p>
            <p className="text-xs text-gray-400 mt-2">Bio Suite (Last Chance)</p>
            <p className="text-xs text-gray-500 mt-1">Post-purchase offers</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="p-6 border-t border-yellow-600/30">
        <h3 className="text-lg font-orbitron font-bold text-yellow-600 mb-4 tracking-widest">
          PERFORMANCE INSIGHTS
        </h3>

        <div className="space-y-3">
          {/* Conversion Rate Interpretation */}
          <div className="bg-gray-900/50 p-4" style={{ borderRadius: 0 }}>
            <p className="text-sm font-semibold text-white mb-2">Forge Conversion Rate</p>
            <div className="w-full bg-gray-800 h-2 mb-2" style={{ borderRadius: 0 }}>
              <div
                className="bg-yellow-600 h-2 transition-all"
                style={{
                  width: `${Math.min(metrics.forgeConversionRate, 100)}%`,
                  borderRadius: 0,
                }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {metrics.forgeConversionRate < 10
                ? "🔴 Below target (aim for 15-25%)"
                : metrics.forgeConversionRate < 15
                  ? "🟡 Needs improvement (target: 15-25%)"
                  : metrics.forgeConversionRate < 25
                    ? "🟢 On target (15-25%)"
                    : "🟢 Exceeding target (25%+)"}
            </p>
          </div>

          {/* Top Performing Upsell */}
          <div className="bg-gray-900/50 p-4" style={{ borderRadius: 0 }}>
            <p className="text-sm font-semibold text-white mb-2">Top Performing Upsell</p>
            <p className="text-xs text-gray-300">
              {metrics.anchorConversions >= metrics.whaleConversions &&
              metrics.anchorConversions >= metrics.crossSellConversions
                ? `🏆 Anchor Tier (${metrics.anchorConversions} conversions)`
                : metrics.whaleConversions >= metrics.crossSellConversions
                  ? `🏆 Whale Tier (${metrics.whaleConversions} conversions)`
                  : `🏆 Cross-Sell (${metrics.crossSellConversions} conversions)`}
            </p>
          </div>

          {/* Revenue Impact */}
          <div className="bg-gray-900/50 p-4" style={{ borderRadius: 0 }}>
            <p className="text-sm font-semibold text-white mb-2">Revenue Impact</p>
            <p className="text-xs text-gray-300">
              {metrics.totalUpsells > 0
                ? `💰 Average upsell value: ${formatCurrency(Math.round(metrics.totalUpsellRevenue / metrics.totalUpsells))}`
                : "No upsells yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-yellow-600/30 p-4 text-center">
        <p className="text-xs text-gray-500">
          Forge Analytics • Real-Time Conversion Tracking • Revenue Forge V2
        </p>
      </div>
    </div>
  );
};

export default ForgeAnalytics;
