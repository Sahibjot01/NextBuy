ALTER TABLE "product_variants" RENAME TO "productVariants";--> statement-breakpoint
ALTER TABLE "productVariants" DROP CONSTRAINT "product_variants_productID_products_id_fk";
--> statement-breakpoint
ALTER TABLE "variantImages" DROP CONSTRAINT "variantImages_variantID_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "variantTags" DROP CONSTRAINT "variantTags_variantID_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "productVariants" ADD CONSTRAINT "productVariants_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variantImages" ADD CONSTRAINT "variantImages_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;