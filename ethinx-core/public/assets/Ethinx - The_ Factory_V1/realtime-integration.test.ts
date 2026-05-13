import { describe, expect, it } from "vitest";

/**
 * Real-Time Data Integration Tests
 * Tests for the webhook ingestion contract, metrics computation,
 * event deduplication, neural alert auto-trigger, and live/simulation mode logic.
 */

// ─── Webhook Ingestion Contract ─────────────────────────────────

interface SalesEventInput {
  externalId?: string;
  customer: string;
  customerEmail?: string;
  amountCents: number;
  currency: string;
  tier: "Starter" | "Growth" | "Pro" | "Elite" | "Enterprise" | "Vault";
  eventType: "checkout" | "upsell" | "cross_sell" | "refund";
  source: "stripe" | "hetzner" | "manual" | "simulation";
  stripeSessionId?: string;
  metadata?: unknown;
}

const VALID_TIERS = ["Starter", "Growth", "Pro", "Elite", "Enterprise", "Vault"] as const;
const VALID_EVENT_TYPES = ["checkout", "upsell", "cross_sell", "refund"] as const;
const VALID_SOURCES = ["stripe", "hetzner", "manual", "simulation"] as const;

function validateSalesEventInput(input: Partial<SalesEventInput>): string[] {
  const errors: string[] = [];
  if (!input.customer || input.customer.trim() === "") errors.push("customer is required");
  if (typeof input.amountCents !== "number" || input.amountCents <= 0) errors.push("amountCents must be a positive integer");
  if (!input.tier || !VALID_TIERS.includes(input.tier as any)) errors.push("tier must be one of: " + VALID_TIERS.join(", "));
  if (input.eventType && !VALID_EVENT_TYPES.includes(input.eventType as any)) errors.push("invalid eventType");
  if (input.source && !VALID_SOURCES.includes(input.source as any)) errors.push("invalid source");
  return errors;
}

describe("Webhook Ingestion — Input Validation", () => {
  it("accepts a valid sales event input", () => {
    const input: SalesEventInput = {
      customer: "Parker B.",
      amountCents: 3900,
      currency: "AUD",
      tier: "Starter",
      eventType: "checkout",
      source: "stripe",
    };
    expect(validateSalesEventInput(input)).toHaveLength(0);
  });

  it("rejects missing customer", () => {
    const errors = validateSalesEventInput({
      amountCents: 3900,
      tier: "Starter",
    });
    expect(errors).toContain("customer is required");
  });

  it("rejects zero or negative amountCents", () => {
    expect(validateSalesEventInput({ customer: "Test", amountCents: 0, tier: "Starter" }))
      .toContain("amountCents must be a positive integer");
    expect(validateSalesEventInput({ customer: "Test", amountCents: -100, tier: "Starter" }))
      .toContain("amountCents must be a positive integer");
  });

  it("rejects invalid tier", () => {
    const errors = validateSalesEventInput({
      customer: "Test",
      amountCents: 3900,
      tier: "SuperTier" as any,
    });
    expect(errors).toContain("tier must be one of: " + VALID_TIERS.join(", "));
  });

  it("accepts all valid tiers", () => {
    VALID_TIERS.forEach((tier) => {
      const errors = validateSalesEventInput({
        customer: "Test",
        amountCents: 3900,
        tier,
      });
      expect(errors).not.toContain("tier must be one of: " + VALID_TIERS.join(", "));
    });
  });

  it("accepts all valid event types", () => {
    VALID_EVENT_TYPES.forEach((eventType) => {
      const errors = validateSalesEventInput({
        customer: "Test",
        amountCents: 3900,
        tier: "Starter",
        eventType,
      });
      expect(errors).not.toContain("invalid eventType");
    });
  });

  it("accepts all valid sources", () => {
    VALID_SOURCES.forEach((source) => {
      const errors = validateSalesEventInput({
        customer: "Test",
        amountCents: 3900,
        tier: "Starter",
        source,
      });
      expect(errors).not.toContain("invalid source");
    });
  });
});

// ─── Metrics Computation Logic ──────────────────────────────────

