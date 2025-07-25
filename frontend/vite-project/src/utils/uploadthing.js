import { generateReactHelpers } from "@uploadthing/react";

/**
 * This file generates the custom React hooks for our application,
 * which is the standard way to use UploadThing in recent versions.
 * We then import these generated helpers into our components.
 */
export const { useUploadThing, uploadFiles } = generateReactHelpers();