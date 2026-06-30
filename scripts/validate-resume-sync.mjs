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

const fullCvOmittedRoleIds = new Set([]);

const forbiddenPhrases = [
    "crash-free",
    "host apps (Birmarket",
    "3 host apps",
    "3 production host",
    "contributed to shared marketplace",
    "UIKit modules stable",
    "SPM modules with MVP",
    "Firebase Remote Config experiments",
];

const surfaces = [
    { name: "resume-source.json", content: fs.readFileSync(sourcePath, "utf8") },
    { name: "cv.html", content: fullHtml },
    { name: "index-short.html", content: shortHtml },
    { name: "experience.html", content: experienceHtml },
];

for (const phrase of forbiddenPhrases) {
    for (const surface of surfaces) {
        if (surface.content.includes(phrase)) {
            errors.push(`${surface.name} contains forbidden phrase: ${phrase}`);
        }
    }
}

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

if (!shortHtml.includes("exp-full-timeline")) {
    errors.push("index-short.html missing web-only detailed CV link (.exp-full-timeline)");
}

if (source.earlyCareerShort && !shortHtml.includes(source.earlyCareerShort.slice(0, 40))) {
    errors.push("index-short.html missing earlyCareerShort snippet");
}

for (const role of source.roles) {
    if (!role.technologiesLine) {
        errors.push(`resume-source.json missing technologiesLine for ${role.id}`);
        continue;
    }
    if (!role.bullets || role.bullets.length < 2) {
        errors.push(`resume-source.json needs at least 2 bullets for ${role.id}`);
    }
    if (!fullHtml.includes(role.technologiesLine)) {
        errors.push(`cv.html missing technologiesLine for ${role.id}`);
    }
    if (role.shortInclude && !shortHtml.includes(role.technologiesLine)) {
        errors.push(`index-short.html missing technologiesLine for ${role.id}`);
    }
}

const globallogic = source.roles.find((role) => role.id === "globallogic");
if (globallogic?.bulletsShort) {
    for (const bullet of globallogic.bulletsShort) {
        if (!shortHtml.includes(bullet)) {
            errors.push(`index-short.html missing bulletsShort item for globallogic`);
            break;
        }
    }
    const parserOnly = globallogic.bullets.find(
        (bullet) => bullet.includes("on-device intent handling"),
    );
    if (parserOnly && shortHtml.includes(parserOnly)) {
        errors.push("index-short.html should not include globallogic parser bullet (detailed CV only)");
    }
}

const dodo = source.roles.find((role) => role.id === "dodo");
if (dodo?.bullets?.[2] && shortHtml.includes(dodo.bullets[2])) {
    errors.push("index-short.html should omit Drinkit live-tracking bullet (detailed CV only)");
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
