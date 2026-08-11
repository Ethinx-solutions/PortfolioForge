import { keys, get, set } from "./store.js";

export async function recordAnalytics(tenant, assetId, data = {}) {
  const prev = (await get(keys.analyticsFor(tenant, assetId), null)) || {
    assetId,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    firstSeenAt: new Date().toISOString(),
    lastSeenAt: null,
  };

  const next = {
    ...prev,
    impressions: (prev.impressions || 0) + (data.impressions || 0),
    clicks: (prev.clicks || 0) + (data.clicks || 0),
    conversions: (prev.conversions || 0) + (data.conversions || 0),
    lastSeenAt: new Date().toISOString(),
  };

  await set(keys.analyticsFor(tenant, assetId), next);

  const list = (await get(keys.analytics(tenant), [])) || [];
  if (!list.includes(assetId)) {
    list.unshift(assetId);
    await set(keys.analytics(tenant), list);
  }
  return next;
}

export async function getAnalytics(tenant, assetId) {
  return get(keys.analyticsFor(tenant, assetId), null);
}

// Aggregated totals across all assets for the tenant
export async function getAggregate(tenant) {
  const list = (await get(keys.analytics(tenant), [])) || [];
  const rows = [];
  let impressions = 0;
  let clicks = 0;
  let conversions = 0;

  for (const assetId of list) {
    const row = await getAnalytics(tenant, assetId);
    if (!row) continue;
    impressions += row.impressions || 0;
    clicks += row.clicks || 0;
    conversions += row.conversions || 0;
    rows.push(row);
  }

  const ctr = impressions ? clicks / impressions : 0;
  const convRate = clicks ? conversions / clicks : 0;

  return {
    totals: { impressions, clicks, conversions },
    rates: { ctr, convRate },
    assets: rows,
    count: rows.length,
  };
}
