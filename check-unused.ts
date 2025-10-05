import { execSync } from "child_process";
import fs from "fs";
import path from "path";

interface Config {
    readonly ignoreUsedInModule: boolean;
    readonly rules: ReadonlyArray<{
        readonly files: readonly string[];
        readonly exports: readonly string[];
    }>;
}

interface ParsedLine {
    readonly file: string;
    readonly lineNumber: string;
    readonly exportName: string;
    readonly usedInModule: boolean;
}

(async () => {
    await main();
})();

async function main(): Promise<void> {
    const config = loadConfig();
    const output = runTsPrune();
    const lines = output.split("\n").filter((line) => line.trim());

    const filtered: string[] = [];

    for (const line of lines) {
        const parsed = parseLine(line);
        if (parsed === null) {
            continue;
        }

        if (!shouldIgnore(parsed, config)) {
            filtered.push(line);
        }
    }

    if (filtered.length === 0) {
        console.log("✓ No unused exports found!");
        process.exit(0);
    } else {
        console.log(`Found ${filtered.length} potentially unused export(s):\n`);
        filtered.forEach((line) => console.log(line));
        process.exit(1);
    }
}

function loadConfig(): Config {
    const configPath = path.join(process.cwd(), ".ts-prune.json");
    if (!fs.existsSync(configPath)) {
        console.error("Error: .ts-prune.json not found");
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

function runTsPrune(): string {
    return execSync("npx ts-prune", {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "ignore"],
    });
}

function parseLine(line: string): ParsedLine | null {
    // Format: "file.ts:123 - exportName" or "file.ts:123 - exportName (used in module)"
    const match = line.match(/^(.+):(\d+) - (.+?)( \(used in module\))?$/);
    if (match === null) {
        return null;
    }

    return {
        file: match[1],
        lineNumber: match[2],
        exportName: match[3],
        usedInModule: match[4] !== undefined,
    };
}

function shouldIgnore(parsed: ParsedLine, config: Config): boolean {
    // Ignore if marked as "used in module" and config says to ignore.
    if (parsed.usedInModule && config.ignoreUsedInModule) {
        return true;
    }

    // Check each rule.
    for (const rule of config.rules) {
        // Check if file matches any pattern in this rule.
        const fileMatches = rule.files.some((pattern) => new RegExp(pattern).test(parsed.file));

        if (fileMatches) {
            // If file matches, check if export matches any export pattern in this rule.
            const exportMatches = rule.exports.some((pattern) => new RegExp(`^${pattern}$`).test(parsed.exportName));
            if (exportMatches) {
                return true;
            }
        }
    }

    return false;
}
