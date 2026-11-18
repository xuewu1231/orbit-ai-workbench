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

console.log(`Built ${data.allArticles.length + 5} pages + llms.txt + vault.json into ${DIST_DIR}`);
