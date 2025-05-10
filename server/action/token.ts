"use server";

import { db } from "@/server";
import { eq } from "drizzle-orm";
import {
  emailTokens,
  passwordResetTokens,
  twoFactorTokens,
  users,
} from "../schema";
import crypto from "crypto";

//fn to get check token exist in db
export const getVerificationToken = async (token: string) => {
  try {
    const existingToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, token),
    });
    return existingToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const getVerificationTokenByEmail = async (email: string) => {
  try {
    const existingToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.email, email),
    });
    return existingToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();

  //set expiry of one hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  //check if token already exists
  const existingToken = await getVerificationTokenByEmail(email);

  //if token exists delete it
  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.email, email));
  }
  //set new token
  const verificationToken = await db
    .insert(emailTokens)
    .values({
      token,
      expires,
      email,
    })
    .returning();
  return verificationToken;
};

//fn to verify email token
export const verifyEmailToken = async (token: string) => {
  //check token exist in db
  const existingToken = await getVerificationToken(token);
  if (!existingToken) {
    return { error: "Invalid token" };
  }
  //check if token is expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token expired" };
  }
  //delete token
  await db.delete(emailTokens).where(eq(emailTokens.token, token));
  //find user by email
  const existingUser = await db.query.users.findFirst({
    where: eq(emailTokens.email, existingToken.email),
  });
  //if user not found return error
  if (!existingUser) {
    return { error: "Email not found" };
  }
  //set user.isVerified to todays date
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, existingUser.id));

  //delete all tokens for this user
  await db
    .delete(emailTokens)
    .where(eq(emailTokens.email, existingToken.email));

  return { success: "Email is verified" };
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const existingToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    return existingToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const existingToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });

    return existingToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    //generate token
    const token = crypto.randomUUID();

    //set expiry of one hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    //check if email already exist
    const existingToken = await getPasswordResetTokenByEmail(email);

    //if token exists delete it
    if (existingToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.email, email));
    }
    //set new token
    const passwordResetToken = await db
      .insert(passwordResetTokens)
      .values({
        token,
        expires,
        email,
      })
      .returning();
    return passwordResetToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//for 2FA token
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const existingToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });
    return existingToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const existingToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    });
    return existingToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    //generate token
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    //set expiry of one hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    //check if token with this email already exist
    const existingToken = await getTwoFactorTokenByEmail(email);

    //if token exists delete it
    if (existingToken) {
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, existingToken.id));
    }
    //get the user by email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    //set new token
    const twoFactorToken = await db
      .insert(twoFactorTokens)
      .values({
        userID: existingUser?.id,
        token,
        expires,
        email,
      })
      .returning();
    return twoFactorToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
