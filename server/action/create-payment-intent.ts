"use server";

import Stripe from "stripe";

import { actionClient } from ".";
import { PaymentIntentSchema } from "@/types/payment-intent-schema";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { productVariants } from "../schema";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createPaymentIntent = actionClient
  .schema(PaymentIntentSchema)
  .action(async ({ parsedInput: { cart, currency } }) => {
    const user = await auth();

    if (!user) {
      console.log("User not logged in");

      return { error: "You must be logged in to create a payment" };
    }
    //check if cart is valid
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return { error: "Cart is empty" };
    }
    //now calculate the total amount in server
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of cart) {
      //validate variantID and quantity
      if (
        !item.variantID ||
        typeof item.quantity !== "number" ||
        item.quantity <= 0
      ) {
        return { error: "Invalid product information" };
      }
      //get acualual variant first
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, item.variantID),
        with: {
          product: true,
        },
      });
      if (!variant) {
        return { error: "Invalid product information" };
      }
      //use database price
      const itemTotal = variant.product.price * item.quantity;
      totalAmount += itemTotal;
      //add to verified items
      verifiedItems.push({
        variantID: item.variantID,
        quantity: item.quantity,
      });
    }

    //conver to cents
    const amountInCents = totalAmount * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userID: user.user.id,
        items: JSON.stringify(verifiedItems),
      },
    });
    return {
      success: {
        paymentIntentID: paymentIntent.id,
        clientSecretID: paymentIntent.client_secret,
        user: user.user.email,
        amount: amountInCents / 100,
      },
    };
  });
