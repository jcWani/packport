"use client";

import { VariantsWithImagesTags } from "@/lib/infer-type";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";

export default function ProductType({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || variants[0].productType;

  return variants.map((variant) => {
    if (variant.productType === selectedType) {
      return (
        <motion.div
          key={variant.id}
          className="text-secondary-foreground font-medium"
          animate={{ y: 0, opacity: 1 }}
          initial={{ opacity: 0, y: 6 }}
        >
          {selectedType}
        </motion.div>
      );
    }
  });
}
