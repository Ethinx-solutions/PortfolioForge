import Redis from "ioredis";

const url = process.env.REDIS_URL;

if (!url || url.trim() === "") {
  if (process.env.NODE_ENV === "production") {
    throw new Error("REDIS_URL is required in production — refusing to start without Redis");
  }
}

// Non-production with no URL: export null so nothing connects (in-memory fallback allowed).
export const redis = url && url.trim() !== ""
  ? new Redis(url, {
      lazyConnect: true,
      enableReadyCheck: false,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    })
  : null;