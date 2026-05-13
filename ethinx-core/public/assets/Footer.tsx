import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary text-background mt-20 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                <span className="text-foreground font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-lg">ETHINX</span>
            </div>
            <p className="text-sm opacity-80">Engineering Modern Content. Sovereign automation engine for founders who think in systems.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ecosystem"><a className="hover:text-accent transition-colors">Ecosystem</a></Link></li>
              <li><Link href="/cockpit"><a className="hover:text-accent transition-colors">Sovereign Cockpit</a></Link></li>
              <li><Link href="/subsystems"><a className="hover:text-accent transition-colors">Subsystems</a></Link></li>
              <li><Link href="/archetypes"><a className="hover:text-accent transition-colors">Archetypes</a></Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/architecture"><a className="hover:text-accent transition-colors">Architecture</a></Link></li>
              <li><Link href="/api"><a className="hover:text-accent transition-colors">API</a></Link></li>
              <li><Link href="/philosophy"><a className="hover:text-accent transition-colors">Philosophy</a></Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Newsletter</a></li>
              <li><Link href="/contact"><a className="hover:text-accent transition-colors">Contact</a></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
          <p>&copy; 2026 ETHINX. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
