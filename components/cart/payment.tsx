"use client";
import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "motion/react";
import { useCartStore } from "@/lib/client-store";
import PaymentForm from "./payment-form";
import { useTheme } from "next-themes";

const stripe = getStripe();

export default function Payment() {
  const { theme } = useTheme();
  const { cart } = useCartStore();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.variant.quantity,
    0
  );

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#2563eb",
      colorBackground: theme === "dark" ? "#000000" : "#ffffff",
      colorText: theme === "dark" ? "#ffffff" : "#000000",
      colorTextSecondary: theme === "dark" ? "#a0aec0" : "#4b5563",
      colorTextPlaceholder: theme === "dark" ? "#718096" : "#cbd5e1",
      colorBorder: theme === "dark" ? "#1f1f1f" : "#e5e7eb",
      colorDanger: "#ef4444",
    },
  };

  return (
    <motion.div className="max-w-2xl mx-auto">
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: totalPrice * 100,
          appearance,
        }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
}
