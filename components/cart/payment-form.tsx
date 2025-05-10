"use client";
import { useCartStore } from "@/lib/client-store";
import {
  useElements,
  useStripe,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useState } from "react";
import { createPaymentIntent } from "@/server/action/create-payment-intent";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/action/create-order";
import { toast } from "sonner";
import formatPrice from "@/lib/formatPrice";
import { useRouter } from "next/navigation";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const elements = useElements();
  const stripe = useStripe();
  const { cart, setCheckoutProgress, clearCart, setCartOpen } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { execute } = useAction(createOrder, {
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success(data.data.success, {
          id: "creating-order",
        });
        setIsLoading(false);
        setCheckoutProgress("confirmation-page");
        clearCart();
      }
      if (data.data?.error) {
        toast.error(data.data.error, {
          id: "creating-order",
        });
      }
    },
    onError: (error) => {
      toast.error("Failed creating order", {
        id: "creating-order",
      });
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || "Something went wrong");
      setIsLoading(false);
      return;
    }
    const data = await createPaymentIntent({
      currency: "usd",
      cart: cart.map((item) => ({
        variantID: item.variant.variantId,
        quantity: item.variant.quantity,
      })),
    });
    if (data?.data?.error) {
      setErrorMessage(data.data.error);
      toast.error(data.data.error, {
        id: "creating-order",
      });
      setIsLoading(false);
      router.push("/auth/login");
      setCartOpen(false);
      return;
    }
    if (data?.data?.success) {
      execute({
        status: "pending",
        paymentIntentID: data.data.success.paymentIntentID,
        total: data.data.success.amount,
        products: cart.map((item) => ({
          productID: item.id,
          variantID: item.variant.variantId,
          quantity: item.variant.quantity,
        })),
      });

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data.data.success.clientSecretID!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: data.data.success.user as string,
        },
      });
      if (error) {
        setErrorMessage(error.message || "Something went wrong");
        setIsLoading(false);
        return;
      } else {
        setErrorMessage("");
        setIsLoading(false);
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 items-center justify-center"
    >
      <PaymentElement className="w-full" />
      <AddressElement options={{ mode: "shipping" }} className="w-full" />

      <Button
        className="max-w-md w-full"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? `Processing payment` : `Pay ${formatPrice(totalPrice)}`}
      </Button>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Payments are processed securely by{" "}
        <a
          href="https://stripe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary"
        >
          Stripe
        </a>
        .
      </p>
    </form>
  );
}
