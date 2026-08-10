import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

const UPLOAD_DIR = "./uploads";

export async function saveUploadedFile(file: File): Promise<string> {
    await mkdir(UPLOAD_DIR, {recursive: true});

    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());

    await Bun.write(filepath,buffer);

    return filepath;
}

export async function getFile(filepath: string) {
    return await readFile(filepath)
}