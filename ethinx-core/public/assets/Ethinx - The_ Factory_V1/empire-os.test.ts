import { describe, expect, it } from "vitest";

/**
 * Empire OS Dashboard Tests
 * Tests for the data models, business logic, and configuration
 * used across the dashboard pages.
 */

// --- Revenue Forge V2 Logic ---

const TIER_PRICES: Record<string, number> = {
  Starter: 3900,
  Growth: 7900,
  Pro: 12900,
  Elite: 29900,
  Enterprise: 39000,
  Vault: 250000,
};

interface UpsellConfig {
  tier: string;
  basePrice: number;
  upsellName: string;
  upsellPrice: number;
  bundleDiscount: number;
  upsellType: "anchor" | "standard" | "whale";
}

const UPSELL_CONFIGS: UpsellConfig[] = [
  { tier: "Starter", basePrice: 3900, upsellName: "Pro-Growth Accelerator", upsellPrice: 4900, bundleDiscount: 20, upsellType: "anchor" },
  { tier: "Growth", basePrice: 7900, upsellName: "Pro-Growth Accelerator", upsellPrice: 4900, bundleDiscount: 20, upsellType: "anchor" },
  { tier: "Pro", basePrice: 12900, upsellName: "Bio Suite", upsellPrice: 2900, bundleDiscount: 15, upsellType: "standard" },
  { tier: "Elite", basePrice: 29900, upsellName: "Bio Suite", upsellPrice: 2900, bundleDiscount: 15, upsellType: "standard" },
  { tier: "Enterprise", basePrice: 39000, upsellName: "Bio Suite", upsellPrice: 2900, bundleDiscount: 15, upsellType: "standard" },
  { tier: "Vault", basePrice: 250000, upsellName: "Neural Priority Pipeline", upsellPrice: 19900, bundleDiscount: 15, upsellType: "whale" },
];

type UrgencyLevel = "medium" | "high" | "critical";

function getUrgencyLevel(slots: number): UrgencyLevel {
  if (slots <= 2) return "critical";
  if (slots <= 3) return "high";
  return "medium";
}

function calculateBundlePrice(config: UpsellConfig): {
  bundleTotal: number;
  discountAmount: number;
  finalPrice: number;
} {
  const bundleTotal = config.basePrice + config.upsellPrice;
  const discountAmount = Math.round(bundleTotal * (config.bundleDiscount / 100));
  const finalPrice = bundleTotal - discountAmount;
  return { bundleTotal, discountAmount, finalPrice };
}

// --- Neural Recon Logic ---

type AlertPriority = "standard" | "high" | "critical";

function getAlertPriority(tier: string): AlertPriority {
  if (tier === "Vault") return "critical";
  if (tier === "Enterprise") return "high";
  return "standard";
}

function isHighValueTransaction(amountCents: number): boolean {
  return amountCents >= 250000; // $2,500+
}

// --- Tests ---

describe("Revenue Forge V2 — Tier Pricing", () => {
  it("has 6 tiers defined with correct prices", () => {
    expect(Object.keys(TIER_PRICES)).toHaveLength(6);
    expect(TIER_PRICES.Starter).toBe(3900);
    expect(TIER_PRICES.Growth).toBe(7900);
    expect(TIER_PRICES.Pro).toBe(12900);
    expect(TIER_PRICES.Elite).toBe(29900);
    expect(TIER_PRICES.Enterprise).toBe(39000);
    expect(TIER_PRICES.Vault).toBe(250000);
  });

  it("prices are in ascending order", () => {
    const prices = Object.values(TIER_PRICES);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThan(prices[i - 1]);
    }
  });

  it("all prices are positive integers (cents)", () => {
    Object.values(TIER_PRICES).forEach((price) => {
      expect(price).toBeGreaterThan(0);
      expect(Number.isInteger(price)).toBe(true);
    });
  });
});

describe("Revenue Forge V2 — Upsell Configuration", () => {
  it("each tier has a matching upsell config", () => {
    Object.keys(TIER_PRICES).forEach((tier) => {
      const config = UPSELL_CONFIGS.find((c) => c.tier === tier);
      expect(config).toBeDefined();
    });
  });

  it("Starter and Growth tiers use anchor upsell type", () => {
    const starterConfig = UPSELL_CONFIGS.find((c) => c.tier === "Starter");
    const growthConfig = UPSELL_CONFIGS.find((c) => c.tier === "Growth");
    expect(starterConfig?.upsellType).toBe("anchor");
    expect(growthConfig?.upsellType).toBe("anchor");
    expect(starterConfig?.upsellName).toBe("Pro-Growth Accelerator");
    expect(growthConfig?.upsellName).toBe("Pro-Growth Accelerator");
  });

  it("Vault tier uses whale upsell type with Neural Priority Pipeline", () => {
    const vaultConfig = UPSELL_CONFIGS.find((c) => c.tier === "Vault");
    expect(vaultConfig?.upsellType).toBe("whale");
    expect(vaultConfig?.upsellName).toBe("Neural Priority Pipeline");
    expect(vaultConfig?.upsellPrice).toBe(19900);
  });

  it("mid-tier (Pro, Elite, Enterprise) uses standard upsell type with Bio Suite", () => {
    ["Pro", "Elite", "Enterprise"].forEach((tier) => {
      const config = UPSELL_CONFIGS.find((c) => c.tier === tier);
      expect(config?.upsellType).toBe("standard");
      expect(config?.upsellName).toBe("Bio Suite");
    });
  });

  it("bundle discounts are within valid range (10-25%)", () => {
    UPSELL_CONFIGS.forEach((config) => {
      expect(config.bundleDiscount).toBeGreaterThanOrEqual(10);
      expect(config.bundleDiscount).toBeLessThanOrEqual(25);
    });
  });
});

