import { v4 as uuidv4 } from "uuid";
import { keys, get, set } from "./store.js";

export const CHANNEL_FORMATS = ["blog", "social", "email", "newsletter"];

export async function createChannel(tenant, data) {
  const id = uuidv4();
  const now = new Date().toISOString();
  const channel = {
    id,
    name: data.name || "Untitled Channel",
    format: data.format || "blog",
    schedule: data.schedule || "manual", // cron-like string or "manual"
    connector: data.connector || null,   // e.g. "twitter", "linkedin", "webhook"
    lastPublishedAt: null,
    createdAt: now,
  };

  const list = (await get(keys.channels(tenant), [])) || [];
  list.unshift(id);
  await set(keys.channels(tenant), list);
  await set(keys.channel(tenant, id), channel);
  return channel;
}

export async function getChannel(tenant, id) {
  return get(keys.channel(tenant, id), null);
}

export async function listChannels(tenant) {
  const list = (await get(keys.channels(tenant), [])) || [];
  const out = [];
  for (const id of list) {
    const c = await getChannel(tenant, id);
    if (c) out.push(c);
  }
  return out;
}

export async function updateChannel(tenant, id, patch) {
  const channel = await getChannel(tenant, id);
  if (!channel) return null;
  const next = { ...channel, ...patch, id };
  await set(keys.channel(tenant, id), next);
  return next;
}

// Distribution is a stub today. Each connector type is a hook a real
// integration (Twitter API, SendGrid, webhook) can be dropped in behind.
const CONNECTORS = {
  webhook: async (ctx) => ctx.connector,
  default: async (ctx) => ctx.connector || ctx.channel.name,
};

export async function distribute(tenant, channelId, assetId) {
  const channel = await getChannel(tenant, channelId);
  const asset = await import("./assets.js").then((m) => m.getAsset(tenant, assetId));
  if (!channel || !asset) return null;

  const handler = CONNECTORS[channel.connector] || CONNECTORS.default;
  const target = await handler({
    connector: channel.connector,
    channel: channel.name,
    format: channel.format,
    asset,
  });

  const publishedAt = new Date().toISOString();
  await updateChannel(tenant, channelId, { lastPublishedAt: publishedAt });

  return {
    publishedAt,
    target,
    preview: `${channel.name} → ${asset.title}`,
  };
}
