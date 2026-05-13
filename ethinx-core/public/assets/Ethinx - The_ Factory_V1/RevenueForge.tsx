import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAudioTrigger } from "@/hooks/useAudioTrigger";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Flame,
  Shield,
  AlertTriangle,
  TrendingUp,
  Zap,
  ChevronRight,
  Database,
} from "lucide-react";

// --- Types ---
interface UpsellConfig {
  tier: string;
  basePrice: number;
  upsellName: string;
  upsellPrice: number;
  bundleDiscount: number;
  features: string[];
  target: string;
  upsellType: "anchor" | "standard" | "whale";
}

type UrgencyLevel = "medium" | "high" | "critical";

// --- Data ---
const UPSELL_CONFIGS: UpsellConfig[] = [
  {
    tier: "Starter",
    basePrice: 3900,
    upsellName: "Pro-Growth Accelerator",
    upsellPrice: 4900,
    bundleDiscount: 20,
    features: ["Advanced Analytics", "Priority Support", "Weekly Reports", "Benchmarking"],
    target: "Scale-focused founders",
    upsellType: "anchor",
  },
  {
    tier: "Growth",
    basePrice: 7900,
    upsellName: "Pro-Growth Accelerator",
    upsellPrice: 4900,
    bundleDiscount: 20,
    features: ["Advanced Analytics", "Priority Support", "Weekly Reports", "Benchmarking"],
    target: "Scale-focused founders",
    upsellType: "anchor",
  },
  {
    tier: "Pro",
    basePrice: 12900,
    upsellName: "Bio Suite",
    upsellPrice: 2900,
    bundleDiscount: 15,
    features: ["Analytics Dashboard", "Priority Support", "API Integrations", "Custom Reports"],
    target: "Feature expansion",
    upsellType: "standard",
  },
  {
    tier: "Elite",
    basePrice: 29900,
    upsellName: "Bio Suite",
    upsellPrice: 2900,
    bundleDiscount: 15,
    features: ["Analytics Dashboard", "Priority Support", "API Integrations", "Custom Reports"],
    target: "Feature expansion",
    upsellType: "standard",
  },
  {
    tier: "Enterprise",
    basePrice: 39000,
    upsellName: "Bio Suite",
    upsellPrice: 2900,
    bundleDiscount: 15,
    features: ["Analytics Dashboard", "Priority Support", "API Integrations", "Custom Reports"],
    target: "Feature expansion",
    upsellType: "standard",
  },
  {
    tier: "Vault",
    basePrice: 250000,
    upsellName: "Neural Priority Pipeline",
    upsellPrice: 19900,
    bundleDiscount: 15,
    features: ["60-min Turnaround", "Dedicated Manager", "Priority Queue", "SLA Guarantee"],
    target: "Premium service guarantee",
    upsellType: "whale",
  },
];

function getUrgencyLevel(slots: number): UrgencyLevel {
  if (slots <= 2) return "critical";
  if (slots <= 3) return "high";
  return "medium";
}

function getUrgencyColor(level: UrgencyLevel) {
  switch (level) {
    case "critical": return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", dot: "bg-red-500" };
    case "high": return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-500" };
    case "medium": return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", dot: "bg-green-500" };
  }
}

function getUpsellTypeColor(type: string) {
  switch (type) {
    case "anchor": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "whale": return "bg-primary/10 text-primary border-primary/30";
    default: return "bg-blue-500/10 text-blue-400 border-blue-500/30";
  }
}

