import { pdf } from "pdf-to-img";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);


export async function extractPdfText(
    file: File
): Promise<string> {

    const buffer = Buffer.from(
        await file.arrayBuffer()
    );


    const uploadDir = "./uploads";

    await mkdir(uploadDir, {
        recursive: true,
    });


    const pdfPath = join(
        uploadDir,
        "document.pdf"
    );


    await Bun.write(
        pdfPath,
        buffer
    );


    const document = await pdf(pdfPath);


    let pageNumber = 1;

    let imagePath = "";


    for await (const image of document) {

        imagePath = join(
            uploadDir,
            `page-${pageNumber}.png`
        );


        await Bun.write(
            imagePath,
            image
        );


        break;
    }


    if (!imagePath) {
        throw new Error(
            "Failed to convert PDF into image"
        );
    }


    const { stdout } = await execAsync(
        `tesseract "${imagePath}" stdout -l ind+eng`
    );


    const text = stdout.trim();


    if (!text) {
        throw new Error(
            "OCR failed to extract text"
        );
    }


    return text;
}