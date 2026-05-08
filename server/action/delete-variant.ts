"use server";
import * as z from "zod";
import { actionClient } from ".";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";
import { auth } from "../auth";
//for algolia
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);
export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    const user = await auth();
    if (!user || user.user.role !== "admin") {
      return { error: "Unauthorized" };
    }
    const deletedVariant = await db
      .delete(productVariants)
      .where(eq(productVariants.id, id))
      .returning();
    if (!deletedVariant) {
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
