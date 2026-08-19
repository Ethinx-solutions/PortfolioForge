import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { log } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadPlugins() {
  const pluginDir = path.resolve(__dirname, "../plugins");
  const plugins = [];

  if (!fs.existsSync(pluginDir)) return plugins;

  for (const folder of fs.readdirSync(pluginDir)) {
    const indexPath = path.join(pluginDir, folder, "index.js");
    if (fs.existsSync(indexPath)) {
      try {
        const mod = await import(pathToFileURL(path.resolve(indexPath)).href);
        plugins.push(mod.default || mod);
        log("System", "info", `🔌 Loaded plugin: ${folder}`);
      } catch (e) {
        log("System", "error", `⚠️ Failed to load plugin: ${folder}`, { error: e.message });
      }
    }
  }

  return plugins;
}
