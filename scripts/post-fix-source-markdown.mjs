#!/usr/bin/env node
import fs from "node:fs";
import { sourceOfTruthPath } from "./resume-paths.mjs";

let source = fs.readFileSync(sourceOfTruthPath, "utf8");

source = source.replace(
    /(## Professional Experience\n\n)([^\n#][^\n]+)\n\n(- \*\*Id:\*\*)/g,
    "$1### $2\n\n$3",
);

source = source.replace(
    /(## Other production projects\n\n)([^\n#][^\n]+)\n\n(- \*\*Id:\*\*)/g,
    "$1### $2\n\n$3",
);

source = source.replace(/(#### LinkedIn paste\n\n```\n[\s\S]*?)\n\n([A-Z][^\n]+)\n\n- \*\*Id:\*\*/g, (match, block, company) => {
    if (block.endsWith("```")) {
        return match;
    }
    return `${block}\n\`\`\`\n\n### ${company}\n\n- **Id:**`;
});

const linkedInAbout = `I have over 12 years of commercial iOS experience, working with both startups and large-scale product teams. I have delivered applications across multiple iOS generations, made key architectural decisions, and integrated numerous third-party libraries and SDKs. I managed the Premium Subscription module, overseeing subscription flows, UI, purchase integration, and status management. I also transformed this module into a shared SDK for multiple host apps, developing isolated modules, a dedicated networking layer, and internal models. I have shipped features in major production apps, including the marketplace loyalty squad and Drinkit coffee QSR, where I contributed to pre-order and customization as part of a small iOS team. My approach is product-focused, emphasizing value beyond simply following specifications.

I have practical experience with AI, including watchOS voice AI R&D and the VelocityAI beta. I use coding agents such as Cursor, Composer, Copilot, ChatGPT, Codex, Claude, and Gemini for development, testing, and refactoring.`;

const linkedInHeadline =
    "Senior iOS Engineer · Premium Subscription SDK · Analytics module · watchOS AI · Swift · SwiftUI · UIKit";

const linkedInSkills =
    "Swift · Objective-C · SwiftUI · UIKit · watchOS · SPM · CocoaPods · Swift Concurrency · async/await · Combine · RxSwift · URLSession · URLSessionWebSocketTask · Alamofire · REST · Core Data · SwiftData · Keychain · analytics SDK abstraction · AVFoundation · AVAudioEngine · WatchKit · WatchConnectivity · PassKit · Apple Pay · Firebase Analytics · XCTest · TestFlight · Stripe · MVVM · DI · AI coding agents";

source = source.replace(
    /## LinkedIn profile[\s\S]*?(?=\n## Application metadata)/,
    `## LinkedIn profile

### About

\`\`\`
${linkedInAbout}
\`\`\`
<!-- @visibility: private -->

### Headline

\`\`\`
${linkedInHeadline}
\`\`\`

### Skills line

\`\`\`
${linkedInSkills}
\`\`\`
`,
);

source = source.replace(
    /## Application metadata[\s\S]*$/,
    `## Application metadata

<!-- @visibility: private -->

For job application forms only — not published on the site or public resume.md.

Availability: Available from Jul 2026 · remote or hybrid Kyiv

Header availability: Available Jul 2026 · remote or hybrid

Primary skill: iOS Swift

Years experience: 12+

English level: Intermediate

Notice period: Available now

Country / city: Ukraine · Kyiv

Preferred work countries: Ukraine
`,
);

source = source.replace(/(## Highlights\n\n)([\s\S]*?)(\n## Skills)/, (_, head, body, tail) => {
    const bullets = body
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => (line.startsWith("- ") ? line : `- ${line}`))
        .join("\n");
    return `${head}${bullets}${tail}`;
});

source = source.replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(sourceOfTruthPath, source.trimEnd() + "\n");
console.log(`Post-fixed ${sourceOfTruthPath}`);
