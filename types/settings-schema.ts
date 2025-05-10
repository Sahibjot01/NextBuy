import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(
      z.string().min(3, {
        message: "Name must be at least 3 characters long",
      })
    ),
    email: z.optional(
      z.string().email({
        message: "Please enter a valid email address",
      })
    ),
    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    password: z.optional(
      z.string().min(8, {
        message: "Password must be at least 8 characters long",
      })
    ),
    newPassword: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      //why return true here
      //if password is not provided then return true
      return true;
    },
    {
      message:
        "You must provide a new password if you want to change your password",
      path: ["newPassword"],
    }
  );
