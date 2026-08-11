import "../core/env.js";
import { Worker } from "bullmq";
import { runAgents } from "../agents/orchestrator.js";
import { ContentAgent } from "../agents/contentAgent.js";
import { log } from "../core/logger.js";

const contentAgent = new ContentAgent();

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
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };
  } catch {
    return { host: "127.0.0.1", port: 6379, maxRetriesPerRequest: null };
  }
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
