#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseResumeMarkdown } from "./resume-md-lib.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = path.join(root, "content", "resume.md");
const outputPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(root, "content", ".resume-source.json.tmp");

const markdown = fs.readFileSync(inputPath, "utf8");
const parsed = parseResumeMarkdown(markdown);
fs.writeFileSync(outputPath, `${JSON.stringify(parsed, null, 2)}\n`);
console.log(`Parsed ${inputPath} → ${outputPath}`);
