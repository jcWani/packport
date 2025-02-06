"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products, productVariants } from "../schema";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_WRITE!
);

export const deleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      // Fetch all variant IDs associated with the product
      const variants = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.productID, id));

      // Extract variant IDs
      const variantIds = variants.map((variant) => variant.id.toString());

      // Remove variants from Algolia (bulk delete)
      if (variantIds.length > 0) {
        await client.deleteObjects({
          indexName: "products_index",
          objectIDs: variantIds,
        });
      }

      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");
      return { success: `Product ${data[0].title} has been deleted` };
    } catch (error) {
      return { error: "Failed to delete product" };
    }
  });
