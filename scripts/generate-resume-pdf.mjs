import { copyFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const repoRoot = process.cwd();
const args = process.argv.slice(2);

let inputHtmlPath;
let outputPath;

if (args.length === 0) {
    inputHtmlPath = path.resolve(repoRoot, "cv.html");
    outputPath = path.resolve(repoRoot, "../vil4max/assets/iOS_Vilchevskiy_CV.pdf");
} else if (args.length === 1) {
    inputHtmlPath = path.resolve(repoRoot, "cv.html");
    outputPath = path.resolve(repoRoot, args[0]);
} else {
    inputHtmlPath = path.resolve(repoRoot, args[0]);
    outputPath = path.resolve(repoRoot, args[1]);
}

await mkdir(path.dirname(outputPath), { recursive: true });

async function launchBrowser() {
    try {
        return await chromium.launch();
    } catch {
        return await chromium.launch({ channel: "chrome" });
    }
}

const browser = await launchBrowser();
const page = await browser.newPage({
    viewport: { width: 1440, height: 2200 },
});

await page.goto(pathToFileURL(inputHtmlPath).href, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print", colorScheme: "light" });

const isShort = path.basename(inputHtmlPath) === "index-short.html";

await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {
        top: "10mm",
        right: "10mm",
        bottom: "12mm",
        left: "10mm",
    },
    /* Short CV: uniform scale keeps the same proportions as full, fits ~2 pages */
    scale: isShort ? 0.9 : 1,
});

await browser.close();

const iCloudResumeDir = path.join(
    os.homedir(),
    "Library/Mobile Documents/com~apple~CloudDocs/pdf-resume",
);
const iCloudDestPath = path.resolve(iCloudResumeDir, path.basename(outputPath));
try {
    await mkdir(iCloudResumeDir, { recursive: true });
    await copyFile(outputPath, iCloudDestPath);
    console.log(`iCloud copy: ${iCloudDestPath}`);
} catch (error) {
    console.warn(`iCloud copy skipped: ${error?.message ?? String(error)}`);
}

console.log(`PDF generated: ${outputPath}`);
