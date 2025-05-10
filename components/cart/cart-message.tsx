"use client";

import { useCartStore } from "@/lib/client-store";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export default function CartMessage() {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();
  return (
    <motion.div
      className="text-center"
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
    >
      <DrawerTitle>
        {checkoutProgress === "cart-page" ? "Your Cart Items" : null}
        {checkoutProgress === "payment-page" ? "Choose a payment method" : null}
        {checkoutProgress === "confirmation-page" ? "Order confirmed" : null}
      </DrawerTitle>
      <DrawerDescription className="my-1">
        {checkoutProgress === "cart-page"
          ? "You can add or remove items from your cart here."
          : null}
        {checkoutProgress === "payment-page" ? (
          <span
            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary"
            onClick={() => {
              setCheckoutProgress("cart-page");
            }}
          >
            <ArrowLeft size={14} />
            head back to your cart
          </span>
        ) : null}
        {checkoutProgress === "confirmation-page"
          ? "Thank you for your order! You will receive an email with your receipt!."
          : null}
      </DrawerDescription>
    </motion.div>
  );
}
