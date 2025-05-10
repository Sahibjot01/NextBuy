"use server";

import { ResetSchema } from "@/types/reset-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generatePasswordResetToken } from "./token";
import { sendPasswordResetEmail } from "./email";

const actionClient = createSafeActionClient();

export const PasswordReset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    //check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    //if user does not exist return an error
    if (!existingUser) {
      return { error: "Email not found" };
    }
    //if user exists, generate token
    const passwordResetToken = await generatePasswordResetToken(email);

    //if token is not generated return an error
    if (!passwordResetToken) {
      return { error: "Token not generated" };
    }
    //send password reset email
    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );

    return { success: "Password reset email sent" };
  });
