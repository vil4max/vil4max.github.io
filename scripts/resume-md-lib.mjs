import fs from "node:fs";
import path from "node:path";

const BOOL = /^(true|false)$/i;

export function parseFrontmatter(text) {
    if (!text.startsWith("---\n")) {
        return { frontmatter: {}, body: text };
    }
    const end = text.indexOf("\n---\n", 4);
    if (end === -1) {
        return { frontmatter: {}, body: text };
    }
    const raw = text.slice(4, end);
    const body = text.slice(end + 5);
    const frontmatter = {};
    for (const line of raw.split("\n")) {
        const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!match) {
            continue;
        }
        const [, key, value] = match;
        frontmatter[key] = value.replace(/^"|"$/g, "");
    }
    return { frontmatter, body };
}

function parseMetadataLine(line) {
    const match = line.match(/^- \*\*([^*]+):\*\*\s*(.+)$/);
    if (!match) {
        return null;
    }
    return { key: match[1].trim(), value: match[2].trim() };
}

function parseBool(value) {
    if (BOOL.test(value)) {
        return value.toLowerCase() === "true";
    }
    return value;
}

function parseBulletList(lines, startIndex) {
    const bullets = [];
    let index = startIndex;
    while (index < lines.length) {
        const line = lines[index];
        if (line.startsWith("#### ") || line.startsWith("### ") || line.startsWith("## ")) {
            break;
        }
        const bulletMatch = line.match(/^- (.+)$/);
        if (bulletMatch) {
            bullets.push(bulletMatch[1]);
        }
        index += 1;
    }
    return { bullets, nextIndex: index };
}

function parseParagraph(lines, startIndex) {
    const parts = [];
    let index = startIndex;
    while (index < lines.length) {
        const line = lines[index];
        if (line.startsWith("#### ") || line.startsWith("### ") || line.startsWith("## ") || line.startsWith("- ")) {
            break;
        }
        if (line.trim()) {
            parts.push(line.trim());
        }
        index += 1;
    }
    return { text: parts.join(" "), nextIndex: index };
}

function parseLinkedInPaste(lines, startIndex) {
    let index = startIndex;
    while (index < lines.length && !lines[startIndex].startsWith("```")) {
        index += 1;
    }
    while (index < lines.length && !lines[index].startsWith("```")) {
        index += 1;
    }
    if (index >= lines.length) {
        return { nextIndex: startIndex };
    }
    index += 1;
    while (index < lines.length && !lines[index].startsWith("```")) {
        index += 1;
    }
    return { nextIndex: index + 1 };
}

function parseRelatedProjects(lines, startIndex) {
    const projectsDetail = [];
    let index = startIndex;
    while (index < lines.length) {
        const line = lines[index];
        if (line.startsWith("#### ") || line.startsWith("### ") || line.startsWith("## ")) {
            break;
        }
        const nameMatch = line.match(/^- \*\*Name:\*\*\s*(.+)$/);
        const summaryMatch = line.match(/^- \*\*Summary:\*\*\s*(.+)$/);
        if (nameMatch) {
            const current = { name: nameMatch[1].trim(), summary: "" };
            projectsDetail.push(current);
        } else if (summaryMatch && projectsDetail.length > 0) {
            projectsDetail[projectsDetail.length - 1].summary = summaryMatch[1].trim();
        } else {
            const legacyMatch = line.match(/^- (.+?)\s+—\s+(.+)$/);
            if (legacyMatch) {
                projectsDetail.push({ name: legacyMatch[1].trim(), summary: legacyMatch[2].trim() });
            }
        }
        index += 1;
    }
    return { projectsDetail, nextIndex: index };
}

