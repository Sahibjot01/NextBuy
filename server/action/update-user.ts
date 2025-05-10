"use server";
import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import bcypt from "bcrypt";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const updateUser = actionClient
  .schema(SettingsSchema)
  .action(
    async ({
      parsedInput: {
        email,
        image,
        isTwoFactorEnabled,
        name,
        newPassword,
        password,
      },
    }) => {
      const user = await auth();
      //if user is not logged in return an error
      if (!user) {
        return { error: "User not found" };
      }
      //check if usr exists
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id),
      });
      //if user does not exist return an error
      if (!dbUser) {
        return { error: "User not found" };
      }

      //if user is OAuth then we cant update the passwords and email
      if (user.user.isOAuth) {
        email = undefined;
        password = undefined;
        newPassword = undefined;
        //since isOauth is true means user twoFactorEnabled is also true(user already verified its email since user already signin using OAuth)
        isTwoFactorEnabled = undefined;
      }
      if (password && newPassword && dbUser.password) {
        const isMatch = await bcypt.compare(password, dbUser.password);
        if (!isMatch) {
          return { error: "Incorrect password" };
        }
        //check for same password
        const isSamePassword = await bcypt.compare(
          newPassword,
          dbUser.password
        );
        if (isSamePassword) {
          return { error: "New password cannot be same as old password" };
        }
        //hash password
        const hashedPassword = await bcypt.hash(newPassword, 10);
        password = hashedPassword;
        newPassword = undefined;
      }

      //update user
      await db
        .update(users)
        .set({
          email,
          image,
          twoFactorEnabled: isTwoFactorEnabled,
          name,
          password,
        })
        .where(eq(users.id, user.user.id));

      revalidatePath("/dashboard/settings");
      return { success: "User updated successfully" };
    }
  );
