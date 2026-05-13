import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useAudioTrigger } from "@/hooks/useAudioTrigger";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Wifi,
  WifiOff,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Database,
  RefreshCw,
} from "lucide-react";

// --- Types ---
interface MetricCard {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  status: "green" | "yellow" | "red";
}

interface SalesEvent {
  id: string | number;
  tier: string;
  amount: number;
  customer: string;
  timestamp: Date;
  type: "checkout" | "upsell" | "cross_sell";
}

// --- Constants ---
const TIER_COLORS: Record<string, string> = {
  Starter: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Growth: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Pro: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  Elite: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Enterprise: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Vault: "bg-primary/20 text-primary border-primary/30",
};

const TIER_PRICES: Record<string, number> = {
  Starter: 3900,
  Growth: 7900,
  Pro: 12900,
  Elite: 29900,
  Enterprise: 39000,
  Vault: 250000,
};

const CUSTOMER_NAMES = [
  "Alex M.", "Jordan K.", "Sam T.", "Riley P.", "Casey W.",
  "Morgan F.", "Drew L.", "Quinn R.", "Avery H.", "Blake N.",
  "Taylor S.", "Jamie C.", "Reese D.", "Parker B.", "Hayden G.",
];

function generateSalesEvent(): SalesEvent {
  const tiers = Object.keys(TIER_PRICES);
  const weights = [30, 25, 20, 12, 8, 5];
  const rand = Math.random() * 100;
  let cumulative = 0;
  let selectedTier = tiers[0];
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (rand <= cumulative) {
      selectedTier = tiers[i];
      break;
    }
  }

  const types: SalesEvent["type"][] = ["checkout", "upsell", "cross_sell"];
  const typeWeights = [60, 25, 15];
  const typeRand = Math.random() * 100;
  let typeCumulative = 0;
  let selectedType = types[0];
  for (let i = 0; i < typeWeights.length; i++) {
    typeCumulative += typeWeights[i];
    if (typeRand <= typeCumulative) {
      selectedType = types[i];
      break;
    }
  }

  return {
    id: crypto.randomUUID(),
    tier: selectedTier,
    amount: TIER_PRICES[selectedTier],
    customer: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
    timestamp: new Date(),
    type: selectedType,
  };
}

function getStatusColor(status: string) {
  switch (status) {
    case "green": return "text-green-400";
    case "yellow": return "text-amber-400";
    case "red": return "text-red-400";
    default: return "text-muted-foreground";
  }
}

function getStatusBg(status: string) {
  switch (status) {
    case "green": return "bg-green-500/10";
    case "yellow": return "bg-amber-500/10";
    case "red": return "bg-red-500/10";
    default: return "bg-muted";
  }
}

