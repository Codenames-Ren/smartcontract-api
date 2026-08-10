import  { prisma } from "../config/prisma";

export async function createDocument(data: {
    hash: string;
    studentName: string;
    studentNim: string;
    certificateNumber: string;
    fileName: string;
    filePath: string;
    transactionHash: string;
}) {
    return await prisma.document.create({
        data,
    });
}

export async function findDocumentByHash(hash: string) {
    return await prisma.document.findUnique({
        where: {
            hash,
        },
    });
}

export async function revokeDocument(hash: string) {
    return await prisma.document.update({
        where: { hash },
        data: { revoked: true },
    });
}