interface MetricsInput {
  totalRevenueCents: number;
  eventCount: number;
  upsellCount: number;
}

function computeMetrics(input: MetricsInput) {
  const avgOrderValue = input.eventCount > 0
    ? Math.round(input.totalRevenueCents / input.eventCount)
    : 0;
  const forgeConversion = input.eventCount > 0
    ? Number(((input.upsellCount / input.eventCount) * 100).toFixed(1))
    : 0;
  const hasLiveData = input.eventCount > 0;

  return {
    totalRevenueCents: input.totalRevenueCents,
    transactionCount: input.eventCount,
    avgOrderValueCents: avgOrderValue,
    forgeConversionRate: forgeConversion,
    upsellCount: input.upsellCount,
    hasLiveData,
  };
}

function getMetricStatus(metricName: string, value: number): "green" | "yellow" | "red" {
  switch (metricName) {
    case "forge_conversion_rate":
      return value >= 15 ? "green" : value >= 10 ? "yellow" : "red";
    case "total_revenue":
      return value > 0 ? "green" : "yellow";
    case "transaction_count":
      return value > 0 ? "green" : "yellow";
    case "avg_order_value":
      return value > 10000 ? "green" : value > 5000 ? "yellow" : "red";
    default:
      return "yellow";
  }
}

describe("Metrics Computation — Core Calculations", () => {
  it("computes correct metrics for a typical dataset", () => {
    const result = computeMetrics({
      totalRevenueCents: 4783200,
      eventCount: 1247,
      upsellCount: 233,
    });
    expect(result.transactionCount).toBe(1247);
    expect(result.totalRevenueCents).toBe(4783200);
    expect(result.avgOrderValueCents).toBe(Math.round(4783200 / 1247));
    expect(result.forgeConversionRate).toBeCloseTo(18.7, 0);
    expect(result.hasLiveData).toBe(true);
  });

  it("handles zero events gracefully", () => {
    const result = computeMetrics({
      totalRevenueCents: 0,
      eventCount: 0,
      upsellCount: 0,
    });
    expect(result.avgOrderValueCents).toBe(0);
    expect(result.forgeConversionRate).toBe(0);
    expect(result.hasLiveData).toBe(false);
  });

  it("computes correct forge conversion rate", () => {
    const result = computeMetrics({
      totalRevenueCents: 100000,
      eventCount: 100,
      upsellCount: 25,
    });
    expect(result.forgeConversionRate).toBe(25.0);
  });

  it("computes correct average order value", () => {
    const result = computeMetrics({
      totalRevenueCents: 500000,
      eventCount: 50,
      upsellCount: 10,
    });
    expect(result.avgOrderValueCents).toBe(10000); // $100.00
  });

  it("handles single event", () => {
    const result = computeMetrics({
      totalRevenueCents: 250000,
      eventCount: 1,
      upsellCount: 0,
    });
    expect(result.avgOrderValueCents).toBe(250000);
    expect(result.forgeConversionRate).toBe(0);
    expect(result.hasLiveData).toBe(true);
  });
});

describe("Metrics Computation — Status Indicators", () => {
  it("forge conversion: green at 15%+, yellow at 10-14%, red below 10%", () => {
    expect(getMetricStatus("forge_conversion_rate", 18.7)).toBe("green");
    expect(getMetricStatus("forge_conversion_rate", 15)).toBe("green");
    expect(getMetricStatus("forge_conversion_rate", 12)).toBe("yellow");
    expect(getMetricStatus("forge_conversion_rate", 10)).toBe("yellow");
    expect(getMetricStatus("forge_conversion_rate", 5)).toBe("red");
    expect(getMetricStatus("forge_conversion_rate", 0)).toBe("red");
  });

  it("total revenue: green when positive, yellow when zero", () => {
    expect(getMetricStatus("total_revenue", 100)).toBe("green");
    expect(getMetricStatus("total_revenue", 0)).toBe("yellow");
  });

  it("avg order value: green above $100, yellow $50-$100, red below $50", () => {
    expect(getMetricStatus("avg_order_value", 15000)).toBe("green");
    expect(getMetricStatus("avg_order_value", 10001)).toBe("green");
    expect(getMetricStatus("avg_order_value", 7500)).toBe("yellow");
    expect(getMetricStatus("avg_order_value", 5001)).toBe("yellow");
    expect(getMetricStatus("avg_order_value", 3000)).toBe("red");
  });
});

