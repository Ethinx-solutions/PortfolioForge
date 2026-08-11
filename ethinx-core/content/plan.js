// Plan-tier gating for content generation.
// Plan is read from the same key the billing webhook writes (user:{id}:plan),
// scoped by tenant. Free tier gets a limited generation allowance.
import { getScoped } from "./store.js";

export const TIERS = {
  free: {
    allowance: 3, // total generations allowed
    label: "Free",
  },
  pro: {
    allowance: Infinity,
    label: "Pro",
  },
};

export async function getPlan(tenant) {
  const plan = (await getScoped(`user:${tenant}:plan`)) || "free";
  return TIERS[plan] ? plan : "free";
}

export async function assertCanGenerate(tenant) {
  const plan = await getPlan(tenant);
  if (plan !== "free") return { allowed: true, plan };

  const allowance = TIERS.free.allowance;
  const { get } = await import("./store.js");
  const { keys } = await import("./store.js");
  const used = (await get(keys.usage(tenant), 0)) || 0;

  if (used >= allowance) {
    return {
      allowed: false,
      plan,
      used,
      allowance,
      upgradeRequired: true,
      message: `Free plan allows ${allowance} generations. Upgrade to Pro for unlimited.`,
    };
  }
  return { allowed: true, plan, used, allowance };
}

export async function recordGeneration(tenant) {
  const { get, set } = await import("./store.js");
  const { keys } = await import("./store.js");
  const used = (await get(keys.usage(tenant), 0)) || 0;
  await set(keys.usage(tenant), used + 1);
  return used + 1;
}
