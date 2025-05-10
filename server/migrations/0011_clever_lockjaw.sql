CREATE TABLE "variantTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "variantImages" RENAME COLUMN "tag" TO "url";--> statement-breakpoint
ALTER TABLE "variantImages" ADD COLUMN "size" real NOT NULL;--> statement-breakpoint
ALTER TABLE "variantImages" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "variantImages" ADD COLUMN "order" real NOT NULL;--> statement-breakpoint
ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantID_product_variants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;