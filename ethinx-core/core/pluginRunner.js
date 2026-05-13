import { loadPlugins } from "./pluginLoader.js";

let plugins = [];
let loaded = false;

async function ensureLoaded() {
  if (!loaded) {
    plugins = await loadPlugins();
    loaded = true;
  }
}

export async function emit(event, ctx) {
  await ensureLoaded();

  for (const plugin of plugins) {
    const handler = plugin.events?.[event];

    if (handler) {
      try {
        await handler(ctx);
      } catch (e) {
        console.error(`[pluginRunner] Error in ${plugin.name}:`, e.message);
      }
    }
  }
}
