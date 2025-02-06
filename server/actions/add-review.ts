"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { ReviewSchema } from "@/types/review-schema";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

export const addReview = actionClient
  .schema(ReviewSchema)
  .action(async ({ parsedInput: { productID, rating, comment } }) => {
    try {
      const session = await auth();

      if (!session) return { error: "Please sign in" };

      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });

      if (reviewExists)
        return { error: "You have already reviewed this product" };

      const newReview = await db
        .insert(reviews)
        .values({
          productID,
          rating,
          comment,
          userID: session.user.id,
        })
        .returning();

      revalidatePath(`/products/${productID}`);
      return { success: newReview[0] };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
