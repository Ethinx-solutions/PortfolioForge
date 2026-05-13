import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function API() {
  const apiEndpoints = [
    {
      name: "Workflows API",
      description: "Create, manage, and execute workflows programmatically.",
      methods: ["GET /workflows", "POST /workflows", "PUT /workflows/:id", "DELETE /workflows/:id"],
    },
    {
      name: "Agents API",
      description: "Deploy, monitor, and orchestrate multi-agent systems.",
      methods: ["GET /agents", "POST /agents", "GET /agents/:id/status", "POST /agents/:id/execute"],
    },
    {
      name: "Content API",
      description: "Generate and manage content across all formats and channels.",
      methods: ["POST /content/generate", "GET /content/:id", "PUT /content/:id", "DELETE /content/:id"],
    },
    {
      name: "Branding API",
      description: "Access and apply brand guidelines programmatically.",
      methods: ["GET /branding/guidelines", "POST /branding/apply", "GET /branding/assets"],
    },
    {
      name: "Analytics API",
      description: "Query system performance, outcomes, and insights.",
      methods: ["GET /analytics/metrics", "GET /analytics/workflows/:id", "GET /analytics/agents/:id"],
    },
    {
      name: "Cockpit API",
      description: "Control and query the Sovereign Cockpit programmatically.",
      methods: ["GET /cockpit/state", "POST /cockpit/signal", "GET /cockpit/alerts"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">ETHINX API</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Build on top of ETHINX. Our comprehensive REST and WebSocket APIs give you programmatic access to every subsystem and capability.
            </p>
          </div>
        </section>

        <div className="accent-bar"></div>

        {/* API OVERVIEW */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">API Overview</h2>
            <div className="space-y-6">
              {[
                {
                  title: "REST API",
                  description: "Standard HTTP endpoints for all CRUD operations and system interactions.",
                },
                {
                  title: "WebSocket API",
                  description: "Real-time bidirectional communication for live updates and streaming data.",
                },
                {
                  title: "Event Streams",
                  description: "Subscribe to system events and build reactive applications.",
                },
                {
                  title: "Webhooks",
                  description: "Receive notifications when important events occur in your system.",
                },
              ].map((api, idx) => (
                <div key={idx} className="bg-background p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{api.title}</h3>
                  <p className="text-muted-foreground">{api.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API ENDPOINTS */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">Core Endpoints</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {apiEndpoints.map((endpoint, idx) => (
                <div key={idx} className="bg-secondary p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{endpoint.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{endpoint.description}</p>
                  <div className="space-y-2">
                    {endpoint.methods.map((method, midx) => (
                      <code key={midx} className="block text-xs bg-background p-2 rounded border border-border text-accent">
                        {method}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AUTHENTICATION */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Authentication</h2>
            <div className="space-y-6">
              <div className="bg-background p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3 text-foreground">API Keys</h3>
                <p className="text-muted-foreground mb-4">
                  Generate API keys from the Cockpit. Include your key in the Authorization header for all requests.
                </p>
                <code className="block bg-background p-3 rounded border border-border text-sm text-accent overflow-x-auto">
                  Authorization: Bearer your_api_key_here
                </code>
              </div>

              <div className="bg-background p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3 text-foreground">OAuth 2.0</h3>
                <p className="text-muted-foreground">
                  For user-facing applications, use OAuth 2.0 to delegate authentication to ETHINX.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-3 text-foreground">Rate Limiting</h3>
                <p className="text-muted-foreground">
                  Standard tier: 1000 requests per minute. Enterprise tier: Custom limits available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EXAMPLES */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Quick Start</h2>
            <div className="bg-secondary p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Create a workflow</h3>
              <pre className="bg-background p-4 rounded border border-border text-xs overflow-x-auto text-accent">
{`curl -X POST https://api.ethinx.io/workflows \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Daily Report",
    "description": "Generate and send daily reports",
    "steps": [
      {
        "type": "content_generate",
        "prompt": "Create a daily summary"
      },
      {
        "type": "distribution",
        "channel": "email",
        "recipients": ["team@example.com"]
      }
    ]
  }'`}
              </pre>
            </div>
          </div>
        </section>

        {/* SDK */}
        <section className="py-20 md:py-28 bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Official SDKs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Python", url: "#" },
                { name: "JavaScript/TypeScript", url: "#" },
                { name: "Go", url: "#" },
                { name: "Ruby", url: "#" },
              ].map((sdk) => (
                <a
                  key={sdk.name}
                  href={sdk.url}
                  className="group bg-background p-6 rounded-lg border border-border hover:border-accent transition-all hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                    {sdk.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">Official SDK for {sdk.name}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Start building</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Full API documentation, code examples, and interactive playground available.
            </p>
            <a href="#" className="cta-primary inline-flex items-center justify-center gap-2">
              View full documentation
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
