import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const repoRoot = process.cwd();
const args = process.argv.slice(2);

let inputHtmlPath;
let outputPath;

if (args.length === 0) {
    inputHtmlPath = path.resolve(repoRoot, "index.html");
    outputPath = path.resolve(repoRoot, "../vil4max/assets/iOS_Vilchevskiy_CV.pdf");
} else if (args.length === 1) {
    inputHtmlPath = path.resolve(repoRoot, "index.html");
    outputPath = path.resolve(repoRoot, args[0]);
} else {
    inputHtmlPath = path.resolve(repoRoot, args[0]);
    outputPath = path.resolve(repoRoot, args[1]);
}

await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch();
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

console.log(`PDF generated: ${outputPath}`);
