"use server";
import { variantSchema } from "@/types/variantSchema";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "../schema";

//use serverless for transaction
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { revalidatePath } from "next/cache";
import { actionClient } from ".";
import { eq } from "drizzle-orm";
import { algoliasearch } from "algoliasearch";
import { db } from "..";
//for algolia
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);
export const createVariant = actionClient
  .schema(variantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        id,
        productID,
        productType,
        tags,
        variantImages: variantimgs,
      },
    }) => {
      const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
      const dbPool = drizzle(pool);

      //check if the productID is valid
      const product = await db.query.products.findFirst({
        where: eq(products.id, productID),
      });
      if (!product) {
        return { error: "Product not found" };
      }
      //if editmode is true id is existed then it means update variant
      if (editMode && id) {
        await dbPool.transaction(async (tx) => {
          await tx
            .update(productVariants)
            .set({
              color,
              productType,
              updated: new Date(),
            })
            .where(eq(productVariants.id, id));

          //first delete all the images and images and then save new one
          await tx.delete(variantImages).where(eq(variantImages.variantID, id));
          await tx.delete(variantTags).where(eq(variantTags.variantID, id));

          //now save new images and tags

          //insert variant images
          await tx.insert(variantImages).values(
            variantimgs.map((img, imgIDX) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: id,
              order: imgIDX,
            }))
          );

          //insert variant tags
          await tx.insert(variantTags).values(
            tags.map((value) => ({
              tag: value,
              variantID: id,
            }))
          );
          //update algolia
          await client.partialUpdateObject({
            indexName: "products",
            objectID: id.toString(),
            attributesToUpdate: {
              productType,
              variantImage: variantimgs[0].url,
            },
          });
        });

        revalidatePath("/dashboard/products");
        return { success: `Edited ${productType}` };
      } else if (!editMode) {
        await dbPool.transaction(async (tx) => {
          //if not editMode means create variant
          //create a variant
          const newVariant = await tx
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
              updated: new Date(),
            })
            .returning();

          //insert variant images
          await tx.insert(variantImages).values(
            variantimgs.map((img, imgIDX) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: imgIDX,
            }))
          );

          //insert variant tags
          await tx.insert(variantTags).values(
            tags.map((value) => ({
              tag: value,
              variantID: newVariant[0].id,
            }))
          );
          //create algolia object
          await client.saveObject({
            indexName: "products",
            body: {
              objectID: newVariant[0].id,
              id: newVariant[0].productID,
              title: product.title,
              price: product.price,
              productType,
              variantImage: variantimgs[0].url,
            },
          });
        });
        revalidatePath("/dashboard/products");
        return { success: `Added ${productType}` };
      }
    }
  );
