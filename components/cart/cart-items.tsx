"use client";

import { useCartStore } from "@/lib/client-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import Image from "next/image";
import formatPrice from "@/lib/formatPrice";
import { MinusCircle, PlusCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import emptyCartAnimation from "@/public/empty-box.json";
import dynamic from "next/dynamic";
import { createId } from "@paralleldrive/cuid2";
import { Button } from "../ui/button";
const DynamicLottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function CartItems() {
  const { cart, addToCart, removeFromCart, setCheckoutProgress } =
    useCartStore();

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.price * item.variant.quantity,
      0
    );
  }, [cart]);

  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((value) => {
      return {
        value,
        id: createId(),
      };
    });
  }, [totalPrice]);
  return (
    <motion.div className="flex flex-col items-center">
      {cart.length === 0 && (
        <motion.div
          className="flex flex-col w-full items-center justify-center gap-4"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl text-muted-foreground text-center">
            Cart is empty
          </h2>
          <DynamicLottie className="h-64" animationData={emptyCartAnimation} />
        </motion.div>
      )}
      {cart.length > 0 && (
        <div className="overflow-y-auto w-full min-h-30 max-h-90">
          <Table className="max-w-2xl mx-auto">
            <TableHeader>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.variant.variantId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    <div>
                      <Image
                        className="rounded-md"
                        alt={item.name}
                        src={item.image}
                        width={48}
                        height={48}
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 justify-between">
                      <MinusCircle
                        size={14}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: { ...item.variant, quantity: 1 },
                          });
                        }}
                      />
                      <p>{item.variant.quantity}</p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              ...item.variant,
                              variantId: item.variant.variantId,
                              quantity: 1,
                            },
                          });
                        }}
                        size={14}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <motion.div className="flex items-center justify-center my-4">
        <span className="text-base">Total : $</span>
        <AnimatePresence mode="popLayout">
          {priceInLetters.map((letter, idx) => (
            <motion.div className="overflow-hidden relative" key={letter.id}>
              <motion.span
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: idx * 0.1 }}
                className="font-medium inline-block"
              >
                {letter.value}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <Button
        className="max-w-md w-full"
        disabled={cart.length === 0}
        onClick={() => {
          setCheckoutProgress("payment-page");
        }}
      >
        Checkout
      </Button>
    </motion.div>
  );
}
