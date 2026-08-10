import { createHash } from "node:crypto";


export interface DocumentData {
    certificateNumber: string;
    studentName: string;
    studentNim: string;
}


export function normalizeDocumentData(
    data: DocumentData
): string {

    return [
        data.certificateNumber,
        data.studentName,
        data.studentNim,
    ]
        .map((value) =>
            value
                .normalize("NFKD")
                .replace(/[^\x00-\x7F]/g, "")
                .trim()
                .replace(/\s+/g, "")
                .replace(/-/g, "")
                .toUpperCase()
        )
        .join("|");
}


export function generateDocumentHash(
    data: DocumentData
): string {

    const normalized =
        normalizeDocumentData(data);


    return `0x${createHash("sha256")
        .update(normalized, "utf8")
        .digest("hex")}`;
}