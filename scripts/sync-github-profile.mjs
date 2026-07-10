#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { presentationGitHubProfilePath, publicProfileRoot } from "../../career/resume/lib/resume-paths.mjs";
import { validatePresentationBoundary } from "../../career/resume/scripts/validate-presentation-boundary.mjs";

function fail(message) {
    console.error(`profile:sync failed: ${message}`);
    process.exit(1);
}

validatePresentationBoundary();

function extractSection(markdown, heading) {
    const start = markdown.indexOf(`## ${heading}\n`);
    if (start < 0) {
        fail(`missing ## ${heading} in github-profile.md`);
    }
    const from = start + `## ${heading}\n`.length;
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

const markdown = fs.readFileSync(presentationGitHubProfilePath, "utf8");
const body = extractSection(markdown, "Body");
const footer = parseFooterLinks(extractSection(markdown, "Footer links"));

if (!body) {
    fail("Body section is empty");
}
if (footer.length < 3) {
    fail("Footer links section is incomplete");
}

const readme = `${body}

<div align="center">
  <p>
    ${footer.map((item) => `<a href="${item.href}">${item.label}</a>`).join(" ·\n    ")}
  </p>
</div>
`;

const outPath = path.join(publicProfileRoot, "README.md");
fs.writeFileSync(outPath, `${readme.trim()}\n`);
console.log(`OK: profile:sync wrote ${outPath}`);
