"use client";

import { variantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import formatPrice from "@/lib/formatPrice";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type productTypes = {
  variants: variantsWithProduct[];
};
export default function Products({ variants }: productTypes) {
  //create filter version of products

  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");

  const filteredVariants = useMemo(() => {
    if (tag) {
      return variants.filter((variant) =>
        variant.variantTags.some((variantTag) => {
          console.log(variantTag.tag);

          return variantTag.tag.toLowerCase().trim() === tag.toLowerCase();
        })
      );
    }
    return variants;
  }, [tag, variants]);
  return (
    <section className="grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3">
      {filteredVariants.map((variant) => (
        <Link
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}&color=${variant.color}`}
          key={variant.id}
          className="py-2"
        >
          <Image
            className="rounded-md pb-2 "
            src={variant.variantImages[0].url}
            width={720}
            height={480}
            alt={variant.product.title}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.product.title}</h2>
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
    </section>
  );
}
