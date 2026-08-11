import { Queue } from "bullmq";
import { redis } from "../memory/redis.js";

export const taskQueue = redis ? new Queue("tasks", { connection: redis }) : null;
