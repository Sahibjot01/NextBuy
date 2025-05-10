import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/login-schema";
import { accounts, users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import Stripe from "stripe";
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET!,
  session: { strategy: "jwt" },
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-04-30.basil",
      });
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });

      await db
        .update(users)
        .set({ customerID: customer.id })
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    async jwt({ token }) {
      // This callback is called whenever a JWT is created or updated
      //if token.sub is not set, it means this is the first time the user is signing in
      if (!token.sub) return token;
      //if token.sub is set, it means the user is already signed in
      //find the user in db
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;
      //now check if user signin with OAuth provider
      const isOAuth = await db.query.accounts.findFirst({
        where: eq(accounts.userId, token.sub),
      });
      //set fields to token
      token.isOAuth = !!isOAuth;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.image = existingUser.image;
      token.istwoFactorEnabled = existingUser.twoFactorEnabled;
      return token;
    },
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user) {
        if (token.role !== undefined) {
          session.user.role = token.role as string;
        }
        if (token.image !== undefined) {
          session.user.image = token.image as string;
        }
        if (token.isOAuth !== undefined) {
          session.user.isOAuth = token.isOAuth as boolean;
        }
        if (token.istwoFactorEnabled !== undefined) {
          session.user.istwoFactorEnabled = token.istwoFactorEnabled as boolean;
        }
        if (token.email !== undefined) {
          session.user.email = token.email as string;
        }
        if (token.name !== undefined) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);
        //if the fields are not validated return error
        if (!validatedFields.success) {
          return null;
        }
        const { email, password } = validatedFields.data;
        //check if user is in the database
        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        //if user is not found return error
        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          return user;
        }
        //if password does not match return error
        return null;
      },
    }),
  ],
});
