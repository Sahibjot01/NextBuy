"use server";
import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import bcypt from "bcrypt";
import { generateEmailVerificationToken } from "./token";
import { sendVerificationEmail } from "./email";
import Stripe from "stripe";

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const hashedPassword = await bcypt.hash(password, 10);
    // console.log(hashedPassword);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    //check if user already exists
    if (existingUser) {
      //check if user is already verified if not send verification email
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: "verification email sent" };
      }
      return { error: "email already exists" };
    }
    //logic when user does not exist
    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        password: hashedPassword,
      })
      .returning();

    //create stripe customer
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
    const customer = await stripe.customers.create({
      email,
      name,
    });

    await db
      .update(users)
      .set({ customerID: customer.id })
      .where(eq(users.id, newUser[0].id));

    //send verification email
    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return { success: "Verification email sent" };
  });
