import Stripe from "stripe";
import { log } from "./logger.js";

const key = process.env.STRIPE_SECRET_KEY;

if (!key || key === "sk_test_your_key_here") {
  log("System", "warn", "⚠️  STRIPE_SECRET_KEY is not set — billing endpoints will return errors.");
  log("System", "warn", "    Set it in .env or as a Cloud Run env var.");
}

export const stripe = new Stripe(key || "sk_test_placeholder", {
  apiVersion: "2023-10-16",
});
