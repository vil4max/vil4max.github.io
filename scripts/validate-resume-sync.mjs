import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(root, "..");
const sourcePath = path.join(repoRoot, "content", "resume-source.json");
const fullHtmlPath = path.join(repoRoot, "cv.html");
const shortHtmlPath = path.join(repoRoot, "index-short.html");
const experienceHtmlPath = path.join(repoRoot, "experience.html");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const fullHtml = fs.readFileSync(fullHtmlPath, "utf8");
const shortHtml = fs.readFileSync(shortHtmlPath, "utf8");
const experienceHtml = fs.readFileSync(experienceHtmlPath, "utf8");

const errors = [];

const shortOmittedRoleIds = new Set([
    "solvve",
    "electus",
    "gbksoft",
    "early-career",
]);

const fullCvOmittedRoleIds = new Set([
    "solvve",
    "electus",
    "gbksoft",
    "early-career",
]);

for (const role of source.roles) {
    if (!fullCvOmittedRoleIds.has(role.id) && !fullHtml.includes(role.displayFull)) {
        errors.push(`cv.html missing displayFull for ${role.id}: ${role.displayFull}`);
    }
    if (shortOmittedRoleIds.has(role.id)) {
        continue;
    }
    if (!shortHtml.includes(role.displayFull)) {
        errors.push(`index-short.html missing displayFull for ${role.id}: ${role.displayFull}`);
    }
    if (!experienceHtml.includes(role.displayShort)) {
        errors.push(`experience.html missing displayShort for ${role.id}: ${role.displayShort}`);
    }
}

if (!shortHtml.includes("https://vil4max.github.io/")) {
    errors.push("index-short.html missing full timeline link to vil4max.github.io");
}

if (!fullHtml.includes(source.meta.title)) {
    errors.push(`cv.html missing title: ${source.meta.title}`);
}

if (errors.length > 0) {
    console.error("Resume sync validation failed:\n");
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(`OK: ${source.roles.length} roles synced across cv.html, index-short.html, experience.html`);
