import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Eye,
  Target,
  Layers,
  Cpu,
  Rocket,
  Globe,
  Shield,
  DollarSign,
  Users,
  Zap,
} from "lucide-react";

// --- Types ---
interface BlueprintSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: BlueprintContent[];
}

interface BlueprintContent {
  type: "text" | "table" | "list" | "highlight";
  data: string | string[] | string[][];
  label?: string;
}

// --- Data ---
const BLUEPRINT_SECTIONS: BlueprintSection[] = [
  {
    id: "vision",
    title: "Executive Vision",
    icon: Eye,
    content: [
      {
        type: "text",
        data: "EthinX is a worldwide force in the automation workforce space, designed to empower self-sufficient wealth creation through a multi-agent control system. It is the \"Empire OS\" for founders to rapidly build, deploy, and monetize AI-driven MVPs.",
      },
      {
        type: "highlight",
        data: "Transition from scattered development to a unified \"Citadel\" architecture that launches products with built-in gamification, scarcity-driven monetization, and high-performance infrastructure.",
        label: "THE NORTH STAR",
      },
    ],
  },
  {
    id: "architecture",
    title: "System Architecture",
    icon: Cpu,
    content: [
      {
        type: "text",
        data: "The Empire OS is built on a multi-layered architecture designed for rapid MVP deployment and real-time operational intelligence.",
      },
      {
        type: "table",
        label: "THE CITADEL — DATA ORGANIZATION",
        data: [
          ["Silo", "Purpose", "Status"],
          ["01_PROJECTS", "Core codebases (EthinX, PromptForge, Revenue Forge)", "Active"],
          ["02_ASSETS", "Branding, media, and raw data", "Active"],
          ["03_LOGS", "System activity and audit trails", "Monitoring"],
          ["04_DOCUMENTS", "Strategic blueprints and manifests", "Active"],
          ["05_ARCHIVE", "Legacy versions and research", "Archived"],
        ],
      },
      {
        type: "table",
        label: "INFRASTRUCTURE STACK",
        data: [
          ["Layer", "Technology", "Provider"],
          ["Frontend", "Next.js / React", "Netlify"],
          ["Backend", "Node.js / Express", "Hetzner (91.99.162.243)"],
          ["Database", "PostgreSQL + Redis", "GCP"],
          ["APIs", "Vertex AI, OpenAI, Stripe", "Google Cloud / Stripe"],
          ["Security/DNS", "Cloudflare Edge", "Cloudflare"],
        ],
      },
    ],
  },
  {
    id: "control-console",
    title: "Control Console V3/V4",
    icon: Layers,
    content: [
      {
        type: "text",
        data: "A unified industrial-aesthetic dashboard (#000000 Black, #D4AF37 Gold) featuring real-time sales intelligence, sensory alerts, and advanced behavioral upsell mechanics.",
      },
      {
        type: "list",
        label: "CORE MODULES",
        data: [
          "Launch Sentry — Real-time sales intelligence ticker with tier badges and transaction cards",
          "Neural Recon — Sensory-alert system for high-value ($2,500+) transactions with full-screen overlays",
          "Revenue Forge V2 — Advanced behavioral upsell engine with scarcity mechanics and urgency levels",
          "Forge Analytics — Conversion tracking dashboard with performance insights and auto-refresh",
          "WebSocket Service — Real-time data pipeline from Hetzner Controller Node",
        ],
      },
    ],
  },
  {
    id: "monetization",
    title: "Monetization Strategy",
    icon: DollarSign,
    content: [
      {
        type: "text",
        data: "Revenue Forge V2 implements a multi-tier dynamic upsell logic with scarcity-driven urgency triggers, risk reversal messaging, and post-purchase cross-sell mechanics.",
      },
      {
        type: "table",
        label: "TIER PRICING & UPSELLS",
        data: [
          ["Tier", "Price (AUD)", "Upsell", "Upsell Price", "Bundle Discount"],
          ["Starter", "$39", "Pro-Growth Accelerator", "$49", "20%"],
          ["Growth", "$79", "Pro-Growth Accelerator", "$49", "20%"],
          ["Pro", "$129", "Bio Suite", "$29", "15%"],
          ["Elite", "$299", "Bio Suite", "$29", "15%"],
          ["Enterprise", "$390", "Bio Suite", "$29", "15%"],
          ["Vault", "$2,500", "Neural Priority Pipeline", "$199", "15%"],
        ],
      },
      {
        type: "highlight",
        data: "Conservative estimate: $3,451.50/month additional revenue at 15% Forge Conversion Rate. Optimistic: $5,752.50/month at 25% conversion. Annual impact: $41,418 — $69,030.",
        label: "FINANCIAL IMPACT",
      },
    ],
  },
  {
    id: "gamification",
    title: "Gamification Engine",
    icon: Zap,
    content: [
      {
        type: "text",
        data: "The \"Find T-Dog\" gamified campaign drives user engagement through unlockable prompt packs and business blueprints, powered by the PromptForge Execution Engine.",
      },
      {
        type: "list",
        label: "MECHANICS",
        data: [
          "Scarcity Engine — Real-time slot counter (3-5 remaining) with random decrement every 8-12 seconds",
          "Urgency Levels — Visual cues escalating from Medium → High → Critical based on slot availability",
          "Risk Reversal — T-Dog Certified badge with 30-day money-back guarantee and FBT compliance",
          "Post-Purchase Cross-Sell — \"Last Chance\" $10 discount on Bio Suite within 10-minute window",
          "Conversion Lift — Combined +30-45% from scarcity, risk reversal, and cross-sell tactics",
        ],
      },
    ],
  },
  {
    id: "phase1",
    title: "Phase 1: Creator's Edge MVP",
    icon: Rocket,
    content: [
      {
        type: "text",
        data: "The first live territory of the EthinX Empire. A high-leverage product designed to prove the Empire OS monetization model through the PromptForge Execution Engine applied to specific business niches.",
      },
      {
        type: "table",
        label: "7-DAY SPRINT TIMELINE",
        data: [
          ["Day", "Task", "Status"],
          ["Day 1-2", "Code-level integration of V2 components", "Complete"],
          ["Day 3", "WebSocket connectivity testing (Hetzner to Netlify)", "In Progress"],
          ["Day 4", "Stripe sandbox end-to-end checkout testing", "Pending"],
          ["Day 5", "UI/UX polishing for Industrial Aesthetic", "Pending"],
          ["Day 6", "Final Find T-Dog campaign asset check", "Pending"],
          ["Day 7", "PRODUCTION DEPLOYMENT", "Pending"],
        ],
      },
      {
        type: "list",
        label: "SUCCESS METRICS",
        data: [
          "Forge Conversion Rate: 15-25%",
          "Vault Tier Alert Frequency: 1-2 per week",
          "System Uptime: 99.5%+",
          "AOV Increase: >20%",
        ],
      },
    ],
  },
  {
    id: "security",
    title: "Security & Compliance",
    icon: Shield,
    content: [
      {
        type: "list",
        label: "SECURITY MEASURES",
        data: [
          "FBT Compliance — Bio Suite classified as EV Product with automatic enforcement in checkout",
          "Webhook Verification — Raw body verification using Stripe webhook secrets",
          "Idempotency — Processed events tracked to prevent double-charging",
          "T-Dog Certified — Hardened security badge with compliance guarantee on all tiers",
          "Cloudflare Edge — DDoS protection and SSL termination",
        ],
      },
    ],
  },
  {
    id: "empire",
    title: "Empire Expansion",
    icon: Globe,
    content: [
      {
        type: "text",
        data: "Beyond the Creator's Edge MVP, the T-Dog Empire OS is designed to scale across multiple product territories, each leveraging the same gamification and monetization infrastructure.",
      },
      {
        type: "list",
        label: "EMPIRE TERRITORIES",
        data: [
          "EthinX Core — The autonomous workforce platform and Empire OS command center",
          "PromptForge — AI prompt engineering and execution engine for niche businesses",
          "Revenue Forge — Behavioral upsell and monetization intelligence system",
          "Cromenix — Chrome extension ecosystem for productivity automation",
          "Vega Staging — Staging and deployment pipeline management",
          "AdEngine — Automated advertising and campaign management",
          "Omni-Content Spark — Multi-platform content generation and distribution",
          "TeRoniX — Advanced analytics and business intelligence platform",
        ],
      },
      {
        type: "highlight",
        data: "Each territory follows the same Empire OS pattern: Identify niche → Deploy MVP → Activate gamification → Scale via PromptForge packs → Expand territory.",
        label: "EXPANSION PROTOCOL",
      },
    ],
  },
];

