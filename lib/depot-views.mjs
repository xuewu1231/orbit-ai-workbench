import { renderActionSvg, renderKindSvg } from './icons.mjs';

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================================
   1. ROLE-SPECIFIC AI CONTEXT ENDPOINTS (/context/design.txt, creator.txt, skills.txt)
   ============================================================================ */
export function renderRoleContextTxt(data, role) {
  const { site, ecosystem, skills = [], depot = {} } = data;
  const lines = [];

  if (role === 'design') {
    lines.push(`${site.brandName} · Design & UI Taste Context (/context/design.txt)`);
    lines.push('用途：写网页、组件、控制台或落地页前喂给 Claude / Gemini / Cursor，直接对齐我们的审美标准与参考拆解。');
    lines.push('');
    const uiSkill = skills.find((s) => s.slug === 'clean-ui-guardrail');
    if (uiSkill) {
      lines.push('【一、去 AI 塑料感六条硬护栏】');
      lines.push(uiSkill.plainPrompt);
      lines.push('');
    }
    lines.push('【二、精选设计标杆拆解与色板】');
    const designItems = (ecosystem.vaultItems || []).filter((it) => (it.shelf || 'design') === 'design');
    for (const it of designItems) {
      lines.push(`- ${it.name}${it.url ? ` (${it.url})` : ''} [${it.kindLabel}]`);
      lines.push(`  好在哪：${it.whyGood}`);
      if (it.swatches && it.swatches.length) lines.push(`  代表配色：${it.swatches.join(' / ')}`);
      if (it.borrow && it.borrow.length) lines.push(`  重点借鉴：${it.borrow.join('；')}`);
    }
    lines.push('');
    const uiDiff = (depot.teardowns || []).find((d) => d.id === 'diff-ui');
    if (uiDiff) {
      lines.push('【三、前后反差自检】');
      lines.push(`反面禁区：${uiDiff.beforeText}`);
      lines.push(`正面目标：${uiDiff.afterText}`);
    }
    return lines.join('\n') + '\n';
  }

  if (role === 'creator') {
    const creator = depot.creator || {};
    const dna = creator.voiceDna || {};
    lines.push(`${site.brandName} · Creator Workflow & Voice DNA (/context/creator.txt)`);
    lines.push('用途：辅助选题判断、生成 Excalidraw 手绘白板分镜、改写自然口播稿与小红书文案话题。');
    lines.push('');
    lines.push('【一、自媒体三步视频标准工作流】');
    lines.push('Step 0 选题三环过滤：同时评估「热门趋势度 × 我的真实兴趣 × AI 硬核增量」，拒绝无体感的纯参数搬运。');
    lines.push('Step 1 Excalidraw 白板画布：先把核心逻辑压成 1 个中心命题 + 3 个手绘框（痛点红框 → 机制蓝框 → 实操绿框），每框不超过 18 字。');
    lines.push('Step 2 自然口播逐字稿：顺着白板箭头扩成 8–16 字口语短句，标注 [切白板] [画笔圈重] [停顿半秒]，绝不背书面课文。');
    lines.push('Step 3 小红书发布包：3 个反差切角标题 + 纯文本短段落正文 + 5–8 个大流量与高精准组合 #话题。');
    lines.push('');
    if (dna.systemPrompt) {
      lines.push('【二、个人文风 DNA 与禁词红线】');
      lines.push(dna.systemPrompt);
      lines.push('');
    }
    lines.push('【三、前 3 秒黄金钩子公式库】');
    for (const hk of creator.hookVault || []) {
      lines.push(`- [${hk.type}] 公式：${hk.formula}`);
      lines.push(`  样张：${hk.example}`);
    }
    lines.push('');
    for (const sk of skills.filter(
      (s) =>
        s.slug === 'excalidraw-storyboard' ||
        s.slug === 'xiaohongshu-spoken-pack' ||
        s.slug === 'code-video-director' ||
        s.slug === 'motion-harness-director'
    )) {
      lines.push(`【Skill · ${sk.name}】`);
      lines.push(sk.plainPrompt);
      lines.push('');
    }
    return lines.join('\n') + '\n';
  }

  // Default: 'skills'
  lines.push(`${site.brandName} · Private AI Skills, Standards & Tool Radar (/context/skills.txt)`);
  lines.push('用途：给 Agent 挂载可执行 Skill 指令胶囊、MCP 接入规范与工具避坑红黑榜。');
  lines.push('');
  lines.push('【一、可执行 Skill 胶囊库】');
  for (const sk of skills) {
    lines.push(`=== SKILL: ${sk.slug} (${sk.name} v${sk.version}) ===`);
    lines.push(sk.plainPrompt);
    lines.push('');
  }
  lines.push('【二、协作范式与工程标准】');
  for (const std of depot.standards || []) {
    lines.push(`- ${std.title} [${std.kind}]：${std.summary}`);
    lines.push(std.snippet);
    lines.push('');
  }
  lines.push('【三、装备红黑榜与避坑账本（请勿推荐已弃坑方案）】');
  for (const r of depot.radar || []) {
    lines.push(`- [${r.ringLabel}] ${r.name}（${r.category}）：${r.verdict} ${r.pitfall}`);
  }
  return lines.join('\n') + '\n';
}

/* ============================================================================
   2. HOMEPAGE: THREE-PILLAR AMMUNITION DEPOT OVERVIEW + LIVE PULSE
   ============================================================================ */
