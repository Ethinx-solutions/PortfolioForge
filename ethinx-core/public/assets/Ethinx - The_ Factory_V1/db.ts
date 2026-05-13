import { eq, desc, sql, and, gte, count, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  salesEvents, InsertSalesEvent, SalesEvent,
  neuralAlerts, InsertNeuralAlert, NeuralAlert,
  systemMetrics, InsertSystemMetric, SystemMetric,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User Queries ───────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Sales Event Queries ────────────────────────────────────────

export async function insertSalesEvent(event: InsertSalesEvent): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(salesEvents).values(event);
  const insertId = (result as any)[0]?.insertId;
  return insertId;
}

export async function getSalesEvents(options: {
  limit?: number;
  offset?: number;
  since?: Date;
}): Promise<SalesEvent[]> {
  const db = await getDb();
  if (!db) return [];

  const { limit = 50, offset = 0, since } = options;

  if (since) {
    return db.select().from(salesEvents)
      .where(gte(salesEvents.eventTimestamp, since))
      .orderBy(desc(salesEvents.eventTimestamp))
      .limit(limit)
      .offset(offset);
  }

  return db.select().from(salesEvents)
    .orderBy(desc(salesEvents.eventTimestamp))
    .limit(limit)
    .offset(offset);
}

export async function getSalesEventByExternalId(externalId: string): Promise<SalesEvent | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(salesEvents)
    .where(eq(salesEvents.externalId, externalId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEventCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({ count: count() }).from(salesEvents);
  return result[0]?.count ?? 0;
}

export async function getTotalRevenueCents(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({
    total: sum(salesEvents.amountCents),
  }).from(salesEvents).where(
    sql`${salesEvents.eventType} != 'refund'`
  );
  return Number(result[0]?.total ?? 0);
}

export async function getRevenueByTier(): Promise<Array<{ tier: string; total: number; count: number }>> {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select({
    tier: salesEvents.tier,
    total: sum(salesEvents.amountCents),
    count: count(),
  }).from(salesEvents)
    .where(sql`${salesEvents.eventType} != 'refund'`)
    .groupBy(salesEvents.tier);

  return result.map(r => ({
    tier: r.tier,
    total: Number(r.total ?? 0),
    count: r.count,
  }));
}

export async function getUpsellCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({ count: count() }).from(salesEvents)
    .where(sql`${salesEvents.eventType} IN ('upsell', 'cross_sell')`);
  return result[0]?.count ?? 0;
}

// ─── Neural Alert Queries ───────────────────────────────────────

export async function insertNeuralAlert(alert: InsertNeuralAlert): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(neuralAlerts).values(alert);
  const insertId = (result as any)[0]?.insertId;
  return insertId;
}

export async function getNeuralAlerts(options: {
  limit?: number;
  status?: string;
}): Promise<NeuralAlert[]> {
  const db = await getDb();
  if (!db) return [];

  const { limit = 30, status } = options;

  if (status) {
    return db.select().from(neuralAlerts)
      .where(eq(neuralAlerts.status, status as any))
      .orderBy(desc(neuralAlerts.createdAt))
      .limit(limit);
  }

  return db.select().from(neuralAlerts)
    .orderBy(desc(neuralAlerts.createdAt))
    .limit(limit);
}

export async function acknowledgeNeuralAlert(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(neuralAlerts)
    .set({ status: "acknowledged", acknowledgedAt: new Date() })
    .where(eq(neuralAlerts.id, id));
}

export async function processNeuralAlert(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(neuralAlerts)
    .set({ status: "processed", processedAt: new Date() })
    .where(eq(neuralAlerts.id, id));
}

export async function dismissNeuralAlert(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(neuralAlerts)
    .set({ status: "dismissed" })
    .where(eq(neuralAlerts.id, id));
}

export async function getAlertStats(): Promise<{
  total: number;
  criticalPending: number;
  vaultTransactions: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, criticalPending: 0, vaultTransactions: 0 };

  const [totalResult, criticalResult, vaultResult] = await Promise.all([
    db.select({ count: count() }).from(neuralAlerts),
    db.select({ count: count() }).from(neuralAlerts)
      .where(and(
        eq(neuralAlerts.priority, "critical"),
        eq(neuralAlerts.status, "new"),
      )),
    db.select({ count: count() }).from(neuralAlerts)
      .where(eq(neuralAlerts.tier, "Vault")),
  ]);

  return {
    total: totalResult[0]?.count ?? 0,
    criticalPending: criticalResult[0]?.count ?? 0,
    vaultTransactions: vaultResult[0]?.count ?? 0,
  };
}

// ─── System Metrics Queries ─────────────────────────────────────

export async function upsertSystemMetric(metric: InsertSystemMetric): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if metric exists for this period
  const existing = await db.select().from(systemMetrics)
    .where(and(
      eq(systemMetrics.metricName, metric.metricName),
      eq(systemMetrics.period, metric.period ?? "daily"),
    ))
    .limit(1);

  if (existing.length > 0) {
    await db.update(systemMetrics)
      .set({
        metricValue: metric.metricValue,
        changePercent: metric.changePercent,
        status: metric.status,
        computedAt: new Date(),
      })
      .where(eq(systemMetrics.id, existing[0].id));
  } else {
    await db.insert(systemMetrics).values(metric);
  }
}

export async function getLatestMetrics(period: string = "daily"): Promise<SystemMetric[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(systemMetrics)
    .where(eq(systemMetrics.period, period as any))
    .orderBy(desc(systemMetrics.computedAt));
}

// ─── Aggregation: Compute Metrics from Events ───────────────────

export async function computeAndStoreMetrics(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const totalRevenue = await getTotalRevenueCents();
  const eventCount = await getEventCount();
  const upsellCount = await getUpsellCount();

  const avgOrderValue = eventCount > 0 ? Math.round(totalRevenue / eventCount) : 0;
  const forgeConversion = eventCount > 0 ? ((upsellCount / eventCount) * 100).toFixed(1) : "0.0";

  await upsertSystemMetric({
    metricName: "forge_conversion_rate",
    metricValue: `${forgeConversion}%`,
    changePercent: "0.00",
    status: Number(forgeConversion) >= 15 ? "green" : Number(forgeConversion) >= 10 ? "yellow" : "red",
    period: "daily",
  });

  await upsertSystemMetric({
    metricName: "total_revenue",
    metricValue: `$${(totalRevenue / 100).toLocaleString("en-AU", { minimumFractionDigits: 2 })}`,
    changePercent: "0.00",
    status: totalRevenue > 0 ? "green" : "yellow",
    period: "daily",
  });

  await upsertSystemMetric({
    metricName: "transaction_count",
    metricValue: eventCount.toLocaleString(),
    changePercent: "0.00",
    status: eventCount > 0 ? "green" : "yellow",
    period: "daily",
  });

  await upsertSystemMetric({
    metricName: "avg_order_value",
    metricValue: `$${(avgOrderValue / 100).toFixed(2)}`,
    changePercent: "0.00",
    status: avgOrderValue > 10000 ? "green" : avgOrderValue > 5000 ? "yellow" : "red",
    period: "daily",
  });
}
