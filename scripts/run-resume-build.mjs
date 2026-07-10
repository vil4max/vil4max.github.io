#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { sanitizePublicResumeExport } from "../../career/resume/lib/resume-md-lib.mjs";
import {
    PDF_AUTOFILL_FILENAME,
    PDF_DETAILED_HTML,
    autofillBuildPdfPath,
} from "./resume-pdf-paths.mjs";
import { careerRoot, resumeSourceJsonPath, resumeSourceJsonTmpPath } from "./resume-paths.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptsDir = path.join(root, "scripts");
const careerLibDir = path.join(careerRoot, "resume", "lib");

const LEGACY_PDF_FILENAMES = [
    "Vilchevskiy_iOS_Engineer.pdf",
    "Vilchevskiy_iOS_Engineer_1page.pdf",
    "Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf",
];

function run(scriptPath, args = []) {
    const result = spawnSync(process.execPath, [scriptPath, ...args], {
        stdio: "inherit",
        cwd: root,
    });
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

function runCareerOnePageBuild() {
    const result = spawnSync(process.execPath, ["resume/scripts/run-one-page-build.mjs"], {
        stdio: "inherit",
        cwd: careerRoot,
    });
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

function removeLegacyPublicPdfs() {
    const assetsDir = path.join(root, "../vil4max/assets");
    for (const filename of LEGACY_PDF_FILENAMES) {
        const filePath = path.join(assetsDir, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Removed legacy/public-unwanted PDF: ${filePath}`);
        }
    }
}

const tmpPath = resumeSourceJsonTmpPath;
const goldenPath = resumeSourceJsonPath;

fs.mkdirSync(path.dirname(goldenPath), { recursive: true });

run(path.join(careerLibDir, "validate-source-markdown.mjs"));
run(path.join(careerLibDir, "validate-presentation-markdown.mjs"));
run(path.join(scriptsDir, "generate-public-resume.mjs"));
run(path.join(scriptsDir, "parse-resume-md.mjs"), [tmpPath]);
run(path.join(scriptsDir, "compare-resume-json.mjs"), [tmpPath]);

const parsed = sanitizePublicResumeExport(JSON.parse(fs.readFileSync(tmpPath, "utf8")));
fs.writeFileSync(goldenPath, `${JSON.stringify(parsed, null, 2)}\n`);
fs.unlinkSync(tmpPath);

run(path.join(scriptsDir, "sync-resume-html.mjs"));
run(path.join(scriptsDir, "validate-resume-sync.mjs"));
runCareerOnePageBuild();
run(path.join(scriptsDir, "generate-resume-pdf.mjs"), [
    PDF_DETAILED_HTML,
    autofillBuildPdfPath,
]);
removeLegacyPublicPdfs();
run(path.join(scriptsDir, "check-resume-pdfs.mjs"));

console.log(`OK: resume build complete (public PDF published; autofill private at ${PDF_AUTOFILL_FILENAME})`);
console.log("NOTE: index.html is not modified by resume:build — use portfolio:sync for landing content.");
