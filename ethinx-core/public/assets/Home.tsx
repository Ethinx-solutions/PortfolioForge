import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  ETHINX builds, sells, and evolves digital businesses—automatically.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Engineering Modern Content. Recursive automation, multi-agent orchestration, and a sovereign cockpit that keeps you in full control.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/ecosystem">
                    <a className="cta-primary inline-flex items-center justify-center gap-2">
                      Start with the ecosystem
                      <ArrowRight size={18} />
                    </a>
                  </Link>
                  <Link href="/cockpit">
                    <a className="cta-secondary inline-flex items-center justify-center gap-2">
                      See the cockpit
                    </a>
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div className="hidden md:block">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663263238695/mJGrfetK4zeYhgVdM8fcdz/hero-abstract-geometric-nLfJ3XtoLmYBBwHZ6s4FTf.webp"
                  alt="ETHINX Abstract Geometric Pattern"
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ACCENT BAR */}
        <div className="accent-bar"></div>

        {/* ETHINX SUMMARY */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">What is ETHINX?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ETHINX is a sovereign automation engine designed to build, run, and evolve entire digital businesses. It doesn't just generate assets—it architects products, deploys infrastructure, orchestrates agents, and maintains the operational heartbeat of your system. Every workflow is auditable, every decision traceable, every action grounded in founder‑grade intent.
            </p>
          </div>
        </section>

        {/* ECOSYSTEM MAP */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">One ecosystem, many subsystems</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  At the core of ETHINX is a connected constellation of subsystems: the Sovereign Cockpit, content and branding engines, workflow and orchestration layers, distribution and analytics mirrors, and a Business‑in‑a‑Box engine tuned to 10 real‑world archetypes. Each subsystem is modular on its own—and exponentially powerful together.
                </p>
                <Link href="/ecosystem">
                  <a className="cta-primary inline-flex items-center justify-center gap-2">
                    Explore the ecosystem
                    <ArrowRight size={18} />
                  </a>
                </Link>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663263238695/mJGrfetK4zeYhgVdM8fcdz/ecosystem-diagram-8QpNnWSGQZG7yiig9Rf5UC.webp"
                  alt="ETHINX Ecosystem Diagram"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CORE CAPABILITIES */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">What ETHINX actually does</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Builds products",
                  description: "From idea to offer, ETHINX assembles assets, funnels, and delivery systems.",
                },
                {
                  title: "Deploys infrastructure",
                  description: "Domains, hosting, routing, and environments wired with audit‑ready clarity.",
                },
                {
                  title: "Runs workflows",
                  description: "Multi‑agent pipelines that execute, monitor, and adapt in real time.",
                },
                {
                  title: "Manages customers",
                  description: "Onboarding, communication, and lifecycle flows mapped to real human journeys.",
                },
                {
                  title: "Generates content",
                  description: "Brand‑consistent, channel‑aware content at the speed of thought.",
                },
                {
                  title: "Automates operations",
                  description: "The repetitive, fragile, and manual gets replaced with deterministic systems.",
                },
              ].map((capability, idx) => (
                <div key={idx} className="bg-background p-6 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{capability.title}</h3>
                  <p className="text-muted-foreground">{capability.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY ETHINX EXISTS */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Why ETHINX had to exist</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Most tools automate fragments. ETHINX automates the whole. It was built for founders who think in systems, not features—for people who want a cockpit, not a cluttered toolbox. ETHINX exists to turn automation from a scattered collection of scripts into a living, navigable, emotionally intuitive environment that you can actually trust.
            </p>
          </div>
        </section>

        {/* CTA BLOCKS */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Block 1 */}
              <div className="bg-background p-8 rounded-lg border border-border flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">See the Sovereign Cockpit</h3>
                  <p className="text-muted-foreground mb-6">
                    Step into the command center where every subsystem, workflow, and signal comes together.
                  </p>
                </div>
                <Link href="/cockpit">
                  <a className="cta-primary inline-flex items-center justify-center gap-2 w-full">
                    View cockpit
                    <ArrowRight size={18} />
                  </a>
                </Link>
              </div>

              {/* Block 2 */}
              <div className="bg-background p-8 rounded-lg border border-border flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">Meet the 10 archetypes</h3>
                  <p className="text-muted-foreground mb-6">
                    Watch ETHINX reshape itself around real people—retirees, tradies, creators, and more.
                  </p>
                </div>
                <Link href="/archetypes">
                  <a className="cta-primary inline-flex items-center justify-center gap-2 w-full">
                    Explore archetypes
                    <ArrowRight size={18} />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
