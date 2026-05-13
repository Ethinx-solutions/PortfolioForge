/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// ─── Empire OS Real-Time Event Types ────────────────────────────

/** Tier levels for EthinX products */
export type ProductTier = "Starter" | "Growth" | "Pro" | "Elite" | "Enterprise" | "Vault";

/** Event types for sales transactions */
export type EventType = "checkout" | "upsell" | "cross_sell" | "refund";

/** Source of the event */
export type EventSource = "stripe" | "hetzner" | "manual" | "simulation";

/** Alert priority levels */
export type AlertPriority = "standard" | "high" | "critical";

/** Alert status */
export type AlertStatus = "new" | "acknowledged" | "processed" | "dismissed";

/** Connection mode */
export type ConnectionMode = "live" | "simulation";

/** Tier pricing in cents (AUD) */
export const TIER_PRICES: Record<ProductTier, number> = {
  Starter: 3900,
  Growth: 7900,
  Pro: 12900,
  Elite: 29900,
  Enterprise: 39000,
  Vault: 250000,
};

/** Tier display colors */
export const TIER_COLORS: Record<ProductTier, string> = {
  Starter: "#22c55e",
  Growth: "#3b82f6",
  Pro: "#a855f7",
  Elite: "#f59e0b",
  Enterprise: "#ef4444",
  Vault: "#D4AF37",
};

/** High-value transaction threshold in cents ($2,500) */
export const HIGH_VALUE_THRESHOLD = 250000;

/** Determine alert priority from tier */
export function getAlertPriorityFromTier(tier: string): AlertPriority {
  if (tier === "Vault") return "critical";
  if (tier === "Enterprise") return "high";
  return "standard";
}

/** Check if a transaction is high-value */
export function isHighValueTransaction(amountCents: number): boolean {
  return amountCents >= HIGH_VALUE_THRESHOLD;
}
