import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useAudioTrigger } from "@/hooks/useAudioTrigger";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Brain,
  AlertTriangle,
  X,
  Zap,
  Shield,
  DollarSign,
  Clock,
  User,
  RefreshCw,
  Database,
} from "lucide-react";

// --- Types ---
interface NeuralAlertDisplay {
  id: string | number;
  customer: string;
  amount: number;
  tier: string;
  timestamp: Date;
  priority: "standard" | "high" | "critical";
  status: "new" | "acknowledged" | "processed" | "dismissed";
  sessionId: string;
}

// --- Simulation Data ---
const HIGH_VALUE_NAMES = [
  "Victoria C.", "Sebastian R.", "Alexander M.", "Isabella K.",
  "Maximilian W.", "Charlotte D.", "Theodore J.", "Arabella F.",
  "Constantine P.", "Valentina S.",
];

const ALERT_TIERS = ["Vault", "Enterprise", "Elite"];

function generateAlert(): NeuralAlertDisplay {
  const tier = ALERT_TIERS[Math.floor(Math.random() * ALERT_TIERS.length)];
  const baseAmounts: Record<string, number> = {
    Vault: 250000,
    Enterprise: 39000,
    Elite: 29900,
  };
  const amount = baseAmounts[tier] || 29900;
  const priority = tier === "Vault" ? "critical" : tier === "Enterprise" ? "high" : "standard";

  return {
    id: crypto.randomUUID(),
    customer: HIGH_VALUE_NAMES[Math.floor(Math.random() * HIGH_VALUE_NAMES.length)],
    amount,
    tier,
    timestamp: new Date(),
    priority,
    status: "new",
    sessionId: `sess_${Math.random().toString(36).substring(2, 10)}`,
  };
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "critical": return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/40", glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]" };
    case "high": return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]" };
    default: return { text: "text-primary", bg: "bg-primary/10", border: "border-primary/30", glow: "" };
  }
}

