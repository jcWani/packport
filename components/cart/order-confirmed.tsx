"use client";

import { useCartStore } from "@/lib/client-store";
import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import orderConfirmed from "@/public/order-confirmed.json";

// import Lottie from "lottie-react";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.35 }}
      >
        {isClient ? (
          <Lottie animationData={orderConfirmed} className="h-48 my-4" />
        ) : null}
      </motion.div>
      <h2 className="text-2xl font-medium">Thank you for your purchase</h2>
      <Link href={"/dashboard/orders"}>
        <Button
          onClick={() => {
            setCheckoutProgress("cart-page");
            setCartOpen(false);
          }}
        >
          View Your order
        </Button>
      </Link>
    </div>
  );
}
