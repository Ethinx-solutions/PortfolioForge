import express from "express";
import { stripe } from "../core/stripe.js";
import { log } from "../core/logger.js";

const router = express.Router();

router.post("/create-checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Ethinx Subscription"
            },
            unit_amount: 2900
          },
          quantity: 1
        }
      ],
      mode: "subscription",
      success_url: "https://ethinx.solutions/success",
      cancel_url: "https://ethinx.solutions/cancel"
    });

    res.json({ url: session.url });
  } catch (err) {
    log("API", "error", "Stripe checkout error:", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

export default router;
