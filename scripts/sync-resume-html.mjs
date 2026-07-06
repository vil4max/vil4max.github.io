#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson } from "./resume-md-lib.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "content", "resume-source.json");
const indexPath = path.join(root, "index.html");

const source = readJson(sourcePath);

const ROLE_MEDIA = {
    globallogic: { projectAnchor: "project-watch-ai-assistant" },
    pasha: {
        projectAnchor: "project-birmarket",
        thumbs: [
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/85/61/cc/8561ccb3-d030-fcc7-4e44-35cd30aaa471/App_Store__1284__U0445_2778_1.1.png/600x1300bb.webp",
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/01/7f/6f/017f6f52-d85f-4125-8aa4-ae7858c65a17/App_Store__1284__U0445_2778_1.1-3.png/600x1300bb.webp",
        ],
    },
    dodo: {
        projectAnchor: "project-drinkit",
        thumbs: [
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a4/ba/7b/a4ba7b1e-8b4e-51db-0910-975cac31622f/01.png/600x1300bb.webp",
            "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/7d/9c/b9/7d9cb999-b39c-7a9d-0a44-fb632410784b/02.png/600x1300bb.webp",
        ],
    },
    solvve: {
        projectAnchor: "project-playhera",
        thumbs: [
            "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/09/75/8d/09758de1-772a-dd1a-bb2f-112a83ab832b/11594ffd-5a8a-4988-8449-76a21e3a1122_screen1.png/392x696bb.png",
            "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/3e/83/f2/3e83f2f4-b664-3d58-5ff0-a87b5f4c3408/5dd85cd3-c4c8-49fb-b8e5-2248471a9871_screen2.png/392x696bb.png",
        ],
    },
    gbksoft: {
        projectAnchor: "project-eastern-union",
        thumbs: [
            "https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/85/79/37/85793713-7c9e-ddfb-3587-aa43cb03d6a6/pr_source.png/392x696bb.png",
            "https://is1-ssl.mzstatic.com/image/thumb/Purple123/v4/3e/4a/c3/3e4ac327-c07f-ac14-4a36-bf03b193ef98/pr_source.png/392x696bb.png",
        ],
    },
};

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function summaryParagraphs(summary) {
    return summary
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => `        <p class="cv-summary">${escapeHtml(part)}</p>`)
        .join("\n");
}

function skillsLineHtml(skillsLine) {
    return `          <p class="skills-ats skills-line">${escapeHtml(skillsLine)}</p>`;
}

