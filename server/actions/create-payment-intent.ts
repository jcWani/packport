"use server";

import { actionClient } from "@/lib/safe-action";
import { paymentIntentSchema } from "@/types/payment-intent-schema";
import Stripe from "stripe";
import { auth } from "../auth";

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export const createPaymentIntent = actionClient
  .schema(paymentIntentSchema)
  .action(async ({ parsedInput: { amount, currency, cart } }) => {
    const user = await auth();

    if (!user) return { error: "Please login to continue" };
    if (!amount) return { error: "No items to checkout" };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        // cart: JSON.stringify(cart),
        cart: JSON.stringify(
          cart.map((item) => ({
            productID: item.productID,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          }))
        ),
      },
    });
    return {
      success: {
        paymentIntentID: paymentIntent.id,
        clientSecretID: paymentIntent.client_secret,
        user: user.user.email,
      },
    };
  });
