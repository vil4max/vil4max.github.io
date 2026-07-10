#!/usr/bin/env node
import path from "node:path";
import { deepDiff, readJson, sanitizePublicResumeExport } from "../../career/resume/lib/resume-md-lib.mjs";
import { resumeSourceJsonPath, resumeSourceJsonTmpPath } from "./resume-paths.mjs";

const goldenPath = resumeSourceJsonPath;
const parsedPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : resumeSourceJsonTmpPath;

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

console.log("OK: sanitized resume source matches resume-source.json");
