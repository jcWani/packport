"use server";

import { actionClient } from "@/lib/safe-action";
import { ProductSchema } from "@/types/product-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products } from "../schema";
import { revalidatePath } from "next/cache";

export const createProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { title, description, price, id } }) => {
    try {
      // throw new Error("this is error");

      // EDIT MODE
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!currentProduct) return { error: "Product not found" };

        const editedProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();

        revalidatePath("/dashboard/products");
        return {
          success: `Product ${editedProduct[0].title} has been edited`,
        };
      }
      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({ description, price, title })
          .returning();

        revalidatePath("/dashboard/products");
        return { success: `Product ${newProduct[0].title} has been created` };
      }
    } catch (err) {
      return { error: "Failed to create product" };
    }
  });
