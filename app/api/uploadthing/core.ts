import { getServerSession } from "@/lib/get-session";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing()

export const ourFileRouter = {
    messageImage: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
    .middleware(async () => {
        const session = await getServerSession()

        if (!session) throw new UploadThingError("Unauthorized");

        return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {

        return { fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
