import type { DocumentData } from "./hash.service";


export function extractDocumentData(
    text: string
): DocumentData {

    const lines: string[] = text
        .split("\n")
        .map((line) =>
            line
                .replace(/\s+/g, " ")
                .trim()
        )
        .filter((line) => line.length > 0);


    let certificateNumber: string | null = null;
    let studentNim: string | null = null;
    let studentName: string | null = null;


    // =========================
    // Extract certificate number
    // =========================

    for (const line of lines) {

        if (
            /(nomor|no\.?|seri).*(ijazah)/i.test(line) ||
            /(ijazah).*(nomor|no\.?|seri)/i.test(line)
        ) {

            const value = line
                .split(":")
                .at(-1);

            if (value) {
                certificateNumber = value
                    .replace(/—/g, "")
                    .trim();
            }

            break;
        }
    }


    // =========================
    // Extract NIM
    // =========================

    for (const line of lines) {

        const match = line.match(
            /(NIM|NPM|NRP|No\.?\s*Mahasiswa)\s*[:.]?\s*([A-Z0-9]+)/i
        );

        const nim = match?.[2];

        if (nim) {
            studentNim = nim.trim();
            break;
        }
    }


    // =========================
    // Extract Name
    // =========================

    const keywords = [
        "diberikan",
        "dianugerahkan",
        "menyatakan bahwa",
        "kepada",
    ];


    let keywordIndex = -1;


    for (let i = 0; i < lines.length; i++) {

        const line = lines.at(i);

        if (!line) {
            continue;
        }

        if (
            keywords.some((keyword) =>
                line
                    .toLowerCase()
                    .includes(keyword)
            )
        ) {
            keywordIndex = i;
            break;
        }
    }


    if (keywordIndex !== -1) {

        for (
            let i = keywordIndex + 1;
            i < lines.length;
            i++
        ) {

            const line = lines.at(i);

            if (!line) {
                continue;
            }


            if (
                /^[A-Z\s]{3,}$/.test(line)
            ) {
                studentName = line.trim();
                break;
            }
        }
    }


    if (
        !certificateNumber ||
        !studentNim ||
        !studentName
    ) {
        throw new Error(
            "Document information could not be extracted"
        );
    }


    return {
        certificateNumber,
        studentNim,
        studentName,
    };
}