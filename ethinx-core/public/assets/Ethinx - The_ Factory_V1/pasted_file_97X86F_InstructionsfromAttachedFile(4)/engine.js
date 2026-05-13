/**
 * PromptForge Income Builder - Core Engine
 * Handles NLP parsing, template matching, and prompt assembly.
 */

const INCOME_KEYWORDS = [
  "make money", "passive income", "revenue", "sell", "monetize", 
  "side hustle", "business", "earn", "profit", "saas", "ecommerce",
  "digital product", "affiliate", "ads", "subscription"
];

const TEMPLATES = [
  {
    id: "saas-mvp",
    title: "SaaS MVP with Subscription",
    category: "web/mobile/SaaS",
    tags: ["revenue", "scale", "automation"],
    passiveScore: 8,
    template: "Build a complete [niche] SaaS MVP that generates revenue through a subscription model. Scale via cloud-native architecture and automated user onboarding. Include MVP specs, tech stack (favoring no-code/low-code if possible), monetization plan, and a growth strategy focusing on recurring revenue."
  },
  {
    id: "notion-template",
    title: "High-Value Notion Setup",
    category: "digital products",
    tags: ["passive", "low-effort"],
    passiveScore: 9,
    template: "Design a professional [niche] Notion template for sale on Gumroad. Focus on high utility and scalability. Include a marketing plan for social media automation and a strategy for tiered pricing (Basic vs Pro with automation workflows)."
  },
  {
    id: "chrome-ext",
    title: "Income-Generating Chrome Extension",
    category: "apps",
    tags: ["utility", "monetize"],
    passiveScore: 7,
    template: "Develop a Chrome extension for [niche] that solves a specific pain point. Monetize via a freemium model with a 'Pro' tier for advanced automation features. Provide the manifest v3 structure, core logic, and a plan for organic growth via the Chrome Web Store."
  },
  {
    id: "content-system",
    title: "Automated Content/Affiliate Site",
    category: "content systems",
    tags: ["automation", "affiliate"],
    passiveScore: 8,
    template: "Create an automated content system for [niche] optimized for affiliate revenue and SEO. Use AI for content generation and scheduling. Include a roadmap for scaling to 10k monthly visitors and integrating automated email marketing."
  }
];

export function detectIncomeIntent(input) {
  const lowerInput = input.toLowerCase();
  return INCOME_KEYWORDS.some(keyword => lowerInput.includes(keyword));
}

export function findMatches(input) {
  const lowerInput = input.toLowerCase();
  // Simple keyword matching for demo; production would use compromise.js or semantic search
  return TEMPLATES.filter(t => 
    t.category.toLowerCase().includes(lowerInput) || 
    t.tags.some(tag => lowerInput.includes(tag)) ||
    lowerInput.includes(t.title.toLowerCase())
  ).sort((a, b) => b.passiveScore - a.passiveScore);
}

export function assemblePrompt(template, userDetails, adaptations = "") {
  let prompt = template.replace("[niche]", userDetails);
  if (adaptations) {
    prompt += `\n\nAdaptations: ${adaptations}`;
  }
  // Mandatory Income Enhancers
  prompt += "\n\nAdditional Requirements for Profitability:";
  prompt += "\n- Include a Revenue Model Canvas.";
  prompt += "\n- Outline basic unit economics (CAC/LTV).";
  prompt += "\n- Provide an automation flowchart for minimal maintenance.";
  prompt += "\n- Define a 3-month scaling roadmap.";
  return prompt;
}
