import { stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const iCloudResumeDir = path.join(
    os.homedir(),
    "Library/Mobile Documents/com~apple~CloudDocs/pdf-resume",
);

const fullHtml = path.resolve(repoRoot, "cv.html");
const shortHtml = path.resolve(repoRoot, "index-short.html");

const primaryPdfAssets = path.resolve(repoRoot, "../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer.pdf");
const detailedPdfAssets = path.resolve(
    repoRoot,
    "../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer_detailed.pdf"
);

const primaryPdfICloud = path.resolve(iCloudResumeDir, "Max_Vilchevskiy_Senior_iOS_Engineer.pdf");
const detailedPdfICloud = path.resolve(iCloudResumeDir, "Max_Vilchevskiy_Senior_iOS_Engineer_detailed.pdf");

async function getMtimeMs(filePath) {
    const stats = await stat(filePath);
    return stats.mtimeMs;
}

async function ensureUpToDate({ label, pdfPath, sourceHtmlPath }) {
    const [pdfMtime, sourceMtime] = await Promise.all([
        getMtimeMs(pdfPath),
        getMtimeMs(sourceHtmlPath),
    ]);

    if (pdfMtime < sourceMtime) {
        throw new Error(
            `${label} is stale.\nPDF: ${pdfPath}\nSource: ${sourceHtmlPath}\nFix: npm run resume:pdf:all`
        );
    }
}

const checks = [
    { label: "assets/primary", pdfPath: primaryPdfAssets, sourceHtmlPath: shortHtml },
    { label: "assets/detailed", pdfPath: detailedPdfAssets, sourceHtmlPath: fullHtml },
    { label: "iCloud/primary", pdfPath: primaryPdfICloud, sourceHtmlPath: shortHtml, optional: true },
    { label: "iCloud/detailed", pdfPath: detailedPdfICloud, sourceHtmlPath: fullHtml, optional: true },
];

try {
    for (const check of checks) {
        try {
            await ensureUpToDate(check);
        } catch (error) {
            if (check.optional && error?.code === "ENOENT") {
                continue;
            }
            throw error;
        }
    }
    process.stdout.write("OK: PDFs are up to date.\n");
} catch (error) {
    process.stderr.write(`${error?.message ?? String(error)}\n`);
    process.exitCode = 1;
}

