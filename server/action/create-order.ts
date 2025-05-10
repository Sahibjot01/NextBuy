"use server";
import { orderSchema } from "@/types/order-schema";
import { actionClient } from ".";
import { auth } from "../auth";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { orderProducts, orders } from "../schema";

export const createOrder = actionClient
  .schema(orderSchema)
  .action(
    async ({ parsedInput: { products, status, total, paymentIntentID } }) => {
      //check if user is logged in
      const user = await auth();
      if (!user) {
        return { error: "You must be logged in to create an order" };
      }
      const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
      const dbPool = drizzle(pool);

      const orderID = await dbPool.transaction(async (tx) => {
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

      return { success: `order ${orderID} created successfully` };
    }
  );
