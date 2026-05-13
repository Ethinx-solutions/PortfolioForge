import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Architecture() {
  const layers = [
    {
      name: "Core Orchestration",
      description: "The central brain that coordinates all subsystems, manages state, and ensures consistency across the entire ecosystem.",
      subsystems: ["ETHINX Core", "Multi-Agent Orchestration", "Workflow Engine"],
    },
    {
      name: "Creative Engines",
      description: "Generative systems that produce content, prompts, video, and branding assets at scale.",
      subsystems: ["PromptForge", "VideoForge", "Branding Engine", "Content Engine"],
    },
    {
      name: "Operational Workflows",
      description: "Deterministic, auditable workflows that span tools, agents, and services.",
      subsystems: ["Workflow Engine", "Identity & IAM", "Business-in-a-Box Engine"],
    },
    {
      name: "Distribution & Channels",
      description: "Publishing, scheduling, and syndication across multiple platforms and channels.",
      subsystems: ["Distribution Engine"],
    },
    {
      name: "Reflection & Analytics",
      description: "Comprehensive visibility into system performance, outcomes, and continuous improvement.",
      subsystems: ["Analytics Mirror"],
    },
    {
      name: "Command & Control",
      description: "The human interface where operators see, understand, and steer the entire system.",
      subsystems: ["Sovereign Cockpit"],
    },
  ];

  const principles = [
    {
      title: "Modularity",
      description: "Each subsystem is self-contained and can be understood, modified, and extended independently.",
    },
    {
      title: "Composability",
      description: "Subsystems connect through well-defined interfaces, creating exponential power when combined.",
    },
    {
      title: "Auditability",
      description: "Every action, decision, and state change is logged and traceable for full transparency.",
    },
    {
      title: "Sovereignty",
      description: "You maintain full control. No hidden behavior, no lock-in, no surprises.",
    },
    {
      title: "Scalability",
      description: "From solo founder to scaled team, ETHINX grows with your needs.",
    },
    {
      title: "Legibility",
      description: "The system is designed to be understood. Complexity is managed, not hidden.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">System Architecture</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              ETHINX is built on principles of modularity, composability, and sovereignty. Every layer is explicit, inspectable, and designed to work together without breaking the whole.
            </p>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* LAYERED ARCHITECTURE */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Layered Ecosystem</h2>
            <div className="space-y-6">
              {layers.map((layer, idx) => (
                <div key={idx} className="bg-background p-8 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-2">{layer.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{layer.description}</p>
                    </div>
                    <div className="text-4xl font-bold text-accent opacity-20 flex-shrink-0 ml-4">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {layer.subsystems.map((subsystem) => (
                      <span key={subsystem} className="px-3 py-1 bg-secondary text-foreground text-sm rounded border border-border">
                        {subsystem}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CORE PRINCIPLES */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Guiding Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {principles.map((principle, idx) => (
                <div key={idx} className="bg-secondary p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{principle.title}</h3>
                  <p className="text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DATA FLOW */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Information Flow</h2>
            <div className="space-y-6">
              {[
                {
                  step: "Input",
                  description: "Founder intent, external signals, and system state enter through the Cockpit or APIs.",
                },
                {
                  step: "Processing",
                  description: "ETHINX Core orchestrates subsystems to parse intent, plan actions, and prepare execution.",
                },
                {
                  step: "Execution",
                  description: "Workflows run, agents collaborate, content is generated, and systems are deployed.",
                },
                {
                  step: "Observation",
                  description: "Analytics Mirror captures outcomes, performance, and results.",
                },
                {
                  step: "Reflection",
                  description: "Insights feed back into the system to refine future decisions and improve performance.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.step}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Explore deeper</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Understand how each subsystem contributes to the whole and how they work together.
            </p>
            <Link href="/subsystems">
              <a className="cta-primary inline-flex items-center justify-center gap-2">
                Browse subsystems
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
