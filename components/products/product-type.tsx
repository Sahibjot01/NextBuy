"use client";

import { variantWithImagesTags } from "@/lib/infer-type";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";

//we want to display all the variants of a specific product thats why we are importing variants with images and tags
//we could have used variants[] but since after clicking on the color we gonna navigate to that specific variant so for the link we need whole images,etc data so thats why variantswithimages[]
export default function ProductType({
  variants,
}: {
  variants: variantWithImagesTags[];
}) {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || variants[0].productType;

  return variants.map((variant) => {
    if (variant.productType === selectedType) {
      return (
        <motion.div
          key={variant.id}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 6 }}
          className="text-secondary-foreground font-medium"
        >
          {selectedType}
        </motion.div>
      );
    }
  });
}