// ─── Neural Alert Auto-Trigger Logic ────────────────────────────

function shouldTriggerNeuralAlert(amountCents: number): boolean {
  return amountCents >= 250000;
}

function getAlertPriority(tier: string): "standard" | "high" | "critical" {
  if (tier === "Vault") return "critical";
  if (tier === "Enterprise") return "high";
  return "standard";
}

describe("Neural Alert Auto-Trigger", () => {
  it("triggers alert for Vault-level transactions ($2,500+)", () => {
    expect(shouldTriggerNeuralAlert(250000)).toBe(true);
    expect(shouldTriggerNeuralAlert(500000)).toBe(true);
    expect(shouldTriggerNeuralAlert(1000000)).toBe(true);
  });

  it("does not trigger for sub-$2,500 transactions", () => {
    expect(shouldTriggerNeuralAlert(249999)).toBe(false);
    expect(shouldTriggerNeuralAlert(39000)).toBe(false);
    expect(shouldTriggerNeuralAlert(3900)).toBe(false);
  });

  it("assigns correct priority based on tier", () => {
    expect(getAlertPriority("Vault")).toBe("critical");
    expect(getAlertPriority("Enterprise")).toBe("high");
    expect(getAlertPriority("Elite")).toBe("standard");
    expect(getAlertPriority("Pro")).toBe("standard");
    expect(getAlertPriority("Starter")).toBe("standard");
    expect(getAlertPriority("Growth")).toBe("standard");
  });
});

// ─── Event Deduplication Logic ──────────────────────────────────

function shouldDeduplicate(externalId: string | undefined, existingIds: Set<string>): boolean {
  if (!externalId) return false;
  return existingIds.has(externalId);
}

describe("Event Deduplication", () => {
  const existingIds = new Set(["evt_001", "evt_002", "cs_abc123"]);

  it("detects duplicate by externalId", () => {
    expect(shouldDeduplicate("evt_001", existingIds)).toBe(true);
    expect(shouldDeduplicate("cs_abc123", existingIds)).toBe(true);
  });

  it("allows new externalIds through", () => {
    expect(shouldDeduplicate("evt_999", existingIds)).toBe(false);
    expect(shouldDeduplicate("cs_new", existingIds)).toBe(false);
  });

  it("allows events without externalId (no dedup check)", () => {
    expect(shouldDeduplicate(undefined, existingIds)).toBe(false);
  });
});

// ─── Live/Simulation Mode Logic ─────────────────────────────────

function getDataMode(eventCount: number): "live" | "simulation" {
  return eventCount > 0 ? "live" : "simulation";
}

function getConnectionStatus(eventCount: number): {
  hetznerStatus: "connected" | "standby";
  mode: "live" | "simulation";
  hasLiveData: boolean;
} {
  return {
    hetznerStatus: eventCount > 0 ? "connected" : "standby",
    mode: eventCount > 0 ? "live" : "simulation",
    hasLiveData: eventCount > 0,
  };
}

describe("Live/Simulation Mode Switching", () => {
  it("returns simulation mode when no events exist", () => {
    expect(getDataMode(0)).toBe("simulation");
    const status = getConnectionStatus(0);
    expect(status.hetznerStatus).toBe("standby");
    expect(status.mode).toBe("simulation");
    expect(status.hasLiveData).toBe(false);
  });

  it("switches to live mode when events are present", () => {
    expect(getDataMode(1)).toBe("live");
    expect(getDataMode(100)).toBe("live");
    const status = getConnectionStatus(5);
    expect(status.hetznerStatus).toBe("connected");
    expect(status.mode).toBe("live");
    expect(status.hasLiveData).toBe(true);
  });
});

