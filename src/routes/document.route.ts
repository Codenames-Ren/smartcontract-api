import { Elysia, t } from "elysia";
import {registerDocumentController, verifyDocumentController, getDocumentController, revokeDocumentController, downloadDocumentController} from "../controllers/document.controller";

function validatePdf(file: File) {
    if (!file) {
        throw new Error("File is required");
    }

    if (file.type !== "application/pdf") {
        throw new Error("Only PDF files are allowed");
    }
}


export const documentRoute = new Elysia({
    prefix: "/documents",
})

// Register PDF
.post("/register", async ({ body }) => {
        validatePdf(body.file);
        const result = await registerDocumentController(body.file);

        return {
            success: true,
            data: result,
        };
    },
    {
        body: t.Object({
            file: t.File(),
        }),
    }
)


// Verify PDF
.post("/verify", async ({ body }) => {
        validatePdf(body.file);
        const result = await verifyDocumentController(body.file);

        return {
            success: true,
            data: result,
        };
    },
    {
        body: t.Object({
            file: t.File(),
        }),
    }
)


// Detail
.get("/:hash", async ({ params }) => {
        const result = await getDocumentController(params.hash);

        return {
            success: true,
            data: result,
        };
    }
)


// Revoke
.post("/:hash/revoke", async ({ params }) => {
        const result = await revokeDocumentController(params.hash);

        return {
            success: true,
            data: result,
        };
    }
)

// Download
.get("/:hash/file", async ({ params, set }) => {
    const file = await downloadDocumentController(params.hash);

    set.headers["Content-Type"] = "application/pdf";

    return file;
})