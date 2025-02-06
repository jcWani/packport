"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { productVariants } from "../schema";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_WRITE!
);

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      revalidatePath("dashboard/products");

      await client.deleteObject({
        indexName: "products_index",
        objectID: deletedVariant[0].id.toString(),
      });

      return { success: `Deleted ${deletedVariant[0].productType} variant` };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  });