// --- Component ---
export default function Home() {
  // ─── Live Data Queries ──────────────────────────────────────────
  const salesQuery = trpc.sales.list.useQuery({ limit: 50 }, {
    refetchInterval: 5000, // Poll every 5 seconds for new events
  });
  const metricsQuery = trpc.sales.metrics.useQuery(undefined, {
    refetchInterval: 10000, // Poll every 10 seconds for metrics
  });
  const connectionQuery = trpc.connection.status.useQuery(undefined, {
    refetchInterval: 15000,
  });

  const isLive = metricsQuery.data?.hasLiveData ?? false;

  // ─── Simulation Fallback ────────────────────────────────────────
  const [simEvents, setSimEvents] = useState<SalesEvent[]>([]);
  const [simMetrics, setSimMetrics] = useState<MetricCard[]>([
    { label: "Forge Conversion Rate", value: "18.7%", change: 3.2, icon: TrendingUp, status: "green" },
    { label: "Total Revenue", value: "$47,832", change: 12.5, icon: DollarSign, status: "green" },
    { label: "Transactions", value: "1,247", change: -2.1, icon: ShoppingCart, status: "yellow" },
    { label: "Avg Order Value", value: "$127.40", change: 8.3, icon: BarChart3, status: "green" },
  ]);

  const addSimEvent = useCallback(() => {
    const event = generateSalesEvent();
    setSimEvents((prev) => [event, ...prev].slice(0, 50));
    setSimMetrics((prev) =>
      prev.map((m) => ({
        ...m,
        change: m.change + (Math.random() - 0.5) * 0.5,
        status:
          m.change > 5 ? "green" : m.change > 0 ? "yellow" : ("red" as "green" | "yellow" | "red"),
      }))
    );
  }, []);

  useEffect(() => {
    if (isLive) return; // Don't run simulation when live data exists

    const initial: SalesEvent[] = [];
    for (let i = 0; i < 8; i++) {
      const event = generateSalesEvent();
      event.timestamp = new Date(Date.now() - Math.random() * 3600000);
      initial.push(event);
    }
    initial.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setSimEvents(initial);

    const interval = setInterval(() => {
      addSimEvent();
    }, 4000 + Math.random() * 6000);

    return () => clearInterval(interval);
  }, [addSimEvent, isLive]);

  // ─── Unified Data ──────────────────────────────────────────────
  const displayEvents: SalesEvent[] = useMemo(() => {
    if (isLive && salesQuery.data) {
      return salesQuery.data.map((e) => ({
        id: e.id,
        tier: e.tier,
        amount: e.amountCents,
        customer: e.customer,
        timestamp: new Date(e.eventTimestamp),
        type: e.eventType === "cross_sell" ? "cross_sell" : e.eventType === "upsell" ? "upsell" : "checkout",
      }));
    }
    return simEvents;
  }, [isLive, salesQuery.data, simEvents]);

  const displayMetrics: MetricCard[] = useMemo(() => {
    if (isLive && metricsQuery.data) {
      const m = metricsQuery.data;
      return [
        {
          label: "Forge Conversion Rate",
          value: `${m.forgeConversionRate}%`,
          change: m.forgeConversionRate >= 15 ? 3.2 : m.forgeConversionRate >= 10 ? 1.5 : -2.1,
          icon: TrendingUp,
          status: (m.forgeConversionRate >= 15 ? "green" : m.forgeConversionRate >= 10 ? "yellow" : "red") as "green" | "yellow" | "red",
        },
        {
          label: "Total Revenue",
          value: `$${(m.totalRevenueCents / 100).toLocaleString("en-AU", { minimumFractionDigits: 0 })}`,
          change: m.totalRevenueCents > 0 ? 12.5 : 0,
          icon: DollarSign,
          status: (m.totalRevenueCents > 500000 ? "green" : m.totalRevenueCents > 100000 ? "yellow" : "red") as "green" | "yellow" | "red",
        },
        {
          label: "Transactions",
          value: m.transactionCount.toLocaleString(),
          change: m.transactionCount > 100 ? 5.3 : m.transactionCount > 10 ? 2.1 : -2.1,
          icon: ShoppingCart,
          status: (m.transactionCount > 100 ? "green" : m.transactionCount > 10 ? "yellow" : "red") as "green" | "yellow" | "red",
        },
        {
          label: "Avg Order Value",
          value: `$${(m.avgOrderValueCents / 100).toFixed(2)}`,
          change: m.avgOrderValueCents > 10000 ? 8.3 : m.avgOrderValueCents > 5000 ? 3.1 : -1.5,
          icon: BarChart3,
          status: (m.avgOrderValueCents > 10000 ? "green" : m.avgOrderValueCents > 5000 ? "yellow" : "red") as "green" | "yellow" | "red",
        },
      ];
    }
    return simMetrics;
  }, [isLive, metricsQuery.data, simMetrics]);

  const connectionStatus = connectionQuery.data;
  const hetznerStatus = connectionStatus?.hetzner?.status ?? "standby";
  const mode = connectionStatus?.mode ?? "simulation";

  const [systemUptime] = useState("99.7%");

  // ─── Audio Triggers ─────────────────────────────────────────────
  const { play } = useAudioTrigger();
  const prevEventCountRef = useRef<number>(0);

  // Play revenue_ping when new sales events arrive (live or sim)
  useEffect(() => {
    const currentCount = displayEvents.length;
    if (prevEventCountRef.current > 0 && currentCount > prevEventCountRef.current) {
      play("revenue_ping");
    }
    prevEventCountRef.current = currentCount;
  }, [displayEvents.length, play]);

  // ─── Revenue breakdown from live data ──────────────────────────
  const revenueByTier = useMemo(() => {
    if (isLive && metricsQuery.data?.revenueByTier) {
      return metricsQuery.data.revenueByTier;
    }
    return Object.entries(TIER_PRICES).map(([tier, price]) => ({
      tier,
      total: price,
      count: 0,
    }));
  }, [isLive, metricsQuery.data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-primary tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Command Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide">
            EthinX Empire OS — Real-Time Operations Monitor
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* System Uptime */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <Activity className="h-3 w-3 text-green-400" />
            <span className="text-muted-foreground">UPTIME</span>
            <span className="text-green-400 font-mono">{systemUptime}</span>
          </div>
          {/* Data Source Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <Database className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">SOURCE</span>
            <span className={`font-mono ${isLive ? "text-green-400" : "text-amber-400"}`}>
              {isLive ? "DB" : "SIM"}
            </span>
          </div>
          {/* Connection Mode */}
          <div className="flex items-center gap-2 px-3 py-1.5 industrial-border">
            {isLive ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-green-400" />
                <span className="text-[11px] text-green-400 tracking-wider font-semibold">LIVE</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground tracking-wider font-semibold">SIM</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric) => (
          <Card
            key={metric.label}
            className={`p-4 bg-card border-border hover:border-primary/30 transition-all duration-300 rounded-none ${getStatusBg(metric.status)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 ${getStatusBg(metric.status)} rounded-none`}>
                <metric.icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
              </div>
              <div className="flex items-center gap-1">
                {metric.change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-400" />
                )}
                <span
                  className={`text-xs font-mono ${metric.change >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {metric.change >= 0 ? "+" : ""}
                  {metric.change.toFixed(1)}%
                </span>
              </div>
            </div>
            <div
              className="text-2xl font-bold text-foreground mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {metric.value}
            </div>
            <div className="text-xs text-muted-foreground tracking-wider uppercase">
              {metric.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Launch Sentry + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Launch Sentry Ticker */}
        <div className="lg:col-span-2">
          <Card className="p-0 bg-card border-border rounded-none overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h2
                  className="text-sm font-bold text-primary tracking-wider"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  Launch Sentry
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {isLive && (
                  <button
                    onClick={() => salesQuery.refetch()}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Refresh events"
                  >
                    <RefreshCw className={`h-3 w-3 ${salesQuery.isFetching ? "animate-spin" : ""}`} />
                  </button>
                )}
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${isLive ? "bg-green-500" : "bg-amber-500"} animate-pulse`} />
                  <span className="text-[10px] text-muted-foreground tracking-wider">
                    {isLive ? "LIVE FEED" : "SIM FEED"}
                  </span>
                </div>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {displayEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-accent/5 transition-colors ${index === 0 ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {event.timestamp.toLocaleTimeString("en-AU", { hour12: false })}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`rounded-none text-[10px] px-2 py-0.5 ${TIER_COLORS[event.tier] || ""}`}
                    >
                      {event.tier.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-foreground">{event.customer}</span>
                    {event.type === "upsell" && (
                      <Badge variant="outline" className="rounded-none text-[9px] px-1.5 py-0 bg-violet-500/10 text-violet-400 border-violet-500/30">
                        UPSELL
                      </Badge>
                    )}
                    {event.type === "cross_sell" && (
                      <Badge variant="outline" className="rounded-none text-[9px] px-1.5 py-0 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                        X-SELL
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary font-mono">
                      ${(event.amount / 100).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">AUD</span>
                  </div>
                </div>
              ))}
              {displayEvents.length === 0 && (
                <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
                  Waiting for events...
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* System Status Panel */}
        <div className="space-y-4">
          {/* Infrastructure */}
          <Card className="p-4 bg-card border-border rounded-none">
            <h3
              className="text-xs font-bold text-primary tracking-wider mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Infrastructure
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Hetzner Node</span>
                <div className="flex items-center gap-1.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${hetznerStatus === "connected" ? "bg-green-500" : "bg-amber-500"}`} />
                  <span className={`text-[10px] font-mono ${hetznerStatus === "connected" ? "text-green-400" : "text-amber-400"}`}>
                    {hetznerStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">IP Address</span>
                <span className="text-[10px] text-foreground font-mono">
                  {connectionStatus?.hetzner?.ip ?? "91.99.162.243"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">WebSocket</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  :{connectionStatus?.hetzner?.port ?? 3001}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Netlify CDN</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-green-400 font-mono">
                    {connectionStatus?.netlify?.status?.toUpperCase() ?? "ACTIVE"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Cloudflare</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-green-400 font-mono">
                    {connectionStatus?.cloudflare?.status?.toUpperCase() ?? "ACTIVE"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">GCP APIs</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-green-400 font-mono">
                    {connectionStatus?.gcp?.status?.toUpperCase() ?? "READY"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Data Mode</span>
                <Badge
                  variant="outline"
                  className={`rounded-none text-[9px] px-2 py-0.5 ${
                    mode === "live"
                      ? "bg-green-500/10 text-green-400 border-green-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {mode.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="p-4 bg-card border-border rounded-none">
            <h3
              className="text-xs font-bold text-primary tracking-wider mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Revenue Breakdown
            </h3>
            <div className="space-y-2">
              {revenueByTier.map((item) => (
                <div key={item.tier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-none ${
                        item.tier === "Vault" ? "bg-primary" :
                        item.tier === "Enterprise" ? "bg-orange-500" :
                        item.tier === "Elite" ? "bg-amber-500" :
                        item.tier === "Pro" ? "bg-violet-500" :
                        item.tier === "Growth" ? "bg-blue-500" : "bg-emerald-500"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">{item.tier}</span>
                    {isLive && item.count > 0 && (
                      <span className="text-[9px] text-muted-foreground font-mono">({item.count})</span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-foreground">
                    ${isLive ? (item.total / 100).toLocaleString("en-AU", { minimumFractionDigits: 0 }) : (item.total / 100).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Empire Status */}
          <Card className="p-4 bg-card border-border rounded-none">
            <h3
              className="text-xs font-bold text-primary tracking-wider mb-3"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Empire Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Phase</span>
                <Badge variant="outline" className="rounded-none text-[10px] bg-primary/10 text-primary border-primary/30">
                  PHASE 1 ACTIVE
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Sprint</span>
                <span className="text-[10px] text-foreground font-mono">Creator's Edge</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Day</span>
                <span className="text-[10px] text-foreground font-mono">3 / 7</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
