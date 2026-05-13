import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Subsystems() {
  const subsystems = [
    {
      slug: "ethinx-core",
      name: "ETHINX Core",
      tagline: "The orchestration brain that coordinates agents, workflows, and state.",
      description: "The central nervous system of ETHINX, managing all subsystem interactions and maintaining system state.",
    },
    {
      slug: "sovereign-cockpit",
      name: "Sovereign Cockpit",
      tagline: "The visual command center for everything ETHINX does.",
      description: "Your operational dashboard where every subsystem, workflow, and signal comes together.",
    },
    {
      slug: "promptforge",
      name: "PromptForge",
      tagline: "Turn intent into structured, reusable, high-performance prompts.",
      description: "The generative command engine that converts intent into structured prompt chains.",
    },
    {
      slug: "videoforge",
      name: "VideoForge",
      tagline: "Automated video scripting and asset generation for brand-consistent media.",
      description: "Create professional video content at scale with brand consistency.",
    },
    {
      slug: "branding-engine",
      name: "Branding Engine",
      tagline: "Colors, typography, and visual language encoded as a system, not a mood.",
      description: "Maintain visual consistency across all outputs and channels.",
    },
    {
      slug: "content-engine",
      name: "Content Engine",
      tagline: "Long-form, short-form, and multi-channel content pipelines.",
      description: "Generate brand-consistent content across all formats and platforms.",
    },
    {
      slug: "workflow-engine",
      name: "Workflow Engine",
      tagline: "Deterministic, auditable workflows that span tools, agents, and services.",
      description: "Build and execute complex, observable automation workflows.",
    },
    {
      slug: "multi-agent-orchestration",
      name: "Multi-Agent Orchestration",
      tagline: "Agent collaboration, delegation, and supervision.",
      description: "Coordinate multiple AI agents working together toward common goals.",
    },
    {
      slug: "distribution-engine",
      name: "Distribution Engine",
      tagline: "Publishing, scheduling, and syndication across channels.",
      description: "Distribute content and manage publishing across multiple platforms.",
    },
    {
      slug: "analytics-mirror",
      name: "Analytics Mirror",
      tagline: "A reflective layer that shows what's happening, what worked, and what broke.",
      description: "Comprehensive visibility into system performance and outcomes.",
    },
    {
      slug: "identity-iam",
      name: "Identity & IAM",
      tagline: "Roles, permissions, and access mapped to real operational boundaries.",
      description: "Secure access control and identity management for your system.",
    },
    {
      slug: "business-in-a-box",
      name: "Business-in-a-Box",
      tagline: "Archetype-driven business templates wired end-to-end.",
      description: "Pre-configured business blueprints for 10 real-world archetypes.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Subsystems</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Each subsystem is a complete, self-contained system. Together, they form the ETHINX ecosystem. Explore each one to understand how they work and how they connect.
            </p>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* SUBSYSTEMS GRID */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subsystems.map((subsystem) => (
                <Link key={subsystem.slug} href={`/subsystems/${subsystem.slug}`}>
                  <a className="group bg-background p-6 rounded-lg border border-border hover:border-accent transition-all hover:shadow-lg cursor-pointer h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">
                      {subsystem.name}
                    </h3>
                    <p className="text-sm text-accent font-medium mb-3">{subsystem.tagline}</p>
                    <p className="text-muted-foreground text-sm flex-1">{subsystem.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight size={16} />
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Understand the whole system</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Each subsystem is powerful on its own. Together, they create exponential capabilities.
            </p>
            <Link href="/ecosystem">
              <a className="cta-primary inline-flex items-center justify-center gap-2">
                Back to ecosystem
                <ArrowRight size={18} />
              </a>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
