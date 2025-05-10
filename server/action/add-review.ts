"use server";

import { reviewSchema } from "@/types/reviews-schema";
import { actionClient } from ".";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

export const addReview = actionClient
  .schema(reviewSchema)
  .action(async ({ parsedInput: { comment, productID, rating } }) => {
    //check if user is logged in
    const session = await auth();
    if (!session) {
      return { error: "You must be logged in to leave a review" };
    }

    //check if user has already left a review
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.productID, productID),
        eq(reviews.userID, session.user.id)
      ),
    });

    if (existingReview) {
      return { error: "You have already left a review for this product" };
    }

    const newReview = await db
      .insert(reviews)
      .values({
        productID,
        userID: session.user.id,
        comment,
        rating,
      })
      .returning();
    revalidatePath(`/products/${productID}`);
    return { success: newReview[0] };
  });
