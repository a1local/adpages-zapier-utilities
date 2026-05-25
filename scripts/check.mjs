import { readdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const files = await listFiles(root);
const scriptFiles = files.filter((file) => /\.(mjs|js)$/.test(file));
const forbiddenPatterns = [
  /\bfetch\s*\(/i,
  /\bXMLHttpRequest\b/i,
  /\baxios\b/i,
  /\bhttps?\.request\b/i,
  /\bapi[_-]?key\b/i,
  /\btoken\b/i,
  /\bpassword\b/i,
  /\bscrap(e|ing|er)\b/i,
  /\benrich(ment)?\b/i,
  /\boutreach\b/i
];

for (const file of scriptFiles) {
  const check = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (check.status !== 0) {
    process.stderr.write(check.stderr || check.stdout);
    process.exit(check.status || 1);
  }
}

for (const file of scriptFiles) {
  const text = await readFile(file, "utf8");
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) {
      throw new Error(`Forbidden surface matched ${pattern} in ${relative(root, file)}`);
    }
  }
}

console.log(`Checked ${scriptFiles.length} JavaScript files and ${files.length} scaffold files.`);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...await listFiles(path));
    } else {
      results.push(path);
    }
  }

  return results;
}
