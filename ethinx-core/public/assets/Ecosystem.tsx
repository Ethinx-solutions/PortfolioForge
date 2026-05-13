import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Ecosystem() {
  const subsystems = [
    { name: "ETHINX Core", description: "The orchestration brain that coordinates agents, workflows, and state." },
    { name: "Sovereign Cockpit", description: "The visual command center for everything ETHINX does." },
    { name: "PromptForge", description: "The generative command engine that turns intent into structured prompts and plans." },
    { name: "VideoForge", description: "Automated video scripting and asset generation for brand‑consistent media." },
    { name: "Branding Engine", description: "Colors, typography, and visual language encoded as a system, not a mood." },
    { name: "Content Engine", description: "Long‑form, short‑form, and multi‑channel content pipelines." },
    { name: "Workflow Engine", description: "Deterministic, auditable workflows that span tools, agents, and services." },
    { name: "Multi‑Agent Orchestration Layer", description: "Agent collaboration, delegation, and supervision." },
    { name: "Distribution Engine", description: "Publishing, scheduling, and syndication across channels." },
    { name: "Analytics / Mirror", description: "A reflective layer that shows what's happening, what worked, and what broke." },
    { name: "Identity & IAM", description: "Roles, permissions, and access mapped to real operational boundaries." },
    { name: "Business‑in‑a‑Box Engine", description: "Archetype‑driven business templates wired end‑to‑end." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">The ETHINX ecosystem</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  ETHINX is structured as a layered ecosystem: core orchestration, creative engines, operational workflows, distribution channels, and reflective analytics. Each layer is explicit, inspectable, and designed to be extended without breaking the whole.
                </p>
              </div>
              <div className="flex justify-center animate-float">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663263238695/mJGrfetK4zeYhgVdM8fcdz/tdog-pointing-full-L2ro822giGeQQdZn7pM36Y.webp"
                  alt="TDog pointing to the ecosystem"
                  className="w-64 h-64 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* SUBSYSTEM GRID */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Subsystems at a glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subsystems.map((subsystem, idx) => (
                <Link key={idx} href={`/subsystems/${subsystem.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`}>
                  <a className="group bg-background p-6 rounded-lg border border-border hover:border-accent transition-all hover:shadow-lg cursor-pointer">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-accent transition-colors">
                      {subsystem.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">{subsystem.description}</p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIONS DIAGRAM */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">How the subsystems talk</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Subsystems don't live in isolation. The Workflow Engine calls the Content Engine, which pulls from PromptForge, which respects the rules of the Branding Engine, all while the Cockpit visualizes state and the Analytics Mirror records every step. ETHINX is designed so that every interaction is intentional, observable, and reversible.
            </p>
          </div>
        </section>

        {/* THINKING IN LOOPS */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">A system that thinks in loops, not lines</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  ETHINX doesn't just execute once and stop. It runs in loops: observe, decide, act, reflect. Workflows feed analytics, analytics refine prompts, prompts reshape workflows. Over time, the ecosystem becomes sharper, faster, and more aligned with your way of operating.
                </p>
                <div className="bg-background p-8 rounded-lg border border-border">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-semibold">1</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Observe</h4>
                        <p className="text-muted-foreground text-sm">Collect signals from all subsystems and external sources</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-semibold">2</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Decide</h4>
                        <p className="text-muted-foreground text-sm">Analyze patterns and determine next actions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-semibold">3</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Act</h4>
                        <p className="text-muted-foreground text-sm">Execute workflows and orchestrate agents</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-semibold">4</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Reflect</h4>
                        <p className="text-muted-foreground text-sm">Record outcomes and refine future decisions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center animate-float-delayed">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663263238695/mJGrfetK4zeYhgVdM8fcdz/tdog-thinking-full-XLpbZ4P9rtJiXCi7FEZSvF.webp"
                  alt="TDog thinking about system loops"
                  className="w-64 h-64 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Ready to explore deeper?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Dive into individual subsystems to understand how each component powers the whole.
            </p>
            <Link href="/subsystems">
              <a className="cta-primary inline-flex items-center justify-center gap-2">
                Browse all subsystems
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
