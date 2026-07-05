import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const careerRoot = path.join(root, "..", "career");

export const repoRoot = root;
export const sourceOfTruthPath = process.env.RESUME_SOURCE_OF_TRUTH?.trim()
    ? path.resolve(process.env.RESUME_SOURCE_OF_TRUTH)
    : path.join(careerRoot, "source-of-truth.md");

export function assertSourceOfTruthExists() {
    if (!fs.existsSync(sourceOfTruthPath)) {
        throw new Error(
            `Source of truth not found: ${sourceOfTruthPath}\n` +
                "Clone the private career repo as a sibling (Profile/career/) or set RESUME_SOURCE_OF_TRUTH.",
        );
    }
}
export const publicResumeSourcePath = path.join(root, "content", "resume.md");
export const publishedResumePath = path.join(root, "resume.md");
export const publishedProfilePath = path.join(root, "profile.md");
export const resumeSourceJsonPath = path.join(root, "content", "resume-source.json");
