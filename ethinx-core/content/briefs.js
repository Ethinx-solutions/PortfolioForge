import { v4 as uuidv4 } from "uuid";
import { keys, get, set } from "./store.js";

// Brief status lifecycle: draft → generating → draft_ready → in_review →
// approved → scheduled → published. Rejections keep brief at in_review/draft_ready.
export const BRIEF_STATUSES = [
  "draft",
  "generating",
  "draft_ready",
  "in_review",
  "approved",
  "scheduled",
  "published",
];

export async function createBrief(tenant, data) {
  const id = uuidv4();
  const now = new Date().toISOString();
  const brief = {
    id,
    topic: data.topic || "",
    audience: data.audience || "",
    goal: data.goal || "",
    tone: data.tone || "professional",
    channels: data.channels || [],
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  const briefs = (await get(keys.briefs(tenant), [])) || [];
  briefs.unshift(id);
  await set(keys.briefs(tenant), briefs);
  await set(keys.brief(tenant, id), brief);
  return brief;
}

export async function getBrief(tenant, id) {
  return get(keys.brief(tenant, id), null);
}

export async function listBriefs(tenant, status) {
  const briefs = (await get(keys.briefs(tenant), [])) || [];
  const out = [];
  for (const id of briefs) {
    const b = await getBrief(tenant, id);
    if (b && (!status || b.status === status)) out.push(b);
  }
  return out;
}

export async function updateBrief(tenant, id, patch) {
  const brief = await getBrief(tenant, id);
  if (!brief) return null;
  const next = { ...brief, ...patch, id, updatedAt: new Date().toISOString() };
  await set(keys.brief(tenant, id), next);
  return next;
}

export async function deleteBrief(tenant, id) {
  const briefs = (await get(keys.briefs(tenant), [])) || [];
  await set(keys.briefs(tenant), briefs.filter((x) => x !== id));
  await set(keys.brief(tenant, id), null);
  return true;
}
