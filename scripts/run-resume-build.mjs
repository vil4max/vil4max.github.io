#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptsDir = path.join(root, "scripts");

function run(scriptName, args = []) {
    const result = spawnSync(process.execPath, [path.join(scriptsDir, scriptName), ...args], {
        stdio: "inherit",
        cwd: root,
    });
    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

const tmpPath = path.join(root, "content", ".resume-source.json.tmp");
const goldenPath = path.join(root, "content", "resume-source.json");

run("validate-source-markdown.mjs");
run("generate-public-resume.mjs");
run("parse-resume-md.mjs", [tmpPath]);
run("compare-resume-json.mjs", [tmpPath]);

const parsed = JSON.parse(fs.readFileSync(tmpPath, "utf8"));
fs.writeFileSync(goldenPath, `${JSON.stringify(parsed, null, 2)}\n`);
fs.unlinkSync(tmpPath);

run("sync-resume-html.mjs");
run("validate-resume-sync.mjs");
run("generate-resume-pdf.mjs", ["index.html", "../vil4max/assets/Vilchevskiy_iOS_Engineer.pdf"]);
run("check-resume-pdfs.mjs");

console.log("OK: resume build complete");
