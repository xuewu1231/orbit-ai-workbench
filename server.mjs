import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT_DIR, loadAllSiteData } from './lib/content-loader.mjs';
import {
  renderHomePage,
  renderCatalogPage,
  renderCreatorPage,
  renderProductsPage,
  renderEcosystemPage,
  renderKitPage,
  renderLearningPage,
  renderReaderPage,
  renderLlmsTxt,
  renderRoleContextTxt,
  buildVaultExport,
} from './lib/templates.mjs';

const PORT = Number(process.env.PORT || 4321);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const ECO_PATH = path.join(ROOT_DIR, 'content', 'catalog', 'ecosystem.json');

const KIND_META = {
  'agent-ui': { shelf: 'design', label: 'AI 与 Agent 界面' },
  'ui-lib': { shelf: 'design', label: '通用与拟物组件' },
  motion: { shelf: 'design', label: '微交互与动效' },
  icons: { shelf: 'design', label: '动态图标与矢量' },
  loader: { shelf: 'design', label: '思考与等待动画' },
  'webgl-3d': { shelf: 'design', label: '3D 空间与着色器' },
  landing: { shelf: 'design', label: '产品官网标杆' },
  'design-site': { shelf: 'design', label: '产品官网标杆' },
  personal: { shelf: 'design', label: '个人主页与花园' },
  'bento-data': { shelf: 'design', label: 'Bento 与数据看板' },
  style: { shelf: 'design', label: '字体排印与色板' },
  gallery: { shelf: 'design', label: '审美图鉴目录' },
  'prompt-hub': { shelf: 'learning', label: 'Prompt / Bot 市场' },
  guide: { shelf: 'learning', label: '学习指南' },
  skill: { shelf: 'toolkit', label: 'Skill' },
  workflow: { shelf: 'toolkit', label: '工作流' },
  'ai-tool': { shelf: 'toolkit', label: 'AI 工具' },
};

const MIME_MAP = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
};

function appendJsonLog(filename, record) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, filename);
  let list = [];
  if (fs.existsSync(filePath)) {
    try { list = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { list = []; }
  }
  list.push({ ...record, createdAt: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');
}

function readRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 65_536) req.destroy();
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { resolve({}); }
    });
  });
}

function sendJson(res, obj) {
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}

