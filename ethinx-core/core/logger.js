// Centralized logger — captures all agent/plugin/system output
// Broadcasts to connected WebSocket clients in real-time
// Uses pino for structured JSON logging in production

import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isProduction ? undefined : {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});

const LOG_BUFFER_SIZE = 500;
const logs = [];
const subscribers = new Set();

export function log(source, level, message, meta = {}) {
  const entry = {
    id: Date.now() + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    source,
    level,
    message,
    meta
  };

  logs.push(entry);
  if (logs.length > LOG_BUFFER_SIZE) logs.shift();

  // Broadcast to all WS subscribers
  const payload = JSON.stringify({ type: "log", data: entry });
  for (const ws of subscribers) {
    try { ws.send(payload); } catch {}
  }

  // Structured logging with pino
  const logMethod = pinoLogger[level] ? level : "info";
  pinoLogger[logMethod]({ source, ...meta }, message);

  return entry;
}

export function getLogs(limit = 100, filter = {}) {
  let result = [...logs];
  if (filter.source) result = result.filter(l => l.source === filter.source);
  if (filter.level) result = result.filter(l => l.level === filter.level);
  return result.slice(-limit);
}

export function subscribe(ws) {
  subscribers.add(ws);
  return () => subscribers.delete(ws);
}

export function getSubscriberCount() {
  return subscribers.size;
}

// Export logger methods for direct use
export const logger = {
  info: (msg, meta) => log("System", "info", msg, meta),
  error: (msg, meta) => log("System", "error", msg, meta),
  warn: (msg, meta) => log("System", "warn", msg, meta),
  debug: (msg, meta) => log("System", "debug", msg, meta),
};