export function renderHomeDepotOverview(data) {
  const { skills = [], depot = {}, originals = [] } = data;
  const codingDocs = originals.filter((d) => (d.portal || 'ai-coding') === 'ai-coding');
  const videoDocs = originals.filter((d) => d.portal === 'code-video');
  const hooks = depot.creator?.hookVault || [];

  const pulseItems = [
    { tag: '手记', text: '用代码做视频：从底层原理、5 套配色皮肤到 12 种常用动画字典与实操步骤', href: '/originals/code-video' },
    { tag: '手记', text: '用 AI 写代码：界面审美去塑料规范 + 需求边界与提示词参数化', href: '/originals/ai-coding' },
    skills[0] ? { tag: '真 Skill 胶囊', text: `${skills[0].filename} · ${skills[0].name}`, href: '/kit' } : null,
  ].filter(Boolean);

  return `
    <section class="depot-home-sec wide-sec" id="depot-pillars">
      <div class="depot-pulse-bar reveal-up" aria-label="工作台核心入口脉冲">
        <span class="dp-badge"><i class="live-pulse-dot"></i> 手记 · LIVE</span>
        <div class="dp-items">
          ${pulseItems
            .map(
              (p) =>
                `<a href="${esc(p.href)}" class="dp-chip"><b>${esc(p.tag)}</b><span>${esc(p.text)}</span><i aria-hidden="true">→</i></a>`
            )
            .join('')}
        </div>
      </div>

      <div class="atelier-head reveal-up">
        <span class="mini-pill-badge"><span class="dot-blue"></span> Core System · 三大常驻后备力量</span>
        <h2>不仅给人逛，更是随时推弹上膛的后备力量。</h2>
        <p>把「写给自己的手记、给 AI 挂载的工具、从选题到发出去的创作」各自收拢得干干净净，随用随取。</p>
      </div>

      <div class="pillar-bento-grid">
        <!-- Pillar 1: Future Self -->
        <article class="pillar-card spotlight-card reveal-up">
          <div class="pc-top">
            <span class="pc-num">PILLAR 01 · AMMUNITION DEPOT</span>
            <span class="pill-mint">两大独立专栏</span>
          </div>
          <h3>手记</h3>
          <p class="pc-desc">把「用代码做视频」与「用 AI 写代码」拆成两个边界清晰的长期专栏，每个专栏底下都严格按「可执行规范」与「体系指南」归档。</p>
          <div class="pc-preview-stack">
            <div class="pcp-row">
              <span class="verdict-dot is-adopt"></span>
              <strong>专栏 01 · 用代码做视频</strong>
              <small>三层架构 · ${videoDocs.length} 篇独立图文与实时动效</small>
            </div>
            <div class="pcp-row">
              <span class="verdict-dot is-blue"></span>
              <strong>专栏 02 · 用 AI 写代码</strong>
              <small>${codingDocs.length} 篇（界面审美 + 协作边界 + 提示词）</small>
            </div>
          </div>
          <div class="pc-foot">
            <a href="/originals/code-video" class="solid-pill-btn sm">进入「用代码做视频」 →</a>
            <a href="/originals" class="soft-pill-btn sm">打开手记</a>
          </div>
        </article>

        <!-- Pillar 2: Private AI Arsenal -->
        <article class="pillar-card spotlight-card is-accent-blue reveal-up">
          <div class="pc-top">
            <span class="pc-num">PILLAR 02 · PRIVATE AI ARSENAL</span>
            <span class="pill-blue">${skills.length} 枚真胶囊</span>
          </div>
          <h3>给自己的 AI 私人库</h3>
          <p class="pc-desc">把审美标准、协作范式、MCP 配置与可下载的 <code>SKILL.md</code> 封装成 AI 秒懂的纯文本武器。</p>
          <div class="pc-preview-code">
            <div class="pcc-line"><code>/context/design.txt</code> <span>UI 审美与四色铁律</span></div>
            <div class="pcc-line"><code>/context/creator.txt</code> <span>自媒体流与文风 DNA</span></div>
            <div class="pcc-line"><code>/context/skills.txt</code> <span>Skill 胶囊 + MCP 标准</span></div>
          </div>
          <div class="pc-foot">
            <a href="/kit" class="solid-pill-btn sm">打开典藏 · 工具 →</a>
            <button type="button" class="ai-copy-btn" data-copy-context="design">${renderActionSvg('sparkCheck')}<span class="btn-label">复制设计规范给 AI</span></button>
          </div>
        </article>

        <!-- Pillar 3: Self-Media System -->
        <article class="pillar-card spotlight-card is-accent-ink reveal-up">
          <div class="pc-top">
            <span class="pc-num">PILLAR 03 · CREATOR PIPELINE</span>
            <span class="pill-mint">全链路可交互</span>
          </div>
          <h3>创作</h3>
          <p class="pc-desc">专治选题纠结，把「三环定选题 → Excalidraw 白板 → 口播提词器 → 小红书文案与话题」打通成一条流水线。</p>
          <div class="pc-flow-steps">
            <div class="pcf-step"><b>01</b><span>Excalidraw 白板</span><small>直出 .excalidraw 文件</small></div>
            <div class="pcf-step"><b>02</b><span>口播稿 &amp; 提词器</span><small>网页滚动提词开录</small></div>
            <div class="pcf-step"><b>03</b><span>小红书文案 &amp; #话题</span><small>点击挂话题 + 3:4 首图</small></div>
          </div>
          <div class="pc-foot">
            <a href="/creator" class="solid-pill-btn sm">进入创作 →</a>
            <span class="pc-sub-hint">含 ${hooks.length} 套前 3s 钩子库</span>
          </div>
        </article>
      </div>
    </section>
  `;
}

/* ============================================================================
   3. VAULT (/ecosystem): PRIVATE AI ARSENAL BLOCK (Skill Capsules + Standards + Endpoints)
   ============================================================================ */
