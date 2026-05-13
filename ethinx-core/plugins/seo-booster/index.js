export default {
  name: "seo-booster",
  version: "1.0.0",

  permissions: ["read_metrics", "write_pages"],

  events: {
    onAgentRun: async (ctx) => {
      console.log("[plugin:seo-booster] Reacting to agent run:", ctx.agent);
    }
  },

  actions: {
    boostSEO: async (ctx) => {
      return "Boosted SEO";
    }
  }
};
