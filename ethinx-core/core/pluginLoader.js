import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadPlugins() {
  const pluginDir = path.resolve(__dirname, "../plugins");
  const plugins = [];

  if (!fs.existsSync(pluginDir)) return plugins;

  for (const folder of fs.readdirSync(pluginDir)) {
    const indexPath = path.join(pluginDir, folder, "index.js");
    if (fs.existsSync(indexPath)) {
      try {
        const mod = await import(indexPath);
        plugins.push(mod.default || mod);
        console.log(`🔌 Loaded plugin: ${folder}`);
      } catch (e) {
        console.error(`⚠️ Failed to load plugin: ${folder}`, e.message);
      }
    }
  }

  return plugins;
}
