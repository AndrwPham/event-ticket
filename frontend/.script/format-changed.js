import { execSync } from "child_process";
import path from "path";

const targetDir = "frontend";

// list out all changed file in targetDir.
const changedFiles = execSync(`git diff --cached --name-only ../${targetDir}`)
    .toString()
    .split("\n")
    .map((filePath) => filePath.trim())
    .filter((file) => file.startsWith("frontend/src/") && /\.(ts|tsx|js|jsx)$/.test(file))
    .map((filePath) => path.relative(targetDir, filePath));

if (changedFiles.length === 0) {
    console.log(`No staged change found in ${targetDir}, exiting.`);
    process.exit(0);
}

try {
    execSync(`npx prettier ${changedFiles.join(" ")} --check --ignore-unknown`, { stdio: "inherit" });
} catch {
    console.error(
        "Lint check failed. Run 'npm run lint' to attempt to automatically rectify the problems, then fix the remaining one before committing.",
    );
    process.exit(1);
}

console.log("Everything seems good!")