import { Queue } from "bullmq";
import { redis } from "../memory/redis.js";

export const taskQueue = new Queue("tasks", { connection: redis });
