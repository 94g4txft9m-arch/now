/**
 * Lokálne zrkadlenie GitHub Pages (project site): BASE_PATH = /názov-repa
 * a NEXT_PUBLIC_SITE_URL ako na github.io. Pri premenovaní repa upravte
 * package.json → repository.url (alebo nastavte NEXT_PUBLIC_SITE_URL ručne).
 */
const { readFileSync } = require("fs");
const { join } = require("path");
const { spawn } = require("child_process");

const root = join(__dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

function parseGithubRepo(url) {
  if (!url) return null;
  const m = String(url).match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/i);
  if (!m) return null;
  return { owner: m[1], name: m[2] };
}

const repo = parseGithubRepo(pkg.repository?.url);
const repoSlug = repo?.name || String(pkg.name).replace(/^@[^/]+\//, "");
const basePath = `/${repoSlug}`;

const mode = process.argv[2] || "dev";
const port = process.env.PORT || "3000";

let siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) {
  if (mode === "dev") {
    siteUrl = `http://localhost:${port}${basePath}`;
  } else {
    const owner = repo?.owner || process.env.GITHUB_OWNER || "94g4txft9m-arch";
    siteUrl = `https://${owner}.github.io${basePath}`;
  }
}

siteUrl = siteUrl.replace(/\/$/, "");

console.error(
  `[pages] mode=${mode} BASE_PATH=${basePath} NEXT_PUBLIC_SITE_URL=${siteUrl}`
);

const env = {
  ...process.env,
  BASE_PATH: basePath,
  NEXT_PUBLIC_SITE_URL: siteUrl,
};

const isWin = process.platform === "win32";
const nextBin = join(root, "node_modules", ".bin", isWin ? "next.cmd" : "next");
const args = mode === "dev" ? ["dev"] : ["build"];
const child = spawn(nextBin, args, {
  stdio: "inherit",
  env,
  cwd: root,
  shell: isWin,
});
child.on("exit", (code) => process.exit(code ?? 0));
