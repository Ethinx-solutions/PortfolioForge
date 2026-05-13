import { GrowthAgent } from "./growthAgent.js";
import { SEOAgent } from "./seoAgent.js";
import { emit } from "../core/pluginRunner.js";
import { log } from "../core/logger.js";

const agents = [
  new GrowthAgent(),
  new SEOAgent()
];

export async function runAgents(ctx) {
  log("Orchestrator", "info", `Running ${agents.length} agents`);

  for (const agent of agents) {
    try {
      await agent.setState("running");
      await agent.run(ctx);
      await agent.setState("idle");
      await agent.recordRun();
      await emit("onAgentRun", { agent: agent.name, ctx });
    } catch (err) {
      await agent.setState("error");
      log("Orchestrator", "error", `Agent failed: ${agent.name} — ${err.message}`);
    }
  }

  log("Orchestrator", "info", "All agents complete");
}

export function getRegisteredAgents() {
  return agents.map(a => a.name);
}
