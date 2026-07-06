#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "./resume-md-lib.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "content", "resume-source.json");
const outputPath = path.join(root, "resume-one-page.html");

const source = readJson(sourcePath);
const onePage = source.onePage;

if (!onePage?.summary || !onePage.roleIds?.length) {
    throw new Error("resume-source.json missing onePage summary or roleIds");
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function skillsGroupsHtml(skillsGroups) {
    const lines = skillsGroups.map(
        (group) =>
            `          <p class="skills-ats"><strong>${escapeHtml(group.label)}:</strong> ${escapeHtml(group.line)}</p>`,
    );
    return `        <div class="skills-grouped">\n${lines.join("\n")}\n        </div>`;
}

function languagesLineHtml(languagesLine) {
    const languageMatch = languagesLine?.match(/^(.+?)\s*—\s*(.+)$/);
    if (!languageMatch) {
        return "";
    }
    return `        <p class="cv-languages-line"><strong>${escapeHtml(languageMatch[1].trim())}</strong> — ${escapeHtml(languageMatch[2].trim())}</p>`;
}

function educationSectionHtml(educationLine) {
    if (!educationLine?.trim()) {
        return "";
    }
    return `      <section class="cv-section-education">
        <h3><span class="section-heading-text">Education</span></h3>
        <p class="cv-education-body">${escapeHtml(educationLine)}</p>
      </section>`;
}

function onePageProjectName(role) {
    if (role.onePageProject) {
        return role.onePageProject;
    }
    const project = role.project ?? "";
    const primary = project.split(" · ")[0]?.trim();
    return primary || role.productDescription?.split(".")[0]?.trim() || "";
}

function onePageCompanyLabel(role) {
    return role.onePageCompany ?? role.company;
}

function techTailHtml(techLine) {
    if (!techLine?.trim()) {
        return "";
    }
    return `          <p class="exp-tech-tail">${escapeHtml(techLine)}</p>`;
}

function experienceItemHtml(role) {
    const bullets = role.bulletsOnePage?.length ? role.bulletsOnePage : (role.bulletsShort ?? role.bullets ?? []);
    const techLine = role.technologiesOnePageLine ?? "";
    const bulletHtml = bullets.map((bullet) => `            <li>${escapeHtml(bullet)}</li>`).join("\n");
    return `        <div class="experience-item experience-item--one-page">
          <div class="exp-role-head-one-page">
            <span class="exp-role-title">${escapeHtml(role.title)}</span>
            <span class="exp-role-sep"> · </span>
            <span class="exp-company-name">${escapeHtml(onePageCompanyLabel(role))}</span>
          </div>
          <p class="exp-meta-line">${escapeHtml(role.displayFull)} · ${escapeHtml(role.location)}</p>
          <p class="exp-project-name">${escapeHtml(onePageProjectName(role))}</p>
          <ul>
${bulletHtml}
          </ul>
${techTailHtml(techLine)}
        </div>`;
}

function earlierExperienceHtml(earlier) {
    if (!earlier?.heading) {
        return "";
    }
    if (earlier.body) {
        return `        <div class="experience-item experience-item--one-page experience-item--earlier">
          <p class="exp-earlier-heading">${escapeHtml(earlier.heading)}</p>
          <p class="exp-earlier-body">${escapeHtml(earlier.body)}</p>
        </div>`;
    }
    const bullets = (earlier.bullets ?? [])
        .map((bullet) => `            <li>${escapeHtml(bullet)}</li>`)
        .join("\n");
    const techLine = earlier.tech ? techTailHtml(earlier.tech) : "";
    return `        <div class="experience-item experience-item--one-page experience-item--earlier">
          <p class="exp-earlier-heading">${escapeHtml(earlier.heading)}</p>
          <p class="exp-earlier-lead">${escapeHtml(earlier.lead)}</p>
          <ul>
${bullets}
          </ul>
${techLine}
        </div>`;
}

const roleById = new Map(source.roles.map((role) => [role.id, role]));
const experienceRoles = onePage.roleIds.map((id) => {
    const role = roleById.get(id);
    if (!role) {
        throw new Error(`onePage role id not found: ${id}`);
    }
    if (!role.bulletsOnePage?.length) {
        throw new Error(`role ${id} missing bulletsOnePage`);
    }
    return role;
});

const locationLine = onePage.locationLine || `${source.meta.location} · Remote`;
const contactsPrint = `${source.contacts.email} · linkedin.com/in/vil4max · github.com/vil4max · vil4max.github.io · @vil4max`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Max Vilchevskiy — Senior iOS Engineer (1-page resume)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="resume.css?v=20260709">
  <link rel="stylesheet" href="resume-one-page-pdf.css?v=20260709" media="print">
</head>
<body class="cv-page cv-one-page">
  <div class="page">
    <header class="cv-one-page-header">
      <h1>${escapeHtml(source.meta.name)}</h1>
      <p class="header-location">${escapeHtml(locationLine)}</p>
      <h2 class="header-role">${escapeHtml(source.meta.title)}</h2>
      <p class="header-meta-contacts">${escapeHtml(contactsPrint)}</p>
    </header>

    <main>
      <section class="cv-section-summary">
        <h3><span class="section-heading-text">Summary</span></h3>
        <p class="cv-summary">${escapeHtml(onePage.summary)}</p>
      </section>

      <section class="cv-section-skills">
        <h3><span class="section-heading-text">Skills</span></h3>
${skillsGroupsHtml(onePage.skillsGroups)}
${languagesLineHtml(source.meta.languagesLine ?? "")}
      </section>

${educationSectionHtml(onePage.educationLine ?? "")}

      <section class="cv-section-experience">
        <h3><span class="section-heading-text">Experience</span></h3>
        <div class="experience-timeline experience-timeline--one-page">
${experienceRoles.map(experienceItemHtml).join("\n\n")}
${earlierExperienceHtml(onePage.earlierExperience)}
        </div>
      </section>
    </main>
  </div>
</body>
</html>
`;

fs.writeFileSync(outputPath, html);
console.log(`Synced ${outputPath} from resume-source.json`);
