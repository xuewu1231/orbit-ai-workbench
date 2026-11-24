import { renderArticleDiagram } from './article-diagrams.mjs';

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatInline(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1 ↗</a>');
  return html;
}

function renderCustomBlock(token) {
  if (token === ':::diagram-ai-native-contrast:::') {
    return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 760 226" role="img" aria-label="普通工具用法与 AI Native 系统化用法对比">
          <rect x="4" y="4" width="752" height="218" rx="20" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="22" y="22" width="346" height="182" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="44" y="52" fill="var(--ink-muted)" font-size="11" font-weight="700">旧习惯 · 临时聊天工具人</text>
          <text x="44" y="82" fill="var(--ink-primary)" font-size="16" font-weight="700">人在流程中间手动搬砖</text>
          <text x="44" y="112" fill="var(--ink-secondary)" font-size="12.5">· 每次重新交代背景，聊完即忘</text>
          <text x="44" y="136" fill="var(--ink-secondary)" font-size="12.5">· 单窗口串行等待，人肉复制粘贴</text>
          <rect x="44" y="158" width="118" height="28" rx="14" fill="var(--bg-shell)"/>
          <text x="60" y="177" fill="var(--ink-secondary)" font-size="12" font-weight="700">线性提效 · 1.3x</text>

          <rect x="392" y="22" width="346" height="182" rx="14" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="414" y="52" fill="var(--blue)" font-size="11" font-weight="700">新物种 · AI Native 系统化打法</text>
          <text x="414" y="82" fill="var(--ink-primary)" font-size="16" font-weight="700">人抓首尾标准，中间交给自治系统</text>
          <text x="414" y="112" fill="var(--ink-secondary)" font-size="12.5">· 经验沉淀为 Context + Workflow + Skill</text>
          <text x="414" y="136" fill="var(--ink-secondary)" font-size="12.5">· 多 Agent 并发执行 + 自动自检兜底</text>
          <rect x="414" y="158" width="136" height="28" rx="14" fill="var(--blue-soft)"/>
          <text x="430" y="177" fill="var(--blue)" font-size="12" font-weight="700">指数级杠杆 · 50x</text>
        </svg>
        <figcaption>从“把 AI 当搜索框”切换到“把经验封装成可并发复用的系统”</figcaption>
      </figure>
    `;
  }

  if (token === ':::diagram-dual-write:::') {
    return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 760 256" role="img" aria-label="一次实战沉淀为四份资产的循环图">
          <rect x="4" y="4" width="752" height="248" rx="20" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="24" y="34" width="196" height="188" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="44" y="66" fill="var(--ink-primary)" font-size="14" font-weight="700">1. 日常探索与输入</text>
          <text x="44" y="96" fill="var(--ink-secondary)" font-size="12">· 跑通新产品功能</text>
          <text x="44" y="122" fill="var(--ink-secondary)" font-size="12">· 看懂顶级英文长文</text>
          <text x="44" y="148" fill="var(--ink-secondary)" font-size="12">· 试出好用的 AI 工具组合</text>
          <text x="44" y="192" fill="var(--ink-muted)" font-size="11">不再散落在聊天记录里</text>

          <path d="M228 128 L278 128" stroke="var(--blue)" stroke-width="2" stroke-dasharray="4 3"/>
          <polygon points="278,123 288,128 278,133" fill="var(--blue)"/>

          <rect x="296" y="34" width="182" height="188" rx="14" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="316" y="66" fill="var(--blue)" font-size="14" font-weight="700">2. 理解透后存入总站</text>
          <text x="316" y="98" fill="var(--ink-primary)" font-size="12" font-weight="600">对内：给自己人随时查</text>
          <text x="316" y="118" fill="var(--ink-secondary)" font-size="11">也直接喂给团队 Agent 复用</text>
          <line x1="316" y1="138" x2="458" y2="138" stroke="var(--border-subtle)"/>
          <text x="316" y="164" fill="var(--ink-primary)" font-size="12" font-weight="600">对外：展示品味与实力</text>
          <text x="316" y="184" fill="var(--ink-secondary)" font-size="11">吸引同频客户与优秀伙伴</text>

          <rect x="524" y="34" width="210" height="40" rx="10" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="542" y="59" fill="var(--ink-primary)" font-size="12" font-weight="600">① 实战原创与高认知卡片</text>

          <rect x="524" y="84" width="210" height="40" rx="10" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="542" y="109" fill="var(--ink-primary)" font-size="12" font-weight="600">② 精选好文 + 我们的批注</text>

          <rect x="524" y="134" width="210" height="40" rx="10" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="542" y="159" fill="var(--ink-primary)" font-size="12" font-weight="600">③ Workflow / Skill / 模板</text>

          <rect x="524" y="184" width="210" height="40" rx="10" fill="var(--blue-soft)"/>
          <text x="542" y="209" fill="var(--blue)" font-size="12" font-weight="700">④ 自研产品与好工具清单</text>
        </svg>
        <figcaption>一件事做透之后顺手归档，自然长成一套越用越厚的团队资产库</figcaption>
      </figure>
    `;
  }

  if (token === ':::diagram-agent-evolution:::') {
    return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 760 216" role="img" aria-label="AI Agent 四阶段演进对比">
          <rect x="4" y="4" width="752" height="208" rx="20" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="22" y="26" width="168" height="164" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="38" y="54" fill="var(--ink-muted)" font-size="11" font-weight="700">01 · 纯写提示词</text>
          <text x="38" y="80" fill="var(--ink-primary)" font-size="13.5" font-weight="700">对话框问答</text>
          <text x="38" y="106" fill="var(--ink-secondary)" font-size="11.5">摸不到本地文件</text>
          <text x="38" y="128" fill="var(--ink-secondary)" font-size="11.5">全靠人工来回粘贴</text>

          <rect x="202" y="26" width="168" height="164" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="218" y="54" fill="var(--ink-muted)" font-size="11" font-weight="700">02 · 固定连线流</text>
          <text x="218" y="80" fill="var(--ink-primary)" font-size="13.5" font-weight="700">死板流程图</text>
          <text x="218" y="106" fill="var(--ink-secondary)" font-size="11.5">遇到意外报错即卡死</text>
          <text x="218" y="128" fill="var(--ink-secondary)" font-size="11.5">灵活性极差</text>

          <rect x="382" y="26" width="168" height="164" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="398" y="54" fill="var(--ink-muted)" font-size="11" font-weight="700">03 · 插件塞太满</text>
          <text x="398" y="80" fill="var(--ink-primary)" font-size="13.5" font-weight="700">几十个重型工具</text>
          <text x="398" y="106" fill="var(--ink-secondary)" font-size="11.5">占满上下文窗口</text>
          <text x="398" y="128" fill="var(--ink-secondary)" font-size="11.5">模型反而容易选错</text>

          <rect x="562" y="26" width="176" height="164" rx="14" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="578" y="54" fill="var(--blue)" font-size="11" font-weight="700">04 · 当前最顺手方案</text>
          <text x="578" y="80" fill="var(--ink-primary)" font-size="13.5" font-weight="700">命令行 + 按需 Skill</text>
          <text x="578" y="106" fill="var(--ink-secondary)" font-size="11.5">平时轻装上阵</text>
          <text x="578" y="128" fill="var(--ink-secondary)" font-size="11.5">用到哪块再读对应 Skill</text>
          <text x="578" y="164" fill="var(--mint)" font-size="11.5" font-weight="700">✓ 省 Token · 稳 · 好维护</text>
        </svg>
        <figcaption>工具不在多，关键是基础读写能力干净 + 专业经验按需加载</figcaption>
      </figure>
    `;
  }

  if (token === ':::diagram-tool-subtraction:::') {
    return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 760 198" role="img" aria-label="精简工具前后效果对比">
          <rect x="4" y="4" width="752" height="190" rx="20" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="24" y="24" width="340" height="150" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="46" y="56" fill="var(--ink-muted)" font-size="12" font-weight="700">精简前：挂载 20+ 个专用查询插件</text>
          <text x="46" y="92" fill="var(--ink-secondary)" font-size="13.5">平均耗时：<tspan font-weight="700" fill="var(--ink-primary)">77.4 秒</tspan></text>
          <text x="46" y="120" fill="var(--ink-secondary)" font-size="13.5">一次答对率：<tspan font-weight="700" fill="var(--ink-primary)">80%</tspan></text>
          <text x="46" y="148" fill="var(--ink-muted)" font-size="11.5">每次改表结构都要同步改一堆插件说明</text>

          <rect x="396" y="24" width="340" height="150" rx="14" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.5"/>
          <text x="418" y="56" fill="var(--mint)" font-size="12" font-weight="700">精简后：清晰文件目录 + 基础终端命令</text>
          <text x="418" y="92" fill="var(--ink-secondary)" font-size="13.5">平均耗时：<tspan font-weight="700" fill="var(--mint)">28.1 秒（快近 3 倍）</tspan></text>
          <text x="418" y="120" fill="var(--ink-secondary)" font-size="13.5">一次答对率：<tspan font-weight="700" fill="var(--mint)">98.2%</tspan></text>
          <text x="418" y="148" fill="var(--ink-secondary)" font-size="11.5">直接发挥模型原生的搜索与推理能力</text>
        </svg>
        <figcaption>把背景文档整理干净，比写一堆碎插件管用得多</figcaption>
      </figure>
    `;
  }

  if (token === ':::sandbox-flywheel:::') {
    return `
      <div class="interactive-sandbox" data-sandbox="flywheel">
        <div class="sandbox-header">
          <span class="sandbox-badge">交互演示 · 看看一件事怎么顺手存成 4 份资产</span>
        </div>
        <div class="sandbox-tabs" role="tablist">
          <button type="button" class="sandbox-tab is-active" data-scenario="research">刚调研完一批竞品</button>
          <button type="button" class="sandbox-tab" data-scenario="workflow">刚跑通一套 AI 工作流</button>
          <button type="button" class="sandbox-tab" data-scenario="ui">刚调好一套干净的界面规范</button>
        </div>
        <div class="sandbox-grid" id="flywheel-output">
          <div class="sandbox-card">
            <span class="sc-step">01 · 给自己查</span>
            <h4>竞品核心优缺点对比表 (.md)</h4>
            <p>存进仓库，下次做新功能直接丢给 AI 当背景参考。</p>
          </div>
          <div class="sandbox-card">
            <span class="sc-step">02 · 精选好文/原创</span>
            <h4>《这几款产品做对了什么》</h4>
            <p>加上我们的判断发在总站，展示团队看问题的深度。</p>
          </div>
          <div class="sandbox-card">
            <span class="sc-step">03 · 存入武器库</span>
            <h4>竞品深度拆解 Workflow</h4>
            <p>把调研步骤固化下来，以后分析新方向半小时搞定。</p>
          </div>
          <div class="sandbox-card">
            <span class="sc-step">04 · 好用工具推荐</span>
            <h4>更新实测工具红黑榜</h4>
            <p>顺手记下哪款真好用、哪款是噱头，全员少踩坑。</p>
          </div>
        </div>
      </div>
    `;
  }

  if (token === ':::sandbox-palette:::') {
    return `
      <div class="interactive-sandbox" data-sandbox="palette">
        <div class="sandbox-header">
          <span class="sandbox-badge">直观对比 · 点一下看看两种界面气质的差别</span>
        </div>
        <div class="sandbox-tabs">
          <button type="button" class="palette-btn is-active" data-style-mode="editorial">✓ 克制耐看的极简科技风（本站采用）</button>
          <button type="button" class="palette-btn" data-style-mode="cliche">✕ 泛滥的 AI 蓝紫发光模板（反面例子）</button>
        </div>
        <div class="palette-preview mode-editorial" id="palette-preview-card">
          <div class="pp-kicker">CLEAN PRODUCT DESIGN</div>
          <div class="pp-title">留白干净、重点突出，看多久都不累</div>
          <p class="pp-desc">用纯白内卡片嵌在浅灰外框里（Card-in-Card），只保留纯黑主按钮和一抹克制的科技蓝，低调但很有质感。</p>
          <div class="pp-meta"><span>清晰层级</span> · <span>柔和圆角</span> · <span>零视觉噪音</span></div>
        </div>
      </div>
    `;
  }

  return renderArticleDiagram(token);
}

