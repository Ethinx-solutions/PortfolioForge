import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Ecosystem", href: "/ecosystem" },
    { label: "Subsystems", href: "/subsystems" },
    { label: "Cockpit", href: "/cockpit" },
    { label: "Archetypes", href: "/archetypes" },
    { label: "Architecture", href: "/architecture" },
    { label: "API", href: "/api" },
    { label: "Philosophy", href: "/philosophy" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg text-foreground">ETHINX</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
                {item.label}
              </a>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className="block px-3 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
