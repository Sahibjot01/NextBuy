"use server";

import Stripe from "stripe";

import { actionClient } from ".";
import { PaymentIntentSchema } from "@/types/payment-intent-schema";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { productVariants } from "../schema";
import { logger } from "@/lib/logger";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// Simple in-memory rate limiter (per-user). Suitable for demo; replace with Redis/Upstash in prod.
const _rateLimit = new Map<string, { count: number; reset: number }>();

export const createPaymentIntent = actionClient
  .schema(PaymentIntentSchema)
  .action(async ({ parsedInput: { cart, currency } }) => {
    const user = await auth();

    if (!user) {
      logger.warn("payment-intent", "Unauthorized payment intent attempt");

      return { error: "You must be logged in to create a payment" };
    }
    logger.info("payment-intent", "Payment intent request received", {
      userId: user.user.id,
      cartItems: cart?.length ?? 0,
      currency,
    });
    // rate limit: 10 requests per minute per user
    try {
      const key = user.user.id;
      const entry = _rateLimit.get(key) ?? { count: 0, reset: Date.now() + 60_000 };
      if (Date.now() > entry.reset) {
        entry.count = 0;
        entry.reset = Date.now() + 60_000;
      }
      entry.count += 1;
      _rateLimit.set(key, entry);
      if (entry.count > 10) {
        logger.warn("payment-intent", "Rate limit exceeded", {
          userId: user.user.id,
          attempts: entry.count,
        });
        return { error: "Too many payment attempts, please wait a minute." };
      }
    } catch (e) {
      // noop - fail open
      logger.debug("payment-intent", "Rate limiter failed open", {
        userId: user.user.id,
      });
    }
    //check if cart is valid
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      logger.warn("payment-intent", "Rejected empty cart", { userId: user.user.id });
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
        logger.warn("payment-intent", "Invalid cart line item", {
          userId: user.user.id,
          variantID: item.variantID,
          quantity: item.quantity,
        });
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
        logger.warn("payment-intent", "Variant not found during validation", {
          userId: user.user.id,
          variantID: item.variantID,
        });
        return { error: "Invalid product information" };
      }
      // check stock if available
      if (typeof (variant as any).stock === "number") {
        const available = (variant as any).stock as number;
        if (item.quantity > available) {
          logger.warn("payment-intent", "Insufficient stock during payment validation", {
            userId: user.user.id,
            variantID: item.variantID,
            requested: item.quantity,
            available,
          });
          return { error: `Only ${available} items available for this product` };
        }
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

    try {
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
      logger.info("payment-intent", "Payment intent created", {
        userId: user.user.id,
        paymentIntentId: paymentIntent.id,
        amount: amountInCents,
        currency,
      });
      return {
        success: {
          paymentIntentID: paymentIntent.id,
          clientSecretID: paymentIntent.client_secret,
          user: user.user.email,
          amount: amountInCents / 100,
        },
      };
    } catch (error) {
      logger.error("payment-intent", "Failed to create payment intent", {
        userId: user.user.id,
        amount: amountInCents,
        currency,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return { error: "Unable to initialize payment. Please try again." };
    }
  });
