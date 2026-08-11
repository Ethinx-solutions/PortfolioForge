// Real LLM provider stub. Drop in a provider SDK (OpenAI, Anthropic, ...)
// behind this function. It stays dormant until CONTENT_WRITER_PROVIDER=llm
// AND an API key is present — otherwise generation falls back to the mock.
//
// Expected return shape (matches mock): array of { type, title, body, outline, meta }

export async function llmGenerate(brief, opts = {}) {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("LLM provider not configured — set CONTENT_WRITER_PROVIDER=llm and LLM_API_KEY");
  }

  // ── TODO: provider SDK call goes here ────────────────────────────
  // const { prompt } = buildPrompt(brief, opts);
  // const res = await fetch("https://api.openai.com/v1/chat/completions", {...});
  // return parse(res.data.choices[0].message.content);

  throw new Error("LLM provider is configured but not implemented yet — wiring in next");
}
