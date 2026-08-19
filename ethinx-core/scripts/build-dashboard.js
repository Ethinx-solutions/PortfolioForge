// Build the ETHINX Command Center dashboard offline.
// - Extracts the inline JSX (<script type="text/babel">) from public/index.html
// - Compiles it to public/dashboard.js (global React/ReactDOM, no bundler runtime)
// - Copies React + ReactDOM UMD builds into public/vendor/
// - Rewrites index.html to reference the local files (no CDN, no Babel standalone)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const vendorDir = path.join(publicDir, "vendor");
const indexPath = path.join(publicDir, "index.html");
const outJs = path.join(publicDir, "dashboard.js");

const html = fs.readFileSync(indexPath, "utf8");

// 1) Extract the babel block
const match = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!match) throw new Error("No <script type=\"text/babel\"> block found in index.html");
const inlineJsx = match[1];

// 2) Compile the JSX → plain JS (global React/ReactDOM, classic JSX transform)
await esbuild.build({
  stdin: {
    contents: inlineJsx,
    loader: "jsx",
    sourcefile: "dashboard.jsx",
    resolveDir: root,
  },
  outfile: outJs,
  format: "iife",
  minify: true,
  target: ["es2020", "chrome100"],
  logLevel: "warning",
});
console.log(`✓ compiled → ${path.relative(root, outJs)} (${fs.statSync(outJs).size} bytes)`);

// 3) Vendor React + ReactDOM UMD builds
fs.mkdirSync(vendorDir, { recursive: true });
const vendored = [
  ["react", "react.production.min.js"],
  ["react-dom", "react-dom.production.min.js"],
];
for (const [pkg, file] of vendored) {
  const src = path.join(root, "node_modules", pkg, "umd", file);
  const dst = path.join(vendorDir, file);
  fs.copyFileSync(src, dst);
  console.log(`✓ vendored → ${path.relative(root, dst)}`);
}

// 4) Rewrite index.html: drop CDN scripts + babel block, add local refs
const localScripts = [
  '  <script src="/vendor/react.production.min.js"></script>',
  '  <script src="/vendor/react-dom.production.min.js"></script>',
  '  <script src="/dashboard.js"></script>',
].join("\n");

const cdnPattern = /<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/[^"]*"><\/script>\s*/g;
const newHtml = html
  .replace(cdnPattern, "")
  .replace(/<script type="text\/babel">[\s\S]*?<\/script>/, localScripts);

fs.writeFileSync(indexPath, newHtml, "utf8");
console.log(`✓ index.html updated (${fs.statSync(indexPath).size} bytes, no CDN refs: ${!newHtml.includes("cdnjs")})`);