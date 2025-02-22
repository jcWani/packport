import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tag";
import Products from "@/components/products/products";
import { db } from "@/server";

export const revalidate = 3600;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  return (
    <main>
      {data.length !== 0 ? (
        <>
          <Algolia />
          <ProductTags />
          <Products variants={data} />
        </>
      ) : (
        <h1 className="text-center font-medium">
          There is no available products
        </h1>
      )}
    </main>
  );
}
