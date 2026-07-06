#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { buildResumeSourceFromFiles } from "../../career/resume/lib/resume-merge.mjs";
import { assertPresentationFilesExist, assertSourceOfTruthExists, sourceOfTruthPath } from "./resume-paths.mjs";

assertSourceOfTruthExists();
assertPresentationFilesExist();

const outputPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(path.dirname(sourceOfTruthPath), ".resume-source.json.tmp");

const parsed = buildResumeSourceFromFiles();
fs.writeFileSync(outputPath, `${JSON.stringify(parsed, null, 2)}\n`);
console.log(`Built resume source from facts + presentation → ${outputPath}`);
