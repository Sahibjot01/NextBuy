"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CartItems from "./cart-items";
import CartMessage from "./cart-message";
import Payment from "./payment";
import OrderConfirmed from "./order-confirmed";
import CartProgress from "./cart-progress";
export default function CartDrawer() {
  const { cart, checkoutProgress, cartOpen, setCartOpen } = useCartStore();
  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative px-2 cursor-pointer">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, scale: 0 }}
                className="absolute flex items-center justify-center w-4 h-4 text-xs font-bold rounded-full -top-1 -right-0.5 dark:bg-primary text-secondary bg-primary"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag className="w-7 h-7 text-primary" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="min-h-[50vh] max-h-[70vh] ">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <CartProgress />
        <div className="p-4 overflow-auto">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
          {checkoutProgress === "confirmation-page" && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
