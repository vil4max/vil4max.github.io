#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { sanitizePublicResumeExport } from "./resume-md-lib.mjs";
import {
    PDF_CANONICAL_FILENAME,
    PDF_DETAILED_FILENAME,
    PDF_DETAILED_HTML,
    PDF_ONE_PAGE_HTML,
} from "./resume-pdf-paths.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptsDir = path.join(root, "scripts");

const LEGACY_PDF_FILENAMES = [
    "Vilchevskiy_iOS_Engineer.pdf",
    "Vilchevskiy_iOS_Engineer_1page.pdf",
];

function run(scriptName, args = []) {
    const result = spawnSync(process.execPath, [path.join(scriptsDir, scriptName), ...args], {
        stdio: "inherit",
        cwd: root,
    });
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

function removeLegacyPdfs() {
    const assetsDir = path.join(root, "../vil4max/assets");
    for (const filename of LEGACY_PDF_FILENAMES) {
        const filePath = path.join(assetsDir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Removed legacy PDF: ${filePath}`);
        }
    }
}

const tmpPath = path.join(root, "content", ".resume-source.json.tmp");
const goldenPath = path.join(root, "content", "resume-source.json");

run("validate-source-markdown.mjs");
run("generate-public-resume.mjs");
run("parse-resume-md.mjs", [tmpPath]);
run("compare-resume-json.mjs", [tmpPath]);

const parsed = sanitizePublicResumeExport(JSON.parse(fs.readFileSync(tmpPath, "utf8")));
fs.writeFileSync(goldenPath, `${JSON.stringify(parsed, null, 2)}\n`);
fs.unlinkSync(tmpPath);

run("sync-resume-html.mjs");
run("sync-resume-one-page-html.mjs");
run("validate-resume-sync.mjs");
run("generate-resume-pdf.mjs", [
    PDF_ONE_PAGE_HTML,
    `../vil4max/assets/${PDF_CANONICAL_FILENAME}`,
]);
run("generate-resume-pdf.mjs", [
    PDF_DETAILED_HTML,
    `../vil4max/assets/${PDF_DETAILED_FILENAME}`,
]);
removeLegacyPdfs();
run("check-resume-pdfs.mjs");

console.log("OK: resume build complete");
