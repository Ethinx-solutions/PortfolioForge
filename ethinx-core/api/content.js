import express from "express";
import {
  createBrief,
  getBrief,
  listBriefs,
  updateBrief,
  deleteBrief,
} from "../content/briefs.js";
import {
  createAsset,
  getAsset,
  listAssets,
  listAllAssets,
  editAsset,
  setAssetStatus,
  getVersions,
} from "../content/assets.js";
import {
  createChannel,
  getChannel,
  listChannels,
  updateChannel,
  distribute,
} from "../content/channels.js";
import { recordAnalytics, getAnalytics, getAggregate } from "../content/analytics.js";
import { generateContent } from "../content/pipeline.js";
import { assertCanGenerate } from "../content/plan.js";
import { log } from "../core/logger.js";
import { taskQueue } from "../queue/queue.js";

const router = express.Router();

// Resolve tenant from header, query param, or default
function tenantOf(req) {
  return (req.get("x-tenant-id") || req.query.tenant || "default").toString();
}

const asyncWrap = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    if (err?.code === "PLAN_LIMIT") {
      return res.status(402).json({ error: err.message, gate: err.gate });
    }
    log("Content", "error", err.message);
    res.status(500).json({ error: err.message });
  });
};

// ── BRIEFS ─────────────────────────────────────────────
router.get("/briefs", asyncWrap(async (req, res) => {
  const { status } = req.query;
  res.json({ briefs: await listBriefs(tenantOf(req), status) });
}));

router.post("/briefs", asyncWrap(async (req, res) => {
  const brief = await createBrief(tenantOf(req), req.body || {});
  res.status(201).json({ brief });
}));

router.get("/briefs/:id", asyncWrap(async (req, res) => {
  const brief = await getBrief(tenantOf(req), req.params.id);
  if (!brief) return res.status(404).json({ error: "Brief not found" });
  res.json({ brief });
}));

router.patch("/briefs/:id", asyncWrap(async (req, res) => {
  const brief = await updateBrief(tenantOf(req), req.params.id, req.body || {});
  if (!brief) return res.status(404).json({ error: "Brief not found" });
  res.json({ brief });
}));

router.delete("/briefs/:id", asyncWrap(async (req, res) => {
  await deleteBrief(tenantOf(req), req.params.id);
  res.json({ status: "deleted" });
}));

// ── GENERATE (plan-tier gated) ─────────────────────────
// Sync mode: generates immediately. ?async=true queues a BullMQ job instead.
router.post("/briefs/:id/generate", asyncWrap(async (req, res) => {
  const tenant = tenantOf(req);
  const gate = await assertCanGenerate(tenant);
  if (!gate.allowed) {
    return res.status(402).json({ error: gate.message, gate });
  }

  const brief = await getBrief(tenant, req.params.id);
  if (!brief) return res.status(404).json({ error: "Brief not found" });

  if (req.query.async === "true") {
    if (!taskQueue) return res.status(503).json({ error: "Queue unavailable (no Redis)" });
    await taskQueue.add("job", { type: "content", briefId: brief.id, tenant, variants: req.body?.variants });
    log("Content", "info", `Brief ${brief.id} queued for async generation`);
    return res.json({ status: "queued", briefId: brief.id });
  }

  const result = await generateContent(tenant, brief.id, { variants: req.body?.variants });
  res.json({ status: "ready", ...result });
}));

// ── ASSETS ─────────────────────────────────────────────
router.get("/assets", asyncWrap(async (req, res) => {
  const { status } = req.query;
  let assets = await listAllAssets(tenantOf(req));
  if (status) assets = assets.filter((a) => a.status === status);
  res.json({ assets });
}));

router.get("/briefs/:id/assets", asyncWrap(async (req, res) => {
  res.json({ assets: await listAssets(tenantOf(req), req.params.id) });
}));

router.get("/assets/:id", asyncWrap(async (req, res) => {
  const asset = await getAsset(tenantOf(req), req.params.id);
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  res.json({ asset });
}));

router.get("/assets/:id/versions", asyncWrap(async (req, res) => {
  res.json({ versions: await getVersions(tenantOf(req), req.params.id) });
}));

router.post("/assets/:id/edit", asyncWrap(async (req, res) => {
  const { title, body } = req.body || {};
  const asset = await editAsset(tenantOf(req), req.params.id, { title, body }, "user");
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  res.json({ asset });
}));

router.post("/assets/:id/approve", asyncWrap(async (req, res) => {
  const asset = await setAssetStatus(tenantOf(req), req.params.id, "approved");
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  res.json({ asset });
}));

router.post("/assets/:id/reject", asyncWrap(async (req, res) => {
  const asset = await setAssetStatus(tenantOf(req), req.params.id, "draft");
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  res.json({ asset });
}));

// Generic status transition (draft ↔ in_review ↔ approved → published)
router.post("/assets/:id/status", asyncWrap(async (req, res) => {
  const { status } = req.body || {};
  if (!["draft", "in_review", "approved", "published"].includes(status)) {
    return res.status(400).json({ error: `Invalid status: ${status}` });
  }
  const asset = await setAssetStatus(tenantOf(req), req.params.id, status);
  if (!asset) return res.status(404).json({ error: "Asset not found" });
  res.json({ asset });
}));

router.post("/assets/:id/publish", asyncWrap(async (req, res) => {
  const tenant = tenantOf(req);
  const asset = await setAssetStatus(tenant, req.params.id, "published");
  if (!asset) return res.status(404).json({ error: "Asset not found" });

  // Optional channel distribution + analytics
  const { channelId, impressions = 1000, clicks = 120, conversions = 8 } = req.body || {};
  let distribution = null;
  if (channelId) {
    distribution = await distribute(tenant, channelId, asset.id);
  }
  const analytics = await recordAnalytics(tenant, asset.id, { impressions, clicks, conversions });

  res.json({ asset, distribution, analytics });
}));

// ── CHANNELS ───────────────────────────────────────────
router.get("/channels", asyncWrap(async (req, res) => {
  res.json({ channels: await listChannels(tenantOf(req)) });
}));

router.post("/channels", asyncWrap(async (req, res) => {
  const channel = await createChannel(tenantOf(req), req.body || {});
  res.status(201).json({ channel });
}));

router.patch("/channels/:id", asyncWrap(async (req, res) => {
  const channel = await updateChannel(tenantOf(req), req.params.id, req.body || {});
  if (!channel) return res.status(404).json({ error: "Channel not found" });
  res.json({ channel });
}));

router.post("/channels/:id/distribute", asyncWrap(async (req, res) => {
  const { assetId } = req.body || {};
  if (!assetId) return res.status(400).json({ error: "assetId required" });
  const result = await distribute(tenantOf(req), req.params.id, assetId);
  if (!result) return res.status(404).json({ error: "Channel or asset not found" });
  res.json({ distribution: result });
}));

// ── ANALYTICS ──────────────────────────────────────────
router.get("/analytics", asyncWrap(async (req, res) => {
  res.json(await getAggregate(tenantOf(req)));
}));

router.get("/analytics/:assetId", asyncWrap(async (req, res) => {
  const row = await getAnalytics(tenantOf(req), req.params.assetId);
  if (!row) return res.status(404).json({ error: "No analytics for asset" });
  res.json(row);
}));

// ── PLAN STATUS ────────────────────────────────────────
router.get("/plan", asyncWrap(async (req, res) => {
  const tenant = tenantOf(req);
  const gate = await assertCanGenerate(tenant);
  res.json({ tenant, plan: gate.plan, ...gate });
}));

export default router;
