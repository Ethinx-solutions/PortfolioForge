import { v4 as uuidv4 } from "uuid";
import { keys, get, set } from "./store.js";
import { getBrief, updateBrief } from "./briefs.js";

// Asset status lifecycle (per draft/variant)
// draft → in_review → approved → published   (reject → draft)
export const ASSET_STATUSES = [
  "draft",
  "in_review",
  "approved",
  "published",
];

export async function createAsset(tenant, briefId, data) {
  const id = uuidv4();
  const now = new Date().toISOString();
  const asset = {
    id,
    briefId,
    type: data.type || "blog",
    title: data.title || "",
    body: data.body || "",
    version: 1,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  const list = (await get(keys.assets(tenant, briefId), [])) || [];
  list.unshift(id);
  await set(keys.assets(tenant, briefId), list);

  const all = (await get(keys.assetIndex(tenant), [])) || [];
  all.unshift(id);
  await set(keys.assetIndex(tenant), all);

  await set(keys.asset(tenant, id), asset);
  await set(keys.versions(tenant, id), [
    { version: 1, title: asset.title, body: asset.body, editor: "system", ts: now },
  ]);
  return asset;
}

export async function getAsset(tenant, id) {
  return get(keys.asset(tenant, id), null);
}

export async function listAssets(tenant, briefId) {
  const list = (await get(keys.assets(tenant, briefId), [])) || [];
  const out = [];
  for (const id of list) {
    const a = await getAsset(tenant, id);
    if (a) out.push(a);
  }
  return out;
}

export async function listAllAssets(tenant) {
  const list = (await get(keys.assetIndex(tenant), [])) || [];
  const out = [];
  for (const id of list) {
    const a = await getAsset(tenant, id);
    if (a) out.push(a);
  }
  return out;
}

export async function editAsset(tenant, id, patch, editor = "user") {
  const asset = await getAsset(tenant, id);
  if (!asset) return null;

  const version = asset.version + 1;
  const now = new Date().toISOString();
  const next = {
    ...asset,
    ...patch,
    id,
    version,
    updatedAt: now,
  };

  const versions = (await get(keys.versions(tenant, id), [])) || [];
  versions.unshift({
    version,
    title: next.title,
    body: next.body,
    editor,
    ts: now,
  });

  await set(keys.asset(tenant, id), next);
  await set(keys.versions(tenant, id), versions);
  return next;
}

export async function setAssetStatus(tenant, id, status) {
  const asset = await getAsset(tenant, id);
  if (!asset) return null;
  const next = { ...asset, status, updatedAt: new Date().toISOString() };
  await set(keys.asset(tenant, id), next);

  // Sync parent brief status to the strongest state
  const brief = await getBrief(tenant, asset.briefId);
  if (brief) {
    const rank = (s) => ASSET_STATUSES.indexOf(s);
    if (rank(status) > rank(brief.status === "in_review" ? "in_review" : brief.status || "draft")) {
      await updateBrief(tenant, asset.briefId, { status });
    }
  }
  return next;
}

export async function getVersions(tenant, id) {
  return (await get(keys.versions(tenant, id), [])) || [];
}