// --- Component ---
export default function RevenueForge() {
  const [selectedTier, setSelectedTier] = useState<string>("Starter");
  const [prioritySlots, setPrioritySlots] = useState(5);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const [bumpEnabled, setBumpEnabled] = useState(false);
  const decrementTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Audio Triggers ─────────────────────────────────────────────
  const { play } = useAudioTrigger();
  const prevSlotsRef = useRef<number>(5);

  // Play revenue_ping when scarcity slots hit critical (<=2)
  useEffect(() => {
    if (prioritySlots <= 2 && prevSlotsRef.current > 2) {
      play("revenue_ping");
    }
    prevSlotsRef.current = prioritySlots;
  }, [prioritySlots, play]);

  // ─── Live Data Queries ──────────────────────────────────────────
  const metricsQuery = trpc.sales.metrics.useQuery(undefined, {
    refetchInterval: 10000,
  });
  const connectionQuery = trpc.connection.status.useQuery(undefined, {
    refetchInterval: 15000,
  });

  const isLive = metricsQuery.data?.hasLiveData ?? false;
  const mode = connectionQuery.data?.mode ?? "simulation";

  const liveForgeMetrics = useMemo(() => {
    if (!isLive || !metricsQuery.data) return null;
    const m = metricsQuery.data;
    return {
      forgeConversion: m.forgeConversionRate,
      checkouts: m.transactionCount,
      upsells: m.upsellCount,
      upsellRevenue: m.totalRevenueCents,
    };
  }, [isLive, metricsQuery.data]);

  const selectedConfig = UPSELL_CONFIGS.find((c) => c.tier === selectedTier)!;
  const urgencyLevel = getUrgencyLevel(prioritySlots);
  const urgencyColors = getUrgencyColor(urgencyLevel);

  // Scarcity Engine: Random decrement every 8-12 seconds
  const scheduleDecrement = useCallback(() => {
    const delay = 8000 + Math.random() * 4000;
    decrementTimeoutRef.current = setTimeout(() => {
      setPrioritySlots((prev) => {
        if (prev <= 1) {
          // Reset to 3-5 after hitting bottom
          return Math.floor(Math.random() * 3) + 3;
        }
        setIsDecrementing(true);
        setTimeout(() => setIsDecrementing(false), 500);
        return prev - 1;
      });
      scheduleDecrement();
    }, delay);
  }, []);

  useEffect(() => {
    scheduleDecrement();
    return () => {
      if (decrementTimeoutRef.current) {
        clearTimeout(decrementTimeoutRef.current);
      }
    };
  }, [scheduleDecrement]);

  // Calculate bundle pricing
  const bundleTotal = selectedConfig.basePrice + selectedConfig.upsellPrice;
  const discountAmount = Math.round(bundleTotal * (selectedConfig.bundleDiscount / 100));
  const finalPrice = bundleTotal - discountAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-primary tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Revenue Forge V2
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide">
            Advanced Behavioral Upsell Engine — Simulation Interface
          </p>
        </div>
        <Badge
          variant="outline"
          className={`rounded-none text-[10px] ${
            isLive
              ? "bg-green-500/10 text-green-400 border-green-500/30"
              : "bg-primary/10 text-primary border-primary/30"
          }`}
        >
          {isLive ? "LIVE DATA" : "SIMULATION MODE"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tier Selector + Scarcity Engine */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tier Selector */}
          <Card className="p-4 bg-card border-border rounded-none">
            <h2
              className="text-xs font-bold text-primary tracking-wider mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Select Tier
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {UPSELL_CONFIGS.map((config) => (
                <button
                  key={config.tier}
                  onClick={() => setSelectedTier(config.tier)}
                  className={`p-3 text-center transition-all duration-200 border ${
                    selectedTier === config.tier
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <div className="text-xs font-semibold tracking-wider">{config.tier}</div>
                  <div className="text-[10px] font-mono mt-1">
                    ${(config.basePrice / 100).toFixed(0)}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Scarcity Engine */}
          <Card className={`p-4 bg-card rounded-none transition-all duration-300 ${urgencyLevel === "critical" ? "border-red-500/50 animate-neural-pulse" : urgencyLevel === "high" ? "border-amber-500/30" : "border-border"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                <h2
                  className="text-xs font-bold text-primary tracking-wider"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Scarcity Engine
                </h2>
              </div>
              <Badge
                variant="outline"
                className={`rounded-none text-[10px] ${urgencyColors.bg} ${urgencyColors.text} ${urgencyColors.border}`}
              >
                {urgencyLevel.toUpperCase()}
              </Badge>
            </div>

            {/* Priority Slots Display */}
            <div className="flex items-center justify-center gap-3 py-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 flex items-center justify-center border-2 transition-all duration-300 ${
                    i < prioritySlots
                      ? `${urgencyColors.border} ${urgencyColors.bg} ${isDecrementing && i === prioritySlots - 1 ? "animate-slot-decrement" : ""}`
                      : "border-border/30 bg-secondary/30"
                  }`}
                >
                  <span
                    className={`text-lg font-bold ${i < prioritySlots ? urgencyColors.text : "text-muted-foreground/30"}`}
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div
                className={`text-3xl font-bold ${urgencyColors.text} mb-1`}
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {prioritySlots}
              </div>
              <div className="text-xs text-muted-foreground tracking-wider">
                PRIORITY SLOTS REMAINING
              </div>
              {urgencyLevel === "critical" && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  <span className="text-xs text-red-400 tracking-wider font-semibold animate-pulse">
                    CRITICAL — SLOTS ALMOST DEPLETED
                  </span>
                </div>
              )}
              {urgencyLevel === "high" && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs text-amber-400 tracking-wider font-semibold">
                    HIGH DEMAND — ACT NOW
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Upsell Preview */}
          <Card className="p-4 bg-card border-border rounded-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h2
                  className="text-xs font-bold text-primary tracking-wider"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Upsell Preview: {selectedConfig.upsellName}
                </h2>
              </div>
              <Badge
                variant="outline"
                className={`rounded-none text-[10px] ${getUpsellTypeColor(selectedConfig.upsellType)}`}
              >
                {selectedConfig.upsellType.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Features */}
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground tracking-wider mb-2">INCLUDED FEATURES</div>
                {selectedConfig.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-primary" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="text-[10px] text-muted-foreground tracking-wider">TARGET SEGMENT</div>
                  <div className="text-xs text-foreground mt-1">{selectedConfig.target}</div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground tracking-wider mb-2">PRICING BREAKDOWN</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{selectedConfig.tier} Tier</span>
                    <span className="text-xs font-mono text-foreground">
                      ${(selectedConfig.basePrice / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{selectedConfig.upsellName}</span>
                    <span className="text-xs font-mono text-foreground">
                      +${(selectedConfig.upsellPrice / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-green-400">
                    <span className="text-xs">Bundle Discount ({selectedConfig.bundleDiscount}%)</span>
                    <span className="text-xs font-mono">
                      -${(discountAmount / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary tracking-wider">TOTAL</span>
                    <span
                      className="text-lg font-bold text-primary"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      ${(finalPrice / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground text-right">AUD</div>
                </div>

                {/* Order Bump Toggle */}
                <button
                  onClick={() => setBumpEnabled(!bumpEnabled)}
                  className={`w-full p-3 border transition-all duration-200 flex items-center justify-between ${
                    bumpEnabled
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 border flex items-center justify-center ${
                        bumpEnabled ? "border-primary bg-primary" : "border-muted-foreground"
                      }`}
                    >
                      {bumpEnabled && <span className="text-[10px] text-primary-foreground font-bold">✓</span>}
                    </div>
                    <span className="text-xs text-foreground">Add {selectedConfig.upsellName}</span>
                  </div>
                  <span className="text-xs font-mono text-primary">
                    +${(selectedConfig.upsellPrice / 100).toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Risk Reversal + Forge Metrics */}
        <div className="space-y-4">
          {/* T-Dog Certified Badge */}
          <Card className="p-4 bg-card border-border rounded-none">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h3
                className="text-xs font-bold text-primary tracking-wider"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Risk Reversal
              </h3>
            </div>
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 bg-primary/5">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div
                    className="text-xs font-bold text-primary tracking-wider"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    T-DOG CERTIFIED
                  </div>
                  <div className="text-[9px] text-muted-foreground tracking-wider">
                    HARDENED SECURITY & FBT COMPLIANCE
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2">
              30-Day Money-Back Guarantee
            </div>
            <div className="text-[10px] text-muted-foreground text-center mt-1">
              All tiers include FBT compliance verification
            </div>
          </Card>

          {/* Forge Metrics */}
          <Card className="p-4 bg-card border-border rounded-none">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3
                className="text-xs font-bold text-primary tracking-wider"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Forge Metrics
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground tracking-wider">FORGE CONVERSION</span>
                  <span className="text-xs font-mono text-green-400">
                    {liveForgeMetrics ? `${liveForgeMetrics.forgeConversion}%` : "18.7%"}
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-none overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${((liveForgeMetrics?.forgeConversion ?? 18.7) / 25) * 100}%` }}
                  />
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">Target: 15-25%</div>
              </div>
              {isLive && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Database className="h-3 w-3 text-green-400" />
                  <span className="text-[9px] text-green-400 tracking-wider">LIVE METRICS</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-secondary/50">
                  <div className="text-[10px] text-muted-foreground">Checkouts</div>
                  <div className="text-sm font-bold text-foreground font-mono">
                    {liveForgeMetrics ? liveForgeMetrics.checkouts.toLocaleString() : "1,247"}
                  </div>
                </div>
                <div className="p-2 bg-secondary/50">
                  <div className="text-[10px] text-muted-foreground">Upsells</div>
                  <div className="text-sm font-bold text-foreground font-mono">
                    {liveForgeMetrics ? liveForgeMetrics.upsells.toLocaleString() : "233"}
                  </div>
                </div>
                <div className="p-2 bg-secondary/50">
                  <div className="text-[10px] text-muted-foreground">Anchor</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">
                    {isLive ? "-" : "98"}
                  </div>
                </div>
                <div className="p-2 bg-secondary/50">
                  <div className="text-[10px] text-muted-foreground">Whale</div>
                  <div className="text-sm font-bold text-primary font-mono">
                    {isLive ? "-" : "12"}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground tracking-wider">UPSELL REVENUE</span>
                  <span
                    className="text-sm font-bold text-primary"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {liveForgeMetrics
                      ? `$${(liveForgeMetrics.upsellRevenue / 100).toLocaleString("en-AU", { minimumFractionDigits: 0 })}`
                      : "$12,847"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Conversion Optimization */}
          <Card className="p-4 bg-card border-border rounded-none">
            <h3
              className="text-xs font-bold text-primary tracking-wider mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Optimization Tactics
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Scarcity Engine</span>
                <span className="text-[10px] text-green-400 font-mono">+15-20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Risk Reversal</span>
                <span className="text-[10px] text-green-400 font-mono">+10-15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Post-Purchase X-Sell</span>
                <span className="text-[10px] text-green-400 font-mono">+5-10%</span>
              </div>
              <div className="border-t border-border/50 pt-2 flex items-center justify-between">
                <span className="text-xs text-primary font-semibold">Combined Lift</span>
                <span className="text-xs text-primary font-mono font-bold">+30-45%</span>
              </div>
            </div>
          </Card>

          {/* Simulate Checkout */}
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-bold tracking-wider h-12"
            style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.75rem" }}
            onClick={() => {
              // Simulation only
              setBumpEnabled(false);
              setPrioritySlots(Math.floor(Math.random() * 3) + 3);
            }}
          >
            SIMULATE CHECKOUT
          </Button>
        </div>
      </div>
    </div>
  );
}
