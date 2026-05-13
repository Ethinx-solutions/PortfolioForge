import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Philosophy() {
  const principles = [
    {
      title: "Automation as Sovereignty",
      description: "Automation should give you more control, not less. ETHINX is built so you can see, understand, and steer every part of your system.",
    },
    {
      title: "Systems Over Features",
      description: "We think in systems, not features. Every component is designed to work together, creating exponential power through composition.",
    },
    {
      title: "Legibility Over Cleverness",
      description: "Complexity is inevitable. Our job is to make it manageable, transparent, and understandable. No hidden behavior, no magic.",
    },
    {
      title: "Founder-Grade Control",
      description: "You should have the same operational clarity and power as the largest organizations. ETHINX democratizes that capability.",
    },
    {
      title: "Audit-Driven Design",
      description: "If you cannot see it, you cannot trust it. Every action, decision, and outcome is logged and traceable.",
    },
    {
      title: "Emotional Clarity",
      description: "Good systems reduce anxiety. ETHINX is designed to make your operational world feel calmer, not noisier.",
    },
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
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Our Philosophy</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  ETHINX is built on a clear set of principles about what automation should be, how systems should work, and what founders deserve.
                </p>
              </div>
              <div className="flex justify-center animate-float">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663263238695/mJGrfetK4zeYhgVdM8fcdz/tdog-action-full-KaFkZkyLHPuu4XetJqvBtX.webp"
                  alt="TDog in action"
                  className="w-64 h-64 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* PRINCIPLES */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {principles.map((principle, idx) => (
                <div key={idx} className="bg-background p-8 rounded-lg border border-border">
                  <h3 className="text-2xl font-semibold mb-4 text-foreground">{principle.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">The Problem We Solve</h2>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Most founders juggle tools. Zapier for workflows, ChatGPT for content, Stripe for payments, Airtable for data, email for communication. Each tool is powerful in isolation, but together they create chaos.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                You spend more time managing integrations than building your business. You have no unified view of what is happening. You cannot audit decisions. You cannot scale without hiring. You feel locked into tools that do not quite fit.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ETHINX solves this by giving you a single, integrated system where every subsystem works together, every action is visible, and you maintain full control.
              </p>
            </div>
          </div>
        </section>

        {/* THE VISION */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Our Vision</h2>
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We believe the future of business is radically different from today. Founders will operate from a single cockpit where their entire business comes into focus.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Automation will not be fragmented across tools. It will be unified, observable, and under your control. You will have the operational clarity of a Fortune 500 company with the agility of a solo founder.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    ETHINX is a step toward that future. It is not the final form—it is the foundation. Everything we build is designed to be extended, modified, and customized for your unique way of operating.
                  </p>
                </div>
              </div>
              <div className="flex justify-center animate-float-delayed">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663263238695/mJGrfetK4zeYhgVdM8fcdz/tdog-small-companion-full-esyJgBkZJQ7LhgzxNvTdaq.webp"
                  alt="TDog companion"
                  className="w-48 h-48 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* VALUES IN ACTION */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Values in Action</h2>
            <div className="space-y-8">
              {[
                {
                  scenario: "When you need to debug a workflow",
                  principle: "Audit-Driven Design",
                  action: "You can see every step, every decision, every outcome. No black boxes.",
                },
                {
                  scenario: "When you want to scale your operations",
                  principle: "Systems Over Features",
                  action: "You do not add more tools. You configure ETHINX to handle new complexity.",
                },
                {
                  scenario: "When you need to understand your business",
                  principle: "Legibility Over Cleverness",
                  action: "The system is designed to be understood. Complexity is managed, not hidden.",
                },
                {
                  scenario: "When you feel overwhelmed",
                  principle: "Emotional Clarity",
                  action: "The Cockpit is designed to reduce anxiety, not increase it. You feel in control.",
                },
              ].map((item, idx) => (
                <div key={idx} className="border-l-4 border-accent pl-6">
                  <p className="text-sm text-accent font-semibold mb-2 uppercase">{item.scenario}</p>
                  <h3 className="text-2xl font-semibold mb-2 text-foreground">{item.principle}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Join the movement</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We are building a different kind of automation platform. One that respects your intelligence and your autonomy.
            </p>
            <Link href="/contact">
              <a className="cta-primary inline-flex items-center justify-center gap-2">
                Get involved
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
