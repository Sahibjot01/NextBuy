import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: string;
  image: string;
  isOAuth: boolean;
  istwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
