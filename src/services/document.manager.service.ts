import { extractPdfText } from "./pdf.service";
import { extractDocumentData } from "./document.service";
import { generateDocumentHash } from "./hash.service";
import {registerDocument, verifyDocument, revokeDocument as revokeBlockchainDocument} from "./blockchain.service";
import {createDocument, findDocumentByHash, revokeDocument } from "../repositories/document.repository";
import { saveUploadedFile, getFile } from "./storage.service";


export async function registerPdfDocument(file: File) {
    
    // 1. Save PDF locally
    const filePath = await saveUploadedFile(file);

    // 2. Extract text from PDF (OCR)
    const text = await extractPdfText(file);

    // 3. Extract document metadata
    const data = extractDocumentData(text);

    // 4. Generate document hash
    const hash = generateDocumentHash(data);

    // 5. Register hash to blockchain
    const transactionHash = await registerDocument(hash);

    // 6. Save metadata to database
    const saved = await createDocument({
            hash,
            studentName: data.studentName,
            studentNim: data.studentNim,
            certificateNumber:
                data.certificateNumber,
            fileName: file.name,
            filePath,
            transactionHash,
        });

    return saved;
}



export async function verifyPdfDocument(file: File) {

    // 1. Extract text from PDF
    const text = await extractPdfText(file);

    // 2. Extract document metadata
    const data = extractDocumentData(text);

    // 3. Generate document hash
    const hash = generateDocumentHash(data);

    // 4. Verify hash on blockchain
    const valid = await verifyDocument(hash);

    return {hash, valid, data};
}



export async function revokePdfDocument(hash: string) {

    // 1. Revoke document on blockchain
    const transactionHash = await revokeBlockchainDocument(hash);

    // 2. Update revoke status in database
    await revokeDocument(hash);

    return {transactionHash};
}

export async function getDocumentDetail(hash: string) {
    return await findDocumentByHash(hash);
}

export async function getDocumentFile(hash: string) {
    const document = await findDocumentByHash(hash);

    if (!document) {
        throw new Error("Document not found");
    }

    return await getFile(document.filePath);
}