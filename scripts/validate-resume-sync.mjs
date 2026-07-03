import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(root, "..");
const sourcePath = path.join(repoRoot, "content", "resume-source.json");
const cvHtmlPath = path.join(repoRoot, "cv.html");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const cvHtml = fs.readFileSync(cvHtmlPath, "utf8");

function decodeHtmlEntities(text) {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function htmlIncludes(html, needle) {
    return decodeHtmlEntities(html).includes(needle);
}

function htmlTextIncludes(html, needle) {
    const text = decodeHtmlEntities(html).replace(/<[^>]+>/g, "");
    return text.includes(needle);
}

const errors = [];

const publicRoleIds = new Set(
    source.roles.filter((role) => role.featured).map((role) => role.id),
);

const omittedFromPublicCv = new Set(
    source.roles.filter((role) => !role.featured).map((role) => role.id),
);

const forbiddenPhrases = [
    "crash-free",
    "host apps (Birmarket",
    "3 host apps",
    "3 production host",
    "contributed to shared marketplace",
    "UIKit modules stable",
    "SPM modules with MVP",
    "Firebase Remote Config experiments",
    "not StoreKit",
    "not ML research",
    "Foundation Models",
];

const surfaces = [
    { name: "resume-source.json", content: fs.readFileSync(sourcePath, "utf8") },
    { name: "cv.html", content: cvHtml },
];

for (const phrase of forbiddenPhrases) {
    for (const surface of surfaces) {
        if (surface.content.includes(phrase)) {
            errors.push(`${surface.name} contains forbidden phrase: ${phrase}`);
        }
    }
}

for (const roleId of omittedFromPublicCv) {
    const role = source.roles.find((item) => item.id === roleId);
    if (role && cvHtml.includes(`id="exp-${roleId}"`)) {
        errors.push(`cv.html should omit non-featured role: ${roleId}`);
    }
}

for (const role of source.roles) {
    if (!publicRoleIds.has(role.id)) {
        continue;
    }
    if (!cvHtml.includes(role.displayFull)) {
        errors.push(`cv.html missing displayFull for ${role.id}: ${role.displayFull}`);
    }
}

if (source.earlyCareerShort && !htmlIncludes(cvHtml, source.earlyCareerShort.slice(0, 40))) {
    errors.push("cv.html missing earlyCareerShort snippet");
}

const summarySnippet = "Senior iOS Engineer with 12+ years building consumer";
if (!htmlIncludes(cvHtml, summarySnippet)) {
    errors.push("cv.html missing public summary snippet");
}

if (source.meta.skillsLine) {
    const skillsSnippet = source.meta.skillsLine.slice(0, Math.min(48, source.meta.skillsLine.length));
    if (!htmlTextIncludes(cvHtml, skillsSnippet)) {
        errors.push(`cv.html missing skillsLine snippet: ${skillsSnippet}`);
    }
}

for (const roleId of publicRoleIds) {
    const matches = cvHtml.match(new RegExp(`id="exp-${roleId}"`, "g"));
    if (!matches || matches.length !== 1) {
        errors.push(
            `cv.html must contain exactly one exp-${roleId} block (found ${matches?.length ?? 0})`,
        );
    }
}

for (const role of source.roles) {
    if (!publicRoleIds.has(role.id)) {
        continue;
    }
    if (!role.technologiesLine) {
        errors.push(`resume-source.json missing technologiesLine for ${role.id}`);
        continue;
    }
    if (!role.bulletsShort || role.bulletsShort.length < 2) {
        errors.push(`resume-source.json needs bulletsShort for public role ${role.id}`);
    }
    const bulletsToCheck = role.bullets?.length > 0 ? role.bullets : role.bulletsShort;
    for (const bullet of bulletsToCheck ?? []) {
        if (!htmlIncludes(cvHtml, bullet)) {
            errors.push(`cv.html missing bullet for ${role.id}`);
            break;
        }
    }
}

if (!cvHtml.includes(source.meta.title)) {
    errors.push(`cv.html missing title: ${source.meta.title}`);
}

if (cvHtml.includes("index-short.html")) {
    errors.push("cv.html still links to removed index-short.html");
}

if (errors.length > 0) {
    console.error("Resume sync validation failed:\n");
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(`OK: ${publicRoleIds.size} public roles synced in cv.html`);
