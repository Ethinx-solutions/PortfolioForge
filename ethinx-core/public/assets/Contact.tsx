import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, Github, Zap } from "lucide-react";

export default function Contact() {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Discord",
      description: "Join the operations room where ETHINX evolves in public.",
      link: "#",
      cta: "Join Discord",
    },
    {
      icon: Mail,
      title: "Newsletter",
      description: "Receive distilled updates on new subsystems, archetypes, and workflows.",
      link: "#",
      cta: "Subscribe",
    },
    {
      icon: Github,
      title: "GitHub",
      description: "Explore the code, architecture, and issues as they emerge.",
      link: "#",
      cta: "View GitHub",
    },
    {
      icon: Zap,
      title: "Early Access",
      description: "Put your name down to be among the first to operate from the Sovereign Cockpit.",
      link: "#",
      cta: "Request Access",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Get in Touch</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              ETHINX is being built in public. Join the community, explore the code, or request early access.
            </p>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* CONTACT METHODS */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contactMethods.map((method, idx) => {
                const Icon = method.icon;
                return (
                  <a
                    key={idx}
                    href={method.link}
                    className="group bg-background p-8 rounded-lg border border-border hover:border-accent transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Icon size={24} className="text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                          {method.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">{method.description}</p>
                    <button className="text-accent font-semibold text-sm hover:gap-3 transition-all inline-flex items-center gap-2">
                      {method.cta}
                      <span>→</span>
                    </button>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* EMAIL FORM */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Stay Updated</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-2">
                  What are you interested in?
                </label>
                <select
                  id="interest"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                >
                  <option value="">Select an option</option>
                  <option value="early-access">Early Access</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us what you think..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="cta-primary w-full inline-flex items-center justify-center"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "When will ETHINX be available?",
                  a: "ETHINX is currently in development with early access available to selected founders. Join our Discord or request early access to stay updated.",
                },
                {
                  q: "Is ETHINX open source?",
                  a: "We are committed to transparency and are exploring open source options. Follow our GitHub for updates.",
                },
                {
                  q: "Can I integrate ETHINX with my existing tools?",
                  a: "Yes. ETHINX is designed to integrate with existing tools through APIs, webhooks, and custom connectors.",
                },
                {
                  q: "What is the pricing model?",
                  a: "Pricing details will be announced closer to launch. Early access participants will have special pricing.",
                },
                {
                  q: "Is there a free tier?",
                  a: "We are exploring free tier options for solo founders and small teams. Details coming soon.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-background p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{item.q}</h3>
                  <p className="text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