function renderBlocks(markdownText, sectionCounterRef) {
  const lines = markdownText.replace(/\r\n/g, '\n').split('\n');
  const htmlParts = [];
  const toc = [];
  let paragraphBuf = [];
  let listType = null;
  let listItems = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines = [];
  let tableRows = [];

  const flushParagraph = () => {
    if (paragraphBuf.length > 0) {
      htmlParts.push(`<p>${formatInline(paragraphBuf.join(' '))}</p>`);
      paragraphBuf = [];
    }
  };

  const flushList = () => {
    if (listType && listItems.length > 0) {
      const itemsHtml = listItems.map((item) => `<li>${formatInline(item)}</li>`).join('');
      htmlParts.push(`<${listType} class="editorial-list">${itemsHtml}</${listType}>`);
      listType = null;
      listItems = [];
    }
  };

  const flushTable = () => {
    if (!tableRows.length) return;
    const parsed = tableRows.map((row) =>
      row
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((c) => c.trim())
    );
    tableRows = [];
    if (!parsed.length) return;
    const head = parsed[0];
    const hasSep = parsed[1] && parsed[1].every((c) => /^:?-+:?$/.test(c));
    const bodyRows = hasSep ? parsed.slice(2) : parsed.slice(1);
    const theadHtml = `<thead><tr>${head.map((c) => `<th>${formatInline(c)}</th>`).join('')}</tr></thead>`;
    const tbodyHtml = bodyRows.length
      ? `<tbody>${bodyRows.map((r) => `<tr>${r.map((c) => `<td>${formatInline(c)}</td>`).join('')}</tr>`).join('')}</tbody>`
      : '';
    htmlParts.push(`<div class="doc-table-wrap"><table class="doc-table">${theadHtml}${tbodyHtml}</table></div>`);
  };

  for (const rawLine of lines) {
    const trimmedFence = rawLine.trim();
    if (trimmedFence.startsWith('```')) {
      flushParagraph();
      flushList();
      flushTable();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = trimmedFence.slice(3).trim() || 'code';
        codeLines = [];
      } else {
        const rawCode = codeLines.join('\n');
        htmlParts.push(
          `<div class="doc-codeblock"><div class="dcb-bar"><span>${escapeHtml(codeLang)}</span><button type="button" class="copy-cmd-btn" data-copy="${escapeHtml(rawCode)}">复制代码</button></div><pre><code>${escapeHtml(rawCode)}</code></pre></div>`
        );
        inCodeBlock = false;
        codeLang = '';
        codeLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      continue;
    }

    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }

    if (line.startsWith('|') && line.endsWith('|') && line.includes('|', 1)) {
      flushParagraph();
      flushList();
      tableRows.push(line);
      continue;
    }
    flushTable();

    if (line.startsWith(':::') && line.endsWith(':::')) {
      flushParagraph();
      flushList();
      htmlParts.push(renderCustomBlock(line));
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      flushParagraph();
      flushList();
      sectionCounterRef.count += 1;
      const secNum = String(sectionCounterRef.count).padStart(2, '0');
      const secId = `section-${sectionCounterRef.count}`;
      const headingTitle = h2Match[1].trim();
      toc.push({ id: secId, num: secNum, title: headingTitle });
      htmlParts.push(
        `<h2 id="${secId}" class="chapter-h2"><span class="sec-marker">${secNum}</span><span>${formatInline(headingTitle)}</span></h2>`
      );
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      flushParagraph();
      flushList();
      htmlParts.push(`<h3 class="chapter-h3">${formatInline(h3Match[1].trim())}</h3>`);
      continue;
    }

    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (imgMatch) {
      flushParagraph();
      flushList();
      const alt = imgMatch[1].trim();
      const src = imgMatch[2].trim();
      if (/^(https?:\/\/|\/)/.test(src)) {
        htmlParts.push(
          `<figure class="doc-figure"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />${alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : ''}</figure>`
        );
      }
      continue;
    }

    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      htmlParts.push(`<blockquote class="doc-quote">${formatInline(line.slice(2).trim())}</blockquote>`);
      continue;
    }

    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(olMatch[1]);
      continue;
    }

    const ulMatch = line.match(/^-\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(ulMatch[1]);
      continue;
    }

    flushList();
    paragraphBuf.push(line);
  }

  flushParagraph();
  flushList();
  flushTable();

  return { html: htmlParts.join('\n'), toc };
}

