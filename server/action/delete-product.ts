"use server";
import * as z from "zod";
import { actionClient } from ".";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteProduct = actionClient
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    const product = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    //check if product exists
    if (!product) {
      return { error: "Product not found" };
    }
    revalidatePath("/dashboard/products");
    return { success: `Product deleted successfully, ${product[0].title}` };
  });
