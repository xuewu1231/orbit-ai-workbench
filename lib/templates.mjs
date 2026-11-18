function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
    .replace(/((?:href|src|data-preview-img)=")\//g, `$1${base}/`)
    .replace(/("href":")\//g, `$1${base}/`);
}

/* ============================================================================
   SHELF & KIND META — 百宝箱分区：设计 / 学习收藏 / 技能工具箱
   设计下面再分一栏：UI 组件、动效、等待动画、个人网站、整站参考、视觉风格
   ============================================================================ */
export const DESIGN_LANES = [
  { id: 'ui-lib', zh: 'UI 组件', en: 'Components', line: '对话、控件和能拷进项目的零件。缺一块，就来拿一块。' },
  { id: 'motion', zh: '动效', en: 'Motion', line: '弹簧过渡、图标变形、空间展开。一屏只加一两处。' },
  { id: 'loader', zh: '等待动画', en: 'Waiting', line: '模型在想的时候，用会说话的动画代替一个转圈。' },
  { id: 'personal', zh: '个人网站', en: 'Personal', line: '精选过的个人站和作品集目录。极简这一档先看。' },
  { id: 'design-site', zh: '整站参考', en: 'Sites', line: '整页的版式、进站方式和气质，不是单个零件。' },
  { id: 'style', zh: '视觉风格', en: 'Style', line: '配色、字体和编号体系。先定调性，再动手。' },
];

export const SHELVES = {
  design: {
    code: '01',
    en: 'Design',
    zh: '设计',
    dot: 'dot-blue',
    icon: '✦',
    desc: '设计类收藏。下面再分一栏：UI 组件、动效、等待动画、个人网站、整站参考、视觉风格。每条网站的标签都不一样。',
  },
  learning: {
    code: '02',
    en: 'Learning Shelf',
    zh: '学习收藏',
    dot: 'dot-orange',
    icon: '❖',
    desc: '不看设计，学方法：Prompt / Bot 市场、案例库、实战指南。复制给 AI，让它帮你提炼可落地的做法。',
  },
  toolkit: {
    code: '03',
    en: 'Skills & Workflows',
    zh: '技能工具箱',
    dot: 'dot-mint',
    icon: '⌘',
    desc: '能直接装进项目里干活的 Skill、工作流和 AI 提效工具。复制给 AI，让它帮你接入。',
  },
};

const KIND_ICON = {
  'design-site': { cls: 'tile-blue', sym: '✦' },
  personal: { cls: 'tile-mint', sym: '⌂' },
  'ui-lib': { cls: 'tile-indigo', sym: '❖' },
  motion: { cls: 'tile-rose', sym: '↻' },
  loader: { cls: 'tile-amber', sym: '◌' },
  style: { cls: 'tile-amber', sym: '◐' },
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
  return `<div class="squircle-icon fav-tile ${ic.cls}"><span class="fav-fallback">${ic.sym}</span>${favImg(item)}</div>`;
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
  lines.push('## 实战原创与精选好文');
  lines.push('');
  for (const a of [...originals, ...curated]) {
    lines.push(`- ${a.title} </read/${a.slug}>：${a.summary}`);
  }
  lines.push('');
  return lines.join('\n');
}

export function buildVaultExport(data) {
  const base = siteBase();
  const withBase = (p) => (p && base && p.startsWith('/') ? `${base}${p}` : p);
  return {
    name: `${data.site.brandName} ${data.site.brandSub}`,
    generatedAt: new Date().toISOString(),
    shelves: SHELVES,
    vault: (data.ecosystem.vaultItems || []).map((it) => ({
      ...it,
      preview: withBase(it.preview),
      aiPrompt: sectionsToText(buildPromptSections(it)),
    })),
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
  return `
    <svg class="orbit-mark" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="18" height="18" rx="5.5" fill="currentColor"/>
      <circle cx="11" cy="11" r="4.6" stroke="var(--bg-canvas)" stroke-width="1.8"/>
      <circle cx="15.2" cy="6.8" r="1.7" fill="#3B82F6"/>
    </svg>
  `;
}

function renderAppTileIcon(article) {
  const isCurated = article.kind === 'curated';
  const toneClass = isCurated ? 'tile-indigo' : article.access === 'pro' ? 'tile-dark' : 'tile-blue';
  const glyph = isCurated
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`;
  return `<div class="squircle-icon ${toneClass}" aria-hidden="true">${glyph}</div>`;
}

function buildSearchIndex(data) {
  const items = [];
  for (const a of data.allArticles) {
    items.push({
      type: a.kind === 'curated' ? '精选好文' : '实战原创',
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
    items.push({ type: '填空模板', title: t.title, desc: t.desc, href: `/ecosystem#templates` });
  }
  return items;
}

function renderDesignLanes(items) {
  const lanes = DESIGN_LANES.map((lane) => ({
    ...lane,
    items: items.filter((item) => item.kind === lane.id),
  })).filter((lane) => lane.items.length);
  const rail = `
    <div class="pill-tabs lane-rail" role="group" aria-label="设计细分">
      <button type="button" class="pill-tab is-active" data-lane-filter="all" aria-selected="true">全部设计 <span>${items.length}</span></button>
      ${lanes
        .map(
          (lane) =>
            `<button type="button" class="pill-tab" data-lane-filter="${esc(lane.id)}" aria-selected="false">${esc(lane.zh)} <span>${lane.items.length}</span></button>`
        )
        .join('')}
    </div>
    <p class="lane-empty" data-lane-empty hidden>这一栏里没有对得上的收藏。</p>`;
  const sections = lanes
    .map(
      (lane) => `
      <section class="design-lane" data-design-lane="${esc(lane.id)}">
        <header class="lane-head">
          <div>
            <span class="lane-kicker">${esc(lane.en)}</span>
            <h3>${esc(lane.zh)} <span class="shelf-count">${lane.items.length}</span></h3>
          </div>
          <p>${esc(lane.line)}</p>
        </header>
        <div class="cards-grid-3">${lane.items.map(renderVaultCard).join('')}</div>
      </section>`
    )
    .join('');
  return rail + sections;
}

function renderVaultCard(item) {
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
    <article id="${esc(item.id)}" class="card-shell spotlight-card vault-card tilt-3d reveal-up" data-shelf="${esc(shelf)}" data-vault-kind="${esc(item.kind)}" data-vault-search="${esc(
      item.name + ' ' + item.kindLabel + ' ' + item.tag + ' ' + item.whyGood + ' ' + item.whenToUse + ' ' + (item.borrow || []).join(' ')
    )}" ${previewAttrs}>
      <div class="card-inner">
        <div class="card-head-row">
          ${renderFavTile(item, ic)}
          <div class="card-badges">
            ${lane ? `<span class="lane-pill">${esc(lane.zh)}</span>` : `<span class="cat-label">${esc(item.kindLabel)}</span>`}
            <span class="pill-gray">${esc(item.tag)}</span>
          </div>
        </div>
        <h3>${esc(item.name)}${item.url ? '<span class="preview-hint" aria-hidden="true">悬停预览</span>' : ''}</h3>
        <p class="vault-why">${esc(item.whyGood)}</p>
        ${borrowHtml}
        ${cmdHtml}
      </div>
      <div class="card-shell-foot vault-foot">
        ${swatchesHtml}
        <div class="vault-actions">
          <button type="button" class="icon-ghost-btn" data-ai-open="${esc(item.id)}" title="查看给 AI 的提示词">Prompt</button>
          <button type="button" class="ai-copy-btn" data-ai-copy="${esc(item.id)}">✦ 复制给 AI</button>
          ${item.url ? `<a class="icon-ghost-btn" href="${esc(item.url)}" target="_blank" rel="noopener" title="打开原站">↗</a>` : ''}
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
        <button type="button" class="soft-pill-btn sm" data-copy-shelf="${key}">✦ 整组复制给 AI</button>
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
  const wantOrRead =
    p.stage === 'concept'
      ? `<button type="button" class="want-btn" data-want="${esc(p.id)}">＋ 想要 <b class="want-count" data-want-count="${esc(p.id)}">0</b></button>`
      : `<a href="/read/${esc(p.relatedArticle)}" class="arrow-read">${esc(p.ctaLabel)}</a>`;
  const footRight = `<span class="card-foot-actions">${tryLink}${wantOrRead}</span>`;

  return `
    <article id="${esc(p.id)}" class="card-shell spotlight-card tilt-3d product-card reveal-up ${compact ? 'is-compact' : ''}" data-stage="${esc(p.stage)}">
      <div class="card-inner">
        <div class="card-head-row">
          <div class="squircle-icon product-ico ${st.cls}-ico">${esc(p.icon || '⚡')}</div>
          <div class="card-badges">
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
    ['products-sec', '◎', '产品舞台'],
    ['orbit-console', '⚡', 'AI 工作台'],
    ['dual-readable', '⌁', '人 & AI 双读'],
    ['shelf-design', '✦', '收藏房间'],
    ['playbook-sec', '☰', '原创与好文'],
  ];
  return `
    <nav class="side-dock" id="side-dock" aria-label="页面分区导航">
      ${items
        .map(
          ([id, ico, label]) =>
            `<a href="#${id}" data-dock="${id}" aria-label="${label}"><span class="dock-ico">${ico}</span><span class="dock-label">${label}</span></a>`
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

function navMark(kind) {
  if (kind === 'morph') return '<i class="nav-glyph g-morph" aria-hidden="true"></i>';
  if (kind === 'think') return '<i class="nav-glyph g-think" aria-hidden="true"><b></b><b></b><b></b></i>';
  if (kind === 'pages') return '<i class="nav-glyph g-pages" aria-hidden="true"><b></b><b></b></i>';
  if (kind === 'book') return '<i class="nav-glyph g-book" aria-hidden="true"></i>';
  if (kind === 'orb') return '<i class="nav-glyph g-orb" aria-hidden="true"></i>';
  return '<i class="nav-glyph g-orbit" aria-hidden="true"><b></b></i>';
}

function renderPartsStage() {
  return `
    <section class="parts-stage" id="parts-live">
      <div class="parts-head">
        <span class="mini-pill-badge"><span class="dot-blue"></span><span class="i18n-en">Parts from the vault · already in use</span><span class="i18n-zh">收藏里的零件 · 已经在用</span></span>
        <h2><span class="i18n-en">You don't have to go dig through the vault.</span><span class="i18n-zh">不用专门去翻百宝箱。</span></h2>
        <p><span class="i18n-en">Icons, waiting, and status are pieces we saved. They now live in the nav and on the buttons. The original reference sits one tap under each piece.</span><span class="i18n-zh">图标、等待、状态，这些是收藏里的 UI。它们直接长在导航和按钮上。想看原件，从每块下面进去。</span></p>
      </div>
      <div class="parts-grid">
        <article class="part-card">
          <div class="part-live" aria-hidden="true"><i class="morph-mark"></i></div>
          <h3><span class="i18n-en">The mark changes shape</span><span class="i18n-zh">图标会变形</span></h3>
          <p><span class="i18n-en">One mark goes from square to circle. The same motion sits on the Vault link.</span><span class="i18n-zh">同一个标记从方到圆。导航里「实战百宝箱」那一枚也在转。</span></p>
          <a class="part-entry" href="/ecosystem?shelf=design&lane=motion"><span class="i18n-en">Motion originals →</span><span class="i18n-zh">动效原件 →</span></a>
        </article>
        <article class="part-card">
          <div class="part-live">
            <button type="button" class="think-btn" data-think-demo data-idle-zh="让按钮想一下" data-idle-en="Let it think" data-busy-zh="在想" data-busy-en="Thinking" data-done-zh="想完了" data-done-en="Done">
              <span class="think-dots" aria-hidden="true"><b></b><b></b><b></b></span>
              <span class="i18n-zh" data-think-label>让按钮想一下</span>
              <span class="i18n-en" data-think-label>Let it think</span>
            </button>
          </div>
          <h3><span class="i18n-en">Waiting stays put</span><span class="i18n-zh">等待不转圈</span></h3>
          <p><span class="i18n-en">The button does not swap for a spinner. Three dots say it is still thinking. Try it.</span><span class="i18n-zh">按钮留在原地，不换成转圈。三个点表示它还在想。点一下试试。</span></p>
          <a class="part-entry" href="/ecosystem?shelf=design&lane=loader"><span class="i18n-en">Loader originals →</span><span class="i18n-zh">等待动画原件 →</span></a>
        </article>
        <article class="part-card">
          <div class="part-live">
            <div class="agent-pills" data-agent-status>
              <button type="button" class="is-on" data-status="plan"><span class="i18n-en">Plan</span><span class="i18n-zh">计划</span></button>
              <button type="button" data-status="run"><span class="i18n-en">Running</span><span class="i18n-zh">进行中</span></button>
              <button type="button" data-status="ask"><span class="i18n-en">Your call</span><span class="i18n-zh">待确认</span></button>
            </div>
            <p class="agent-line" data-status-line>
              <span class="i18n-en" data-line-en>See which part fits first.</span>
              <span class="i18n-zh" data-line-zh>先看哪一块零件能用。</span>
            </p>
          </div>
          <h3><span class="i18n-en">Status sits on the work</span><span class="i18n-zh">状态贴在工作上</span></h3>
          <p><span class="i18n-en">Three states from agent interfaces. Tap one and the line follows.</span><span class="i18n-zh">Agent 界面里常见的三态。点一下，下面那句跟着换。</span></p>
          <a class="part-entry" href="/ecosystem?shelf=design&lane=ui-lib"><span class="i18n-en">UI originals →</span><span class="i18n-zh">UI 组件原件 →</span></a>
        </article>
        <article class="part-card">
          <div class="part-live" aria-hidden="true"><span class="orb-row"><i></i><i></i><i></i></span></div>
          <h3><span class="i18n-en">Orbs, still waiting</span><span class="i18n-zh">球还在等</span></h3>
          <p><span class="i18n-en">Not a progress bar. Three orbs breathe out of step, so you know it has not landed yet.</span><span class="i18n-zh">不是进度条。三个球错开呼吸，表示这一步还没收住。</span></p>
          <a class="part-entry" href="/ecosystem?shelf=design&lane=loader"><span class="i18n-en">More waiting marks →</span><span class="i18n-zh">再看等待动画 →</span></a>
        </article>
      </div>
    </section>`;
}

function renderPaidDoor() {
  return `
    <aside class="paid-door" id="pro-door">
      <div class="paid-door-live" aria-hidden="true">
        <i class="morph-mark sm"></i>
        <span class="orb-row sm"><i></i><i></i><i></i></span>
      </div>
      <div class="paid-door-copy">
        <span class="mini-pill-badge"><span class="dot-blue"></span><span class="i18n-en">The front stays free</span><span class="i18n-zh">前面这些免费</span></span>
        <h2><span class="i18n-en">Further in, there is a door.</span><span class="i18n-zh">再往里，留了一扇门。</span></h2>
        <p><span class="i18n-en">Deeper writeups, the commercial skills, and whatever we put behind the line later — they all start here. What you are reading on this page stays open.</span><span class="i18n-zh">深度复盘、商业版技能，以及以后继续往里放的内容，都从这扇门进。这一页你正在看的，仍然免费。</span></p>
      </div>
      <div class="paid-door-actions">
        <button type="button" class="solid-pill-btn" data-open-modal="pro-modal"><span class="i18n-en">Enter here</span><span class="i18n-zh">从这扇门进去</span></button>
        <a href="/ecosystem?shelf=design" class="soft-pill-btn"><span class="i18n-en">Originals in the vault</span><span class="i18n-zh">零件原件在收藏里</span></a>
      </div>
    </aside>`;
}

function renderShell({ data, pageTitle, activeNav, bodyHtml, extraDataScript = '', headExtra = '' }) {
  const { site } = data;
  const searchIndexJson = JSON.stringify(buildSearchIndex(data));
  const vaultMapJson = JSON.stringify(buildVaultMap(data));

  return prefixRootPaths(`<!DOCTYPE html>
<html lang="zh-CN" data-theme="light" data-lang="en">
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
  <link rel="stylesheet" href="/styles.css" />
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
          <a href="/" class="${activeNav === 'home' ? 'is-active' : ''}">${navMark('orbit')}<span class="i18n-en">Workbench</span><span class="i18n-zh">工作台</span></a>
          <a href="/ecosystem" class="${activeNav === 'ecosystem' ? 'is-active' : ''}">${navMark('morph')}<span class="i18n-en">Vault</span><span class="i18n-zh">百宝箱</span></a>
          <a href="/#parts-live" class="nav-parts">${navMark('orb')}<span class="i18n-en">Parts</span><span class="i18n-zh">零件</span></a>
          <a href="/products" class="${activeNav === 'products' ? 'is-active' : ''}">${navMark('think')}<span class="i18n-en">Products</span><span class="i18n-zh">产品</span></a>
          <a href="/originals" class="${activeNav === 'originals' ? 'is-active' : ''}">${navMark('book')}<span class="i18n-en">Playbook</span><span class="i18n-zh">原创</span></a>
          <a href="/curated" class="${activeNav === 'curated' ? 'is-active' : ''}">${navMark('pages')}<span class="i18n-en">Curated</span><span class="i18n-zh">好文</span></a>
        </nav>

      <div class="navbar-right">
        <span class="nav-divider" aria-hidden="true"></span>

        <button type="button" class="cmdk-btn" data-open-modal="search-modal" aria-label="Search">
          <span class="i18n-en">Search</span><span class="i18n-zh">搜索</span>
          <kbd>⌘K</kbd>
        </button>
        <button type="button" class="sound-toggle-btn" id="sound-toggle" title="轻触音效开关" aria-label="Toggle click sound"><span id="sound-icon">🔊</span></button>
        <button type="button" class="lang-switch-btn" id="lang-toggle" title="切换中英文"><span class="i18n-en">中</span><span class="i18n-zh">EN</span></button>
        <button type="button" class="theme-icon-btn" id="theme-toggle" aria-label="Toggle Theme">
          <svg class="moon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg class="sun-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
        </button>
        <button type="button" class="soft-pill-btn sm" data-open-modal="add-vault-modal"><span class="i18n-en">＋ Collect</span><span class="i18n-zh">＋ 收录</span></button>
        <button type="button" class="solid-pill-btn pro-entry" data-open-modal="pro-modal"><i class="pro-orb" aria-hidden="true"></i><span class="i18n-en">Pro door</span><span class="i18n-zh">Pro 入口</span></button>
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
          <h4>Vault</h4>
          <a href="/ecosystem?shelf=design">设计</a>
          <a href="/ecosystem?shelf=design&lane=ui-lib">UI 组件</a>
          <a href="/ecosystem?shelf=design&lane=motion">动效</a>
          <a href="/ecosystem?shelf=design&lane=loader">等待动画</a>
          <a href="/ecosystem?shelf=design&lane=personal">个人网站</a>
          <a href="/ecosystem?shelf=design&lane=design-site">整站参考</a>
          <a href="/ecosystem?shelf=design&lane=style">视觉风格</a>
          <a href="/ecosystem?shelf=learning">学习收藏</a>
          <a href="/ecosystem?shelf=toolkit">技能工具箱</a>
          <a href="/ecosystem#templates">填空模板</a>
        </div>
        <div>
          <h4>Build</h4>
          <a href="/products">产品孵化</a>
          <a href="/originals">实战原创</a>
          <a href="/curated">精选好文</a>
        </div>
        <div>
          <h4>For AI</h4>
          <a href="/llms.txt" target="_blank">/llms.txt</a>
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
              <optgroup label="设计">
                <option value="ui-lib">UI 组件</option>
                <option value="motion">动效</option>
                <option value="loader">等待动画</option>
                <option value="personal">个人网站</option>
                <option value="design-site">整站参考</option>
                <option value="style">视觉风格</option>
              </optgroup>
              <optgroup label="学习收藏">
                <option value="prompt-hub">Prompt / Bot 市场</option>
                <option value="guide">学习指南</option>
              </optgroup>
              <optgroup label="技能工具箱">
                <option value="skill">Skill</option>
                <option value="workflow">工作流</option>
                <option value="ai-tool">AI 工具</option>
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

  <script>window.__BASE_PATH__ = ${JSON.stringify(siteBase())};</script>
  <script>window.__SEARCH_INDEX__ = ${searchIndexJson};</script>
  <script>window.__VAULT_MAP__ = ${vaultMapJson};</script>
  <script>window.__TEMPLATES_MAP__ = ${JSON.stringify(Object.fromEntries((data.ecosystem.templates || []).map((t) => [t.id, t])))};</script>
  ${extraDataScript}
  <script src="/app.js"></script>
</body>
</html>`);
}

/* ============================================================================
   HOME
   ============================================================================ */
function renderHomeAtelier(products) {
  const rank = { live: 0, beta: 1, concept: 2 };
  const list = [...products].filter((p) => !p.hideHome).sort((a, b) => (rank[a.stage] ?? 9) - (rank[b.stage] ?? 9));
  const tabs = list
    .map((p, i) => {
      const st = STAGE_META[p.stage] || STAGE_META.concept;
      const short = p.name.split('·')[0].trim();
      return `<button type="button" class="atelier-tab${i === 0 ? ' is-on' : ''}" data-product-tab="${esc(p.id)}" aria-selected="${i === 0 ? 'true' : 'false'}">
        <span class="atelier-tab-ico">${esc(p.icon || '◎')}</span>
        <span><strong>${esc(short)}</strong><small>${esc(st.zh)} · ${esc(p.formBadge)}</small></span>
      </button>`;
    })
    .join('');
  const panels = list
    .map((p, i) => {
      const st = STAGE_META[p.stage] || STAGE_META.concept;
      return `<article class="atelier-panel${i === 0 ? ' is-on' : ''}" data-product-panel="${esc(p.id)}" data-stage="${esc(p.stage)}">
        <div class="atelier-kicker"><span class="stage-pill ${st.cls}">${st.zh}</span><span>${esc(p.formBadge)}</span></div>
        <h3>${esc(p.name)}</h3>
        <p class="atelier-tag">${esc(p.tagline)}</p>
        <p>${esc(p.summary)}</p>
        <div class="atelier-metric">${esc(p.metrics)}</div>
        <div class="atelier-actions">
          <a class="solid-pill-btn" href="/products#${esc(p.id)}">看方案</a>
          <a class="soft-pill-btn" href="/read/${esc(p.relatedArticle)}">${esc(p.ctaLabel)}</a>
        </div>
        <span class="atelier-mark" aria-hidden="true">${esc(p.icon || '◎')}</span>
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
        <span class="mini-pill-badge"><span class="dot-blue"></span> Vault · 收藏房间</span>
        <h2>进来先挑一间。</h2>
        <p>组件、动效、等待动画、个人网站、整站和视觉风格，各成一间。点进去才是完整的一栏。</p>
      </div>
      <div class="room-grid">
        ${lanes
          .map((lane) => {
            const lead = lane.items.find((item) => item.preview) || lane.items[0];
            const names = lane.items
              .slice(0, 3)
              .map((item) => item.name.split('·')[0].trim())
              .join('  ·  ');
            return `<a class="room-card" href="/ecosystem?shelf=design&lane=${esc(lane.id)}">
              ${lead.preview ? `<img src="${esc(lead.preview)}" alt="" />` : ''}
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
        <a id="shelf-learning" href="/ecosystem?shelf=learning">学习收藏 →</a>
        <a id="shelf-toolkit" href="/ecosystem?shelf=toolkit">技能工具箱 →</a>
        <a href="/ecosystem">整座百宝箱 →</a>
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
              <span class="blue-app-badge">⌘</span>
              <div><strong>Orbit Dispatch · 派工台</strong><small>总师规划、视觉工坊、并发执行</small></div>
              <span class="pill-blue">6 Engines</span>
            </a>
            <a href="#shelf-design" class="stage-mini-card">
              <span class="blue-app-badge">✦</span>
              <div><strong>Design Vault · 设计</strong><small>组件、动效、个人站、整站</small></div>
              <span class="pill-mint">${designItems.length} 条</span>
            </a>
            <a href="#products-sec" class="stage-mini-card">
              <span class="blue-app-badge">◎</span>
              <div><strong>Product Lab · 产品孵化</strong><small>已上线、内测中与新构想</small></div>
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
                <a id="wb-article-link" href="/read/${esc(firstItem.relatedSlug)}">${esc(firstItem.relatedTitle)} →</a>
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
            <button type="button" class="ai-copy-btn" data-ai-copy="v-skimbly">✦ 试试复制给 AI</button>
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
      <div class="sec-head-centered reveal-up">
        <span class="mini-pill-badge"><span class="dot-orange"></span> Playbook &amp; Curated · 实战原创与精选好文</span>
        <h2>High-cognition playbooks &amp; annotated reads.</h2>
        <p>自己验证透的方法论，加上读过的顶级指南和我们的实战笔记。</p>
      </div>
      <div class="cards-grid-2">${originals.slice(0, 2).map(renderLayeredArticleCard).join('')}</div>
      <div class="sec-bottom-cta"><a href="/originals" class="outlined-pill-btn">全部实战原创 →</a></div>
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
   VAULT PAGE
   ============================================================================ */
export function renderEcosystemPage(data) {
  const { ecosystem } = data;
  const vaultItems = ecosystem.vaultItems || [];
  const countShelf = (k) => vaultItems.filter((i) => (i.shelf || 'design') === k).length;

  const groupsHtml = Object.keys(SHELVES)
    .map((key) => {
      const items = vaultItems.filter((i) => (i.shelf || 'design') === key);
      if (!items.length) return '';
      return `
        <section class="vault-group" data-shelf-group="${key}" id="shelf-${key}">
          ${renderShelfHead(key, items.length)}
          ${key === 'design' ? renderDesignLanes(items) : `<div class="cards-grid-2">${items.map(renderVaultCard).join('')}</div>`}
        </section>
      `;
    })
    .join('');

  const bodyHtml = `
    <div class="inner-wrap">
      <section class="inner-page-hero">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <span>Vault</span></div>
        <h1>Orbit Vault · 实战百宝箱</h1>
        <p>上面三格还是<strong>设计</strong>、<strong>学习收藏</strong>、<strong>技能工具箱</strong>。设计下面再有一栏：UI 组件、动效、等待动画、个人网站、整站参考、视觉风格。每条网站的标签都不一样。</p>
        <div class="toolbar-row">
          <div class="pill-tabs" role="group" aria-label="分区筛选">
            <button type="button" class="pill-tab is-active" data-shelf-filter="all">全部 (${vaultItems.length})</button>
            <button type="button" class="pill-tab" data-shelf-filter="design">✦ 设计 (${countShelf('design')})</button>
            <button type="button" class="pill-tab" data-shelf-filter="learning">❖ 学习收藏 (${countShelf('learning')})</button>
            <button type="button" class="pill-tab" data-shelf-filter="toolkit">⌘ 技能工具箱 (${countShelf('toolkit')})</button>
          </div>
          <input type="search" id="vault-search" class="clean-search" placeholder="搜名称、风格、可借鉴点..." />
        </div>
      </section>

      ${groupsHtml}

      <section id="templates" class="arsenal-block">
        <div class="block-title-row">
          <h2>填空模板 · Fill &amp; Copy to AI</h2>
          <span>不用记格式：填几个空，复制出去就是一段完整的纯文本指令</span>
        </div>
        <div class="stacked-rows">
          ${(ecosystem.templates || [])
            .map(
              (tpl, idx) => `
              <div class="accordion-row">
                <div class="acc-left">
                  <span class="acc-num">0${idx + 1}</span>
                  <div>
                    <h3>${esc(tpl.title)} <span class="pill-gray">${esc(tpl.tag)}</span></h3>
                    <p>${esc(tpl.desc)}</p>
                  </div>
                </div>
                <div class="acc-actions">
                  <button type="button" class="solid-pill-btn sm-pill" data-open-tpl="${esc(tpl.id)}">填写并复制 →</button>
                </div>
              </div>
            `
            )
            .join('')}
        </div>
      </section>
    </div>
  `;

  return renderShell({
    data,
    pageTitle: 'Orbit Vault',
    activeNav: 'ecosystem',
    bodyHtml,
    headExtra: previewPreloadLinks(data),
  });
}

/* ============================================================================
   PRODUCTS PAGE
   ============================================================================ */
function renderLabBench() {
  return `
    <section class="lab-bench" id="lab-bench">
      <div class="lab-bench-head">
        <span class="mini-pill-badge"><span class="dot-blue"></span> On the bench · 台上的小工具</span>
        <h2>现在就能用。</h2>
        <p>这些是产品的小样，都在浏览器里完成。换一件工具，右边的台面跟着换。</p>
      </div>
      <div class="lab-stage">
        <div class="lab-rail" role="tablist" aria-label="小工具">
          <button type="button" class="lab-tab is-on" data-lab-tool="slip" role="tab" aria-selected="true"><b>⇆</b><span><strong>交接单</strong><small>五格，交给下一窗</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="swatch" role="tab" aria-selected="false"><b>◐</b><span><strong>四色玻璃</strong><small>从一张图里取四色</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="folio" role="tab" aria-selected="false"><b>册</b><span><strong>长图目录</strong><small>正文切成可跳的节</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="plastic" role="tab" aria-selected="false"><b>◇</b><span><strong>去塑料</strong><small>拣出空转的词</small></span></button>
          <button type="button" class="lab-tab" data-lab-tool="night" role="tab" aria-selected="false"><b>✎</b><span><strong>夜间纸条</strong><small>三行，带到明天</small></span></button>
        </div>
        <div class="lab-panes">
          <article class="lab-pane is-on" id="tool-slip" data-lab-pane="slip">
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
  const groups = [
    ['live', '已上线 · Shipped', '已经在团队里天天跑的作品。'],
    ['beta', '内测中 · In Beta', '核心功能已跑通，正在打磨体验。'],
    ['concept', '构想池 · Idea Lab', '值得做的新点子。点「＋ 想要」投票，票高的优先开发。'],
  ];

  const bodyHtml = `
    <div class="inner-wrap">
      <section class="inner-page-hero">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <span>Product Lab</span></div>
        <h1>Product Lab · 产品孵化</h1>
        <p>主线仍是让收藏的品味被 AI 用起来。台上先放几件现在就能玩的小样，下面是已经在跑的，和还在排队的构想。</p>
        <div class="roadmap-line">
          <span class="rm-step is-done">收藏 · Taste Clipper</span>
          <span class="rm-arrow">→</span>
          <span class="rm-step is-done">整理 · 百宝箱 + 复制给 AI</span>
          <span class="rm-arrow">→</span>
          <span class="rm-step">调用 · Prompt Pocket</span>
          <span class="rm-arrow">→</span>
          <span class="rm-step">自治 · Orbit MCP</span>
        </div>
      </section>
      ${renderLabBench()}
      ${groups
        .map(([stage, title, desc]) => {
          const list = products.filter((p) => p.stage === stage);
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

  return renderShell({ data, pageTitle: 'Product Lab', activeNav: 'products', bodyHtml });
}

/* ============================================================================
   CATALOG & READER
   ============================================================================ */
const PRESSES = [
  { id: 'openai', name: 'OpenAI', en: 'OpenAI · Codex', line: 'Codex 的环境工程、核心循环，以及图像提示怎么写。' },
  { id: 'anthropic', name: 'Anthropic', en: 'Anthropic · Claude', line: '工作流、上下文预算、工具设计，和跨班次才能做完的长任务。' },
  { id: 'google', name: 'Google', en: 'Google · Gemini', line: '官方 Agents 白皮书、百万级长上下文实战，以及只读你文件的 Notebook。' },
  { id: 'xai', name: 'Grok · xAI', en: 'xAI · Grok', line: '推理预算调度、实时 X 情报流、服务端工具编排，以及按岗位组建 AI 团队。' },
  { id: 'youtube', name: 'YouTube', en: 'YouTube Talks', line: 'Karpathy 的两集公开课，以及 Claude Code 核心团队工程分享。' },
  { id: 'creators', name: 'X & 创作者', en: 'X & Builders', line: 'Dan Koe 一人创意团队指南，以及 Addy Osmani、Simon Willison 的研发铁律。' },
  { id: 'cognition', name: '认知', en: 'Cognition', line: '一条长图文，原文照录，按作者自己的层级分目录。' },
  { id: 'product', name: '产品', en: 'Product practice', line: '奔跑的大毛腿：把 AI 放进产品全流程，以及技术要懂到哪一层。' },
  { id: 'other', name: '其他来源', en: 'Engineering Studios', line: 'Vercel 工具减法实测，以及 Linear / 37signals 的小团队高杠杆方法论。' },
];
const PRESS_BY_ID = Object.fromEntries(PRESSES.map((p) => [p.id, p]));

function bookFaceTitle(article) {
  if (article.coverTitle) return article.coverTitle;
  const cut = String(article.title || '').split(/[：:]/)[0].trim();
  return cut || article.title;
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
  const imprint = article.publisher === 'other' || article.publisher === 'creators' ? article.originalOrg || press.name : press.name;
  const insideKicker = isSource ? '原文照录' : article.access === 'pro' ? '深度 · 实战笔记' : '实战笔记';
  const faces = ['poster', 'band', 'index', 'ticket', 'low'];
  const face = faces.includes(article.coverFace) ? article.coverFace : faces[index % faces.length];
  const faceChars = [...bookFaceTitle(article).replace(/\|/g, '')].filter((ch) => ch.trim() && !'一—-'.includes(ch));
  const glyph = faceChars[0] || '';
  return `
    <a class="book press-${esc(press.id)} face-${esc(face)}" href="/read/${esc(article.slug)}" data-publisher="${esc(press.id)}" data-search="${esc(
      [article.title, article.summary, article.category, article.originalAuthor, article.originalOrg, note].filter(Boolean).join(' ')
    )}" style="--i:${index}">
      <span class="book-3d">
        <span class="book-spine" aria-hidden="true"><b>${num}</b></span>
        <span class="book-board">
          <span class="book-face" data-glyph="${esc(glyph)}">
            <span class="book-press-row">${article.sourceUrl ? favImg({ url: article.sourceUrl }, 'book-fav') : ''}<span class="book-press">${esc(imprint)}</span></span>
            <span class="book-title">${bookTitleHtml(article)}</span>
            <span class="book-author">${esc(article.originalAuthor || '')}</span>
            <span class="book-note">
              <span class="book-inside-kicker">${insideKicker}</span>
              <span class="book-inside-text">${esc(note)}</span>
              <span class="book-inside-foot">
                <span class="book-inside-go">打开阅读 →</span>
                ${isSource ? '' : `<span role="button" tabindex="0" class="book-copy-ai" data-ai-copy="curated-${esc(article.slug)}" title="复制这本书的方法论提示词给 AI">✦ 复制给 AI</span>`}
              </span>
            </span>
          </span>
        </span>
      </span>
    </a>
  `;
}

function renderLibraryTeaser(data) {
  const teaserPresses = ['openai', 'anthropic', 'google', 'xai', 'creators'];
  const featured = teaserPresses
    .map((id) => (data.curated || []).find((a) => a.publisher === id))
    .filter(Boolean);
  if (!featured.length) return '';
  return `
    <div class="library-teaser reveal-up">
      <div class="library-teaser-copy">
        <p class="press-kicker">Curated shelf · ${(data.curated || []).length} Books</p>
        <h3>精选好文按出处上架</h3>
        <p>OpenAI、Anthropic、Google、Grok (xAI)、YouTube 与 X 创作者各自一排书。封面可以掀开看实战笔记，也能一键复制给 AI。</p>
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
        <p>按出处上架，不按免费或深度分。把一本书的封面掀开，先看到我们的笔记，再进入全文。</p>
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

export function renderCatalogPage(data, mode = 'originals') {
  if (mode === 'curated') return renderCuratedLibrary(data);
  const { originals, curated } = data;
  const isOrig = mode === 'originals';
  const items = isOrig ? originals : curated;
  const heading = isOrig ? 'Playbook · 实战原创' : 'Curated · 精选好文';
  const desc = isOrig
    ? '我们自己研究出来的 AI 实战经验、一页纸高认知框架与真实项目复盘。'
    : '别人写得极好、被我们筛进来细读的文章，每一篇都附有我们的实战笔记。';

  const bodyHtml = `
    <div class="inner-wrap">
      <section class="inner-page-hero">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <span>${esc(heading)}</span></div>
        <h1>${esc(heading)}</h1>
        <p>${esc(desc)}</p>
        <div class="toolbar-row">
          <div class="pill-tabs" role="group">
            <button type="button" class="pill-tab is-active" data-filter="all">All (${items.length})</button>
            <button type="button" class="pill-tab" data-filter="free">Free · 免费</button>
            <button type="button" class="pill-tab" data-filter="pro">Pro · 深度</button>
          </div>
          <input type="search" id="catalog-search" class="clean-search" placeholder="搜索标题或关键词..." />
        </div>
      </section>
      <section class="cards-grid-2">${items.map(renderLayeredArticleCard).join('')}</section>
    </div>
  `;

  return renderShell({ data, pageTitle: heading, activeNav: isOrig ? 'originals' : 'curated', bodyHtml });
}

function renderSourceReaderPage(data, article) {
  const { bySlug } = data;
  const backHref = '/curated';
  const tocItemsHtml = article.toc
    .map(
      (item) =>
        `<li><a href="#${esc(item.id)}"><span class="source-toc-num">${esc(item.num)}</span><span>${esc(item.title)}</span></a></li>`
    )
    .join('');
  const relatedArticles = article.relatedSlugs.map((slug) => bySlug.get(slug)).filter(Boolean);
  const relatedCards = relatedArticles.length
    ? `<div class="shelf-books is-related">${relatedArticles.map((item, index) => renderBook(item, index)).join('')}</div>`
    : '';

  const bodyHtml = `
    <div class="inner-wrap source-wrap">
      <div class="reader-nav-bar">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <a href="${backHref}">Curated · 精选好文</a> <span>›</span> <span>认知</span></div>
      </div>
      <div class="source-folio">
        <aside class="source-rail" aria-label="本篇目录">
          <p class="source-rail-kicker">目录</p>
          <ol class="source-toc">${tocItemsHtml}</ol>
          <div class="source-credit">
            <span class="source-credit-kicker">原文</span>
            <strong>${esc(article.originalAuthor || '泡泡oc')}</strong>
            <span>${esc(article.originalOrg || '')}</span>
            ${article.sourceUrl ? `<a href="${esc(article.sourceUrl)}" target="_blank" rel="noopener">原帖 ↗</a>` : ''}
            <p>长文在四张图里，这里按图照录。二元这一层的开头几句没有拍进截图，正文从看得见的那一句接上。</p>
          </div>
        </aside>
        <article class="source-sheet" id="reader-sheet">
          <header class="source-hero">
            <p class="source-kicker">认知 · 原文</p>
            <h1>${esc(article.title)}</h1>
            ${article.subtitle ? `<p class="source-lead">${esc(article.subtitle)}</p>` : ''}
            <p class="source-byline">
              <span>${esc(article.originalAuthor || '')}</span>
              <span>${esc(article.date)}</span>
              <span>${esc(article.readingTime)}</span>
            </p>
          </header>
          <div class="source-prose chapter-prose">
            ${article.previewHtml}
          </div>
          <footer class="source-end">
            ${article.sourceUrl ? `<a class="source-end-link" href="${esc(article.sourceUrl)}" target="_blank" rel="noopener">在 X 上看泡泡oc 的原帖 ↗</a>` : ''}
            <p>这一篇单独放在「认知」架上。正文是原图里的句子，目录只用来跳转。</p>
          </footer>
        </article>
      </div>
      ${relatedArticles.length ? `<section class="related-wrap"><h3 class="related-heading">顺着往下看</h3>${relatedCards}</section>` : ''}
    </div>
  `;

  return renderShell({ data, pageTitle: article.title, activeNav: 'curated', bodyHtml });
}

export function renderReaderPage(data, article) {
  if (article.layout === 'source') return renderSourceReaderPage(data, article);
  const { site, bySlug } = data;
  const backHref = article.kind === 'curated' ? '/curated' : '/originals';
  const backLabel = article.kind === 'curated' ? 'Curated · 精选好文' : 'Playbook · 实战原创';

  const tocItemsHtml = article.toc
    .map((item) => `<li><a href="#${esc(item.id)}"><span class="toc-num">${esc(item.num)}</span> ${esc(item.title)}</a></li>`)
    .join('');

  const studioNoteHtml =
    article.kind === 'curated' && article.studioNoteBody
      ? `
      <aside class="studio-note-shell" aria-label="Studio Notes">
        <div class="studio-note-inner">
          <div class="sn-head">
            <span class="blue-app-badge sm">NOTE</span>
            <strong>${esc(article.studioNoteTitle || '我们的读后实战笔记')}</strong>
          </div>
          <p>${esc(article.studioNoteBody)}</p>
        </div>
      </aside>
    `
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
            <p class="pro-reassure">${esc(site.proPlan.countdownNote)}<br/>第一次来？<a href="/read/compounding-byproducts">先免费读《为什么我们要建这个 AI 总站》 →</a></p>
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

  const bodyHtml = `
    <div class="inner-wrap">
      <div class="reader-nav-bar">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <a href="${backHref}">${backLabel}</a></div>
        <div class="reader-controls">
          ${article.access === 'pro' ? `<button type="button" class="preview-switch-pill" id="founder-pro-toggle">预览状态：<strong id="pro-mode-state">访客试读锁</strong></button>` : ''}
          <div class="seg-group" role="group">
            <button type="button" class="seg-btn is-active" data-font="sans">Sans</button>
            <button type="button" class="seg-btn" data-font="serif">Serif</button>
          </div>
          <div class="seg-group" role="group">
            <button type="button" class="seg-btn" data-size="sm">A-</button>
            <button type="button" class="seg-btn is-active" data-size="md">Default</button>
            <button type="button" class="seg-btn" data-size="lg">A+</button>
          </div>
        </div>
      </div>

      <article class="reader-shell" id="reader-sheet" data-font="sans" data-size="md">
        <div class="reader-inner">
          <header class="reader-hero">
            <div class="reader-meta-pills">
              <span class="pill-gray">${esc(article.kind === 'curated' ? (PRESS_BY_ID[article.publisher] || PRESS_BY_ID.other).name : article.chapter || 'Playbook')}</span>
              ${article.kind === 'curated' ? (article.access === 'pro' ? '<span class="pill-pro">深度</span>' : '') : article.access === 'pro' ? '<span class="pill-pro">Pro</span>' : '<span class="pill-mint">Free</span>'}
              <span class="muted-text">${esc(article.date)} · ${esc(article.readingTime)}</span>
            </div>
            <h1>${esc(article.title)}</h1>
            <p class="reader-lead">${esc(article.subtitle)}</p>
            <div class="reader-subbar">
              ${
                article.kind === 'curated'
                  ? `<span class="reader-orig-meta">${article.sourceUrl ? favImg({ url: article.sourceUrl }, 'reader-fav') : ''}<span>Original: <strong>${esc(article.originalAuthor || article.originalOrg)}</strong> · ${esc(article.originalOrg)}</span></span>${article.sourceUrl ? `<a href="${esc(article.sourceUrl)}" target="_blank" rel="noopener" class="ext-link">${article.publisher === 'youtube' ? '原视频' : '原文出处'} ↗</a>` : ''}<button type="button" class="icon-ghost-btn" data-ai-open="curated-${esc(article.slug)}" title="查看给 AI 的提示词">Prompt</button><button type="button" class="ai-copy-btn" data-ai-copy="curated-${esc(article.slug)}">✦ 复制给 AI</button>`
                  : `<span>Paired: <code>${esc(article.pairedSkill || 'orbit-core')}</code></span>`
              }
              <button type="button" class="soft-pill-btn sm" id="audio-companion-btn">🎧 Listen · ${esc(article.audioDuration)}</button>
            </div>
            <div class="audio-player-bar" id="audio-player-bar" hidden>
              <span>🎧 Audio companion preview playing...</span>
              <button type="button" class="text-action-btn" id="audio-stop-btn">Hide</button>
            </div>
          </header>

          ${
            article.toc.length > 0
              ? `<details class="clean-toc"><summary><span>本篇目录 (${article.toc.length})</span><span class="toc-chevron">Expand ›</span></summary><ol class="toc-list">${tocItemsHtml}</ol></details>`
              : ''
          }

          ${studioNoteHtml}

          <div class="chapter-prose">
            ${article.previewHtml}
            ${proPaywallHtml}
          </div>

          <hr class="hairline-hr" />

          <div class="utility-grid">
            <section class="utility-card">
              <h3>有新沉淀时通知我</h3>
              <p>输入邮箱，免费订阅新实战经验、好文笔记与百宝箱更新（零广告，随时退订）。</p>
              <form id="newsletter-form" class="inline-subscribe-form">
                <input type="email" name="email" required placeholder="you@company.com" />
                <button type="submit" class="solid-pill-btn">Subscribe</button>
              </form>
            </section>
            <section class="utility-card">
              <div class="fb-head">
                <div><h3>有补充或不同看法？</h3><p>有更好的实战解法，直接留言给团队。</p></div>
                <button type="button" class="outlined-pill-btn sm" id="toggle-feedback-btn">Send Note</button>
              </div>
              <form id="chapter-feedback-form" class="clean-form" data-slug="${esc(article.slug)}" hidden>
                <textarea name="message" rows="2" required placeholder="你的想法或补充..."></textarea>
                <div class="fb-submit-row">
                  <input type="text" name="contact" placeholder="称呼或邮箱（可选）" />
                  <button type="submit" class="solid-pill-btn">Submit</button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </article>

      ${relatedArticles.length ? `<section class="related-wrap"><h3 class="related-heading">顺着往下看</h3>${relatedCards}</section>` : ''}
    </div>
  `;

  return renderShell({ data, pageTitle: article.title, activeNav: article.kind === 'curated' ? 'curated' : 'originals', bodyHtml });
}
