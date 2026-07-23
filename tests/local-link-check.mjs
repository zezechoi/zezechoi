import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pages = ["index.html", "archive.html", "cv.html"];
const errors = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

for (const page of pages) {
  const pagePath = path.join(root, page);
  const html = await readFile(pagePath, "utf8");
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);

  for (const reference of references) {
    if (/^(?:https?:|mailto:|javascript:|data:)/.test(reference)) continue;

    const [filePart, fragment] = reference.split("#");
    const targetPath = filePart ? path.resolve(path.dirname(pagePath), filePart) : pagePath;
    if (!(await exists(targetPath))) {
      errors.push(`${page}: missing local target ${reference}`);
      continue;
    }

    if (fragment && path.extname(targetPath).toLowerCase() === ".html") {
      const targetHtml = await readFile(targetPath, "utf8");
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`id=["']${escaped}["']`).test(targetHtml)) {
        errors.push(`${page}: missing fragment ${reference}`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Local link checks failed (${errors.length}):`);
  errors.forEach(error => console.error(` - ${error}`));
  process.exit(1);
}

console.log("Local link checks passed for index.html, archive.html, cv.html, assets, scripts, fragments, and CV PDF.");
