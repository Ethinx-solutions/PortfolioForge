import { useState } from "react";
import { useAudioTrigger } from "@/hooks/useAudioTrigger";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Circle,
  Clock,
  FolderArchive,
  FolderOpen,
  FileText,
  Database,
  Image,
  ScrollText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// --- Types ---
interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  progress: number;
  subtasks: { label: string; done: boolean }[];
}

interface CitadelSilo {
  name: string;
  code: string;
  icon: React.ElementType;
  fileCount: number;
  totalSize: string;
  health: "optimal" | "warning" | "critical";
  lastScan: string;
}

// --- Data ---
const MILESTONES: Milestone[] = [
  {
    id: "env-align",
    title: "Environment Alignment",
    description: "Connect Hetzner backend to Netlify frontend via WebSocketService",
    status: "completed",
    progress: 100,
    subtasks: [
      { label: "Configure WebSocket URL (ws://91.99.162.243:3001)", done: true },
      { label: "Set Stripe Price IDs in environment variables", done: true },
      { label: "Point Cloudflare DNS to EthinX domain", done: true },
      { label: "Verify GCP API access and credentials", done: true },
    ],
  },
  {
    id: "creator-edge",
    title: "Creator's Edge Implementation",
    description: "Integrate V2 components into the main checkout flow",
    status: "in_progress",
    progress: 65,
    subtasks: [
      { label: "Integrate OrderBumpV2.tsx into checkout flow", done: true },
      { label: "Activate LaunchSentry.tsx on Admin Console", done: true },
      { label: "Activate NeuralReconPriorityQueue.tsx", done: true },
      { label: "Deploy SuccessPage.jsx with 10-min countdown", done: false },
      { label: "End-to-end Stripe sandbox testing", done: false },
      { label: "UI/UX polishing for Industrial Aesthetic", done: false },
    ],
  },
  {
    id: "launch-monitor",
    title: "Launch & Monitor",
    description: "Execute the Find T-Dog viral loop campaign",
    status: "pending",
    progress: 0,
    subtasks: [
      { label: "Prepare Find T-Dog campaign assets", done: false },
      { label: "Configure gamification reward tiers", done: false },
      { label: "Monitor Forge Conversion Rate (Target: 15-25%)", done: false },
      { label: "Scale via PromptForge pack expansion", done: false },
    ],
  },
];

const CITADEL_SILOS: CitadelSilo[] = [
  {
    name: "PROJECTS",
    code: "01",
    icon: FolderOpen,
    fileCount: 847,
    totalSize: "2.3 GB",
    health: "optimal",
    lastScan: "2 min ago",
  },
  {
    name: "ASSETS",
    code: "02",
    icon: Image,
    fileCount: 234,
    totalSize: "1.8 GB",
    health: "optimal",
    lastScan: "2 min ago",
  },
  {
    name: "LOGS",
    code: "03",
    icon: ScrollText,
    fileCount: 56,
    totalSize: "128 MB",
    health: "warning",
    lastScan: "5 min ago",
  },
  {
    name: "DOCUMENTS",
    code: "04",
    icon: FileText,
    fileCount: 189,
    totalSize: "456 MB",
    health: "optimal",
    lastScan: "2 min ago",
  },
  {
    name: "ARCHIVE",
    code: "05",
    icon: FolderArchive,
    fileCount: 412,
    totalSize: "3.1 GB",
    health: "optimal",
    lastScan: "10 min ago",
  },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-primary animate-gold-pulse" />;
    case "pending":
      return <Circle className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="rounded-none text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
          COMPLETE
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="outline" className="rounded-none text-[10px] bg-primary/10 text-primary border-primary/30">
          IN PROGRESS
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="rounded-none text-[10px] bg-muted text-muted-foreground border-border">
          PENDING
        </Badge>
      );
    default:
      return null;
  }
}

