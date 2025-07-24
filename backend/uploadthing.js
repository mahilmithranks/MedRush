import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

const auth = (req, res) => ({ id: "fakeId" }); 

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req, res }) => {
      const user = await auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
  
  imageOrPdfUploader: f(["image", "pdf"])
    .middleware(async ({ req, res }) => {
      const user = await auth(req, res);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
};
