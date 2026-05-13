import { BaseAgent } from "./baseAgent.js";
import { getMemory, saveMemory } from "../memory/store.js";

export class GrowthAgent extends BaseAgent {
  constructor() {
    super("GrowthAgent");
  }

  async run(ctx) {
    await this.log("Analyzing growth metrics");

    const visits = (await getMemory("metrics:visits")) || 0;
    const signups = (await getMemory("metrics:signups")) || 0;

    const conversion = visits ? signups / visits : 0;

    await this.log(`Conversion rate: ${conversion}`);

    if (conversion < 0.05) {
      await saveMemory("action:focus", "improve_landing");
      await this.log("⚠️ Low conversion — adjusting strategy");
    }
  }
}