// --- Component ---
export default function NeuralRecon() {
  // ─── Live Data Queries ──────────────────────────────────────────
  const alertsQuery = trpc.alerts.list.useQuery({ limit: 30 }, {
    refetchInterval: 5000,
  });
  const statsQuery = trpc.alerts.stats.useQuery(undefined, {
    refetchInterval: 10000,
  });
  const connectionQuery = trpc.connection.status.useQuery(undefined, {
    refetchInterval: 15000,
  });

  const isLive = connectionQuery.data?.hasLiveData ?? false;

  const acknowledgeMutation = trpc.alerts.acknowledge.useMutation({
    onSuccess: () => {
      alertsQuery.refetch();
      statsQuery.refetch();
    },
  });
  const dismissMutation = trpc.alerts.dismiss.useMutation({
    onSuccess: () => {
      alertsQuery.refetch();
      statsQuery.refetch();
    },
  });

  // ─── Simulation Fallback ────────────────────────────────────────
  const [simAlerts, setSimAlerts] = useState<NeuralAlertDisplay[]>([]);
  const [simStats, setSimStats] = useState({
    total: 47,
    criticalPending: 3,
    vaultTransactions: 12,
  });
  const [fullScreenAlert, setFullScreenAlert] = useState<NeuralAlertDisplay | null>(null);

  // ─── Audio Triggers ─────────────────────────────────────────────
  const { play } = useAudioTrigger();
  const prevAlertCountRef = useRef<number>(0);

  const addSimAlert = useCallback(() => {
    const alert = generateAlert();
    setSimAlerts((prev) => [alert, ...prev].slice(0, 30));

    if (alert.tier === "Vault") {
      setFullScreenAlert(alert);
    }

    setSimStats((prev) => ({
      total: prev.total + 1,
      criticalPending: alert.priority === "critical" ? prev.criticalPending + 1 : prev.criticalPending,
      vaultTransactions: alert.tier === "Vault" ? prev.vaultTransactions + 1 : prev.vaultTransactions,
    }));
  }, []);

  useEffect(() => {
    if (isLive) return;

    const initial: NeuralAlertDisplay[] = [];
    for (let i = 0; i < 6; i++) {
      const alert = generateAlert();
      alert.timestamp = new Date(Date.now() - Math.random() * 7200000);
      alert.status = i < 2 ? "new" : i < 4 ? "acknowledged" : "processed";
      initial.push(alert);
    }
    initial.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setSimAlerts(initial);

    const interval = setInterval(() => {
      addSimAlert();
    }, 12000 + Math.random() * 18000);

    return () => clearInterval(interval);
  }, [addSimAlert, isLive]);

  // ─── Unified Data ──────────────────────────────────────────────
  const displayAlerts: NeuralAlertDisplay[] = useMemo(() => {
    if (isLive && alertsQuery.data) {
      return alertsQuery.data.map((a) => ({
        id: a.id,
        customer: a.customer,
        amount: a.amountCents,
        tier: a.tier,
        timestamp: new Date(a.createdAt),
        priority: a.priority as "standard" | "high" | "critical",
        status: a.status as "new" | "acknowledged" | "processed" | "dismissed",
        sessionId: a.sessionId || `sess_${a.id}`,
      }));
    }
    return simAlerts;
  }, [isLive, alertsQuery.data, simAlerts]);

  const displayStats = useMemo(() => {
    if (isLive && statsQuery.data) {
      return statsQuery.data;
    }
    return simStats;
  }, [isLive, statsQuery.data, simStats]);

  const acknowledgeAlert = (id: string | number) => {
    if (isLive && typeof id === "number") {
      acknowledgeMutation.mutate({ id });
    } else {
      setSimAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "acknowledged" as const } : a))
      );
    }
  };

  const dismissFullScreen = () => {
    setFullScreenAlert(null);
  };

  // Play system_hardened when new alerts arrive
  useEffect(() => {
    const currentCount = displayAlerts.length;
    if (prevAlertCountRef.current > 0 && currentCount > prevAlertCountRef.current) {
      play("system_hardened");
    }
    prevAlertCountRef.current = currentCount;
  }, [displayAlerts.length, play]);

  // Check for new Vault alerts from live data to trigger full-screen overlay
  useEffect(() => {
    if (!isLive || !alertsQuery.data) return;
    const newVaultAlert = alertsQuery.data.find(
      (a) => a.tier === "Vault" && a.status === "new" && a.priority === "critical"
    );
    if (newVaultAlert && !fullScreenAlert) {
      // Play revenue_ping for critical Vault transactions (high-value revenue event)
      play("revenue_ping");
      setFullScreenAlert({
        id: newVaultAlert.id,
        customer: newVaultAlert.customer,
        amount: newVaultAlert.amountCents,
        tier: newVaultAlert.tier,
        timestamp: new Date(newVaultAlert.createdAt),
        priority: "critical",
        status: "new",
        sessionId: newVaultAlert.sessionId || `sess_${newVaultAlert.id}`,
      });
    }
  }, [alertsQuery.data, isLive, fullScreenAlert, play]);

  return (
    <div className="space-y-6 relative">
      {/* Full-Screen Alert Overlay */}
      {fullScreenAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-full h-1 bg-red-500/30 animate-scan-line" />
          </div>

          <div className="relative max-w-lg w-full mx-4 animate-neural-pulse">
            <Card className="p-8 bg-card border-2 border-red-500/50 rounded-none">
              <button
                onClick={dismissFullScreen}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-500/10 border border-red-500/30 animate-pulse">
                  <AlertTriangle className="h-12 w-12 text-red-400" />
                </div>
              </div>

              <h2
                className="text-center text-xl font-bold text-red-400 tracking-wider mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                NEURAL RECON ALERT
              </h2>
              <p className="text-center text-xs text-muted-foreground tracking-wider mb-6">
                HIGH-VALUE TRANSACTION DETECTED
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Amount</span>
                  </div>
                  <span
                    className="text-lg font-bold text-primary"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    ${(fullScreenAlert.amount / 100).toFixed(2)} AUD
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Customer</span>
                  </div>
                  <span className="text-sm text-foreground">{fullScreenAlert.customer}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Tier</span>
                  </div>
                  <Badge variant="outline" className="rounded-none text-[10px] bg-primary/10 text-primary border-primary/30">
                    {fullScreenAlert.tier.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Session</span>
                  </div>
                  <span className="text-xs text-foreground font-mono">{fullScreenAlert.sessionId}</span>
                </div>
                {isLive && (
                  <div className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-muted-foreground">Source</span>
                    </div>
                    <Badge variant="outline" className="rounded-none text-[9px] bg-green-500/10 text-green-400 border-green-500/30">
                      LIVE DATA
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    if (isLive && typeof fullScreenAlert.id === "number") {
                      acknowledgeMutation.mutate({ id: fullScreenAlert.id });
                    }
                    dismissFullScreen();
                  }}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-bold tracking-wider h-11"
                  style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.7rem" }}
                >
                  ACKNOWLEDGE
                </Button>
                <Button
                  onClick={() => {
                    if (isLive && typeof fullScreenAlert.id === "number") {
                      dismissMutation.mutate({ id: fullScreenAlert.id });
                    }
                    dismissFullScreen();
                  }}
                  variant="outline"
                  className="flex-1 rounded-none font-bold tracking-wider h-11 border-primary/30 text-primary hover:bg-primary/10"
                  style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.7rem" }}
                >
                  DISMISS
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-primary tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Neural Recon
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide">
            Priority Queue — Sensory Alert System for High-Value Transactions
            {isLive && <span className="ml-2 text-green-400">[LIVE]</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <Button
              onClick={() => { alertsQuery.refetch(); statsQuery.refetch(); }}
              variant="outline"
              className="rounded-none border-primary/30 text-primary hover:bg-primary/10 tracking-wider text-xs"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${alertsQuery.isFetching ? "animate-spin" : ""}`} />
              REFRESH
            </Button>
          )}
          {!isLive && (
            <Button
              onClick={addSimAlert}
              variant="outline"
              className="rounded-none border-primary/30 text-primary hover:bg-primary/10 tracking-wider text-xs"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              SIMULATE ALERT
            </Button>
          )}
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-card border-border rounded-none">
          <div className="text-[10px] text-muted-foreground tracking-wider mb-1">TOTAL ALERTS</div>
          <div
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {displayStats.total}
          </div>
        </Card>
        <Card className="p-4 bg-card border-border rounded-none">
          <div className="text-[10px] text-muted-foreground tracking-wider mb-1">CRITICAL PENDING</div>
          <div
            className="text-2xl font-bold text-red-400"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {displayStats.criticalPending}
          </div>
        </Card>
        <Card className="p-4 bg-card border-border rounded-none">
          <div className="text-[10px] text-muted-foreground tracking-wider mb-1">AVG RESPONSE</div>
          <div
            className="text-2xl font-bold text-green-400"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            4.2s
          </div>
        </Card>
        <Card className="p-4 bg-card border-border rounded-none">
          <div className="text-[10px] text-muted-foreground tracking-wider mb-1">VAULT TRANSACTIONS</div>
          <div
            className="text-2xl font-bold text-primary"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            {displayStats.vaultTransactions}
          </div>
        </Card>
      </div>

      {/* Alert Queue */}
      <Card className="p-0 bg-card border-border rounded-none overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <h2
              className="text-sm font-bold text-primary tracking-wider"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Priority Queue
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`rounded-none text-[9px] px-2 py-0.5 ${
                isLive
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {isLive ? "LIVE" : "SIM"}
            </Badge>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-[9px] text-muted-foreground">CRITICAL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-[9px] text-muted-foreground">HIGH</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[9px] text-muted-foreground">STANDARD</span>
            </div>
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {displayAlerts.map((alert) => {
            const colors = getPriorityColor(alert.priority);
            return (
              <div
                key={alert.id}
                className={`flex items-center justify-between px-4 py-3 border-b border-border/50 transition-all duration-300 hover:bg-accent/5 ${
                  alert.status === "new" ? `${colors.bg} ${colors.glow}` : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-1 ${alert.priority === "critical" ? "bg-red-500" : alert.priority === "high" ? "bg-amber-500" : "bg-primary"} ${alert.status === "new" ? "animate-pulse" : ""}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm text-foreground font-semibold">{alert.customer}</span>
                      <Badge
                        variant="outline"
                        className={`rounded-none text-[9px] px-1.5 py-0 ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        {alert.tier.toUpperCase()}
                      </Badge>
                      {alert.status === "new" && (
                        <Badge variant="outline" className="rounded-none text-[9px] px-1.5 py-0 bg-red-500/10 text-red-400 border-red-500/30 animate-pulse">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {alert.timestamp.toLocaleTimeString("en-AU", { hour12: false })}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {alert.sessionId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold font-mono ${colors.text}`}>
                    ${(alert.amount / 100).toFixed(2)}
                  </span>
                  {alert.status === "new" && (
                    <Button
                      onClick={() => acknowledgeAlert(alert.id)}
                      variant="outline"
                      size="sm"
                      className="rounded-none text-[10px] h-7 px-2 border-primary/30 text-primary hover:bg-primary/10"
                    >
                      ACK
                    </Button>
                  )}
                  {alert.status === "acknowledged" && (
                    <Badge variant="outline" className="rounded-none text-[9px] bg-amber-500/10 text-amber-400 border-amber-500/30">
                      ACK
                    </Badge>
                  )}
                  {alert.status === "processed" && (
                    <Badge variant="outline" className="rounded-none text-[9px] bg-green-500/10 text-green-400 border-green-500/30">
                      DONE
                    </Badge>
                  )}
                  {alert.status === "dismissed" && (
                    <Badge variant="outline" className="rounded-none text-[9px] bg-muted text-muted-foreground border-border">
                      DISMISSED
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
          {displayAlerts.length === 0 && (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
              No alerts in queue. Monitoring for high-value transactions...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
