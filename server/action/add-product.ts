"use server";
import { ProductSchema } from "@/types/product-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const addProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      if (id) {
        //if id is present, update the product

        const existingProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!existingProduct) {
          return { error: "Product not found" };
        }
        const updatedProduct = await db
          .update(products)
          .set({
            title,
            description,
            price,
          })
          .where(eq(products.id, id))
          .returning();
        revalidatePath("/dashboard/products");
        return {
          success: `Product ${updatedProduct[0].title} updated successfully`,
        };
      }
      //if id is not present, create a new product
      const newProduct = await db
        .insert(products)
        .values({
          title,
          description,
          price,
        })
        .returning();
      revalidatePath("/dashboard/products");
      return { success: `Product ${newProduct[0].title} created successfully` };
    } catch (error) {
      throw error;
    }
  });
