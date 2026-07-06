import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export const PDF_CANONICAL_FILENAME = "Max_Vilchevskiy_Senior_iOS_Engineer.pdf";
export const PDF_DETAILED_FILENAME = "Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf";
export const PDF_ONE_PAGE_HTML = "resume-one-page.html";
export const PDF_DETAILED_HTML = "index.html";

export const pdfAssetsDir = path.join(root, "../vil4max/assets");
export const pdfCanonicalAssetsPath = path.join(pdfAssetsDir, PDF_CANONICAL_FILENAME);
export const pdfDetailedAssetsPath = path.join(pdfAssetsDir, PDF_DETAILED_FILENAME);

export const pdfRawGitHubBase =
    "https://raw.githubusercontent.com/vil4max/vil4max/main/assets";

export function pdfRawGitHubUrl(filename) {
    return `${pdfRawGitHubBase}/${filename}`;
}
