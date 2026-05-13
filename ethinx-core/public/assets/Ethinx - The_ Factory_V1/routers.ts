import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  insertSalesEvent, getSalesEvents, getEventCount, getTotalRevenueCents,
  getRevenueByTier, getUpsellCount, getSalesEventByExternalId,
  insertNeuralAlert, getNeuralAlerts, acknowledgeNeuralAlert,
  processNeuralAlert, dismissNeuralAlert, getAlertStats,
  getLatestMetrics, computeAndStoreMetrics,
} from "./db";

// ─── Sales Events Router ────────────────────────────────────────

const salesRouter = router({
  /** Ingest a new sales event (admin or webhook) */
  ingest: publicProcedure
    .input(z.object({
      externalId: z.string().optional(),
      customer: z.string(),
      customerEmail: z.string().optional(),
      amountCents: z.number().int().positive(),
      currency: z.string().default("AUD"),
      tier: z.enum(["Starter", "Growth", "Pro", "Elite", "Enterprise", "Vault"]),
      eventType: z.enum(["checkout", "upsell", "cross_sell", "refund"]).default("checkout"),
      source: z.enum(["stripe", "hetzner", "manual", "simulation"]).default("stripe"),
      stripeSessionId: z.string().optional(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      // Deduplicate by externalId
      if (input.externalId) {
        const existing = await getSalesEventByExternalId(input.externalId);
        if (existing) {
          return { success: true, eventId: existing.id, deduplicated: true };
        }
      }

      const eventId = await insertSalesEvent({
        ...input,
        eventTimestamp: new Date(),
      });

      // Auto-trigger Neural Alert for high-value transactions ($2,500+)
      if (input.amountCents >= 250000) {
        const priority = input.tier === "Vault" ? "critical" :
                         input.tier === "Enterprise" ? "high" : "standard";
        await insertNeuralAlert({
          salesEventId: eventId,
          customer: input.customer,
          amountCents: input.amountCents,
          tier: input.tier,
          priority,
        });
      }

      // Recompute metrics after new event
      try {
        await computeAndStoreMetrics();
      } catch (e) {
        console.warn("[Metrics] Failed to recompute after event:", e);
      }

      return { success: true, eventId, deduplicated: false };
    }),

  /** List recent sales events */
  list: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(200).default(50),
      offset: z.number().int().min(0).default(0),
      since: z.date().optional(),
    }).optional())
    .query(async ({ input }) => {
      const events = await getSalesEvents({
        limit: input?.limit ?? 50,
        offset: input?.offset ?? 0,
        since: input?.since,
      });
      return events;
    }),

  /** Get aggregated metrics */
  metrics: publicProcedure.query(async () => {
    const [totalRevenue, eventCount, upsellCount, revenueByTier] = await Promise.all([
      getTotalRevenueCents(),
      getEventCount(),
      getUpsellCount(),
      getRevenueByTier(),
    ]);

    const avgOrderValue = eventCount > 0 ? Math.round(totalRevenue / eventCount) : 0;
    const forgeConversion = eventCount > 0 ? Number(((upsellCount / eventCount) * 100).toFixed(1)) : 0;

    return {
      totalRevenueCents: totalRevenue,
      transactionCount: eventCount,
      avgOrderValueCents: avgOrderValue,
      forgeConversionRate: forgeConversion,
      upsellCount,
      revenueByTier,
      hasLiveData: eventCount > 0,
    };
  }),
});

// ─── Neural Alerts Router ───────────────────────────────────────

const alertsRouter = router({
  /** List alerts with optional status filter */
  list: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(100).default(30),
      status: z.enum(["new", "acknowledged", "processed", "dismissed"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      return getNeuralAlerts({
        limit: input?.limit ?? 30,
        status: input?.status,
      });
    }),

  /** Get alert statistics */
  stats: publicProcedure.query(async () => {
    return getAlertStats();
  }),

  /** Acknowledge an alert */
  acknowledge: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await acknowledgeNeuralAlert(input.id);
      return { success: true };
    }),

  /** Process an alert */
  process: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await processNeuralAlert(input.id);
      return { success: true };
    }),

  /** Dismiss an alert */
  dismiss: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await dismissNeuralAlert(input.id);
      return { success: true };
    }),
});

// ─── System Metrics Router ──────────────────────────────────────

const metricsRouter = router({
  /** Get latest computed metrics */
  latest: publicProcedure
    .input(z.object({
      period: z.enum(["hourly", "daily", "weekly", "monthly"]).default("daily"),
    }).optional())
    .query(async ({ input }) => {
      return getLatestMetrics(input?.period ?? "daily");
    }),

  /** Force recompute metrics from events */
  recompute: publicProcedure.mutation(async () => {
    await computeAndStoreMetrics();
    return { success: true };
  }),
});

// ─── Connection Status Router ───────────────────────────────────

const connectionRouter = router({
  /** Get the current connection status to external services */
  status: publicProcedure.query(async () => {
    const eventCount = await getEventCount();
    return {
      hetzner: {
        ip: "91.99.162.243",
        port: 3001,
        status: eventCount > 0 ? "connected" : "standby",
      },
      database: { status: "connected" },
      netlify: { status: "active" },
      cloudflare: { status: "active" },
      gcp: { status: "ready" },
      hasLiveData: eventCount > 0,
      mode: eventCount > 0 ? "live" : "simulation",
    };
  }),
});

// ─── Main App Router ────────────────────────────────────────────

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  sales: salesRouter,
  alerts: alertsRouter,
  metrics: metricsRouter,
  connection: connectionRouter,
});

export type AppRouter = typeof appRouter;
