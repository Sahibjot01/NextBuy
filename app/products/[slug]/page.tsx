"use server";

import ProductType from "@/components/products/product-type";
import DOMPurify from "isomorphic-dompurify";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import formatedPrice from "@/lib/formatPrice";
import ProductPick from "@/components/products/product-pick";
import ProductShowcase from "@/components/products/product-showcase";
import Reviews from "@/components/reviews/reviews";
import { getReviewAverage } from "@/lib/getReviewAverage";
import Stars from "@/components/reviews/stars";
import AddToCartButton from "@/components/cart/add-cart";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  //await params
  const { slug } = await params;
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(slug)),
    with: {
      variantImages: true,
      variantTags: true,
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
    },
  });
  if (variant) {
    const reviewAverage = await getReviewAverage(
      variant?.product.reviews.map((review) => review.rating)
    );

    return (
      <main>
        <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
          <div className="flex-1">
            <ProductShowcase variants={variant.product.productVariants} />
          </div>
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold">{variant?.product.title}</h2>
            <div>
              <ProductType variants={variant.product.productVariants} />
              <Stars
                rating={reviewAverage}
                totalReviews={variant.product.reviews.length}
              />
            </div>
            <Separator className="my-2" />
            <div className="flex flex-wrap items-center gap-3 py-2">
              <p className="text-2xl font-medium">
                {formatedPrice(variant.product.price)}
              </p>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {typeof variant.stock === "number"
                  ? variant.stock > 10
                    ? `${variant.stock} in stock`
                    : variant.stock > 0
                      ? `Low stock · ${variant.stock} left`
                      : "Out of stock"
                  : "Inventory tracked"}
              </Badge>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(variant.product.description || ""),
              }}
            ></div>
            <p className="text-secondary-foreground font-medium my-2">
              Available Colors
            </p>
            <div className="flex gap-4">
              {variant.product.productVariants.map((prodVariant) => (
                <ProductPick
                  key={prodVariant.id}
                  productID={prodVariant.productID}
                  productType={prodVariant.productType}
                  id={prodVariant.id}
                  color={prodVariant.color}
                  image={prodVariant.variantImages[0].url}
                  //below properties will be same for each variants
                  title={variant.product.title}
                  price={variant.product.price}
                />
              ))}
            </div>
            <AddToCartButton />
          </div>
        </section>
        <Reviews productID={variant.productID} />
      </main>
    );
  }
}
