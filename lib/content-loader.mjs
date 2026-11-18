import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMarkdownDocument } from './markdown.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');

function readJson(relPath) {
  const fullPath = path.join(CONTENT_DIR, relPath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function loadMarkdownDir(subDir) {
  const dirPath = path.join(CONTENT_DIR, subDir);
  if (!fs.existsSync(dirPath)) return [];
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith('.md'))
    .sort();

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(dirPath, filename), 'utf8');
    return parseMarkdownDocument(raw, filename);
  });
}

export function loadAllSiteData() {
  const site = readJson('site.json');
  const workbench = readJson('catalog/workbench.json');
  const ecosystem = readJson('catalog/ecosystem.json');
  const originals = loadMarkdownDir('originals');
  const curated = loadMarkdownDir('curated');
  const allArticles = [...originals, ...curated];
  const bySlug = new Map(allArticles.map((item) => [item.slug, item]));

  return {
    site,
    workbench,
    ecosystem,
    originals,
    curated,
    allArticles,
    bySlug,
  };
}
