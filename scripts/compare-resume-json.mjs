#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepDiff, readJson, sanitizePublicResumeExport } from "./resume-md-lib.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const goldenPath = path.join(root, "content", "resume-source.json");
const parsedPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(root, "content", ".resume-source.json.tmp");

const golden = sanitizePublicResumeExport(readJson(goldenPath));
const parsed = sanitizePublicResumeExport(readJson(parsedPath));
const errors = deepDiff(parsed, golden);

if (errors.length > 0) {
    console.error("Resume JSON compare failed:\n");
    for (const error of errors.slice(0, 40)) {
        console.error(`- ${error}`);
    }
    if (errors.length > 40) {
        console.error(`- ... and ${errors.length - 40} more`);
    }
    process.exit(1);
}

console.log("OK: parsed resume.md matches resume-source.json");
