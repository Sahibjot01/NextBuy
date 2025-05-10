import * as z from "zod";

export const PaymentIntentSchema = z.object({
  currency: z.string(),
  cart: z.array(
    z.object({
      variantID: z.number(),
      quantity: z.number(),
    })
  ),
});
