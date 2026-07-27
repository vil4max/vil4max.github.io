#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { presentationGitHubProfilePath } from "../../career/resume/lib/resume-paths.mjs";
import { validatePresentationBoundary } from "../../career/resume/scripts/validate-presentation-boundary.mjs";

const PROFILE_LINKS_PLACEHOLDER = "{{PROFILE_LINKS}}";
const publicProfileRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "vil4max");

function fail(message) {
    console.error(`profile:sync failed: ${message}`);
    process.exit(1);
}

validatePresentationBoundary();

function extractSection(markdown, heading, { untilHeading } = {}) {
    const start = markdown.indexOf(`## ${heading}\n`);
    if (start < 0) {
        fail(`missing ## ${heading} in github-profile.md`);
    }
    const from = start + `## ${heading}\n`.length;
    if (untilHeading) {
        const endMarker = `\n## ${untilHeading}\n`;
        const end = markdown.indexOf(endMarker, from);
        if (end < 0) {
            fail(`missing ## ${untilHeading} after ## ${heading} in github-profile.md`);
        }
        return markdown.slice(from, end).trim();
    }
    const next = markdown.slice(from).search(/\n## /);
    return (next < 0 ? markdown.slice(from) : markdown.slice(from, from + next)).trim();
}

function parseFooterLinks(section) {
    return section
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => {
            const body = line.slice(2).trim();
            const colon = body.indexOf(":");
            return {
                label: body.slice(0, colon).trim(),
                href: body.slice(colon + 1).trim(),
            };
        });
}

function renderProfileLinks(footer) {
    return `<div align="center">
  <p>
    ${footer.map((item) => `<a href="${item.href}">${item.label}</a>`).join(" ·\n    ")}
  </p>
</div>`;
}

const markdown = fs.readFileSync(presentationGitHubProfilePath, "utf8");
const body = extractSection(markdown, "Body", { untilHeading: "Footer links" });
const footer = parseFooterLinks(extractSection(markdown, "Footer links"));

if (!body) {
    fail("Body section is empty");
}
if (footer.length < 3) {
    fail("Footer links section is incomplete");
}
if (!body.includes(PROFILE_LINKS_PLACEHOLDER)) {
    fail(`Body must include ${PROFILE_LINKS_PLACEHOLDER} for contact links`);
}

const readme = body.replaceAll(PROFILE_LINKS_PLACEHOLDER, renderProfileLinks(footer));

const outPath = path.join(publicProfileRoot, "README.md");
fs.writeFileSync(outPath, `${readme.trim()}\n`);
console.log(`OK: profile:sync wrote ${outPath}`);
