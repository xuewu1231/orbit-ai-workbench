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
  ['loader-buttons', 'https://loader-buttons.appllama.io'],
  ['thinking-orbs', 'https://libraries.dev/orbs'],
  ['morphicons', 'https://www.morphicons.com'],
  ['great-ui', 'https://www.great-ui.com/components'],
  ['spec-01', 'https://spec-01.vercel.app'],
  ['spherium', 'https://tryspherium.com'],
  ['linear', 'https://linear.app'],
  ['teenage', 'https://teenage.engineering'],
  ['shadcn', 'https://ui.shadcn.com'],
  ['motion-primitives', 'https://motion-primitives.com'],
  ['usegrokbot', 'https://usegrokbot.com/zh-cn'],
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

async function captureOne(browser, name, url) {
  const outPath = path.join(OUT_DIR, `${name}.jpg`);
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await browser.send('Target.attachToTarget', { targetId, flatten: true });
  try {
    await browser.send('Page.enable', {}, sessionId);
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
    await sleep(1400);
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
  for (const [name, url] of SITES) {
    try {
      await captureOne(browser, name, url);
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
