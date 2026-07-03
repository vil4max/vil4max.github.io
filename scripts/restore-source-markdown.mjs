#!/usr/bin/env node
import fs from "node:fs";
import { sourceOfTruthPath } from "./resume-paths.mjs";

const TOP_SECTIONS = new Set([
    "Languages",
    "Summary",
    "Highlights",
    "Skills",
    "Agentic engineering",
    "Career direction",
    "Professional Experience",
    "Early career",
    "Other production projects",
    "Featured projects",
    "Education",
    "LinkedIn profile",
    "Application metadata",
]);

const SKILL_SUBSECTIONS = new Set([
    "Languages & platforms",
    "Concurrency & reactive",
    "Networking & data",
    "Analytics",
    "Media & device",
    "Apple frameworks",
    "Payments & commerce",
    "Third-party libraries",
    "AI & agentic tooling",
    "Line short",
    "Line",
]);

const ROLE_SUBSECTIONS = new Set([
    "Product",
    "My role",
    "Responsibilities",
    "Bullets short",
    "Technologies",
    "LinkedIn paste",
    "Related projects",
]);

const META_KEYS = new Set([
    "Id",
    "Title",
    "Dates",
    "Start",
    "End",
    "Display short",
    "Location",
    "Level",
    "Featured",
    "Short include",
    "Project",
]);

const EDUCATION_KEYS = new Set(["Institution", "Location", "Degree", "Field"]);

const APPLICATION_KEYS = new Set([
    "Availability",
    "Header availability",
    "Primary skill",
    "Years experience",
    "English level",
    "Notice period",
    "Country / city",
    "Preferred work countries",
]);

const LINKEDIN_SUBSECTIONS = new Set(["About", "Headline", "Skills line"]);

const BULLET_SECTIONS = new Set(["Highlights", "Responsibilities", "Bullets short"]);

function isCompanyHeading(line, nextLine) {
    if (!line.trim() || line.includes(":") || line.startsWith("#")) {
        return false;
    }
    if (META_KEYS.has(line.trim())) {
        return false;
    }
    if (ROLE_SUBSECTIONS.has(line.trim())) {
        return false;
    }
    if (TOP_SECTIONS.has(line.trim())) {
        return false;
    }
    if (SKILL_SUBSECTIONS.has(line.trim())) {
        return false;
    }
    if (line.trim() === "Focus:") {
        return false;
    }
    if (line.trim().startsWith("• ")) {
        return false;
    }
    if (line.trim().startsWith("watch-") || line.trim().startsWith("birmarket") || line.trim().startsWith("drinkit")) {
        return false;
    }
    if (nextLine?.trim().startsWith("Id:")) {
        return true;
    }
    if (nextLine?.trim().startsWith("R&D contract") || nextLine?.trim().startsWith("Taxi MVP")) {
        return true;
    }
    return false;
}

