#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "content", "resume.md");
const outputPath = path.join(root, "resume.md");

const privateStart = "<!-- @visibility: private -->";
const privateEnd = "<!-- @end -->";

const privateFrontmatterKeys = new Set([
    "availability",
    "headerAvailability",
    "applyPrimarySkill",
    "applyYearsExperience",
    "applyEnglishLevel",
    "applyNoticePeriod",
    "applyCountry",
    "applyCity",
    "applyPreferredWorkCountries",
]);

function stripPrivateFrontmatter(markdown) {
    if (!markdown.startsWith("---\n")) {
        return markdown;
    }
    const end = markdown.indexOf("\n---\n", 4);
    if (end === -1) {
        return markdown;
    }
    const frontmatterBody = markdown.slice(4, end);
    const rest = markdown.slice(end + 5);
    const publicLines = frontmatterBody
        .split("\n")
        .filter((line) => {
            const key = line.split(":")[0]?.trim();
            return key && !privateFrontmatterKeys.has(key);
        });
    return `---\n${publicLines.join("\n")}\n---\n${rest}`;
}

let published = fs.readFileSync(sourcePath, "utf8");
while (published.includes(privateStart)) {
    const start = published.indexOf(privateStart);
    const end = published.indexOf(privateEnd, start);
    if (end === -1) {
        break;
    }
    published = published.slice(0, start) + published.slice(end + privateEnd.length);
}
published = stripPrivateFrontmatter(published);

fs.writeFileSync(outputPath, published.trimEnd() + "\n");
console.log(`Published ${outputPath}`);
