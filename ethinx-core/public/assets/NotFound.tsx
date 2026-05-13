import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container max-w-2xl text-center">
          <div className="mb-8">
            <h1 className="text-7xl md:text-8xl font-bold text-accent mb-4">404</h1>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Page Not Found</h2>
            <p className="text-xl text-muted-foreground mb-8">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <a className="cta-primary inline-flex items-center justify-center gap-2">
                Back to Home
                <ArrowRight size={18} />
              </a>
            </Link>
            <Link href="/ecosystem">
              <a className="cta-secondary inline-flex items-center justify-center gap-2">
                Explore Ecosystem
              </a>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