function skillsGroupsHtml(skillsGroups, skillsLineShort, skillsLine) {
    if (skillsGroups?.length) {
        const lines = skillsGroups.map(
            (group) =>
                `          <p class="skills-ats"><strong>${escapeHtml(group.label)}:</strong> ${escapeHtml(group.line)}</p>`,
        );
        return `        <div class="skills-grouped">\n${lines.join("\n")}\n        </div>`;
    }
    if (skillsLineShort) {
        const lines = skillsLineShort
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const dash = line.indexOf(" — ");
                if (dash === -1) {
                    return `          <p class="skills-ats">${escapeHtml(line)}</p>`;
                }
                const label = line.slice(0, dash).trim();
                const value = line.slice(dash + 3).trim();
                return `          <p class="skills-ats"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
            });
        return `        <div class="skills-grouped">\n${lines.join("\n")}\n        </div>`;
    }
    return `        <div class="skills-inline">\n${skillsLineHtml(skillsLine ?? "")}\n        </div>`;
}

function languagesLineHtml(languagesLine) {
    const match = languagesLine?.match(/^(.+?)\s*—\s*(.+)$/);
    if (!match) {
        return "";
    }
    return `        <p class="cv-languages-line"><strong>${escapeHtml(match[1].trim())}</strong> — ${escapeHtml(match[2].trim())}</p>`;
}

function roleBullets(role) {
    const bullets = role.bulletsShort?.length ? role.bulletsShort : (role.bullets ?? []);
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

function detailsLink(roleId) {
    const media = ROLE_MEDIA[roleId];
    if (!media?.projectAnchor) {
        return "";
    }
    return `          <p class="exp-meta cv-print-omit"><a href="projects.html#${media.projectAnchor}">Details →</a></p>`;
}

function experienceThumbs(roleId) {
    const media = ROLE_MEDIA[roleId];
    if (!media?.thumbs?.length) {
        return "";
    }
    const images = media.thumbs
        .map(
            (url, index) =>
                `            <img src="${escapeHtml(url)}" alt="${escapeHtml(roleId)} project screenshot ${index + 1}" loading="lazy">`,
        )
        .join("\n");
    return `          <div class="experience-thumbs cv-print-omit" aria-label="Project screenshots">
${images}
          </div>`;
}

function experienceItem(role) {
    const context = role.myRole ?? "";
    const techLine = role.technologiesLine ?? "";
    return `        <div class="experience-item experience-item--highlight experience-item--portfolio" id="exp-${role.id}">
          <div class="experience-item-body">
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
${detailsLink(role.id)}
          </div>
${experienceThumbs(role.id)}
        </div>`;
}

function compactExperienceItem(role) {
    const techLine = role.technologiesLine ?? "";
    return `        <div class="experience-item experience-item--compact experience-item--portfolio" id="exp-${role.id}">
          <div class="experience-item-body">
          <div class="exp-role-head">
            <span class="exp-company-name">${escapeHtml(role.company)}</span>
            <span class="exp-role-sep">·</span>
            <span class="exp-role-title">${escapeHtml(role.title)}</span>
            <span class="exp-role-sep">·</span>
            <span class="exp-role-dates">${escapeHtml(role.displayFull)}</span>
          </div>
          <div class="exp-company-loc-line">${escapeHtml(role.location)}</div>
          <div class="exp-project"><span class="exp-project-label">Project:</span><span class="exp-project-name">${escapeHtml(projectName(role))}</span></div>
${projectsDetailBlock(role)}
          <ul>
${roleBullets(role)}
          </ul>
          <p class="exp-tech-line">${escapeHtml(techLine)}</p>
${detailsLink(role.id)}
          </div>
${experienceThumbs(role.id)}
        </div>`;
}

function experienceItemForRole(role) {
    return role.featured ? experienceItem(role) : compactExperienceItem(role);
}

function educationHtml(educationEntries) {
    const entry = educationEntries?.[0];
    if (!entry) {
        return "";
    }
    const line = entry.displayFull ?? `${entry.institution} — ${entry.degree}, ${entry.field}`;
    return `        <h3><span class="section-heading-text">Education</span><span class="section-mark cv-print-omit" aria-hidden="true">🎓</span></h3>
        <p class="education-line">${escapeHtml(line)}</p>`;
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

let indexHtml = fs.readFileSync(indexPath, "utf8");

indexHtml = replaceSectionContent(
    indexHtml,
    "cv-section-skills",
    `        <h3><span class="section-heading-text">Skills</span><span class="section-mark cv-print-omit" aria-hidden="true">🛠</span></h3>
${skillsGroupsHtml(source.meta.skillsGroups, source.meta.skillsLineShort, source.meta.skillsLine)}
${languagesLineHtml(source.meta.languagesLine ?? "")}`,
);

indexHtml = replaceSectionContent(
    indexHtml,
    "cv-section-summary",
    `        <h3><span class="section-heading-text">Professional Summary</span><span class="section-mark cv-print-omit" aria-hidden="true">📋</span></h3>
${summaryParagraphs(source.meta.summary ?? "")}`,
);

const experienceSectionInner = `        <h3><span class="section-heading-text">Work Experience</span><span class="section-mark cv-print-omit" aria-hidden="true">💼</span></h3>
        <p class="exp-meta cv-print-omit portfolio-section-lead">Newest first · <a href="projects.html">All projects</a></p>
        <div class="experience-timeline experience-timeline--portfolio">
${source.roles.map(experienceItemForRole).join("\n\n")}
        </div>`;

indexHtml = replaceSectionContent(indexHtml, "cv-section-experience", experienceSectionInner);

if (indexHtml.includes("cv-section-education")) {
    indexHtml = replaceSectionContent(indexHtml, "cv-section-education", educationHtml(source.education));
}

fs.writeFileSync(indexPath, indexHtml);
console.log(`Synced ${indexPath} from resume-source.json`);
