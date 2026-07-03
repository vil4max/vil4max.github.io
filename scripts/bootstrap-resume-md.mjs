#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateResumeMarkdown, readJson } from "./resume-md-lib.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "content", "resume-source.json");
const outputPath = path.join(root, "content", "resume.md");

const source = readJson(sourcePath);
const markdown = generateResumeMarkdown(source, {
    agenticLines: [
        "Cursor — daily workflow for refactoring, tests, SDK exploration, and architecture iteration",
        "GitHub Copilot — autocomplete and boilerplate in Xcode and VS Code/Cursor",
        "AI-assisted documentation and test generation for SDK modules and production features",
    ],
    careerDirection:
        "Senior iOS engineer growing into mobile product engineering with on-device AI — shipping AI-assisted features (voice, intents, tool calling) as product code, not ML research. Strong in UIKit/SwiftUI, SDK modularization, and production delivery.",
});

fs.writeFileSync(outputPath, markdown);
console.log(`Wrote ${outputPath}`);
