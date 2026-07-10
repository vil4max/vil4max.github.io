#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildResumeSourceFromFiles } from "../../career/resume/lib/resume-merge.mjs";
import {
    assertPresentationFilesExist,
    assertSourceOfTruthExists,
    presentationDetailedPath,
    presentationOnePagePath,
    publicResumeSourcePath,
    sourceOfTruthPath,
} from "./resume-paths.mjs";
import { stripPrivateFrontmatterBlock } from "../../career/resume/lib/resume-md-lib.mjs";

const outputPath = publicResumeSourcePath;

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

function extractLanguages() {
    return ["## Languages", "", "English — Upper-Intermediate (B2)"].join("\n");
}

function extractSkillsSection(detailedMarkdown) {
    const skillsStart = detailedMarkdown.indexOf("## Skills\n");
    const skillsEnd = detailedMarkdown.indexOf("\n## ", skillsStart + 1);
    if (skillsStart === -1 || skillsEnd === -1) {
        throw new Error("profile-autofill.md missing ## Skills section");
    }
    let skills = detailedMarkdown.slice(skillsStart, skillsEnd).trimEnd();
    skills = skills.replace(
        /### Analytics\n[\s\S]*?(?=\n### |\n## |$)/,
        "### Analytics\nanalytics SDK abstraction · multi-provider event routing",
    );
    skills = skills.replace(/### Line short\n[\s\S]*?(?=\n### Line\n)/, "");
    skills = skills.replace(/### Line\n[\s\S]*?(?=\n## |$)/, "");
    return skills.trimEnd();
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

assertSourceOfTruthExists();
assertPresentationFilesExist();

const source = buildResumeSourceFromFiles();
const factsMarkdown = fs.readFileSync(sourceOfTruthPath, "utf8");
const detailedMarkdown = fs.readFileSync(presentationDetailedPath, "utf8");
const frontmatter = stripPrivateFrontmatterBlock(extractFrontmatter(factsMarkdown));
const languages = extractLanguages();
const skills = extractSkillsSection(detailedMarkdown);
const experience = buildPublicExperience(source.roles);
const summary = source.meta.summary?.trim() ?? "";
const highlights = source.highlights ?? [];

const publicMarkdown = [
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

fs.writeFileSync(outputPath, publicMarkdown);
console.log(`Generated ${outputPath} from facts + presentation`);
