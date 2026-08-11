// Content pipeline — turns a brief into publish-ready assets.
// Stages: generate drafts+variants → persist assets → mark brief ready.
import { getWriter, writerInfo } from "./writer/index.js";
import { getBrief, updateBrief } from "./briefs.js";
import { createAsset } from "./assets.js";
import { log } from "../core/logger.js";
import { assertCanGenerate, recordGeneration } from "./plan.js";

export async function generateContent(tenant, briefId, opts = {}) {
  const brief = await getBrief(tenant, briefId);
  if (!brief) {
    throw new Error(`Brief not found: ${briefId}`);
  }

  // Plan gate — free tier is limited, pro is unlimited
  const gate = await assertCanGenerate(tenant);
  if (!gate.allowed) {
    throw Object.assign(new Error(gate.message), { code: "PLAN_LIMIT", gate });
  }

  const writer = getWriter();
  log("Content", "info", `Generating content for brief ${briefId} (${writerInfo().provider})`);

  await updateBrief(tenant, briefId, { status: "generating" });

  try {
    const drafts = await writer(brief, { variants: opts.variants ?? 2 });

    const assets = [];
    for (const draft of drafts) {
      const asset = await createAsset(tenant, briefId, {
        type: draft.type,
        title: draft.title,
        body: draft.body,
      });
      assets.push({ id: asset.id, type: draft.type, title: draft.title, status: asset.status });
    }

    await recordGeneration(tenant);
    await updateBrief(tenant, briefId, { status: "draft_ready" });

    log("Content", "info", `Brief ${briefId} → ${assets.length} draft(s) ready`);
    return { briefId, assets };
  } catch (err) {
    await updateBrief(tenant, briefId, { status: "draft", error: err.message });
    throw err;
  }
}
