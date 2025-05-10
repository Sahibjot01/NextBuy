"use server";
import { eq } from "drizzle-orm";
import { db } from "..";
import { products } from "../schema";

export const getProduct = async (id: number) => {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) {
      return { error: "Product not found" };
    }

    return { success: product };
  } catch (e) {
    return { error: "Failed to fetch product" };
  }
};
