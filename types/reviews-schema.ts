import * as z from "zod";

export const reviewSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "Please add atleast one star" })
    .max(5, { message: "Please add no more than five stars" }),
  comment: z
    .string()
    .min(4, { message: "Please add atleast 4 characters for this review" }),
});
