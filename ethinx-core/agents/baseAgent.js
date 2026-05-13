import { log } from "../core/logger.js";
import { saveMemory } from "../memory/store.js";

export class BaseAgent {
  constructor(name) {
    this.name = name;
  }

  async run(ctx) {
    throw new Error("run() must be implemented");
  }

  async log(msg, level = "info") {
    log(this.name, level, msg);
  }

  async setState(state) {
    await saveMemory(`agent:${this.name}:state`, state);
  }

  async recordRun() {
    await saveMemory(`agent:${this.name}:lastRun`, new Date().toISOString());
    // Increment run count via Redis directly would be better but this works
    const { getMemory } = await import("../memory/store.js");
    const count = (await getMemory(`agent:${this.name}:runCount`)) || 0;
    await saveMemory(`agent:${this.name}:runCount`, count + 1);
  }
}
