import Redis from "ioredis";

const rawUrl = process.env.REDIS_URL || "";

const REDIS_URL = rawUrl.trim();

// BullMQ worker connections require these options; keep them consistent here.
export const BULLMQ_REDIS_OPTIONS = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Shared client for the API/app. Worker uses its own connection (see queue/worker.js).
// Dev note: ioredis needs an 'error' listener or an unreachable Redis crashes the process.
export const redis = REDIS_URL
  ? new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        // In production keep retrying (Cloud Run brings Redis up independently).
        if (process.env.NODE_ENV === "production") {
          return Math.min(times * 500, 5000);
        }
        // In dev fail fast so the dashboard degrades gracefully to in-memory store.
        return null;
      },
    })
  : null;

if (redis) {
  // Prevent unhandled 'error' events; emit a single warn log via console (logger
  // import would create a circular dependency with pino transport setup).
  redis.on("error", (e) => {
    console.warn(`[redis] ${e.code || e.message}`);
  });
}

export function redisStatus() {
  if (!redis) return "not-configured";
  return redis.status === "ready" ? "connected" : "disconnected";
}