export function parseMarkdownDocument(rawContent, filename = '') {
  const normalized = rawContent.replace(/\r\n/g, '\n');
  let meta = {};
  let body = normalized;

  if (normalized.startsWith('---\n')) {
    const endIdx = normalized.indexOf('\n---\n', 4);
    if (endIdx !== -1) {
      const frontmatterRaw = normalized.slice(4, endIdx);
      body = normalized.slice(endIdx + 5);
      for (const line of frontmatterRaw.split('\n')) {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;
        const key = line.slice(0, colonIdx).trim();
        let val = line.slice(colonIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        meta[key] = val;
      }
    }
  }

  const counter = { count: 0 };
  const parts = body.split('<!-- PRO_CUT -->');
  const previewParsed = renderBlocks(parts[0], counter);
  const proRestParsed = parts[1] ? renderBlocks(parts[1], counter) : { html: '', toc: [] };

  const relatedSlugs = meta.relatedSlugs
    ? meta.relatedSlugs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return {
    filename,
    slug: meta.slug || filename.replace(/\.md$/, ''),
    layout: meta.layout || '',
    kind: meta.kind || 'original',
    publisher: meta.publisher || '',
    coverTitle: meta.coverTitle || '',
    coverFace: meta.coverFace || '',
    series: meta.series || '',
    portal: meta.portal || 'ai-coding',
    section: meta.section || 'practice',
    lane: meta.lane || (meta.kind === 'curated' ? '' : 'made'),
    module: meta.module || '',
    category: meta.category || meta.series || '实战沉淀',
    chapter: meta.chapter || '',
    title: meta.title || '未命名文章',
    subtitle: meta.subtitle || '',
    access: meta.access || 'free',
    date: meta.date || '',
    readingTime: meta.readingTime || '约 10 分钟阅读',
    audioDuration: meta.audioDuration || '10:00',
    originalAuthor: meta.originalAuthor || '',
    originalOrg: meta.originalOrg || '',
    sourceUrl: meta.sourceUrl || '',
    studioNoteTitle: meta.studioNoteTitle || '',
    studioNoteBody: meta.studioNoteBody || '',
    coverAccent: meta.coverAccent || 'blue',
    coverSymbol: meta.coverSymbol || 'rings',
    pairedSkill: meta.pairedSkill || '',
    summary: meta.summary || '',
    relatedSlugs,
    previewHtml: previewParsed.html,
    proRestHtml: proRestParsed.html,
    hasProCut: Boolean(parts[1]),
    toc: [...previewParsed.toc, ...proRestParsed.toc],
  };
}
