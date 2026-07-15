#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { presentationProjectsPath } from "../../career/resume/lib/resume-paths.mjs";
import { validatePresentationBoundary } from "../../career/resume/scripts/validate-presentation-boundary.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsPath = path.join(root, "projects.html");

function fail(message) {
    console.error(`projects:sync failed: ${message}`);
    process.exit(1);
}

validatePresentationBoundary();

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function inlineMarkdownToHtml(text) {
    const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let result = "";
    let lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        result += escapeHtml(text.slice(lastIndex, match.index));
        result += `<a href="${escapeHtml(match[2])}">${escapeHtml(match[1])}</a>`;
        lastIndex = match.index + match[0].length;
    }
    result += escapeHtml(text.slice(lastIndex));
    return result;
}

function parseProjectSections(markdown) {
    const lines = markdown.split("\n");
    const projects = [];
    let current = null;
    for (const line of lines) {
        const match = line.match(/^## (project-.+)$/);
        if (match) {
            if (current) {
                projects.push(current);
            }
            current = { id: match[1], body: [] };
            continue;
        }
        if (current) {
            current.body.push(line);
        }
    }
    if (current) {
        projects.push(current);
    }
    return projects.map((project) => ({
        id: project.id,
        markdown: project.body.join("\n").trim(),
    }));
}

function markdownSectionToHtml(markdown) {
    const lines = markdown.split("\n");
    const html = [];
    let inList = false;
    let paragraphIndex = 0;
    const closeList = () => {
        if (inList) {
            html.push("            </ul>");
            inList = false;
        }
    };
    for (const raw of lines) {
        const line = raw.trimEnd();
        if (!line.trim()) {
            closeList();
            continue;
        }
        if (line.startsWith("### ")) {
            closeList();
            html.push(`            <h3 class="case-title">${escapeHtml(line.slice(4).trim())}</h3>`);
            paragraphIndex = 0;
            continue;
        }
        if (line.startsWith("- ")) {
            if (!inList) {
                html.push('            <ul class="case-signals">');
                inList = true;
            }
            html.push(`              <li>${escapeHtml(line.slice(2).trim())}</li>`);
            continue;
        }
        if (line.startsWith("**Stack:**")) {
            closeList();
            html.push(
                `            <p class="case-stack">${escapeHtml(line.replace(/^\*\*Stack:\*\*\s*/, ""))}</p>`,
            );
            continue;
        }
        closeList();
        paragraphIndex += 1;
        const className = paragraphIndex === 1 ? "case-era" : "case-narrative";
        html.push(`            <p class="${className}">${inlineMarkdownToHtml(line.trim())}</p>`);
    }
    closeList();
    return html.join("\n");
}

function assertContentMarker(html, id) {
    const startToken = `<!-- PROJECT:${id}:CONTENT:START -->`;
    const endToken = `<!-- PROJECT:${id}:CONTENT:END -->`;
    const starts = html.split(startToken).length - 1;
    const ends = html.split(endToken).length - 1;
    if (starts !== 1 || ends !== 1) {
        fail(`marker PROJECT:${id}:CONTENT must appear exactly once as a pair (starts=${starts}, ends=${ends})`);
    }
    const start = html.indexOf(startToken);
    const end = html.indexOf(endToken);
    if (end < start) {
        fail(`marker PROJECT:${id}:CONTENT end precedes start`);
    }
    return { startToken, endToken, start, end };
}

function replaceContent(html, id, inner) {
    const { startToken, endToken, start, end } = assertContentMarker(html, id);
    return `${html.slice(0, start + startToken.length)}\n${inner}\n          ${html.slice(end)}`;
}

const markdown = fs.readFileSync(presentationProjectsPath, "utf8");
let html = fs.readFileSync(projectsPath, "utf8");
const projects = parseProjectSections(markdown);

if (projects.length === 0) {
    fail("no ## project-* sections found in projects.md");
}

for (const project of projects) {
    const fragment = markdownSectionToHtml(project.markdown);
    html = replaceContent(html, project.id, fragment);
}

fs.writeFileSync(projectsPath, html);
console.log(`OK: projects:sync wrote ${projects.length} PROJECT:*:CONTENT region(s)`);
