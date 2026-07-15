#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { presentationPortfolioPath } from "../../career/resume/lib/resume-paths.mjs";
import { validatePresentationBoundary } from "../../career/resume/scripts/validate-presentation-boundary.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "index.html");

function fail(message) {
    console.error(`portfolio:sync failed: ${message}`);
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

function extractSection(markdown, heading) {
    const start = markdown.indexOf(`## ${heading}\n`);
    if (start < 0) {
        fail(`missing ## ${heading} in portfolio.md`);
    }
    const from = start + `## ${heading}\n`.length;
    const next = markdown.slice(from).search(/\n## /);
    return (next < 0 ? markdown.slice(from) : markdown.slice(from, from + next)).trim();
}

function extractSubsections(sectionBody, level) {
    const prefix = "#".repeat(level) + " ";
    const lines = sectionBody.split("\n");
    const sections = [];
    let current = null;
    for (const line of lines) {
        if (line.startsWith(prefix) && !line.startsWith("#".repeat(level + 1))) {
            if (current) {
                sections.push(current);
            }
            current = { heading: line.slice(prefix.length).trim(), body: [] };
            continue;
        }
        if (current) {
            current.body.push(line);
        }
    }
    if (current) {
        sections.push(current);
    }
    return sections.map((item) => ({ heading: item.heading, body: item.body.join("\n").trim() }));
}

function fieldMap(body, level = 4) {
    const map = new Map();
    for (const sub of extractSubsections(body, level)) {
        map.set(sub.heading, sub.body);
    }
    return map;
}

function parseLinkLine(line) {
    const parts = line.replace(/^- /, "").split("|").map((part) => part.trim());
    if (parts.length >= 2) {
        return { label: parts[0], href: parts[1] };
    }
    return { label: parts[0], href: "#" };
}

function assertMarkers(html, name) {
    const startToken = `<!-- PORTFOLIO:${name}:START -->`;
    const endToken = `<!-- PORTFOLIO:${name}:END -->`;
    const starts = html.split(startToken).length - 1;
    const ends = html.split(endToken).length - 1;
    if (starts !== 1 || ends !== 1) {
        fail(`marker PORTFOLIO:${name} must appear exactly once as a pair (starts=${starts}, ends=${ends})`);
    }
    const start = html.indexOf(startToken);
    const end = html.indexOf(endToken);
    if (end < start) {
        fail(`marker PORTFOLIO:${name} end precedes start`);
    }
}

function replaceMarkedRegion(html, name, inner) {
    assertMarkers(html, name);
    const startToken = `<!-- PORTFOLIO:${name}:START -->`;
    const endToken = `<!-- PORTFOLIO:${name}:END -->`;
    const start = html.indexOf(startToken);
    const end = html.indexOf(endToken);
    return `${html.slice(0, start + startToken.length)}\n${inner}\n      ${html.slice(end)}`;
}

function renderHero(section) {
    const fields = fieldMap(section, 3);
    const actions = (fields.get("Actions") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map(parseLinkLine);
    const contact = fields.get("Contact") || "";
    const signal = (fields.get("Signal") || "").trim();
    const aboutParagraphs = (fields.get("About") || "")
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean);
    return `        <section class="cover-hero" aria-labelledby="cover-name">
          <div class="cover-hero__layout">
            <img class="cover-hero__avatar" src="https://raw.githubusercontent.com/vil4max/vil4max/main/assets/profile.png" alt="Portrait of Max Vilchevskiy">
            <div class="cover-hero__copy">
              <h1 id="cover-name">${escapeHtml(fields.get("Name") || "")}</h1>
              <p class="cover-role">${escapeHtml(fields.get("Role") || "")}</p>
              <p class="cover-hero__signal">${escapeHtml(signal)}</p>
${aboutParagraphs.map((p) => `              <p class="cover-about">${escapeHtml(p)}</p>`).join("\n")}
              <div class="cover-actions">
${actions
    .map(
        (action) =>
            `                <a class="cover-action${action.label === "Download CV" ? " cover-action--primary" : ""}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`,
    )
    .join("\n")}
              </div>
              <p class="cover-contact">${escapeHtml(contact)}</p>
            </div>
          </div>
        </section>`;
}

function renderTimeline(section) {
    // Chip roadmap retired: experience is a vertical LinkedIn-style stack in MILESTONES.
    void section;
    return "";
}

function renderMilestone(id, body) {
    const fields = fieldMap(body);
    const company = (fields.get("Company") || "").trim();
    const role = (fields.get("Role") || "").trim();
    const dates = (fields.get("Dates") || "").trim();
    const product = (fields.get("Product") || "").trim();
    const opening = (fields.get("Opening") || "").trim();
    const story = (fields.get("Story") || "").trim();
    const project = (fields.get("Project") || "").trim();
    const signals = (fields.get("Signals") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2).trim());
    const legacyLabel = (fields.get("Label") || "").trim();
    const title = company || legacyLabel || id;

    const meta = [
        role ? `            <p class="experience-entry__role">${escapeHtml(role)}</p>` : "",
        dates ? `            <p class="experience-entry__dates">${escapeHtml(dates)}</p>` : "",
        product ? `            <p class="experience-entry__product">${escapeHtml(product)}</p>` : "",
    ]
        .filter(Boolean)
        .join("\n");

    const prose = [
        opening ? `            <p class="experience-entry__lede">${escapeHtml(opening)}</p>` : "",
        story ? `            <p class="experience-entry__body">${escapeHtml(story)}</p>` : "",
    ]
        .filter(Boolean)
        .join("\n");

    const signalsHtml =
        signals.length > 0
            ? `            <ul class="experience-entry__bullets" aria-label="Highlights">
${signals.map((signal) => `              <li>${escapeHtml(signal)}</li>`).join("\n")}
            </ul>`
            : "";

    const cta = project
        ? `            <p class="experience-entry__cta"><a href="${escapeHtml(project)}">View project details</a></p>`
        : "";

    return `          <article class="experience-entry" id="milestone-${escapeHtml(id)}" data-milestone-panel="${escapeHtml(id)}">
            <div class="experience-entry__rail" aria-hidden="true"><span class="experience-entry__dot"></span></div>
            <div class="experience-entry__content">
              <h3 class="experience-entry__company">${escapeHtml(title)}</h3>
${meta}
${prose}
${signalsHtml}
${cta}
            </div>
          </article>`;
}

function renderMilestones(section) {
    const milestones = extractSubsections(section, 3);
    return `        <section class="cover-experience" aria-label="Experience">
          <div class="experience-stack">
${milestones.map((item) => renderMilestone(item.heading, item.body)).join("\n")}
          </div>
        </section>`;
}

function renderEarlier(section) {
    const openingMatch = section.match(/#### Opening\n+([\s\S]*?)(?=\n#### |\n*$)/);
    const chaptersMatch = section.match(/#### Chapters\n+([\s\S]*?)(?=\n#### |\n*$)/);
    const opening = openingMatch ? openingMatch[1].trim() : "";
    const chapters = (chaptersMatch ? chaptersMatch[1] : section)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2).trim());
    if (!opening && chapters.length === 0) {
        fail("EARLIER section needs #### Opening and/or #### Chapters");
    }
    const lead = opening
        ? `          <p class="cover-earlier__lede">${escapeHtml(opening)}</p>`
        : `          <p class="cover-section-lead">Continuous primary employment history — compact view.</p>`;
    const list =
        chapters.length > 0
            ? `          <ul class="earlier-chapters" aria-label="Career chapters">
${chapters.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>`
            : "";
    return `        <section class="cover-earlier" id="earlier" aria-labelledby="earlier-heading">
          <h2 id="earlier-heading">Earlier iOS Career</h2>
${lead}
${list}
        </section>`;
}

function renderOther(section) {
    const items = section
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2).trim());
    if (items.length === 0) {
        return "";
    }
    return `        <section class="cover-other" aria-labelledby="other-heading">
          <h2 id="other-heading">Other Projects</h2>
          <p class="cover-section-lead">Commercial and personal work outside the primary employment path.</p>
          <ul class="other-list">
${items.map((item) => `            <li>${escapeHtml(item)}</li>`).join("\n")}
          </ul>
        </section>`;
}

function renderDirection(section) {
    const paragraphs = section
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean);
    if (paragraphs.length === 0) {
        return "";
    }
    return `        <section class="cover-direction" id="direction" aria-labelledby="direction-heading">
          <h2 id="direction-heading">Now</h2>
${paragraphs.map((p) => `          <p>${escapeHtml(p)}</p>`).join("\n")}
        </section>`;
}

function renderCta(section) {
    const actions = section
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map(parseLinkLine);
    if (actions.length === 0) {
        return "";
    }
    return `        <section class="cover-cta" aria-labelledby="cta-heading">
          <h2 id="cta-heading">Next step</h2>
          <div class="cover-actions">
${actions
    .map(
        (action) =>
            `            <a class="cover-action${action.label === "Download CV" ? " cover-action--primary" : ""}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`,
    )
    .join("\n")}
          </div>
        </section>`;
}

const markdown = fs.readFileSync(presentationPortfolioPath, "utf8");
let html = fs.readFileSync(indexPath, "utf8");

const regions = {
    HERO: renderHero(extractSection(markdown, "HERO")),
    TIMELINE: renderTimeline(extractSection(markdown, "TIMELINE")),
    MILESTONES: renderMilestones(extractSection(markdown, "MILESTONES")),
    EARLIER: renderEarlier(extractSection(markdown, "EARLIER")),
    OTHER: renderOther(extractSection(markdown, "OTHER_PROJECTS")),
    DIRECTION: renderDirection(extractSection(markdown, "DIRECTION")),
    CTA: renderCta(extractSection(markdown, "CTA")),
};

for (const [name, inner] of Object.entries(regions)) {
    html = replaceMarkedRegion(html, name, inner);
}

fs.writeFileSync(indexPath, html);
console.log("OK: portfolio:sync wrote PORTFOLIO regions");
