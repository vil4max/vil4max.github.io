#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertNoPrivateContactData } from "../../career/resume/lib/resume-md-lib.mjs";
import { PDF_CANONICAL_FILENAME } from "./resume-pdf-paths.mjs";
import { resumeSourceJsonPath } from "./resume-paths.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(root, "..");
const sourcePath = resumeSourceJsonPath;
const autofillHtmlPath = path.join(repoRoot, "profile-autofill.html");
const indexHtmlPath = path.join(repoRoot, "index.html");
const projectsHtmlPath = path.join(repoRoot, "projects.html");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const autofillHtml = fs.readFileSync(autofillHtmlPath, "utf8");
const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const projectsHtml = fs.readFileSync(projectsHtmlPath, "utf8");

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
    "AI-assisted engineering",
    "agentic tooling",
    "AI — Cursor",
    "Cursor · Copilot",
    "App Intents",
    "AppIntents",
    "fillForms",
    "mentored a junior",
    "team lead",
    "people manager",
    "engineering manager",
    "led the team",
    "led the iOS team",
    "three-person iOS team",
    "three person iOS team",
    "technical degree",
    "engineering degree",
    "Computer Science degree",
    "independent company",
];

const leadershipWordPattern = /\b[Ll]ed\b/;

const surfaces = [
    { name: "resume-source.json", content: fs.readFileSync(sourcePath, "utf8") },
    { name: "profile-autofill.html", content: autofillHtml },
    { name: "index.html", content: indexHtml },
    { name: "projects.html", content: projectsHtml },
];

for (const surface of surfaces) {
    errors.push(...assertNoPrivateContactData(surface.name, surface.content));
}

if (source.employments) {
    errors.push("resume-source.json must not include employments (canonical facts stay in career.md)");
}

if (source.roles?.some((role) => role.engagements)) {
    errors.push("resume-source.json roles must not include engagements (canonical facts stay in career.md)");
}

if (source.contacts?.phone || source.contacts?.phonePublic !== undefined) {
    errors.push("resume-source.json must not include contacts.phone or contacts.phonePublic");
}

if (source.meta?.apply) {
    errors.push("resume-source.json must not include meta.apply");
}

if (String(source.meta?.languagesLine ?? "").includes("Spoken baseline")) {
    errors.push("resume-source.json languagesLine must be the public ATS label only");
}

for (const phrase of forbiddenPhrases) {
    for (const surface of surfaces) {
        if (surface.name === "resume-source.json") {
            continue;
        }
        if (phrase === "App Intents" && /not Apple App Intents/.test(surface.content)) {
            const withoutNegation = surface.content.replace(/not Apple App Intents/g, "");
            if (withoutNegation.includes(phrase)) {
                errors.push(`${surface.name} contains forbidden phrase: ${phrase}`);
            }
            continue;
        }
        if (surface.content.includes(phrase)) {
            errors.push(`${surface.name} contains forbidden phrase: ${phrase}`);
        }
    }
}

for (const surface of surfaces) {
    if (surface.name === "projects.html" || surface.name === "index.html" || surface.name === "resume-source.json") {
        continue;
    }
    const text = decodeHtmlEntities(surface.content).replace(/<[^>]+>/g, " ");
    if (leadershipWordPattern.test(text)) {
        errors.push(`${surface.name} contains forbidden word: led`);
    }
}

const summarySnippet = source.meta.summary?.slice(0, 60) ?? "";
if (!summarySnippet || !htmlIncludes(autofillHtml, summarySnippet)) {
    errors.push("profile-autofill.html missing public summary snippet");
}

for (const role of source.roles) {
    if (!autofillHtml.includes(role.displayFull)) {
        errors.push(`profile-autofill.html missing displayFull for ${role.id}: ${role.displayFull}`);
    }
}

if (source.meta.skillsGroups?.length) {
    const firstGroup = source.meta.skillsGroups[0];
    const skillsSnippet = firstGroup.line.slice(0, Math.min(32, firstGroup.line.length));
    if (!htmlTextIncludes(autofillHtml, skillsSnippet)) {
        errors.push(`profile-autofill.html missing skillsGroups snippet: ${skillsSnippet}`);
    }
}

for (const role of source.roles) {
    const matches = autofillHtml.match(new RegExp(`id="exp-${role.id}"`, "g"));
    if (!matches || matches.length !== 1) {
        errors.push(
            `profile-autofill.html must contain exactly one exp-${role.id} block (found ${matches?.length ?? 0})`,
        );
    }
}

if (!autofillHtml.includes('id="exp-dodo"')) {
    errors.push("profile-autofill.html missing backward-compatible #exp-dodo anchor");
}

for (const role of source.roles) {
    if (!publicRoleIds.has(role.id)) {
        continue;
    }
    if (!role.technologiesLine) {
        errors.push(`resume-source.json missing technologiesLine for ${role.id}`);
    }
    if (!role.bulletsShort || role.bulletsShort.length < 2) {
        errors.push(`resume-source.json needs bulletsShort for public role ${role.id}`);
    }
    const bulletsToCheck = role.bulletsShort?.length > 0 ? role.bulletsShort : (role.bullets ?? []);
    for (const bullet of bulletsToCheck) {
        if (!htmlIncludes(autofillHtml, bullet)) {
            errors.push(`profile-autofill.html missing bullet for ${role.id}`);
            break;
        }
    }
}

if (!indexHtml.includes(PDF_CANONICAL_FILENAME) || !indexHtml.includes("Download CV")) {
    errors.push(`index.html missing primary CV download (${PDF_CANONICAL_FILENAME})`);
}

if (!projectsHtml.includes(PDF_CANONICAL_FILENAME) || !projectsHtml.includes("Download CV")) {
    errors.push(`projects.html missing primary CV download (${PDF_CANONICAL_FILENAME})`);
}

if (indexHtml.includes("Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf") || indexHtml.includes("View detailed experience")) {
    errors.push("index.html still links Detailed/autofill PDF as a public peer CTA");
}

if (
    projectsHtml.includes("Max_Vilchevskiy_Senior_iOS_Engineer_Detailed.pdf") ||
    projectsHtml.includes("View detailed experience")
) {
    errors.push("projects.html still links Detailed/autofill PDF as a public peer CTA");
}

if (indexHtml.includes("Vilchevskiy_iOS_Engineer")) {
    errors.push("index.html contains stale Vilchevskiy_iOS_Engineer PDF filename");
}

const autofillText = decodeHtmlEntities(autofillHtml).replace(/<[^>]+>/g, " ");
const detailedRequired = [
    "Worked commercially with RxSwift",
    "command-driven watchOS flows",
    "structured client commands",
];
for (const snippet of detailedRequired) {
    if (!autofillText.includes(snippet)) {
        errors.push(`profile-autofill.html missing autofill required snippet: ${snippet}`);
    }
}
if (autofillText.includes("fillForms")) {
    errors.push("profile-autofill.html exposes internal fillForms command name");
}

if (errors.length > 0) {
    console.error("Resume sync validation failed:\n");
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log("OK: resume sync validation passed (autofill HTML; index.html not CV-synced)");
