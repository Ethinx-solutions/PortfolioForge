import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Archetypes() {
  const archetypes = [
    { name: "The Retiree", description: "Building passive income streams and digital assets for financial independence." },
    { name: "The Tradie", description: "Scaling a skilled trade business with automation and online presence." },
    { name: "The Creator", description: "Monetizing content and building a sustainable creator economy business." },
    { name: "The Consultant", description: "Packaging expertise into scalable digital products and services." },
    { name: "The Founder", description: "Building and scaling a SaaS or tech startup with lean operations." },
    { name: "The Agency Owner", description: "Managing multiple client projects with systematic delivery." },
    { name: "The Coach", description: "Creating and selling online courses and coaching programs." },
    { name: "The E-Commerce Seller", description: "Running and scaling an online store with automation." },
    { name: "The Marketer", description: "Building marketing funnels and managing digital campaigns." },
    { name: "The Community Builder", description: "Creating and monetizing online communities and memberships." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">10 Real-World Archetypes</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              ETHINX adapts to how you work. Each archetype is a pre-configured business blueprint that reshapes the entire system around your specific needs and workflows.
            </p>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* ARCHETYPES GRID */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {archetypes.map((archetype, idx) => (
                <Link key={idx} href={`/archetypes/${archetype.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <a className="group bg-background p-8 rounded-lg border border-border hover:border-accent transition-all hover:shadow-lg cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-semibold text-foreground group-hover:text-accent transition-colors flex-1">
                        {archetype.name}
                      </h3>
                      <ArrowRight size={20} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{archetype.description}</p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HOW ARCHETYPES WORK */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">How archetypes reshape ETHINX</h2>
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Select Your Archetype",
                  description: "Choose the blueprint that matches your business model and goals.",
                },
                {
                  step: "2",
                  title: "System Reconfigures",
                  description: "ETHINX adapts its subsystems, workflows, and defaults to your archetype.",
                },
                {
                  step: "3",
                  title: "Pre-Built Workflows",
                  description: "Get ready-to-run workflows specific to your business type.",
                },
                {
                  step: "4",
                  title: "Customizable Templates",
                  description: "Modify templates to match your unique approach and brand.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-accent text-accent-foreground font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Find your fit</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Each archetype comes with everything you need to start building, selling, and evolving your business.
            </p>
            <Link href="/contact">
              <a className="cta-primary inline-flex items-center justify-center gap-2">
                Get started
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
