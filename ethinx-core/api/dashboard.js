import express from "express";
import { getLogs, getSubscriberCount } from "../core/logger.js";
import { getMemory, saveMemory } from "../memory/store.js";
import { redis, redisStatus } from "../memory/redis.js";
import { loadPlugins } from "../core/pluginLoader.js";

const router = express.Router();

// ── SYSTEM STATUS ──────────────────────────────────────
router.get("/status", async (req, res) => {
  let redisPing = "unknown";
  if (redis) {
    try {
      const r = await redis.ping();
      redisPing = r === "PONG" ? "connected" : "disconnected";
    } catch {
      redisPing = "disconnected";
    }
  } else {
    redisPing = "not-configured";
  }

  res.json({
    status: "running",
    uptime: process.uptime(),
    memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    redis: redisStatus(),
    redisPing,
    wsClients: getSubscriberCount(),
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

// ── AGENT STATUS ───────────────────────────────────────
router.get("/agents", async (req, res) => {
  // Read agent states from Redis
  const agentNames = ["GrowthAgent", "SEOAgent", "ContentAgent"];
  const agents = [];

  for (const name of agentNames) {
    const state = await getMemory(`agent:${name}:state`) || "idle";
    const lastRun = await getMemory(`agent:${name}:lastRun`);
    const runCount = await getMemory(`agent:${name}:runCount`) || 0;
    agents.push({ name, state, lastRun, runCount });
  }

  res.json({ agents });
});

// ── TRIGGER AGENT RUN ──────────────────────────────────
router.post("/agents/run", async (req, res) => {
  const { taskQueue, taskQueueReady } = await import("../queue/queue.js");
  if (!taskQueueReady()) {
    return res.status(503).json({ status: "no-redis", error: "Redis not connected — set REDIS_URL and start Redis to enable queued runs" });
  }
  try {
    await taskQueue.add("job", req.body || {});
    res.json({ status: "queued", message: "Agent run queued" });
  } catch (e) {
    res.status(503).json({ status: "no-redis", error: e.message });
  }
});

// ── LOGS ───────────────────────────────────────────────
router.get("/logs", (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const source = req.query.source || undefined;
  const level = req.query.level || undefined;
  res.json({ logs: getLogs(limit, { source, level }) });
});

// ── PLUGINS ────────────────────────────────────────────
router.get("/plugins", async (req, res) => {
  try {
    const plugins = await loadPlugins();
    const list = plugins.map(p => ({
      name: p.name,
      version: p.version,
      permissions: p.permissions || [],
      events: Object.keys(p.events || {}),
      actions: Object.keys(p.actions || {}),
      enabled: true
    }));
    res.json({ plugins: list });
  } catch (e) {
    res.json({ plugins: [], error: e.message });
  }
});

// ── REVENUE / METRICS ──────────────────────────────────
router.get("/revenue", async (req, res) => {
  const totalRevenue = await getMemory("metrics:totalRevenue") || 0;
  const mrr = await getMemory("metrics:mrr") || 0;
  const activeSubscriptions = await getMemory("metrics:activeSubs") || 0;
  const churnRate = await getMemory("metrics:churnRate") || 0;
  const visits = await getMemory("metrics:visits") || 0;
  const signups = await getMemory("metrics:signups") || 0;
  const conversion = visits ? ((signups / visits) * 100).toFixed(2) : "0.00";

  // Revenue timeline (last 7 entries)
  const timeline = await getMemory("metrics:revenueTimeline") || [];

  res.json({
    totalRevenue,
    mrr,
    activeSubscriptions,
    churnRate,
    visits,
    signups,
    conversion,
    timeline
  });
});

// ── QUEUE STATUS ───────────────────────────────────────
router.get("/queue", async (req, res) => {
  try {
    const { taskQueue, taskQueueReady } = await import("../queue/queue.js");
    if (!taskQueueReady()) {
      return res.json({ waiting: 0, active: 0, completed: 0, failed: 0, state: "no-redis" });
    }
    const waiting = await taskQueue.getWaitingCount();
    const active = await taskQueue.getActiveCount();
    const completed = await taskQueue.getCompletedCount();
    const failed = await taskQueue.getFailedCount();
    res.json({ waiting, active, completed, failed, state: "ok" });
  } catch (e) {
    res.json({ waiting: 0, active: 0, completed: 0, failed: 0, error: e.message });
  }
});

// ── MEMORY INSPECTOR ───────────────────────────────────
router.get("/memory/:key", async (req, res) => {
  const val = await getMemory(req.params.key);
  res.json({ key: req.params.key, value: val });
});

router.post("/memory", async (req, res) => {
  const { key, value } = req.body;
  await saveMemory(key, value);
  res.json({ status: "saved", key });
});

export default router;