// ─── Webhook Endpoint Contract ──────────────────────────────────

interface WebhookPayload {
  type: string;
  customer: string;
  amount_cents: number;
  tier: string;
  event_type?: string;
  external_id?: string;
  stripe_session_id?: string;
}

function validateWebhookPayload(payload: Partial<WebhookPayload>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!payload.type) errors.push("type is required");
  if (!payload.customer) errors.push("customer is required");
  if (typeof payload.amount_cents !== "number" || payload.amount_cents <= 0) errors.push("amount_cents must be positive");
  if (!payload.tier) errors.push("tier is required");
  return { valid: errors.length === 0, errors };
}

describe("Webhook Payload Validation", () => {
  it("accepts a valid Hetzner webhook payload", () => {
    const result = validateWebhookPayload({
      type: "sale",
      customer: "Parker B.",
      amount_cents: 3900,
      tier: "Starter",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects payload missing required fields", () => {
    const result = validateWebhookPayload({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("rejects payload with invalid amount", () => {
    const result = validateWebhookPayload({
      type: "sale",
      customer: "Test",
      amount_cents: -100,
      tier: "Starter",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("amount_cents must be positive");
  });

  it("accepts payload with optional fields", () => {
    const result = validateWebhookPayload({
      type: "sale",
      customer: "Test",
      amount_cents: 250000,
      tier: "Vault",
      external_id: "evt_vault_001",
      stripe_session_id: "cs_test_123",
      event_type: "checkout",
    });
    expect(result.valid).toBe(true);
  });
});

// ─── Stripe Webhook Event Mapping ───────────────────────────────

function mapStripeEventToSalesEvent(session: {
  id: string;
  customer_details?: { name?: string; email?: string };
  amount_total?: number;
  currency?: string;
  metadata?: Record<string, string>;
}): SalesEventInput | null {
  const customer = session.customer_details?.name || "Unknown";
  const amountCents = session.amount_total ?? 0;
  if (amountCents <= 0) return null;

  return {
    externalId: session.id,
    customer,
    customerEmail: session.customer_details?.email,
    amountCents,
    currency: (session.currency || "aud").toUpperCase(),
    tier: (session.metadata?.tier as any) || "Starter",
    eventType: "checkout",
    source: "stripe",
    stripeSessionId: session.id,
  };
}

describe("Stripe Event Mapping", () => {
  it("maps a complete Stripe checkout session", () => {
    const result = mapStripeEventToSalesEvent({
      id: "cs_test_abc123",
      customer_details: { name: "Parker B.", email: "parker@test.com" },
      amount_total: 3900,
      currency: "aud",
      metadata: { tier: "Starter" },
    });
    expect(result).not.toBeNull();
    expect(result!.customer).toBe("Parker B.");
    expect(result!.amountCents).toBe(3900);
    expect(result!.currency).toBe("AUD");
    expect(result!.tier).toBe("Starter");
    expect(result!.source).toBe("stripe");
    expect(result!.externalId).toBe("cs_test_abc123");
  });

  it("returns null for zero-amount sessions", () => {
    const result = mapStripeEventToSalesEvent({
      id: "cs_test_zero",
      amount_total: 0,
    });
    expect(result).toBeNull();
  });

  it("defaults to 'Unknown' customer when name is missing", () => {
    const result = mapStripeEventToSalesEvent({
      id: "cs_test_noname",
      amount_total: 7900,
      metadata: { tier: "Growth" },
    });
    expect(result!.customer).toBe("Unknown");
  });

  it("defaults to Starter tier when metadata is missing", () => {
    const result = mapStripeEventToSalesEvent({
      id: "cs_test_notier",
      customer_details: { name: "Test" },
      amount_total: 3900,
    });
    expect(result!.tier).toBe("Starter");
  });

  it("normalizes currency to uppercase", () => {
    const result = mapStripeEventToSalesEvent({
      id: "cs_test_cur",
      customer_details: { name: "Test" },
      amount_total: 3900,
      currency: "usd",
    });
    expect(result!.currency).toBe("USD");
  });
});
