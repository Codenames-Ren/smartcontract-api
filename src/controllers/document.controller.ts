import { registerPdfDocument, verifyPdfDocument, revokePdfDocument, getDocumentDetail, getDocumentFile } from "../services/document.manager.service";

export async function registerDocumentController(file: File) {
    return await registerPdfDocument(file);
}

export async function verifyDocumentController(file: File) {
    return await verifyPdfDocument(file);
}

export async function getDocumentController(hash: string) {
    return await getDocumentDetail(hash);
}

export async function revokeDocumentController(hash: string) {
    return await revokePdfDocument(hash);
}

export async function downloadDocumentController(hash: string) {
    return await getDocumentFile(hash);
}