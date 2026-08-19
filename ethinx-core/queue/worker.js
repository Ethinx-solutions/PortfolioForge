import "../core/env.js";
import { Worker } from "bullmq";
import { runAgents } from "../agents/orchestrator.js";
import { ContentAgent } from "../agents/contentAgent.js";
import { log } from "../core/logger.js";
import { BULLMQ_REDIS_OPTIONS } from "../memory/redis.js";

const contentAgent = new ContentAgent();

// Fail fast in dev (no infinite reconnect spam when Redis is down);
// keep retrying in production where Redis may come up independently.
function retryStrategy(times) {
  return process.env.NODE_ENV === "production"
    ? Math.min(times * 500, 5000)
    : null;
}

// BullMQ requires its own Redis connection with maxRetriesPerRequest: null
// Sharing the main ioredis client causes blocking command conflicts on Cloud Run
function makeWorkerConnection() {
  const url = process.env.REDIS_URL || "";
  // Parse rediss:// or redis:// URL manually for BullMQ config object
  try {
    const u = new URL(url);
    return {
      host: u.hostname,
      port: parseInt(u.port) || 6379,
      username: u.username || undefined,
      password: u.password ? decodeURIComponent(u.password) : undefined,
      tls: u.protocol === "rediss:" ? {} : undefined,
      ...BULLMQ_REDIS_OPTIONS,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy,
    };
  } catch {
    return {
      host: "127.0.0.1",
      port: 6379,
      ...BULLMQ_REDIS_OPTIONS,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy,
    };
  }
}

if (!process.env.REDIS_URL) {
  // No Redis configured: log ONCE and exit cleanly instead of crash-looping.
  // The dashboard / API stay up via the in-memory store fallback.
  log("Worker", "warn", "REDIS_URL not set — worker disabled. Set REDIS_URL (e.g. redis://localhost:6379 or rediss://...) in .env to enable background jobs.");
  process.exit(0);
}

const worker = new Worker(
  "tasks",
  async (job) => {
    log("Worker", "info", `▶  Job ${job.id} — ${job.data?.type || "default"}`);
    if (job.data?.type === "content") {
      await contentAgent.setState("running");
      try {
        await contentAgent.run(job.data);
        await contentAgent.setState("idle");
        await contentAgent.recordRun();
      } catch (err) {
        await contentAgent.setState("error");
        throw err;
      }
    } else {
      await runAgents(job.data || {});
    }
    log("Worker", "info", `✓  Job ${job.id} complete`);
  },
  {
    connection: makeWorkerConnection(),
    concurrency: 2,
    removeOnComplete: { count: 100 },
    removeOnFail:    { count: 50 },
  }
);

worker.on("ready",    ()       => log("Worker", "info",  "✅ BullMQ worker ready — queue: tasks"));
worker.on("failed",   (job, e) => log("Worker", "error", `✗  Job ${job?.id} failed: ${e.message}`));
worker.on("error",    (e)      => log("Worker", "error", `Worker error: ${e.message}`));

export default worker;