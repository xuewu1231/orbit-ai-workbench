import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMarkdownDocument } from './markdown.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');

function readJson(relPath, fallback = null) {
  const fullPath = path.join(CONTENT_DIR, relPath);
  if (!fs.existsSync(fullPath)) return fallback;
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

function parseSkillFile(raw, filename) {
  const meta = {};
  let body = raw;
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (fmMatch) {
    const fmLines = fmMatch[1].split(/\r?\n/);
    for (const line of fmLines) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (val === 'true') meta[key] = true;
      else if (val === 'false') meta[key] = false;
      else meta[key] = val;
    }
    body = fmMatch[2].trim();
  }
  const cleanPlain = body
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();

  const slug = meta.id || filename.replace(/^\d+-/, '').replace(/\.md$/, '');
  return {
    slug,
    filename,
    name: meta.name || slug,
    trigger: meta.trigger || '',
    version: meta.version || '1.0',
    scope: meta.scope || 'Skill',
    demo: Boolean(meta.demo),
    rawContent: raw.trim() + '\n',
    bodyMarkdown: body,
    plainPrompt: `技能名称：${meta.name || slug}\n触发场景：${meta.trigger || ''}\n\n${cleanPlain}`,
  };
}

function loadSkillCapsules() {
  const dirPath = path.join(CONTENT_DIR, 'skills');
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dirPath, filename), 'utf8');
      return parseSkillFile(raw, filename);
    });
}

export function loadAllSiteData() {
  const site = readJson('site.json');
  const workbench = readJson('catalog/workbench.json');
  const ecosystem = readJson('catalog/ecosystem.json');
  const originals = loadMarkdownDir('originals');
  const curated = loadMarkdownDir('curated');
  const seen = loadMarkdownDir('seen');
  const skills = loadSkillCapsules();
  const depot = {
    signals: readJson('depot/signals.json', []),
    radar: readJson('depot/radar.json', []),
    teardowns: readJson('depot/teardowns.json', []),
    standards: readJson('depot/standards.json', []),
    creator: readJson('depot/creator.json', {}),
  };
  const allArticles = [...originals, ...curated, ...seen];
  const bySlug = new Map(allArticles.map((item) => [item.slug, item]));

  return {
    site,
    workbench,
    ecosystem,
    originals,
    curated,
    seen,
    skills,
    depot,
    allArticles,
    bySlug,
  };
}
