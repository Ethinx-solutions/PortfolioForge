/**
 * LAUNCH SENTRY DASHBOARD
 * Revenue Forge (Silo 05) Integration
 * 
 * Real-time sales ticker with Neural Recon Priority Queue
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 * Typography: Orbitron (headings), Rajdhani (body)
 */

import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, TrendingUp, Zap, DollarSign } from "lucide-react";

interface SalesEvent {
  id: string;
  type: "checkout_completed" | "payment_succeeded" | "neural_recon_alert";
  amount: number;
  tier: string;
  timestamp: string;
  isHighValue?: boolean;
}

interface DashboardStats {
  totalRevenue: number;
  transactionCount: number;
  averageOrderValue: number;
  lastTransaction?: SalesEvent;
}

export const LaunchSentry: React.FC = () => {
  const [salesEvents, setSalesEvents] = useState<SalesEvent[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    transactionCount: 0,
    averageOrderValue: 0,
  });
  const [neuralReconActive, setNeuralReconActive] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection to Hetzner Controller
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || "ws://91.99.162.243:3001";
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          console.log("✓ Launch Sentry connected to Hetzner Controller");
          setWsConnected(true);
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            handleSalesEvent(data);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        wsRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
          setWsConnected(false);
        };

        wsRef.current.onclose = () => {
          console.log("Launch Sentry disconnected from Hetzner Controller");
          setWsConnected(false);
          // Attempt reconnection after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, []);

  // Handle incoming sales events
  const handleSalesEvent = (event: SalesEvent) => {
    // Add to sales ticker
    setSalesEvents((prev) => [event, ...prev.slice(0, 19)]);

    // Update statistics
    setStats((prev) => ({
      totalRevenue: prev.totalRevenue + event.amount,
      transactionCount: prev.transactionCount + 1,
      averageOrderValue: (prev.totalRevenue + event.amount) / (prev.transactionCount + 1),
      lastTransaction: event,
    }));

    // Trigger Neural Recon for high-value transactions ($2,500 AUD = 250000 cents)
    if (event.amount >= 250000) {
      triggerNeuralRecon(event);
    }
  };

  // Neural Recon Priority Queue - Sensory Alert for $2,500+ transactions
  const triggerNeuralRecon = (event: SalesEvent) => {
    setNeuralReconActive(true);

    // Log to console with visual emphasis
    console.log("\n🚨 NEURAL RECON PRIORITY QUEUE ACTIVATED 🚨");
    console.log("═══════════════════════════════════════════════════");
    console.log(`VAULT TIER PAYMENT: $${(event.amount / 100).toFixed(2)} AUD`);
    console.log(`Tier: ${event.tier.toUpperCase()}`);
    console.log(`Timestamp: ${new Date(event.timestamp).toLocaleTimeString()}`);
    console.log("═══════════════════════════════════════════════════\n");

    // CSS pulse animation (handled by Tailwind)
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }

    pulseTimeoutRef.current = setTimeout(() => {
      setNeuralReconActive(false);
    }, 5000);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)} AUD`;
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Get tier badge color
  const getTierColor = (tier: string): string => {
    switch (tier.toLowerCase()) {
      case "starter":
        return "text-blue-400";
      case "growth":
        return "text-green-400";
      case "pro":
        return "text-purple-400";
      case "elite":
        return "text-yellow-400";
      case "enterprise":
        return "text-orange-400";
      case "vault":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="w-full bg-black text-white font-rajdhani">
      {/* Header */}
      <div className="border-b border-yellow-600/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-600 flex items-center justify-center" style={{ borderRadius: 0 }}>
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold text-yellow-600 tracking-widest">
                LAUNCH SENTRY
              </h1>
              <p className="text-xs text-gray-400 mt-1">Revenue Forge • Real-Time Sales Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 ${wsConnected ? "bg-green-400" : "bg-red-400"}`}
              style={{ borderRadius: 0 }}
            />
            <span className="text-xs text-gray-400">
              {wsConnected ? "CONNECTED" : "DISCONNECTED"}
            </span>
          </div>
        </div>
      </div>

      {/* Neural Recon Priority Queue Alert */}
      {neuralReconActive && (
        <div
          className="bg-red-950 border-t-4 border-red-500 p-4 animate-pulse"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-orbitron text-sm font-bold text-red-400 tracking-wide">
                🚨 NEURAL RECON PRIORITY QUEUE ACTIVATED
              </p>
              <p className="text-xs text-red-300 mt-1">
                VAULT TIER PAYMENT DETECTED: {stats.lastTransaction && formatCurrency(stats.lastTransaction.amount)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-yellow-600/30">
        {/* Total Revenue */}
        <div className="bg-gray-900 p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest">TOTAL REVENUE</p>
          <p className="text-2xl font-bold text-yellow-600">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        {/* Transaction Count */}
        <div className="bg-gray-900 p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest">TRANSACTIONS</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.transactionCount}</p>
        </div>

        {/* Average Order Value */}
        <div className="bg-gray-900 p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest">AVG ORDER VALUE</p>
          <p className="text-2xl font-bold text-yellow-600">
            {formatCurrency(stats.averageOrderValue)}
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-gray-900 p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs text-gray-400 mb-2 font-orbitron tracking-widest">WS STATUS</p>
          <p className={`text-2xl font-bold ${wsConnected ? "text-green-400" : "text-red-400"}`}>
            {wsConnected ? "LIVE" : "OFFLINE"}
          </p>
        </div>
      </div>

      {/* Real-Time Sales Ticker */}
      <div className="p-6">
        <h2 className="text-lg font-orbitron font-bold text-yellow-600 mb-4 tracking-widest">
          REAL-TIME SALES TICKER
        </h2>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {salesEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Waiting for sales events...</p>
              <p className="text-xs mt-2">Connect to Hetzner Controller to see live transactions</p>
            </div>
          ) : (
            salesEvents.map((event) => (
              <div
                key={event.id}
                className={`flex items-center justify-between p-3 border-l-4 ${
                  event.amount >= 250000
                    ? "bg-red-950/50 border-red-500"
                    : "bg-gray-900/50 border-yellow-600/50"
                }`}
                style={{ borderRadius: 0 }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {event.amount >= 250000 ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {event.type === "checkout_completed" ? "Checkout Completed" : "Payment Succeeded"}
                    </p>
                    <p className={`text-xs font-orbitron tracking-wide ${getTierColor(event.tier)}`}>
                      {event.tier.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-yellow-600">{formatCurrency(event.amount)}</p>
                  <p className="text-xs text-gray-400">{formatTime(event.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-yellow-600/30 p-4 text-center">
        <p className="text-xs text-gray-500">
          Launch Sentry • Powered by ETHINX Revenue Forge • WebSocket: {wsConnected ? "🟢" : "🔴"}
        </p>
      </div>
    </div>
  );
};

export default LaunchSentry;
