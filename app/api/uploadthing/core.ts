import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/server/auth";
import { logger } from "@/lib/logger";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Check authentication
      const session = await auth();
      if (!session) {
        logger.warn("uploadthing", "Unauthorized avatar upload attempt");
        throw new UploadThingError("Unauthorized");
      }
      logger.debug("uploadthing", "Avatar upload authorized", {
        userId: session.user.id,
      });
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      logger.info("uploadthing", "Avatar upload completed", {
        userId: metadata.userId,
        fileKey: file.key,
        fileName: file.name,
      });
    }),

  variantUploader: f({
    image: {
      maxFileCount: 10,
      maxFileSize: "16MB",
    },
  })
    .middleware(async () => {
      // Check authentication and admin role
      const session = await auth();
      if (!session || session.user.role !== "admin") {
        logger.warn("uploadthing", "Unauthorized variant upload attempt", {
          userId: session?.user?.id,
          role: session?.user?.role,
        });
        throw new UploadThingError("Unauthorized - Admin access required");
      }
      logger.debug("uploadthing", "Variant upload authorized", {
        userId: session.user.id,
      });
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      logger.info("uploadthing", "Variant upload completed", {
        userId: metadata.userId,
        fileKey: file.key,
        fileName: file.name,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
