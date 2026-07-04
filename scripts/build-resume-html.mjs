#!/usr/bin/env node
/**
 * Reads content/resume-source.json and verifies (or optionally would sync) date strings.
 * Run: npm run resume:validate
 *
 * To change dates: edit content/source-of-truth.md, then run npm run resume:build
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const validateScript = path.join(root, "validate-resume-sync.mjs");

const result = spawnSync(process.execPath, [validateScript], { stdio: "inherit" });
process.exit(result.status ?? 1);