function getHealthColor(health: string) {
  switch (health) {
    case "optimal": return "text-green-400";
    case "warning": return "text-amber-400";
    case "critical": return "text-red-400";
    default: return "text-muted-foreground";
  }
}

function getHealthDot(health: string) {
  switch (health) {
    case "optimal": return "bg-green-500";
    case "warning": return "bg-amber-500";
    case "critical": return "bg-red-500";
    default: return "bg-muted-foreground";
  }
}

// --- Component ---
export default function ExecutionTracker() {
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(
    new Set(["creator-edge"])
  );

  // ─── Audio Triggers ─────────────────────────────────────────────
  const { play } = useAudioTrigger();

  const toggleMilestone = (id: string) => {
    const milestone = MILESTONES.find((m) => m.id === id);
    setExpandedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        // Play flux_complete when expanding a completed milestone
        if (milestone?.status === "completed") {
          play("flux_complete");
        }
      }
      return next;
    });
  };

  const totalProgress = Math.round(
    MILESTONES.reduce((sum, m) => sum + m.progress, 0) / MILESTONES.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-primary tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Execution Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide">
            Phase 1: Creator's Edge MVP — 7-Day Sprint
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-muted-foreground tracking-wider">OVERALL</div>
            <div
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {totalProgress}%
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <Card className="p-4 bg-card border-border rounded-none">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground tracking-wider">
            PHASE 1 PROGRESS
          </span>
          <span className="text-xs text-primary font-mono">{totalProgress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-none overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </Card>

      {/* Milestones */}
      <div className="space-y-3">
        <h2
          className="text-sm font-bold text-primary tracking-wider"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Milestones
        </h2>
        {MILESTONES.map((milestone, index) => {
          const isExpanded = expandedMilestones.has(milestone.id);
          return (
            <Card
              key={milestone.id}
              className={`bg-card border-border rounded-none overflow-hidden transition-all duration-300 ${milestone.status === "in_progress" ? "border-primary/30 gold-glow" : ""}`}
            >
              <button
                onClick={() => toggleMilestone(milestone.id)}
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-accent/5 transition-colors"
              >
                {/* Timeline Connector */}
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs text-muted-foreground font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  {getStatusIcon(milestone.status)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground tracking-wide">
                      {milestone.title}
                    </h3>
                    {getStatusBadge(milestone.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>

                {/* Progress + Expand */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 hidden sm:block">
                    <Progress value={milestone.progress} className="h-1.5 rounded-none" />
                  </div>
                  <span className="text-xs text-primary font-mono w-10 text-right">
                    {milestone.progress}%
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Subtasks */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-border/50">
                  <div className="ml-10 space-y-2 mt-3">
                    {milestone.subtasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {task.done ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span
                          className={`text-xs ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}
                        >
                          {task.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Citadel Silo Monitor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            className="text-sm font-bold text-primary tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Citadel Silo Monitor
          </h2>
          <div className="flex items-center gap-1.5">
            <Database className="h-3 w-3 text-primary" />
            <span className="text-[10px] text-muted-foreground tracking-wider">
              C:\T-DOG_EMPIRE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CITADEL_SILOS.map((silo) => (
            <Card
              key={silo.code}
              className="p-4 bg-card border-border rounded-none hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <silo.icon className="h-4 w-4 text-primary" />
                  <span
                    className="text-[10px] text-primary font-bold tracking-wider"
                    style={{ fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {silo.code}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`h-1.5 w-1.5 rounded-full ${getHealthDot(silo.health)}`} />
                  <span className={`text-[9px] tracking-wider ${getHealthColor(silo.health)}`}>
                    {silo.health.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-xs font-semibold text-foreground tracking-wider mb-2">
                {silo.name}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Files</span>
                  <span className="text-[10px] text-foreground font-mono">{silo.fileCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Size</span>
                  <span className="text-[10px] text-foreground font-mono">{silo.totalSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Scan</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{silo.lastScan}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
