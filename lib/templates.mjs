import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  renderBrandGyro,
  renderNavSvg,
  renderActionSvg,
  renderDockSvg,
  renderKindSvg,
  renderProductSvg,
  renderMonographSvg,
} from './icons.mjs';
import {
  renderRoleContextTxt,
  renderHomeDepotOverview,
  renderFutureSelfDepotPage,
  renderOtherKit,
  renderCreatorSystemPage,
  renderShareCardModal,
  buildDepotClientPayload,
} from './depot-views.mjs';

export { renderRoleContextTxt };

const assetStamp = createHash('sha1')
  .update(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../public/app.js')))
  .update(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../public/styles.css')))
  .digest('hex')
  .slice(0, 8);

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bi(en, zh) {
  return `<span class="i18n-en">${esc(en)}</span><span class="i18n-zh">${esc(zh)}</span>`;
}

export function siteBase() {
  let raw = String(process.env.BASE_PATH || '').trim();
  if (!raw || raw === '/') return '';
  if (!raw.startsWith('/')) raw = `/${raw}`;
  return raw.replace(/\/+$/, '');
}

function prefixRootPaths(html) {
  const base = siteBase();
  if (!base) return html;
  return html
    .replace(/((?:href|src|data-preview-img|data-copy-url)=")\//g, `$1${base}/`)
    .replace(/("href":")\//g, `$1${base}/`);
}

/* ============================================================================
   SHELF & KIND META — 百宝箱分区：设计 / 学习收藏 / 技能工具箱
   设计下面再分一栏：UI 组件、动效、等待动画、个人网站、整站参考、视觉风格
   ============================================================================ */
export const DESIGN_LANES = [
  { id: 'agent-ui', zh: 'AI 与 Agent 界面', en: 'Agent & Chat UI', line: '对话流、思考链、审批卡、双栏画布——专为大模型与智能体打磨的前端界面。' },
  { id: 'ui-lib', zh: '通用与拟物组件', en: 'UI Components', line: '源码归你改的表单、弹窗、工业旋钮与手工精品零件库。' },
  { id: 'motion', zh: '微交互与动效', en: 'Micro-Motion', line: '物理弹簧曲线、灵动岛展开、手势粒子消散与动效分寸感指南。' },
  { id: 'icons', zh: '动态图标与矢量', en: 'Kinetic Icons', line: '告别死板静态图标与廉价 Emoji：点击会自己变形、表意的统一线宽矢量体系。' },
  { id: 'loader', zh: '思考与等待动画', en: 'Thinking & Loaders', line: '当模型正在检索、推理或渲染时，用有呼吸感的状态代替干瘪转圈。' },
  { id: 'webgl-3d', zh: '3D 空间与着色器', en: '3D & Shaders', line: '5KB 点阵地球、光学噪点着色器与交互光影场，一屏点缀一处镇场。' },
  { id: 'landing', zh: '产品官网标杆', en: 'Product Landings', line: '双层卡片、暗色 1px 微边框、键盘沙盒与顶级科技产品的整站叙事节奏。' },
  { id: 'personal', zh: '个人主页与花园', en: 'Personal & Gardens', line: '独立开发者与创作者的数字名片：登机牌旅程、作品墙与可变现指南书。' },
  { id: 'bento-data', zh: 'Bento 与数据看板', en: 'Bento & Data Viz', line: '不对称便当盒网格、清爽无杂讯图表与出版级统计可视化。' },
  { id: 'style', zh: '字体排印与色板', en: 'Type & Color', line: '动手写 CSS 前先锁死：12 级科学灰阶、免费商用字体配对与流体字阶比例尺。' },
  { id: 'gallery', zh: '审美图鉴目录', en: 'Design Galleries', line: '没灵感时逛的顶级买手墙：高清滚屏实录与按定价/空状态切好的零件目录。' },
];

const MARK_SHOW = 4;

/* 每一类先露这四个（每类均保持 4～5 个精选，排面整齐均衡）。 */
const MARK_LEAD = {
  'agent-ui': ['v-affect-ui', 'v-agentic-ui', 'v-assistant-ui', 'v-pasta-ui'],
  'ui-lib': ['v-beui-pro', 'v-uiarc', 'v-kobra', 'v-watermelon'],
  motion: ['v-bencho', 'v-motion-primitives', 'v-vibedesign', 'v-dissolve'],
  icons: ['v-morphicons', 'v-kubai-icons', 'v-pqoqubbw-icons', 'v-phosphor-icons'],
  loader: ['v-thinking-orbs', 'v-loader-buttons', 'v-uiball-ldrs', 'v-css-loaders'],
  'webgl-3d': ['v-tryspherium', 'v-paper-shaders', 'v-cobe-globe', 'v-unicorn-studio'],
  landing: ['v-skimbly', 'v-linear', 'v-raycast', 'v-resend'],
  personal: ['v-weilanx', 'v-weilanx-works', 'v-oil-book', 'v-mikes-cv'],
  'bento-data': ['v-boardui', 'v-bentogrids', 'v-tremor', 'v-observable-plot'],
  style: ['v-teenage', 'v-radix-colors', 'v-fontshare', 'v-utopia-fluid'],
  gallery: ['v-designbookmark', 'v-directoryyy', 'v-godly', 'v-calltoinspiration'],
  learning: ['v-usegrokbot', 'v-fmcat-roles', 'v-tiktokenizer', 'v-anthropic-building-agents'],
  toolkit: ['v-skill-clean-ui', 'v-construct-mcp', 'v-excalidraw-flow', 'v-skill-verify-gate'],
};

const MARK_FRAME = {
  'v-tryspherium': 'center center',
  'v-natochi': 'center center',
  'v-teenage': 'center 62%',
  'v-mikes-cv': 'center 46%',
  'v-directoryyy': 'center 28%',
  'v-linear': 'center 40%',
};

export const NOTE_LANES = [
  { id: 'made', zh: '自己做的', en: 'Built', line: '亲手做出来、验证过的东西。产品、工作流、界面，都算。' },
  { id: 'company', zh: '公司里', en: 'Company', line: '公司内部的学习。知识、当时怎么定的、现在进行到哪，都往这一栏放。' },
  { id: 'method', zh: '简便办法', en: 'Shortcuts', line: '短、能照做的办法。不必铺成一篇文章。' },
];

export const COMPANY_MODULES = [
  { id: 'knowledge', zh: '知识', en: 'Knowledge', line: '学到的、用过的、值得留下来的。还没变成方法，也可以先放。' },
  { id: 'decision', zh: '决策', en: 'Decisions', line: '当时有哪些选项，为什么定了这一个。事后看错了也留着。' },
  { id: 'now', zh: '现状', en: 'Now', line: '这件事现在进行到哪。做到一半也可以写。' },
];

export const SHELVES = {
  design: {
    code: '01',
    en: 'Design Taxonomy · 11 Lanes',
    zh: '设计灵感（11 类精分）',
    dot: 'dot-blue',
    icon: '✦',
    desc: '按实战场景细分为 11 个均衡专科：Agent 界面、通用组件、微交互动效、动态图标、等待动画、3D 着色器、产品官网、个人花园、Bento 数据看板、字体色板与审美图鉴。',
  },
  learning: {
    code: '02',
    en: 'Learning Shelf',
    zh: '学习站点',
    dot: 'dot-orange',
    icon: '❖',
    desc: '不看设计，学方法：Prompt / Bot 市场、Token 透视工具与官方实战指南。复制给 AI，帮你提炼可落地的做法。',
  },
  toolkit: {
    code: '03',
    en: 'Skills & Workflows',
    zh: '技能工具箱',
    dot: 'dot-mint',
    icon: '⌘',
    desc: '能直接装进项目里干活的真 Skill、MCP 服务、白板工作流与提效工具。',
  },
};

const KIND_ICON = {
  'agent-ui': { cls: 'tile-blue', sym: '✦' },
  'design-site': { cls: 'tile-blue', sym: '✦' },
  landing: { cls: 'tile-blue', sym: '✦' },
  personal: { cls: 'tile-mint', sym: '⌂' },
  'ui-lib': { cls: 'tile-indigo', sym: '❖' },
  motion: { cls: 'tile-rose', sym: '↻' },
  icons: { cls: 'tile-indigo', sym: '◈' },
  loader: { cls: 'tile-amber', sym: '◌' },
  'webgl-3d': { cls: 'tile-dark', sym: '◎' },
  'bento-data': { cls: 'tile-mint', sym: '▦' },
  style: { cls: 'tile-amber', sym: '◐' },
  gallery: { cls: 'tile-dark', sym: '▣' },
  'prompt-hub': { cls: 'tile-rose', sym: '✎' },
  guide: { cls: 'tile-dark', sym: '☰' },
  skill: { cls: 'tile-mint', sym: '⌘' },
  workflow: { cls: 'tile-dark', sym: '⇄' },
  'ai-tool': { cls: 'tile-blue', sym: '⚡' },
};

/* ============================================================================
   FAVICON — 自动使用原网站图标（Google → DuckDuckGo → 分类符号 三级兜底）
   ============================================================================ */
function hostOf(url = '') {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return '';
  }
}

export function faviconSrc(item) {
  if (item.icon) return item.icon;
  const host = hostOf(item.url);
  return host ? `https://www.google.com/s2/favicons?domain=${host}&sz=128` : '';
}

function favImg(item, cls = 'fav-img') {
  const src = faviconSrc(item);
  if (!src) return '';
  const host = hostOf(item.url);
  const f2 = !item.icon && host ? `https://icons.duckduckgo.com/ip3/${host}.ico` : '';
  return `<img class="${cls}" src="${esc(src)}" ${f2 ? `data-f2="${esc(f2)}"` : ''} alt="" loading="lazy" referrerpolicy="no-referrer" onload="if(this.naturalWidth>1)this.classList.add('is-ok')" onerror="if(this.dataset.f2&&this.src!==this.dataset.f2){this.src=this.dataset.f2}else{this.classList.add('is-broken')}">`;
}

function renderFavTile(item, ic) {
  return `<div class="squircle-icon fav-tile ${ic.cls}"><span class="fav-fallback">${renderKindSvg(item.kind)}</span>${favImg(item)}</div>`;
}

const STAGE_META = {
  live: { cls: 'stage-live', zh: '已上线', en: 'Live' },
  beta: { cls: 'stage-beta', zh: '内测中', en: 'Beta' },
  concept: { cls: 'stage-concept', zh: '构想中', en: 'Concept' },
};

/* ============================================================================
   AI PROMPT BUILDER — 人看是分段卡片，复制出去是干净纯文本（没有 # 号）
   ============================================================================ */
export function buildPromptSections(item) {
  const shelf = item.shelf || 'design';
  const borrowText = (item.borrow || []).map((b, i) => `${i + 1}. ${b}`).join('\n');
  const sections = [];

  if (shelf === 'design') {
    sections.push({ label: '任务', body: `请参考「${item.name}」的设计风格，帮我设计或优化我的页面。` });
    sections.push({ label: '参考对象', body: item.url ? `${item.name}（${item.url}）` : item.name });
    if (item.swatches && item.swatches.length) {
      sections.push({ label: '代表配色', body: item.swatches.join(' / ') });
    }
    sections.push({ label: '它好在哪', body: item.whyGood });
    if (borrowText) sections.push({ label: '重点借鉴', body: borrowText });
    sections.push({ label: '适用场景', body: item.whenToUse });
    sections.push({
      label: '要求',
      body:
        '1. 只借鉴版式结构、配色比例、层次关系和交互手感，不要照抄它的文案、Logo 和品牌元素。\n2. 保持留白克制，不要使用廉价的蓝紫发光渐变。\n3. 动手前先用三句话复述你理解的风格要点，等我确认后再写代码。',
    });
  } else if (shelf === 'learning') {
    sections.push({ label: '任务', body: `请先学习「${item.name}」这份资料，再帮我把它用到我的项目里。` });
    if (item.url) sections.push({ label: '资料地址', body: item.url });
    sections.push({ label: '核心价值', body: item.whyGood });
    if (borrowText) sections.push({ label: '值得借鉴', body: borrowText });
    sections.push({
      label: '请你输出',
      body:
        '1. 用不超过 5 条要点，提炼它最值得借鉴的方法和结构。\n2. 结合我当前的项目，给出 3 条今天就能落地的做法。\n3. 指出哪些部分不适合我们直接照搬，并说明原因。',
    });
  } else {
    sections.push({ label: '任务', body: `我想在当前项目里使用「${item.name}」。` });
    if (item.installCmd) sections.push({ label: '安装 / 调用', body: item.installCmd });
    else if (item.url) sections.push({ label: '地址', body: item.url });
    sections.push({ label: '它能做什么', body: item.whyGood });
    sections.push({ label: '什么时候用', body: item.whenToUse });
    sections.push({
      label: '请你执行',
      body:
        '1. 先检查当前项目结构和已有配置。\n2. 说明你打算怎么接入、会改动哪些文件。\n3. 等我确认后再执行；完成后告诉我怎么验证效果。',
    });
  }
  return sections;
}

export function sectionsToText(sections) {
  return sections
    .map((s) => (s.body.includes('\n') ? `${s.label}：\n${s.body}` : `${s.label}：${s.body}`))
    .join('\n\n');
}

export function buildCuratedPromptSections(article) {
  const sections = [
    { label: '任务', body: `请先吸收《${article.title}》的核心方法论，再结合我当前的项目给出可执行的落地建议。` },
    {
      label: '来源与作者',
      body: `${article.originalOrg}${article.originalAuthor ? ' · ' + article.originalAuthor : ''}${article.sourceUrl ? '（' + article.sourceUrl + '）' : ''}`,
    },
    { label: '核心摘要', body: article.summary },
  ];
  if (article.studioNoteBody) {
    sections.push({ label: '我们的实战笔记', body: article.studioNoteBody });
  }
  sections.push({
    label: '请你帮我落地',
    body:
      '1. 对照上面的方法论，诊断我当前项目或工作流里最值得改进的 2 个关键点。\n2. 给出具体可执行的修改方案（先用三句话说明思路与边界，等我确认后再动手改代码或文档）。',
  });
  return sections;
}

function buildVaultMap(data) {
  const map = {};
  for (const item of data.ecosystem.vaultItems || []) {
    const sections = buildPromptSections(item);
    map[item.id] = {
      name: item.name,
      url: item.url || '',
      icon: faviconSrc(item),
      shelf: item.shelf || 'design',
      whyGood: item.whyGood,
      borrow: item.borrow || [],
      sections,
      text: sectionsToText(sections),
    };
  }
  for (const art of data.curated || []) {
    const sections = buildCuratedPromptSections(art);
    map['curated-' + art.slug] = {
      name: art.title,
      url: art.sourceUrl || '',
      icon: faviconSrc({ url: art.sourceUrl }),
      shelf: 'learning',
      whyGood: art.summary,
      borrow: [],
      sections,
      text: sectionsToText(sections),
    };
  }
  return map;
}

/* ============================================================================
   MACHINE-READABLE EXPORTS — /llms.txt 与 /vault.json（给 Agent 直接读）
   ============================================================================ */
export function renderLlmsTxt(data) {
  const { site, ecosystem, originals, curated } = data;
  const lines = [];
  lines.push(`# ${site.brandName} · ${site.brandSub}`);
  lines.push('');
  lines.push('> 我们团队的 AI 工作台与灵感总站。收录设计参考网站、UI 组件库、学习资料、Skills / 工作流、自研产品与实战文章。每条收藏都附带「好在哪」和「可借鉴点」，可直接作为 AI 写页面、做方案时的参考上下文。');
  lines.push('');
  for (const [key, meta] of Object.entries(SHELVES)) {
    const items = (ecosystem.vaultItems || []).filter((i) => (i.shelf || 'design') === key);
    if (!items.length) continue;
    lines.push(`## ${meta.zh}（${meta.en}）`);
    lines.push('');
    const writeItem = (it) => {
      const link = it.url || it.installCmd || '';
      lines.push(`- ${it.name}${link ? ` <${link}>` : ''}：${it.whyGood}`);
      if (it.borrow && it.borrow.length) lines.push(`  可借鉴：${it.borrow.join('；')}`);
      if (it.swatches && it.swatches.length) lines.push(`  配色：${it.swatches.join(' / ')}`);
      lines.push(`  适用：${it.whenToUse}`);
    };
    if (key === 'design') {
      const used = new Set();
      for (const lane of DESIGN_LANES) {
        const laneItems = items.filter((it) => it.kind === lane.id);
        if (!laneItems.length) continue;
        lines.push(`### ${lane.zh}`);
        lines.push('');
        for (const it of laneItems) {
          used.add(it.id);
          writeItem(it);
        }
      }
      for (const it of items) if (!used.has(it.id)) writeItem(it);
    } else {
      for (const it of items) writeItem(it);
    }
    lines.push('');
  }
  lines.push('## 自研产品与构想');
  lines.push('');
  for (const p of ecosystem.products || []) {
    const st = STAGE_META[p.stage] || STAGE_META.concept;
    lines.push(`- ${p.name}（${p.formBadge} · ${st.zh}）：${p.summary}`);
  }
  lines.push('');
  lines.push(originals.length ? '## 经历与精选好文' : '## 精选好文');
  lines.push('');
  for (const a of [...originals, ...curated]) {
    lines.push(`- ${a.title} </read/${a.slug}>：${a.summary}`);
  }
  lines.push('');
  lines.push('## 分场景专属 AI 上下文端点（推荐按任务挂载）');
  lines.push('');
  lines.push('- /context/design.txt ：UI 审美拆解、四色色板与反塑料感六条铁律');
  lines.push('- /context/creator.txt ：自媒体三步白板视频工作流、个人文风 DNA 与前 3 秒钩子库');
  lines.push('- /context/skills.txt ：可执行 SKILL.md 胶囊源码、MCP 配置标准与装备避坑红黑榜');
  lines.push('');
  if ((data.skills || []).length) {
    lines.push('## 独立可执行 SKILL.md 胶囊');
    lines.push('');
    for (const sk of data.skills) {
      lines.push(`- ${sk.name} </skills/${sk.slug}.md>：${sk.trigger}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

export function buildVaultExport(data) {
  const base = siteBase();
  const withBase = (p) => (p && base && p.startsWith('/') ? `${base}${p}` : p);
  return {
    name: `${data.site.brandName} ${data.site.brandSub}`,
    generatedAt: new Date().toISOString(),
    contextEndpoints: {
      llms: withBase('/llms.txt'),
      design: withBase('/context/design.txt'),
      creator: withBase('/context/creator.txt'),
      skills: withBase('/context/skills.txt'),
    },
    shelves: SHELVES,
    vault: (data.ecosystem.vaultItems || []).map((it) => ({
      ...it,
      preview: withBase(it.preview),
      aiPrompt: sectionsToText(buildPromptSections(it)),
    })),
    skills: (data.skills || []).map((sk) => ({
      slug: sk.slug,
      name: sk.name,
      version: sk.version,
      scope: sk.scope,
      trigger: sk.trigger,
      downloadUrl: withBase(`/skills/${sk.slug}.md`),
      plainPrompt: sk.plainPrompt,
    })),
    depot: {
      signals: data.depot?.signals || [],
      radar: data.depot?.radar || [],
      teardowns: data.depot?.teardowns || [],
      standards: data.depot?.standards || [],
    },
    curated: (data.curated || []).map((art) => ({
      slug: art.slug,
      publisher: art.publisher,
      title: art.title,
      originalAuthor: art.originalAuthor,
      originalOrg: art.originalOrg,
      sourceUrl: art.sourceUrl,
      summary: art.summary,
      studioNoteBody: art.studioNoteBody,
      href: withBase(`/read/${art.slug}`),
      aiPrompt: sectionsToText(buildCuratedPromptSections(art)),
    })),
    products: data.ecosystem.products || [],
    templates: data.ecosystem.templates || [],
  };
}

/* ============================================================================
   SMALL RENDER HELPERS
   ============================================================================ */
function renderOrbitLogo() {
  return renderBrandGyro();
}

function renderAppTileIcon(article) {
  const isCurated = article.kind === 'curated';
  const toneClass = isCurated ? 'tile-indigo' : article.lane === 'company' ? 'tile-mint' : article.access === 'pro' ? 'tile-dark' : 'tile-blue';
  const glyph = isCurated
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2" fill="currentColor" fill-opacity="0.16"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;
  return `<div class="squircle-icon ${toneClass}" aria-hidden="true">${glyph}</div>`;
}

function buildSearchIndex(data) {
  const items = [];
  for (const a of data.allArticles) {
    items.push({
      type: a.kind === 'curated' ? '精选好文' : '经历',
      title: a.title,
      desc: a.summary,
      href: `/read/${a.slug}`,
    });
  }
  for (const p of data.ecosystem.products || []) {
    const st = STAGE_META[p.stage] || STAGE_META.concept;
    items.push({ type: `自研产品 · ${st.zh}`, title: p.name, desc: p.summary, href: `/products#${p.id}` });
  }
  for (const v of data.ecosystem.vaultItems || []) {
    const shelf = SHELVES[v.shelf || 'design'];
    items.push({
      type: `${shelf.zh} · ${v.kindLabel}`,
      title: v.name,
      desc: `${v.whyGood} ${v.whenToUse}`,
      href: `/ecosystem#${v.id}`,
    });
  }
  for (const t of data.ecosystem.templates || []) {
    items.push({ type: '填空模板', title: t.title, desc: t.desc, href: `/kit#templates` });
  }
  items.push(
    {
      type: '自媒体系统 · 核心流水线',
      title: '三步白板视频工作台（选题三环 → Excalidraw → 提词器 → 小红书话题）',
      desc: '直接生成 .excalidraw 画布文件、网页滚动提词器与小红书 #话题发布包',
      href: '/creator',
    },
    {
      type: '自媒体系统 · Step 1',
      title: 'Excalidraw 手绘白板分镜生成器',
      desc: '输入核心命题与三个节点，一键下载真实 .excalidraw 画布文件',
      href: '/creator#step-excalidraw',
    },
    {
      type: '自媒体系统 · Step 2',
      title: '口播逐字稿与浏览器滚动提词器',
      desc: '支持语速调节、大字号、镜像模式与塑料词自检',
      href: '/creator#step-teleprompter',
    }
  );
  for (const sk of data.skills || []) {
    items.push({
      type: '真 SKILL.md 胶囊',
      title: sk.name,
      desc: sk.trigger,
      href: `/kit#skill-${sk.slug}`,
    });
  }
  for (const r of data.depot?.radar || []) {
    items.push({
      type: `装备红黑榜 · ${r.ringLabel}`,
      title: r.name,
      desc: r.verdict,
      href: '/originals?tab=radar',
    });
  }
  for (const s of data.depot?.signals || []) {
    items.push({
      type: `闪念判断 · ${s.kind}`,
      title: s.title,
      desc: s.body,
      href: '/originals?tab=signals',
    });
  }
  return items;
}

function renderDesignLanes(items, { gallery = false } = {}) {
  const lanes = DESIGN_LANES.map((lane) => ({
    ...lane,
    items: items.filter((item) => item.kind === lane.id),
  })).filter((lane) => lane.items.length);
  const rail = `
    <div class="pill-tabs lane-rail" role="group" aria-label="设计细分">
      <button type="button" class="pill-tab is-active" data-lane-filter="all" aria-selected="true">全部设计 <span class="lane-count">${items.length}</span></button>
      ${lanes
        .map(
          (lane) =>
            `<button type="button" class="pill-tab" data-lane-filter="${esc(lane.id)}" aria-selected="false"><i class="lane-tab-ico">${renderKindSvg(lane.id)}</i>${esc(lane.zh)} <span class="lane-count">${lane.items.length}</span></button>`
        )
        .join('')}
    </div>
    <p class="lane-empty" data-lane-empty hidden>这一栏里没有对得上的收藏。</p>`;
  const sections = lanes
    .map(
      (lane) => `
      <section class="design-lane" data-design-lane="${esc(lane.id)}">
        <header class="lane-head">
          <div class="lane-title-wrap">
            <span class="lane-badge-ico">${renderKindSvg(lane.id)}</span>
            <div>
              <span class="lane-kicker">${esc(lane.en)}</span>
              <h3>${esc(lane.zh)} <span class="shelf-count">${lane.items.length}</span></h3>
            </div>
          </div>
          <p>${esc(lane.line)}</p>
        </header>
        ${renderMarkWall(lane.items, lane.id)}
      </section>`
    )
    .join('');
  return rail + sections;
}

function renderVaultVisualStage(item, ic) {
  const host = hostOf(item.url);
  const pickBtn = `<button type="button" class="vault-pick-btn" data-vault-pick="${esc(item.id)}" title="加入 AI 组合拼装台">${renderActionSvg('stackPlus')}<span class="vp-label">组合</span></button>`;
  if (item.preview) {
    const floatSwatches =
      item.swatches && item.swatches.length
        ? `<div class="vs-swatches">${item.swatches
            .slice(0, 4)
            .map(
              (hex) =>
                `<button type="button" class="swatch-dot" data-copy-hex="${esc(hex)}" style="background:${esc(hex)}" title="复制 ${esc(hex)}" aria-label="复制色号 ${esc(hex)}"></button>`
            )
            .join('')}</div>`
        : '';
    return `
      <div class="vault-shot-stage">
        <div class="vs-chrome">
          <span class="vs-dots"><i></i><i></i><i></i></span>
          <span class="vs-domain">${favImg(item, 'vs-fav')}<span>${esc(host || item.kindLabel)}</span></span>
          ${pickBtn}
        </div>
        <div class="vs-frame">
          <img src="${esc(item.preview)}" alt="${esc(item.name)}" loading="lazy" />
          ${floatSwatches}
        </div>
      </div>
    `;
  }
  return `
    <div class="vault-blueprint-stage ${ic.cls}">
      <div class="vb-top">
        <span class="vb-kicker">${esc(item.kindLabel)} · SPEC</span>
        ${pickBtn}
      </div>
      <div class="vb-center">
        <span class="vb-glyph">${renderKindSvg(item.kind)}</span>
        <div class="vb-meta">
          <strong>${esc(item.tag)}</strong>
          <span>${esc(item.installCmd || 'Ready-to-paste AI Workflow')}</span>
        </div>
      </div>
    </div>
  `;
}

function orderMarks(items, key) {
  const pref = MARK_LEAD[key] || [];
  return [...items].sort((a, b) => {
    const ia = pref.indexOf(a.id);
    const ib = pref.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
}

function renderMarkWall(items, key) {
  const ordered = orderMarks(items, key);
  const shown = ordered.slice(0, MARK_SHOW);
  const extra = ordered.slice(MARK_SHOW);
  if (!shown.length) return '';
  const side = shown.slice(1);
  const sideHtml = side.length
    ? `<div class="mark-side">${side.map((it, i) => renderVaultCard(it, { gallery: true, index: i + 1 })).join('')}</div>`
    : '';
  const deck = extra
    .slice(0, 3)
    .map((it) =>
      it.preview
        ? `<img src="${esc(it.preview)}" alt="" />`
        : `<i>${esc((it.name || '?').slice(0, 1))}</i>`
    )
    .join('');
  const rest = extra.length
    ? `<div class="mark-rest"><div class="mark-rest-inner"><div class="mark-grid">${extra
        .map((it, i) => renderVaultCard(it, { gallery: true, extra: true, index: i }))
        .join('')}</div></div></div>
      <button type="button" class="mark-expand" data-lane-expand aria-expanded="false">
        <span class="mark-deck" aria-hidden="true">${deck}</span>
        <span class="mark-expand-copy">
          <strong class="more">再看 ${extra.length} 个</strong>
          <strong class="less">收起</strong>
          <em>这一类里还收着的</em>
        </span>
      </button>`
    : '';
  return `
    <div class="mark-stage" data-mark-count="${shown.length}">
      ${renderVaultCard(shown[0], { gallery: true, lead: true, index: 0 })}
      ${sideHtml}
    </div>
    ${rest}`;
}

function isDarkHex(hex = '#ffffff') {
  const c = String(hex).replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 118;
}

function renderSpecimenPoster(item) {
  const sw = item.swatches && item.swatches.length >= 3 ? item.swatches : ['#F6F7F9', '#FFFFFF', '#0F172A', '#2563EB'];
  const bg = sw[0];
  const dark = isDarkHex(bg);
  const fg = dark ? '#F8FAFC' : '#0F172A';
  const sub = dark ? 'rgba(248,250,252,0.68)' : 'rgba(15,23,42,0.62)';
  const cardSurface = dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.82)';
  const borderCol = dark ? 'rgba(255,255,255,0.13)' : 'rgba(15,23,42,0.1)';
  const accent = sw[3] || sw[2] || '#2563EB';
  const host = hostOf(item.url) || item.kindLabel || 'orbit.spec';
  const chipsHtml = sw
    .slice(0, 4)
    .map((c) => `<i style="background:${esc(c)}"></i>`)
    .join('');

  return `
    <div class="specimen-poster" style="background:${esc(bg)};color:${esc(fg)};--sp-surf:${esc(cardSurface)};--sp-bdr:${esc(borderCol)};--sp-acc:${esc(accent)};--sp-sub:${esc(sub)}">
      <div class="spp-chrome">
        <span class="spp-dots"><b></b><b></b><b></b></span>
        <span class="spp-host">${favImg(item, 'spp-fav')}<span>${esc(host)}</span></span>
        <span class="spp-swatches">${chipsHtml}</span>
      </div>
      <div class="spp-stage">
        <div class="spp-kicker-row">
          <span class="spp-icon">${renderKindSvg(item.kind)}</span>
          <span class="spp-tag">${esc(item.tag || item.kindLabel)}</span>
        </div>
        <strong class="spp-title">${esc(item.name)}</strong>
        <span class="spp-sub">${esc((item.borrow && item.borrow[0]) || item.whenToUse || '')}</span>
      </div>
    </div>
  `;
}

function renderMarkCard(item, { lead = false, extra = false, index = 0 } = {}) {
  const shelf = item.shelf || 'design';
  const lane = DESIGN_LANES.find((entry) => entry.id === item.kind);
  const line = item.whenToUse || item.tag || '';
  const frame = MARK_FRAME[item.id] || 'center 16%';
  const previewAttrs = item.url
    ? `data-preview-url="${esc(item.url)}" data-preview-img="${esc(item.preview || '')}" data-preview-icon="${esc(faviconSrc(item))}" data-preview-name="${esc(item.name)}" data-preview-swatches="${esc((item.swatches || []).join(','))}"`
    : '';
  const shot = item.preview
    ? `<img src="${esc(item.preview)}" alt="${esc(item.name)} 的界面" loading="lazy" style="object-position:${esc(frame)}" />`
    : renderSpecimenPoster(item);
  const shotLink = item.url
    ? `<a class="mark-shot-link" href="${esc(item.url)}" target="_blank" rel="noopener">${shot}</a>`
    : shot;
  const borrow =
    item.borrow && item.borrow.length
      ? `<ul class="mark-borrow">${item.borrow
          .slice(0, 2)
          .map((b) => `<li>${esc(b)}</li>`)
          .join('')}</ul>`
      : '';
  const swatches =
    item.swatches && item.swatches.length
      ? `<span class="mark-swatches">${item.swatches
          .slice(0, 4)
          .map(
            (hex) =>
              `<button type="button" class="swatch-dot" data-copy-hex="${esc(hex)}" style="background:${esc(hex)}" title="复制 ${esc(hex)}" aria-label="复制色号 ${esc(hex)}"></button>`
          )
          .join('')}</span>`
      : '';
  return `
    <article id="${esc(item.id)}" class="mark-card spotlight-card${lead ? ' is-lead' : ''}" style="--i:${index}" ${extra ? 'data-mark-extra="true"' : ''} data-shelf="${esc(shelf)}" data-vault-kind="${esc(item.kind)}" data-vault-search="${esc(
      item.name + ' ' + item.kindLabel + ' ' + item.tag + ' ' + item.whyGood + ' ' + item.whenToUse + ' ' + (item.borrow || []).join(' ')
    )}" ${previewAttrs}>
      <div class="mark-shot">
        ${shotLink}
        ${item.url ? `<a class="mark-open" href="${esc(item.url)}" target="_blank" rel="noopener" title="打开原站">${renderActionSvg('extArrow')}</a>` : ''}
        <div class="mark-more">
          <p>${esc(item.whyGood)}</p>
          ${borrow}
          <div class="mark-actions">
            ${swatches}
            <button type="button" class="icon-ghost-btn" data-ai-open="${esc(item.id)}" title="查看给 AI 的提示词">${renderActionSvg('promptDoc')}</button>
            <button type="button" class="ai-copy-btn" data-ai-copy="${esc(item.id)}">${renderActionSvg('sparkCheck')}<span class="btn-label">复制给 AI</span></button>
            <button type="button" class="vault-pick-btn" data-vault-pick="${esc(item.id)}" title="加入组合">${renderActionSvg('stackPlus')}</button>
          </div>
        </div>
      </div>
      <div class="mark-meta">
        <div class="mark-name">
          ${favImg(item, 'mark-fav')}<span class="mark-fallback-letter" aria-hidden="true">${esc((item.name || '?').slice(0, 1))}</span>
          <h3>${esc(item.name)}</h3>
          <span class="mark-kind">${esc(lane ? lane.zh : item.kindLabel)}</span>
        </div>
        <p class="mark-line">${esc(line)}</p>
      </div>
    </article>
  `;
}

function renderVaultCard(item, opts = {}) {
  const { gallery = false } = opts;
  if (gallery) return renderMarkCard(item, opts);
  const ic = KIND_ICON[item.kind] || KIND_ICON.skill;
  const shelf = item.shelf || 'design';
  const lane = DESIGN_LANES.find((entry) => entry.id === item.kind);
  const previewAttrs = item.url
    ? `data-preview-url="${esc(item.url)}" data-preview-img="${esc(item.preview || '')}" data-preview-icon="${esc(faviconSrc(item))}" data-preview-name="${esc(item.name)}" data-preview-swatches="${esc((item.swatches || []).join(','))}"`
    : '';

  const swatchesHtml =
    item.swatches && item.swatches.length > 0
      ? `<div class="swatch-strip" aria-label="点击复制色号">
          ${item.swatches
            .map(
              (hex) =>
                `<button type="button" class="swatch-dot" data-copy-hex="${esc(hex)}" style="background:${esc(hex)}" title="复制 ${esc(hex)}" aria-label="复制色号 ${esc(hex)}"></button>`
            )
            .join('')}
        </div>`
      : `<span class="foot-tag">${esc(item.tag)}</span>`;

  const borrowHtml =
    item.borrow && item.borrow.length
      ? `<ul class="borrow-list">${item.borrow
          .slice(0, 3)
          .map((b) => `<li>${esc(b)}</li>`)
          .join('')}</ul>`
      : `<p class="vault-when"><strong>怎么用：</strong>${esc(item.whenToUse)}</p>`;

  const cmdHtml = item.installCmd
    ? `<div class="inline-cmd"><code>${esc(item.installCmd)}</code><button type="button" class="copy-cmd-btn" data-copy="${esc(item.installCmd)}">Copy</button></div>`
    : '';

  return `
    <article id="${esc(item.id)}" class="card-shell spotlight-card vault-card ${gallery ? 'has-visual-stage' : ''} tilt-3d reveal-up" data-shelf="${esc(shelf)}" data-vault-kind="${esc(item.kind)}" data-vault-search="${esc(
      item.name + ' ' + item.kindLabel + ' ' + item.tag + ' ' + item.whyGood + ' ' + item.whenToUse + ' ' + (item.borrow || []).join(' ')
    )}" ${previewAttrs}>
      ${gallery ? renderVaultVisualStage(item, ic) : ''}
      <div class="card-inner">
        <div class="card-head-row">
          ${renderFavTile(item, ic)}
          <div class="card-badges">
            ${lane ? `<span class="lane-pill">${esc(lane.zh)}</span>` : `<span class="cat-label">${esc(item.kindLabel)}</span>`}
            <span class="pill-gray">${esc(item.tag)}</span>
          </div>
        </div>
        <h3>${esc(item.name)}${item.url && !gallery ? '<span class="preview-hint" aria-hidden="true">悬停预览</span>' : ''}</h3>
        <p class="vault-why">${esc(item.whyGood)}</p>
        ${borrowHtml}
        ${cmdHtml}
      </div>
      <div class="card-shell-foot vault-foot">
        ${swatchesHtml}
        <div class="vault-actions">
          <button type="button" class="icon-ghost-btn" data-ai-open="${esc(item.id)}" title="查看给 AI 的提示词">${renderActionSvg('promptDoc')}<span>Prompt</span></button>
          <button type="button" class="ai-copy-btn" data-ai-copy="${esc(item.id)}">${renderActionSvg('sparkCheck')}<span class="btn-label">复制给 AI</span></button>
          ${item.url ? `<a class="icon-ghost-btn ext-icon-btn" href="${esc(item.url)}" target="_blank" rel="noopener" title="打开原站">${renderActionSvg('extArrow')}</a>` : ''}
        </div>
      </div>
    </article>
  `;
}

function renderShelfHead(key, count, { showLink = false } = {}) {
  const meta = SHELVES[key];
  return `
    <div class="shelf-head reveal-up">
      <div class="shelf-head-left">
        <span class="mini-pill-badge"><span class="${meta.dot}"></span> ${meta.code} · ${esc(meta.en)} · ${esc(meta.zh)}</span>
        <h2>${esc(meta.zh)} <span class="shelf-count">${count}</span></h2>
        <p>${esc(meta.desc)}</p>
      </div>
      <div class="shelf-head-actions">
        <button type="button" class="soft-pill-btn sm" data-copy-shelf="${key}">${renderActionSvg('sparkCheck')}<span class="btn-label">整组复制给 AI</span></button>
        ${showLink ? `<a href="/ecosystem?shelf=${key}" class="outlined-pill-btn sm">查看全部 →</a>` : ''}
      </div>
    </div>
  `;
}

function renderProductCard(p, { compact = false } = {}) {
  const st = STAGE_META[p.stage] || STAGE_META.concept;
  const pitch = compact
    ? ''
    : `<div class="pitch-box">
        <div><span>为什么值得做</span><p>${esc(p.why)}</p></div>
        <div><span>MVP 第一步</span><p>${esc(p.mvp)}</p></div>
      </div>`;
  const tryLink = p.labHref ? `<a href="${esc(p.labHref)}" class="arrow-read">试小样 →</a>` : '';
  const readLink = p.relatedArticle
    ? `<a href="/read/${esc(p.relatedArticle)}" class="arrow-read">${esc(p.ctaLabel)}</a>`
    : '';
  const wantOrRead =
    p.stage === 'concept' || p.flagship
      ? `<button type="button" class="want-btn" data-want="${esc(p.id)}">${renderActionSvg('upvoteSpark')}<span>想要</span> <b class="want-count" data-want-count="${esc(p.id)}">0</b></button>`
      : readLink;
  const footRight = `<span class="card-foot-actions">${tryLink}${wantOrRead}</span>`;

  return `
    <article id="${esc(p.id)}" class="card-shell spotlight-card tilt-3d product-card reveal-up ${compact ? 'is-compact' : ''} ${p.flagship ? 'is-flagship-card' : ''}" data-stage="${esc(p.stage)}">
      <div class="card-inner">
        <div class="card-head-row">
          <div class="squircle-icon product-ico ${st.cls}-ico">${renderProductSvg(p.id)}</div>
          <div class="card-badges">
            ${p.flagship ? '<span class="pill-flagship">核心筹备</span>' : ''}
            <span class="pill-gray">${esc(p.formBadge)}</span>
            <span class="stage-pill ${st.cls}">${st.zh}</span>
          </div>
        </div>
        <h3>${esc(p.name)}</h3>
        <p class="strong-sub">${esc(p.tagline)}</p>
        ${compact ? '' : `<p>${esc(p.summary)}</p>`}
        ${pitch}
      </div>
      <div class="card-shell-foot">
        <span class="note-highlight">✓ ${esc(p.metrics)}</span>
        ${footRight}
      </div>
    </article>
  `;
}

function renderLayeredArticleCard(article) {
  const badgeHtml = article.access === 'pro' ? `<span class="pill-pro">Pro</span>` : `<span class="pill-mint">Free</span>`;
  const footLeft =
    article.kind === 'curated'
      ? `<span>Source · ${esc(article.originalOrg)}</span>`
      : `<span>${esc(article.chapter || 'Original')} · ${esc(article.readingTime)}</span>`;
  const footRight = article.kind === 'curated' ? `<span class="note-highlight">✓ 含实战笔记</span>` : `<span class="arrow-read">Read →</span>`;

  return `
    <article class="card-shell spotlight-card reveal-up" data-access="${esc(article.access)}" data-search="${esc(article.title + ' ' + article.summary + ' ' + article.category)}">
      <a href="/read/${esc(article.slug)}" class="card-inner-link">
        <div class="card-inner">
          <div class="card-head-row">
            ${renderAppTileIcon(article)}
            <div class="card-badges">
              <span class="cat-label">${esc(article.category)}</span>
              ${badgeHtml}
            </div>
          </div>
          <h3>${esc(article.title)}</h3>
          <p>${esc(article.summary)}</p>
        </div>
        <div class="card-shell-foot">
          ${footLeft}
          ${footRight}
        </div>
      </a>
    </article>
  `;
}

function renderDeckAiIcons() {
  return `
    <span class="deck-card pos-0" data-chip="Gemini 4 Prism">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 1.8C12 7.6 16.4 12 22.2 12C16.4 12 12 16.4 12 22.2C12 16.4 7.6 12 1.8 12C7.6 12 12 7.6 12 1.8Z" fill="url(#deckGem)"/>
        <defs><linearGradient id="deckGem" x1="2" y1="2" x2="22" y2="22"><stop stop-color="#2563EB"/><stop offset="0.52" stop-color="#7C3AED"/><stop offset="1" stop-color="#EC4899"/></linearGradient></defs>
      </svg>
    </span>
    <span class="deck-card pos-1" data-chip="Claude Architect">
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#FFF3ED"/>
        <path d="M12 5v14M5 12h14M7.1 7.1l9.8 9.8M16.9 7.1l-9.8 9.8" stroke="#EA580C" stroke-width="2.3" stroke-linecap="round"/>
      </svg>
    </span>
    <span class="deck-card pos-2" data-chip="Agent CLI >_">
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#0F172A"/>
        <path d="M7.5 9l3.2 3-3.2 3M12.8 15h3.8" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="deck-card pos-3" data-chip="7-Role Swarm">
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="3.2" fill="#2563EB"/>
        <circle cx="6.8" cy="16" r="3.2" fill="#0EA5E9"/>
        <circle cx="17.2" cy="16" r="3.2" fill="#6366F1"/>
        <path d="M10.2 9.5L8.2 13.2M13.8 9.5l2 3.7M10 16h4" stroke="#93C5FD" stroke-width="1.8"/>
      </svg>
    </span>
  `;
}

function renderDeckCraftIcons() {
  return `
    <span class="deck-card pos-0" data-chip="SPEC-01 Hardware UI">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#18181B"/>
        <circle cx="12" cy="12" r="6.2" stroke="#E4E4E7" stroke-width="1.8"/>
        <line x1="12" y1="12" x2="15.8" y2="8.2" stroke="#FF2E00" stroke-width="2.4" stroke-linecap="round"/>
        <circle cx="18.2" cy="5.8" r="1.4" fill="#FF2E00"/>
      </svg>
    </span>
    <span class="deck-card pos-1" data-chip="Spherium 3D Globe">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#0B0D13"/>
        <circle cx="12" cy="12" r="6.8" stroke="#FCD34D" stroke-width="1.5" stroke-dasharray="2 2"/>
        <ellipse cx="12" cy="12" rx="3.2" ry="6.8" stroke="#FFFFFF" stroke-width="1.3"/>
        <line x1="5.2" y1="12" x2="18.8" y2="12" stroke="#FCD34D" stroke-width="1.3"/>
      </svg>
    </span>
    <span class="deck-card pos-2" data-chip="Design & UI Kits">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8.5 3h3.5v6H8.5a3 3 0 1 1 0-6z" fill="#F24E1E"/>
        <path d="M12 3h3.5a3 3 0 1 1 0 6H12V3z" fill="#FF7262"/>
        <path d="M12 9h3.5a3 3 0 1 1 0 6H12V9z" fill="#1ABCFE"/>
        <path d="M8.5 9H12v6H8.5a3 3 0 1 1 0-6z" fill="#A259FF"/>
        <path d="M8.5 15H12v3a3 3 0 1 1-3.5-3z" fill="#0ACF83"/>
      </svg>
    </span>
    <span class="deck-card pos-3" data-chip="Shipped Plugins">
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#2563EB"/>
        <path d="M13 5.5L6.8 13.2h4.7L10.8 18.5l6.4-7.7h-4.7L13 5.5z" fill="#FFFFFF"/>
      </svg>
    </span>
  `;
}

function renderHeroFloatingCards() {
  return `
    <div class="hero-side-col side-left" aria-hidden="true">
      <a href="/ecosystem#v-spec-01" class="float-card fc-left-top" data-parallax="-14">
        <div class="fc-user-row">
          <div class="fc-avatar fc-fav">${favImg({ url: 'https://spec-01.vercel.app' })}<span class="fc-mini-badge bg-coral">❖</span></div>
          <div class="fc-user-meta">
            <strong>SPEC-01 / Hardware</strong>
            <span>Design · UI Kit</span>
          </div>
        </div>
        <div class="fc-caption">61 synth-grade controls, knobs &amp; real audio clicks.</div>
        <div class="fc-visual vis-hardware">
          <div class="hw-top-leds">
            <i class="led-red"></i><i class="led-amber"></i><i class="led-green"></i>
            <span>61 MODULES</span>
          </div>
          <div class="hw-dial-row">
            <div class="hw-rotary-knob"><span class="knob-needle"></span></div>
            <div class="hw-lcd">01 · READY<br/><small>@ui-sdk/core</small></div>
          </div>
        </div>
        <div class="fc-foot"><span class="fc-clock">●</span> 复制给 AI · <strong>一键参考</strong></div>
      </a>

      <a href="/ecosystem#v-tryspherium" class="float-card fc-left-bottom" data-parallax="12">
        <div class="fc-user-row">
          <div class="fc-avatar fc-fav">${favImg({ url: 'https://tryspherium.com' })}<span class="fc-mini-badge bg-blue">✦</span></div>
          <div class="fc-user-meta">
            <strong>Spherium 3D Globe</strong>
            <span>Design · WebGL Map</span>
          </div>
        </div>
        <div class="fc-caption">Live WebGL dotted globe, 1-click SVG &amp; GLB.</div>
        <div class="fc-visual vis-globe-stage">
          <canvas id="mini-globe-canvas" width="96" height="96"></canvas>
          <div class="globe-meta-col">
            <span class="globe-pill">BETA 1.2</span>
            <strong>8 Dot Geometries</strong>
            <small>Dark Studio UI</small>
          </div>
        </div>
        <div class="fc-foot"><span class="fc-clock">●</span> Collected · <strong>tryspherium.com</strong></div>
      </a>
    </div>

    <div class="hero-side-col side-right" aria-hidden="true">
      <a href="/llms.txt" target="_blank" class="float-card fc-right-top" data-parallax="15">
        <div class="fc-user-row">
          <div class="fc-avatar av-slate">AI<span class="fc-mini-badge bg-black">⌁</span></div>
          <div class="fc-user-meta">
            <strong>Readable by Agents</strong>
            <span>/llms.txt · /vault.json</span>
          </div>
        </div>
        <div class="fc-caption">The whole vault, served as AI-ready context.</div>
        <div class="fc-visual vis-terminal">
          <div class="term-line"><span class="t-dim">$</span> curl orbit/llms.txt</div>
          <div class="term-line t-green">✓ vault.json ready</div>
          <div class="term-line t-dim">→ design · learning · toolkit</div>
          <div class="term-line">&gt; <span class="t-caret"></span></div>
        </div>
        <div class="fc-foot"><span class="fc-clock">●</span> Next · <strong>Orbit MCP</strong></div>
      </a>

      <a href="/ecosystem#v-usegrokbot" class="float-card fc-right-bottom" data-parallax="-12">
        <div class="fc-user-row">
          <div class="fc-avatar fc-fav">${favImg({ url: 'https://usegrokbot.com/zh-cn' })}<span class="fc-mini-badge bg-red">✎</span></div>
          <div class="fc-user-meta">
            <strong>UseGrokBot Hub</strong>
            <span>Learning · Prompt Market</span>
          </div>
        </div>
        <div class="fc-caption">5,903+ filtered cases &amp; role-first onboarding.</div>
        <div class="fc-visual vis-ice">
          <div class="ice-copy">
            <strong>Pick your role.<br/>Run proven bots.</strong>
            <small>14 Squads · 28 Cases</small>
          </div>
          <div class="ice-badge">5.9k</div>
        </div>
        <div class="fc-foot"><span class="fc-clock">●</span> 学习收藏 · <strong>usegrokbot.com</strong></div>
      </a>
    </div>
  `;
}

function renderBrandIconsStrip() {
  return `
    <div class="ecosystem-icons-row" aria-label="Workbench Stack">
      <span class="eco-icon" title="Gemini">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="url(#gemGrad2)"/>
          <defs><linearGradient id="gemGrad2" x1="2" y1="2" x2="22" y2="22"><stop stop-color="#3B82F6"/><stop offset="0.5" stop-color="#8B5CF6"/><stop offset="1" stop-color="#EC4899"/></linearGradient></defs>
        </svg>
      </span>
      <span class="eco-icon" title="Claude">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#FFF1EB"/>
          <path d="M12 5v14M5 12h14M7.2 7.2l9.6 9.6M16.8 7.2l-9.6 9.6" stroke="#D97757" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="eco-icon" title="Terminal Agent">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="#0A0A0B"/>
          <path d="M8 9l3 3-3 3M13 15h3" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="eco-icon" title="React">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="2.2" fill="#0EA5E9"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.8" stroke="#0EA5E9" stroke-width="1.6"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" stroke="#0EA5E9" stroke-width="1.6"/>
          <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" stroke="#0EA5E9" stroke-width="1.6"/>
        </svg>
      </span>
      <span class="eco-icon" title="Figma">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8.5 2h3.5v7H8.5a3.5 3.5 0 1 1 0-7z" fill="#F24E1E"/>
          <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" fill="#FF7262"/>
          <path d="M12 9h3.5a3.5 3.5 0 1 1 0 7H12V9z" fill="#1ABCFE"/>
          <path d="M8.5 9H12v7H8.5a3.5 3.5 0 1 1 0-7z" fill="#A259FF"/>
          <path d="M8.5 16H12v3.5a3.5 3.5 0 1 1-3.5-3.5z" fill="#0ACF83"/>
        </svg>
      </span>
      <span class="eco-icon" title="UI Kits">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="6" fill="#F3F4F6" stroke="#D1D5DB"/>
          <line x1="16" y1="7" x2="7" y2="16" stroke="#111827" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="17" y1="12" x2="12" y2="17" stroke="#E61E00" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="eco-icon" title="WebGL 3D">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9.2" stroke="#111827" stroke-width="1.8"/>
          <ellipse cx="12" cy="12" rx="4.2" ry="9.2" stroke="#2563EB" stroke-width="1.6"/>
          <line x1="3" y1="12" x2="21" y2="12" stroke="#111827" stroke-width="1.5"/>
        </svg>
      </span>
    </div>
  `;
}

function renderSideDock() {
  const items = [
    ['depot-pillars', '三大弹药库'],
    ['products-sec', '产品舞台'],
    ['orbit-console', 'AI 工作台'],
    ['dual-readable', '人 & AI 双读'],
    ['shelf-design', '收藏房间'],
    ['playbook-sec', '精选好文'],
  ];
  return `
    <nav class="side-dock" id="side-dock" aria-label="页面分区导航">
      ${items
        .map(
          ([id, label]) =>
            `<a href="#${id}" data-dock="${id}" aria-label="${label}"><span class="dock-ico">${renderDockSvg(id)}</span><span class="dock-label">${label}</span></a>`
        )
        .join('')}
      <div class="dock-progress"><i id="dock-progress-fill"></i></div>
    </nav>
  `;
}

/* ============================================================================
   PAGE SHELL
   ============================================================================ */
function previewPreloadLinks(data) {
  const seen = new Set();
  const links = [];
  for (const item of data.ecosystem?.vaultItems || []) {
    if (!item.preview || seen.has(item.preview)) continue;
    seen.add(item.preview);
    links.push(`<link rel="preload" as="image" href="${esc(item.preview)}" />`);
  }
  return links.join('\n  ');
}

function renderPartsStage() {
  return `
    <section class="parts-stage" id="parts-live">
      <div class="parts-head">
        <span class="mini-pill-badge"><span class="dot-blue"></span><span class="i18n-en">Live Craft Micro-Controls · Tap to Feel</span><span class="i18n-zh">可触摸的微交互样本 · 点一下试试</span></span>
        <h2><span class="i18n-en">Every icon &amp; control responds to your touch.</span><span class="i18n-zh">好设计不靠空口说，直接长在每一次点击反馈里。</span></h2>
        <p><span class="i18n-en">We turned our favorite motion &amp; agent UI references from the vault into live tactile controls across this site. Click any module below to test its state transition.</span><span class="i18n-zh">我们把百宝箱里收录的图标变形、思考态按钮、Agent 审批卡与呼吸光球做成了真正在站内运行的微控件，点一下就能感受状态切换。</span></p>
      </div>
      <div class="parts-grid">
        <article class="part-card">
          <div class="part-live">
            <button type="button" class="morph-demo-keycap" id="morph-demo-btn" data-state="0" aria-label="点击切换图标形态">
              <span class="md-icon-box">
                <svg class="md-svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path class="md-line-1" d="M5 7.5H19" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
                  <path class="md-line-2" d="M5 12H19" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
                  <path class="md-line-3" d="M5 16.5H14" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>
                  <path class="md-play" d="M8.5 6.8L17.5 12L8.5 17.2V6.8Z" fill="currentColor"/>
                  <path class="md-check" d="M5.5 12.5L10 17L18.8 7.5" stroke="#10B981" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span class="md-meta">
                <strong id="morph-demo-name">01 · Menu 菜单</strong>
                <small>点击连续变形 ↻</small>
              </span>
            </button>
          </div>
          <h3><span class="i18n-en">Vector State Morphing</span><span class="i18n-zh">连续四态矢量变形</span></h3>
          <p><span class="i18n-en">Menu → Close → Run → Verified. One control smoothly transforms its stroke geometry on every click.</span><span class="i18n-zh">菜单 → 关闭 → 运行 → 已验证。每点一下，笔划几何沿着弹簧曲线平滑重排。</span></p>
          <a class="part-entry" href="/ecosystem?shelf=design&lane=motion"><span class="i18n-en">Motion originals →</span><span class="i18n-zh">查看动效原件 →</span></a>
        </article>

        <article class="part-card">
          <div class="part-live">
            <button type="button" class="think-btn" data-think-demo data-idle-zh="点我运行多步思考" data-idle-en="Run multi-step think" data-busy-zh="正在对齐结构与色板…" data-busy-en="Aligning layout & tokens…" data-done-zh="✓ 结构已就绪" data-done-en="✓ Ready to ship">
              <span class="think-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
              <span class="i18n-zh" data-think-label>点我运行多步思考</span>
              <span class="i18n-en" data-think-label>Run multi-step think</span>
            </button>
          </div>
          <h3><span class="i18n-en">In-Place Thinking Button</span><span class="i18n-zh">原地波形思考按钮</span></h3>
          <p><span class="i18n-en">Replaces dead spinners with live audio-style pulse bars and clear stage copy right inside the button.</span><span class="i18n-zh">告别干瘪的转圈圈：按钮留在原位，用脉冲波形和阶段文案告诉用户此刻进展。</span></p>
          <a class="part-entry" href="/ecosystem?shelf=design&lane=loader"><span class="i18n-en">Loader originals →</span><span class="i18n-zh">查看等待动画原件 →</span></a>
        </article>

        <article class="part-card">
          <div class="part-live">
            <div class="agent-pills" data-agent-status>
              <button type="button" class="is-on" data-status="plan"><span class="i18n-en">Plan</span><span class="i18n-zh">规划</span></button>
              <button type="button" data-status="run"><span class="i18n-en">Running</span><span class="i18n-zh">执行中</span></button>
              <button type="button" data-status="ask"><span class="i18n-en">Approve</span><span class="i18n-zh">待拍板</span></button>
            </div>
            <div class="agent-telemetry">
              <span class="at-dot" id="agent-status-dot"></span>
              <p class="agent-line" data-status-line>
                <span class="i18n-en" data-line-en>3 files scoped · 12% context budget</span>
                <span class="i18n-zh" data-line-zh>已锁定 3 个目标文件 · 占用 12% 上下文</span>
              </p>
            </div>
          </div>
          <h3><span class="i18n-en">Agent Telemetry Pills</span><span class="i18n-zh">Agent 透明状态卡</span></h3>
          <p><span class="i18n-en">Inspired by Pasta UI &amp; assistant-ui: surface plan, running trace, and human approval clearly.</span><span class="i18n-zh">提炼自 Pasta UI：把规划、工具执行与人工拍板拆成一眼看懂的状态信号。</span></p>
          <a class="part-entry" href="/ecosystem?shelf=design&lane=ui-lib"><span class="i18n-en">UI originals →</span><span class="i18n-zh">查看 UI 组件原件 →</span></a>
        </article>

        <article class="part-card">
          <div class="part-live">
            <button type="button" class="orb-mode-stage" id="orb-mode-btn" data-orb-mode="0" title="点击切换光球谐波状态">
              <span class="harmonic-orb" aria-hidden="true">
                <i class="ho-halo"></i>
                <i class="ho-ring"></i>
                <i class="ho-core"></i>
              </span>
              <span class="orb-mode-meta">
                <strong id="orb-mode-label">Breathing · 待命呼吸</strong>
                <small>点击切换状态 ↻</small>
              </span>
            </button>
          </div>
          <h3><span class="i18n-en">Harmonic Status Orb</span><span class="i18n-zh">多模态呼吸光球</span></h3>
          <p><span class="i18n-en">Tap the orb to switch between Idle Breathing, Deep Retrieval, and High-Speed Synthesis modes.</span><span class="i18n-zh">点击光球切换「待命呼吸 / 深度检索 / 高速合成」三种光晕谐波频率。</span></p>
          <a class="part-entry" href="/ecosystem?shelf=design&lane=loader"><span class="i18n-en">More waiting marks →</span><span class="i18n-zh">再看 Thinking Orbs →</span></a>
        </article>
      </div>
    </section>`;
}

function renderPaidDoor() {
  return `
    <aside class="paid-door" id="pro-door">
      <div class="paid-door-live" aria-hidden="true">
        <div class="portal-emblem">
          <svg viewBox="0 0 48 48" width="46" height="46" fill="none">
            <rect x="3" y="3" width="42" height="42" rx="14" fill="var(--bg-shell)" stroke="var(--border-strong)" stroke-width="1.2"/>
            <circle class="pe-orbit" cx="24" cy="24" r="14" stroke="var(--blue)" stroke-width="1.4" stroke-dasharray="3 3"/>
            <path d="M24 13C24 19.1 28.9 24 35 24C28.9 24 24 28.9 24 35C24 28.9 19.1 24 13 24C19.1 24 24 19.1 24 13Z" fill="var(--blue)" fill-opacity="0.18" stroke="var(--blue)" stroke-width="1.5"/>
            <circle cx="24" cy="24" r="3" fill="var(--blue)"/>
          </svg>
        </div>
      </div>
      <div class="paid-door-copy">
        <span class="mini-pill-badge"><span class="dot-blue"></span><span class="i18n-en">The front stays free</span><span class="i18n-zh">前面这些全部免费开放</span></span>
        <h2><span class="i18n-en">Further in, there is an inner studio door.</span><span class="i18n-zh">再往里，留了一扇进阶工坊的门。</span></h2>
        <p><span class="i18n-en">Deeper architecture teardowns, commercial-grade Skills &amp; video templates live behind this door — while everything on the public shelves stays open.</span><span class="i18n-zh">深度架构复盘、商业级成套 Skill 与代码视频母版放在门后；外面的百宝箱与书架始终免费开放。</span></p>
      </div>
      <div class="paid-door-actions">
        <button type="button" class="solid-pill-btn" data-open-modal="pro-modal"><span class="i18n-en">Unlock Orbit Pro →</span><span class="i18n-zh">查看 Pro 权益 →</span></button>
        <a href="/ecosystem?shelf=design" class="soft-pill-btn"><span class="i18n-en">Explore Free Vault</span><span class="i18n-zh">继续逛免费百宝箱</span></a>
      </div>
    </aside>`;
}

function renderShell({ data, pageTitle, activeNav, bodyHtml, extraDataScript = '', headExtra = '' }) {
  const { site } = data;
  const searchIndexJson = JSON.stringify(buildSearchIndex(data));
  const vaultMapJson = JSON.stringify(buildVaultMap(data));

  return prefixRootPaths(`<!DOCTYPE html>
<html lang="zh-CN" data-theme="light" data-lang="zh">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)} · ${esc(site.brandName)} ${esc(site.brandSub)}</title>
  <meta name="description" content="${esc(site.topPillZh)}" />
  <link rel="alternate" type="text/plain" title="LLM-readable vault" href="/llms.txt" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,500;6..72,650&display=swap" rel="stylesheet" />
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('studio-theme');
        if (saved === 'dark' || saved === 'light') document.documentElement.setAttribute('data-theme', saved);
        var savedLang = localStorage.getItem('studio-lang');
        if (savedLang === 'zh' || savedLang === 'en') document.documentElement.setAttribute('data-lang', savedLang);
      } catch (e) {}
    })();
  </script>
  <link rel="stylesheet" href="/styles.css?v=${assetStamp}" />
  ${headExtra}
</head>
<body>
  <header class="top-navbar">
    <div class="scroll-progress-bar" id="scroll-progress-bar"></div>
    <div class="navbar-inner">
      <a href="/" class="brand-link" aria-label="${esc(site.brandName)} Home">
        ${renderOrbitLogo()}
        <span class="brand-wordmark">${esc(site.brandName)}</span>
        <span class="brand-sub-tag">${esc(site.brandSub)}</span>
      </a>

      <nav class="nav-links" aria-label="Primary Navigation">
        <a href="/" class="${activeNav === 'home' ? 'is-active' : ''}">${renderNavSvg('workbench')}<span class="i18n-en">Workbench</span><span class="i18n-zh">工作台</span></a>
        <a href="/ecosystem" class="${activeNav === 'ecosystem' ? 'is-active' : ''}">${renderNavSvg('vault')}<span class="i18n-en">Compound</span><span class="i18n-zh">复利系统</span></a>
        <a href="/creator" class="${activeNav === 'creator' ? 'is-active' : ''}">${renderNavSvg('creator')}<span class="i18n-en">Creator</span><span class="i18n-zh">自媒体系统</span></a>
        <a href="/originals" class="${activeNav === 'originals' ? 'is-active' : ''}">${renderNavSvg('playbook')}<span class="i18n-en">Depot</span><span class="i18n-zh">弹药库</span></a>
        <a href="/products" class="${activeNav === 'products' ? 'is-active' : ''}">${renderNavSvg('products')}<span class="i18n-en">Products</span><span class="i18n-zh">产品孵化</span></a>
        <a href="/curated" class="${activeNav === 'curated' ? 'is-active' : ''}">${renderNavSvg('curated')}<span class="i18n-en">Curated</span><span class="i18n-zh">精选好文</span></a>
      </nav>

      <div class="navbar-right">
        <span class="nav-divider" aria-hidden="true"></span>

        <button type="button" class="cmdk-btn" data-open-modal="search-modal" aria-label="Search">
          ${renderActionSvg('search')}
          <span class="i18n-en">Search</span><span class="i18n-zh">搜索</span>
          <kbd>⌘K</kbd>
        </button>
        <button type="button" class="sound-toggle-btn" id="sound-toggle" title="轻触音效开关（点击切换静音）" aria-label="Toggle click sound">${renderActionSvg('sound')}</button>
        <button type="button" class="lang-switch-btn" id="lang-toggle" title="切换中英文">${renderActionSvg('lang')}<span class="lang-label"><span class="i18n-en">中</span><span class="i18n-zh">EN</span></span></button>
        <button type="button" class="theme-icon-btn" id="theme-toggle" title="切换明暗主题" aria-label="Toggle Theme">${renderActionSvg('theme')}</button>
        <button type="button" class="soft-pill-btn sm collect-trigger-btn" data-open-modal="add-vault-modal">${renderActionSvg('collect')}<span class="i18n-en">Collect</span><span class="i18n-zh">收录</span></button>
        <button type="button" class="solid-pill-btn pro-entry" data-open-modal="pro-modal"><i class="pro-orb" aria-hidden="true"></i><span class="i18n-en">Orbit Pro</span><span class="i18n-zh">Pro 入口</span></button>
      </div>
    </div>
  </header>

  <main class="main-canvas">
    ${bodyHtml}
  </main>

  ${renderPaidDoor()}

  <footer class="clean-footer">
    <div class="footer-inner">
      <div class="footer-brand-col">
        <div class="footer-logo-row">
          <span class="blue-pixel">${renderOrbitLogo()}</span>
          <strong>${esc(site.brandName)} · ${esc(site.brandSub)}</strong>
        </div>
        <p>属于我们自己的 AI 工作台：人能看懂「好在哪、怎么用」，AI 能一键拿到整理好的参考提示词，Agent 能直接读取 /llms.txt。</p>
      </div>
      <div class="footer-cols">
        <div>
          <h4>复利系统 · 网站</h4>
          <a href="/ecosystem?shelf=design&lane=agent-ui">AI 与 Agent 界面</a>
          <a href="/ecosystem?shelf=design&lane=ui-lib">通用与拟物组件</a>
          <a href="/ecosystem?shelf=design&lane=motion">微交互与动效</a>
          <a href="/ecosystem?shelf=design&lane=icons">动态图标与矢量</a>
          <a href="/ecosystem?shelf=design&lane=loader">思考与等待动画</a>
          <a href="/ecosystem?shelf=design&lane=webgl-3d">3D 空间与着色器</a>
          <a href="/ecosystem?shelf=design&lane=landing">产品官网标杆</a>
          <a href="/ecosystem?shelf=design&lane=personal">个人主页与花园</a>
          <a href="/ecosystem?shelf=design&lane=bento-data">Bento 与数据看板</a>
          <a href="/ecosystem?shelf=design&lane=style">字体排印与色板</a>
          <a href="/ecosystem?shelf=design&lane=gallery">审美图鉴目录</a>
        </div>
        <div>
          <h4>Build &amp; Depot</h4>
          <a href="/creator">自媒体系统</a>
          <a href="/originals">给未来的自己</a>
          <a href="/kit">复利系统 · 工具</a>
          <a href="/products">产品孵化</a>
          <a href="/curated">精选好文</a>
        </div>
        <div>
          <h4>For AI</h4>
          <a href="/llms.txt" target="_blank">/llms.txt</a>
          <a href="/context/design.txt" target="_blank">/context/design.txt</a>
          <a href="/context/creator.txt" target="_blank">/context/creator.txt</a>
          <a href="/context/skills.txt" target="_blank">/context/skills.txt</a>
          <a href="/vault.json" target="_blank">/vault.json</a>
        </div>
      </div>
    </div>
    <div class="footer-watermark" aria-hidden="true">${esc(site.brandName.toLowerCase())}</div>
  </footer>

  <!-- Floating Website Hover Preview (3D) -->
  <div class="site-preview-pop" id="site-preview-pop" aria-hidden="true">
    <div class="sp-bar"><i></i><i></i><i></i><img id="sp-fav" class="sp-fav" alt="" referrerpolicy="no-referrer" /><span id="sp-url"></span></div>
    <div class="sp-shot">
      <div class="sp-fallback" id="sp-fallback"></div>
      <img id="sp-img" alt="" />
    </div>
    <div class="sp-caption" id="sp-caption"></div>
  </div>

  <div class="orbit-toast" id="orbit-toast" role="status" aria-live="polite" hidden></div>
  <button type="button" class="back-top-fab" id="back-top-fab" aria-label="回到顶部" hidden>↑ Top</button>

  <!-- ⌘K Spotlight Search -->
  <div class="modal-backdrop" id="search-modal" hidden>
    <div class="layered-modal-shell wide" role="dialog" aria-modal="true" aria-label="Search">
      <div class="layered-modal-inner">
        <div class="search-modal-bar">
          <input type="search" id="global-search-input" placeholder="搜 Skimbly、3D 地图、组件库、交接单、Prompt 市场..." autocomplete="off" />
          <button type="button" class="modal-close" data-close-modal aria-label="Close">ESC</button>
        </div>
        <div class="search-results-list" id="global-search-results"></div>
      </div>
    </div>
  </div>

  <!-- Prompt for AI Modal: human-readable sections, copies as clean plain text -->
  <div class="modal-backdrop" id="prompt-modal" hidden>
    <div class="layered-modal-shell wide" role="dialog" aria-modal="true" aria-labelledby="prompt-modal-title">
      <div class="layered-modal-inner">
        <div class="modal-top">
          <span class="mini-pill-badge"><span class="dot-blue"></span> Prompt for AI · 复制给 AI</span>
          <button type="button" class="modal-close" data-close-modal aria-label="Close">✕</button>
        </div>
        <h2 id="prompt-modal-title-wrap" class="prompt-title-row"><span class="prompt-fav-tile"><img id="prompt-fav" alt="" referrerpolicy="no-referrer" /></span><span id="prompt-modal-title">Prompt</span></h2>
        <p class="modal-lead">这里分段显示方便你看；复制出去是干净的纯文本（没有 # 号），直接粘贴给 Claude、Gemini 或 Cursor 就行。</p>
        <div class="prompt-sheet" id="prompt-sheet"></div>
        <textarea id="prompt-edit-area" class="prompt-edit-area" rows="10" hidden></textarea>
        <div class="modal-btn-row">
          <button type="button" class="soft-pill-btn" id="prompt-edit-toggle">✎ 改一改再复制</button>
          <button type="button" class="solid-pill-btn grow" id="prompt-copy-btn">✦ 复制给 AI</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Fill-in Template Modal -->
  <div class="modal-backdrop" id="template-modal" hidden>
    <div class="layered-modal-shell wide" role="dialog" aria-modal="true" aria-labelledby="tpl-modal-title">
      <div class="layered-modal-inner">
        <div class="modal-top">
          <span class="mini-pill-badge"><span class="dot-mint"></span> 填空模板 · 填完复制给 AI</span>
          <button type="button" class="modal-close" data-close-modal aria-label="Close">✕</button>
        </div>
        <h2 id="tpl-modal-title">Template</h2>
        <p class="modal-lead" id="tpl-modal-desc"></p>
        <div class="tpl-intro"><span>会自动附带给 AI 的说明</span><p id="tpl-intro-text"></p></div>
        <form id="tpl-fill-form" class="tpl-fields"></form>
        <div class="modal-btn-row">
          <button type="button" class="soft-pill-btn" id="tpl-clear-btn">清空</button>
          <button type="button" class="solid-pill-btn grow" id="tpl-modal-copy">✦ 填好了，复制给 AI</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add to Vault Modal -->
  <div class="modal-backdrop" id="add-vault-modal" hidden>
    <div class="layered-modal-shell" role="dialog" aria-modal="true" aria-labelledby="add-vault-title">
      <div class="layered-modal-inner">
        <div class="modal-top">
          <span class="mini-pill-badge"><span class="dot-mint"></span> Add to Orbit Vault</span>
          <button type="button" class="modal-close" data-close-modal aria-label="Close">✕</button>
        </div>
        <h2 id="add-vault-title">收录一条新参考</h2>
        <p class="modal-lead">保存后写入本地 <code>ecosystem.json</code>，自动生成「复制给 AI」提示词，并同步到 <code>/llms.txt</code>。</p>
        <form id="add-vault-form" class="clean-form">
          <div class="fb-submit-row">
            <select name="kind" class="clean-select" required>
              <optgroup label="设计（11 类精分）">
                <option value="agent-ui">AI 与 Agent 界面</option>
                <option value="ui-lib">通用与拟物组件</option>
                <option value="motion">微交互与动效</option>
                <option value="icons">动态图标与矢量</option>
                <option value="loader">思考与等待动画</option>
                <option value="webgl-3d">3D 空间与着色器</option>
                <option value="landing">产品官网标杆</option>
                <option value="personal">个人主页与花园</option>
                <option value="bento-data">Bento 与数据看板</option>
                <option value="style">字体排印与色板</option>
                <option value="gallery">审美图鉴目录</option>
              </optgroup>
              <optgroup label="学习收藏">
                <option value="prompt-hub">Prompt / Bot 市场</option>
                <option value="guide">学习指南</option>
              </optgroup>
            </select>
            <input type="text" name="tag" required placeholder="短标签，如：WebGL 3D 地图" />
          </div>
          <input type="text" name="name" required placeholder="名称，如：Spherium" />
          <input type="text" name="urlOrCmd" placeholder="网址 https://... 或安装命令 npx ...（填网址会自动抓取原站图标）" />
          <input type="text" name="icon" placeholder="自定义图标地址（可选，留空则自动用原站图标）" />
          <input type="text" name="swatches" placeholder="代表色值（可选，逗号分隔：#0E0E0E,#FCD34D）" />
          <textarea name="whyGood" rows="2" required placeholder="好在哪：两三句话"></textarea>
          <textarea name="borrow" rows="2" placeholder="可借鉴点（每行一条，会写进给 AI 的提示词）"></textarea>
          <textarea name="whenToUse" rows="2" required placeholder="怎么用：以后做什么项目时参考"></textarea>
          <button type="submit" class="solid-pill-btn full-w">保存并同步</button>
        </form>
      </div>
    </div>
  </div>

  <!-- Pro Modal -->
  <div class="modal-backdrop" id="pro-modal" hidden>
    <div class="layered-modal-shell" role="dialog" aria-modal="true" aria-labelledby="pro-modal-title">
      <div class="layered-modal-inner">
        <div class="modal-top">
          <span class="mini-pill-badge"><span class="dot-blue"></span> Orbit Pro Access</span>
          <button type="button" class="modal-close" data-close-modal aria-label="Close">✕</button>
        </div>
        <h2 id="pro-modal-title">${esc(site.proPlan.nameZh)}</h2>
        <p class="modal-lead"><span class="i18n-en">The pages in front stay free. This door opens the deeper writeups, commercial workflows, and skills.</span><span class="i18n-zh">前面这些免费看。这扇门后面是深度复盘、商业版工作流和技能。</span></p>
        <div class="price-box">
          <div>
            <span class="price-big">${esc(site.proPlan.earlyBirdPrice)}</span>
            <span class="price-badge">${esc(site.proPlan.earlyBirdLabel)}</span>
          </div>
          <span class="price-future">后续恢复 ${esc(site.proPlan.futurePrice)}</span>
        </div>
        <ul class="check-list">
          ${site.proPlan.perks.map((p) => `<li><span class="blue-check">✓</span> ${esc(p)}</li>`).join('')}
        </ul>
        <p class="pay-note">${esc(site.proPlan.countdownNote)}</p>
        <button type="button" class="solid-pill-btn full-w" id="simulate-pro-unlock">一键开启 Pro 全文预览（演示模式）</button>
      </div>
    </div>
  </div>

  ${renderShareCardModal()}

  <script>window.__BASE_PATH__ = ${JSON.stringify(siteBase())};</script>
  <script>window.__SEARCH_INDEX__ = ${searchIndexJson};</script>
  <script>window.__VAULT_MAP__ = ${vaultMapJson};</script>
  <script>window.__TEMPLATES_MAP__ = ${JSON.stringify(Object.fromEntries((data.ecosystem.templates || []).map((t) => [t.id, t])))};</script>
  <script>window.__DEPOT_DATA__ = ${JSON.stringify(buildDepotClientPayload(data)).replace(/</g, '\\u003c')};</script>
  ${extraDataScript}
  <script src="/app.js?v=${assetStamp}"></script>
</body>
</html>`);
}

/* ============================================================================
   HOME
   ============================================================================ */
function renderHomeAtelier(products) {
  const rank = (p) => (p.flagship ? -1 : ({ live: 0, beta: 1, concept: 2 }[p.stage] ?? 9));
  const list = [...products].filter((p) => !p.hideHome).sort((a, b) => rank(a) - rank(b));
  const tabs = list
    .map((p, i) => {
      const st = STAGE_META[p.stage] || STAGE_META.concept;
      const short = p.name.split('·')[0].trim();
      return `<button type="button" class="atelier-tab${i === 0 ? ' is-on' : ''}" data-product-tab="${esc(p.id)}" aria-selected="${i === 0 ? 'true' : 'false'}">
        <span class="atelier-tab-ico">${renderProductSvg(p.id)}</span>
        <span><strong>${esc(short)}</strong><small>${p.flagship ? '核心筹备 · ' : esc(st.zh) + ' · '}${esc(p.formBadge)}</small></span>
      </button>`;
    })
    .join('');
  const panels = list
    .map((p, i) => {
      const st = STAGE_META[p.stage] || STAGE_META.concept;
      return `<article class="atelier-panel${i === 0 ? ' is-on' : ''}" data-product-panel="${esc(p.id)}" data-stage="${esc(p.stage)}">
        <div class="atelier-kicker">${p.flagship ? '<span class="pill-flagship">Flagship · 核心筹备</span>' : ''}<span class="stage-pill ${st.cls}">${st.zh}</span><span>${esc(p.formBadge)}</span></div>
        <h3>${esc(p.name)}</h3>
        <p class="atelier-tag">${esc(p.tagline)}</p>
        <p>${esc(p.summary)}</p>
        <div class="atelier-metric">${esc(p.metrics)}</div>
        <div class="atelier-actions">
          <a class="solid-pill-btn" href="/products#${esc(p.id)}">${p.flagship ? '进入代码视频预览台 →' : '看完整方案 →'}</a>
          ${p.relatedArticle ? `<a class="soft-pill-btn" href="/read/${esc(p.relatedArticle)}">${esc(p.ctaLabel)}</a>` : ''}
        </div>
        <span class="atelier-mark" aria-hidden="true">${renderProductSvg(p.id)}</span>
      </article>`;
    })
    .join('');
  return `
    <section class="atelier wide-sec" id="products-sec">
      <div class="atelier-head">
        <span class="mini-pill-badge"><span class="dot-blue"></span> Product Lab · 产品舞台</span>
        <h2>先看见做出来的东西。</h2>
        <p>已上线的放在台上，构想在旁边排队。点左边，舞台换一场。 <a href="/products#lab-bench">小工具在产品页 →</a></p>
      </div>
      <div class="atelier-stage" id="product-stage">
        <div class="atelier-list" role="tablist" aria-label="产品">${tabs}</div>
        <div class="atelier-frame">
          <div class="atelier-bar" aria-hidden="true"><i></i></div>
          ${panels}
        </div>
      </div>
    </section>`;
}

function renderHomeRooms(designItems) {
  const lanes = DESIGN_LANES.map((lane) => ({
    ...lane,
    items: designItems.filter((item) => item.kind === lane.id),
  })).filter((lane) => lane.items.length);
  return `
    <section class="content-section wide-sec" id="shelf-design">
      <div class="atelier-head">
        <span class="mini-pill-badge"><span class="dot-blue"></span> Vault · 11 间设计专科展厅</span>
        <h2>进来先挑一间。</h2>
        <p>按实战场景拆成 11 个精细房间——从 Agent 对话界面、微交互、动态图标、等待球、3D 着色器，到产品官网、Bento 数据看板与字体色阶，每间都保持 4～5 个精选标杆。</p>
      </div>
      <div class="room-grid">
        ${lanes
          .map((lane) => {
            const lead = lane.items.find((item) => item.preview) || lane.items[0];
            const names = lane.items
              .slice(0, 3)
              .map((item) => item.name.split('·')[0].trim())
              .join('  ·  ');
            const bgMedia = lead.preview
              ? `<img src="${esc(lead.preview)}" alt="" />`
              : `<span class="room-bento-art" aria-hidden="true">${renderKindSvg(lane.id)}</span>`;
            return `<a class="room-card" href="/ecosystem?shelf=design&lane=${esc(lane.id)}">
              ${bgMedia}
              <span class="room-shade"></span>
              <span class="room-copy">
                <small>${esc(lane.en)}</small>
                <strong>${esc(lane.zh)}</strong>
                <em>${esc(names)}</em>
                <b>${lane.items.length}</b>
              </span>
            </a>`;
          })
          .join('')}
      </div>
      <div class="room-more">
        <a id="shelf-learning" href="/ecosystem#shelf-learning">学习站点 →</a>
        <a id="shelf-toolkit" href="/kit">MCP 与 Skill →</a>
        <a href="/ecosystem">全部网站 →</a>
      </div>
    </section>`;
}

export function renderHomePage(data) {
  const { site, workbench, ecosystem, originals, curated } = data;
  const firstItem = workbench.tracks[0].items[0];
  const vaultItems = ecosystem.vaultItems || [];
  const byShelf = (k) => vaultItems.filter((i) => (i.shelf || 'design') === k);
  const designItems = byShelf('design');
  const learningItems = byShelf('learning');
  const toolkitItems = byShelf('toolkit');
  const products = ecosystem.products || [];

  const logoItems = vaultItems.filter((i) => i.url);
  const logoChip = (it) => `
    <a class="logo-chip" href="/ecosystem#${esc(it.id)}">
      <span class="logo-chip-ico">${favImg(it)}<b>${esc(it.name.slice(0, 1))}</b></span>
      <span class="logo-chip-name">${esc(it.name)}</span>
      <small>${esc(it.tag || it.kindLabel)}</small>
    </a>`;
  const fill = (arr) => {
    let out = [...arr];
    while (out.length && out.length < 10) out = out.concat(arr);
    return out;
  };
  const logoRowA = fill(logoItems).map(logoChip).join('');
  const logoRowB = fill([...logoItems].reverse()).map(logoChip).join('');

  const wbNavHtml = workbench.tracks
    .map(
      (track, tIdx) => `
      <div class="wb-group">
        <div class="wb-group-label">${esc(track.code)} · ${esc(track.name)}</div>
        <div class="wb-btn-list">
          ${track.items
            .map(
              (item, iIdx) => `
              <button type="button" class="wb-select-btn ${tIdx === 0 && iIdx === 0 ? 'is-selected' : ''}" data-wb-id="${esc(item.id)}">
                <span class="wb-color-dot" style="background:${esc(item.color)}"></span>
                <span class="wb-btn-title">${esc(item.name)}</span>
                <span class="wb-btn-sub">${esc(item.tier)}</span>
              </button>
            `
            )
            .join('')}
        </div>
      </div>
    `
    )
    .join('');

  const scoresHtml = (firstItem.scores || [])
    .map(
      (sc) => `
      <div class="score-meter">
        <div class="score-label-row"><span>${esc(sc.label)}</span><strong>${sc.val}%</strong></div>
        <div class="score-track"><div class="score-fill" style="width:${sc.val}%"></div></div>
      </div>
    `
    )
    .join('');

  const stats = [
    [designItems.length, '设计收藏', 'Design'],
    [learningItems.length, '学习收藏', 'Learning'],
    [toolkitItems.length, 'Skills & 工作流', 'Toolkit'],
    [products.length, '产品与构想', 'Products'],
    [originals.length + curated.length, '实战文章', 'Playbooks'],
  ];

  const bodyHtml = `
    ${renderSideDock()}

    <section class="hero-stage-wide" id="hero-stage">
      <canvas class="hero-dots-canvas" id="hero-dots" aria-hidden="true"></canvas>
      <div class="hero-aurora" aria-hidden="true"><i class="au-a"></i><i class="au-b"></i><i class="au-c"></i></div>
      <svg class="orbit-compass" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="0.35" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" stroke-width="0.35" stroke-dasharray="1.5 5" />
        <g class="orbit-arm"><circle cx="100" cy="5" r="2.4" fill="#2563eb" /></g>
      </svg>
      ${renderHeroFloatingCards()}

      <div class="hero-center-core">
        <div class="top-pill-badge">
          <span class="live-pulse-dot"></span>
          <span class="i18n-en">${esc(site.topPillEn)}</span>
          <span class="i18n-zh">${esc(site.topPillZh)}</span>
        </div>

        <h1 class="display-headline">
          <span class="i18n-en">
            <span class="hl-line">Our AI Workbench</span>
            <span class="hl-line">where
              <span class="tile-deck" data-deck="ai" aria-label="AI Engines">
                <span class="deck-tooltip">Gemini 4 Prism</span>
                ${renderDeckAiIcons()}
              </span>
              sharp ideas</span>
            <span class="hl-line">turn into
              <span class="tile-deck" data-deck="craft" aria-label="Craft & Products">
                <span class="deck-tooltip">SPEC-01 Hardware UI</span>
                ${renderDeckCraftIcons()}
              </span>
              real craft.</span>
          </span>
          <span class="i18n-zh">
            <span class="hl-line">属于我们的 AI 工作台</span>
            <span class="hl-line">把
              <span class="tile-deck" data-deck="ai-zh">
                <span class="deck-tooltip">主力模型与工作流</span>
                ${renderDeckAiIcons()}
              </span>
              顶尖认知与流，</span>
            <span class="hl-line">锻造成
              <span class="tile-deck" data-deck="craft-zh">
                <span class="deck-tooltip">组件与自研产品</span>
                ${renderDeckCraftIcons()}
              </span>
              产品与作品。</span>
          </span>
        </h1>

        <p class="hero-subcopy">
          <span class="i18n-en">A workspace readable by both humans and AI: every saved site, UI kit and skill tells you why it's great, and comes with a ready-to-paste prompt for your AI.</span>
          <span class="i18n-zh">一个人和 AI 都能读懂的工作台：每条收藏都写清「好在哪、怎么用」，还附带一段整理好的提示词，一键复制就能交给 AI 照着做。</span>
        </p>

        <div class="hero-cta-row">
          <a href="#shelf-design" class="solid-pill-btn lg magnetic-btn">
            <span class="i18n-en">Browse Design Inspiration ↓</span>
            <span class="i18n-zh">按类逛设计 ↓</span>
          </a>
          <a href="#orbit-console" class="soft-pill-btn lg magnetic-btn">
            <span class="i18n-en">Open AI Workbench</span>
            <span class="i18n-zh">进入 AI 工作台</span>
          </a>
        </div>

        ${renderBrandIconsStrip()}
      </div>

      <div class="hero-floor">
        ${stats
          .map(
            ([n, zh, en]) => `
            <div class="hero-stat">
              <strong data-count="${n}">0</strong>
              <span>${esc(zh)}</span>
              <small>${esc(en)}</small>
            </div>`
          )
          .join('')}
        <a class="hero-cue" href="#products-sec">往下看舞台</a>
      </div>
    </section>

    <section class="logo-wall" aria-label="已收录的网站">
      <div class="logo-wall-label"><span class="live-pulse-dot"></span> 已收录 · ${logoItems.length} 个网站正在百宝箱里</div>
      <div class="marquee-band">
        <div class="marquee-track">${logoRowA}${logoRowA}</div>
      </div>
      <div class="marquee-band is-reverse">
        <div class="marquee-track">${logoRowB}${logoRowB}</div>
      </div>
    </section>

    ${renderHomeDepotOverview(data)}

    ${renderPartsStage()}

    ${renderHomeAtelier(products)}

    <section class="stage-wrap" id="orbit-console">
      <div class="cobalt-stage-frame">
        <button type="button" class="stage-play-fab" id="stage-autoplay-btn" title="自动巡航 / 手动锁定" aria-label="Toggle auto tour">
          <span id="stage-play-icon">❚❚</span>
        </button>
        <div class="stage-inner-window">
          <div class="console-progress-track"><div class="console-progress-fill" id="console-tour-bar"></div></div>
          <div class="stage-mini-cards">
            <a href="#orbit-console" class="stage-mini-card">
              <span class="blue-app-badge">${renderDockSvg('orbit-console')}</span>
              <div><strong>Orbit Dispatch · 派工台</strong><small>总师规划、视觉工坊、并发执行</small></div>
              <span class="pill-blue">6 Engines</span>
            </a>
            <a href="#shelf-design" class="stage-mini-card">
              <span class="blue-app-badge">${renderDockSvg('shelf-design')}</span>
              <div><strong>Design Vault · 设计</strong><small>组件、动效、个人站、整站</small></div>
              <span class="pill-mint">${designItems.length} 条</span>
            </a>
            <a href="#products-sec" class="stage-mini-card">
              <span class="blue-app-badge">${renderDockSvg('products-sec')}</span>
              <div><strong>Product Lab · 产品孵化</strong><small>代码视频、已上线与新构想</small></div>
              <span class="pill-mint">${products.length} 个</span>
            </a>
          </div>

          <div class="workbench-split" id="workbench-console-area">
            <div class="wb-sidebar">${wbNavHtml}</div>
            <div class="wb-detail-card" id="wb-dossier">
              <div>
                <div class="wb-detail-top">
                  <span class="pill-blue" id="wb-tier">${esc(firstItem.tier)}</span>
                  <span class="wb-muted-badge" id="wb-badge">${esc(firstItem.badge)}</span>
                  <span class="pause-hint">鼠标移入自动暂停</span>
                </div>
                <h2 id="wb-name">${esc(firstItem.name)}</h2>
                <p class="wb-lead" id="wb-summary">${esc(firstItem.summary)}</p>
                <div class="wb-scores-row" id="wb-scores">${scoresHtml}</div>
                <div class="wb-info-grid">
                  <div class="wb-sub-card">
                    <h4>✓ 为什么它是主力配置</h4>
                    <ul id="wb-strengths">${firstItem.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
                  </div>
                  <div class="wb-sub-card">
                    <h4>! 边界与避坑</h4>
                    <p id="wb-boundaries">${esc(firstItem.boundaries)}</p>
                  </div>
                </div>
              </div>
              <div class="wb-foot-bar">
                <div class="wb-cmd-pill">
                  <code id="wb-skill">${esc(firstItem.pairedSkill)}</code>
                  <button type="button" class="copy-cmd-btn" id="wb-copy-btn" data-copy="${esc(firstItem.pairedSkill)}">Copy</button>
                </div>
                <a id="wb-article-link" ${firstItem.relatedSlug ? `href="/read/${esc(firstItem.relatedSlug)}"` : 'hidden'}>${firstItem.relatedSlug ? `${esc(firstItem.relatedTitle)} →` : ''}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Built for Humans & AI -->
    <section class="content-section wide-sec" id="dual-readable">
      <div class="sec-head-centered reveal-up">
        <span class="mini-pill-badge"><span class="dot-blue"></span> Built for Humans &amp; AI · 人和 AI 都能读</span>
        <h2>Not just a bookmark folder — a context library for AI.</h2>
        <p>人记不住每次该写什么 prompt。所以每条收藏都提前整理好了「给 AI 的那段话」，用的时候复制粘贴就行。</p>
      </div>
      <div class="dual-grid">
        <div class="dual-card tilt-3d reveal-up">
          <span class="dual-kicker">For Humans · 人看</span>
          <h3>一眼看懂好在哪</h3>
          <p>每条收藏都写清「好在哪 / 可借鉴点 / 什么时候用」；悬停卡片能看到网站预览图，点色块能直接复制色号。</p>
          <div class="dual-mini human-mini">
            <div class="hm-shot"><img src="/previews/skimbly.png" alt="" loading="lazy" /></div>
            <div class="hm-dots"><i style="background:#FFFFFF"></i><i style="background:#F6F7F9"></i><i style="background:#2563EB"></i><i style="background:#0A0A0B"></i></div>
          </div>
        </div>
        <div class="dual-card tilt-3d reveal-up is-featured">
          <span class="dual-kicker">For AI · 复制给 AI</span>
          <h3>一键复制整理好的提示词</h3>
          <p>点「✦ 复制给 AI」，拿到的是干净的纯文本：任务、参考对象、配色、重点借鉴、要求，一段都不少，也没有 # 号。</p>
          <div class="dual-mini prompt-mini">
            <div class="pm-row"><span>任务</span>请参考「Skimbly」的设计风格…</div>
            <div class="pm-row"><span>代表配色</span>#FFFFFF / #2563EB / #0A0A0B</div>
            <div class="pm-row"><span>重点借鉴</span>1. 外灰内白的双层卡片…</div>
            <button type="button" class="ai-copy-btn" data-ai-copy="v-skimbly">${renderActionSvg('sparkCheck')}<span class="btn-label">试试复制给 AI</span></button>
          </div>
        </div>
        <div class="dual-card tilt-3d reveal-up">
          <span class="dual-kicker">For Agents · 机器接口</span>
          <h3>Agent 可以直接来读</h3>
          <p>整个百宝箱同时输出成 <code>/llms.txt</code> 和 <code>/vault.json</code>，下一步接入 Orbit MCP，让 Claude Code 写页面时主动来查参考。</p>
          <div class="dual-mini term-mini">
            <div class="term-line"><span class="t-dim">$</span> curl localhost:4321/llms.txt</div>
            <div class="term-line t-green" id="term-type-line"></div>
            <div class="term-actions">
              <a href="/llms.txt" target="_blank" class="soft-pill-btn sm">打开 /llms.txt ↗</a>
              <a href="/vault.json" target="_blank" class="soft-pill-btn sm">vault.json ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${renderHomeRooms(designItems)}

    <!-- Playbook -->
    <section class="content-section wide-sec" id="playbook-sec">
      ${
        originals.length
          ? `<div class="sec-head-centered reveal-up">
        <span class="mini-pill-badge"><span class="dot-orange"></span> Notes · 经历</span>
        <h2><span class="i18n-en">What we lived through, and what we kept.</span><span class="i18n-zh">经历过的，留下来的。</span></h2>
        <p><span class="i18n-en">Things we built, what the company learned, and shortcuts that are short enough to reuse.</span><span class="i18n-zh">自己做过的、公司里的学习、顺手能用的办法，都记在经历里。</span></p>
      </div>
      <div class="cards-grid-2">${homeNotes(originals).map(renderLayeredArticleCard).join('')}</div>
      <div class="sec-bottom-cta"><a href="/originals" class="outlined-pill-btn">全部经历 →</a></div>`
          : ''
      }
      ${renderLibraryTeaser(data)}
    </section>
  `;

  const flatItems = {};
  for (const t of workbench.tracks) for (const item of t.items) flatItems[item.id] = item;

  return renderShell({
    data,
    pageTitle: 'AI Workbench, Design Vault & Product Lab',
    activeNav: 'home',
    bodyHtml,
    extraDataScript: `<script>window.__WORKBENCH_ITEMS__ = ${JSON.stringify(flatItems)};</script>`,
    headExtra: previewPreloadLinks(data),
  });
}

/* ============================================================================
   VAULT PAGE — 画廊式审美陈列馆 + AI 多选组合拼装台
   ============================================================================ */
function renderCompoundSwitch(active) {
  const item = (id, href, label) =>
    `<a class="pill-tab${active === id ? ' is-active' : ''}" href="${href}" aria-current="${active === id ? 'page' : 'false'}">${label}</a>`;
  return `
    <div class="pill-tabs" role="navigation" aria-label="复利系统的两半">
      ${item('sites', '/ecosystem', '网站与设计')}
      ${item('tools', '/kit', 'MCP 与 Skill')}
    </div>`;
}

export function renderKitPage(data) {
  const bodyHtml = `
    <div class="inner-wrap">
      <section class="inner-page-hero">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <a href="/ecosystem">复利系统</a> <span>›</span> <span>工具</span></div>
        <h1>复利系统</h1>
        <p>这一半能装上用。MCP、Skill、工作流和填空模板，交给 Claude、Cursor 或 Codex。给 AI 看的网站在另一半。</p>
        ${renderCompoundSwitch('tools')}
      </section>
      ${renderOtherKit(data)}
    </div>`;
  return renderShell({ data, pageTitle: '复利系统 · 工具', activeNav: 'ecosystem', bodyHtml });
}

export function renderEcosystemPage(data) {
  const vaultItems = data.ecosystem.vaultItems || [];
  const siteItems = vaultItems.filter((item) => (item.shelf || 'design') !== 'toolkit' && item.url);
  const designItems = siteItems.filter((item) => (item.shelf || 'design') === 'design');
  const learningItems = siteItems.filter((item) => item.shelf === 'learning');

  const groupsHtml = `
        <section class="vault-group" data-shelf-group="design" id="shelf-design">
          ${renderDesignLanes(designItems, { gallery: true })}
        </section>
        ${
          learningItems.length
            ? `<section class="vault-group" data-shelf-group="learning" id="shelf-learning">
          ${renderShelfHead('learning', learningItems.length)}
          ${renderMarkWall(learningItems, 'learning')}
        </section>`
            : ''
        }`;

  const bodyHtml = `
    <div class="inner-wrap vault-gallery-root" id="vault-gallery-root" data-view="gallery">
      <section class="vault-hero-bento">
        <div class="vh-main">
          <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <span>复利系统</span></div>
          <h1>复利系统</h1>
          <p>分两半。这一半是给 AI 看的网站和设计，复制过去就能当参考。另一半是 MCP 和 Skill，装上就能用。</p>
          ${renderCompoundSwitch('sites')}
          <div class="vh-controls-bar">
            <div class="vh-right-tools">
              <div class="view-mode-switch" role="group" aria-label="视图切换">
                <button type="button" class="vm-btn is-on" data-vault-view="gallery" title="带实拍预览图的画廊视图">画廊视图</button>
                <button type="button" class="vm-btn" data-vault-view="compact" title="纯规格高密度清单视图">紧凑规格</button>
              </div>
              <input type="search" id="vault-search" class="clean-search" placeholder="搜名称、风格、可借鉴点..." />
            </div>
          </div>
        </div>

        <aside class="vh-composer-hint">
          <div class="vhc-badge"><span class="live-pulse-dot"></span> AI 组合拼装用法</div>
          <h3>挑 2～4 个网站，拼成一条提示词</h3>
          <p>比如同时勾选 <strong>Agentic UI</strong> + <strong>Skimbly（版式）</strong> + <strong>Motion Primitives（动效）</strong>，底部会浮出拼装台，合并后复制给 Claude / Gemini / Cursor。</p>
          <div class="vhc-quick-combo">
            <button type="button" class="soft-pill-btn sm" id="preset-combo-btn">${renderActionSvg('sparkCheck')}<span class="btn-label">一键载入推荐三件套试试</span></button>
            <a href="/kit" class="outlined-pill-btn sm">去看 MCP 与 Skill →</a>
          </div>
        </aside>
      </section>

      ${groupsHtml}
    </div>

    <!-- Floating Multi-Select AI Context Composer Tray -->
    <div class="composer-tray" id="vault-composer-tray" hidden>
      <div class="ct-left">
        <span class="ct-count-badge" id="ct-count">0</span>
        <div class="ct-chips" id="ct-chips"></div>
      </div>
      <div class="ct-right">
        <select id="ct-scene-select" class="ct-scene-select" aria-label="目标场景">
          <option value="新做一个高质感产品官网 / 落地页">用于：新做产品官网</option>
          <option value="重构升级现有 Web 应用界面与交互">用于：升级现有界面</option>
          <option value="搭建 AI Agent 工作台或对话交互界面">用于：搭建 Agent 界面</option>
        </select>
        <button type="button" class="soft-pill-btn sm" id="ct-clear-btn">清空</button>
        <button type="button" class="ai-copy-btn lg-copy" id="ct-copy-combo-btn">${renderActionSvg('sparkCheck')}<span class="btn-label">合并复制给 AI</span></button>
      </div>
    </div>
  `;

  return renderShell({
    data,
    pageTitle: '复利系统 · 网站',
    activeNav: 'ecosystem',
    bodyHtml,
    headExtra: previewPreloadLinks(data),
  });
}

/* ============================================================================
   PRODUCTS PAGE — 工业研发实验室 + FrameScript 代码视频工坊预览台
   ============================================================================ */
function renderFrameScriptSpotlight(p) {
  if (!p) return '';
  return `
    <section class="fs-spotlight" id="framescript">
      <div class="fs-left">
        <div class="fs-kicker-row">
          <span class="pill-flagship">FLAGSHIP SLOT · 核心筹备位</span>
          <span class="pill-gray">${esc(p.formBadge)}</span>
        </div>
        <h2>${esc(p.name)}</h2>
        <p class="fs-lead">${esc(p.tagline)}</p>
        <p class="fs-desc">${esc(p.summary)}</p>

        <div class="fs-scene-tabs" role="tablist" aria-label="切换代码视频分镜预览">
          <button type="button" class="fs-scene-btn is-on" data-fs-scene="hook">
            <span>01</span>
            <div><strong>开场痛点卡点</strong><small>大字重排版 + 节拍高亮</small></div>
          </button>
          <button type="button" class="fs-scene-btn" data-fs-scene="ui">
            <span>02</span>
            <div><strong>真实组件镜头</strong><small>100% 还原前端真实交互</small></div>
          </button>
          <button type="button" class="fs-scene-btn" data-fs-scene="chart">
            <span>03</span>
            <div><strong>数据增长叙事</strong><small>弹簧曲线 + 指标跳变</small></div>
          </button>
        </div>

        <pre class="fs-code-box"><code id="fs-code-view">&lt;Sequence from={0} durationInFrames={90} spring="snappy"&gt;
  &lt;KineticHeadline accent="#3B82F6" beatSync /&gt;
  &lt;CaptionTrack voice="zh-studio" text="改一行文案，整支 60fps 成片即刻重渲" /&gt;
&lt;/Sequence&gt;</code></pre>

        <div class="fs-bottom-actions">
          <button type="button" class="want-btn lg-want" data-want="framescript">${renderActionSvg('upvoteSpark')}<span>想要优先内测</span> <b class="want-count" data-want-count="framescript">0</b></button>
          ${p.relatedArticle ? `<a href="/read/${esc(p.relatedArticle)}" class="soft-pill-btn">${esc(p.ctaLabel)}</a>` : ''}
        </div>
      </div>

      <div class="fs-right">
        <div class="fs-studio-monitor" id="fs-monitor" data-ratio="16:9" data-scene="hook">
          <div class="fsm-topbar">
            <span class="fsm-rec"><i class="rec-dot"></i> RENDER PREVIEW · 60 FPS</span>
            <div class="fsm-ratio-btns" role="group" aria-label="画幅比例切换">
              <button type="button" class="is-on" data-fs-ratio="16:9">16:9 横屏</button>
              <button type="button" class="is-on-alt" data-fs-ratio="9:16">9:16 竖屏</button>
            </div>
          </div>

          <div class="fsm-viewport-wrap">
            <div class="fsm-viewport" id="fsm-viewport">
              <div class="fsm-stage-scene is-on" data-fs-panel="hook">
                <span class="fsv-chip">SCENE 01 · HOOK</span>
                <h4>别再抽盲盒式生成视频。<br/><em>用代码精准控住每一帧。</em></h4>
                <div class="fsv-beat-pills"><span>00.0s 痛点</span><span>01.2s 转折</span><span>02.4s 定调</span></div>
              </div>
              <div class="fsm-stage-scene" data-fs-panel="ui">
                <span class="fsv-chip">SCENE 02 · LIVE UI</span>
                <div class="fsv-mock-ui">
                  <div class="fmu-bar"><i></i><i></i><span>orbit.studio/vault</span></div>
                  <div class="fmu-body">
                    <strong>真实 React 组件直接入镜</strong>
                    <span>字体、圆角、阴影零失真 · 自动推拉特写镜头</span>
                  </div>
                </div>
              </div>
              <div class="fsm-stage-scene" data-fs-panel="chart">
                <span class="fsv-chip">SCENE 03 · DATA STORY</span>
                <div class="fsv-bars">
                  <div><i style="height:34%"></i><small>手剪</small></div>
                  <div><i style="height:52%"></i><small>黑盒生成</small></div>
                  <div class="is-hi"><i style="height:92%"></i><small>FrameScript</small></div>
                </div>
                <strong class="fsv-metric">成片迭代提速 8.5× · 改字零废片</strong>
              </div>
            </div>
          </div>

          <div class="fsm-timeline">
            <button type="button" class="fsm-play-btn" id="fs-play-toggle" aria-label="播放或暂停时间轴">❚❚</button>
            <div class="fsm-tracks">
              <div class="fsm-playhead" id="fs-playhead"></div>
              <div class="fsm-track t-video"><span>Scene_01.tsx</span><span>UI_Zoom.tsx</span><span>Metric_End.tsx</span></div>
              <div class="fsm-track t-audio"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            </div>
            <code class="fsm-timecode" id="fs-timecode">00:01:24</code>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderLabBench() {
  return `
    <section class="lab-bench" id="lab-bench">
      <div class="lab-bench-head">
        <span class="mini-pill-badge"><span class="dot-blue"></span> On the bench · 浏览器即开即用小样</span>
        <h2>不用装环境，现在就能在台上试玩。</h2>
        <p>我们把构想池里的几件高频小工具先做成了纯前端交互原型，点左边切换工具，当场就能跑出结果。</p>
      </div>
      <div class="lab-stage">
        <div class="lab-rail" role="tablist" aria-label="小工具">
          <button type="button" class="lab-tab is-on" data-lab-tool="grain" role="tab" aria-selected="true"><b>${renderProductSvg('motion-spec')}</b><span><strong>散开</strong><small>划过，再聚回来</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="slip" role="tab" aria-selected="false"><b>${renderProductSvg('handoff-keeper')}</b><span><strong>交接单</strong><small>五格，交给下一窗</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="swatch" role="tab" aria-selected="false"><b>${renderProductSvg('style-dna')}</b><span><strong>四色玻璃</strong><small>从一张图里取四色</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="folio" role="tab" aria-selected="false"><b>${renderProductSvg('folio-press')}</b><span><strong>长图目录</strong><small>正文切成可跳的节</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="plastic" role="tab" aria-selected="false"><b>${renderProductSvg('deplastic')}</b><span><strong>去塑料</strong><small>拣出空转的词</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="night" role="tab" aria-selected="false"><b>${renderProductSvg('night-slip')}</b><span><strong>夜间纸条</strong><small>三行，带到明天</small></span></button>
        </div>
      <div class="lab-panes">
        <article class="lab-pane is-on" id="tool-grain" data-lab-pane="grain">
          <header>
            <h3>散开</h3>
            <p>这是台上的一件小工具。划过这四个字，点会让开；离开后再聚回来。点一下，再散一次。</p>
          </header>
          <div class="grain-stage" data-word="散开再聚">
            <canvas id="grain-stage" aria-hidden="true"></canvas>
          </div>
        </article>
        <article class="lab-pane" id="tool-slip" data-lab-pane="slip">
            <header><h3>交接单</h3><p>对话快满的时候，留下下一窗能接上的五格。</p></header>
            <div class="lab-grid">
              <label>目标<input id="slip-goal" value="让收藏从网页进到百宝箱" /></label>
              <label>已验证<textarea id="slip-done" rows="2">截图和四色能在这一页取出来</textarea></label>
              <label>排除过的方向<textarea id="slip-out" rows="2">先不做账号系统</textarea></label>
              <label>关键文件<input id="slip-files" value="content/catalog/ecosystem.json" /></label>
              <label>下一步<input id="slip-next" value="插件按钮只做截图、四色、一句好在哪" /></label>
            </div>
            <pre class="lab-out" id="slip-out-view"></pre>
            <button type="button" class="solid-pill-btn" id="slip-copy">复制交接单</button>
          </article>
          <article class="lab-pane" id="tool-swatch" data-lab-pane="swatch">
            <header><h3>四色玻璃</h3><p>底、面、字、一个强调。多出来的颜色先拿掉。</p></header>
            <div class="swatch-presets" id="swatch-presets">
              <button type="button" data-swatch="paper">纸色工作台</button>
              <button type="button" data-swatch="cloth">认知布</button>
              <button type="button" data-swatch="ink">墨</button>
            </div>
            <label class="swatch-file">或放一张图<input id="swatch-file" type="file" accept="image/*" /></label>
            <div class="swatch-row" id="swatch-row"></div>
            <p class="lab-prompt" id="swatch-prompt"></p>
            <button type="button" class="solid-pill-btn" id="swatch-copy">复制这四色</button>
          </article>
          <article class="lab-pane" id="tool-folio" data-lab-pane="folio">
            <header><h3>长图目录</h3><p>按空行分节。短段当成标题，长段留在正文里。</p></header>
            <textarea id="folio-src" rows="7">一个人打开太长的对话，往往不是因为问题大，而是因为上一窗没留下能接上的句子。

交接单只要五格。目标、已验证、排除过的方向、关键文件、下一步。下一步只写一个动作。

色不是感觉。四色就够：底、面、字、一个强调。多出来的颜色先拿掉。

长文要能跳。目录是给人回查的，不是给作者展示结构的。</textarea>
            <div class="folio-read">
              <ol class="folio-toc" id="folio-toc"></ol>
              <div class="folio-prose" id="folio-prose"></div>
            </div>
          </article>
          <article class="lab-pane" id="tool-plastic" data-lab-pane="plastic">
            <header><h3>去塑料</h3><p>贴上一句介绍。空转的词会被点出来。</p></header>
            <textarea id="plastic-src" rows="4">我们致力于赋能每一位创作者，打造一站式智能驱动的闭环体验，重新定义效率。</textarea>
            <div class="plastic-read" id="plastic-read"></div>
            <p class="lab-prompt" id="plastic-note"></p>
          </article>
          <article class="lab-pane" id="tool-night" data-lab-pane="night">
            <header><h3>夜间纸条</h3><p>做成了，卡住了，明天第一件。三行就收工。</p></header>
            <div class="lab-grid">
              <label>做成了<textarea id="night-done" rows="2">产品页台上放了五件能直接用的小样</textarea></label>
              <label>卡住了<textarea id="night-stuck" rows="2">长图里的字还要人来贴，图片自己还读不了</textarea></label>
              <label>明天第一件<input id="night-next" value="只把交接单五格用在一个真实任务上" /></label>
            </div>
            <pre class="lab-out" id="night-out"></pre>
            <button type="button" class="solid-pill-btn" id="night-copy">复制今晚的纸条</button>
          </article>
        </div>
      </div>
    </section>`;
}

export function renderProductsPage(data) {
  const products = data.ecosystem.products || [];
  const flagshipProd = products.find((p) => p.id === 'framescript');
  const groups = [
    ['live', '已上线 · Shipped', '已经在团队里天天运转、验证过价值的作品。'],
    ['beta', '内测打磨 · In Beta', '核心链路已跑通，正在重点迭代工程体验。'],
    ['concept', '孵化构想池 · Idea Lab', '围绕「审美复用 · 代码视频 · 评测护栏」储备的新物种。点「想要」给它加一票，高票优先立项。'],
  ];

  const bodyHtml = `
    <div class="inner-wrap products-lab-root">
      <section class="inner-page-hero">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <span>Product Lab</span></div>
        <h1>Product Lab · 产品孵化</h1>
        <p>我们的产品矩阵围绕一条闭环生长：<strong>捕获好品味 → 拆解成参数与提示词 → 用代码生成界面与高清视频 → 让 Agent 自治验证交付</strong>。</p>
        <div class="roadmap-line">
          <span class="rm-step is-done">01 捕获 · Taste Clipper</span>
          <span class="rm-arrow">→</span>
          <span class="rm-step is-done">02 整理 · 百宝箱 + 复制给 AI</span>
          <span class="rm-arrow">→</span>
          <span class="rm-step is-highlight">03 成片 · FrameScript 代码视频</span>
          <span class="rm-arrow">→</span>
          <span class="rm-step">04 自治 · Orbit MCP + Eval 靶场</span>
        </div>
      </section>
      ${renderFrameScriptSpotlight(flagshipProd)}
      ${renderLabBench()}
      ${groups
        .map(([stage, title, desc]) => {
          const list = products.filter((p) => p.stage === stage && p.id !== 'framescript');
          if (!list.length) return '';
          return `
            <section class="arsenal-block">
              <div class="block-title-row"><h2>${esc(title)}</h2><span>${esc(desc)}</span></div>
              <div class="cards-grid-2">${list.map((p) => renderProductCard(p)).join('')}</div>
            </section>
          `;
        })
        .join('')}
    </div>
  `;

  return renderShell({ data, pageTitle: 'Product Lab · 产品孵化', activeNav: 'products', bodyHtml });
}

/* ============================================================================
   CATALOG & READER
   ============================================================================ */
const PRESSES = [
  { id: 'cognition', name: '认知', en: 'Cognition', line: '泡泡oc 的四层认知长文：从一元、二元、多元走到十楼看二楼的系统视角。' },
  { id: 'product', name: '产品', en: 'Product', line: '奔跑的大毛腿双篇：AI 怎么跟完一个需求全程，以及五层技术栈到底要懂到哪一层。' },
  { id: 'practice', name: '做法', en: 'Practice', line: 'Karpathy 的日常四支柱与系统三原语、Addy Osmani 怎么验收、Lauren Tan 怎么收代码花园。' },
  { id: 'creators', name: '做成', en: 'Making', line: 'Tobi 怎么让 Claude 像真工作室一样做设计、Dan Koe 的一人创意团队、甲维斯机的代码爆炸大片。' },
  { id: 'other', name: '其他', en: 'Other', line: '' },
];
const PRESS_BY_ID = Object.fromEntries(PRESSES.map((p) => [p.id, p]));

function bookFaceTitle(article) {
  return article.title || article.coverTitle || '';
}

function bookTitleHtml(article) {
  return bookFaceTitle(article)
    .split('|')
    .map((part) => esc(part.trim()))
    .filter(Boolean)
    .join('<br>');
}

function renderBook(article, index) {
  const press = PRESS_BY_ID[article.publisher] || PRESS_BY_ID.other;
  const num = String(index + 1).padStart(2, '0');
  const isSource = article.layout === 'source';
  const note = String(article.studioNoteBody || article.summary || '').replace(/\s+/g, ' ');
  const imprint = article.originalAuthor || press.name;
  const faces = ['poster', 'band', 'index', 'ticket', 'low'];
  const face = faces.includes(article.coverFace) ? article.coverFace : faces[index % faces.length];
  const sections = (article.toc || []).length;
  const faceChars = [...bookFaceTitle(article)].filter((ch) => ch.trim() && !'一—-：:'.includes(ch));
  const glyph = faceChars[0] || '';
  const dek = String(article.summary || article.subtitle || note).replace(/\s+/g, ' ');
  return `
    <a class="book press-${esc(press.id)} face-${esc(face)}" href="/read/${esc(article.slug)}" data-publisher="${esc(press.id)}" data-search="${esc(
      [article.title, article.summary, article.category, article.originalAuthor, article.originalOrg, note].filter(Boolean).join(' ')
    )}" style="--i:${index}">
      <span class="book-3d">
        <span class="book-spine" aria-hidden="true"><b>${num}</b></span>
        <span class="book-board">
          <span class="book-face" data-glyph="${esc(glyph)}">
            <span class="book-press-row">${article.sourceUrl ? favImg({ url: article.sourceUrl }, 'book-fav') : ''}<span class="book-press">${esc(press.name)}</span><span class="book-chip">${sections ? `${sections} 节` : '全文'}</span></span>
            <span class="book-title">${bookTitleHtml(article)}</span>
            <span class="book-dek">${esc(dek)}</span>
            <span class="book-foot">
              <span class="book-author">${esc(imprint)}</span>
              <span role="button" tabindex="0" class="book-copy-ai" data-ai-copy="curated-${esc(article.slug)}" title="复制这篇的提示词给 AI">复制</span>
            </span>
          </span>
        </span>
      </span>
    </a>
  `;
}

function renderLibraryTeaser(data) {
  const teaserPresses = ['cognition', 'product', 'practice', 'creators'];
  const featured = teaserPresses
    .map((id) => (data.curated || []).find((a) => a.publisher === id))
    .filter(Boolean);
  if (!featured.length) return '';
  return `
    <div class="library-teaser reveal-up">
      <div class="library-teaser-copy">
        <p class="press-kicker">Curated · ${(data.curated || []).length} 篇</p>
        <h3>点名留下的几篇</h3>
        <p>封面先写出题目和这一篇在讲什么。点进去按左边的目录，从开头读到结尾。</p>
        <a href="/curated" class="solid-pill-btn">打开全部 ${(data.curated || []).length} 本书架 →</a>
      </div>
      <div class="shelf-books is-teaser" aria-label="精选好文预览">
        ${featured.map((article, i) => renderBook(article, i)).join('')}
      </div>
    </div>
  `;
}

function renderCuratedLibrary(data) {
  const items = data.curated || [];
  const groups = PRESSES.map((press) => ({
    press,
    books: items.filter((article) => (article.publisher || 'other') === press.id),
  })).filter((group) => group.books.length);

  const bodyHtml = `
    <div class="inner-wrap press-room">
      <section class="inner-page-hero">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <span>精选好文</span></div>
        <h1>精选好文</h1>
        <p>只留点名收进来的几篇。每一篇都是一篇文章：封面上看得到题目，点开后按目录从头读到尾。</p>
        <div class="toolbar-row press-toolbar">
          <div class="press-rail" role="tablist" aria-label="按出处筛选">
            <button type="button" class="press-pill is-active" data-press="all" role="tab" aria-selected="true">全部 <span>${items.length}</span></button>
            ${groups
              .map(
                (group) =>
                  `<button type="button" class="press-pill" data-press="${esc(group.press.id)}" role="tab" aria-selected="false"><i class="press-swatch press-${esc(group.press.id)}" aria-hidden="true"></i>${esc(group.press.name)} <span>${group.books.length}</span></button>`
              )
              .join('')}
          </div>
          <input type="search" id="catalog-search" class="clean-search" placeholder="搜标题、作者或笔记..." />
        </div>
      </section>
      <div id="press-shelves">
        ${groups
          .map(
            (group) => `
          <section class="press-shelf" id="press-${esc(group.press.id)}" data-press-shelf="${esc(group.press.id)}">
            <header class="press-shelf-head">
              <div>
                <p class="press-kicker">${esc(group.press.en)}</p>
                <h2>${esc(group.press.name)}</h2>
              </div>
              <p>${esc(group.press.line)}</p>
            </header>
            <div class="shelf-books">
              ${group.books.map((article, index) => renderBook(article, index)).join('')}
            </div>
          </section>`
          )
          .join('')}
      </div>
      <p class="press-empty" id="press-empty" hidden>这排书架上没有对得上的书。</p>
    </div>
  `;

  return renderShell({ data, pageTitle: 'Curated · 精选好文', activeNav: 'curated', bodyHtml });
}

function homeNotes(originals) {
  const company = originals.filter((item) => item.lane === 'company');
  const made = originals.filter((item) => (item.lane || 'made') === 'made');
  return [...company.slice(0, 1), ...made.slice(0, 1)];
}

function renderMonographIssueCard(article, idx) {
  const num = String(idx + 1).padStart(2, '0');
  const badgeHtml = article.access === 'pro' ? `<span class="pill-pro">Pro</span>` : `<span class="pill-mint">Free</span>`;
  return `
    <article class="card-shell monograph-card spotlight-card reveal-up" data-access="${esc(article.access)}" data-search="${esc(article.title + ' ' + article.summary + ' ' + article.category)}">
      <a href="/read/${esc(article.slug)}" class="monograph-inner">
        <div class="mono-left">
          <div class="mono-issue-row">
            <span class="mono-issue-num">ISSUE ${num}</span>
            <span class="cat-label">${esc(article.category)}</span>
            ${badgeHtml}
          </div>
          <h2>${esc(article.title)}</h2>
          <p class="mono-sub">${esc(article.subtitle || article.summary)}</p>
          <div class="mono-meta-foot">
            <span>${esc(article.date)} · ${esc(article.readingTime)}</span>
            ${article.pairedSkill ? `<code class="mono-skill">⌘ ${esc(article.pairedSkill)}</code>` : ''}
            <span class="arrow-read">展开全文 →</span>
          </div>
        </div>
        <div class="mono-right">
          ${renderMonographSvg(idx)}
        </div>
      </a>
    </article>
  `;
}

function renderNoteLaneSection(lane, items) {
  const isMade = lane.id === 'made';
  const cards = isMade ? items.map((it, idx) => renderMonographIssueCard(it, idx)).join('') : items.map(renderLayeredArticleCard).join('');
  const empty =
    lane.id === 'method'
      ? '短办法还没写进来。一条能照着做的步骤，就够放在这一格。'
      : '这一格还空着。';
  return `
    <section class="note-section" data-note-section="${esc(lane.id)}">
      <header class="lane-head">
        <div>
          <span class="lane-kicker">${esc(lane.en)}</span>
          <h3>${bi(lane.en, lane.zh)} <span class="shelf-count">${items.length}</span></h3>
        </div>
        <p>${bi(lane.en === 'Built' ? 'Things we actually made and checked.' : lane.en === 'Company' ? 'Internal learning: knowledge, the call we made, and where it stands.' : 'Short enough to follow. It does not need to become an essay.', lane.line)}</p>
      </header>
      ${cards ? `<div class="${isMade ? 'monograph-stack' : 'cards-grid-2'}">${cards}</div>` : ''}
      <p class="note-empty" data-note-empty ${cards ? 'hidden' : ''}>${esc(empty)}</p>
    </section>`;
}

function renderCompanySection(items) {
  const blocks = COMPANY_MODULES.map((mod) => {
    const mine = items.filter((item) => item.module === mod.id);
    const cards = mine.map(renderLayeredArticleCard).join('');
    return `
      <div class="note-module" data-note-module-block="${esc(mod.id)}">
        <h4>${bi(mod.en, mod.zh)} <span class="shelf-count">${mine.length}</span></h4>
        <p>${bi(
          mod.id === 'knowledge'
            ? 'What we learned, whether we used it, and when to use it again.'
            : mod.id === 'decision'
              ? 'The options at the time, and why this one. A wrong call stays written as a wrong call.'
              : 'Where it stands now. A half-finished note is allowed.',
          mod.line
        )}</p>
        ${cards ? `<div class="cards-grid-2">${cards}</div>` : `<p class="note-empty" data-note-empty>这一格还空着。</p>`}
      </div>`;
  }).join('');
  const loose = items.filter((item) => !COMPANY_MODULES.some((mod) => mod.id === item.module));
  const looseHtml = loose.length ? `<div class="cards-grid-2">${loose.map(renderLayeredArticleCard).join('')}</div>` : '';
  return `
    <section class="note-section" data-note-section="company">
      <header class="lane-head">
        <div>
          <span class="lane-kicker">Company</span>
          <h3>${bi('Company', '公司里')} <span class="shelf-count">${items.length}</span></h3>
        </div>
        <p>${bi('Internal learning. Knowledge, the decision, and the current state each get a drawer.', '公司内部的学习。知识、当时怎么定的、现在进行到哪，各放一格。')}</p>
      </header>
      <div class="pill-tabs note-modules" role="group" aria-label="公司里的分格">
        <button type="button" class="pill-tab is-active" data-note-module="all" aria-selected="true">${bi('All three', '三格都看')} <span class="lane-count">${items.length}</span></button>
        ${COMPANY_MODULES.map(
          (mod) =>
            `<button type="button" class="pill-tab" data-note-module="${esc(mod.id)}" aria-selected="false">${bi(mod.en, mod.zh)} <span class="lane-count">${items.filter((item) => item.module === mod.id).length}</span></button>`
        ).join('')}
      </div>
      ${blocks}
      ${looseHtml}
    </section>`;
}

export function renderCreatorPage(data) {
  return renderCreatorSystemPage(data, { renderShell });
}

export function renderCatalogPage(data, mode = 'originals') {
  if (mode === 'curated') return renderCuratedLibrary(data);
  const { originals } = data;
  let essaysSectionHtml = '';
  if (originals.length) {
    const byLane = (id) => originals.filter((item) => (item.lane || 'made') === id);
    essaysSectionHtml = NOTE_LANES.map((lane) =>
      lane.id === 'company' ? renderCompanySection(byLane('company')) : renderNoteLaneSection(lane, byLane(lane.id))
    ).join('');
  }
  return renderFutureSelfDepotPage(data, {
    renderShell,
    essaysSectionHtml,
    essaysCount: originals.length,
  });
}

export function renderReaderPage(data, article) {
  const { site, bySlug } = data;
  const noteLane = NOTE_LANES.find((lane) => lane.id === article.lane);
  const pressMeta = PRESS_BY_ID[article.publisher] || PRESS_BY_ID.other;
  const backHref =
    article.kind === 'curated' ? '/curated' : noteLane && noteLane.id !== 'made' ? `/originals?lane=${noteLane.id}` : '/originals';
  const backLabel = article.kind === 'curated' ? 'Curated · 精选好文' : noteLane ? `弹药库 · ${noteLane.zh}` : '弹药库';

  const tocItemsHtml = article.toc.length
    ? article.toc
        .map(
          (item) =>
            `<li><a href="#${esc(item.id)}"><span class="toc-num">${esc(item.num)}</span><span>${esc(item.title)}</span></a></li>`
        )
        .join('')
    : `<li><a href="#reader-sheet" class="is-current"><span class="toc-num">01</span><span>正文阅读</span></a></li>`;

  const studioNoteHtml =
    article.studioNoteBody
      ? `<aside class="studio-note-shell"><div class="studio-note-inner"><div class="sn-head"><span class="dot-blue"></span><strong>${esc(article.studioNoteTitle || '读前导读 · 实战笔记')}</strong></div><p>${esc(article.studioNoteBody)}</p></div></aside>`
      : '';

  const proPaywallHtml =
    article.access === 'pro' && article.hasProCut
      ? `
      <div class="pro-gate-wrapper" id="pro-gate-card">
        <div class="pro-fade-mask"></div>
        <div class="card-shell pro-lock-shell">
          <div class="card-inner centered-lock">
            <span class="mini-pill-badge"><span class="dot-blue"></span> Pro Chapter</span>
            <h3>开通 ${esc(site.proPlan.nameZh)} 继续阅读下半部分</h3>
            <p class="pro-card-desc">后半部分包含完整配置细节与可复用模板。也可以点右上角「预览状态」直接查看解锁后的页面。</p>
            <div class="pro-card-actions">
              <button type="button" class="solid-pill-btn" data-open-modal="pro-modal">开通 Pro · ${esc(site.proPlan.earlyBirdPrice)} ${esc(site.proPlan.earlyBirdLabel)}</button>
              <button type="button" class="soft-pill-btn" id="inline-pro-preview-btn">演示：直接展开全文</button>
            </div>
            <p class="pro-reassure">${esc(site.proPlan.countdownNote)}</p>
          </div>
        </div>
      </div>
      <div class="pro-rest-content" id="pro-rest-content" hidden>
        <div class="pro-unlocked-ribbon">✓ Pro Unlocked Preview Active</div>
        ${article.proRestHtml}
      </div>
    `
      : article.proRestHtml;

  const relatedArticles = article.relatedSlugs.map((slug) => bySlug.get(slug)).filter(Boolean);
  const relatedAreBooks = relatedArticles.length > 0 && relatedArticles.every((item) => item.kind === 'curated');
  const relatedCards = relatedAreBooks
    ? `<div class="shelf-books is-related">${relatedArticles.map((item, index) => renderBook(item, index)).join('')}</div>`
    : `<div class="cards-grid-2">${relatedArticles.map(renderLayeredArticleCard).join('')}</div>`;

  const tocRail = `
    <aside class="doc-rail" aria-label="本篇目录与信息">
      <div class="rail-progress-box">
        <div class="rpb-row">
          <span>本篇阅读进度</span>
          <strong id="rail-progress-pct">0%</strong>
        </div>
        <div class="rail-progress-track"><i id="rail-progress-fill"></i></div>
      </div>

      <div class="rail-toc-box">
        <p class="doc-rail-kicker">CHAPTERS · 章节目录</p>
        <ol class="doc-toc">${tocItemsHtml}</ol>
      </div>

      <div class="rail-source-card">
        <span class="doc-rail-kicker">SOURCE · 出处与工具</span>
        <strong>${esc(article.originalAuthor || site.brandName)}</strong>
        ${article.originalOrg ? `<span class="rsc-org">${esc(article.originalOrg)}</span>` : ''}
        <span class="rsc-meta">${esc(article.date)} · ${esc(article.readingTime)}</span>
        <div class="rsc-actions">
          ${article.sourceUrl ? `<a href="${esc(article.sourceUrl)}" target="_blank" rel="noopener" class="rsc-ext">查看原帖 / 原文 ↗</a>` : ''}
          ${article.kind === 'curated' ? `<button type="button" class="ai-copy-btn full-w-btn" data-ai-copy="curated-${esc(article.slug)}">${renderActionSvg('sparkCheck')}<span class="btn-label">复制方法论给 AI</span></button>` : ''}
        </div>
      </div>
    </aside>
  `;

  const bodyHtml = `
    <div class="inner-wrap reader-page-root">
      <div class="doc-folio has-rail">
        <div class="reader-nav-bar">
          <div class="breadcrumb-muted">
            <a href="/">Workbench</a> <span>›</span> <a href="${backHref}">${backLabel}</a>
            ${article.kind === 'curated' ? `<span>›</span> <span>${esc(pressMeta.name)}</span>` : ''}
          </div>
          <div class="reader-controls">
            ${article.access === 'pro' ? `<button type="button" class="preview-switch-pill" id="founder-pro-toggle">预览状态：<strong id="pro-mode-state">访客试读锁</strong></button>` : ''}
            <div class="seg-group" role="group" aria-label="正文字体">
              <button type="button" class="seg-btn is-active" data-font="sans">无衬线</button>
              <button type="button" class="seg-btn" data-font="serif">书宋衬线</button>
            </div>
            <div class="seg-group" role="group" aria-label="正文字号">
              <button type="button" class="seg-btn" data-size="sm">A-</button>
              <button type="button" class="seg-btn is-active" data-size="md">适中</button>
              <button type="button" class="seg-btn" data-size="lg">A+</button>
            </div>
            <div class="reader-tools">
              ${
                article.kind === 'curated'
                  ? `<button type="button" class="icon-ghost-btn" data-ai-open="curated-${esc(article.slug)}" title="查看给 AI 的提示词">${renderActionSvg('promptDoc')}<span>Prompt</span></button><button type="button" class="ai-copy-btn" data-ai-copy="curated-${esc(article.slug)}">${renderActionSvg('sparkCheck')}<span class="btn-label">复制给 AI</span></button>`
                  : ''
              }
              <button type="button" class="soft-pill-btn sm" data-open-share-card data-share-kicker="${esc((article.originalAuthor || article.originalOrg || 'Orbit') + ' · 精选好文')}" data-share-title="${esc(article.title)}" data-share-body="${esc(article.studioNoteBody || article.summary || '')}" data-share-tags="#精选好文 #AI认知 #实战笔记">${renderActionSvg('shareCard')}<span>分享卡</span></button>
              <button type="button" class="soft-pill-btn sm" id="audio-companion-btn">${renderActionSvg('sound')}<span>听</span></button>
            </div>
          </div>
        </div>

        ${tocRail}

        <article class="reader-shell" id="reader-sheet" data-font="sans" data-size="md">
          <div class="reader-inner">
            <header class="reader-hero">
              <div class="reader-meta-pills">
                <span class="lane-pill">${esc(article.kind === 'curated' ? pressMeta.name + ' · ' + article.category : article.chapter || 'Playbook')}</span>
                ${article.access === 'pro' ? '<span class="pill-pro">深度</span>' : '<span class="pill-mint">全文开放</span>'}
                <span class="muted-text">${esc(article.date)} · ${esc(article.readingTime)}</span>
              </div>
              <h1>${esc(article.title)}</h1>
              ${article.subtitle ? `<p class="reader-lead">${esc(article.subtitle)}</p>` : ''}
              <p class="doc-source">
                ${
                  article.kind === 'curated'
                    ? `${article.sourceUrl ? favImg({ url: article.sourceUrl }, 'reader-fav') : ''}<span>原作者：<strong>${esc(article.originalAuthor || article.originalOrg)}</strong>${article.originalOrg ? ' · ' + esc(article.originalOrg) : ''}</span>${article.sourceUrl ? `<a href="${esc(article.sourceUrl)}" target="_blank" rel="noopener" class="ext-link">阅读原帖出处 ↗</a>` : ''}`
                    : `<span>配套胶囊：<code>${esc(article.pairedSkill || 'orbit-core')}</code></span>`
                }
              </p>
            </header>

            <div class="audio-player-bar" id="audio-player-bar" hidden>
              <span>♪ 语音伴读播放中</span>
              <button type="button" class="text-action-btn" id="audio-stop-btn">停止并收起</button>
            </div>

            ${studioNoteHtml}

            <div class="chapter-prose">
              ${article.previewHtml}
              ${proPaywallHtml}
            </div>

            <footer class="reader-end-bar">
              <a href="${backHref}" class="soft-pill-btn sm">← 返回书架目录</a>
              <div class="reb-right">
                ${article.sourceUrl ? `<a href="${esc(article.sourceUrl)}" target="_blank" rel="noopener" class="soft-pill-btn sm">访问原文出处 ↗</a>` : ''}
                ${article.kind === 'curated' ? `<button type="button" class="ai-copy-btn" data-ai-copy="curated-${esc(article.slug)}">${renderActionSvg('sparkCheck')}<span class="btn-label">复制核心方法给 AI</span></button>` : ''}
              </div>
            </footer>
          </div>
        </article>
      </div>

      ${relatedArticles.length ? `<section class="related-wrap"><h3 class="related-heading">顺着往下看</h3>${relatedCards}</section>` : ''}
    </div>
  `;

  return renderShell({ data, pageTitle: article.title, activeNav: article.kind === 'curated' ? 'curated' : 'originals', bodyHtml });
}
