import { Queue } from "bullmq";
import { redis, redisStatus } from "../memory/redis.js";

// BullMQ Queue re-emits the shared connection's 'error' event. With no listener
// that is an unhandled 'error' → process crash when Redis is unreachable.
export const taskQueue = redis ? new Queue("tasks", { connection: redis }) : null;

if (taskQueue) {
  taskQueue.on("error", (e) => {
    console.warn(`[queue] ${e.code || e.message}`);
  });
}

// Queue is usable only when Redis is actually connected ("ready"), not merely
// configured. This is what API routes should check before calling add().
export function taskQueueReady() {
  return !!taskQueue && redisStatus() === "connected";
}