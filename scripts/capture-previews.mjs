/**
 * Capture viewport screenshots for vault sites that have no local preview.
 * Uses the system Chrome DevTools protocol. No npm dependencies.
 *
 *   node scripts/capture-previews.mjs
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'previews');
const PORT = 9333;

const SITES = [
  ['pasta-ui', 'https://pastaui.com'],
  ['prompt-kit', 'https://www.prompt-kit.com'],
  ['assistant-ui', 'https://www.assistant-ui.com'],
  ['mikes-cv', 'https://www.mikes.cv'],
  ['directoryyy', 'https://directoryyy.com'],
  ['loader-buttons', 'https://loader-buttons.appllama.io'],
  ['thinking-orbs', 'https://libraries.dev/orbs'],
  ['morphicons', 'https://www.morphicons.com'],
  ['dissolve', 'https://dissolve.rselmi.com'],
  ['kubai-icons', 'https://icons.kubai.design'],
  ['great-ui', 'https://www.great-ui.com/components'],
  ['spec-01', 'https://spec-01.vercel.app'],
  ['spherium', 'https://tryspherium.com'],
  ['linear', 'https://linear.app'],
  ['teenage', 'https://teenage.engineering'],
  ['shadcn', 'https://ui.shadcn.com'],
  ['motion-primitives', 'https://motion-primitives.com'],
  ['usegrokbot', 'https://usegrokbot.com/zh-cn'],
  ['vibedesign', 'https://vibedesign.tips'],
  ['natochi', 'https://natochi.cv'],
  ['oil-book', 'https://book.oiloil.org'],
  ['betteropc', 'https://betteropc.com'],
  ['grokbot-guide', 'https://grokbotguide.pages.dev'],
  ['weilanx', 'https://weilanx.com/about'],
  ['weilanx-works', 'https://pages.weilanx.com/works/'],
  ['ant-design-x', 'https://x.ant.design/components/bubble', 280],
  ['ai-sdk-ui', 'https://elements.ai-sdk.dev/components/conversation', 220, '', 2200],
  [
    'construct-design',
    'https://www.tobiadonadon.com/projects/construct/design',
    720,
    `(() => {
      const tab = [...document.querySelectorAll('a,button')].find((n) => /^components$/i.test((n.textContent || '').trim()));
      if (tab) tab.click();
    })()`,
  ],
  ['uiball-ldrs', 'https://uiball.com/ldrs', 1180],
  [
    'css-loaders',
    'https://css-loaders.com',
    0,
    `(() => {
      const style = document.createElement('style');
      style.textContent = 'body:before, body:after { display: none !important; content: none !important; -webkit-mask: none !important; }';
      document.head.appendChild(style);
      document.querySelectorAll('#carbonads,.carbon-wrap,[id*="carbon"]').forEach((el) => el.remove());
    })()`,
  ],
  ['pqoqubbw-icons', 'https://icons.pqoqubbw.dev', 560],
  [
    'phosphor-icons',
    'https://phosphoricons.com',
    1280,
    `(() => {
      for (const el of [...document.querySelectorAll('div,section,aside')]) {
        const text = el.innerText || '';
        if ((/renaming icons/i.test(text) || /processing donations/i.test(text)) && text.length < 420) el.remove();
      }
    })()`,
  ],
  ['origin-ui', 'https://originui.com', 420],
  ['godly', 'https://godly.website', 160],
  ['calltoinspiration', 'https://calltoinspiration.com', 160],
  ['raycast', 'https://www.raycast.com', 0],
  ['resend', 'https://resend.com', 0],
  [
    'fey',
    'https://web.archive.org/web/20240503173927/https://www.fey.com/',
    0,
    `(() => {
      document.getElementById('wm-ipp-base')?.remove();
      document.querySelector('#wm-ipp')?.remove();
      const imgs = [...document.images].filter((node) => /watchlist/i.test(node.alt || ''));
      const img = imgs[0];
      if (!img) return;
      for (const other of imgs.slice(1)) other.style.display = 'none';
      for (const el of document.querySelectorAll('body *')) el.style.visibility = 'hidden';
      let node = img;
      while (node) {
        node.style.visibility = 'visible';
        node = node.parentElement;
      }
      img.scrollIntoView({ block: 'center', inline: 'start' });
    })()`,
    4500,
  ],
  ['paper-shaders', 'https://shaders.paper.design', 200],
  ['cobe-globe', 'https://cobe.vercel.app', 80],
  ['unicorn-studio', 'https://www.unicorn.studio', 80],
  ['bentogrids', 'https://bentogrids.com', 200],
  ['tremor', 'https://www.tremor.so/docs/visualizations/area-chart', 160],
  ['observable-plot', 'https://observablehq.github.io/plot/', 360],
  ['evil-charts', 'https://evilcharts.com', 280],
  ['radix-colors', 'https://www.radix-ui.com/colors', 220],
  ['fontshare', 'https://www.fontshare.com', 80],
  ['utopia-fluid', 'https://utopia.fyi', 80],
  ['cult-ui', 'https://www.cult-ui.com/docs/components/dynamic-island', 180],
  ['animations-dev', 'https://animations.dev', 80],
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPort() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return res.json();
    } catch {
      /* chrome still booting */
    }
    await sleep(150);
  }
  throw new Error('Chrome did not open a DevTools port');
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 0;
  const pending = new Map();
  const listeners = new Set();

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject, timer } = pending.get(msg.id);
      clearTimeout(timer);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
      else resolve(msg.result);
    } else if (msg.method) {
      for (const listener of listeners) listener(msg);
    }
  });

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', () => reject(new Error('DevTools socket failed')));
  });

  function send(method, params = {}, sessionId, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`timeout ${method}`));
      }, timeoutMs);
      pending.set(id, { resolve, reject, timer });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }

  function once(method, sessionId, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        listeners.delete(onMsg);
        reject(new Error(`timeout event ${method}`));
      }, timeoutMs);
      function onMsg(msg) {
        if (msg.method === method && (!sessionId || msg.sessionId === sessionId)) {
          clearTimeout(timer);
          listeners.delete(onMsg);
          resolve(msg.params || {});
        }
      }
      listeners.add(onMsg);
    });
  }

  return { ready, send, once, close: () => ws.close() };
}

