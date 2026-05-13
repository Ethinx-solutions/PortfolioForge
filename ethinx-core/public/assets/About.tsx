import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">About ETHINX</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Built by a founder who hates ambiguity. For founders who think in systems.
            </p>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* FOUNDER STORY */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">The Story</h2>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                ETHINX was born from frustration. The founder spent years juggling tools, scripts, and half-finished systems. Every new project meant rebuilding the same infrastructure. Every scaling challenge meant adding another tool to the stack.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Instead of another app, it became an ecosystem. A way to see, shape, and steer everything from one place. What started as a personal cockpit for one operator evolved into a generalizable architecture for anyone who thinks in systems.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ETHINX exists to give individuals and small teams the kind of operational clarity and automation power usually reserved for large organizations. To make building and running a business feel like flying a well-designed craft, not patching a leaking boat.
              </p>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To give individuals and small teams the kind of operational clarity and automation power usually reserved for large organizations.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A world where building and running a business feels like flying a well-designed craft—not patching a leaking boat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE BELIEVE */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">What We Believe</h2>
            <div className="space-y-8">
              {[
                {
                  title: "Automation is a Right, Not a Privilege",
                  description: "Every founder deserves access to enterprise-grade automation. You should not have to be a Fortune 500 company to operate with clarity and scale.",
                },
                {
                  title: "Sovereignty Matters",
                  description: "You should never feel locked out of your own system. Full transparency, full control, full ownership.",
                },
                {
                  title: "Systems Beat Features",
                  description: "The power is not in individual features. It is in how they work together. We build systems, not tools.",
                },
                {
                  title: "Legibility is Essential",
                  description: "If you cannot understand your system, you cannot trust it. We design for clarity, not cleverness.",
                },
                {
                  title: "Founders Think Differently",
                  description: "Founders think in systems, not features. They want a cockpit, not a cluttered toolbox. We build for how founders actually work.",
                },
              ].map((belief, idx) => (
                <div key={idx} className="bg-background p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{belief.title}</h3>
                  <p className="text-muted-foreground">{belief.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FUTURE */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">The Future of Automation</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              ETHINX is a step toward automation that is sovereign, legible, and emotionally sane. We are building toward a future where:
            </p>
            <ul className="space-y-4">
              {[
                "Automation is unified, not fragmented across tools",
                "Every action is visible and auditable",
                "You maintain full control and sovereignty",
                "The system grows with you, not against you",
                "Building a business feels like operating a well-designed system",
                "Founders have the same operational power as large organizations",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center mt-1">
                    <span className="text-accent-foreground text-sm font-bold">+</span>
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Join us</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We are building ETHINX in public. Come be part of the future of automation.
            </p>
            <Link href="/contact">
              <a className="cta-primary inline-flex items-center justify-center gap-2">
                Get in touch
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
