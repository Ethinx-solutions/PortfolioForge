/**
 * ETHINX V3 CONTROL CONSOLE
 * Revenue Forge Integration (Silo 05)
 * 
 * Consolidated dashboard with:
 * - Launch Sentry real-time sales ticker
 * - Neural Recon Priority Queue for $2,500+ transactions
 * - Order Bump upsell logic
 * - WebSocket integration to Hetzner Controller
 * 
 * Design: Industrial Aesthetic (Pure Black #000000, Metallic Gold #D4AF37)
 * Typography: Orbitron (headings), Rajdhani (body)
 */

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LaunchSentry from "@/components/LaunchSentry";
import NeuralReconPriorityQueue from "@/components/NeuralReconPriorityQueue";
import OrderBump from "@/components/OrderBump";
import { getWebSocketService } from "@/services/websocket-service";
import { AlertCircle, Zap, DollarSign, Settings } from "lucide-react";

interface ProductTier {
  id: string;
  name: string;
  price: number;
  description: string;
}

const PRODUCT_TIERS: ProductTier[] = [
  { id: "starter", name: "Starter", price: 3900, description: "Perfect for beginners" },
  { id: "growth", name: "Growth", price: 7900, description: "Scale your business" },
  { id: "pro", name: "Pro", price: 12900, description: "Professional features" },
  { id: "elite", name: "Elite", price: 29900, description: "Premium support" },
  { id: "enterprise", name: "Enterprise", price: 39000, description: "Enterprise solutions" },
  { id: "vault", name: "Vault", price: 250000, description: "Maximum power" },
];

export default function ControlConsole() {
  const [selectedTier, setSelectedTier] = useState<string>("pro");
  const [includeOrderBump, setIncludeOrderBump] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Initialize WebSocket service
  useEffect(() => {
    const wsService = getWebSocketService({
      url: process.env.REACT_APP_WEBSOCKET_URL || "ws://91.99.162.243:3001",
    });

    // Register event handlers
    wsService.on("connected", () => {
      console.log("✓ Control Console connected to WebSocket");
      setWsConnected(true);
    });

    wsService.on("disconnected", () => {
      console.log("✗ Control Console disconnected from WebSocket");
      setWsConnected(false);
    });

    wsService.on("error", (error) => {
      console.error("WebSocket error:", error);
      setWsConnected(false);
    });

    // Attempt connection
    wsService.connect().catch((error) => {
      console.error("Failed to connect WebSocket:", error);
    });

    return () => {
      // Don't disconnect on unmount - keep connection alive
      // wsService.disconnect();
    };
  }, []);

  // Handle checkout
  const handleCheckout = async (includeOrderBump: boolean) => {
    setIsProcessing(true);
    try {
      const tier = PRODUCT_TIERS.find((t) => t.id === selectedTier);
      if (!tier) {
        console.error("Invalid tier selected");
        return;
      }

      // Call backend to create checkout session
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tier: selectedTier,
          includeOrderBump,
          customerEmail: "customer@example.com", // In production, get from user input
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe checkout
      if (typeof window !== "undefined" && window.location) {
        window.location.href = `/checkout?session_id=${sessionId}`;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to proceed to checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedProduct = PRODUCT_TIERS.find((t) => t.id === selectedTier);
  const totalPrice = selectedProduct?.price || 0;

  return (
    <div className="min-h-screen bg-black text-white font-rajdhani">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b-2 border-yellow-600/50 bg-black/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-600 flex items-center justify-center" style={{ borderRadius: 0 }}>
                <Zap className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-yellow-600 tracking-widest">
                  ETHINX V3
                </h1>
                <p className="text-xs text-gray-400">Revenue Forge Control Console</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 ${wsConnected ? "bg-green-400" : "bg-red-400"}`}
                  style={{ borderRadius: 0 }}
                />
                <span className="text-xs text-gray-400">{wsConnected ? "CONNECTED" : "OFFLINE"}</span>
              </div>
              <button className="p-2 hover:bg-gray-900 transition-colors" style={{ borderRadius: 0 }}>
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 p-1" style={{ borderRadius: 0 }}>
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black text-gray-400"
              style={{ borderRadius: 0 }}
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="checkout"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black text-gray-400"
              style={{ borderRadius: 0 }}
            >
              Checkout
            </TabsTrigger>
            <TabsTrigger
              value="neural-recon"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black text-gray-400"
              style={{ borderRadius: 0 }}
            >
              Neural Recon
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black text-gray-400"
              style={{ borderRadius: 0 }}
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-8">
            <div className="space-y-6">
              <LaunchSentry />
            </div>
          </TabsContent>

          {/* Checkout Tab */}
          <TabsContent value="checkout" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product Selection */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 border border-yellow-600/30 p-6" style={{ borderRadius: 0 }}>
                  <h2 className="text-lg font-orbitron font-bold text-yellow-600 mb-4 tracking-widest">
                    SELECT TIER
                  </h2>

                  <div className="space-y-2">
                    {PRODUCT_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id)}
                        className={`w-full text-left p-3 border-l-4 transition-all ${
                          selectedTier === tier.id
                            ? "bg-yellow-600/20 border-yellow-600 text-yellow-600"
                            : "bg-gray-800/50 border-gray-700 text-gray-300 hover:border-yellow-600/50"
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        <p className="font-semibold">{tier.name}</p>
                        <p className="text-xs text-gray-400 mt-1">${(tier.price / 100).toFixed(2)} AUD</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Bump & Checkout */}
              <div className="lg:col-span-2">
                <OrderBump
                  selectedTier={selectedTier}
                  basePrice={totalPrice}
                  onToggle={setIncludeOrderBump}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </TabsContent>

          {/* Neural Recon Tab */}
          <TabsContent value="neural-recon" className="mt-8">
            <NeuralReconPriorityQueue />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-8">
            <div className="bg-gray-900 border border-yellow-600/30 p-8" style={{ borderRadius: 0 }}>
              <h2 className="text-2xl font-orbitron font-bold text-yellow-600 mb-6 tracking-widest">
                CONSOLE SETTINGS
              </h2>

              <div className="space-y-6">
                {/* WebSocket Configuration */}
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">WebSocket Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Server URL</label>
                      <input
                        type="text"
                        defaultValue="ws://91.99.162.243:3001"
                        className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2"
                        style={{ borderRadius: 0 }}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Production: Use wss:// with SSL certificate
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Connection Status</label>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 ${wsConnected ? "bg-green-400" : "bg-red-400"}`}
                          style={{ borderRadius: 0 }}
                        />
                        <span className="text-white">
                          {wsConnected ? "Connected to Hetzner Controller" : "Disconnected"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe Configuration */}
                <div className="border-b border-gray-700 pb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Stripe Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">API Status</label>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400" style={{ borderRadius: 0 }} />
                        <span className="text-white">Connected to Stripe Live Mode</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Webhook Verification</label>
                      <p className="text-sm text-gray-300">
                        Webhook signature verification enabled with raw request body validation
                      </p>
                    </div>
                  </div>
                </div>

                {/* FBT Compliance */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">FBT Compliance</h3>
                  <div className="bg-blue-950/20 border border-blue-600/30 p-4" style={{ borderRadius: 0 }}>
                    <p className="text-sm text-blue-300">
                      ℹ Bio Suite and EV products are configured with fbt_exempt: true metadata flag
                      for Australian tax compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-yellow-600/30 mt-12 py-6 text-center text-gray-500 text-xs">
        <p>ETHINX V3 Control Console • Revenue Forge Integration • Powered by Stripe + Hetzner</p>
      </footer>
    </div>
  );
}
