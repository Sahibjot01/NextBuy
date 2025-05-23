import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ metadata }) => {}),

  variantUploader: f({
    image: {
      maxFileCount: 10,
      maxFileSize: "16MB",
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    // console.log(file);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
