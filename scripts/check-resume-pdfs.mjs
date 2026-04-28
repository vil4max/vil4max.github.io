import { stat } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const iCloudResumeDir =
    "/Users/maksym.vilchevskyi/Library/Mobile Documents/com~apple~CloudDocs/pdf-resume";

const fullHtml = path.resolve(repoRoot, "index.html");
const shortHtml = path.resolve(repoRoot, "index-short.html");

const fullPdfAssets = path.resolve(repoRoot, "../vil4max/assets/iOS_Vilchevskiy_CV.pdf");
const shortPdfAssets = path.resolve(
    repoRoot,
    "../vil4max/assets/iOS_Vilchevskiy_CV_short.pdf"
);

const fullPdfICloud = path.resolve(iCloudResumeDir, "iOS_Vilchevskiy_CV.pdf");
const shortPdfICloud = path.resolve(iCloudResumeDir, "iOS_Vilchevskiy_CV_short.pdf");

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
    { label: "assets/full", pdfPath: fullPdfAssets, sourceHtmlPath: fullHtml },
    { label: "assets/short", pdfPath: shortPdfAssets, sourceHtmlPath: shortHtml },
    { label: "iCloud/full", pdfPath: fullPdfICloud, sourceHtmlPath: fullHtml },
    { label: "iCloud/short", pdfPath: shortPdfICloud, sourceHtmlPath: shortHtml },
];

try {
    for (const check of checks) {
        await ensureUpToDate(check);
    }
    process.stdout.write("OK: PDFs are up to date.\n");
} catch (error) {
    process.stderr.write(`${error?.message ?? String(error)}\n`);
    process.exitCode = 1;
}

