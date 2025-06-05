import { execSync } from 'child_process';

function hasStagedChangesInFolder(folder) {
    try {
        const output = execSync(`git diff --cached --name-only ${folder}`, { encoding: 'utf-8' });
        return output.trim().length > 0;
    } catch {
        return false;
    }
}

const targetDir = "frontend";

if (hasStagedChangesInFolder(targetDir)) {
    process.chdir(targetDir);

    try {
        execSync('npm run lint:test', { stdio: 'inherit' });
    } catch {
        console.error('Lint check failed. Run "npm run lint" in frontend folder, and fix issues before committing.');
        process.exit(1);
    }

    try {
        execSync('npm run format:test', { stdio: 'inherit' });
    } catch {
        console.error('Format check failed. Please run "npm run format" in frontend folder before committing.');
        process.exit(1);
    }
}
else {
    console.log("No staged change in frontend folder. Skipping check.")
    process.exit(0);
}