function sendHtml(res, html) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function addVaultItem(payload) {
  const ecoData = JSON.parse(fs.readFileSync(ECO_PATH, 'utf8'));
  const kind = KIND_META[payload.kind] ? payload.kind : 'design-site';
  const meta = KIND_META[kind];
  const raw = String(payload.urlOrCmd || '').trim();
  const isUrl = /^https?:\/\//.test(raw);
  const swatches = String(payload.swatches || '')
    .split(/[,，\s]+/)
    .map((s) => s.trim())
    .filter((s) => /^#[0-9a-fA-F]{3,8}$/.test(s));
  const borrow = String(payload.borrow || '')
    .split(/\n+/)
    .map((s) => s.replace(/^[-\d.、\s]+/, '').trim())
    .filter(Boolean);

  const item = {
    id: 'v-' + Date.now().toString(36),
    shelf: meta.shelf,
    kind,
    kindLabel: meta.label,
    name: String(payload.name).trim(),
    tag: String(payload.tag || '新收录').trim(),
    ...(isUrl ? { url: raw } : raw ? { installCmd: raw } : {}),
    ...(/^(https?:\/\/|\/)/.test(String(payload.icon || '').trim()) ? { icon: String(payload.icon).trim() } : {}),
    ...(swatches.length ? { swatches } : {}),
    whyGood: String(payload.whyGood).trim(),
    ...(borrow.length ? { borrow } : {}),
    whenToUse: String(payload.whenToUse || '相关项目里参考复用。').trim(),
  };
  ecoData.vaultItems = [item, ...(ecoData.vaultItems || [])];
  fs.writeFileSync(ECO_PATH, JSON.stringify(ecoData, null, 2), 'utf8');
}

function writesEnabled() {
  if (process.env.ORBIT_ALLOW_WRITES === '1') return true;
  if (process.env.ORBIT_ALLOW_WRITES === '0') return false;
  return process.env.NODE_ENV !== 'production';
}

const server = http.createServer(async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    const urlObj = new URL(req.url || '/', `http://localhost:${PORT}`);
    const pathname = urlObj.pathname.replace(/\/+$/, '') || '/';

    if (req.method === 'POST' && (pathname === '/api/vault-add' || pathname === '/api/subscribe' || pathname === '/api/feedback') && !writesEnabled()) {
      res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'writes-disabled' }));
      return;
    }

    if (req.method === 'POST' && pathname === '/api/vault-add') {
      const payload = await readRequestBody(req);
      if (payload.name && payload.whyGood) addVaultItem(payload);
      return sendJson(res, { ok: true });
    }
    if (req.method === 'POST' && pathname === '/api/subscribe') {
      const payload = await readRequestBody(req);
      if (payload.email) appendJsonLog('subscribers.json', { email: String(payload.email) });
      return sendJson(res, { ok: true });
    }
    if (req.method === 'POST' && pathname === '/api/feedback') {
      const payload = await readRequestBody(req);
      if (payload.message) {
        appendJsonLog('feedback.json', {
          slug: String(payload.slug || 'general'),
          message: String(payload.message),
          contact: String(payload.contact || ''),
        });
      }
      return sendJson(res, { ok: true });
    }

    const staticCandidate = path.join(PUBLIC_DIR, pathname.slice(1));
    if (
      pathname !== '/' &&
      staticCandidate.startsWith(PUBLIC_DIR) &&
      fs.existsSync(staticCandidate) &&
      fs.statSync(staticCandidate).isFile()
    ) {
      const ext = path.extname(staticCandidate).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_MAP[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(staticCandidate));
      return;
    }

    const data = loadAllSiteData();

    if (pathname === '/llms.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(renderLlmsTxt(data));
      return;
    }
    if (pathname === '/context/design.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(renderRoleContextTxt(data, 'design'));
      return;
    }
    if (pathname === '/context/creator.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(renderRoleContextTxt(data, 'creator'));
      return;
    }
    if (pathname === '/context/skills.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(renderRoleContextTxt(data, 'skills'));
      return;
    }
    if (pathname.startsWith('/skills/') && pathname.endsWith('.md')) {
      const slug = decodeURIComponent(pathname.slice('/skills/'.length, -3));
      const found = (data.skills || []).find((s) => s.slug === slug);
      if (found) {
        res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' });
        res.end(found.rawContent);
        return;
      }
    }
    if (pathname === '/vault.json') return sendJson(res, buildVaultExport(data));
    if (pathname === '/') return sendHtml(res, renderHomePage(data));
    if (pathname === '/originals' || pathname === '/depot') return sendHtml(res, renderCatalogPage(data, 'originals'));
    if (pathname === '/creator') return sendHtml(res, renderCreatorPage(data));
    if (pathname === '/curated') return sendHtml(res, renderCatalogPage(data, 'curated'));
    if (pathname === '/products') return sendHtml(res, renderProductsPage(data));
    if (pathname === '/ecosystem' || pathname === '/vault') return sendHtml(res, renderEcosystemPage(data));
    if (pathname === '/kit') return sendHtml(res, renderKitPage(data));
    if (pathname === '/learning') return sendHtml(res, renderLearningPage(data));

    if (pathname.startsWith('/read/')) {
      const article = data.bySlug.get(decodeURIComponent(pathname.slice('/read/'.length)));
      if (article) return sendHtml(res, renderReaderPage(data, article));
    }

    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 · 页面不存在</h1><p><a href="/">返回工作台</a></p>');
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>页面正在更新，请刷新重试</h1>');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Orbit AI Workbench running at http://localhost:${PORT}`);
});
