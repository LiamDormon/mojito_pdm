// Script from https://github.com/pedr0fontoura/fivem-appearance/blob/main/release.js
// Under MIT license

const {promises: fs} = require("fs");
const path = require("path");

const RELEASE_PATH = path.resolve(__dirname, "release");
const RESOURCE_PATH = path.resolve(RELEASE_PATH, "mojito_pdm");

const FILES = ["fxmanifest.lua", "config.json", "README.md", "LICENSE"];

const TYPESCRIPT_BUILD_SRC = path.resolve(__dirname, "resources", "dist");
const UI_BUILD_SRC = path.resolve(__dirname, "ui", "build");

const TYPESCRIPT_BUILD_DEST = path.resolve(RESOURCE_PATH, "resources", "dist");
const UI_BUILD_DEST = path.resolve(RESOURCE_PATH, "ui", "build");

async function copyDir(src, dest) {
    await fs.mkdir(dest, {recursive: true});

    const entries = await fs.readdir(src, {withFileTypes: true});

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        entry.isDirectory()
            ? await copyDir(srcPath, destPath)
            : await fs.copyFile(srcPath, destPath);
    }
}

async function execute() {
    try {
        await fs.access(RELEASE_PATH);

        console.log("[mojito_pdm] Release folder exists");
        console.log("[mojito_pdm] Removing release folder...");

        await fs.rmdir(RELEASE_PATH, {recursive: true});
    } catch (err) {
        console.log(`[mojito_pdm] Release folder don't exist`);
    }

    console.log("[mojito_pdm] Creating release folder...");
    await fs.mkdir(RESOURCE_PATH, {recursive: true});

    console.log("[mojito_pdm] Copying files...");
    await copyDir(TYPESCRIPT_BUILD_SRC, TYPESCRIPT_BUILD_DEST);
    await copyDir(UI_BUILD_SRC, UI_BUILD_DEST);

    for (const file of FILES) {
        try {
            await fs.copyFile(
                path.join(__dirname, file),
                path.join(RESOURCE_PATH, file)
            );
        } catch (err) {
            console.log(err);
        }
    }

    console.log("[mojito_pdm] Release created!");
}

execute();