"use server";
import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { twoFactorTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./token";
import { sendTwoFactorEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

const actionClient = createSafeActionClient();

export const emailSignin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      //check if user is in the database
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      //If the user is not in the database
      if (!existingUser) {
        return { error: "User not found" };
      }

      //If the user is not verified
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "Email not verified. Verification email sent" };
      }
      //2FA
      //sign in with 2FA
      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          //check if theres is a token in the db for this email
          const twoFactorToken = await getTwoFactorTokenByEmail(email);
          //if no token found return error
          if (!twoFactorToken) {
            return { error: "Token not found" };
          }
          //check if token is expired
          const isExpired = new Date(twoFactorToken.expires) < new Date();
          if (isExpired) {
            return { error: "Token expired" };
          }
          //check if token is correct
          if (twoFactorToken.token !== code) {
            return { error: "Token is incorrect" };
          }
          //delete token
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          //generate token
          const generateToken = await generateTwoFactorToken(email);
          //check if token is created
          if (!generateToken) {
            return { error: "Token not created" };
          }
          //send token to email
          await sendTwoFactorEmail(
            generateToken[0].email,
            generateToken[0].token
          );
          //return success
          return { twoFactor: "Two factor sent to email" };
        }
      }
      await signIn("credentials", {
        email,

        password,

        redirectTo: "/",
      });

      return { success: "User Signed In!" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.message) {
          case "CredentialsSignin":
            return { error: "Email or Password Incorrect" };

          case "AccessDenied":
            return { error: error.message };

          case "OAuthSignInError":
            return { error: error.message };

          default:
            return { error: "Something went wrong" };
        }
      }

      throw error;
    }
  });
