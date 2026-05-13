import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
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

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

app.use(helmet({ hsts: false, contentSecurityPolicy: false }));

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

app.post("/run", async (req, res) => {
  await taskQueue.add("job", req.body);
  log("API", "info", "Task queued via /run");
  res.json({ status: "queued" });
});

app.get("/healthz", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime(), ts: Date.now() })
);
app.get("/readyz", async (req, res) => {
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
server.listen(PORT, () => {
  log("System", "info", `Ethinx Core API on port ${PORT}`);
  log("System", "info", `Dashboard → http://localhost:${PORT}`);
  log("System", "info", `WebSocket → ws://localhost:${PORT}/ws`);
});
