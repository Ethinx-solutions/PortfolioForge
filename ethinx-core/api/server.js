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

// Attach WebSocket for real-time dashboard logs
attachWebSocket(server);

// Webhook needs raw body — mount BEFORE json parser
app.use("/stripe", webhookRoutes);

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
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  log("System", "info", `Ethinx Core API on port ${PORT}`);
  log("System", "info", `Dashboard → http://localhost:${PORT}`);
  log("System", "info", `WebSocket → ws://localhost:${PORT}/ws`);
});
