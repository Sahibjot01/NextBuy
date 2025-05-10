import * as z from "zod";

export const ProductSchema = z.object({
  //if id is not provided then we create a new product
  //if id is provided then we update the product
  id: z.number().optional(),
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" }),
  description: z
    .string()
    .min(40, { message: "Description must be at least 40 characters long" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
});

export type zProductSchema = z.infer<typeof ProductSchema>;