export function renderPrivateAiArsenalBlock(data) {
  const { skills = [], depot = {} } = data;
  const standards = depot.standards || [];

  const endpoints = [
    {
      key: 'design',
      path: '/context/design.txt',
      title: 'UI 审美与去塑料护栏包',
      desc: '聚合百宝箱全部设计好站拆解、代表色板 HEX 与六条反塑料 UI 铁律。写前端前一键喂给 AI。',
      badge: 'Design Context',
    },
    {
      key: 'creator',
      path: '/context/creator.txt',
      title: '自媒体流水线与个人文风包',
      desc: '聚合三步白板视频 SOP、个人文风 DNA、禁词红线与 6 套前 3 秒钩子模板。写稿不出一丝播音腔。',
      badge: 'Creator Context',
    },
    {
      key: 'skills',
      path: '/context/skills.txt',
      title: 'Skill 胶囊、MCP 与红黑榜包',
      desc: '聚合全部 SKILL.md 源码、三句话前置对齐纪律与装备弃坑账本，防止 Agent 踩重复的坑。',
      badge: 'Skills & MCP',
    },
  ];

  const skillsHtml = skills
    .map(
      (sk) => `
      <article class="skill-capsule-card spotlight-card" id="skill-${esc(sk.slug)}">
        <div class="sk-head">
          <div class="sk-file-badge">
            ${renderKindSvg('skill')}
            <code>content/skills/${esc(sk.filename)}</code>
          </div>
          <div class="sk-pills">
            <span class="pill-gray">v${esc(sk.version)}</span>
            ${sk.demo ? '<span class="demo-sample-pill">示例样张</span>' : ''}
          </div>
        </div>
        <h3>${esc(sk.name)}</h3>
        <p class="sk-trigger"><strong>触发时机：</strong>${esc(sk.trigger)}</p>
        <details class="sk-drawer">
          <summary><span>展开查看完整 SKILL.md 源码</span><i aria-hidden="true">▾</i></summary>
          <pre class="sk-source"><code>${esc(sk.rawContent)}</code></pre>
        </details>
        <div class="sk-foot">
          <span class="sk-scope">${esc(sk.scope)}</span>
          <div class="sk-actions">
            <a class="soft-pill-btn sm" href="/skills/${esc(sk.slug)}.md" download="${esc(sk.filename)}">${renderActionSvg('download')}<span>下载 .md</span></a>
            <button type="button" class="ai-copy-btn" data-copy-skill="${esc(sk.slug)}">${renderActionSvg('sparkCheck')}<span class="btn-label">复制指令给 AI</span></button>
          </div>
        </div>
      </article>
    `
    )
    .join('');

  const standardsHtml = standards
    .map(
      (std) => `
      <article class="std-spec-card spotlight-card" id="${esc(std.id)}">
        <div class="std-top">
          <span class="lane-pill">${esc(std.kind)}</span>
          <span class="pill-gray">${esc(std.badge)}</span>
          ${std.demo ? '<span class="demo-sample-pill">示例样张</span>' : ''}
        </div>
        <h3>${esc(std.title)}</h3>
        <p>${esc(std.summary)}</p>
        <pre class="std-code-box"><code>${esc(std.snippet)}</code></pre>
        <div class="std-foot">
          <span class="muted-text">适用：${esc(std.when)}</span>
          <button type="button" class="soft-pill-btn sm" data-copy="${esc(std.snippet)}">复制规格片段</button>
        </div>
      </article>
    `
    )
    .join('');

  return `
    <section id="ai-arsenal" class="arsenal-depot-zone">
      <div class="shelf-head">
        <div class="shelf-head-left">
          <span class="mini-pill-badge"><span class="dot-mint"></span> 04 · Private AI Arsenal · 给自己的 AI 私人库</span>
          <h2>范式、标准、MCP 与真 Skill 胶囊舱</h2>
          <p>把「人脑里的隐性标准」变成 AI 能直接挂载的纯文本端点、可下载的 <code>SKILL.md</code> 原件和硬核协作纪律。以后加新 Skill，只需往 <code>content/skills/</code> 丢一个 Markdown 文件。</p>
        </div>
      </div>

      <!-- A. Role-Specific AI Context Endpoints -->
      <div class="context-endpoints-grid">
        ${endpoints
          .map(
            (ep) => `
          <div class="endpoint-card">
            <div class="ep-top">
              <span class="ep-badge">${esc(ep.badge)}</span>
              <a href="${esc(ep.path)}" target="_blank" rel="noopener" class="ep-link">打开纯文本 ↗</a>
            </div>
            <h3>${esc(ep.title)}</h3>
            <p>${esc(ep.desc)}</p>
            <div class="ep-bar">
              <code>${esc(ep.path)}</code>
              <div class="ep-btns">
                <button type="button" class="icon-ghost-btn" data-copy-url="${esc(ep.path)}" title="复制接口完整链接">复制 URL</button>
                <button type="button" class="ai-copy-btn" data-copy-context="${esc(ep.key)}">${renderActionSvg('sparkCheck')}<span class="btn-label">整包复制给 AI</span></button>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- B. Runnable SKILL.md Capsules -->
      <div class="sub-arsenal-head">
        <div>
          <span class="lane-kicker">RUNNABLE SKILL CAPSULES</span>
          <h3>可开盖、可下载的真 <code>SKILL.md</code> 胶囊盒 <span class="shelf-count">${skills.length}</span></h3>
        </div>
        <p>点开就能看真实指令结构，支持一键复制或下载 <code>.md</code> 放进本地 <code>.claude/skills/</code> 或 <code>.gemini/skills/</code>。</p>
      </div>
      <div class="cards-grid-2">${skillsHtml}</div>

      <!-- C. Standards, Paradigms & MCP -->
      <div class="sub-arsenal-head">
        <div>
          <span class="lane-kicker">STANDARDS &amp; MCP SPECS</span>
          <h3>协作范式、表达标准与 MCP 挂载规格 <span class="shelf-count">${standards.length}</span></h3>
        </div>
        <p>让 AI 少说废话、少返工、少产出塑料代码的底层护栏。</p>
      </div>
      <div class="cards-grid-2">${standardsHtml}</div>
    </section>
  `;
}

/* ============================================================================
   4. FUTURE SELF DEPOT PAGE (/originals) — Signals, Radar, Teardown Diffs, Blueprint
   ============================================================================ */
export function renderOtherKit(data) {
  const vaultItems = data.ecosystem?.vaultItems || [];
  const tools = vaultItems.filter((item) => item.shelf === 'toolkit' && item.kind !== 'skill');
  const templates = data.ecosystem?.templates || [];
  const toolCards = tools
    .map(
      (item) => `
      <article class="radar-card spotlight-card">
        <div class="rc-top">
          <span class="cat-label">${esc(item.kindLabel || item.kind)}</span>
        </div>
        <h3>${esc(item.name)}</h3>
        <p class="rc-verdict">${esc(item.whyGood || '')}</p>
        ${item.whenToUse ? `<div class="rc-pitfall">${esc(item.whenToUse)}</div>` : ''}
        <div class="rc-foot">
          ${item.url ? `<a href="${esc(item.url)}" target="_blank" rel="noopener">打开 ↗</a>` : ''}
          ${item.installCmd ? `<code>${esc(item.installCmd)}</code>` : ''}
        </div>
      </article>`
    )
    .join('');
  const templateRows = templates
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
      </div>`
    )
    .join('');
  return `
    <header class="depot-sec-head">
      <div>
        <span class="lane-kicker">COMPOUND · PART 02</span>
        <h2>能装上用的</h2>
        <p>MCP、Skill、工作流和填空模板。给 AI 看的网站在 <a href="/ecosystem">另一半</a>。</p>
      </div>
    </header>
    ${tools.length ? `<div class="cards-grid-2">${toolCards}</div>` : ''}
    ${renderPrivateAiArsenalBlock(data)}
    <section id="templates" class="arsenal-block">
      <div class="block-title-row">
        <h2>填空模板</h2>
        <span>填几个空，复制出去就是一段完整的纯文本指令</span>
      </div>
      <div class="stacked-rows">${templateRows}</div>
    </section>
  `;
}

function renderPortalDocRow(doc, idx, kind = 'spec') {
  const num = String(idx + 1).padStart(2, '0');
  const copyLabel = kind === 'spec' ? '复制规范给 AI' : '复制核心方法给 AI';
  const readBtnClass = kind === 'spec' ? 'soft-pill-btn sm' : 'solid-pill-btn sm';

  return `
    <article class="portal-doc-card spotlight-card">
      <div class="pdc-num">${num}</div>
      <div class="pdc-body">
        <div class="pdc-meta">
          <span class="lane-pill">${esc(doc.category)}</span>
          <span class="muted-text">${esc(doc.readingTime)}${doc.toc?.length ? ` · 共 ${doc.toc.length} 节目录` : ''}</span>
        </div>
        <h3><a href="/read/${esc(doc.slug)}">${esc(doc.title)}</a></h3>
        <p>${esc(doc.subtitle || doc.summary)}</p>
      </div>
      <div class="pdc-actions">
        <button type="button" class="ai-copy-btn" data-ai-copy="orig-${esc(doc.slug)}">${renderActionSvg('sparkCheck')}<span class="btn-label">${copyLabel}</span></button>
        <a href="/read/${esc(doc.slug)}" class="${readBtnClass}">阅读全文 →</a>
      </div>
    </article>
  `;
}

