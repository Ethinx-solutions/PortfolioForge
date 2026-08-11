// Load .env from the app root by absolute path — independent of process.cwd().
// PM2 may launch with a different cwd, so relying on dotenv's cwd lookup is unsafe.
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(root, ".env") });