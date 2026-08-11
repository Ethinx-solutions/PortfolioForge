// Deterministic template-based generator. Produces an outline, a full draft,
// and a set of repurposed variants from a brief. Works offline, no API key.

const TONES = {
  professional: "authoritative and data-driven",
  casual: "friendly and conversational",
  bold: "confident and punchy",
  playful: "lighthearted and fun",
  educational: "clear and instructive",
};

const HOOKS = [
  (t) => `Why ${t} is the metric your team keeps getting wrong`,
  (t) => `The ${t} playbook: 5 steps to measurable impact`,
  (t) => `Stop guessing about ${t} — start here`,
  (t) => `${t}, explained for busy leaders`,
  (t) => `How top teams are winning with ${t}`,
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function pick(list, seed) {
  let idx = 0;
  for (const ch of String(seed)) idx = (idx + ch.charCodeAt(0)) % list.length;
  return list[idx];
}

function buildDraft(brief, hook) {
  const tone = TONES[brief.tone] || TONES.professional;
  const topic = brief.topic || "untitled topic";
  const audience = brief.audience || "your audience";
  const goal = brief.goal || "drive measurable results";
  const slug = slugify(topic);

  const outline = [
    { h2: "Introduction", body: `A ${tone} opening that frames ${topic} for ${audience}, setting up why it matters now.` },
    { h2: "The Problem", body: `The common friction points around ${topic} — and the cost of ignoring them.` },
    { h2: "The Framework", body: `A repeatable 3-step framework for ${goal}, tailored to ${audience}.` },
    { h2: "Real-World Example", body: `A worked example showing ${topic} in action with concrete numbers.` },
    { h2: "Next Steps", body: `Actionable next steps so ${audience} can ship results this week.` },
  ];

  const body = outline
    .map((s) => `## ${s.h2}\n\n${s.body}`)
    .join("\n\n");

  const meta = {
    seoTitle: `${hook} (${topic})`,
    metaDescription: `A ${tone} guide to ${topic} for ${audience}, focused on ${goal}.`,
    slug,
    tags: [brief.tone || "professional", slugify(audience) || "saas"],
  };

  return { title: `${hook}`, body, outline, meta };
}

export async function mockGenerate(brief, { variants = 3 } = {}) {
  const drafts = [];

  // Primary draft from the first hook (stable per topic)
  drafts.push(buildDraft(brief, HOOKS[0](brief.topic)));

  // Variants repurposed for other channels/formats
  for (let i = 0; i < variants; i++) {
    const hook = pick(HOOKS, brief.topic + i)(brief.topic);
    if (drafts.some((d) => d.title === hook)) continue;
    drafts.push(buildDraft(brief, hook));
  }

  const types = ["blog", "social", "email"];
  return drafts.slice(0, variants + 1).map((d, i) => ({
    type: types[i % types.length],
    title: d.title,
    body: d.body,
    outline: d.outline,
    meta: d.meta,
  }));
}