async function captureOne(browser, name, url, scrollY = 0, prep = '', extraWait = 0) {
  const outPath = path.join(OUT_DIR, `${name}.jpg`);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  try {
    await browser.send('Page.enable', {}, sessionId);
    await browser.send('Network.enable', {}, sessionId);
    await browser.send(
      'Network.setUserAgentOverride',
      {
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        acceptLanguage: 'en-US,en;q=0.9',
        platform: 'MacIntel',
      },
      sessionId,
    );
    await browser.send(
      'Emulation.setDeviceMetricsOverride',
      { width: 1200, height: 750, deviceScaleFactor: 1, mobile: false },
      sessionId,
    );
    const loaded = browser.once('Page.loadEventFired', sessionId, 14000);
    await browser.send('Page.navigate', { url }, sessionId);
    try {
      await loaded;
    } catch {
      /* capture whatever painted */
    }
    await sleep((name === 'weilanx' ? 5200 : 1600) + (Number(extraWait) || 0));
    if (prep) {
      await browser.send('Runtime.evaluate', { expression: prep }, sessionId);
      await sleep(name === 'fey' ? 2000 : 900);
    }
    if (scrollY) {
      await browser.send('Runtime.evaluate', { expression: `window.scrollTo(0, ${Number(scrollY) || 0})` }, sessionId);
      await sleep(name === 'fey' ? 2200 : 500);
    }
    const shot = await browser.send(
      'Page.captureScreenshot',
      { format: 'jpeg', quality: 68, fromSurface: true, captureBeyondViewport: false },
      sessionId,
    );
    const buf = Buffer.from(shot.data, 'base64');
    if (buf.length < 4000) throw new Error(`screenshot too small (${buf.length} bytes)`);
    fs.writeFileSync(outPath, buf);
    console.log(`ok ${name} ${Math.round(buf.length / 1024)}KB`);
  } finally {
    await browser.send('Target.closeTarget', { targetId }).catch(() => {});
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const chrome = spawn(
  'google-chrome',
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--ignore-certificate-errors',
    '--user-data-dir=/tmp/chrome-preview-capture',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1200,750',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let failed = 0;
try {
  const version = await waitForPort();
  const browser = connect(version.webSocketDebuggerUrl);
  await browser.ready;
  const only = process.argv.slice(2);
  for (const [name, url, scrollY, prep, extraWait] of SITES) {
    if (only.length && !only.includes(name)) continue;
    try {
      await captureOne(browser, name, url, scrollY, prep, extraWait);
    } catch (err) {
      failed += 1;
      console.error(`fail ${name}: ${err.message}`);
    }
  }
  browser.close();
} finally {
  chrome.kill('SIGKILL');
}

if (failed) {
  console.error(`${failed} screenshot(s) failed`);
  process.exitCode = 1;
}
