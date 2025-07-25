import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

const handleAuth = (req, res, next) => {
    // Pass the user ID sent from the frontend to the router
    // This allows us to use it in `onUploadComplete` if needed
    req.user = { id: req.headers["x-user-id"] };
    next();
};

// Define all file routers for the application
export const ourFileRouter = {
    // For customers uploading prescriptions
    prescriptionUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
        pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("Prescription upload complete for userId:", metadata.userId);
    }),

    // For pharmacists uploading their license
    pharmacyLicenseUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
        pdf: { maxFileSize: "4MB", maxFileCount: 1 },
    })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("Pharmacy license upload complete for userId:", metadata.userId);
    }),

    // For delivery partners uploading their documents
    deliveryDocsUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
    })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("Delivery doc upload complete for userId:", metadata.userId);
    }),
};