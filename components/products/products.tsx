"use client";

import formatPrice from "@/lib/format-price";
import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { useSearchParams } from "next/navigation";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

export default function ProductsList({ variants }: ProductTypes) {
  const params = useSearchParams();
  const paramTag = params.get("tag");

  const [isLoading, setIsLoading] = useState(false);

  const filtered = useMemo(() => {
    if (paramTag && variants) {
      return variants.filter((variant) =>
        variant.variantTags.some((tag) => tag.tag === paramTag)
      );
    }

    return variants;
  }, [paramTag]);

  return (
    <main className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {filtered.map((variant) => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <Image
            alt={variant.product.title}
            className="ronded-md p-2 object-cover aspect-square"
            src={variant.variantImages[0].url}
            width={720}
            height={1280}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div>
              <h2 className="font-medium">{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
