#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "content", "resume.md");
const outputPath = path.join(root, "resume.md");

const markdown = fs.readFileSync(sourcePath, "utf8");
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

fs.writeFileSync(outputPath, published.trimEnd() + "\n");
console.log(`Published ${outputPath}`);
