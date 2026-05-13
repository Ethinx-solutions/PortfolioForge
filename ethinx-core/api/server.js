import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { taskQueue } from "../queue/queue.js";
import { attachWebSocket } from "../core/wsServer.js";
import { log } from "../core/logger.js";
import billingRoutes from "./billing.js";
import webhookRoutes from "./webhook.js";
import dashboardRoutes from "./dashboard.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

// Attach WebSocket for real-time dashboard logs
attachWebSocket(server);

// Webhook needs raw body — mount BEFORE json parser
app.use("/stripe", webhookRoutes);

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

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  log("System", "info", `Ethinx Core API on port ${PORT}`);
  log("System", "info", `Dashboard → http://localhost:${PORT}`);
  log("System", "info", `WebSocket → ws://localhost:${PORT}/ws`);
});
