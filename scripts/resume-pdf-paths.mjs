import path from "node:path";
import {
    PDF_CANONICAL_FILENAME,
    onePageBuildPdfPath,
    pdfAssetsDir,
    pdfCanonicalAssetsPath,
    resumeBuildDir,
} from "../../career/resume/lib/pdf-paths.mjs";

export {
    PDF_CANONICAL_FILENAME,
    onePageBuildPdfPath,
    pdfAssetsDir,
    pdfCanonicalAssetsPath,
    resumeBuildDir,
};

export const PDF_DETAILED_HTML = "profile-autofill.html";
export const PDF_AUTOFILL_HTML = PDF_DETAILED_HTML;
export const PDF_AUTOFILL_FILENAME = "Max_Vilchevskiy_Profile_Autofill.pdf";
export const autofillBuildPdfPath = path.join(resumeBuildDir, PDF_AUTOFILL_FILENAME);
