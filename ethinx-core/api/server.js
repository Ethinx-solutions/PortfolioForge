import "../core/env.js";
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { taskQueue } from "../queue/queue.js";
import { attachWebSocket } from "../core/wsServer.js";
import { log } from "../core/logger.js";
import helmet from "helmet";
import { redis } from "../memory/redis.js";
import billingRoutes from "./billing.js";
import webhookRoutes from "./webhook.js";
import dashboardRoutes from "./dashboard.js";
import contentRoutes from "./content.js";
import registerWebhooks from "./webhooks/index.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

app.use(helmet({ hsts: false, contentSecurityPolicy: false }));

// Mount all webhooks BEFORE json middleware
registerWebhooks(app);
// Attach WebSocket for real-time dashboard logs
attachWebSocket(server);

// Webhook needs raw body — mount BEFORE json parser
app.use("/stripe", webhookRoutes);

// Paddle webhook skeleton
app.post("/webhooks/paddle", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    // TODO: Verify Paddle signature placeholder
    const event = JSON.parse(req.body.toString());
    log("Billing", "info", `Paddle event received: ${event.event_type || "unknown"}`);
    res.json({ received: true });
  } catch (e) {
    log("Billing", "error", `Paddle webhook error: ${e.message}`);
    res.status(200).json({ error: "Invalid payload" }); // Always 200 to prevent retries on bad data
  }
});

app.use(express.json());

// Serve dashboard UI
app.use(express.static(path.resolve(__dirname, "../public")));

// API routes
app.use("/billing", billingRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/content", contentRoutes);

app.post("/run", async (req, res) => {
  const { taskQueue, taskQueueReady } = await import("../queue/queue.js");
  if (!taskQueueReady()) {
    return res.status(503).json({ status: "no-redis", error: "Redis not connected — set REDIS_URL and start Redis to enable queued jobs" });
  }
  try {
    await taskQueue.add("job", req.body);
    log("API", "info", "Task queued via /run");
    res.json({ status: "queued" });
  } catch (e) {
    res.status(503).json({ status: "no-redis", error: e.message });
  }
});

app.get("/healthz", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime(), ts: Date.now() })
);
app.get("/readyz", async (req, res) => {
  if (!redis) {
    return res.json({ status: "not-ready", redis: "not-configured", error: "REDIS_URL not set" });
  }
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Redis ping timeout")), 500)
    );
    await Promise.race([redis.ping(), timeout]);
    res.json({ status: "ready", redis: "up" });
  } catch (e) {
    res.json({ status: "not-ready", redis: "down", error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
server.listen(PORT, HOST, () => {
  log("System", "info", `Ethinx Core API on http://${HOST}:${PORT}`);
  log("System", "info", `Dashboard → http://localhost:${PORT}`);
  log("System", "info", `WebSocket → ws://localhost:${PORT}/ws`);
});



