import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CockpitPreview from "@/components/CockpitPreview";

export default function Cockpit() {
  const designPrinciples = [
    {
      title: "Designed for human operators, not dashboards",
      description: "The cockpit is built around cognitive ergonomics and emotional clarity. Colors mean something. Shapes mean something. Motion means something. You don't hunt for information—you feel where attention is needed.",
    },
    {
      title: "Tiles as living objects",
      description: "Each tile represents a subsystem, workflow, or archetype. Tiles show state, urgency, and health at a glance. Click in, and you drop from overview to detail without losing the bigger picture.",
    },
    {
      title: "Color as a language, not decoration",
      description: "ETHINX uses a strict color hierarchy: calm for stable systems, warm for attention, sharp for risk. The palette is consistent across cockpit, logs, and notifications so your brain doesn't have to re-learn context.",
    },
    {
      title: "Signals that respect your attention",
      description: "Not every alert is an emergency. ETHINX distinguishes between watch this, fix this soon, and act now. Urgency is encoded visually and textually so you can triage without panic.",
    },
    {
      title: "Modes for different kinds of thinking",
      description: "Switch between Build Mode, Run Mode, and Reflect Mode. Build Mode is for designing workflows and systems. Run Mode is for live operations. Reflect Mode is for reviewing what happened and why.",
    },
    {
      title: "Watch workflows breathe",
      description: "Workflows aren't hidden in logs—they're drawn as living flows. You can see which agents are active, which steps are waiting, and where things slowed down or failed.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">The Sovereign Cockpit</h1>
            <p className="text-sm text-accent font-semibold mb-4 uppercase">Engineering Modern Content</p>
            <p className="text-2xl text-muted-foreground mb-8">
              One screen where your entire automation universe comes into focus.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Sovereign Cockpit is where ETHINX stops being abstract and becomes tactile. Tiles, panels, and signals give you a live view of agents, workflows, and systems—without drowning you in noise.
            </p>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* COCKPIT IMAGE */}
        <section className="py-12 md:py-20 bg-secondary">
          <div className="container">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663263238695/mJGrfetK4zeYhgVdM8fcdz/cockpit-interface-visual-dQ7Zn4FqAt6pm4fxSyWASS.webp"
              alt="ETHINX Sovereign Cockpit Interface"
              className="w-full h-auto rounded-lg shadow-xl border border-border"
            />
          </div>
        </section>

        {/* COCKPIT PREVIEW - INTERACTIVE */}
        <CockpitPreview />

        {/* DESIGN PHILOSOPHY */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Design Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {designPrinciples.map((principle, idx) => (
                <div key={idx} className="bg-secondary p-8 rounded-lg border border-border">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Built on core values</h2>
            <div className="space-y-8">
              {[
                {
                  title: "Cognitive Ergonomics",
                  description: "ETHINX is designed to match how humans scan, prioritize, and decide. Layouts, flows, and signals are tuned for real cognitive load, not aesthetic screenshots.",
                },
                {
                  title: "Emotional Clarity",
                  description: "Good systems reduce anxiety. ETHINX aims to make your operational world feel calmer, not noisier.",
                },
                {
                  title: "Zero Ambiguity",
                  description: "Buttons say what they do. Tiles show what they mean. Workflows are explicit. ETHINX rejects vague labels and hidden behavior.",
                },
                {
                  title: "Audit-Driven Rigor",
                  description: "Every serious system needs a paper trail. ETHINX bakes that into its core.",
                },
                {
                  title: "Human-Centered Design",
                  description: "At the end of every workflow is a human outcome. ETHINX never forgets that.",
                },
              ].map((value, idx) => (
                <div key={idx} className="border-l-4 border-accent pl-6">
                  <h3 className="text-2xl font-semibold mb-2 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODES */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Three modes of operation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  mode: "Build Mode",
                  description: "Design workflows, configure subsystems, and architect your automation landscape. This is where you shape the system.",
                  color: "bg-blue-50 dark:bg-blue-900",
                },
                {
                  mode: "Run Mode",
                  description: "Live operations view. Monitor active workflows, respond to signals, and steer the ship in real time.",
                  color: "bg-green-50 dark:bg-green-900",
                },
                {
                  mode: "Reflect Mode",
                  description: "Review what happened, analyze outcomes, and refine your approach. This is where learning happens.",
                  color: "bg-purple-50 dark:bg-purple-900",
                },
              ].map((item, idx) => (
                <div key={idx} className={`${item.color} p-6 rounded-lg border border-border`}>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{item.mode}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Ready to take control?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              The Sovereign Cockpit is where founders and operators step into full command of their automation universe.
            </p>
            <Link href="/contact">
              <a className="cta-primary inline-flex items-center justify-center gap-2">
                Get early access
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
