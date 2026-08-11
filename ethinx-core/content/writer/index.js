// Writer registry — the content engine's AI interface.
// The mock writer is deterministic and needs no API key. A real LLM provider
// (llm.js) activates as soon as CONTENT_WRITER_PROVIDER + a provider key are set.

import { mockGenerate } from "./mock.js";
import { llmGenerate } from "./llm.js";

export const WRITERS = {
  mock: mockGenerate,
  llm: llmGenerate,
};

export function getWriter() {
  const provider = (process.env.CONTENT_WRITER_PROVIDER || "mock").toLowerCase();
  return WRITERS[provider] || mockGenerate;
}

export function writerInfo() {
  const provider = (process.env.CONTENT_WRITER_PROVIDER || "mock").toLowerCase();
  const keyed = provider === "llm"
    ? !!(process.env.LLM_API_KEY || process.env.OPENAI_API_KEY)
    : true;
  return { provider, keyed };
}