export function renderFutureSelfDepotPage(data, { renderShell }) {
  const originals = data.originals || [];
  const videoDocs = originals.filter((d) => d.portal === 'code-video');
  const vLayer1 = videoDocs.filter((d) => d.layer === 1);
  const vLayer2 = videoDocs.filter((d) => d.layer === 2);
  const vLayer3 = videoDocs.filter((d) => d.layer === 3);

  const codingDocs = originals.filter((d) => (d.portal || 'ai-coding') === 'ai-coding');
  const codingSpecs = codingDocs.filter((d) => d.section === 'spec');
  const codingGuides = codingDocs.filter((d) => d.section !== 'spec');

  const bodyHtml = `
    <div class="inner-wrap depot-clean-root">
      <section class="inner-page-hero depot-clean-hero">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <span>手记</span></div>
        <h1>手记</h1>
        <p>写给自己的。规范、复盘、还没想完的话，按专栏放在这里。别人做好的网站和工具在典藏。</p>
      </section>

      <section class="depot-portals-wrap" aria-label="弹药库核心专栏列表">
        <!-- 专栏 01：用代码做视频 -->
        <article class="depot-entry-card spotlight-card">
          <div class="dec-lead">
            <div class="dec-top">
              <span class="mini-pill-badge"><span class="dot-orange"></span> 专栏 01 · 代码视频体系</span>
              <span class="pill-mint">已收录 ${videoDocs.length} 篇</span>
            </div>
            <div class="dec-main">
              <h2><a href="/originals/code-video">用代码做视频</a></h2>
              <p class="dec-desc">怎么从 0 开始用代码做出好看的视频。按「底层认知 → 配色与规范 → 动画字典与实操」分三层整理，目录简明，细节和实时动画收在每篇正文里。</p>
            </div>
            <div class="dec-foot">
              <a href="/originals/code-video" class="solid-pill-btn">进入「用代码做视频」 →</a>
            </div>
          </div>

          <div class="dec-two-parts">
            <a href="/originals/code-video#layer-1" class="dec-part-row">
              <span class="dpr-idx">01</span>
              <div class="dpr-info">
                <strong>第一层：方法论与认知</strong>
                <span>代码是怎么变成视频的、为什么别做成 PPT、怎么排节奏和把干货画成图</span>
              </div>
              <span class="dpr-go">${vLayer1.length} 篇 →</span>
            </a>

            <a href="/originals/code-video#layer-2" class="dec-part-row">
              <span class="dpr-idx">02</span>
              <div class="dpr-info">
                <strong>第二层：审美与视觉规范</strong>
                <span>5 套现成视频皮肤实时预览、字号留白比例，以及直接喂给 AI 的规范文件</span>
              </div>
              <span class="dpr-go">${vLayer2.length} 篇 →</span>
            </a>

            <a href="/originals/code-video#layer-3" class="dec-part-row">
              <span class="dpr-idx">03</span>
              <div class="dpr-info">
                <strong>第三层：动画字典与实操</strong>
                <span>12 种常用镜头效果实时字典、弹簧手感对比，以及一步步做出成片的流程</span>
              </div>
              <span class="dpr-go">${vLayer3.length} 篇 →</span>
            </a>
          </div>
        </article>

        <!-- 专栏 02：用 AI 写代码 -->
        <article class="depot-entry-card spotlight-card">
          <div class="dec-lead">
            <div class="dec-top">
              <span class="mini-pill-badge"><span class="dot-blue"></span> 专栏 02 · 软件与界面工程</span>
              <span class="pill-gray">已收录 ${codingDocs.length} 篇</span>
            </div>
            <div class="dec-main">
              <h2><a href="/originals/ai-coding">用 AI 写代码</a></h2>
              <p class="dec-desc">专注网页、产品组件与日常工程协作：开工前怎么和 AI 把任务边界定死防跑偏、怎么去掉界面的廉价塑料感、怎么把脑子里的审美直觉翻译成确定性参数。</p>
            </div>
            <div class="dec-foot">
              <a href="/originals/ai-coding" class="soft-pill-btn">进入「用 AI 写代码」专栏 →</a>
            </div>
          </div>

          <div class="dec-two-parts">
            <a href="/originals/ai-coding#sec-specs" class="dec-part-row">
              <span class="dpr-idx">01</span>
              <div class="dpr-info">
                <strong>配套可执行的规范</strong>
                <span>四色比例与双层卡去塑料感前端规范、任务边界定义与五格跨窗交接规范</span>
              </div>
              <span class="dpr-go">${codingSpecs.length} 份规范 →</span>
            </a>

            <a href="/originals/ai-coding#sec-practice" class="dec-part-row">
              <span class="dpr-idx">02</span>
              <div class="dpr-info">
                <strong>体系指南与深度思考</strong>
                <span>为什么模糊形容词必翻车：把「做好看点」翻译成色值、比例与流程门禁的方法论</span>
              </div>
              <span class="dpr-go">${codingGuides.length} 篇指南 →</span>
            </a>
          </div>
        </article>

        <p class="depot-quiet-footnote">手记现在有「用代码做视频」和「用 AI 写代码」两栏。新的思考按栏往下加。</p>
      </section>
    </div>
  `;

  return renderShell({
    data,
    pageTitle: '手记',
    activeNav: 'originals',
    bodyHtml,
  });
}

export function renderAiCodingPortalPage(data, { renderShell }) {
  const originals = (data.originals || []).filter((d) => (d.portal || 'ai-coding') === 'ai-coding');
  const specDocs = originals.filter((d) => d.section === 'spec');
  const practiceDocs = originals.filter((d) => d.section !== 'spec');

  const bodyHtml = `
    <div class="inner-wrap depot-clean-root">
      <section class="inner-page-hero depot-clean-hero">
        <div class="breadcrumb-muted">
          <a href="/">Workbench</a> <span>›</span> <a href="/originals">手记</a> <span>›</span> <span>用 AI 写代码</span>
        </div>
        <h1>用 AI 写代码</h1>
        <p>专注软件工程与前端界面的独立专栏（代码制片相关内容已独立迁入 <a href="/originals/code-video">「用代码做视频」专栏 →</a>）。下方按<strong>「01 · 配套可执行的规范」</strong>与<strong>「02 · 体系指南与思考」</strong>清晰分层。</p>
      </section>

      <section class="portal-clean-sec" id="sec-specs">
        <header class="portal-sec-head">
          <span class="lane-kicker">01 · EXECUTABLE SPECIFICATIONS</span>
          <h2>配套可执行的规范 <span class="shelf-count">${specDocs.length}</span></h2>
          <p>开工写网页或组件前直接复制喂给 AI：锁死四色比例、双层卡片结构与工程协作边界。</p>
        </header>
        <div class="portal-doc-stack">
          ${specDocs.map((doc, idx) => renderPortalDocRow(doc, idx, 'spec')).join('')}
        </div>
      </section>

      <section class="portal-clean-sec" id="sec-practice">
        <header class="portal-sec-head">
          <span class="lane-kicker">02 · GUIDES &amp; THINKING</span>
          <h2>体系指南与深度思考 <span class="shelf-count">${practiceDocs.length}</span></h2>
          <p>复盘怎么把感性的品味直觉翻译成模型无法偷懒曲解的确定性参数。</p>
        </header>
        <div class="portal-doc-stack">
          ${practiceDocs.map((doc, idx) => renderPortalDocRow(doc, idx, 'practice')).join('')}
        </div>
      </section>
    </div>
  `;

  return renderShell({
    data,
    pageTitle: '用 AI 写代码 · 弹药库专栏',
    activeNav: 'originals',
    bodyHtml,
  });
}

