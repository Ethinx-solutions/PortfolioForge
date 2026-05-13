import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, TrendingUp, Cog } from "lucide-react";
import { useState } from "react";

/**
 * Design Philosophy: Modern Minimalist with Gradient Accents
 * - Clean, spacious layouts with intentional whitespace
 * - Subtle gradient accents for visual interest
 * - Typography-driven hierarchy with clear contrast
 * - Micro-interactions that feel responsive and polished
 * 
 * Color Palette: Indigo (#1e40af) + Teal (#0d9488) + Off-white (#f8fafc)
 * Typography: Poppins (display), Inter (body)
 */

interface TemplateOption {
  id: string;
  title: string;
  description: string;
  passiveScore: number;
  icon: React.ReactNode;
  features: string[];
}

const templates: TemplateOption[] = [
  {
    id: "saas-mvp",
    title: "SaaS MVP with Subscription",
    description: "Build a complete SaaS product that generates recurring revenue through a subscription model.",
    passiveScore: 8,
    icon: <Zap className="w-6 h-6 text-teal-600" />,
    features: ["Cloud-native architecture", "Automated onboarding", "Recurring revenue model", "3-month scaling roadmap"]
  },
  {
    id: "notion-template",
    title: "High-Value Notion Setup",
    description: "Design a professional Notion template for sale on Gumroad with minimal maintenance.",
    passiveScore: 9,
    icon: <TrendingUp className="w-6 h-6 text-teal-600" />,
    features: ["High utility design", "Tiered pricing strategy", "Social media automation", "Low-effort updates"]
  },
  {
    id: "chrome-ext",
    title: "Income-Generating Chrome Extension",
    description: "Develop a Chrome extension with a freemium monetization model and organic growth strategy.",
    passiveScore: 7,
    icon: <Cog className="w-6 h-6 text-teal-600" />,
    features: ["Manifest v3 structure", "Freemium model", "Chrome Web Store optimization", "Passive income potential"]
  },
  {
    id: "content-system",
    title: "Automated Content/Affiliate Site",
    description: "Create an automated content system optimized for affiliate revenue and SEO with AI assistance.",
    passiveScore: 8,
    icon: <TrendingUp className="w-6 h-6 text-teal-600" />,
    features: ["AI content generation", "Automated scheduling", "SEO optimization", "Email marketing integration"]
  }
];

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id);
    setShowPrompt(true);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PF</span>
            </div>
            <span className="font-bold text-lg text-slate-900" style={{ fontFamily: 'Poppins, system-ui, -apple-system, sans-serif' }}>PromptForge</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#templates" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Templates</a>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="/images/hero-gradient-bg.png" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
        </div>
        