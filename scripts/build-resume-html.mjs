#!/usr/bin/env node
/**
 * Reads content/resume-source.json and verifies (or optionally would sync) date strings.
 * Run: npm run resume:validate
 *
 * To change dates: edit content/resume.md first, then update cv.html
 * and index-short.html in the same session.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const validateScript = path.join(root, "validate-resume-sync.mjs");

const result = spawnSync(process.execPath, [validateScript], { stdio: "inherit" });
process.exit(result.status ?? 1);
