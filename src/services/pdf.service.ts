import { pdf } from "pdf-to-img";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

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


    const document = await pdf(pdfPath, {
        scale: 3,
    });


    let imagePath = "";


    for await (const image of document) {

        imagePath = join(
            uploadDir,
            "ocr-original.png"
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


    const processedPath = join(
        uploadDir,
        "ocr-processed.png"
    );


    await sharp(imagePath)
        .resize({
            width: 2500,
        })
        .grayscale()
        .normalize()
        .sharpen()
        .png()
        .toFile(processedPath);


    let text = "";


    // OCR utama
    const first = await execAsync(
        `tesseract "${processedPath}" stdout -l ind+eng --psm 6`
    );


    text = first.stdout.trim();


    // fallback kalau gagal
    if (!text) {

        const second = await execAsync(
            `tesseract "${processedPath}" stdout -l ind+eng --psm 3`
        );

        text = second.stdout.trim();
    }


    console.log("\n===== OCR RESULT =====");
    console.log(text);


    if (!text) {
        throw new Error(
            "OCR failed to extract text"
        );
    }


    return text;
}