function parseRoleSection(lines, startIndex) {
    const headingMatch = lines[startIndex].match(/^### (.+)$/);
    if (!headingMatch) {
        return { nextIndex: startIndex + 1 };
    }
    const role = {
        company: headingMatch[1].trim(),
        technologies: [],
    };
    let index = startIndex + 1;
    while (index < lines.length && !lines[index].startsWith("### ") && !lines[index].startsWith("## ")) {
        const line = lines[index];
        if (line.startsWith("#### ")) {
            const section = line.slice(5).trim();
            index += 1;
            if (section === "Product") {
                const { text, nextIndex } = parseParagraph(lines, index);
                role.productDescription = text;
                if (!role.project) {
                    role.project = text.split(" — ")[0]?.trim() || text;
                }
                index = nextIndex;
                continue;
            }
            if (section === "My role") {
                const { text, nextIndex } = parseParagraph(lines, index);
                role.myRole = text;
                index = nextIndex;
                continue;
            }
            if (section === "Responsibilities") {
                const { bullets, nextIndex } = parseBulletList(lines, index);
                role.bullets = bullets;
                index = nextIndex;
                continue;
            }
            if (section === "Bullets short") {
                const { bullets, nextIndex } = parseBulletList(lines, index);
                role.bulletsShort = bullets;
                index = nextIndex;
                continue;
            }
            if (section === "Technologies") {
                const { text, nextIndex } = parseParagraph(lines, index);
                role.technologiesLine = text;
                role.technologies = text.split("·").map((item) => item.trim()).filter(Boolean);
                index = nextIndex;
                continue;
            }
            if (section === "LinkedIn paste") {
                const { nextIndex } = parseLinkedInPaste(lines, index);
                index = nextIndex;
                continue;
            }
            if (section === "Related projects") {
                const { projectsDetail, nextIndex } = parseRelatedProjects(lines, index);
                if (projectsDetail.length > 0) {
                    role.projectsDetail = projectsDetail;
                }
                index = nextIndex;
                continue;
            }
            index += 1;
            continue;
        }
        const metadata = parseMetadataLine(line);
        if (metadata) {
            const { key, value } = metadata;
            switch (key) {
                case "Id":
                    role.id = value;
                    break;
                case "Title":
                    role.title = value;
                    break;
                case "Dates":
                    role.displayFull = value;
                    break;
                case "Start":
                    role.start = value;
                    break;
                case "End":
                    role.end = value;
                    break;
                case "Display short":
                    role.displayShort = value;
                    break;
                case "Location":
                    role.location = value;
                    break;
                case "Level":
                    role.level = value;
                    break;
                case "Featured":
                    role.featured = parseBool(value);
                    break;
                case "Short include":
                    role.shortInclude = parseBool(value);
                    break;
                case "Project":
                    role.project = value;
                    break;
                default:
                    break;
            }
        }
        index += 1;
    }
    return { role, nextIndex: index };
}

function parseSectionBullets(sectionLines) {
    const bullets = [];
    for (const line of sectionLines) {
        const bulletMatch = line.match(/^- (.+)$/);
        if (bulletMatch) {
            bullets.push(bulletMatch[1]);
        }
    }
    return bullets;
}

export function parseResumeMarkdown(markdown) {
    const { frontmatter, body } = parseFrontmatter(markdown);
    const lines = body.split("\n");
    const result = {
        meta: {},
        contacts: {},
        highlights: [],
        earlyCareerShort: "",
        education: [],
        roles: [],
        otherProjects: [],
        featuredProjects: [],
        cvProjects: [],
    };

    let index = 0;
    while (index < lines.length) {
        const line = lines[index];
        if (!line.startsWith("## ")) {
            index += 1;
            continue;
        }
        const section = line.slice(3).trim();
        index += 1;
        const sectionStart = index;
        while (index < lines.length && !lines[index].startsWith("## ")) {
            index += 1;
        }
        const sectionLines = lines.slice(sectionStart, index);

        if (section === "Summary") {
            result.meta.summary = sectionLines.join("\n").trim();
            result.meta.summaryShort = result.meta.summary;
            result.meta.landingAbout = result.meta.summary;
            continue;
        }
        if (section === "Highlights") {
            result.highlights = parseSectionBullets(sectionLines);
            result.meta.summaryBullets = result.highlights;
            continue;
        }
        if (section === "Skills") {
            const lineShortSection = sectionLines.findIndex((item) => item.trim() === "### Line short");
            if (lineShortSection !== -1) {
                const lineBody = [];
                for (let lineIndex = lineShortSection + 1; lineIndex < sectionLines.length; lineIndex += 1) {
                    const line = sectionLines[lineIndex].trim();
                    if (line.startsWith("### ")) {
                        break;
                    }
                    if (line) {
                        lineBody.push(line);
                    }
                }
                result.meta.skillsLineShort = lineBody.join("\n");
            }
            const lineSection = sectionLines.findIndex((item) => item.trim() === "### Line");
            if (lineSection !== -1) {
                const lineBody = sectionLines
                    .slice(lineSection + 1)
                    .find((item) => item.trim() && !item.startsWith("#"));
                result.meta.skillsLine = lineBody?.trim() ?? "";
            } else {
                result.meta.skillsLine = sectionLines.join("\n").trim();
            }
            result.meta.skillsLineDetailed = result.meta.skillsLine;
            continue;
        }
        if (section === "Professional Experience") {
            let roleIndex = 0;
            while (roleIndex < sectionLines.length) {
                if (!sectionLines[roleIndex].startsWith("### ")) {
                    roleIndex += 1;
                    continue;
                }
                const { role, nextIndex } = parseRoleSection(sectionLines, roleIndex);
                if (role?.id) {
                    if (!role.bulletsShort && role.bullets?.length) {
                        const shortOmitted = new Set(["globallogic"]);
                        if (shortOmitted.has(role.id) && role.bullets.length > 3) {
                            role.bulletsShort = role.bullets.slice(0, 3);
                        }
                    }
                    result.roles.push(role);
                }
                roleIndex = nextIndex;
            }
            continue;
        }
        if (section === "Other production projects") {
            let projectIndex = 0;
            while (projectIndex < sectionLines.length) {
                const projectHeading = sectionLines[projectIndex].match(/^### (.+)$/);
                if (!projectHeading) {
                    projectIndex += 1;
                    continue;
                }
                const name = projectHeading[1].trim();
                projectIndex += 1;
                let id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                let blurb = "";
                let technologies = [];
                while (projectIndex < sectionLines.length && !sectionLines[projectIndex].startsWith("### ")) {
                    const item = sectionLines[projectIndex];
                    const idMatch = item.match(/^- \*\*Id:\*\*\s*(.+)$/);
                    if (idMatch) {
                        id = idMatch[1].trim();
                    }
                    const techMatch = item.match(/^- \*\*Technologies:\*\*\s*(.+)$/);
                    if (techMatch) {
                        technologies = techMatch[1].split("·").map((part) => part.trim()).filter(Boolean);
                    }
                    if (item.trim() && !item.startsWith("- **")) {
                        blurb = item.trim();
                    }
                    projectIndex += 1;
                }
                result.otherProjects.push({ id, name, blurb, technologies });
            }
            continue;
        }
        if (section === "Education") {
            const institution = sectionLines.find((item) => item.startsWith("- **Institution:**"))?.replace(/^- \*\*Institution:\*\*\s*/, "") ?? "";
            const location = sectionLines.find((item) => item.startsWith("- **Location:**"))?.replace(/^- \*\*Location:\*\*\s*/, "") ?? "";
            const degree = sectionLines.find((item) => item.startsWith("- **Degree:**"))?.replace(/^- \*\*Degree:\*\*\s*/, "") ?? "";
            const field = sectionLines.find((item) => item.startsWith("- **Field:**"))?.replace(/^- \*\*Field:\*\*\s*/, "") ?? "";
            result.education.push({
                institution,
                location,
                degree,
                field,
                displayFull: `${institution} · ${location} — ${degree}, ${field}`,
            });
            continue;
        }
        if (section === "Languages") {
            result.meta.languagesLine = sectionLines.join("\n").trim();
            continue;
        }
        if (section === "Early career") {
            result.earlyCareerShort = sectionLines.join("\n").trim();
            continue;
        }
        if (section === "Featured projects") {
            for (const bullet of parseSectionBullets(sectionLines)) {
                const pipeMatch = bullet.match(/^(\S+)\s+\|\s+(.+?)\s+\|\s+(\S+)$/);
                if (pipeMatch) {
                    result.featuredProjects.push({
                        id: pipeMatch[1].trim(),
                        name: pipeMatch[2].trim(),
                        employerRoleId: pipeMatch[3].trim(),
                    });
                }
            }
        }
    }

    result.meta.name = frontmatter.name ?? "Max Vilchevskiy";
    result.meta.title = frontmatter.title ?? "iOS Software Engineer";
    result.meta.tagline = frontmatter.tagline ?? "Swift · SwiftUI · UIKit";
    result.meta.location = frontmatter.location ?? "Kyiv, Ukraine";
    result.meta.pitch = frontmatter.pitch ?? result.meta.title;
    result.meta.headerTldr = frontmatter.headerTldr ?? result.meta.title;
    result.meta.availability = frontmatter.availability ?? "Available from Jul 2026 · remote or hybrid Kyiv";
    result.meta.headerAvailability = frontmatter.headerAvailability ?? "Available Jul 2026 · remote or hybrid";
    result.contacts.email = frontmatter.email ?? "vil4max@gmail.com";
    result.contacts.phone = frontmatter.phone ?? "";
    result.contacts.phonePublic = frontmatter.phonePublic === "true";
    result.contacts.linkedin = frontmatter.linkedin ?? "https://www.linkedin.com/in/vil4max/";
    result.contacts.github = frontmatter.github ?? "https://github.com/vil4max";
    result.contacts.portfolio = frontmatter.portfolio ?? "https://vil4max.github.io";
    result.contacts.telegram = frontmatter.telegram ?? "https://t.me/vil4max";
    result.meta.apply = {
        primarySkill: frontmatter.applyPrimarySkill ?? "iOS Swift",
        yearsExperience: frontmatter.applyYearsExperience ?? "12+",
        englishLevel: frontmatter.applyEnglishLevel ?? "Intermediate",
        noticePeriod: frontmatter.applyNoticePeriod ?? "Available now",
        country: frontmatter.applyCountry ?? "Ukraine",
        city: frontmatter.applyCity ?? "Kyiv",
        preferredWorkCountries: frontmatter.applyPreferredWorkCountries ?? "Ukraine",
    };
    result.meta.syncRule =
        "Edit content/source-of-truth.md only, then run npm run resume:build — see constraints.md.";
    return result;
}

function linkedInPasteForRole(role) {
    const bullets = role.bullets.map((bullet) => `• ${bullet}`).join("\n");
    return `${role.project}\n\n${bullets}\n\n${role.technologiesLine}`;
}

function roleMetadataLines(role) {
    return [
        `- **Id:** ${role.id}`,
        `- **Title:** ${role.title}`,
        `- **Dates:** ${role.displayFull}`,
        `- **Start:** ${role.start}`,
        `- **End:** ${role.end}`,
        `- **Display short:** ${role.displayShort}`,
        `- **Location:** ${role.location}`,
        `- **Level:** ${role.level}`,
        `- **Featured:** ${role.featured}`,
        `- **Short include:** ${role.shortInclude}`,
        `- **Project:** ${role.project}`,
    ].join("\n");
}

const roleProductDescriptions = {
    globallogic:
        "Apple Watch Voice AI — R&D project. Voice AI assistant with full on-watch flows; iPhone relay for WebSocket/audio where watchOS limits apply.",
    pasha: "Birmarket — online marketplace & loyalty · Loyalty squad. Consumer marketplace and shared loyalty SDK across host apps.",
    dodo: "Drinkit — coffee ordering app. QSR product from MVP through major App Store release.",
    solvve: "PLAYHERA — esports & gaming tournaments. Production App Store app for squads, challenges, and standings.",
    electus: "Electus — blockchain assistant startup. Wallet, portfolio, and transfer flows through MVP TestFlight.",
    gbksoft: "Eastern Union — Broker Tool & client delivery apps. Calculator-heavy broker flows and client shop/location apps.",
    amconsoft: "Client iOS projects. Remote delivery across SceneKit visualization and meditation/audio apps.",
    tap4parking: "Tap4Parking — parking startup product. Map-based search, booking, navigation, and payments.",
    icenter: "Product apps — messaging and content. SMS campaigns, in-app messaging, and news feed on an on-site team.",
};

const roleMyRoles = {
    globallogic:
        "Senior iOS engineer on watchOS client — architecture, Watch ↔ iPhone connectivity, TestFlight delivery.",
    pasha: "Senior iOS engineer on marketplace commerce and Premium Subscription technical lead inside the loyalty squad.",
    dodo: "iOS engineer on a three-person team — ordering UX, video clips, checkout, and production releases.",
    electus: "iOS engineer on startup delivery; mentored a junior engineer through wallet and transfer flows.",
};

export function generateResumeMarkdown(source, options = {}) {
    const { headline, agenticLines = [], careerDirection = "" } = options;
    const frontmatter = [
        "---",
        `name: ${source.meta.name}`,
        `title: ${source.meta.title}`,
        `tagline: ${source.meta.tagline}`,
        `location: ${source.meta.location}`,
        `pitch: ${source.meta.pitch}`,
        `headerTldr: ${source.meta.headerTldr}`,
        `availability: ${source.meta.availability}`,
        `headerAvailability: ${source.meta.headerAvailability}`,
        `email: ${source.contacts.email}`,
        `phone: ${source.contacts.phone}`,
        `phonePublic: ${source.contacts.phonePublic}`,
        `linkedin: ${source.contacts.linkedin}`,
        `github: ${source.contacts.github}`,
        `portfolio: ${source.contacts.portfolio}`,
        `telegram: ${source.contacts.telegram}`,
        `applyPrimarySkill: ${source.meta.apply.primarySkill}`,
        `applyYearsExperience: ${source.meta.apply.yearsExperience}`,
        `applyEnglishLevel: ${source.meta.apply.englishLevel}`,
        `applyNoticePeriod: ${source.meta.apply.noticePeriod}`,
        `applyCountry: ${source.meta.apply.country}`,
        `applyCity: ${source.meta.apply.city}`,
        `applyPreferredWorkCountries: ${source.meta.apply.preferredWorkCountries}`,
        "---",
        "",
    ].join("\n");

    const sections = [
        `# ${source.meta.name}`,
        "",
        `> ${source.meta.title} · ${source.meta.location}`,
        "",
        "## Languages",
        "",
        source.meta.languagesLine,
        "",
        "## Summary",
        "",
        source.meta.summary,
        "",
        "## Highlights",
        "",
        ...source.highlights.map((item) => `- ${item}`),
        "",
        "## Skills",
        "",
        "### Languages & platforms",
        "Swift · SwiftUI · UIKit · Swift Concurrency · async/await · Combine · SwiftData · SPM · WatchKit",
        "",
        "### Networking & data",
        "URLSession · REST · Firebase · Keychain · Core Data",
        "",
        "### Media & device",
        "AVFoundation · AVAudioEngine · CoreLocation · SceneKit",
        "",
        "### Line",
        source.meta.skillsLine,
        "",
        "## Agentic engineering",
        "",
        ...agenticLines.map((item) => `- ${item}`),
        "",
        "## Career direction",
        "",
        careerDirection,
        "",
        "## Early career",
        "",
        source.earlyCareerShort,
        "",
        "## Professional Experience",
        "",
    ];

    for (const role of source.roles) {
        const productDescription = roleProductDescriptions[role.id] ?? role.project;
        const myRole = roleMyRoles[role.id];
        sections.push(`### ${role.company}`, "");
        sections.push(roleMetadataLines(role), "");
        sections.push("#### Product", "", productDescription, "");
        if (myRole) {
            sections.push("#### My role", "", myRole, "");
        }
        sections.push("#### Responsibilities", "", ...role.bullets.map((item) => `- ${item}`), "");
        if (role.bulletsShort?.length) {
            sections.push("#### Bullets short", "", ...role.bulletsShort.map((item) => `- ${item}`), "");
        }
        sections.push("#### Technologies", "", role.technologiesLine, "");
        sections.push("#### LinkedIn paste", "", "```", linkedInPasteForRole(role), "```", "");
        if (role.projectsDetail?.length) {
            sections.push(
                "#### Related projects",
                "",
                ...role.projectsDetail.flatMap((item) => [
                    `- **Name:** ${item.name}`,
                    `- **Summary:** ${item.summary}`,
                ]),
                "",
            );
        }
    }

    sections.push("## Other production projects", "");
    for (const project of source.otherProjects) {
        sections.push(`### ${project.name}`, "");
        sections.push(`- **Id:** ${project.id}`, "");
        sections.push(project.blurb, "");
        sections.push(`- **Technologies:** ${project.technologies.join(" · ")}`, "");
    }

    sections.push("## Featured projects", "");
    for (const project of source.featuredProjects) {
        sections.push(`- ${project.id} | ${project.name} | ${project.employerRoleId}`);
    }
    sections.push("");

    const education = source.education[0];
    sections.push(
        "## Education",
        "",
        `- **Institution:** ${education.institution}`,
        `- **Location:** ${education.location}`,
        `- **Degree:** ${education.degree}`,
        `- **Field:** ${education.field}`,
        "",
        "## LinkedIn profile",
        "",
        "### Headline",
        "",
        "```",
        headline ??
            "iOS Software Engineer · Swift · SwiftUI · UIKit · Swift Concurrency · XCTest · iOS SDK · Subscriptions · WatchKit · Apple platform SDKs",
        "```",
        "",
        "### Skills line",
        "",
        "```",
        "Swift · SwiftUI · UIKit · Swift Concurrency · async/await · Combine · SwiftData · SPM · XCTest · Unit Testing · iOS SDK · Subscriptions · WatchKit · Apple platform SDKs",
        "```",
        "",
    );

    return `${frontmatter}${sections.join("\n")}`;
}

export function deepDiff(left, right, currentPath = "") {
    const errors = [];
    if (left === right) {
        return errors;
    }
    if (left === null || right === null || typeof left !== typeof right) {
        errors.push(`${currentPath || "(root)"}: ${JSON.stringify(left)} !== ${JSON.stringify(right)}`);
        return errors;
    }
    if (Array.isArray(left) && Array.isArray(right)) {
        if (left.length !== right.length) {
            errors.push(`${currentPath}.length: ${left.length} !== ${right.length}`);
        }
        const length = Math.max(left.length, right.length);
        for (let index = 0; index < length; index += 1) {
            errors.push(...deepDiff(left[index], right[index], `${currentPath}[${index}]`));
        }
        return errors;
    }
    if (typeof left === "object" && typeof right === "object") {
        const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
        for (const key of [...keys].sort()) {
            if (key === "syncRule" || key === "productDescription" || key === "myRole") {
                continue;
            }
            const nextPath = currentPath ? `${currentPath}.${key}` : key;
            if (!(key in left)) {
                errors.push(`${nextPath}: missing in parsed`);
                continue;
            }
            if (!(key in right)) {
                errors.push(`${nextPath}: missing in golden`);
                continue;
            }
            errors.push(...deepDiff(left[key], right[key], nextPath));
        }
        return errors;
    }
    errors.push(`${currentPath}: ${JSON.stringify(left)} !== ${JSON.stringify(right)}`);
    return errors;
}

export function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, value) {
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function repoRootFrom(importMetaUrl) {
    return path.join(path.dirname(importMetaUrl), "..");
}
