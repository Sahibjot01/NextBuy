"use server";
import { orderSchema } from "@/types/order-schema";
import { actionClient } from ".";
import { auth } from "../auth";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { orderProducts, orders, productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export const createOrder = actionClient
  .schema(orderSchema)
  .action(
    async ({ parsedInput: { products, status, total, paymentIntentID } }) => {
      //check if user is logged in
      const user = await auth();
      if (!user) {
        logger.warn("order", "Unauthorized order creation attempt");
        return { error: "You must be logged in to create an order" };
      }
      logger.info("order", "Create order request received", {
        userId: user.user.id,
        products: products.length,
        status,
        total,
        paymentIntentID,
      });
      const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
      const dbPool = drizzle(pool);

      try {
        const orderID = await dbPool.transaction(async (tx) => {
          // validate stock and decrement inside transaction
          for (const p of products) {
            const variant = await tx
              .select()
              .from(productVariants)
              .where(eq(productVariants.id, p.variantID))
              .limit(1)
              .then((res) => res[0]);
            if (!variant) {
              logger.warn("order", "Variant not found during order creation", {
                userId: user.user.id,
                variantID: p.variantID,
              });
              throw new Error("Invalid product variant");
            }
            const available = variant.stock;
            if (typeof available === "number" && available < p.quantity) {
              logger.warn("order", "Insufficient stock during order creation", {
                userId: user.user.id,
                variantID: p.variantID,
                requested: p.quantity,
                available,
              });
              throw new Error(`Not enough stock for variant ${p.variantID}`);
            }
            if (typeof available === "number") {
              await tx
                .update(productVariants)
                .set({ stock: available - p.quantity })
                .where(eq(productVariants.id, p.variantID));
            }
          }

          //create order
          const order = await tx
            .insert(orders)
            .values({
              paymentIntentID: paymentIntentID,
              status: status,
              total: total,
              userID: user.user.id,
            })
            .returning();

          //create orderProducts
          await tx.insert(orderProducts).values(
            products.map((product) => ({
              orderID: order[0].id,
              productID: product.productID,
              productVariantID: product.variantID,
              quantity: product.quantity,
            }))
          );
          return order[0].id;
        });

        logger.info("order", "Order created successfully", {
          userId: user.user.id,
          orderId: orderID,
          products: products.length,
          total,
        });
        return { success: `order ${orderID} created successfully` };
      } catch (error) {
        logger.error("order", "Order creation failed", {
          userId: user.user.id,
          paymentIntentID,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        return {
          error:
            error instanceof Error && error.message
              ? error.message
              : "Failed to create order",
        };
      }
    }
  );
