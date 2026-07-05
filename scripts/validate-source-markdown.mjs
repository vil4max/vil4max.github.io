#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertSourceOfTruthExists, sourceOfTruthPath } from "./resume-paths.mjs";

assertSourceOfTruthExists();
const markdown = fs.readFileSync(sourceOfTruthPath, "utf8");
const linkedInHeader = "#### LinkedIn paste";
const errors = [];
let searchFrom = 0;
let blockIndex = 0;

while (true) {
    const headerIndex = markdown.indexOf(linkedInHeader, searchFrom);
    if (headerIndex === -1) {
        break;
    }
    blockIndex += 1;
    const fenceStart = markdown.indexOf("```", headerIndex + linkedInHeader.length);
    if (fenceStart === -1) {
        errors.push(`LinkedIn paste block ${blockIndex}: missing opening fence`);
        break;
    }
    const contentStart = fenceStart + 3;
    const fenceEnd = markdown.indexOf("```", contentStart);
    if (fenceEnd === -1) {
        errors.push(`LinkedIn paste block ${blockIndex}: missing closing fence`);
        break;
    }
    const inside = markdown.slice(contentStart, fenceEnd);
    if (inside.includes("#### Related projects")) {
        errors.push(
            `LinkedIn paste block ${blockIndex}: #### Related projects must be outside the closing fence`,
        );
    }
    searchFrom = fenceEnd + 3;
}

if (errors.length > 0) {
    console.error("Source markdown validation failed:\n");
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(`OK: ${blockIndex} LinkedIn paste blocks validated in source-of-truth.md`);
