import { BaseAgent } from "./baseAgent.js";
import { generateContent } from "../content/pipeline.js";

export class ContentAgent extends BaseAgent {
  constructor() {
    super("ContentAgent");
  }

  // ctx: { briefId, tenant, variants, type }
  async run(ctx) {
    if (!ctx?.briefId) {
      await this.log("No briefId in ctx — skipping content generation");
      return { skipped: true };
    }

    const tenant = ctx.tenant || "default";
    await this.log(`Generating content for brief ${ctx.briefId}`);

    const result = await generateContent(tenant, ctx.briefId, { variants: ctx.variants });
    await this.log(`Brief ${ctx.briefId} → ${result.assets.length} drafts ready`);
    return result;
  }
}
