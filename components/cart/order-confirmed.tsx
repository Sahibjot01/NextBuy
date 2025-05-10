"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCartStore } from "@/lib/client-store";
import dynamic from "next/dynamic";
const DynamicLottie = dynamic(() => import("lottie-react"), { ssr: false });
import { motion } from "motion/react";
import orderConfirmed from "@/public/order-confirmed.json";

export default function OrderConfirmed() {
  const { setCheckoutProgress, setCartOpen } = useCartStore();
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DynamicLottie
          className="scale-120 h-64 my-4"
          animationData={orderConfirmed}
        />
      </motion.div>
      <h2 className="text-2xl font-medium">Thankyou for purchase</h2>
      <Link href={"/dashboard/orders"}>
        <Button
          variant={"secondary"}
          onClick={() => {
            setCheckoutProgress("cart-page");
            setCartOpen(false);
          }}
        >
          View your order
        </Button>
      </Link>
    </div>
  );
}