export function renderCodeVideoPortalPage(data, { renderShell }) {
  const videoDocs = (data.originals || []).filter((d) => d.portal === 'code-video');
  const layer1Docs = videoDocs.filter((d) => d.layer === 1);
  const layer2Docs = videoDocs.filter((d) => d.layer === 2);
  const layer3Docs = videoDocs.filter((d) => d.layer === 3);

  const bodyHtml = `
    <div class="inner-wrap depot-clean-root cv-portal-root">
      <section class="inner-page-hero depot-clean-hero">
        <div class="breadcrumb-muted">
          <a href="/">Workbench</a> <span>›</span> <a href="/originals">手记</a> <span>›</span> <span>用代码做视频</span>
        </div>
        <h1>用代码做视频</h1>
        <p>从 0 到 1 讲清楚怎么用 MotionHarness 和 AI 做出耐看、抓人的视频。目录按<strong>「方法论与认知 → 审美与视觉规范 → 动画字典与实操」</strong>分三层，点进每篇看详细拆解与实时动画。</p>
      </section>

      <!-- 第一层：方法论与认知 -->
      <section class="portal-clean-sec" id="layer-1">
        <header class="portal-sec-head">
          <span class="lane-kicker">01 · 方法论与认知</span>
          <h2>第一层：方法论与认知 <span class="shelf-count">${layer1Docs.length}</span></h2>
          <p>动手之前先把底层逻辑想明白：代码到底是怎么变成视频的，以及好视频怎么抓人眼球、怎么把抽象干货画出来。</p>
        </header>
        <div class="portal-doc-stack">
          ${layer1Docs.map((doc, idx) => renderPortalDocRow(doc, idx, 'practice')).join('')}
        </div>
      </section>

      <!-- 第二层：审美与视觉规范 -->
      <section class="portal-clean-sec" id="layer-2">
        <header class="portal-sec-head">
          <span class="lane-kicker">02 · 审美与视觉规范</span>
          <h2>第二层：审美与视觉规范 <span class="shelf-count">${layer2Docs.length}</span></h2>
          <p>不用懂专业美术术语：直接挑现成的配色皮肤（<code>DESIGN.md</code>），用一份标准规范把字号、留白和动作边界定死。</p>
        </header>
        <div class="portal-doc-stack">
          ${layer2Docs.map((doc, idx) => renderPortalDocRow(doc, idx, 'spec')).join('')}
        </div>
      </section>

      <!-- 第三层：动画字典与实操 -->
      <section class="portal-clean-sec" id="layer-3">
        <header class="portal-sec-head">
          <span class="lane-kicker">03 · 动画字典与实操</span>
          <h2>第三层：动画字典与实操 <span class="shelf-count">${layer3Docs.length}</span></h2>
          <p>把常用的 12 种镜头做成能实时看的动画字典，再一步步走通弹簧手感调校与「先做 15 秒小样」的完整实操流程。</p>
        </header>
        <div class="portal-doc-stack">
          ${layer3Docs.map((doc, idx) => renderPortalDocRow(doc, idx, 'practice')).join('')}
        </div>
      </section>
    </div>
  `;

  return renderShell({
    data,
    pageTitle: '用代码做视频 · 弹药库专栏',
    activeNav: 'originals',
    bodyHtml,
  });
}

/* ============================================================================
   5. CREATOR SYSTEM PAGE (/creator) — Topic Triangulator + 3-Step Excalidraw Pipeline
   ============================================================================ */
