import { BaseAgent } from "./baseAgent.js";
import { saveMemory } from "../memory/store.js";

export class SEOAgent extends BaseAgent {
  constructor() {
    super("SEOAgent");
  }

  async run(ctx) {
    const keyword = ctx.keyword || "ai tools";

    const pages = [
      `${keyword} for agencies`,
      `${keyword} australia`,
      `best ${keyword} tools`
    ];

    await saveMemory("seo:pages", pages);

    await this.log(`Generated ${pages.length} pages`);
  }
}
