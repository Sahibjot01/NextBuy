"use server";

import { NewPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { getPasswordResetTokenByToken } from "./token";
import { db } from "..";
import { passwordResetTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

const actionClient = createSafeActionClient();

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);

    if (!token) {
      return { error: "No token provided" };
    }
    //if the token is invalid, return an error
    const existingToken = await getPasswordResetTokenByToken(token);

    //if the token is invalid, return an error
    if (!existingToken) {
      return { error: "Token not found" };
    }

    //if the token is expired, return an error
    const isExpired = new Date(existingToken.expires) < new Date();
    if (isExpired) {
      return { error: "Token expired" };
    }

    //update the user's password
    //find the user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });
    //if the user is not found, return an error
    if (!existingUser) {
      return { error: "User not found" };
    }
    //hash the pass
    const hashedPassword = await bcrypt.hash(password, 10);
    //make a transaction to update the user's password
    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));
      //delete the token
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });
    //return success
    return { success: "Password updated" };
  });
