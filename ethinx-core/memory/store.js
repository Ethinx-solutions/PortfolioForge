import { redis } from "./redis.js";

// In-memory fallback keeps the app usable locally WITHOUT Redis (dev only).
// In production a missing/unavailable Redis is a hard failure, never a silent fallback.
const memoryFallback = new Map();

const DEAD_STATUSES = ["close", "end"];
const redisAvailable = () => !!redis && !DEAD_STATUSES.includes(redis.status);

function assertRedis(key) {
  if (process.env.NODE_ENV === "production" && !redisAvailable()) {
    throw new Error(`Redis unavailable in production — refusing in-memory fallback for "${key}"`);
  }
}

export async function saveMemory(key, value) {
  if (redisAvailable()) {
    await redis.set(key, JSON.stringify(value));
  } else {
    assertRedis(key);
    memoryFallback.set(key, JSON.stringify(value));
  }
}

export async function getMemory(key) {
  if (redisAvailable()) {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  }
  assertRedis(key);
  const val = memoryFallback.get(key);
  return val !== undefined ? JSON.parse(val) : null;
}