#!/usr/bin/env node
import fs from "node:fs";
import { publishedProfilePath, sourceOfTruthPath } from "./resume-paths.mjs";

const privateStart = "<!-- @visibility: private -->";
const privateEnd = "<!-- @end -->";

let published = fs.readFileSync(sourceOfTruthPath, "utf8");
while (published.includes(privateStart)) {
    const start = published.indexOf(privateStart);
    const end = published.indexOf(privateEnd, start);
    if (end === -1) {
        break;
    }
    published = published.slice(0, start) + published.slice(end + privateEnd.length);
}

fs.writeFileSync(publishedProfilePath, published.trimEnd() + "\n");
console.log(`Published ${publishedProfilePath} from ${sourceOfTruthPath}`);
