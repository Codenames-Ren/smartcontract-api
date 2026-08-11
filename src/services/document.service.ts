import type { DocumentData } from "./hash.service";

export function extractDocumentData(text: string): DocumentData {
    const lines: string[] = text
        .split("\n")
        .map((line) => line.replace(/\s+/g, " ").trim())
        .filter(Boolean);

    function getLine(index: number): string {
        return lines[index] ?? "";
    }

    let certificateNumber = "UNKNOWN";
    let studentName = "";
    let studentNim = "";

    // Certificate number: look for "Nomor Seri Ijazah" / "Nomor Ijazah" first
    for (const line of lines) {
        const match = line.match(
            /(Nomor\s+Seri\s+Ijazah|Nomor\s+Seri\s+\[?jazah|Nomor\s+Ijazah)\s*[:.]?\s*([A-Z0-9\/.'-]+)/i,
        );

        if (match?.[2]) {
            certificateNumber = match[2].replace(/'/g, "").trim();
            break;
        }
    }

    // Fallback: generic "No." pattern
    if (certificateNumber === "UNKNOWN") {
        for (const line of lines) {
            const match = line.match(/\bNo\.?\s*[:.]?\s*([A-Z0-9\/.'-]{5,})/i);

            if (match?.[1]) {
                certificateNumber = match[1].replace(/'/g, "").trim();
                break;
            }
        }
    }

    // NIM: match explicit label first (NIM/NPM/NRP/NRM)
    for (const line of lines) {
        const match = line.match(/(NIM|NPM|NRP|NRM)\s*[:.]?\s*([A-Z0-9\/-]{5,})/i);

        if (match?.[2]) {
            studentNim = match[2].replace(/[^A-Z0-9\/-]/gi, "").trim();
            break;
        }
    }

    // Fallback: any 8-12 digit number
    if (!studentNim) {
        for (const line of lines) {
            const match = line.match(/\b\d{8,12}\b/);

            if (match?.[0]) {
                studentNim = match[0];
                break;
            }
        }
    }

    function cleanName(value: string) {
        return value
            .replace(/[^A-Za-z\s]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/^(el|ee|a|b|i)\s+/i, "");
    }

    const blockedWords = [
        "KEMENTERIAN", "UNIVERSITAS", "FAKULTAS", "PROGRAM", "SARJANA", "IJAZAH",
        "DENGAN", "INI", "MEMBERIKAN", "GELAR", "MENYATAKAN", "BAHWA", "TEMPAT", "LAHIR",
    ];

    function isValidName(value: string): boolean {
        const clean = cleanName(value);
        const words = clean.split(" ").filter(Boolean);

        if (words.length < 2 || words.length > 4) return false;
        if (clean.length < 5 || clean.length > 40) return false;
        if (blockedWords.some((word) => clean.toUpperCase().includes(word))) return false;

        return true;
    }

    // Name strategy 1: line right above the NIM label
    for (let i = 0; i < lines.length; i++) {
        const line = getLine(i);

        if (/(NIM|NPM|NRP|NRM)/i.test(line)) {
            const candidates = [getLine(i - 1), getLine(i - 2)];

            for (const candidate of candidates) {
                if (candidate && isValidName(candidate)) {
                    studentName = cleanName(candidate);
                    break;
                }
            }
        }

        if (studentName) break;
    }

    // Name strategy 2: line(s) after a degree title (e.g. S.Pd, S.Kom, Sarjana)
    if (!studentName) {
        for (let i = 0; i < lines.length; i++) {
            const line = getLine(i);

            if (/(S\.?\s?Pd|S\.?\s?E|S\.?\s?T|S\.?\s?H|S\.?\s?Kom|Sarjana)/i.test(line)) {
                const candidates = [getLine(i + 1), getLine(i + 2), getLine(i + 3)];

                for (const candidate of candidates) {
                    if (candidate && isValidName(candidate)) {
                        studentName = cleanName(candidate);
                        break;
                    }
                }
            }

            if (studentName) break;
        }
    }

    // Name strategy 3: line(s) after "menyatakan bahwa"
    if (!studentName) {
        for (let i = 0; i < lines.length; i++) {
            const line = getLine(i);

            if (/menyatakan bahwa/i.test(line)) {
                const candidates = [getLine(i + 1), getLine(i + 2)];

                for (const candidate of candidates) {
                    if (candidate && isValidName(candidate)) {
                        studentName = cleanName(candidate);
                        break;
                    }
                }
            }

            if (studentName) break;
        }
    }

    if (!studentName || !studentNim) {
        throw new Error("Document information could not be extracted or not valid");
    }

    return { certificateNumber, studentName, studentNim };
}