import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { stat } from "node:fs/promises";
import {
    PDF_CANONICAL_FILENAME,
    PDF_DETAILED_FILENAME,
    PDF_DETAILED_HTML,
    pdfCanonicalAssetsPath,
    pdfDetailedAssetsPath,
} from "./resume-pdf-paths.mjs";
import { presentationOnePagePath, sourceOfTruthPath } from "./resume-paths.mjs";

const repoRoot = process.cwd();
const iCloudResumeDir = path.join(
    os.homedir(),
    "Library/Mobile Documents/com~apple~CloudDocs/pdf-resume",
);

const detailedHtml = path.resolve(repoRoot, PDF_DETAILED_HTML);
const onePageSourcePaths = [sourceOfTruthPath, presentationOnePagePath];
const canonicalPdfAssets = pdfCanonicalAssetsPath;
const detailedPdfAssets = pdfDetailedAssetsPath;
const canonicalPdfICloud = path.resolve(iCloudResumeDir, PDF_CANONICAL_FILENAME);
const detailedPdfICloud = path.resolve(iCloudResumeDir, PDF_DETAILED_FILENAME);

async function getMtimeMs(filePath) {
    const stats = await stat(filePath);
    return stats.mtimeMs;
}

async function newestSourceMtime(sourcePaths) {
    const mtimes = await Promise.all(sourcePaths.map((sourcePath) => getMtimeMs(sourcePath)));
    return Math.max(...mtimes);
}

async function ensureUpToDate({ label, pdfPath, sourcePaths }) {
    const [pdfMtime, sourceMtime] = await Promise.all([
        getMtimeMs(pdfPath),
        newestSourceMtime(sourcePaths),
    ]);

    if (pdfMtime < sourceMtime) {
        throw new Error(
            `${label} is stale.\nPDF: ${pdfPath}\nSources: ${sourcePaths.join(", ")}\nFix: npm run resume:build`,
        );
    }
}

async function ensureHtmlUpToDate({ label, pdfPath, sourceHtmlPath }) {
    const [pdfMtime, sourceMtime] = await Promise.all([
        getMtimeMs(pdfPath),
        getMtimeMs(sourceHtmlPath),
    ]);

    if (pdfMtime < sourceMtime) {
        throw new Error(
            `${label} is stale.\nPDF: ${pdfPath}\nSource: ${sourceHtmlPath}\nFix: npm run resume:build`,
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
    {
        label: "assets/canonical",
        pdfPath: canonicalPdfAssets,
        sourcePaths: onePageSourcePaths,
        pageCount: 1,
        mode: "sources",
    },
    {
        label: "assets/detailed",
        pdfPath: detailedPdfAssets,
        sourceHtmlPath: detailedHtml,
        mode: "html",
    },
    {
        label: "iCloud/canonical",
        pdfPath: canonicalPdfICloud,
        sourcePaths: onePageSourcePaths,
        pageCount: 1,
        optional: true,
        mode: "sources",
    },
    {
        label: "iCloud/detailed",
        pdfPath: detailedPdfICloud,
        sourceHtmlPath: detailedHtml,
        optional: true,
        mode: "html",
    },
];

try {
    for (const check of checks) {
        try {
            if (check.mode === "sources") {
                await ensureUpToDate(check);
            } else {
                await ensureHtmlUpToDate(check);
            }
            if (check.pageCount !== undefined) {
                const pages = countPdfPages(check.pdfPath);
                if (pages !== check.pageCount) {
                    throw new Error(
                        `${check.label} must be ${check.pageCount} page(s) (found ${pages}).\nPDF: ${check.pdfPath}\nFix: npm run resume:one-page in career or npm run resume:build`,
                    );
                }
            }
        } catch (error) {
            if (check.optional && error?.code === "ENOENT") {
                continue;
            }
            throw error;
        }
    }

    const detailedPageCount = countPdfPages(detailedPdfAssets);
    if (detailedPageCount < 2 || detailedPageCount > 3) {
        throw new Error(
            `Detailed CV PDF must be 2–3 pages (found ${detailedPageCount}).\nPDF: ${detailedPdfAssets}\nFix: shorten index.html content, then npm run resume:build`,
        );
    }

    process.stdout.write("OK: PDFs are up to date.\n");
} catch (error) {
    process.stderr.write(`${error?.message ?? String(error)}\n`);
    process.exitCode = 1;
}
