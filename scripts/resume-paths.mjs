import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export const repoRoot = root;
export const sourceOfTruthPath = path.join(root, "content", "source-of-truth.md");
export const publicResumeSourcePath = path.join(root, "content", "resume.md");
export const publishedResumePath = path.join(root, "resume.md");
export const publishedProfilePath = path.join(root, "profile.md");
export const resumeSourceJsonPath = path.join(root, "content", "resume-source.json");