export function renderCreatorSystemPage(data, { renderShell }) {
  const creator = data.depot?.creator || {};
  const candidates = creator.topicCandidates || [];
  const first = candidates[0] || {
    id: 'tc-default',
    title: '用 Excalidraw 白板配合 AI 录干货视频的极简工作流',
    hot: 85,
    interest: 92,
    aiDepth: 90,
    note: '',
    board: { center: '', pain: '', mechanism: '', action: '', takeaway: '' },
    script: '',
    xhsTitles: [],
    xhsBody: '',
    selectedTags: [],
  };
  const hooks = creator.hookVault || [];
  const tagGroups = creator.xhsTagPool || [];
  const dna = creator.voiceDna || {};

  const bodyHtml = `
    <div class="inner-wrap creator-studio-root">
      <section class="inner-page-hero creator-hero">
        <div class="breadcrumb-muted"><a href="/">Workbench</a> <span>›</span> <span>创作</span></div>
        <h1>创作</h1>
        <p>从选题做到可以发出去：白板、口播、小红书。下面左边是操作，右边是对照。样张可以直接改字。</p>

        <div class="creator-pipeline-ribbon">
          <a href="#topic-triangulator" class="cpr-node is-accent"><b>00</b><div><strong>三环定选题</strong><small>终结热门与兴趣纠结</small></div></a>
          <span class="cpr-arrow">→</span>
          <a href="#step-excalidraw" class="cpr-node"><b>01</b><div><strong>Excalidraw 白板</strong><small>直出 .excalidraw 画布</small></div></a>
          <span class="cpr-arrow">→</span>
          <a href="#step-teleprompter" class="cpr-node"><b>02</b><div><strong>口播稿 &amp; 提词器</strong><small>带镜头标记滚动开录</small></div></a>
          <span class="cpr-arrow">→</span>
          <a href="#step-xiaohongshu" class="cpr-node"><b>03</b><div><strong>小红书文案 &amp; #话题</strong><small>话题引用 + 3:4 首图导出</small></div></a>
        </div>
      </section>

      <!-- ===================================================================
           STEP 00 · TOPIC TRIANGULATOR (热门 × 我感兴趣 × AI 内容 三环选题决策台)
           =================================================================== -->
      <section class="creator-module-card" id="topic-triangulator">
        <div class="cm-head">
          <div>
            <span class="mini-pill-badge"><span class="dot-orange"></span> Stage 00 · Topic Triangulator · 选题纠结终结器</span>
            <h2>热门趋势 × 我真感兴趣 × AI 硬核增量</h2>
            <p>选题卡壳时，把候选点子丢进来拉一下三环滑块：只热但不感兴趣会录成无情念稿机；只自嗨没痛点又没人看。交集亮绿灯再开干。</p>
          </div>
        </div>

        <div class="preset-topics-bar" role="group" aria-label="切换预设选题样本试试效果">
          <span class="ptb-label">点选样张体验：</span>
          ${candidates
            .map(
              (c, idx) =>
                `<button type="button" class="preset-topic-pill${idx === 0 ? ' is-on' : ''}${c.interest < 45 ? ' is-trap' : ''}" data-topic-preset="${esc(c.id)}">${idx === 3 ? '⚠️ 反例：纯蹭发布会通稿' : `样张 0${idx + 1}：${esc(c.title.slice(0, 15))}…`}</button>`
            )
            .join('')}
        </div>

        <div class="triangulator-grid">
          <div class="tri-controls">
            <label class="tri-topic-field">
              <span>当前评估选题（可直接改写成你正在纠结的题目）</span>
              <input type="text" id="tri-topic-input" value="${esc(first.title)}" />
            </label>

            <div class="tri-sliders">
              <div class="tri-slider-row">
                <div class="tsr-head">
                  <span>🔥 热门痛点度 <small>大众共鸣 / 搜索热度 / 痛感强弱</small></span>
                  <strong id="val-hot">${first.hot}</strong>
                </div>
                <input type="range" id="slider-hot" min="0" max="100" value="${first.hot}" />
              </div>

              <div class="tri-slider-row">
                <div class="tsr-head">
                  <span>❤️ 我的表达欲 <small>亲手踩过 / 真感兴趣 / 不吐不快</small></span>
                  <strong id="val-interest">${first.interest}</strong>
                </div>
                <input type="range" id="slider-interest" min="0" max="100" value="${first.interest}" />
              </div>

              <div class="tri-slider-row">
                <div class="tsr-head">
                  <span>🤖 AI 实战深度 <small>有具体工具流 / 方法增量 / 可抄作业</small></span>
                  <strong id="val-ai">${first.aiDepth}</strong>
                </div>
                <input type="range" id="slider-ai" min="0" max="100" value="${first.aiDepth}" />
              </div>
            </div>

            <div class="tri-angles-box">
              <span class="tab-kicker">确定做这个题？点一下切入角度，直接推入下方白板台：</span>
              <div class="tri-angle-btns">
                <button type="button" class="soft-pill-btn sm" data-apply-angle="pitfall">切角 A · 踩坑劝退流</button>
                <button type="button" class="soft-pill-btn sm" data-apply-angle="board">切角 B · 三格白板拆解流</button>
                <button type="button" class="soft-pill-btn sm" data-apply-angle="contrast">切角 C · 前后反差亮成品</button>
                <button type="button" class="ai-copy-btn" id="copy-topic-brainstorm">${renderActionSvg('sparkCheck')}<span class="btn-label">让 AI 帮我发散 5 个切角</span></button>
              </div>
            </div>
          </div>

          <div class="tri-visual-panel">
            <div class="venn-stage">
              <svg viewBox="0 0 280 230" class="venn-svg" aria-hidden="true">
                <circle id="venn-c-hot" cx="112" cy="96" r="64" fill="rgba(239, 68, 68, 0.16)" stroke="#EF4444" stroke-width="1.8"/>
                <circle id="venn-c-int" cx="168" cy="96" r="64" fill="rgba(37, 99, 235, 0.16)" stroke="#2563EB" stroke-width="1.8"/>
                <circle id="venn-c-ai" cx="140" cy="146" r="64" fill="rgba(16, 185, 129, 0.16)" stroke="#10B981" stroke-width="1.8"/>
                <circle id="venn-core-glow" cx="140" cy="112" r="22" fill="#F59E0B" fill-opacity="0.32" stroke="#D97706" stroke-width="1.6" stroke-dasharray="3 2"/>
                <text x="72" y="64" fill="currentColor" font-size="11" font-weight="700">热门关注</text>
                <text x="176" y="64" fill="currentColor" font-size="11" font-weight="700">我的体感</text>
                <text x="116" y="198" fill="currentColor" font-size="11" font-weight="700">AI 干货</text>
                <text id="venn-score-num" x="140" y="117" text-anchor="middle" fill="currentColor" font-size="16" font-weight="800">90</text>
              </svg>
            </div>
            <div class="tri-verdict-box" id="tri-verdict-box" data-state="gold">
              <div class="tvb-top">
                <span class="tvb-badge" id="tri-verdict-badge">黄金交集 · 强烈建议开拍</span>
                <strong id="tri-score-text">综合值得拍指数：90 / 100</strong>
              </div>
              <p id="tri-verdict-desc">${esc(first.note)}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STEP 01 · EXCALIDRAW WHITEBOARD GENERATOR (.excalidraw 真实文件直出)
           =================================================================== -->
      <section class="creator-module-card" id="step-excalidraw">
        <div class="cm-head">
          <div>
            <span class="mini-pill-badge"><span class="dot-blue"></span> Step 01 · Excalidraw Canvas · 白板画布生成台</span>
            <h2>先把骨架锁在手绘白板上，一键导出真 <code>.excalidraw</code> 文件</h2>
            <p>左侧改文字，右侧实时预览手绘分镜布局；点<strong>「下载 .excalidraw 画布文件」</strong>即可直接拖进 Excalidraw 桌面端、网页版或 Obsidian 白板里录视频！</p>
          </div>
          <div class="cm-head-actions">
            <button type="button" class="soft-pill-btn sm" id="excalidraw-prompt-copy">${renderActionSvg('promptDoc')}<span>复制白板生成 Prompt 给 AI</span></button>
            <button type="button" class="solid-pill-btn" id="download-excalidraw-btn">${renderActionSvg('download')}<span>下载 .excalidraw 画布文件</span></button>
          </div>
        </div>

        <div class="excalidraw-workbench" id="pipeline-workbench">
          <div class="ex-editor-col">
            <label>
              <span>顶部核心命题横幅（暖黄框 · 14 字内抓眼球）</span>
              <input type="text" id="ex-center" value="${esc(first.board.center)}" />
            </label>
            <label>
              <span>01 左侧红框 · 痛点 / 大多数人的旧做法</span>
              <input type="text" id="ex-pain" value="${esc(first.board.pain)}" />
            </label>
            <label>
              <span>02 中间蓝框 · 核心转折 / 底层机制</span>
              <input type="text" id="ex-mech" value="${esc(first.board.mechanism)}" />
            </label>
            <label>
              <span>03 右侧绿框 · 落地动作 / 我的弹药库解法</span>
              <input type="text" id="ex-action" value="${esc(first.board.action)}" />
            </label>
            <label>
              <span>底部收尾金句条（录到最后一句画笔划线点题）</span>
              <input type="text" id="ex-takeaway" value="${esc(first.board.takeaway)}" />
            </label>
            <div class="ex-sync-row">
              <button type="button" class="soft-pill-btn full-w" id="sync-board-to-script">↓ 按当前白板骨架重新生成口播初稿与小红书文案</button>
            </div>
          </div>

          <!-- Authentic Excalidraw Hand-Drawn Canvas Live Preview -->
          <div class="ex-canvas-stage" aria-label="Excalidraw 手绘白板实时预览">
            <div class="exc-toolbar">
              <span class="exc-tools-pill"><i>□</i><i>◇</i><i>◯</i><i>→</i><i>✎</i><small>orbit-storyboard.excalidraw</small></span>
              <span class="exc-cam-hint">🎥 前 3s 先特写红框，再拉全屏</span>
            </div>

            <div class="exc-board-body">
              <div class="exc-node is-banner">
                <span class="exc-step-tag">CORE THESIS · 核心命题</span>
                <strong id="prev-ex-center">${esc(first.board.center)}</strong>
              </div>

              <div class="exc-three-cols">
                <div class="exc-node is-pain">
                  <span class="exc-step-tag">01 · 痛点旧做法</span>
                  <p id="prev-ex-pain">${esc(first.board.pain)}</p>
                </div>
                <div class="exc-arrow" aria-hidden="true">
                  <svg viewBox="0 0 44 24" width="38" height="22" fill="none"><path d="M2 13C14 9 26 9 39 12M32 6L40 12L31 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <small>破局</small>
                </div>
                <div class="exc-node is-mech">
                  <span class="exc-step-tag">02 · 关键机制</span>
                  <p id="prev-ex-mech">${esc(first.board.mechanism)}</p>
                </div>
                <div class="exc-arrow" aria-hidden="true">
                  <svg viewBox="0 0 44 24" width="38" height="22" fill="none"><path d="M2 11C15 15 27 14 39 11M32 5L40 11L32 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <small>落地</small>
                </div>
                <div class="exc-node is-action">
                  <span class="exc-step-tag">03 · 实操拿走</span>
                  <p id="prev-ex-action">${esc(first.board.action)}</p>
                </div>
              </div>

              <div class="exc-node is-takeaway">
                <span class="exc-quote-mark">✦ 一句话带走：</span>
                <em id="prev-ex-takeaway">${esc(first.board.takeaway)}</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STEP 02 · SPOKEN SCRIPT & LIVE TELEPROMPTER (口播稿 + 录制提词器)
           =================================================================== -->
      <section class="creator-module-card" id="step-teleprompter">
        <div class="cm-head">
          <div>
            <span class="mini-pill-badge"><span class="dot-mint"></span> Step 02 · Spoken Script &amp; Teleprompter · 口播稿与提词器</span>
            <h2>带白板动作提示的自然口播稿，打开网页提词器直接开录</h2>
            <p>方括号里的 <code>[切白板]</code> <code>[画笔]</code> <code>[停顿]</code> 会在右侧提词器里自动高亮成醒目色块，眼睛盯着黄金视线带就能自然边指边讲。</p>
          </div>
          <div class="cm-head-actions">
            <span class="script-stat-pill" id="script-stat-pill">计算字数与时长中…</span>
            <button type="button" class="ai-copy-btn" id="copy-spoken-prompt">${renderActionSvg('sparkCheck')}<span class="btn-label">复制「白板转口播」Prompt</span></button>
          </div>
        </div>

        <div class="teleprompter-workbench">
          <div class="tp-editor-col">
            <div class="tpe-bar">
              <span>口播逐字稿编辑区（支持随时手改词句）</span>
              <span class="plastic-guard-badge is-clean" id="script-plastic-guard">✓ 零塑料套话</span>
            </div>
            <textarea id="spoken-script-input" rows="12">${esc(first.script)}</textarea>
            <div class="tpe-foot">
              <button type="button" class="soft-pill-btn sm" id="insert-cue-board">+ 插入 [切白板特写]</button>
              <button type="button" class="soft-pill-btn sm" id="insert-cue-pause">+ 插入 [停顿半秒]</button>
              <button type="button" class="soft-pill-btn sm" id="copy-raw-script">复制纯口播稿</button>
            </div>
          </div>

          <div class="tp-monitor-col" id="teleprompter-box" data-size="md" data-mirror="0">
            <div class="tpm-controls">
              <button type="button" class="solid-pill-btn sm tp-play-btn" id="tp-play-toggle">▶ 开启滚动提词</button>
              <button type="button" class="icon-ghost-btn" id="tp-reset-btn" title="回到开头">↺ 重置</button>
              <label class="tp-speed-wrap" title="滚动语速调节">
                <span>速度</span>
                <input type="range" id="tp-speed" min="1" max="6" step="0.5" value="2.5" />
                <b id="tp-speed-val">1.0×</b>
              </label>
              <button type="button" class="icon-ghost-btn" id="tp-font-toggle" title="切换提词字号">A+</button>
              <button type="button" class="icon-ghost-btn" id="tp-mirror-toggle" title="水平镜像翻转（配合分光提词镜使用）">⇄ 镜像</button>
              <button type="button" class="icon-ghost-btn" id="tp-fullscreen-toggle" title="全屏提词录制">⛶ 全屏</button>
            </div>
            <div class="tpm-viewport" id="tp-viewport">
              <div class="tpm-eyeline" aria-hidden="true"><span>EYE-LINE · 镜头视线区</span></div>
              <div class="tpm-scroll-content" id="tp-rendered-script"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           STEP 03 · XIAOHONGSHU COPY, #TAGS STUDIO & 3:4 COVER CARD
           =================================================================== -->
      <section class="creator-module-card" id="step-xiaohongshu">
        <div class="cm-head">
          <div>
            <span class="mini-pill-badge"><span class="dot-orange"></span> Step 03 · Publish &amp; Tags · 小红书发布文案与话题引用台</span>
            <h2>挑一个高点击标题，点选挂上 <code>#话题</code>，顺手导出 3:4 首图</h2>
            <p>复制出去自动组合成「选中标题 + 干净分段正文 + 底部 #话题串」，没有任何多余 Markdown 符号，打开小红书直接粘贴发布。</p>
          </div>
          <div class="cm-head-actions">
            <button type="button" class="ai-copy-btn lg-copy" id="copy-full-xhs-btn">${renderActionSvg('sparkCheck')}<span class="btn-label">一键复制完整小红书发布包</span></button>
          </div>
        </div>

        <div class="xhs-workbench">
          <div class="xhs-left-col">
            <div class="xhs-titles-block">
              <span class="xhs-label">1. 备选切角标题（点击切换采用，也会同步到右侧 3:4 首图）</span>
              <div class="xhs-title-options" id="xhs-title-options"></div>
              <input type="text" id="xhs-active-title" class="xhs-title-input" value="${esc(first.xhsTitles?.[0] || first.title)}" />
            </div>

            <div class="xhs-body-block">
              <span class="xhs-label">2. 发布正文（短段落留白排版）</span>
              <textarea id="xhs-body-input" rows="8">${esc(first.xhsBody)}</textarea>
            </div>

            <div class="xhs-tags-block">
              <div class="xhs-tags-head">
                <span class="xhs-label">3. 点击引用小红书 <code>#话题标签</code>（绿底为已挂载）</span>
                <div class="xhs-custom-tag">
                  <input type="text" id="xhs-custom-tag-input" placeholder="+ 输入新话题回车添加" />
                </div>
              </div>
              <div class="xhs-tag-groups" id="xhs-tag-groups">
                ${tagGroups
                  .map(
                    (g) => `
                  <div class="xtg-row">
                    <small>${esc(g.group)}</small>
                    <div class="xtg-pills">
                      ${(g.tags || [])
                        .map(
                          (tag) =>
                            `<button type="button" class="xhs-tag-pill${(first.selectedTags || []).includes(tag) ? ' is-picked' : ''}" data-xhs-tag="${esc(tag)}">${esc(tag)}</button>`
                        )
                        .join('')}
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
              <div class="xhs-selected-preview" id="xhs-selected-tags-line"></div>
            </div>
          </div>

          <div class="xhs-right-col">
            <div class="xhs-cover-studio">
              <div class="xcs-top">
                <strong>实时 3:4 小红书封面 / 金句图</strong>
                <div class="xcs-themes" role="group" aria-label="封面风格切换">
                  <button type="button" class="is-on" data-xhs-theme="paper">纸感白板</button>
                  <button type="button" data-xhs-theme="obsidian">曜石黑金</button>
                  <button type="button" data-xhs-theme="cobalt">克莱因蓝</button>
                </div>
              </div>
              <div class="xcs-canvas-wrap">
                <canvas id="xhs-inline-canvas" width="720" height="960"></canvas>
              </div>
              <div class="xcs-foot">
                <button type="button" class="solid-pill-btn full-w" id="download-xhs-cover-btn">${renderActionSvg('download')}<span>导出高清 3:4 小红书配图 (.png)</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           LONG-TERM AMMO: HOOK VAULT + PERSONAL VOICE DNA
           =================================================================== -->
      <section class="creator-ammo-grid" id="creator-ammo">
        <div class="hook-vault-panel">
          <div class="sub-arsenal-head">
            <div>
              <span class="lane-kicker">3-SECOND HOOK VAULT</span>
              <h3>前 3 秒黄金钩子模板库 <span class="shelf-count">${hooks.length}</span></h3>
            </div>
            <p>开场第一句卡壳时挑一张点「塞进开头」，立刻替换掉温吞铺垫。</p>
          </div>
          <div class="hooks-grid">
            ${hooks
              .map(
                (hk) => `
              <article class="hook-card spotlight-card">
                <div class="hk-top">
                  <span class="lane-pill">${esc(hk.type)}</span>
                  <small>${esc(hk.scene)}</small>
                </div>
                <p class="hk-formula">${esc(hk.formula)}</p>
                <p class="hk-example">“${esc(hk.example)}”</p>
                <div class="hk-foot">
                  <button type="button" class="soft-pill-btn sm" data-inject-hook="${esc(hk.example)}">↑ 塞进 Step 2 口播开头</button>
                  <button type="button" class="icon-ghost-btn" data-copy="${esc(`前 3 秒钩子公式（${hk.type}）：\n${hk.formula}\n参考示范：${hk.example}`)}">复制公式</button>
                </div>
              </article>
            `
              )
              .join('')}
          </div>
        </div>

        <aside class="voice-dna-card spotlight-card">
          <div class="vdna-top">
            <span class="mini-pill-badge"><span class="dot-blue"></span> Personal Voice DNA · 个人文风基因卡</span>
            ${dna.demo ? '<span class="demo-sample-pill">示例样张</span>' : ''}
          </div>
          <h3>让 AI 写出你的真人口吻，而不是播音腔</h3>
          <p class="vdna-persona"><strong>人设锚点：</strong>${esc(dna.persona || '')}</p>
          <div class="vdna-sec">
            <h4>✓ 我的表达习惯</h4>
            <ul>${(dna.rhythm || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
          </div>
          <div class="vdna-sec">
            <h4>✕ 绝对禁词红线（见一个删一个）</h4>
            <div class="banned-chips">${(dna.bannedWords || []).map((w) => `<span>${esc(w)}</span>`).join('')}</div>
          </div>
          <button type="button" class="ai-copy-btn full-w-btn" data-copy="${esc(dna.systemPrompt || '')}">${renderActionSvg('sparkCheck')}<span class="btn-label">一键复制我的文风 DNA 给 AI</span></button>
        </aside>
      </section>
    </div>
  `;

  return renderShell({
    data,
    pageTitle: '创作 · 从选题到发出去',
    activeNav: 'creator',
    bodyHtml,
  });
}

/* ============================================================================
   6. GLOBAL SOCIAL SHARE CARD GENERATOR MODAL (3:4 Xiaohongshu / 16:9 X)
   ============================================================================ */
export function renderShareCardModal() {
  return `
  <div class="modal-backdrop" id="share-card-modal" hidden>
    <div class="layered-modal-shell wide" role="dialog" aria-modal="true" aria-labelledby="share-modal-heading">
      <div class="layered-modal-inner">
        <div class="modal-top">
          <span class="mini-pill-badge"><span class="dot-orange"></span> Visual Card Studio · 3:4 小红书 / 16:9 分享卡生成台</span>
          <button type="button" class="modal-close" data-close-modal aria-label="Close">✕</button>
        </div>
        <h2 id="share-modal-heading">把一条好判断直接变成可发帖的高清配图</h2>
        <div class="share-studio-grid">
          <div class="ss-controls">
            <div class="ss-row-inline">
              <div class="seg-group" role="group" aria-label="画幅比例">
                <button type="button" class="seg-btn is-active" data-sc-ratio="3:4">3:4 小红书竖版</button>
                <button type="button" class="seg-btn" data-sc-ratio="16:9">16:9 X / 视频横版</button>
              </div>
              <div class="seg-group" role="group" aria-label="视觉主题">
                <button type="button" class="seg-btn is-active" data-sc-theme="paper">纸感白板</button>
                <button type="button" class="seg-btn" data-sc-theme="obsidian">曜石黑金</button>
                <button type="button" class="seg-btn" data-sc-theme="cobalt">深海钴蓝</button>
              </div>
            </div>
            <label class="ss-field"><span>顶部眉标</span><input type="text" id="sc-kicker" value="ORBIT AMMUNITION DEPOT · 当时判断" /></label>
            <label class="ss-field"><span>主标题</span><input type="text" id="sc-title" value="好工作台不是存了多少链接，而是下一次动手省下多少废话" /></label>
            <label class="ss-field"><span>核心正文摘要</span><textarea id="sc-body" rows="4">把踩过的坑、筛出来的精品和给 AI 的纯文本指令收进同一座弹药库，人和 Agent 随时都能直接调用。</textarea></label>
            <label class="ss-field"><span>底部标签</span><input type="text" id="sc-tags" value="#AI工作流 #第二大脑 #实战弹药库" /></label>
            <button type="button" class="solid-pill-btn full-w" id="sc-download-btn">${renderActionSvg('download')}<span>下载高清 PNG 配图</span></button>
          </div>
          <div class="ss-preview-wrap">
            <canvas id="share-card-canvas" width="720" height="960"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ============================================================================
   7. CLIENT DATA PAYLOAD BUILDER (Injected into window.__DEPOT_DATA__)
   ============================================================================ */
export function buildDepotClientPayload(data) {
  const skillsMap = {};
  for (const sk of data.skills || []) {
    skillsMap[sk.slug] = {
      name: sk.name,
      filename: sk.filename,
      plainPrompt: sk.plainPrompt,
    };
  }
  return {
    brandName: `${data.site.brandName} · ${data.site.brandSub}`,
    contexts: {
      design: renderRoleContextTxt(data, 'design'),
      creator: renderRoleContextTxt(data, 'creator'),
      skills: renderRoleContextTxt(data, 'skills'),
    },
    skills: skillsMap,
    signals: data.depot?.signals || [],
    creator: data.depot?.creator || {},
  };
}
