import fs from 'node:fs';
import path from 'node:path';
import { ROOT_DIR, loadAllSiteData } from '../lib/content-loader.mjs';
import {
  renderHomePage,
  renderCatalogPage,
  renderProductsPage,
  renderEcosystemPage,
  renderReaderPage,
  renderLlmsTxt,
  buildVaultExport,
} from '../lib/templates.mjs';

const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

function writeRoute(routePath, html) {
  const targetFile = routePath === '/' ? path.join(DIST_DIR, 'index.html') : path.join(DIST_DIR, routePath.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, html, 'utf8');
}

fs.rmSync(DIST_DIR, { recursive: true, force: true });
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.cpSync(PUBLIC_DIR, DIST_DIR, { recursive: true });

const data = loadAllSiteData();
writeRoute('/', renderHomePage(data));
writeRoute('/originals', renderCatalogPage(data, 'originals'));
writeRoute('/curated', renderCatalogPage(data, 'curated'));
writeRoute('/products', renderProductsPage(data));
writeRoute('/ecosystem', renderEcosystemPage(data));
for (const article of data.allArticles) writeRoute(`/read/${article.slug}`, renderReaderPage(data, article));

fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), renderLlmsTxt(data), 'utf8');
fs.writeFileSync(path.join(DIST_DIR, 'vault.json'), JSON.stringify(buildVaultExport(data), null, 2), 'utf8');
fs.writeFileSync(path.join(DIST_DIR, '.nojekyll'), '', 'utf8');

const base = (process.env.BASE_PATH || '').replace(/\/+$/, '');
const home = base ? `${base}/` : '/';
fs.writeFileSync(
  path.join(DIST_DIR, '404.html'),
  `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>页面不存在</title><meta http-equiv="refresh" content="0;url=${home}"></head><body><p><a href="${home}">返回工作台</a></p></body></html>`,
  'utf8',
);

console.log(`Built ${data.allArticles.length + 5} pages + llms.txt + vault.json into ${DIST_DIR}`);
