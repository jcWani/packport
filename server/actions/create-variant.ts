"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { VariantSchema } from "@/types/VariantSchema";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "../schema";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_WRITE!
);

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        editMode,
        id,
        productID,
        productType,
        tags,
        variantImages: newImgs,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();

          await db
            .delete(variantTags)
            .where(eq(variantTags.variantID, editVariant[0].id));

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: editVariant[0].id,
            }))
          );

          await db
            .delete(variantImages)
            .where(eq(variantImages.variantID, editVariant[0].id));

          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: idx,
            }))
          );

          await client.partialUpdateObject({
            indexName: "products_index",
            objectID: editVariant[0].id.toString(),
            attributesToUpdate: {
              id: editVariant[0].productID,
              productType: editVariant[0].productType,
              variantImages: newImgs[0].url,
            },
          });

          revalidatePath("/dashboard/products");
          return { success: `Edited ${productType} variant` };
        }

        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productID,
            })
            .returning();

          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          });

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );

          await db.insert(variantImages).values(
            newImgs.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            }))
          );

          if (product) {
            await client.saveObject({
              indexName: "products_index",
              body: {
                objectID: newVariant[0].id.toString(),
                id: newVariant[0].productID,
                title: product.title,
                price: product.price,
                productType: newVariant[0].productType,
                variantImages: newImgs[0].url,
              },
            });
          }

          revalidatePath("/dashboard/products");
          return { success: `Created ${productType} variant` };
        }
      } catch (error) {
        return { error: "Failed to create a variant" };
      }
    }
  );
