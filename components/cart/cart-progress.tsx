"use client";
import { useCartStore } from "@/lib/client-store";
import { Check, CreditCard, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

export default function CartProgress() {
  const { checkoutProgress } = useCartStore();

  return (
    <div className="flex items-center justify-center pb-6">
      <div className="w-64 h-3 bg-muted rounded-md relative">
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-between ">
          <motion.span
            initial={{ width: 0 }}
            animate={{
              width:
                checkoutProgress === "cart-page"
                  ? 0
                  : checkoutProgress === "payment-page"
                    ? "50%"
                    : "100%",
            }}
            className="absolute bg-primary left-0 top-0 z-1 h-full rounded-full ease-in-out"
          />
          <motion.div
            className="bg-primary rounded-full p-2 z-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ShoppingCart className="text-secondary" size={14} />
          </motion.div>
          <motion.div
            className="bg-primary rounded-full p-2 z-2"
            initial={{ scale: 0 }}
            animate={{
              scale:
                checkoutProgress === "payment-page"
                  ? 1
                  : 0 || checkoutProgress === "confirmation-page"
                    ? 1
                    : 0,
            }}
            transition={{ delay: 0.2 }}
          >
            <CreditCard className="text-secondary" size={14} />
          </motion.div>
          <motion.div
            className="bg-primary rounded-full p-2 z-2"
            initial={{ scale: 0 }}
            animate={{
              scale: checkoutProgress === "confirmation-page" ? 1 : 0,
            }}
            transition={{ delay: 0.2 }}
          >
            <Check className="text-secondary" size={14} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
