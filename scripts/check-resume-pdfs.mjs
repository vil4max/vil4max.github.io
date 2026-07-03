import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const iCloudResumeDir = path.join(
    os.homedir(),
    "Library/Mobile Documents/com~apple~CloudDocs/pdf-resume",
);

const fullHtml = path.resolve(repoRoot, "cv.html");
const shortHtml = path.resolve(repoRoot, "index-short.html");
const canonicalMd = path.resolve(repoRoot, "content", "resume.md");
const publicMd = path.resolve(repoRoot, "resume.md");

const primaryPdfAssets = path.resolve(repoRoot, "../vil4max/assets/Vilchevskiy_iOS_Engineer.pdf");
const detailedPdfAssets = path.resolve(repoRoot, "../vil4max/assets/Vilchevskiy_iOS_Engineer_detailed.pdf");

const primaryPdfICloud = path.resolve(iCloudResumeDir, "Vilchevskiy_iOS_Engineer.pdf");
const detailedPdfICloud = path.resolve(iCloudResumeDir, "Vilchevskiy_iOS_Engineer_detailed.pdf");

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

function stripPrivateBlocks(markdown) {
    const privateStart = "<!-- @visibility: private -->";
    const privateEnd = "<!-- @end -->";
    let published = markdown;
    while (published.includes(privateStart)) {
        const start = published.indexOf(privateStart);
        const end = published.indexOf(privateEnd, start);
        if (end === -1) {
            break;
        }
        published = published.slice(0, start) + published.slice(end + privateEnd.length);
    }
    return published.trimEnd() + "\n";
}

function hashText(text) {
    return createHash("sha256").update(text).digest("hex");
}

async function ensurePublicResumeFresh() {
    const canonical = await readFile(canonicalMd, "utf8");
    const published = await readFile(publicMd, "utf8");
    const expected = stripPrivateBlocks(canonical);
    if (hashText(published) !== hashText(expected)) {
        throw new Error(
            `resume.md is stale.\nSource: ${canonicalMd}\nPublished: ${publicMd}\nFix: npm run resume:publish-md`
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

    const primaryPages = countPdfPages(primaryPdfAssets);
    if (primaryPages !== 1) {
        throw new Error(
            `Primary PDF must be exactly 1 page (found ${primaryPages}).\nPDF: ${primaryPdfAssets}\nFix: shorten index-short.html content, then npm run resume:pdf:short`
        );
    }

    await ensurePublicResumeFresh();

    process.stdout.write("OK: PDFs and resume.md are up to date.\n");
} catch (error) {
    process.stderr.write(`${error?.message ?? String(error)}\n`);
    process.exitCode = 1;
}