describe("Revenue Forge V2 — Bundle Pricing Calculation", () => {
  it("calculates Starter bundle correctly (20% discount)", () => {
    const config = UPSELL_CONFIGS.find((c) => c.tier === "Starter")!;
    const result = calculateBundlePrice(config);
    expect(result.bundleTotal).toBe(3900 + 4900); // $88
    expect(result.discountAmount).toBe(Math.round(8800 * 0.2)); // $17.60
    expect(result.finalPrice).toBe(8800 - 1760); // $70.40
  });

  it("calculates Vault bundle correctly (15% discount)", () => {
    const config = UPSELL_CONFIGS.find((c) => c.tier === "Vault")!;
    const result = calculateBundlePrice(config);
    expect(result.bundleTotal).toBe(250000 + 19900); // $2,699
    expect(result.discountAmount).toBe(Math.round(269900 * 0.15)); // $404.85
    expect(result.finalPrice).toBe(269900 - 40485); // $2,294.15
  });

  it("final price is always less than bundle total", () => {
    UPSELL_CONFIGS.forEach((config) => {
      const result = calculateBundlePrice(config);
      expect(result.finalPrice).toBeLessThan(result.bundleTotal);
      expect(result.finalPrice).toBeGreaterThan(0);
    });
  });
});

describe("Revenue Forge V2 — Scarcity Engine", () => {
  it("returns critical urgency when slots <= 2", () => {
    expect(getUrgencyLevel(1)).toBe("critical");
    expect(getUrgencyLevel(2)).toBe("critical");
  });

  it("returns high urgency when slots = 3", () => {
    expect(getUrgencyLevel(3)).toBe("high");
  });

  it("returns medium urgency when slots >= 4", () => {
    expect(getUrgencyLevel(4)).toBe("medium");
    expect(getUrgencyLevel(5)).toBe("medium");
  });

  it("urgency escalates as slots decrease", () => {
    const levels: UrgencyLevel[] = ["medium", "high", "critical"];
    const urgencyOrder = (level: UrgencyLevel) => levels.indexOf(level);

    expect(urgencyOrder(getUrgencyLevel(5))).toBeLessThanOrEqual(urgencyOrder(getUrgencyLevel(3)));
    expect(urgencyOrder(getUrgencyLevel(3))).toBeLessThanOrEqual(urgencyOrder(getUrgencyLevel(1)));
  });
});

describe("Neural Recon — Alert Priority", () => {
  it("Vault tier triggers critical priority", () => {
    expect(getAlertPriority("Vault")).toBe("critical");
  });

  it("Enterprise tier triggers high priority", () => {
    expect(getAlertPriority("Enterprise")).toBe("high");
  });

  it("other tiers trigger standard priority", () => {
    expect(getAlertPriority("Elite")).toBe("standard");
    expect(getAlertPriority("Pro")).toBe("standard");
    expect(getAlertPriority("Starter")).toBe("standard");
  });
});

describe("Neural Recon — High-Value Transaction Detection", () => {
  it("detects Vault-level transactions as high-value ($2,500+)", () => {
    expect(isHighValueTransaction(250000)).toBe(true);
    expect(isHighValueTransaction(500000)).toBe(true);
  });

  it("does not flag sub-$2,500 transactions as high-value", () => {
    expect(isHighValueTransaction(249999)).toBe(false);
    expect(isHighValueTransaction(39000)).toBe(false);
    expect(isHighValueTransaction(3900)).toBe(false);
  });

  it("boundary test: exactly $2,500 is high-value", () => {
    expect(isHighValueTransaction(250000)).toBe(true);
  });
});

describe("Blueprint — Section Structure", () => {
  const SECTION_IDS = [
    "vision", "architecture", "control-console", "monetization",
    "gamification", "phase1", "security", "empire",
  ];

  it("has 8 blueprint sections defined", () => {
    expect(SECTION_IDS).toHaveLength(8);
  });

  it("includes all required sections", () => {
    expect(SECTION_IDS).toContain("vision");
    expect(SECTION_IDS).toContain("architecture");
    expect(SECTION_IDS).toContain("monetization");
    expect(SECTION_IDS).toContain("phase1");
    expect(SECTION_IDS).toContain("security");
    expect(SECTION_IDS).toContain("empire");
  });

  it("section IDs are unique", () => {
    const unique = new Set(SECTION_IDS);
    expect(unique.size).toBe(SECTION_IDS.length);
  });
});

describe("Citadel Silo Monitor — Configuration", () => {
  const SILOS = [
    { code: "01", name: "PROJECTS" },
    { code: "02", name: "ASSETS" },
    { code: "03", name: "LOGS" },
    { code: "04", name: "DOCUMENTS" },
    { code: "05", name: "ARCHIVE" },
  ];

  it("has 5 silos matching the T-DOG_EMPIRE structure", () => {
    expect(SILOS).toHaveLength(5);
  });

  it("silos are numbered sequentially from 01 to 05", () => {
    SILOS.forEach((silo, index) => {
      expect(silo.code).toBe(String(index + 1).padStart(2, "0"));
    });
  });

  it("includes all required silo names", () => {
    const names = SILOS.map((s) => s.name);
    expect(names).toContain("PROJECTS");
    expect(names).toContain("ASSETS");
    expect(names).toContain("LOGS");
    expect(names).toContain("DOCUMENTS");
    expect(names).toContain("ARCHIVE");
  });
});
