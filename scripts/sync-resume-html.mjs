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

function roleBullets(role, preferShort = false) {
    const bullets =
        preferShort && role.bulletsShort?.length
            ? role.bulletsShort
            : (role.bullets ?? role.bulletsShort ?? []);
    return bullets.map((bullet) => `            <li>${escapeHtml(bullet)}</li>`).join("\n");
}

function projectName(role) {
    if (role.project?.includes("—")) {
        return role.project;
    }
    return role.productDescription?.split(".")[0] ?? role.project ?? "";
}

function projectsDetailBlock(role) {
    if (!role.projectsDetail?.length) {
        return "";
    }
    const items = role.projectsDetail
        .map(
            (project) =>
                `              <li><span class="exp-project-name-inline">${escapeHtml(project.name)}</span> — ${escapeHtml(project.summary)}</li>`,
        )
        .join("\n");
    return `          <div class="exp-projects-block">
            <span class="exp-project-label">Projects</span>
            <ul class="exp-projects-list">
${items}
            </ul>
          </div>`;
}

function experienceItem(role) {
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
          <div class="exp-project"><span class="exp-project-label">Project:</span><span class="exp-project-name">${escapeHtml(projectName(role))}</span></div>
          <p class="exp-role-context">${escapeHtml(context)}</p>
          <ul>
${roleBullets(role)}
          </ul>
          <p class="exp-tech-line">${escapeHtml(techLine)}</p>
        </div>`;
}

function compactExperienceItem(role) {
    const techLine = role.technologiesLine ?? "";
    return `        <div class="experience-item experience-item--compact" id="exp-${role.id}">
          <div class="exp-company-line"><span class="exp-company-name">${escapeHtml(role.company)}</span> <span class="exp-company-loc">${escapeHtml(role.location)}</span></div>
          <div class="exp-role"><span class="exp-role-title">${escapeHtml(role.title)}</span><span class="exp-role-sep">·</span><span class="exp-role-dates">${escapeHtml(role.displayFull)}</span></div>
          <div class="exp-project"><span class="exp-project-label">Project:</span><span class="exp-project-name">${escapeHtml(projectName(role))}</span></div>
${projectsDetailBlock(role)}
          <ul>
${roleBullets(role)}
          </ul>
          <p class="exp-tech-line">${escapeHtml(techLine)}</p>
        </div>`;
}

function experienceItemForRole(role) {
    return role.featured ? experienceItem(role) : compactExperienceItem(role);
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

const experienceTimelineEnd = "        </div>\n      </section>";

const experienceHtml = source.roles.map(experienceItemForRole).join("\n\n");
cvHtml = replaceBetween(
    cvHtml,
    '        <div class="experience-timeline">',
    experienceTimelineEnd,
    `${experienceHtml}\n        `,
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