// --- Component ---
export default function Blueprint() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["vision", "phase1"])
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(BLUEPRINT_SECTIONS.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-xl md:text-2xl font-bold text-primary tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Master Blueprint
          </h1>
          <p className="text-sm text-muted-foreground mt-1 tracking-wide">
            EthinX Empire Operating System — Complete Strategic & Technical Reference
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-[10px] text-primary tracking-wider hover:text-primary/80 transition-colors px-2 py-1 border border-primary/20 hover:border-primary/40"
          >
            EXPAND ALL
          </button>
          <button
            onClick={collapseAll}
            className="text-[10px] text-muted-foreground tracking-wider hover:text-foreground transition-colors px-2 py-1 border border-border hover:border-primary/20"
          >
            COLLAPSE
          </button>
        </div>
      </div>

      {/* Version Badge */}
      <Card className="p-3 bg-card border-border rounded-none flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-4 w-4 text-primary" />
          <div>
            <span className="text-xs text-foreground font-semibold tracking-wider">
              ETHINX MASTER BLUEPRINT
            </span>
            <span className="text-[10px] text-muted-foreground ml-2">Version 1.0</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-none text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
            ACTIVE
          </Badge>
          <span className="text-[10px] text-muted-foreground font-mono">March 2026</span>
        </div>
      </Card>

      {/* Table of Contents */}
      <Card className="p-4 bg-card border-border rounded-none">
        <h2
          className="text-xs font-bold text-primary tracking-wider mb-3"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Navigation
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BLUEPRINT_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setExpandedSections((prev) => { const next = new Set(prev); next.add(section.id); return next; });
                document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 p-2 text-left hover:bg-accent/10 transition-colors border border-transparent hover:border-primary/20"
            >
              <section.icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs text-foreground truncate">{section.title}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Sections */}
      <div className="space-y-3">
        {BLUEPRINT_SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          return (
            <Card
              key={section.id}
              id={`section-${section.id}`}
              className="bg-card border-border rounded-none overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 flex items-center gap-3 text-left hover:bg-accent/5 transition-colors"
              >
                <section.icon className="h-5 w-5 text-primary shrink-0" />
                <h2
                  className="text-sm font-bold text-foreground tracking-wider flex-1"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {section.title}
                </h2>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-4">
                  {section.content.map((content, i) => {
                    switch (content.type) {
                      case "text":
                        return (
                          <p key={i} className="text-sm text-foreground/80 leading-relaxed mt-3">
                            {content.data as string}
                          </p>
                        );

                      case "highlight":
                        return (
                          <div key={i} className="mt-3 p-4 bg-primary/5 border-l-2 border-primary">
                            {content.label && (
                              <div
                                className="text-[10px] text-primary tracking-wider font-bold mb-2"
                                style={{ fontFamily: "'Orbitron', sans-serif" }}
                              >
                                {content.label}
                              </div>
                            )}
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              {content.data as string}
                            </p>
                          </div>
                        );

                      case "list":
                        return (
                          <div key={i} className="mt-3">
                            {content.label && (
                              <div className="text-[10px] text-muted-foreground tracking-wider font-semibold mb-2">
                                {content.label}
                              </div>
                            )}
                            <div className="space-y-1.5">
                              {(content.data as string[]).map((item, j) => {
                                const parts = item.split(" — ");
                                return (
                                  <div key={j} className="flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 bg-primary mt-1.5 shrink-0" />
                                    <span className="text-xs text-foreground/80">
                                      {parts.length > 1 ? (
                                        <>
                                          <span className="text-foreground font-semibold">{parts[0]}</span>
                                          {" — "}
                                          {parts[1]}
                                        </>
                                      ) : (
                                        item
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );

                      case "table":
                        const tableData = content.data as string[][];
                        const headers = tableData[0];
                        const rows = tableData.slice(1);
                        return (
                          <div key={i} className="mt-3 overflow-x-auto">
                            {content.label && (
                              <div className="text-[10px] text-muted-foreground tracking-wider font-semibold mb-2">
                                {content.label}
                              </div>
                            )}
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-primary/20">
                                  {headers.map((h, hi) => (
                                    <th
                                      key={hi}
                                      className="text-left py-2 px-3 text-primary tracking-wider font-bold"
                                      style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.6rem" }}
                                    >
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {rows.map((row, ri) => (
                                  <tr key={ri} className="border-b border-border/30 hover:bg-accent/5">
                                    {row.map((cell, ci) => (
                                      <td key={ci} className="py-2 px-3 text-foreground/80">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );

                      default:
                        return null;
                    }
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
