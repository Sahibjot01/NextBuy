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
          return variantTag.tag.toLowerCase().trim() === tag.toLowerCase();
        }),
      );
    }
    return variants;
  }, [tag, variants]);
  return (
    <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {filteredVariants.map((variant) => (
        <Link
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}&color=${variant.color}`}
          key={variant.id}
          className="group overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/80 p-3 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
        >
          <div className="relative overflow-hidden rounded-[1.35rem] bg-muted">
            <Image
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
              src={variant.variantImages[0].url}
              width={720}
              height={540}
              alt={variant.product.title}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0 font-medium">
              <h2 className="truncate text-lg font-semibold tracking-tight">
                {variant.product.title}
              </h2>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {variant.productType}
              </p>
              <p className="mt-2 inline-flex rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {typeof variant.stock === "number"
                  ? variant.stock > 10
                    ? `${variant.stock} in stock`
                    : variant.stock > 0
                      ? `Low stock · ${variant.stock} left`
                      : "Out of stock"
                  : "Inventory tracked"}
              </p>
              <p className="mt-3 text-xs font-medium tracking-normal text-muted-foreground/80">
                View details
              </p>
            </div>
            <div>
              <Badge
                className="rounded-full px-3 py-1 text-sm shadow-sm"
                variant={"secondary"}
              >
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
