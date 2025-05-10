CREATE TABLE "orderProducts" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderID" serial NOT NULL,
	"productVariantID" serial NOT NULL,
	"quantity" integer NOT NULL,
	"productID" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"userID" text NOT NULL,
	"total" real NOT NULL,
	"status" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"receiptURL" text
);
--> statement-breakpoint
ALTER TABLE "orderProducts" ADD CONSTRAINT "orderProducts_orderID_orders_id_fk" FOREIGN KEY ("orderID") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProducts" ADD CONSTRAINT "orderProducts_productVariantID_productVariants_id_fk" FOREIGN KEY ("productVariantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orderProducts" ADD CONSTRAINT "orderProducts_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userID_user_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;