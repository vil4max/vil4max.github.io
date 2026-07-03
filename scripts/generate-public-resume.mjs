#!/usr/bin/env node
import fs from "node:fs";
import { parseResumeMarkdown } from "./resume-md-lib.mjs";
import { publicResumeSourcePath, sourceOfTruthPath } from "./resume-paths.mjs";

const outputPath = publicResumeSourcePath;

function extractSkillsSection(profileMarkdown) {
    const skillsStart = profileMarkdown.indexOf("## Skills\n");
    const skillsEnd = profileMarkdown.indexOf("\n## ", skillsStart + 1);
    if (skillsStart === -1 || skillsEnd === -1) {
        throw new Error("source-of-truth.md missing ## Skills section");
    }
    let skills = profileMarkdown.slice(skillsStart, skillsEnd).trimEnd();
    skills = skills.replace(
        /### Analytics\n[\s\S]*?(?=\n### |\n## |$)/,
        "### Analytics\nanalytics SDK abstraction · multi-provider event routing",
    );
    skills = skills.replace(
        /### AI & agentic tooling\n[\s\S]*?(?=\n### |\n## |$)/,
        "### AI & agentic tooling\nAI-assisted engineering",
    );
    return skills;
}

function extractFrontmatter(profileMarkdown) {
    if (!profileMarkdown.startsWith("---\n")) {
        return "";
    }
    const end = profileMarkdown.indexOf("\n---\n", 4);
    if (end === -1) {
        return "";
    }
    return profileMarkdown.slice(0, end + 5);
}

function extractLanguages(profileMarkdown) {
    const start = profileMarkdown.indexOf("## Languages\n");
    const end = profileMarkdown.indexOf("\n## ", start + 1);
    if (start === -1 || end === -1) {
        return "";
    }
    return profileMarkdown.slice(start, end).trimEnd();
}

function buildPublicExperience(roles) {
    const blocks = ["## Professional Experience", ""];
    for (const role of roles) {
        blocks.push(`### ${role.company}`, "");
        blocks.push(`#### Product`, "", role.productDescription ?? role.project ?? "", "");
        if (role.myRole) {
            blocks.push(`#### My role`, "", role.myRole, "");
        }
        const bullets =
            role.featured && role.bulletsShort?.length ? role.bulletsShort : (role.bullets ?? []);
        blocks.push(`#### Responsibilities`, "", ...bullets.map((item) => `- ${item}`), "");
    }
    return blocks.join("\n").trimEnd();
}

function buildPublicResume(profileMarkdown) {
    const parsed = parseResumeMarkdown(profileMarkdown);
    const frontmatter = extractFrontmatter(profileMarkdown);
    const languages = extractLanguages(profileMarkdown);
    const skills = extractSkillsSection(profileMarkdown);
    const experience = buildPublicExperience(parsed.roles);

    const summary = parsed.meta.summary?.trim() ?? "";
    const highlights = parsed.highlights ?? [];

    return [
        frontmatter.trimEnd(),
        "# Max Vilchevskiy",
        "",
        "> iOS Software Engineer · Kyiv, Ukraine",
        "",
        languages,
        "",
        "## Summary",
        "",
        summary,
        "",
        "## Highlights",
        "",
        ...highlights.map((item) => `- ${item}`),
        "",
        skills,
        "",
        experience,
        "",
    ]
        .filter((block, index, array) => !(block === "" && index === array.length - 1))
        .join("\n")
        .trimEnd()
        .concat("\n");
}

const sourceMarkdown = fs.readFileSync(sourceOfTruthPath, "utf8");
const publicMarkdown = buildPublicResume(sourceMarkdown);
fs.writeFileSync(outputPath, publicMarkdown);
console.log(`Generated ${outputPath} from ${sourceOfTruthPath}`);
