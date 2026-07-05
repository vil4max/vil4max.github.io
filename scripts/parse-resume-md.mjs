#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseResumeMarkdown } from "./resume-md-lib.mjs";
import { assertSourceOfTruthExists, sourceOfTruthPath } from "./resume-paths.mjs";

assertSourceOfTruthExists();

const outputPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(path.dirname(sourceOfTruthPath), ".resume-source.json.tmp");

const markdown = fs.readFileSync(sourceOfTruthPath, "utf8");
const parsed = parseResumeMarkdown(markdown);
fs.writeFileSync(outputPath, `${JSON.stringify(parsed, null, 2)}\n`);
console.log(`Parsed ${sourceOfTruthPath} → ${outputPath}`);
