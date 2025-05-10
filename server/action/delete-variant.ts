"use server";
import * as z from "zod";
import { actionClient } from ".";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";
//for algolia
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);
export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    const deletedVariant = await db
      .delete(productVariants)
      .where(eq(productVariants.id, id))
      .returning();
    if (!deleteVariant) {
      return { error: "Variant with this ID not found" };
    }
    //delete from algolia
    await client.deleteObject({
      indexName: "products",
      objectID: id.toString(),
    });
    revalidatePath("/dashboard/products");
    return {
      success: `Variant deleted successfully, ${deletedVariant[0].productType}`,
    };
  });
