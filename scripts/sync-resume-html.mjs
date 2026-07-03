#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "./resume-md-lib.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "content", "resume-source.json");
const cvPath = path.join(root, "cv.html");
const indexPath = path.join(root, "index.html");

const source = readJson(sourcePath);

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function aboutParagraphs(summary) {
    return summary
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => `          <p>${escapeHtml(part)}</p>`)
        .join("\n");
}

function summaryParagraphs(summary) {
    return aboutParagraphs(summary)
        .replace(/^          /gm, "        ")
        .replace(/<p>/g, '<p class="cv-summary">');
}

function skillsLineHtml(skillsLine) {
    return `          <p class="skills-ats skills-line">${escapeHtml(skillsLine)}</p>`;
}

function roleBullets(role) {
    const bullets = role.bullets ?? role.bulletsShort ?? [];
    return bullets
        .map((bullet) => `            <li>${escapeHtml(bullet)}</li>`)
        .join("\n");
}

function experienceItem(role) {
    const projectName = role.project?.includes("—")
        ? role.project
        : role.productDescription?.split(".")[0] ?? role.project ?? "";
    const context = role.myRole ?? "";
    const techLine = role.technologiesLine ?? "";
    return `        <div class="experience-item experience-item--highlight" id="exp-${role.id}">
          <div class="exp-role-head">
            <span class="exp-company-name">${escapeHtml(role.company)}</span>
            <span class="exp-role-sep">·</span>
            <span class="exp-role-title">${escapeHtml(role.title)}</span>
            <span class="exp-role-sep">·</span>
            <span class="exp-role-dates">${escapeHtml(role.displayFull)}</span>
          </div>
          <div class="exp-company-loc-line">${escapeHtml(role.location)}</div>
          <div class="exp-project"><span class="exp-project-label">Project:</span><span class="exp-project-name">${escapeHtml(projectName)}</span></div>
          <p class="exp-role-context">${escapeHtml(context)}</p>
          <ul>
${roleBullets(role)}
          </ul>
          <p class="exp-tech-line">${escapeHtml(techLine)}</p>
        </div>`;
}

function featuredRoles(roles) {
    return roles.filter((role) => role.featured);
}

function replaceSectionContent(html, sectionClass, innerHtml) {
    const openTag = `<section class="${sectionClass}">`;
    const start = html.indexOf(openTag);
    if (start === -1) {
        throw new Error(`Section not found: ${sectionClass}`);
    }
    const contentStart = start + openTag.length;
    const end = html.indexOf("</section>", contentStart);
    if (end === -1) {
        throw new Error(`Section close not found: ${sectionClass}`);
    }
    return html.slice(0, contentStart) + `\n${innerHtml}\n      ` + html.slice(end);
}

function replaceBetween(html, startMarker, endMarker, replacement) {
    const start = html.indexOf(startMarker);
    const end = html.indexOf(endMarker, start + startMarker.length);
    if (start === -1 || end === -1) {
        throw new Error(`Markers not found: ${startMarker}`);
    }
    return html.slice(0, start + startMarker.length) + "\n" + replacement + "\n" + html.slice(end);
}

let cvHtml = fs.readFileSync(cvPath, "utf8");

cvHtml = replaceBetween(
    cvHtml,
    '        <div class="skills-inline">',
    "        </div>",
    skillsLineHtml(source.meta.skillsLine ?? ""),
);

cvHtml = replaceSectionContent(
    cvHtml,
    "cv-section-summary",
    `        <h3><span class="section-heading-text">Summary</span><span class="section-mark" aria-hidden="true">📋</span></h3>
${summaryParagraphs(source.meta.summary ?? "")}`,
);

const experienceTimelineEnd =
    '        </div>\n        <p class="exp-meta exp-early-career">';

const experienceHtml = featuredRoles(source.roles).map(experienceItem).join("\n\n");
cvHtml = replaceBetween(
    cvHtml,
    '        <div class="experience-timeline">',
    experienceTimelineEnd,
    experienceHtml,
);

cvHtml = cvHtml.replace(
    /<p class="exp-meta exp-early-career">Early career footer placeholder\.<\/p>/,
    `<p class="exp-meta exp-early-career">${escapeHtml(source.earlyCareerShort?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") ?? "")}</p>`,
);

fs.writeFileSync(cvPath, cvHtml);

let indexHtml = fs.readFileSync(indexPath, "utf8");
const aboutHtml = aboutParagraphs(source.meta.summary ?? "");
const highlightsHtml = (source.highlights ?? [])
    .map((item) => `            <li>${escapeHtml(item)}</li>`)
    .join("\n");

indexHtml = replaceBetween(
    indexHtml,
    '        <div class="landing-about">',
    '          <ul class="landing-highlights">',
    `${aboutHtml}
          <ul class="landing-highlights">`,
);

indexHtml = indexHtml.replace(
    /(<div class="landing-about">[\s\S]*?)<ul class="landing-highlights">[\s\S]*?<\/ul>/,
    `$1<ul class="landing-highlights">\n${highlightsHtml}\n          </ul>`,
);

fs.writeFileSync(indexPath, indexHtml);
console.log(`Synced ${cvPath} and ${indexPath} from resume-source.json`);
