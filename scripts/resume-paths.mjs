import path from "node:path";
import { careerRoot } from "../../career/resume/lib/resume-paths.mjs";

export * from "../../career/resume/lib/resume-paths.mjs";

export const resumeSourceJsonPath = path.join(careerRoot, "resume", "build", "resume-source.json");
export const resumeSourceJsonTmpPath = path.join(
    careerRoot,
    "resume",
    "build",
    ".resume-source.json.tmp",
);
