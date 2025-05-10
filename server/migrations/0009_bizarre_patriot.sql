CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" real NOT NULL,
	"created" timestamp DEFAULT now()
);
