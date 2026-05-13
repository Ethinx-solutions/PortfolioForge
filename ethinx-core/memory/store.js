import { redis } from "./redis.js";

export async function saveMemory(key, value) {
  await redis.set(key, JSON.stringify(value));
}

export async function getMemory(key) {
  const val = await redis.get(key);
  return val ? JSON.parse(val) : null;
}
