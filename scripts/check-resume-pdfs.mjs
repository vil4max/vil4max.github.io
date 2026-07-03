import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { stat } from "node:fs/promises";

const repoRoot = process.cwd();
const iCloudResumeDir = path.join(
    os.homedir(),
    "Library/Mobile Documents/com~apple~CloudDocs/pdf-resume",
);

const cvHtml = path.resolve(repoRoot, "cv.html");
const resumePdfAssets = path.resolve(repoRoot, "../vil4max/assets/Vilchevskiy_iOS_Engineer.pdf");
const resumePdfICloud = path.resolve(iCloudResumeDir, "Vilchevskiy_iOS_Engineer.pdf");

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
            `${label} is stale.\nPDF: ${pdfPath}\nSource: ${sourceHtmlPath}\nFix: npm run resume:build`
        );
    }
}

function countPdfPages(pdfPath) {
    const data = fs.readFileSync(pdfPath);
    const text = data.toString("latin1");
    const rootCount = text.match(/\/Type\s*\/Pages\b[\s\S]*?\/Count\s+(\d+)/);
    if (rootCount) {
        return Number.parseInt(rootCount[1], 10);
    }
    const pageMatches = text.match(/\/Type\s*\/Page\b/g);
    return pageMatches ? pageMatches.length : 0;
}

const checks = [
    { label: "assets/resume", pdfPath: resumePdfAssets, sourceHtmlPath: cvHtml },
    { label: "iCloud/resume", pdfPath: resumePdfICloud, sourceHtmlPath: cvHtml, optional: true },
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

    const pageCount = countPdfPages(resumePdfAssets);
    if (pageCount < 2 || pageCount > 3) {
        throw new Error(
            `Resume PDF must be 2–3 pages (found ${pageCount}).\nPDF: ${resumePdfAssets}\nFix: shorten cv.html content, then npm run resume:build`
        );
    }

    process.stdout.write("OK: PDFs are up to date.\n");
} catch (error) {
    process.stderr.write(`${error?.message ?? String(error)}\n`);
    process.exitCode = 1;
}
