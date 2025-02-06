"use client";

import { useCartStore } from "@/lib/client-store";
import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "motion/react";
import PaymentForm from "./payment-form";
import { useTheme } from "next-themes";

const stripe = getStripe();

export default function Payment() {
  const { cart } = useCartStore();
  const { theme } = useTheme();

  const totalPrice = cart.reduce(
    (acc, cur) => acc + cur.price * cur.variant.quantity,
    0
  );

  return (
    <motion.div className="max-w-2xl mx-auto">
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: Math.round(totalPrice / 57) * 100,
          appearance: { theme: theme === "dark" ? "night" : "flat" },
        }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
}
