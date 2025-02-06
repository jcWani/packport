"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/lib/client-store";
import formatPrice from "@/lib/format-price";
import { MinusCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import emptyCart from "@/public/empty-box.json";
import { createId } from "@paralleldrive/cuid2";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";

// import Lottie from "lottie-react";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CartItems() {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();
  const [isClient, setIsClient] = useState(false);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, cur) => {
      return acc + cur.price! * cur.variant.quantity;
    }, 0);
  }, [cart]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => {
      return { letter, id: createId() };
    });
  }, [totalPrice]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <motion.div className="flex flex-col items-center">
      {cart.length === 0 ? (
        <div className="flex-col w-full flex items-center justify-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl text-muted-foreground text-center">
              Your cart is empty
            </h2>
            {isClient ? (
              <Lottie animationData={emptyCart} className="h-64" />
            ) : null}
          </motion.div>
        </div>
      ) : (
        <div className="max-h-80 w-full overflow-y-auto">
          <Table className="max-w-2xl mx-auto">
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantiy</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={(item.id + item.variant.variantID).toString()}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        width={48}
                        height={48}
                        src={item.image}
                        alt={item.name}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-start gap-2">
                      <MinusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        size={14}
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                      />
                      <p className="text-md">{item.variant.quantity}</p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        size={14}
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <motion.div className="flex items-center justify-center relative overflow-hidden my-4">
        <span className="text-md">Total: ₱</span>
        <AnimatePresence mode="popLayout">
          {priceInLetters.map((letter, i) => (
            <motion.div key={letter.id}>
              <motion.span
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: i * 0.1 }}
                className="text-md inline-block"
              >
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <Button
        onClick={() => setCheckoutProgress("payment-page")}
        disabled={cart.length === 0}
        className="max-w-md w-full mb-8"
      >
        Checkout
      </Button>
    </motion.div>
  );
}
