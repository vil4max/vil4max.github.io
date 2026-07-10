import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { stat } from "node:fs/promises";
import {
    PDF_CANONICAL_FILENAME,
    PDF_AUTOFILL_FILENAME,
    PDF_DETAILED_HTML,
    pdfCanonicalAssetsPath,
    autofillBuildPdfPath,
} from "./resume-pdf-paths.mjs";
import { presentationOnePagePath, sourceOfTruthPath } from "./resume-paths.mjs";

const repoRoot = process.cwd();
const iCloudResumeDir = path.join(
    os.homedir(),
    "Library/Mobile Documents/com~apple~CloudDocs/pdf-resume",
);

const autofillHtml = path.resolve(repoRoot, PDF_DETAILED_HTML);
const onePageSourcePaths = [sourceOfTruthPath, presentationOnePagePath];
const canonicalPdfAssets = pdfCanonicalAssetsPath;
const autofillPdf = autofillBuildPdfPath;
const canonicalPdfICloud = path.resolve(iCloudResumeDir, PDF_CANONICAL_FILENAME);
const autofillPdfICloud = path.resolve(iCloudResumeDir, PDF_AUTOFILL_FILENAME);

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
        pageCountMin: 1,
        pageCountMax: 2,
        mode: "sources",
    },
    {
        label: "private/autofill",
        pdfPath: autofillPdf,
        sourceHtmlPath: autofillHtml,
        mode: "html",
    },
    {
        label: "iCloud/canonical",
        pdfPath: canonicalPdfICloud,
        sourcePaths: onePageSourcePaths,
        pageCountMin: 1,
        pageCountMax: 2,
        optional: true,
        mode: "sources",
    },
    {
        label: "iCloud/autofill",
        pdfPath: autofillPdfICloud,
        sourceHtmlPath: autofillHtml,
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
            if (check.pageCountMin !== undefined) {
                const pages = countPdfPages(check.pdfPath);
                if (pages < check.pageCountMin || pages > check.pageCountMax) {
                    throw new Error(
                        `${check.label} must be ${check.pageCountMin}-${check.pageCountMax} page(s) (found ${pages}).\nPDF: ${check.pdfPath}\nFix: npm run resume:one-page in career or npm run resume:build`,
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

    const autofillPageCount = countPdfPages(autofillPdf);
    if (autofillPageCount < 2 || autofillPageCount > 4) {
        throw new Error(
            `Profile Autofill PDF must be 2–4 pages (found ${autofillPageCount}).\nPDF: ${autofillPdf}\nFix: adjust profile-autofill.html, then npm run resume:build`,
        );
    }

    const legacyDetailed = path.join(repoRoot, "../vil4max/assets/Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf");
    if (fs.existsSync(legacyDetailed)) {
        throw new Error(
            `Legacy Detailed PDF still in public assets: ${legacyDetailed}\nRemove it; autofill is private-only.`,
        );
    }

    process.stdout.write("OK: PDFs are up to date.\n");
} catch (error) {
    process.stderr.write(`${error?.message ?? String(error)}\n`);
    process.exitCode = 1;
}
