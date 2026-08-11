// Tenant-namespaced content store.
// Backed by memory/store.js, which itself falls back to an in-memory Map
// when Redis is unavailable — so the content engine works locally without Redis.
import { getMemory, saveMemory } from "../memory/store.js";

// ── Key builders ───────────────────────────────────────
export const contentKey = (tenant, ...parts) => `content:${tenant}:${parts.join(":")}`;

export const keys = {
  briefs:      (tenant) => contentKey(tenant, "briefs"),
  brief:       (tenant, id) => contentKey(tenant, "brief", id),
  assets:      (tenant, briefId) => contentKey(tenant, "assets", briefId),
  assetIndex:  (tenant) => contentKey(tenant, "allAssets"),
  asset:       (tenant, id) => contentKey(tenant, "asset", id),
  versions:    (tenant, id) => contentKey(tenant, "asset", id, "versions"),
  channels:    (tenant) => contentKey(tenant, "channels"),
  channel:     (tenant, id) => contentKey(tenant, "channel", id),
  analytics:   (tenant) => contentKey(tenant, "analytics"),
  analyticsFor:(tenant, assetId) => contentKey(tenant, "analytics", assetId),
  usage:       (tenant) => contentKey(tenant, "usage", "generations"),
};

export const get = async (key, fallback = null) => (await getMemory(key)) ?? fallback;
export const set = async (key, value) => saveMemory(key, value);

// Generic helpers for non-content keys (e.g. plan) respecting the same fallback.
export async function getScoped(key, fallback = null) {
  return (await getMemory(key)) ?? fallback;
}

export async function setScoped(key, value) {
  await saveMemory(key, value);
}
