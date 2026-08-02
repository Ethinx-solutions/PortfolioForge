import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { taskQueue } from "../queue/queue.js";
import { attachWebSocket } from "../core/wsServer.js";
import { log } from "../core/logger.js";
import helmet from "helmet";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { redis } from "../memory/redis.js";
import billingRoutes from "./billing.js";
import webhookRoutes from "./webhook.js";
import dashboardRoutes from "./dashboard.js";
import { redis } from "../memory/redis.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { status: 429, message: "Too many requests from this IP, please try again after 15 minutes" }
});

// Apply rate limiter to all /api routes
app.use("/api", apiLimiter);
const paddle = new Paddle(process.env.PADDLE_API_KEY || "", {
  environment:
    process.env.NODE_ENV === "production"
      ? Environment.production
      : Environment.sandbox,
});

app.use(helmet({ hsts: false, contentSecurityPolicy: false }));

// Attach WebSocket for real-time dashboard logs
attachWebSocket(server);

// Webhook needs raw body — mount BEFORE json parser
app.use("/stripe", webhookRoutes);

// Paddle webhook - must use raw body
app.post(
  "/webhooks/paddle",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["paddle-signature"];
      const secret = process.env.PADDLE_WEBHOOK_SECRET;

      if (!signature || !secret) {
        log("Billing", "error", "Missing Paddle signature or secret");
        return res.sendStatus(400);
      }

      const rawBody = req.body.toString("utf8");
      const event = await paddle.webhooks.unmarshal(rawBody, secret, signature);

      log("Billing", "info", `✅ Paddle webhook verified: ${event.eventType}`);

      // TODO: handle event types
      // switch(event.eventType) { ... }

      res.sendStatus(200);
    } catch (err) {
      log("Billing", "error", `❌ Paddle webhook verification failed: ${err.message}`);
      res.sendStatus(400);
    }
  }
);

app.use(express.json());

// Health Checks
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/readyz", async (req, res) => {
  try {
    // Check Redis connection
    await redis.ping();
    
    // Check Queue connection (BullMQ uses the same redis instance)
    const isPaused = await taskQueue.isPaused();
    
    res.status(200).json({ status: "ok", queue: "connected" });
  } catch (err) {
    log("System", "error", `Readiness check failed: ${err.message}`);
    res.status(503).json({ status: "error", message: "Service Unavailable" });
  }
});

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

// Deprecated health endpoint, keeping for compatibility but redirecting to /healthz logic
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
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
