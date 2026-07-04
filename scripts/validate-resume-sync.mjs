import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(root, "..");
const sourcePath = path.join(repoRoot, "content", "resume-source.json");
const indexHtmlPath = path.join(repoRoot, "index.html");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

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

const publicRoleIds = new Set(source.roles.filter((role) => role.featured).map((role) => role.id));

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
    { name: "index.html", content: indexHtml },
];

for (const phrase of forbiddenPhrases) {
    for (const surface of surfaces) {
        if (surface.content.includes(phrase)) {
            errors.push(`${surface.name} contains forbidden phrase: ${phrase}`);
        }
    }
}

const summarySnippet = source.meta.summary?.slice(0, 60) ?? "";

if (!summarySnippet || !htmlIncludes(indexHtml, summarySnippet)) {
    errors.push("index.html missing public summary snippet");
}

for (const role of source.roles) {
    if (!indexHtml.includes(role.displayFull)) {
        errors.push(`index.html missing displayFull for ${role.id}: ${role.displayFull}`);
    }
}

if (source.meta.skillsLine) {
    const skillsSnippet = source.meta.skillsLine.slice(0, Math.min(48, source.meta.skillsLine.length));
    if (!htmlTextIncludes(indexHtml, skillsSnippet)) {
        errors.push(`index.html missing skillsLine snippet: ${skillsSnippet}`);
    }
}

for (const role of source.roles) {
    const matches = indexHtml.match(new RegExp(`id="exp-${role.id}"`, "g"));
    if (!matches || matches.length !== 1) {
        errors.push(
            `index.html must contain exactly one exp-${role.id} block (found ${matches?.length ?? 0})`,
        );
    }
}

for (const role of source.roles) {
    if (!publicRoleIds.has(role.id)) {
        const bulletsToCheck = role.bullets ?? [];
        for (const bullet of bulletsToCheck) {
            if (!htmlIncludes(indexHtml, bullet)) {
                errors.push(`index.html missing bullet for ${role.id}`);
                break;
            }
        }
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
        if (!htmlIncludes(indexHtml, bullet)) {
            errors.push(`index.html missing bullet for ${role.id}`);
            break;
        }
    }
}

if (!indexHtml.includes(source.meta.title)) {
    errors.push(`index.html missing title: ${source.meta.title}`);
}

if (indexHtml.includes("index-short.html")) {
    errors.push("index.html still links to removed index-short.html");
}

if (indexHtml.includes("landing-about")) {
    errors.push("index.html still contains landing-about section");
}

if (errors.length > 0) {
    console.error("Resume sync validation failed:\n");
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(`OK: ${source.roles.length} roles synced in index.html`);
