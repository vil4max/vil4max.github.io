#!/usr/bin/env node
/**
 * Sync career/presentation/portfolio.md → index.html PORTFOLIO:* regions.
 * Mechanics: ../career/presentation/LANDING.md
 */
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

function contactIconSvg(label) {
    const key = String(label || "")
        .trim()
        .toLowerCase();
    // Monochrome marks (currentColor) — Simple Icons-aligned paths where possible.
    const icons = {
        email: `<svg class="cover-contact__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/></svg>`,
        telegram: `<svg class="cover-contact__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
        github: `<svg class="cover-contact__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
        linkedin: `<svg class="cover-contact__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    };
    return icons[key] || "";
}

function actionClassSuffix(label) {
    if (label === "Download CV") {
        return " cover-action--primary";
    }
    if (label === "Projects") {
        return " cover-action--tab";
    }
    return "";
}

function renderHero(section) {
    const fields = fieldMap(section, 3);
    const actions = (fields.get("Actions") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map(parseLinkLine);
    const contacts = (fields.get("Contact") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map(parseLinkLine);
    const signal = (fields.get("Signal") || "").trim();
    const stack = (fields.get("Stack") || "").trim();
    const aboutParagraphs = (fields.get("About") || "")
        .split(/\n\s*\n/)
        .map((part) => part.trim())
        .filter(Boolean);
    const contactHtml =
        contacts.length > 0
            ? `              <ul class="cover-contact" aria-label="Contact">
${contacts
    .map((contact) => {
        const icon = contactIconSvg(contact.label);
        return `                <li><a class="cover-contact__link" href="${escapeHtml(contact.href)}">${icon}<span>${escapeHtml(contact.label)}</span></a></li>`;
    })
    .join("\n")}
              </ul>`
            : "";
    return `        <section class="cover-hero" aria-labelledby="cover-name">
          <div class="cover-hero__layout">
            <img class="cover-hero__avatar" src="https://raw.githubusercontent.com/vil4max/vil4max/main/assets/profile.png" alt="Portrait of Max Vilchevskiy">
            <div class="cover-hero__copy">
              <h1 id="cover-name">${escapeHtml(fields.get("Name") || "")}</h1>
              <p class="cover-role">${escapeHtml(fields.get("Role") || "")}</p>
              <p class="cover-hero__signal">${escapeHtml(signal)}</p>
${stack ? `              <p class="cover-hero__stack">${escapeHtml(stack)}</p>` : ""}
${aboutParagraphs.map((p) => `              <p class="cover-about">${escapeHtml(p)}</p>`).join("\n")}
              <div class="cover-actions">
${actions
    .map(
        (action) =>
            `                <a class="cover-action${actionClassSuffix(action.label)}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`,
    )
    .join("\n")}
              </div>
${contactHtml}
            </div>
          </div>
        </section>`;
}

function renderTimeline(section) {
    // Chip roadmap retired: experience is a vertical LinkedIn-style stack in MILESTONES.
    void section;
    return "";
}

function yearsFromDates(dates) {
    return [...String(dates).matchAll(/\b((?:19|20)\d{2})\b/g)].map((match) => Number(match[1]));
}

const MONTH_INDEX = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
};

function parseEmploymentDates(dates) {
    const matches = [...String(dates).matchAll(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+((?:19|20)\d{2})\b/gi)];
    if (matches.length === 0) {
        const years = yearsFromDates(dates);
        if (years.length === 0) {
            return null;
        }
        return {
            startMonth: 1,
            startYear: Math.min(...years),
            endMonth: 12,
            endYear: Math.max(...years),
        };
    }
    const start = matches[0];
    const end = matches[matches.length - 1];
    return {
        startMonth: MONTH_INDEX[start[1].toLowerCase()],
        startYear: Number(start[2]),
        endMonth: MONTH_INDEX[end[1].toLowerCase()],
        endYear: Number(end[2]),
    };
}

function mileYearMeta(id, dates) {
    void id;
    const parsed = parseEmploymentDates(dates);
    if (!parsed) {
        return { mileYear: null, endYear: null, originYear: null };
    }
    const { startMonth, startYear, endYear } = parsed;
    // Late Q4 starts sit on the next mile year so chronology stays one-role-per-year on the rail.
    // Dec keeps a faint origin tick for the true start (iCenter Dec 2013 → mile 2014, origin 2013).
    // Nov bumps without origin (Tap4Parking Nov 2014 → mile 2015).
    if (startMonth >= 11) {
        return {
            mileYear: startYear + 1,
            endYear,
            originYear: startMonth === 12 ? startYear : null,
        };
    }
    return { mileYear: startYear, endYear, originYear: null };
}

function careerYearScale(milestones) {
    const mileYears = new Set();
    const foundationYears = new Set();
    let minYear = Infinity;
    let maxYear = -Infinity;

    for (const item of milestones) {
        if (item.heading === "now") {
            continue;
        }
        const { mileYear, endYear, originYear } = mileYearMeta(
            item.heading,
            fieldMap(item.body).get("Dates") || "",
        );
        if (mileYear != null) {
            mileYears.add(mileYear);
            minYear = Math.min(minYear, mileYear);
            maxYear = Math.max(maxYear, mileYear);
        }
        if (endYear != null) {
            minYear = Math.min(minYear, endYear);
            maxYear = Math.max(maxYear, endYear);
        }
        if (originYear != null) {
            foundationYears.add(originYear);
            minYear = Math.min(minYear, originYear);
            maxYear = Math.max(maxYear, originYear);
        }
    }

    if (!Number.isFinite(minYear) || !Number.isFinite(maxYear)) {
        return "";
    }

    const ticks = [
        `            <li class="experience-year-scale__tick experience-year-scale__tick--now" data-year-tick="now">Now</li>`,
    ];
    for (let year = maxYear; year >= minYear; year -= 1) {
        const classes = ["experience-year-scale__tick"];
        if (foundationYears.has(year) && !mileYears.has(year)) {
            classes.push("experience-year-scale__tick--foundation");
        } else if (mileYears.has(year)) {
            classes.push("experience-year-scale__tick--anchor");
        } else {
            classes.push("experience-year-scale__tick--interval");
        }
        ticks.push(`            <li class="${classes.join(" ")}" data-year-tick="${year}">${year}</li>`);
    }

    return `          <ol class="experience-year-scale" aria-hidden="true">
${ticks.join("\n")}
          </ol>`;
}

function renderPositionChapter(heading, body) {
    const fields = fieldMap(body, 6);
    const role = (fields.get("Role") || "").trim();
    const dates = (fields.get("Dates") || "").trim();
    const product = (fields.get("Product") || "").trim();
    const opening = (fields.get("Opening") || "").trim();
    const story = (fields.get("Story") || "").trim();
    const lines = [
        `                <p class="experience-chapter__company">${escapeHtml(heading)}</p>`,
        role ? `                <p class="experience-chapter__role">${escapeHtml(role)}</p>` : "",
        dates ? `                <p class="experience-chapter__dates">${escapeHtml(dates)}</p>` : "",
        product ? `                <p class="experience-chapter__product">${escapeHtml(product)}</p>` : "",
        opening ? `                <p class="experience-chapter__lede">${escapeHtml(opening)}</p>` : "",
        story ? `                <p class="experience-chapter__body">${escapeHtml(story)}</p>` : "",
    ].filter(Boolean);
    return `              <li class="experience-chapter">
${lines.join("\n")}
              </li>`;
}

function renderMilestone(id, body, { isCurrent = false, isRecent = false, isQuiet = false, showEraLabel = false, quietDepth = 0 } = {}) {
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
    const chapterItems = fields.get("Chapters") ? extractSubsections(fields.get("Chapters"), 5) : [];
    const legacyLabel = (fields.get("Label") || "").trim();
    const title = company || legacyLabel || id;
    const { mileYear, endYear, originYear } = mileYearMeta(id, dates);

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

    const chaptersHtml =
        chapterItems.length > 0
            ? `            <ul class="experience-chapters" aria-label="Roles">
${chapterItems.map((item) => renderPositionChapter(item.heading, item.body)).join("\n")}
            </ul>`
            : "";

    const signalsHtml =
        !chaptersHtml && signals.length > 0
            ? `            <ul class="experience-entry__bullets" aria-label="Highlights">
${signals.map((signal) => `              <li>${escapeHtml(signal)}</li>`).join("\n")}
            </ul>`
            : "";

    const cta = project
        ? `            <p class="experience-entry__cta"><a href="${escapeHtml(project)}">View project details</a></p>`
        : "";

    const yearAttrs = [
        mileYear != null ? `data-start-year="${mileYear}"` : "",
        endYear != null ? `data-end-year="${endYear}"` : "",
        originYear != null ? `data-origin-year="${originYear}"` : "",
    ]
        .filter(Boolean)
        .join(" ");
    const classNames = ["experience-entry"];
    if (isCurrent) {
        classNames.push("experience-entry--current");
    }
    if (isRecent) {
        classNames.push("experience-entry--recent");
    }
    if (isQuiet) {
        classNames.push("experience-entry--quiet");
    }

    const eraLabel = showEraLabel
        ? `            <p class="experience-entry__era">Earlier</p>`
        : "";
    const quietAttr = isQuiet ? ` data-quiet-depth="${quietDepth}" style="--quiet-depth: ${quietDepth}"` : "";

    return `          <article class="${classNames.join(" ")}" id="milestone-${escapeHtml(id)}" data-milestone-panel="${escapeHtml(id)}"${yearAttrs ? ` ${yearAttrs}` : ""}${quietAttr}>
            <div class="experience-entry__rail" aria-hidden="true"><span class="experience-entry__dot"></span></div>
            <div class="experience-entry__content">
${eraLabel}
              <h3 class="experience-entry__company">${escapeHtml(title)}</h3>
${meta}
${prose}
${chaptersHtml}
${signalsHtml}
${cta}
            </div>
          </article>`;
}

function renderMilestones(section) {
    const milestones = extractSubsections(section, 3);
    const yearScale = careerYearScale(milestones);
    let pastIndex = 0;
    let quietSeen = false;
    let quietDepth = 0;
    const entries = milestones
        .map((item) => {
            const isCurrent = item.heading === "now";
            const isRecent = !isCurrent && pastIndex < 2;
            if (!isCurrent) {
                pastIndex += 1;
            }
            const dates = fieldMap(item.body).get("Dates") || "";
            const { mileYear } = mileYearMeta(item.heading, dates);
            // Pre-2019 roles stay on the rail, but quieter / compact (foundation zone).
            const isQuiet = !isCurrent && mileYear != null && mileYear < 2019;
            const showEraLabel = isQuiet && !quietSeen;
            const depth = isQuiet ? quietDepth : 0;
            if (isQuiet) {
                quietSeen = true;
                quietDepth += 1;
            }
            return renderMilestone(item.heading, item.body, {
                isCurrent,
                isRecent,
                isQuiet,
                showEraLabel,
                quietDepth: depth,
            });
        })
        .join("\n");
    return `        <section class="cover-experience" aria-label="Experience">
          <div class="experience-layout">
${yearScale}
            <div class="experience-stack">
${entries}
            </div>
          </div>
        </section>`;
}

function renderEarlier(section) {
    // Earlier career is folded into the vertical MILESTONES stack for one continuous rail.
    void section;
    return "";
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
            `            <a class="cover-action${actionClassSuffix(action.label)}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`,
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