function restoreBody(body) {
    const lines = body.split("\n");
    const output = ["# Max Vilchevskiy", "", "> iOS Software Engineer · Kyiv, Ukraine", ""];
    let section = "";
    let roleSubsection = "";
    let linkedInSubsection = "";
    let inLinkedInPaste = false;
    let linkedInPasteBuffer = [];
    let inCodeBlock = false;
    let linkedInPrivateOpened = false;

    let index = 0;
    while (index < lines.length) {
        const line = lines[index];
        const trimmed = line.trim();
        const nextLine = lines[index + 1];

        if (trimmed === "```") {
            inCodeBlock = !inCodeBlock;
            index += 1;
            continue;
        }
        if (inCodeBlock) {
            index += 1;
            continue;
        }
        if (trimmed === "Max Vilchevskiy" || trimmed === "iOS Software Engineer · Kyiv, Ukraine") {
            index += 1;
            continue;
        }

        if (TOP_SECTIONS.has(trimmed)) {
            section = trimmed;
            roleSubsection = "";
            linkedInSubsection = "";
            inLinkedInPaste = false;
            output.push(`## ${trimmed}`, "");
            index += 1;
            continue;
        }

        if (section === "Skills" && SKILL_SUBSECTIONS.has(trimmed)) {
            output.push(`### ${trimmed}`, "");
            index += 1;
            continue;
        }

        if (section === "Professional Experience" && isCompanyHeading(trimmed, nextLine)) {
            roleSubsection = "";
            inLinkedInPaste = false;
            output.push(`### ${trimmed}`, "");
            index += 1;
            continue;
        }

        if (section === "Professional Experience" && ROLE_SUBSECTIONS.has(trimmed)) {
            roleSubsection = trimmed;
            if (trimmed === "LinkedIn paste") {
                inLinkedInPaste = true;
                linkedInPasteBuffer = [];
                output.push("#### LinkedIn paste", "", "```");
            } else {
                inLinkedInPaste = false;
                output.push(`#### ${trimmed}`, "");
            }
            index += 1;
            continue;
        }

        if (section === "Other production projects" && trimmed && !trimmed.startsWith("Technologies:") && !trimmed.startsWith("Id:")) {
            if (nextLine?.trim().startsWith("Id:") || nextLine?.trim().startsWith("R&D contract") || nextLine?.trim().startsWith("Taxi MVP") || nextLine?.trim().startsWith("Ukrainian news")) {
                output.push(`### ${trimmed}`, "");
                index += 1;
                continue;
            }
        }

        if (section === "LinkedIn profile" && LINKEDIN_SUBSECTIONS.has(trimmed)) {
            linkedInSubsection = trimmed;
            output.push(`### ${trimmed}`, "");
            if (trimmed === "About" || trimmed === "Headline" || trimmed === "Skills line") {
                output.push("", "```");
            }
            index += 1;
            continue;
        }

        if (section === "Professional Experience" && trimmed.includes(":")) {
            const metaMatch = trimmed.match(/^([\w /]+):\s*(.+)$/);
            if (metaMatch && META_KEYS.has(metaMatch[1])) {
                output.push(`- **${metaMatch[1]}:** ${metaMatch[2]}`);
                index += 1;
                continue;
            }
        }

        if (section === "Education" && trimmed.includes(":")) {
            const eduMatch = trimmed.match(/^([\w ]+):\s*(.+)$/);
            if (eduMatch && EDUCATION_KEYS.has(eduMatch[1])) {
                output.push(`- **${eduMatch[1]}:** ${eduMatch[2]}`);
                index += 1;
                continue;
            }
        }

        if (section === "Other production projects" && trimmed.startsWith("Id:")) {
            output.push(`- **Id:** ${trimmed.slice(3).trim()}`);
            index += 1;
            continue;
        }

        if (section === "Other production projects" && trimmed.startsWith("Technologies:")) {
            output.push(`- **Technologies:** ${trimmed.slice("Technologies:".length).trim()}`);
            index += 1;
            continue;
        }

        if (section === "Application metadata" && trimmed.includes(":")) {
            const appMatch = trimmed.match(/^([\w /]+):\s*(.+)$/);
            if (appMatch && APPLICATION_KEYS.has(appMatch[1])) {
                output.push(`${appMatch[1]}: ${appMatch[2]}`);
                index += 1;
                continue;
            }
        }

        if (section === "Career direction" && trimmed === "Focus:") {
            output.push("**Focus:**", "");
            index += 1;
            continue;
        }

        if (section === "Career direction" && trimmed && trimmed !== "Focus:" && !trimmed.startsWith("As a senior")) {
            output.push(`- ${trimmed}`);
            index += 1;
            continue;
        }

        if (BULLET_SECTIONS.has(section) || BULLET_SECTIONS.has(roleSubsection)) {
            if (trimmed && !trimmed.startsWith("- ")) {
                output.push(`- ${trimmed}`);
                index += 1;
                continue;
            }
        }

        if (section === "Featured projects" && trimmed.includes("|")) {
            output.push(`- ${trimmed}`);
            index += 1;
            continue;
        }

        if (section === "Professional Experience" && roleSubsection === "Related projects") {
            const relatedName = trimmed.match(/^Name:\s*(.+)$/);
            const relatedSummary = trimmed.match(/^Summary:\s*(.+)$/);
            if (relatedName) {
                output.push(`- **Name:** ${relatedName[1]}`);
                index += 1;
                continue;
            }
            if (relatedSummary) {
                output.push(`- **Summary:** ${relatedSummary[1]}`);
                index += 1;
                continue;
            }
        }

        if (inLinkedInPaste) {
            if (
                trimmed &&
                (ROLE_SUBSECTIONS.has(trimmed) ||
                    META_KEYS.has(trimmed) ||
                    isCompanyHeading(trimmed, nextLine) ||
                    TOP_SECTIONS.has(trimmed))
            ) {
                output.push("```", "");
                inLinkedInPaste = false;
                roleSubsection = "";
                continue;
            }
            output.push(line);
            index += 1;
            continue;
        }

        if (section === "LinkedIn profile" && linkedInSubsection) {
            if (LINKEDIN_SUBSECTIONS.has(trimmed) || trimmed === "<!-- @visibility: private -->") {
                if (!linkedInPrivateOpened && linkedInSubsection !== "About") {
                    output.push("```", "");
                }
                if (trimmed === "Skills line" || trimmed === "Headline") {
                    if (linkedInSubsection === "About" && !linkedInPrivateOpened) {
                        output.push("```", "", "<!-- @visibility: private -->", "");
                        linkedInPrivateOpened = true;
                    }
                }
                linkedInSubsection = "";
                continue;
            }
            if (trimmed === "" && linkedInSubsection) {
                output.push("");
                index += 1;
                continue;
            }
            output.push(line);
            index += 1;
            continue;
        }

        if (!trimmed) {
            output.push("");
            index += 1;
            continue;
        }

        output.push(line);
        index += 1;
    }

    if (inLinkedInPaste) {
        output.push("```", "");
    }
    if (linkedInSubsection) {
        output.push("```", "");
    }

    return output.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function restoreSource(markdown) {
    if (!markdown.startsWith("---\n")) {
        throw new Error("source-of-truth.md missing frontmatter");
    }
    const end = markdown.indexOf("\n---\n", 4);
    const frontmatter = markdown.slice(0, end + 5);
    const body = markdown.slice(end + 5);
    if (body.includes("## Summary\n")) {
        return null;
    }
    return frontmatter + restoreBody(body);
}

const source = fs.readFileSync(sourceOfTruthPath, "utf8");
const restored = restoreSource(source);
if (!restored) {
    console.log("OK: source-of-truth.md already has markdown structure");
    process.exit(0);
}

fs.writeFileSync(sourceOfTruthPath, restored);
console.log(`Restored markdown structure in ${sourceOfTruthPath}`);
