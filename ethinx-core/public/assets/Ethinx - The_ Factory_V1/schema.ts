import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Sales events from Stripe webhooks and Hetzner backend.
 * Each row represents a single transaction or upsell event.
 */
export const salesEvents = mysqlTable("sales_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique event ID from source (Stripe event ID or Hetzner event ID) */
  externalId: varchar("externalId", { length: 128 }).unique(),
  /** Customer display name */
  customer: varchar("customer", { length: 255 }).notNull(),
  /** Customer email if available */
  customerEmail: varchar("customerEmail", { length: 320 }),
  /** Amount in cents (AUD) */
  amountCents: int("amountCents").notNull(),
  /** Currency code */
  currency: varchar("currency", { length: 3 }).default("AUD").notNull(),
  /** Product tier: Starter, Growth, Pro, Elite, Enterprise, Vault */
  tier: mysqlEnum("tier", ["Starter", "Growth", "Pro", "Elite", "Enterprise", "Vault"]).notNull(),
  /** Event type: checkout, upsell, cross_sell, refund */
  eventType: mysqlEnum("eventType", ["checkout", "upsell", "cross_sell", "refund"]).default("checkout").notNull(),
  /** Source of the event */
  source: mysqlEnum("source", ["stripe", "hetzner", "manual", "simulation"]).default("stripe").notNull(),
  /** Stripe session/payment intent ID */
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  /** Additional metadata as JSON */
  metadata: json("metadata"),
  /** When the transaction occurred */
  eventTimestamp: timestamp("eventTimestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SalesEvent = typeof salesEvents.$inferSelect;
export type InsertSalesEvent = typeof salesEvents.$inferInsert;

/**
 * Neural Recon alerts for high-value transactions ($2,500+).
 * Triggered automatically when a Vault-tier or high-value event is ingested.
 */
export const neuralAlerts = mysqlTable("neural_alerts", {
  id: int("id").autoincrement().primaryKey(),
  /** Reference to the sales event that triggered this alert */
  salesEventId: int("salesEventId"),
  /** Customer name */
  customer: varchar("customer", { length: 255 }).notNull(),
  /** Amount in cents */
  amountCents: int("amountCents").notNull(),
  /** Product tier */
  tier: varchar("tier", { length: 32 }).notNull(),
  /** Alert priority: standard, high, critical */
  priority: mysqlEnum("priority", ["standard", "high", "critical"]).default("standard").notNull(),
  /** Alert status: new, acknowledged, processed, dismissed */
  status: mysqlEnum("status", ["new", "acknowledged", "processed", "dismissed"]).default("new").notNull(),
  /** Session ID for tracking */
  sessionId: varchar("sessionId", { length: 64 }),
  /** When the alert was acknowledged */
  acknowledgedAt: timestamp("acknowledgedAt"),
  /** When the alert was processed */
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NeuralAlert = typeof neuralAlerts.$inferSelect;
export type InsertNeuralAlert = typeof neuralAlerts.$inferInsert;

/**
 * System metrics snapshots for dashboard aggregation.
 * Periodically computed from sales_events data.
 */
export const systemMetrics = mysqlTable("system_metrics", {
  id: int("id").autoincrement().primaryKey(),
  /** Metric name: forge_conversion_rate, total_revenue, transaction_count, avg_order_value, etc. */
  metricName: varchar("metricName", { length: 64 }).notNull(),
  /** Current metric value as string (supports various formats) */
  metricValue: varchar("metricValue", { length: 128 }).notNull(),
  /** Change percentage from previous period */
  changePercent: decimal("changePercent", { precision: 8, scale: 2 }),
  /** Performance status: green, yellow, red */
  status: mysqlEnum("status", ["green", "yellow", "red"]).default("green").notNull(),
  /** Time period this metric covers */
  period: mysqlEnum("period", ["hourly", "daily", "weekly", "monthly"]).default("daily").notNull(),
  /** When this metric was computed */
  computedAt: timestamp("computedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = typeof systemMetrics.$inferInsert;
