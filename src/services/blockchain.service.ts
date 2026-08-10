import { contract } from "../config/blockchain";

export async function registerDocument(hash: string) {
    try {
        const tx = await contract.getFunction("registerDocument")(hash);
        await tx.wait();
        return tx.hash;
    } catch (error: any) {
        if (error.message?.includes("DocumentAlreadyExists")) {
            throw new Error("Document already registered");
        }

        throw new Error("Document already exists");
    }
}

export async function verifyDocument(hash: string) {
    try {
        return await contract.getFunction("isValid")(hash);
    } catch {
        throw new Error("Failed to verify document on blockchain");
    }
}

export async function getDocument(hash: string) {
    try {
        return await contract.getFunction("getDocument")(hash);
    } catch {
        throw new Error("Failed to get document from blockchain");
    }
}

export async function revokeDocument(hash: string) {
    try {
        const tx = await contract.getFunction("revokeDocument")(hash);
        await tx.wait();
        return tx.hash;
    } catch (error: any) {
        if (error.message?.includes("DocumentNotFound")) {
            throw new Error("Document not found");
        }

        if (error.message?.includes("DocumentAlreadyRevoked")) {
            throw new Error("Document already revoked");
        }

        throw new Error("Document already revoked");
    }
}