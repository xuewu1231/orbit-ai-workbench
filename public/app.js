(function () {
  const htmlEl = document.documentElement;
  const $ = (id) => document.getElementById(id);

  /* ---------------------------------------------------------------------------
     0. Tactile click sound + Dynamic-Island toast
     ------------------------------------------------------------------------- */
  let soundEnabled = true;
  try { if (localStorage.getItem('orbit-sound') === 'off') soundEnabled = false; } catch (e) {}
  const soundBtn = $('sound-toggle');
  let eqPulseTimer = null;
  function pulseSoundEq() {
    if (!soundBtn || !soundEnabled) return;
    soundBtn.classList.add('is-pulsing');
    clearTimeout(eqPulseTimer);
    eqPulseTimer = setTimeout(() => soundBtn.classList.remove('is-pulsing'), 260);
  }

  let audioCtx = null;
  function click(freq = 1150, dur = 0.018) {
    if (!soundEnabled) return;
    pulseSoundEq();
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + dur);
      gain.gain.setValueAtTime(0.045, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  const toastEl = $('orbit-toast');
  let toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    toastEl.style.animation = 'none';
    void toastEl.offsetWidth;
    toastEl.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2300);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
      return true;
    }
  }

  function paintSound() {
    if (!soundBtn) return;
    const en = htmlEl.getAttribute('data-lang') === 'en';
    const label = soundEnabled
      ? (en ? 'Sound is on. Click to mute' : '轻触音效开着，点击关掉')
      : (en ? 'Sound is off. Click to turn on' : '轻触音效关着，点击打开');
    soundBtn.classList.toggle('is-muted', !soundEnabled);
    soundBtn.title = label;
    soundBtn.setAttribute('aria-label', label);
    soundBtn.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
  }
  if (soundBtn) {
    paintSound();
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      try { localStorage.setItem('orbit-sound', soundEnabled ? 'on' : 'off'); } catch (e) {}
      paintSound();
      if (soundEnabled) click(1400, 0.022);
      const en = htmlEl.getAttribute('data-lang') === 'en';
      toast(soundEnabled ? (en ? 'Sound on' : '轻触音效已打开') : (en ? 'Sound off' : '轻触音效已关掉'));
    });
  }

  /* ---------------------------------------------------------------------------
     1. Theme / Language
     ------------------------------------------------------------------------- */
  const themeBtn = $('theme-toggle');
  function paintTheme() {
    if (!themeBtn) return;
    const dark = htmlEl.getAttribute('data-theme') === 'dark';
    const en = htmlEl.getAttribute('data-lang') === 'en';
    const label = dark
      ? (en ? 'Dark is on. Switch to light' : '现在是深色，点击换成浅色')
      : (en ? 'Light is on. Switch to dark' : '现在是浅色，点击换成深色');
    themeBtn.title = label;
    themeBtn.setAttribute('aria-label', label);
    themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }
  function paintLang() {
    const current = htmlEl.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
    document.querySelectorAll('[data-set-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-set-lang') === current ? 'true' : 'false');
    });
    const input = $('global-search-input');
    if (input) {
      input.placeholder = current === 'en'
        ? 'Search collection, reading, studio, journal, products'
        : '搜收藏、阅读、创作、沉淀或产品';
    }
    paintTheme();
    paintSound();
  }
  if (themeBtn) {
    paintTheme();
    themeBtn.addEventListener('click', () => {
      click(920);
      const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      try { localStorage.setItem('studio-theme', next); } catch (e) {}
      paintTheme();
      const en = htmlEl.getAttribute('data-lang') === 'en';
      toast(next === 'dark' ? (en ? 'Dark' : '已换成深色') : (en ? 'Light' : '已换成浅色'));
    });
  }
  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-set-lang') === 'en' ? 'en' : 'zh';
      if (htmlEl.getAttribute('data-lang') === next) return;
      click(1080);
      htmlEl.setAttribute('data-lang', next);
      try { localStorage.setItem('studio-lang', next); } catch (e) {}
      paintLang();
      toast(next === 'zh' ? '已换成中文' : 'Switched to English');
    });
  });
  paintLang();

  /* ---------------------------------------------------------------------------
     2. Scroll progress, back-to-top, side dock with scroll-spy
     ------------------------------------------------------------------------- */
  const progressBar = $('scroll-progress-bar');
  const backTopFab = $('back-top-fab');
  const sideDock = $('side-dock');
  const dockFill = $('dock-progress-fill');
  const dockLinks = Array.from(document.querySelectorAll('[data-dock]'));
  const dockTargets = dockLinks.map((a) => $(a.getAttribute('data-dock'))).filter(Boolean);

  function onScroll() {
    const st = window.scrollY || document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? Math.min(100, (st / docH) * 100) : 0;
    if (progressBar) progressBar.style.width = pct.toFixed(1) + '%';
    if (dockFill) dockFill.style.height = pct.toFixed(1) + '%';
    if (backTopFab) backTopFab.hidden = st < 520;
    if (sideDock) sideDock.classList.toggle('is-visible', st > 420);

    if (dockTargets.length) {
      let activeId = dockTargets[0].id;
      for (const sec of dockTargets) {
        if (sec.getBoundingClientRect().top <= window.innerHeight * 0.38) activeId = sec.id;
      }
      dockLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('data-dock') === activeId));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  dockLinks.forEach((a) => a.addEventListener('click', () => click(1200, 0.014)));
  if (backTopFab) {
    backTopFab.addEventListener('click', () => {
      click(980);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------------------
     3. Hero: tile decks, mini globe, parallax, magnetic buttons
     ------------------------------------------------------------------------- */
  document.querySelectorAll('.tile-deck').forEach((deck, deckIdx) => {
    const cards = Array.from(deck.querySelectorAll('.deck-card'));
    const tooltip = deck.querySelector('.deck-tooltip');
    if (cards.length < 2) return;
    let offset = 0;
    let paused = false;
    function applyOrder() {
      cards.forEach((card, idx) => {
        const pos = (idx - offset + cards.length) % cards.length;
        card.className = 'deck-card pos-' + Math.min(pos, 3);
        if (pos === 0 && tooltip && card.getAttribute('data-chip')) tooltip.textContent = card.getAttribute('data-chip');
      });
    }
    deck.addEventListener('mouseenter', () => { paused = true; });
    deck.addEventListener('mouseleave', () => { paused = false; });
    deck.addEventListener('click', () => {
      click(1320, 0.016);
      offset = (offset + 1) % cards.length;
      applyOrder();
    });
    setInterval(() => {
      if (!paused) {
        offset = (offset + 1) % cards.length;
        applyOrder();
      }
    }, 2700 + deckIdx * 650);
  });

  const globeCanvas = $('mini-globe-canvas');
  if (globeCanvas) {
    const ctx = globeCanvas.getContext('2d');
    const pts = [];
    for (let i = 1; i < 9; i++) {
      const phi = (Math.PI * i) / 9;
      for (let j = 0; j < 18; j++) {
        const theta = (2 * Math.PI * j) / 18;
        pts.push({ x: Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta), amber: j % 6 === 0 });
      }
    }
    let angle = 0;
    (function drawGlobe() {
      ctx.clearRect(0, 0, 96, 96);
      angle += 0.014;
      const cosA = Math.cos(angle), sinA = Math.sin(angle), cosT = Math.cos(0.28), sinT = Math.sin(0.28);
      const proj = pts.map((p) => {
        const rx = p.x * cosA - p.z * sinA;
        const rz = p.x * sinA + p.z * cosA;
        const ry = p.y * cosT - rz * sinT;
        const fz = p.y * sinT + rz * cosT;
        return { x: 48 + rx * 34, y: 48 + ry * 34, z: fz, amber: p.amber };
      }).sort((a, b) => a.z - b.z);
      for (const pt of proj) {
        const alpha = pt.z > 0 ? 0.35 + pt.z * 0.65 : 0.12;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.z > 0 ? 1.65 : 1, 0, Math.PI * 2);
        ctx.fillStyle = pt.amber && pt.z > 0.1 ? `rgba(252,211,77,${alpha.toFixed(2)})` : `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.fill();
      }
      requestAnimationFrame(drawGlobe);
    })();
  }

  const heroStage = $('hero-stage');
  const parallaxCards = document.querySelectorAll('[data-parallax]');
  if (heroStage && parallaxCards.length) {
    heroStage.addEventListener('mousemove', (e) => {
      const r = heroStage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      heroStage.style.setProperty('--hx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      heroStage.style.setProperty('--hy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      parallaxCards.forEach((card) => {
        if (card.matches(':hover')) return;
        const f = Number(card.getAttribute('data-parallax') || 12);
        card.style.setProperty('--px', (nx * f).toFixed(1) + 'px');
        card.style.setProperty('--py', (ny * f).toFixed(1) + 'px');
      });
    });
  }

  const productStage = $('product-stage');
  if (productStage) {
    const tabs = [...productStage.querySelectorAll('[data-product-tab]')];
    const panels = [...productStage.querySelectorAll('[data-product-panel]')];
    const bar = productStage.querySelector('.atelier-bar i');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let idx = 0;
    let timer = null;
    let paused = false;
    function showProduct(i) {
      idx = (i + tabs.length) % tabs.length;
      tabs.forEach((tab, n) => {
        const on = n === idx;
        tab.classList.toggle('is-on', on);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach((panel, n) => panel.classList.toggle('is-on', n === idx));
      if (bar && !reduce) {
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = '';
      }
    }
    tabs.forEach((tab, n) => {
      tab.addEventListener('click', () => {
        click(1040);
        showProduct(n);
      });
    });
    productStage.addEventListener('mouseenter', () => { paused = true; });
    productStage.addEventListener('mouseleave', () => { paused = false; });
    if (!reduce && tabs.length > 1) {
      timer = setInterval(() => { if (!paused) showProduct(idx + 1); }, 5400);
    }
  }

  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) * 0.16).toFixed(1)}px, ${((e.clientY - (r.top + r.height / 2)) * 0.22).toFixed(1)}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ---------------------------------------------------------------------------
     4. Card spotlight + 3D tilt
     ------------------------------------------------------------------------- */
  document.querySelectorAll('.spotlight-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
    });
  });

  const canHover = window.matchMedia('(hover: hover)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.mark-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--rx', (-ny * 4.5).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (nx * 6).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      });
    });
  }

  if (canHover) {
    document.querySelectorAll('.tilt-3d').forEach((el) => {
      el.addEventListener('mouseenter', () => { el.style.transition = 'transform 0.12s ease-out'; });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${(-ny * 5).toFixed(2)}deg) rotateY(${(nx * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------------------------
     5. Website hover preview (screenshot with 3D pop + swatch fallback)
     ------------------------------------------------------------------------- */
  const pop = $('site-preview-pop');
  const spImg = $('sp-img');
  const spFallback = $('sp-fallback');
  const spUrl = $('sp-url');
  const spCaption = $('sp-caption');
  let popTimer = null;
  let popCard = null;

  function buildFallback(name, swatches) {
    const sw = swatches.length ? swatches : ['#F6F7F9', '#E5E7EB', '#2563EB', '#0A0A0B'];
    const bg = sw[0];
    const ink = sw[sw.length - 1];
    const accent = sw[Math.min(2, sw.length - 1)];
    spFallback.style.background = `linear-gradient(160deg, ${bg} 0%, ${sw[1] || bg} 100%)`;
    spFallback.innerHTML =
      `<div class="sp-fb-bars"><i style="width:42%;background:${ink}"></i><i style="width:70%;background:${accent}"></i><i style="width:56%;background:${ink};opacity:.35"></i></div>` +
      `<div><div class="sp-fb-name" style="color:${ink}"></div><div class="sp-fb-swatches">${sw.map((c) => `<i style="background:${c}"></i>`).join('')}</div></div>`;
    spFallback.querySelector('.sp-fb-name').textContent = name;
  }

  function positionPop(card) {
    const r = card.getBoundingClientRect();
    const w = 360;
    const h = pop.offsetHeight || 290;
    let left = r.right + 14;
    if (left + w > window.innerWidth - 12) left = r.left - w - 14;
    if (left < 12) left = Math.min(window.innerWidth - w - 12, Math.max(12, r.left + (r.width - w) / 2));
    let top = r.top + 10;
    if (top + h > window.innerHeight - 12) top = window.innerHeight - h - 12;
    if (top < 70) top = 70;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }

  const warmedShots = new Set();
  let shotToken = 0;

  function warmPreview(src) {
    if (!src || warmedShots.has(src)) return;
    warmedShots.add(src);
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  }

  function warmPreviews() {
    document.querySelectorAll('[data-preview-img]').forEach((card) => {
      warmPreview(card.getAttribute('data-preview-img'));
    });
  }

  warmPreviews();

  function showPop(card) {
    if (!pop) return;
    const url = card.getAttribute('data-preview-url');
    const local = card.getAttribute('data-preview-img');
    const name = card.getAttribute('data-preview-name') || '';
    const swatches = (card.getAttribute('data-preview-swatches') || '').split(',').filter(Boolean);
    const target = local || `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=500`;
    const token = ++shotToken;

    spUrl.textContent = url.replace(/^https?:\/\//, '');
    spCaption.textContent = local ? '本地截图 · 点卡片右下 ↗ 打开原站' : '实时网页快照（首次加载可能需要几秒）';
    buildFallback(name, swatches);

    const reveal = () => {
      if (token !== shotToken) return;
      if (spImg.naturalWidth > 40) {
        spImg.classList.add('is-loaded');
        spFallback.classList.remove('sp-shimmer');
      }
    };

    spImg.onload = reveal;
    spImg.onerror = () => {
      if (token !== shotToken) return;
      spFallback.classList.remove('sp-shimmer');
    };

    if (spImg.getAttribute('src') !== target) {
      spImg.classList.remove('is-loaded');
      spFallback.classList.add('sp-shimmer');
      spImg.src = target;
    }
    if (spImg.complete && spImg.naturalWidth > 40) reveal();
    else if (spImg.decode) spImg.decode().then(reveal).catch(() => {});

    positionPop(card);
    pop.classList.add('is-on');
  }

  function hidePop() {
    clearTimeout(popTimer);
    popCard = null;
    if (pop) pop.classList.remove('is-on');
  }

  if (pop && canHover) {
    document.querySelectorAll('[data-preview-url]').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const galleryRoot = card.closest('#vault-gallery-root');
        if (galleryRoot && galleryRoot.getAttribute('data-view') === 'gallery' && card.getAttribute('data-preview-img')) return;
        popCard = card;
        clearTimeout(popTimer);
        popTimer = setTimeout(() => { if (popCard === card) showPop(card); }, 90);
      });
      card.addEventListener('mouseleave', hidePop);
    });
    window.addEventListener('scroll', hidePop, { passive: true });
  }

  /* ---------------------------------------------------------------------------
     6. Copy for AI · prompt modal · shelf copy
     ------------------------------------------------------------------------- */
  const vaultMap = window.__VAULT_MAP__ || {};
  const promptModal = $('prompt-modal');
  const promptSheet = $('prompt-sheet');
  const promptEdit = $('prompt-edit-area');
  const promptEditToggle = $('prompt-edit-toggle');
  let activePromptText = '';

  function flashBtn(btn, label) {
    if (!btn) return;
    const lblEl = btn.querySelector('.btn-label');
    if (lblEl) {
      const origText = lblEl.textContent;
      btn.classList.add('is-done');
      lblEl.textContent = label.replace(/^[✓✦]\s*/, '');
      setTimeout(() => {
        btn.classList.remove('is-done');
        lblEl.textContent = origText;
      }, 1550);
      return;
    }
    const orig = btn.innerHTML;
    btn.classList.add('is-done');
    btn.textContent = label;
    setTimeout(() => {
      btn.classList.remove('is-done');
      btn.innerHTML = orig;
    }, 1550);
  }

  document.querySelectorAll('[data-ai-copy]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = vaultMap[btn.getAttribute('data-ai-copy')];
      if (!item) return;
      click(1420, 0.02);
      await copyText(item.text);
      flashBtn(btn, '✓ 已复制');
      toast('✦ 已复制「' + item.name + '」的提示词，直接粘贴给 AI 即可');
    });
  });

  function renderPromptSheet(item) {
    promptSheet.innerHTML = '';
    item.sections.forEach((s, i) => {
      const row = document.createElement('div');
      row.className = 'ps-row';
      row.style.animationDelay = i * 40 + 'ms';
      const label = document.createElement('span');
      label.className = 'ps-label';
      label.textContent = s.label;
      const body = document.createElement('div');
      body.className = 'ps-body';
      if (s.label === '代表配色') {
        s.body.split(' / ').forEach((hex, idx) => {
          if (idx > 0) body.appendChild(document.createTextNode('  '));
          const sw = document.createElement('span');
          sw.className = 'ps-swatch';
          sw.style.background = hex;
          body.appendChild(sw);
          body.appendChild(document.createTextNode(hex));
        });
      } else {
        body.textContent = s.body;
      }
      row.appendChild(label);
      row.appendChild(body);
      promptSheet.appendChild(row);
    });
  }

  document.querySelectorAll('[data-ai-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = vaultMap[btn.getAttribute('data-ai-open')];
      if (!item || !promptModal) return;
      click(1150);
      hidePop();
      activePromptText = item.text;
      $('prompt-modal-title').textContent = item.name;
      renderPromptSheet(item);
      promptEdit.hidden = true;
      promptSheet.hidden = false;
      promptEditToggle.textContent = '✎ 改一改再复制';
      promptModal.hidden = false;
    });
  });

  if (promptEditToggle) {
    promptEditToggle.addEventListener('click', () => {
      click(1100);
      const editing = promptEdit.hidden;
      if (editing) {
        promptEdit.value = activePromptText;
        promptEdit.hidden = false;
        promptSheet.hidden = true;
        promptEditToggle.textContent = '↺ 回到分段视图';
        setTimeout(() => promptEdit.focus(), 30);
      } else {
        activePromptText = promptEdit.value;
        promptEdit.hidden = true;
        promptSheet.hidden = false;
        promptEditToggle.textContent = '✎ 改一改再复制';
      }
    });
  }

  const promptCopyBtn = $('prompt-copy-btn');
  if (promptCopyBtn) {
    promptCopyBtn.addEventListener('click', async () => {
      click(1420, 0.02);
      const text = promptEdit.hidden ? activePromptText : promptEdit.value;
      await copyText(text);
      toast('✦ 已复制纯文本提示词，直接粘贴给 AI');
      promptModal.hidden = true;
    });
  }

  const shelfIntro = {
    design: '下面是我收藏的设计参考。请先通读，然后从中挑出最适合我当前项目的 1 到 2 个，说明理由，再按它们的风格给出页面设计方案。只借鉴版式、配色和交互手感，不要照抄品牌元素。',
    learning: '下面是我收藏的学习资料。请先通读，提炼出它们共同的方法论，再结合我当前的项目给出 3 条可以直接落地的做法。',
    toolkit: '下面是我常用的 Skill、工作流和工具。请根据我当前的任务，推荐最该先用的 1 到 2 个，并说明怎么接入。',
  };

  document.querySelectorAll('[data-copy-shelf]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const shelf = btn.getAttribute('data-copy-shelf');
      const items = Object.values(vaultMap).filter((i) => i.shelf === shelf);
      if (!items.length) return;
      click(1420, 0.02);
      const lines = items.map((it, idx) => {
        let s = `${idx + 1}. ${it.name}${it.url ? '（' + it.url + '）' : ''}\n好在哪：${it.whyGood}`;
        if (it.borrow && it.borrow.length) s += `\n可借鉴：${it.borrow.join('；')}`;
        return s;
      });
      await copyText(`${shelfIntro[shelf] || ''}\n\n${lines.join('\n\n')}`);
      flashBtn(btn, `✓ 已复制 ${items.length} 条`);
      toast(`✦ 已把整组 ${items.length} 条参考复制给 AI`);
    });
  });

  /* ---------------------------------------------------------------------------
     7. Fill-in templates (human-friendly form → clean plain text)
     ------------------------------------------------------------------------- */
  const tplMap = window.__TEMPLATES_MAP__ || {};
  const tplModal = $('template-modal');
  const tplForm = $('tpl-fill-form');
  let activeTpl = null;

  document.querySelectorAll('[data-open-tpl]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tpl = tplMap[btn.getAttribute('data-open-tpl')];
      if (!tpl || !tplModal) return;
      click(1150);
      activeTpl = tpl;
      $('tpl-modal-title').textContent = tpl.title;
      $('tpl-modal-desc').textContent = tpl.desc;
      $('tpl-intro-text').textContent = tpl.aiIntro;
      tplForm.innerHTML = '';
      (tpl.fields || []).forEach((f, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'tpl-field';
        const label = document.createElement('label');
        label.textContent = f.label;
        label.setAttribute('for', 'tpl-f-' + i);
        const input = document.createElement(f.multiline ? 'textarea' : 'input');
        input.id = 'tpl-f-' + i;
        input.placeholder = f.hint || '';
        if (f.multiline) input.rows = 2;
        wrap.appendChild(label);
        wrap.appendChild(input);
        tplForm.appendChild(wrap);
      });
      tplModal.hidden = false;
      setTimeout(() => { const first = tplForm.querySelector('input,textarea'); if (first) first.focus(); }, 40);
    });
  });

  const tplCopyBtn = $('tpl-modal-copy');
  if (tplCopyBtn) {
    tplCopyBtn.addEventListener('click', async () => {
      if (!activeTpl) return;
      click(1420, 0.02);
      const parts = (activeTpl.fields || []).map((f, i) => {
        const v = ($('tpl-f-' + i).value || '').trim() || '（待补充）';
        return v.includes('\n') ? `${f.label}：\n${v}` : `${f.label}：${v}`;
      });
      await copyText(`${activeTpl.aiIntro}\n\n${parts.join('\n\n')}`);
      toast('✦ 已复制「' + activeTpl.title + '」，直接粘贴给 AI');
      tplModal.hidden = true;
    });
  }
  const tplClear = $('tpl-clear-btn');
  if (tplClear) tplClear.addEventListener('click', () => { click(900); tplForm.reset(); });

  /* ---------------------------------------------------------------------------
     8. Swatches, CLI copy, product votes
     ------------------------------------------------------------------------- */
  document.querySelectorAll('[data-copy-hex]').forEach((dot) => {
    dot.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const hex = dot.getAttribute('data-copy-hex');
      click(1420, 0.016);
      await copyText(hex);
      toast('🎨 已复制色号 ' + hex);
    });
  });

  document.querySelectorAll('.copy-cmd-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const cmd = btn.getAttribute('data-copy');
      click(1280);
      await copyText(cmd);
      const orig = btn.textContent;
      btn.textContent = '✓';
      toast('⌘ 已复制：' + cmd);
      setTimeout(() => { btn.textContent = orig; }, 1400);
    });
  });

  let wants = {};
  try { wants = JSON.parse(localStorage.getItem('orbit-wants') || '{}'); } catch (e) {}
  document.querySelectorAll('[data-want-count]').forEach((el) => { el.textContent = wants[el.getAttribute('data-want-count')] || 0; });
  document.querySelectorAll('[data-want]').forEach((btn) => {
    const initId = btn.getAttribute('data-want');
    if (wants[initId] > 0) btn.classList.add('is-voted');
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-want');
      wants[id] = (wants[id] || 0) + 1;
      try { localStorage.setItem('orbit-wants', JSON.stringify(wants)); } catch (e) {}
      document.querySelectorAll(`[data-want-count="${id}"]`).forEach((el) => { el.textContent = wants[id]; });
      document.querySelectorAll(`[data-want="${id}"]`).forEach((b) => b.classList.add('is-voted'));
      btn.classList.remove('is-bump');
      void btn.offsetWidth;
      btn.classList.add('is-bump');
      click(1500, 0.02);
      toast('⚡ ＋1 已点亮，高票构想优先推进开发');
    });
  });

  /* ---------------------------------------------------------------------------
     9. Orbit workbench console
     ------------------------------------------------------------------------- */
  const wbButtons = Array.from(document.querySelectorAll('[data-wb-id]'));
  const dossierCard = $('wb-dossier');
  const consoleArea = $('workbench-console-area');
  const tourBar = $('console-tour-bar');
  const playFab = $('stage-autoplay-btn');
  const playIcon = $('stage-play-icon');
  let wbIndex = 0;
  let autoTour = true;
  let hoverPaused = false;
  let tourProgress = 0;

  if (consoleArea) {
    consoleArea.addEventListener('mouseenter', () => { hoverPaused = true; });
    consoleArea.addEventListener('mouseleave', () => { hoverPaused = false; });
  }

  function selectWb(idx, manual) {
    if (!wbButtons[idx] || !window.__WORKBENCH_ITEMS__) return;
    if (manual) click(1180);
    wbIndex = idx;
    tourProgress = 0;
    if (tourBar) tourBar.style.width = '0%';
    const btn = wbButtons[idx];
    const item = window.__WORKBENCH_ITEMS__[btn.getAttribute('data-wb-id')];
    if (!item) return;
    wbButtons.forEach((b) => b.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    if (dossierCard) dossierCard.classList.add('is-switching');
    setTimeout(() => {
      $('wb-tier').textContent = item.tier;
      $('wb-badge').textContent = item.badge;
      $('wb-name').textContent = item.name;
      $('wb-summary').textContent = item.summary;
      $('wb-boundaries').textContent = item.boundaries;
      $('wb-skill').textContent = item.pairedSkill;
      const cb = $('wb-copy-btn');
      if (cb) cb.setAttribute('data-copy', item.pairedSkill);
      const scoresEl = $('wb-scores');
      if (scoresEl && item.scores) {
        scoresEl.innerHTML = item.scores
          .map((sc) => `<div class="score-meter"><div class="score-label-row"><span>${sc.label}</span><strong>${sc.val}%</strong></div><div class="score-track"><div class="score-fill" style="width:0%" data-w="${sc.val}"></div></div></div>`)
          .join('');
        requestAnimationFrame(() => scoresEl.querySelectorAll('[data-w]').forEach((f) => { f.style.width = f.getAttribute('data-w') + '%'; }));
      }
      $('wb-strengths').innerHTML = item.strengths.map((s) => '<li>' + s + '</li>').join('');
      const link = $('wb-article-link');
      if (link) {
        if (item.relatedSlug) {
          link.hidden = false;
          link.href = (window.__BASE_PATH__ || '') + '/read/' + item.relatedSlug;
          link.textContent = item.relatedTitle + ' →';
        } else {
          link.hidden = true;
          link.removeAttribute('href');
          link.textContent = '';
        }
      }
      if (dossierCard) dossierCard.classList.remove('is-switching');
    }, 130);
  }

  wbButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      autoTour = false;
      if (playIcon) playIcon.textContent = '▶';
      selectWb(idx, true);
    });
  });

  if (playFab && wbButtons.length) {
    playFab.addEventListener('click', () => {
      click(1050);
      autoTour = !autoTour;
      if (playIcon) playIcon.textContent = autoTour ? '❚❚' : '▶';
      toast(autoTour ? '▶ 自动巡航已开启' : '❚❚ 已锁定当前工位');
    });
    setInterval(() => {
      if (!autoTour || hoverPaused) return;
      tourProgress += 2.2;
      if (tourBar) tourBar.style.width = Math.min(100, tourProgress) + '%';
      if (tourProgress >= 100) selectWb((wbIndex + 1) % wbButtons.length, false);
    }, 100);
  }

  /* ---------------------------------------------------------------------------
     10. Reveal on scroll, count-up stats, terminal typing
     ------------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '0px 0px 140px 0px' });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 35 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  const countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && countEls.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = Number(el.getAttribute('data-count')) || 0;
        const start = performance.now();
        (function tick(now) {
          const p = Math.min(1, (now - start) / 900);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    countEls.forEach((el) => cio.observe(el));
  }

  const typeLine = $('term-type-line');
  if (typeLine) {
    const total = Object.keys(vaultMap).length;
    const msgs = [`✓ ${total} references · design / learning / toolkit`, '✓ every item ships with an AI-ready prompt', '→ next: Orbit MCP · search_vault()'];
    let mi = 0, ci = 0;
    (function typeTick() {
      const msg = msgs[mi];
      typeLine.textContent = msg.slice(0, ci) + '▍';
      ci++;
      if (ci > msg.length) {
        mi = (mi + 1) % msgs.length;
        ci = 0;
        setTimeout(typeTick, 1600);
      } else {
        setTimeout(typeTick, 38);
      }
    })();
  }

  /* ---------------------------------------------------------------------------
     11. Filters: catalog (free/pro) + vault shelves
     ------------------------------------------------------------------------- */
  const filterPills = document.querySelectorAll('[data-filter]');
  const catalogSearch = $('catalog-search');
  const articleCards = document.querySelectorAll('.card-shell[data-access]');
  const pressPills = document.querySelectorAll('[data-press]');
  const pressShelves = document.querySelectorAll('[data-press-shelf]');
  const pressEmpty = $('press-empty');
  let curFilter = 'all';
  let pressFilter = 'all';
  let curQuery = '';
  const noteSections = document.querySelectorAll('[data-note-section]');
  const noteLaneTabs = document.querySelectorAll('[data-note-lane]');
  const noteModuleTabs = document.querySelectorAll('[data-note-module]');
  const noteParams = new URLSearchParams(window.location.search);
  let noteLane = noteParams.get('lane') || 'all';
  let noteModule = noteParams.get('module') || 'all';
  if (!document.querySelector(`[data-note-lane="${noteLane}"]`)) noteLane = 'all';
  if (!document.querySelector(`[data-note-module="${noteModule}"]`)) noteModule = 'all';
  if (noteModule !== 'all') noteLane = 'company';

  function syncNoteUrl() {
    const url = new URL(window.location.href);
    if (noteLane === 'all') url.searchParams.delete('lane');
    else url.searchParams.set('lane', noteLane);
    if (noteModule === 'all') url.searchParams.delete('module');
    else url.searchParams.set('module', noteModule);
    history.replaceState(null, '', url);
  }

  function applyNotes() {
    noteSections.forEach((section) => {
      const id = section.getAttribute('data-note-section');
      const laneOn = noteLane === 'all' || noteLane === id;
      section.hidden = !laneOn;
      section.querySelectorAll('[data-note-module-block]').forEach((block) => {
        const mid = block.getAttribute('data-note-module-block');
        block.hidden = !laneOn || (noteModule !== 'all' && noteModule !== mid);
      });
      section.querySelectorAll('.card-shell[data-access]').forEach((card) => {
        const okA = curFilter === 'all' || card.getAttribute('data-access') === curFilter;
        const okQ = !curQuery || (card.getAttribute('data-search') || '').toLowerCase().includes(curQuery);
        card.style.display = okA && okQ ? '' : 'none';
      });
      section.querySelectorAll('[data-note-module-block]').forEach((block) => {
        const any = [...block.querySelectorAll('.card-shell')].some((card) => card.style.display !== 'none');
        const empty = block.querySelector('[data-note-empty]');
        if (empty) empty.hidden = any;
      });
      const any = [...section.querySelectorAll('.card-shell')].some((card) => card.style.display !== 'none');
      const empty = section.querySelector(':scope > [data-note-empty]');
      if (empty) empty.hidden = any;
    });
    markTabs(noteLaneTabs, 'data-note-lane', noteLane);
    markTabs(noteModuleTabs, 'data-note-module', noteModule);
  }

  function applyCatalog() {
    if (noteSections.length) {
      applyNotes();
      return;
    }
    articleCards.forEach((card) => {
      const okA = curFilter === 'all' || card.getAttribute('data-access') === curFilter;
      const okQ = !curQuery || (card.getAttribute('data-search') || '').toLowerCase().includes(curQuery);
      card.style.display = okA && okQ ? '' : 'none';
    });
  }
  function applyPress() {
    let shown = 0;
    pressShelves.forEach((shelf) => {
      const shelfOn = pressFilter === 'all' || shelf.getAttribute('data-press-shelf') === pressFilter;
      let shelfShown = 0;
      shelf.querySelectorAll('.book').forEach((book) => {
        const okQ = !curQuery || (book.getAttribute('data-search') || '').toLowerCase().includes(curQuery);
        const on = shelfOn && okQ;
        book.hidden = !on;
        if (on) shelfShown += 1;
      });
      shelf.hidden = shelfShown === 0;
      shown += shelfShown;
    });
    if (pressEmpty) pressEmpty.hidden = shown !== 0;
  }
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      click(1120);
      filterPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      curFilter = pill.getAttribute('data-filter');
      applyCatalog();
    });
  });
  noteLaneTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      click(980);
      noteLane = tab.getAttribute('data-note-lane') || 'all';
      if (noteLane !== 'company') noteModule = 'all';
      syncNoteUrl();
      applyNotes();
    });
  });
  noteModuleTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      click(980);
      noteModule = tab.getAttribute('data-note-module') || 'all';
      noteLane = 'company';
      syncNoteUrl();
      applyNotes();
    });
  });
  if (noteSections.length) applyNotes();
  pressPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      click(1120);
      pressPills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');
      pressFilter = pill.getAttribute('data-press');
      applyPress();
    });
  });
  const seenList = $('seen-list');
  const seenHits = seenList ? [...seenList.querySelectorAll('.seen-hit')] : [];
  const seenEmpty = $('seen-empty');
  const seenTags = $('seen-tags');
  const seenEdit = $('seen-edit');
  const seenReset = $('seen-reset');
  const seenHint = $('seen-edit-hint');
  const seenRoom = document.querySelector('.seen-room');
  const seenParams = new URLSearchParams(window.location.search);
  let seenTag = seenParams.get('tag') || 'all';
  const SEEN_KEY = 'orbit-seen-tags';
  let seenDefaults = { colors: {}, pieces: {} };
  const seenDefaultEl = $('seen-defaults');
  if (seenDefaultEl) {
    try { seenDefaults = JSON.parse(seenDefaultEl.textContent); } catch (err) { seenDefaults = { colors: {}, pieces: {} }; }
  }
  const seenColors = {};
  let seenExtra = new Set();
  let seenDropped = new Set();
  const escSeen = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tagsOf = (el) => (el.getAttribute('data-tags') || '').split(',').filter(Boolean);
  function seenColor(tag) {
    if (seenColors[tag]) return seenColors[tag];
    if (seenDefaults.colors[tag]) return seenDefaults.colors[tag];
    let hue = 0;
    for (const ch of String(tag)) hue = (hue * 33 + ch.codePointAt(0)) % 360;
    const sat = 0.62;
    const light = 0.42;
    const a = sat * Math.min(light, 1 - light);
    const f = (n) => {
      const k = (n + hue / 30) % 12;
      const c = light - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  const seenEditors = () => [...document.querySelectorAll('.post-card.seen-hit[data-slug], [data-piece][data-slug]')];
  function knownTags() {
    const pref = ['表达', '学习', 'Agent', '设计', '判断', '自媒体', '产品', '代码'];
    const set = new Set();
    const keep = (tag) => {
      if (tag && tag !== '全部' && !seenDropped.has(tag)) set.add(tag);
    };
    pref.forEach(keep);
    Object.keys(seenDefaults.colors || {}).forEach(keep);
    seenExtra.forEach(keep);
    Object.keys(seenColors).forEach(keep);
    seenEditors().forEach((el) => tagsOf(el).forEach(keep));
    const rest = [...set].filter((tag) => !pref.includes(tag)).sort((a, b) => a.localeCompare(b, 'zh'));
    return [...pref.filter((tag) => set.has(tag)), ...rest];
  }
  function refreshTagList() {
    let list = $('seen-tag-list');
    if (!list) {
      list = document.createElement('datalist');
      list.id = 'seen-tag-list';
      document.body.appendChild(list);
    }
    list.innerHTML = knownTags().map((tag) => `<option value="${escSeen(tag)}"></option>`).join('');
  }
  function paintSuggest(card) {
    const box = card.querySelector('.tag-suggest');
    if (!box) return;
    const have = new Set(tagsOf(card));
    const missing = knownTags().filter((tag) => !have.has(tag));
    box.innerHTML = missing.length
      ? `<span>加到这篇</span>${missing.map((tag) => `<button type="button" class="tag-suggest-btn" data-add-tag="${escSeen(tag)}" style="--tag:${seenColor(tag)}">${escSeen(tag)}</button>`).join('')}`
      : '';
  }
  function paintQuiet(row) {
    const foot = row.querySelector('.post-foot');
    if (!foot) return;
    foot.querySelectorAll('.post-tag').forEach((node) => node.remove());
    tagsOf(row).forEach((tag) => {
      const chip = document.createElement('span');
      chip.className = 'post-tag is-quiet';
      chip.dataset.tag = tag;
      chip.style.setProperty('--tag', seenColor(tag));
      chip.textContent = tag;
      foot.appendChild(chip);
    });
  }
  function paintCard(card) {
    const box = card.querySelector('.post-tags');
    if (!box) return;
    const form = box.querySelector('.tag-add');
    box.querySelectorAll('.post-tag').forEach((node) => node.remove());
    tagsOf(card).forEach((tag) => {
      const color = seenColor(tag);
      const chip = document.createElement('span');
      chip.className = 'post-tag';
      chip.dataset.tag = tag;
      chip.style.setProperty('--tag', color);
      chip.innerHTML = `<label class="tag-swatch"><input type="color" value="${color}" data-color-for="${escSeen(tag)}" aria-label="改${escSeen(tag)}的颜色"></label><button type="button" class="tag-name">${escSeen(tag)}</button><button type="button" class="tag-x" aria-label="从这篇拿掉${escSeen(tag)}">×</button>`;
      box.insertBefore(chip, form);
    });
    paintSuggest(card);
  }
  function seenCounts() {
    const counts = new Map();
    seenHits.forEach((el) => tagsOf(el).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
    return counts;
  }
  function renderSeenRail() {
    if (!seenTags) return;
    const counts = seenCounts();
    const tags = knownTags();
    const allOn = seenTag === 'all';
    seenTags.innerHTML = `<span class="seen-tag is-all${allOn ? ' is-active' : ''}" data-seen-tag="all" aria-selected="${allOn}"><button type="button" class="seen-tag-name">全部</button> <span class="lane-count">${seenHits.length}</span></span>${tags
      .map((tag) => {
        const color = seenColor(tag);
        const on = tag === seenTag;
        return `<span class="seen-tag${on ? ' is-active' : ''}" data-seen-tag="${escSeen(tag)}" data-tag="${escSeen(tag)}" style="--tag:${color}" aria-selected="${on}"><i class="tag-dot" aria-hidden="true"></i><button type="button" class="seen-tag-name">${escSeen(tag)}</button> <span class="lane-count">${counts.get(tag) || 0}</span><button type="button" class="tag-x" data-drop-tag="${escSeen(tag)}" aria-label="删掉标签${escSeen(tag)}">×</button></span>`;
      })
      .join('')}<form class="tag-add rail-new"><input type="text" maxlength="16" placeholder="新标签" aria-label="添加一个新标签" list="seen-tag-list" /></form>`;
  }
  function applySeenColor(tag, color) {
    seenColors[tag] = color;
    const sel = CSS.escape(tag);
    document.querySelectorAll(`[data-tag="${sel}"]`).forEach((el) => el.style.setProperty('--tag', color));
    const input = document.querySelector(`[data-color-for="${sel}"]`);
    if (input && input.value.toLowerCase() !== color.toLowerCase()) input.value = color;
  }
  function readSavedSeen() {
    try {
      const raw = JSON.parse(localStorage.getItem(SEEN_KEY) || 'null');
      if (!raw || typeof raw !== 'object') return { colors: {}, bySlug: {} };
      return { colors: raw.colors || {}, bySlug: raw.bySlug || {}, extra: raw.extra, dropped: raw.dropped };
    } catch (err) {
      return { colors: {}, bySlug: {} };
    }
  }
  function saveSeen() {
    const prev = readSavedSeen();
    const bySlug = { ...prev.bySlug };
    seenEditors().forEach((card) => {
      const slug = card.getAttribute('data-slug');
      if (!slug) return;
      const tags = tagsOf(card);
      const orig = seenDefaults.pieces[slug] || [];
      if (tags.join('\n') === orig.join('\n')) delete bySlug[slug];
      else bySlug[slug] = tags;
    });
    const colors = { ...prev.colors };
    Object.entries(seenColors).forEach(([tag, color]) => {
      if (!color || color === seenDefaults.colors[tag]) delete colors[tag];
      else colors[tag] = color;
    });
    seenDropped.forEach((tag) => delete colors[tag]);
    const extra = [...seenExtra].filter((tag) => !seenDropped.has(tag) && !seenDefaults.colors[tag]);
    const dropped = [...seenDropped];
    if (!Object.keys(bySlug).length && !Object.keys(colors).length && !extra.length && !dropped.length) localStorage.removeItem(SEEN_KEY);
    else localStorage.setItem(SEEN_KEY, JSON.stringify({ colors, bySlug, extra, dropped }));
    refreshTagList();
  }
  function loadSeen() {
    const saved = readSavedSeen();
    seenExtra = new Set(Array.isArray(saved.extra) ? saved.extra : []);
    seenDropped = new Set(Array.isArray(saved.dropped) ? saved.dropped : []);
    Object.assign(seenColors, saved.colors || {});
    Object.entries(saved.bySlug || {}).forEach(([slug, tags]) => {
      if (!Array.isArray(tags)) return;
      const clean = tags.map((tag) => String(tag).trim()).filter(Boolean).join(',');
      document.querySelectorAll(`[data-slug="${CSS.escape(slug)}"]`).forEach((el) => el.setAttribute('data-tags', clean));
    });
    seenEditors().forEach((el) => {
      if (el.querySelector('.post-tags')) paintCard(el);
    });
    document.querySelectorAll('.post-row[data-slug]').forEach((row) => paintQuiet(row));
    renderSeenRail();
    refreshTagList();
  }
  function selectSeenTag(next) {
    seenTag = next || 'all';
    const url = new URL(window.location.href);
    if (seenTag === 'all') url.searchParams.delete('tag');
    else url.searchParams.set('tag', seenTag);
    history.replaceState(null, '', url);
    applySeen();
  }
  function applySeen() {
    seenHits.forEach((el) => {
      const tags = tagsOf(el);
      const blob = `${el.getAttribute('data-search') || ''} ${tags.join(' ')}`.toLowerCase();
      const okTag = seenTag === 'all' || tags.includes(seenTag);
      const okQ = !curQuery || blob.includes(curQuery);
      el.hidden = !(okTag && okQ);
    });
    if (seenEmpty) seenEmpty.hidden = seenHits.some((el) => !el.hidden);
    document.querySelectorAll('[data-seen-tag]').forEach((tab) => {
      const on = tab.getAttribute('data-seen-tag') === seenTag;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    packSeen();
  }
  function packSeen() {
    if (!seenList) return;
    const n = window.matchMedia('(max-width: 800px)').matches ? 1 : 2;
    let cols = [...seenList.querySelectorAll(':scope > .seen-col')];
    if (cols.length !== n) {
      cols.forEach((col) => {
        while (col.firstChild) seenList.appendChild(col.firstChild);
        col.remove();
      });
      cols = [];
      for (let i = 0; i < n; i += 1) {
        const col = document.createElement('div');
        col.className = 'seen-col';
        seenList.appendChild(col);
        cols.push(col);
      }
    }
    const heights = cols.map(() => 0);
    [...seenHits].sort((a, b) => Number(a.dataset.pack) - Number(b.dataset.pack)).forEach((card) => {
      if (card.hidden) {
        cols[0].appendChild(card);
        return;
      }
      let idx = 0;
      for (let i = 1; i < n; i += 1) if (heights[i] < heights[idx]) idx = i;
      cols[idx].appendChild(card);
      heights[idx] += card.offsetHeight + 10;
    });
    seenList.classList.add('is-packed');
  }
  function cleanTag(raw) {
    return String(raw || '').trim().replace(/[,，"'<>]/g, '');
  }
  function rememberTag(tag) {
    seenDropped.delete(tag);
    if (!seenDefaults.colors[tag]) seenExtra.add(tag);
  }
  function dropTag(tag) {
    if (!tag || tag === '全部') return;
    seenDropped.add(tag);
    seenExtra.delete(tag);
    delete seenColors[tag];
    const was = seenTag === tag;
    if (was) seenTag = 'all';
    document.querySelectorAll('[data-slug]').forEach((el) => {
      const next = tagsOf(el).filter((item) => item !== tag);
      if (next.join('\n') === tagsOf(el).join('\n')) return;
      el.setAttribute('data-tags', next.join(','));
      if (el.querySelector('.post-tags')) paintCard(el);
      else if (el.classList.contains('post-row')) paintQuiet(el);
    });
    seenEditors().forEach((el) => paintSuggest(el));
    renderSeenRail();
    saveSeen();
    if (!seenList) return;
    if (was) selectSeenTag('all');
    else applySeen();
  }
  function createTag(raw) {
    const tag = cleanTag(raw);
    if (!tag || tag === '全部') return false;
    rememberTag(tag);
    renderSeenRail();
    seenEditors().forEach((card) => paintSuggest(card));
    saveSeen();
    return true;
  }
  function addTag(card, raw) {
    const tag = cleanTag(raw);
    if (!tag || tag === '全部' || tagsOf(card).includes(tag)) return false;
    rememberTag(tag);
    card.setAttribute('data-tags', [...tagsOf(card), tag].join(','));
    paintCard(card);
    renderSeenRail();
    saveSeen();
    if (seenList) applySeen();
    return true;
  }
  if (seenList) {
    seenHits.forEach((card, i) => { card.dataset.pack = String(i); });
    seenList.querySelectorAll('img.post-cover').forEach((img) => {
      if (!img.complete) img.addEventListener('load', () => packSeen(), { once: true });
    });
    let packTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(packTimer);
      packTimer = setTimeout(packSeen, 80);
    });
  }
  if (seenList || document.querySelector('[data-piece]')) {
    loadSeen();
    if (seenList && seenTag !== 'all' && !document.querySelector(`[data-seen-tag="${CSS.escape(seenTag)}"]`)) seenTag = 'all';
    if (seenTags) {
      seenTags.addEventListener('click', (e) => {
        const drop = e.target.closest('[data-drop-tag]');
        if (drop) {
          if (!seenRoom.classList.contains('is-editing')) return;
          const tag = drop.getAttribute('data-drop-tag');
          if (!window.confirm(`删掉标签「${tag}」？每一篇上的这个标签都会拿掉。`)) return;
          dropTag(tag);
          return;
        }
        if (e.target.closest('input, label, .tag-x')) return;
        const tab = e.target.closest('[data-seen-tag]');
        if (!tab) return;
        click(980);
        selectSeenTag(tab.getAttribute('data-seen-tag') || 'all');
      });
    }
    document.addEventListener('input', (e) => {
      const input = e.target.closest('.post-tag input[type="color"][data-color-for]');
      if (!input) return;
      applySeenColor(input.getAttribute('data-color-for'), input.value);
      seenEditors().forEach((card) => paintSuggest(card));
      saveSeen();
    });
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.post-card.seen-hit, [data-piece]');
      if (!card) return;
      const editing = card.closest('.seen-room.is-editing, .reader-piece.is-editing');
      const addBtn = e.target.closest('[data-add-tag]');
      if (addBtn && addBtn.closest('.tag-suggest')) {
        if (!editing) return;
        addTag(card, addBtn.getAttribute('data-add-tag'));
        return;
      }
      const remove = e.target.closest('.tag-x');
      if (remove) {
        if (!editing) return;
        const tag = remove.closest('.post-tag').dataset.tag;
        card.setAttribute('data-tags', tagsOf(card).filter((item) => item !== tag).join(','));
        if (seenList && seenTag === tag && !seenHits.some((el) => tagsOf(el).includes(tag))) seenTag = 'all';
        paintCard(card);
        renderSeenRail();
        saveSeen();
        if (seenList) applySeen();
        return;
      }
      const name = e.target.closest('.tag-name');
      if (!name || editing) return;
      const tag = name.closest('.post-tag').dataset.tag;
      if (card.hasAttribute('data-piece')) {
        window.location.href = `${window.__BASE_PATH__ || ''}/curated?tag=${encodeURIComponent(tag)}`;
        return;
      }
      click(980);
      selectSeenTag(tag);
    });
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('.tag-add');
      if (!form) return;
      e.preventDefault();
      const input = form.querySelector('input');
      const card = form.closest('.post-card.seen-hit, [data-piece]');
      if (!card) {
        if (!seenRoom || !seenRoom.classList.contains('is-editing')) return;
        createTag(input.value);
        input.value = '';
        return;
      }
      if (!card.closest('.seen-room.is-editing, .reader-piece.is-editing')) return;
      const added = addTag(card, input.value);
      input.value = '';
      if (added) {
        const again = card.querySelector('.tag-add input');
        if (again) again.focus();
      }
    });
    if (seenEdit && seenRoom) {
      seenEdit.addEventListener('click', () => {
        const on = seenRoom.classList.toggle('is-editing');
        seenEdit.textContent = on ? '完成' : '管理标签';
        if (seenReset) seenReset.hidden = !on;
        if (on) seenEditors().forEach((card) => paintSuggest(card));
        packSeen();
      });
    }
    if (seenReset && seenList) {
      seenReset.addEventListener('click', () => {
        localStorage.removeItem(SEEN_KEY);
        window.location.reload();
      });
    }
    const readerEdit = $('reader-tag-edit');
    const readerPiece = document.querySelector('[data-piece]');
    const readerReset = $('reader-tag-reset');
    if (readerEdit && readerPiece) {
      readerEdit.addEventListener('click', () => {
        const on = readerPiece.classList.toggle('is-editing');
        readerEdit.textContent = on ? '完成' : '管理这篇';
        if (readerReset) readerReset.hidden = !on;
        if (on) paintSuggest(readerPiece);
      });
    }
    if (readerReset && readerPiece) {
      readerReset.addEventListener('click', () => {
        const slug = readerPiece.getAttribute('data-slug');
        const orig = (seenDefaults.pieces[slug] || []).filter((tag) => !seenDropped.has(tag));
        readerPiece.setAttribute('data-tags', orig.join(','));
        paintCard(readerPiece);
        saveSeen();
      });
    }
    if (seenList) applySeen();
  }
  if (catalogSearch) {
    catalogSearch.addEventListener('input', (e) => {
      curQuery = e.target.value.trim().toLowerCase();
      if (seenHits.length) applySeen();
      else if (pressShelves.length) applyPress();
      else applyCatalog();
    });
  }

  if (canHover) {
    document.querySelectorAll('.book').forEach((book) => {
      book.addEventListener('mousemove', (e) => {
        const r = book.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        book.style.setProperty('--tilt-x', (ny * -8).toFixed(2) + 'deg');
        book.style.setProperty('--tilt-y', (nx * 12).toFixed(2) + 'deg');
      });
      book.addEventListener('mouseleave', () => {
        book.style.removeProperty('--tilt-x');
        book.style.removeProperty('--tilt-y');
      });
    });
  }

  const shelfTabs = document.querySelectorAll('[data-shelf-filter]');
  const shelfGroups = document.querySelectorAll('[data-shelf-group]');
  const laneTabs = document.querySelectorAll('[data-lane-filter]');
  const vaultSearch = $('vault-search');
  let activeShelf = 'all';
  let activeLane = 'all';
  let vaultQuery = '';
  let vaultFilterKey = '';
  function markTabs(tabs, attr, value) {
    tabs.forEach((tab) => {
      const on = tab.getAttribute(attr) === value;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }
  function paintMarks(root, want) {
    let shown = 0;
    let extraHit = false;
    root.querySelectorAll('.mark-card, .vault-card').forEach((card) => {
      const okQ = !vaultQuery || (card.getAttribute('data-vault-search') || '').toLowerCase().includes(vaultQuery);
      const show = want && okQ;
      card.style.display = show ? '' : 'none';
      if (show) {
        shown += 1;
        if (card.hasAttribute('data-mark-extra')) extraHit = true;
      }
    });
    const stage = root.querySelector('.mark-stage');
    if (stage) {
      const any = [...stage.querySelectorAll('.mark-card')].some((card) => card.style.display !== 'none');
      stage.hidden = !any;
    }
    return { shown, extraHit };
  }
  function syncExpand(root, wantOpen) {
    if (root.classList.contains('is-shut')) wantOpen = false;
    root.classList.toggle('is-hit', wantOpen);
    const btn = root.querySelector('[data-lane-expand]');
    if (!btn) return;
    const extraShown = [...root.querySelectorAll('[data-mark-extra]')].some((card) => card.style.display !== 'none');
    btn.hidden = !!vaultQuery && !extraShown;
    const on = root.classList.contains('is-open') || root.classList.contains('is-hit');
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  function applyVault() {
    const filterKey = activeLane + '|' + vaultQuery;
    const filterChanged = filterKey !== vaultFilterKey;
    vaultFilterKey = filterKey;
    shelfGroups.forEach((g) => { g.style.display = activeShelf === 'all' || g.getAttribute('data-shelf-group') === activeShelf ? '' : 'none'; });
    const laneOn = activeLane !== 'all';
    document.querySelectorAll('[data-design-lane]').forEach((lane) => {
      if (filterChanged) lane.classList.remove('is-shut');
      const id = lane.getAttribute('data-design-lane');
      const wantLane = !laneOn || id === activeLane;
      const { shown, extraHit } = paintMarks(lane, wantLane);
      lane.style.display = shown ? '' : 'none';
      lane.classList.toggle('is-current', laneOn && id === activeLane && shown > 0);
      syncExpand(lane, wantLane && ((laneOn && id === activeLane) || (!!vaultQuery && extraHit)));
    });
    shelfGroups.forEach((group) => {
      if (group.querySelector('[data-design-lane]')) return;
      if (filterChanged) group.classList.remove('is-shut');
      const visible = group.style.display !== 'none';
      const { extraHit } = paintMarks(group, visible);
      syncExpand(group, visible && !!vaultQuery && extraHit);
    });
    document.querySelectorAll('[data-lane-empty]').forEach((el) => {
      const scope = el.parentElement;
      const any = scope && [...scope.querySelectorAll('[data-design-lane]')].some((lane) => lane.style.display !== 'none');
      el.hidden = !!any;
    });
  }
  document.querySelectorAll('[data-lane-expand]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lane = btn.closest('[data-design-lane], .vault-group');
      if (!lane) return;
      const expanded = lane.classList.contains('is-open') || lane.classList.contains('is-hit');
      if (expanded) {
        lane.classList.remove('is-open', 'is-hit');
        lane.classList.add('is-shut');
      } else {
        lane.classList.add('is-open');
        lane.classList.remove('is-shut');
      }
      const on = lane.classList.contains('is-open') || lane.classList.contains('is-hit');
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  });
  shelfTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      click(1160);
      activeShelf = tab.getAttribute('data-shelf-filter');
      markTabs(shelfTabs, 'data-shelf-filter', activeShelf);
      applyVault();
    });
  });
  laneTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      click(980);
      activeLane = tab.getAttribute('data-lane-filter');
      if (shelfTabs.length && activeLane !== 'all') {
        activeShelf = 'design';
        markTabs(shelfTabs, 'data-shelf-filter', activeShelf);
      }
      markTabs(laneTabs, 'data-lane-filter', activeLane);
      applyVault();
    });
  });
  if (vaultSearch) vaultSearch.addEventListener('input', (e) => { vaultQuery = e.target.value.trim().toLowerCase(); applyVault(); });
  const vaultParams = new URLSearchParams(window.location.search);
  const urlShelf = vaultParams.get('shelf');
  const onCompoundSites = /\/(ecosystem|vault)$/.test(location.pathname.replace(/\/$/, ''));
  if (urlShelf === 'toolkit') {
    window.location.replace((window.__BASE_PATH__ || '') + '/kit');
  }
  if (onCompoundSites && (urlShelf === 'learning' || location.hash === '#shelf-learning')) {
    window.location.replace((window.__BASE_PATH__ || '') + '/learning');
  }
  const urlLane = vaultParams.get('lane');
  if (urlShelf && document.querySelector(`[data-shelf-filter="${urlShelf}"]`)) activeShelf = urlShelf;
  if (urlLane && document.querySelector(`[data-lane-filter="${urlLane}"]`)) activeLane = urlLane;
  if (shelfTabs.length) markTabs(shelfTabs, 'data-shelf-filter', activeShelf);
  if (laneTabs.length) markTabs(laneTabs, 'data-lane-filter', activeLane);
  if (urlShelf || urlLane) applyVault();
  const hashId = decodeURIComponent((location.hash || '').replace(/^#/, ''));
  if (hashId) {
    const hashed = document.getElementById(hashId);
    const hashedLane = hashed && hashed.closest('[data-design-lane], .vault-group');
    if (hashedLane && hashed.hasAttribute('data-mark-extra')) {
      hashedLane.classList.add('is-open');
      hashedLane.classList.remove('is-shut');
      const hashedBtn = hashedLane.querySelector('[data-lane-expand]');
      if (hashedBtn) hashedBtn.setAttribute('aria-expanded', 'true');
    }
  }

  /* ---------------------------------------------------------------------------
     12. ⌘K search
     ------------------------------------------------------------------------- */
  const searchModal = $('search-modal');
  const globalInput = $('global-search-input');
  const globalResults = $('global-search-results');
  let hitIndex = -1;
  function paintHit() {
    if (!globalResults) return;
    const hits = [...globalResults.querySelectorAll('a.search-hit')];
    hits.forEach((hit, i) => {
      const on = i === hitIndex;
      hit.classList.toggle('is-active', on);
      if (on) hit.setAttribute('aria-selected', 'true');
      else hit.removeAttribute('aria-selected');
    });
    if (hits[hitIndex]) hits[hitIndex].scrollIntoView({ block: 'nearest' });
  }
  function renderHits(q) {
    if (!globalResults || !window.__SEARCH_INDEX__) return;
    hitIndex = -1;
    const kw = (q || '').trim().toLowerCase();
    const list = window.__SEARCH_INDEX__.filter((it) => !kw || (it.title + ' ' + it.desc + ' ' + it.type).toLowerCase().includes(kw)).slice(0, 10);
    globalResults.innerHTML = '';
    if (!list.length) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = htmlEl.getAttribute('data-lang') === 'en'
        ? 'Nothing matched. Try another word.'
        : '没找到。换一个词，或者从上面五个系统进去。';
      globalResults.appendChild(empty);
      return;
    }
    list.forEach((it) => {
      const a = document.createElement('a');
      a.className = 'search-hit';
      a.href = it.href;
      a.innerHTML = '<div class="search-hit-top"><strong></strong><span></span></div><p></p>';
      a.querySelector('strong').textContent = it.title;
      a.querySelector('span').textContent = it.type;
      a.querySelector('p').textContent = it.desc;
      globalResults.appendChild(a);
    });
  }
  if (globalInput) {
    renderHits('');
    globalInput.addEventListener('input', (e) => renderHits(e.target.value));
    globalInput.addEventListener('keydown', (e) => {
      const hits = [...(globalResults ? globalResults.querySelectorAll('a.search-hit') : [])];
      if (!hits.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        hitIndex = Math.min(hits.length - 1, hitIndex + 1);
        paintHit();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        hitIndex = Math.max(0, hitIndex - 1);
        paintHit();
      } else if (e.key === 'Enter' && hits[hitIndex]) {
        e.preventDefault();
        window.location.href = hits[hitIndex].href;
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      click(1250);
      if (searchModal) {
        searchModal.hidden = !searchModal.hidden;
        if (!searchModal.hidden && globalInput) setTimeout(() => globalInput.focus(), 30);
      }
    } else if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop').forEach((m) => (m.hidden = true));
    }
  });

  /* ---------------------------------------------------------------------------
     13. Generic modals, reader controls, forms
     ------------------------------------------------------------------------- */
  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      click(1150);
      const m = $(btn.getAttribute('data-open-modal'));
      if (m) {
        m.hidden = false;
        if (m.id === 'search-modal' && globalInput) setTimeout(() => globalInput.focus(), 30);
      }
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => { const m = btn.closest('.modal-backdrop'); if (m) m.hidden = true; });
  });
  document.querySelectorAll('.modal-backdrop').forEach((bd) => {
    bd.addEventListener('click', (e) => { if (e.target === bd) bd.hidden = true; });
  });

  const readerSheet = $('reader-sheet');
  const docToc = document.querySelector('.doc-toc');
  if (docToc) {
    const pairs = [...docToc.querySelectorAll('a')]
      .map((link) => ({ link, section: document.getElementById((link.getAttribute('href') || '').slice(1)) }))
      .filter((pair) => pair.section);
    const mark = (id) => {
      pairs.forEach(({ link }) => link.classList.toggle('is-current', link.getAttribute('href') === `#${id}`));
    };
    const place = () => {
      if (!pairs.length) return;
      const line = window.innerHeight * 0.35;
      let current = pairs[0].section.id;
      pairs.forEach(({ section }) => {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      });
      mark(current);
    };
    place();
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('hashchange', place);
  }
  if (readerSheet) {
    document.querySelectorAll('[data-font]').forEach((btn) => {
      btn.addEventListener('click', () => {
        click(1050);
        readerSheet.setAttribute('data-font', btn.getAttribute('data-font'));
        document.querySelectorAll('[data-font]').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
    document.querySelectorAll('[data-size]').forEach((btn) => {
      btn.addEventListener('click', () => {
        click(1150);
        readerSheet.setAttribute('data-size', btn.getAttribute('data-size'));
        document.querySelectorAll('[data-size]').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    });
  }

  let proUnlocked = false;
  function setPro(on) {
    proUnlocked = on;
    click(1300);
    const gate = $('pro-gate-card');
    const rest = $('pro-rest-content');
    const label = $('pro-mode-state');
    if (gate && rest) { gate.hidden = on; rest.hidden = !on; }
    if (label) label.textContent = on ? 'Pro 已展开全文' : '访客试读锁';
    toast(on ? '✦ 已开启 Pro 全文预览' : '已切回访客视角');
  }
  const founderBtn = $('founder-pro-toggle');
  if (founderBtn) founderBtn.addEventListener('click', () => setPro(!proUnlocked));
  const inlinePro = $('inline-pro-preview-btn');
  if (inlinePro) inlinePro.addEventListener('click', () => setPro(true));
  const modalPro = $('simulate-pro-unlock');
  if (modalPro) modalPro.addEventListener('click', () => { setPro(true); $('pro-modal').hidden = true; });

  const labBench = $('lab-bench');
  if (labBench) {
    const toolFromHash = () => {
      const id = (location.hash || '').replace('#', '');
      const pane = document.getElementById(id);
      return pane && pane.getAttribute('data-lab-pane');
    };
    const openTool = (name) => {
      if (!labBench.querySelector(`[data-lab-pane="${name}"]`)) return;
      labBench.querySelectorAll('[data-lab-tool]').forEach((btn) => {
        const on = btn.getAttribute('data-lab-tool') === name;
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      labBench.querySelectorAll('[data-lab-pane]').forEach((pane) => {
        pane.classList.toggle('is-on', pane.getAttribute('data-lab-pane') === name);
      });
      if (name === 'grain') window.dispatchEvent(new Event('grain-show'));
    };
    labBench.querySelectorAll('[data-lab-tool]').forEach((btn) => {
      btn.addEventListener('click', () => {
        click(980);
        openTool(btn.getAttribute('data-lab-tool'));
      });
    });
    if (toolFromHash()) openTool(toolFromHash());
    window.addEventListener('hashchange', () => {
      const name = toolFromHash();
      if (name) openTool(name);
    });

    const slipFields = ['slip-goal', 'slip-done', 'slip-out', 'slip-files', 'slip-next'];
    const renderSlip = () => {
      const [goal, done, out, files, next] = slipFields.map((id) => $(id).value.trim());
      $('slip-out-view').textContent = `目标\n${goal}\n\n已验证\n${done}\n\n排除过的方向\n${out}\n\n关键文件\n${files}\n\n下一步\n${next}`;
    };
    slipFields.forEach((id) => $(id).addEventListener('input', renderSlip));
    renderSlip();
    $('slip-copy').addEventListener('click', async () => {
      click(1200);
      await copyText($('slip-out-view').textContent);
      toast('✓ 交接单已复制');
    });

    const swatchPresets = {
      paper: ['#FFFFFF', '#F6F7F9', '#0A0A0B', '#2563EB'],
      cloth: ['#F4F1EA', '#2C3358', '#1C223D', '#8E8A7E'],
      ink: ['#0E0E0E', '#EFEAEA', '#1E9E52', '#060607'],
    };
    const swatchNames = ['底', '面', '字', '强调'];
    let swatchColors = swatchPresets.paper.slice();
    const paintSwatches = () => {
      $('swatch-row').innerHTML = swatchColors
        .map((hex, i) => `<span class="swatch-chip"><i style="background:${hex}"></i>${swatchNames[i]} ${hex}</span>`)
        .join('');
      $('swatch-prompt').textContent = `请按这四色做界面。底 ${swatchColors[0]}，面 ${swatchColors[1]}，字 ${swatchColors[2]}，强调只用 ${swatchColors[3]}。`;
    };
    const pickFour = (buckets) => {
      const ranked = [...buckets.values()].filter((p) => p.n > 2).sort((a, b) => b.n - a.n);
      const chosen = [];
      const dist = (a, b) => {
        const dr = a.r - b.r;
        const dg = a.g - b.g;
        const db = a.b - b.b;
        return dr * dr + dg * dg + db * db;
      };
      for (const p of ranked) {
        const avg = { r: p.r / p.n, g: p.g / p.n, b: p.b / p.n };
        if (chosen.every((c) => dist(c, avg) > 1600)) chosen.push(avg);
        if (chosen.length === 4) break;
      }
      while (chosen.length < 4) chosen.push(chosen[chosen.length - 1] || { r: 10, g: 10, b: 11 });
      return chosen.map((c) => {
        const h = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
        return `#${h(c.r)}${h(c.g)}${h(c.b)}`.toUpperCase();
      });
    };
    $('swatch-presets').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-swatch]');
      if (!btn) return;
      click(900);
      swatchColors = swatchPresets[btn.getAttribute('data-swatch')].slice();
      paintSwatches();
    });
    $('swatch-file').addEventListener('change', () => {
      const file = $('swatch-file').files && $('swatch-file').files[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 36;
        canvas.height = 36;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 36, 36);
        const data = ctx.getImageData(0, 0, 36, 36).data;
        const buckets = new Map();
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a < 200) continue;
          const key = `${r >> 4},${g >> 4},${b >> 4}`;
          const cur = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 };
          cur.n += 1;
          cur.r += r;
          cur.g += g;
          cur.b += b;
          buckets.set(key, cur);
        }
        swatchColors = pickFour(buckets);
        paintSwatches();
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
    paintSwatches();
    $('swatch-copy').addEventListener('click', async () => {
      click(1200);
      await copyText(swatchColors.join(' ') + '\n' + $('swatch-prompt').textContent);
      toast('✓ 四色已复制');
    });

    const renderFolio = () => {
      const raw = $('folio-src').value.trim();
      let paras = raw.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
      if (paras.length < 2) {
        const bits = raw.split(/。/).map((s) => s.trim()).filter(Boolean);
        paras = [];
        for (let i = 0; i < bits.length; i += 2) paras.push(`${bits.slice(i, i + 2).join('。')}。`);
      }
      const escHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const sections = paras.map((body, i) => {
        const cut = body.split(/[。？！?]/)[0].trim();
        return { id: `folio-s-${i + 1}`, num: String(i + 1).padStart(2, '0'), title: (cut || body).slice(0, 18), body };
      });
      $('folio-toc').innerHTML = sections
        .map((s) => `<li><a href="#${s.id}">${s.num} ${escHtml(s.title)}</a></li>`)
        .join('');
      $('folio-prose').innerHTML = sections
        .map((s) => `<h4 id="${s.id}">${s.num} ${escHtml(s.title)}</h4><p>${escHtml(s.body).replace(/\n/g, '<br>')}</p>`)
        .join('');
    };
    $('folio-src').addEventListener('input', renderFolio);
    renderFolio();

    const plasticWords = ['智能驱动', '重新定义', '一站式', '底层逻辑', '深度融合', '全新升级', '致力于', '赋能', '打造', '闭环', '抓手', '极致', '全方位', '助力', '颠覆'];
    const renderPlastic = () => {
      const raw = $('plastic-src').value.trim();
      let html = raw.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      let hits = 0;
      plasticWords.forEach((word) => {
        if (!html.includes(word)) return;
        hits += html.split(word).length - 1;
        html = html.split(word).join(`<mark>${word}</mark>`);
      });
      $('plastic-read').innerHTML = html || '贴一句进来。';
      $('plastic-note').textContent = hits
        ? `点出 ${hits} 处空转。收成一句具体的事：谁，在哪个界面，完成哪一步。`
        : '这句没有碰上词表里的空话。';
    };
    $('plastic-src').addEventListener('input', renderPlastic);
    renderPlastic();

    const nightFields = ['night-done', 'night-stuck', 'night-next'];
    const renderNight = () => {
      const [done, stuck, next] = nightFields.map((id) => $(id).value.trim());
      const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      $('night-out').textContent = `夜间纸条 · ${day.replace(/-/g, '.')}\n\n做成了\n${done}\n\n卡住了\n${stuck}\n\n明天第一件\n${next}`;
    };
    nightFields.forEach((id) => $(id).addEventListener('input', renderNight));
    renderNight();
    $('night-copy').addEventListener('click', async () => {
      click(1100);
      await copyText($('night-out').textContent);
      toast('✓ 纸条已复制');
    });
  }

  const sourceFolio = document.querySelector('.source-folio');
  if (sourceFolio) {
    const links = [...sourceFolio.querySelectorAll('.source-toc a')];
    const heads = links
      .map((a) => document.getElementById((a.getAttribute('href') || '').slice(1)))
      .filter(Boolean);
    const mark = () => {
      if (!heads.length) return;
      const line = Math.min(240, window.innerHeight * 0.32);
      let current = heads[0];
      for (const head of heads) {
        if (head.getBoundingClientRect().top <= line) current = head;
      }
      links.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${current.id}`));
    };
    document.addEventListener('scroll', mark, { passive: true });
    mark();
  }

  const audioBtn = $('audio-companion-btn');
  const audioBar = $('audio-player-bar');
  const audioStop = $('audio-stop-btn');
  if (audioBtn && audioBar) audioBtn.addEventListener('click', () => (audioBar.hidden = !audioBar.hidden));
  if (audioStop && audioBar) audioStop.addEventListener('click', () => (audioBar.hidden = true));

  async function postJson(url, payload) {
    try {
      return await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (e) { return null; }
  }

  const addForm = $('add-vault-form');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      click(1400);
      const resp = await postJson('/api/vault-add', Object.fromEntries(new FormData(addForm).entries()));
      if (resp && resp.ok) {
        toast('✓ 已收录，提示词已自动生成，正在刷新…');
        setTimeout(() => window.location.reload(), 700);
      }
    });
  }

  /* ---------------------------------------------------------------------------
     14. In-article sandboxes
     ------------------------------------------------------------------------- */
  const flywheel = {
    research: [
      ['01 · 给自己查', '竞品优缺点对比表', '存进仓库，下次做新功能直接丢给 AI 当背景参考。'],
      ['02 · 原创 / 好文', '《这几款产品做对了什么》', '加上我们的判断发在总站，展示看问题的深度。'],
      ['03 · 存进百宝箱', '竞品拆解工作流', '把调研步骤固化下来，以后半小时搞定。'],
      ['04 · 复制给 AI', '整组参考一键复制', '下次做同类页面，直接把整组参考交给 AI。'],
    ],
    workflow: [
      ['01 · 给自己查', '多模型分工手册', '写清哪步用旗舰模型、哪步用便宜模型。'],
      ['02 · 实战原创', '《审稿耗时压缩 70%》', '用真实前后对比说话。'],
      ['03 · 存进百宝箱', '自动质检 Skill', '团队和 Pro 会员一键装上就能用。'],
      ['04 · 产品孵化', '独立小插件', '外部也高频需要时，包装成独立产品。'],
    ],
    ui: [
      ['01 · 给自己查', '色板与字号表', '统一所有页面的呼吸感。'],
      ['02 · 实战原创', '《去掉 AI 网页的塑料味》', '内嵌对比卡片，一眼看懂差别。'],
      ['03 · 存进百宝箱', 'skill-clean-ui', '开源给同行，持续带来口碑。'],
      ['04 · 复制给 AI', '设计参考提示词', '新页面开工前先把参考复制给 AI。'],
    ],
  };
  document.querySelectorAll('[data-scenario]').forEach((tab) => {
    tab.addEventListener('click', () => {
      click(1120);
      const rows = flywheel[tab.getAttribute('data-scenario')];
      if (!rows) return;
      document.querySelectorAll('[data-scenario]').forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const box = $('flywheel-output');
      if (!box) return;
      box.innerHTML = '';
      rows.forEach((r) => {
        const d = document.createElement('div');
        d.className = 'sandbox-card';
        d.innerHTML = '<span class="sc-step"></span><h4></h4><p></p>';
        d.querySelector('.sc-step').textContent = r[0];
        d.querySelector('h4').textContent = r[1];
        d.querySelector('p').textContent = r[2];
        box.appendChild(d);
      });
    });
  });

  document.querySelectorAll('[data-style-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      click(1160);
      const mode = btn.getAttribute('data-style-mode');
      document.querySelectorAll('[data-style-mode]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const card = $('palette-preview-card');
      if (!card) return;
      const cliche = mode === 'cliche';
      card.className = 'palette-preview ' + (cliche ? 'mode-cliche' : 'mode-editorial');
      card.querySelector('.pp-kicker').textContent = cliche ? 'OVERUSED AI TEMPLATE' : 'CLEAN PRODUCT DESIGN';
      card.querySelector('.pp-title').textContent = cliche ? '颠覆式下一代超智能全链路赋能平台' : '留白干净、重点突出，看多久都不累';
      card.querySelector('.pp-desc').textContent = cliche
        ? '满屏蓝紫发光边框加空洞口号，三秒内让人觉得「又是模板生成的」。'
        : '纯白内卡片嵌在浅灰外框里，只保留纯黑主按钮和一抹克制的蓝，低调但有质感。';
    });
  });

  document.querySelectorAll('[data-sandbox="pick"]').forEach((box) => {
    box.querySelectorAll('[data-pick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        click(1120);
        box.querySelectorAll('[data-pick]').forEach((other) => {
          const on = other === btn;
          other.classList.toggle('is-active', on);
          other.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        const id = btn.getAttribute('data-pick');
        box.querySelectorAll('[data-panel]').forEach((panel) => {
          panel.hidden = panel.getAttribute('data-panel') !== id;
        });
      });
    });
  });
})();


/* =============================================================================
   V6 · 原站图标联动 + 大胆动效
   ============================================================================= */
(function () {
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vaultMap = window.__VAULT_MAP__ || {};

  /* 1. Hero 交互点阵：鼠标附近的点会放大、变蓝，并带一圈缓慢的波纹 */
  const canvas = $('hero-dots');
  const stage = $('hero-stage');
  if (canvas && stage && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const GAP = 26;
    let w = 0, h = 0, dpr = 1, dots = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let visible = true;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = stage.clientWidth;
      h = stage.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) dots.push({ x, y });
    }
    resize();
    window.addEventListener('resize', resize);

    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    });
    stage.addEventListener('mouseleave', () => { mouse.tx = -9999; mouse.ty = -9999; });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(stage);
    }

    let t = 0;
    (function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      t += 0.016;
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const base = dark ? '255,255,255' : '15,23,42';
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.46;
      for (const d of dots) {
        const dx = d.x - mouse.x, dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const near = Math.max(0, 1 - dist / 170);
        const rd = Math.sqrt((d.x - cx) ** 2 + (d.y - cy) ** 2);
        const wave = (Math.sin(rd / 46 - t * 1.6) + 1) / 2;
        const r = 0.9 + wave * 0.5 + near * 2.1;
        ctx.beginPath();
        ctx.arc(d.x - dx * near * 0.12, d.y - dy * near * 0.12, r, 0, Math.PI * 2);
        if (near > 0.02) {
          ctx.fillStyle = `rgba(37,99,235,${(0.25 + near * 0.6).toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(${base},${(0.07 + wave * 0.07).toFixed(3)})`;
        }
        ctx.fill();
      }
    })();
  }

  /* 2. 工作台蓝色舞台：滚动时像屏幕一样从倾斜立起来 */
  const frameEl = document.querySelector('#orbit-console .cobalt-stage-frame');
  if (frameEl && !reduceMotion) {
    const onScroll = () => {
      const r = frameEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75)));
      const ease = 1 - Math.pow(1 - p, 3);
      frameEl.style.transform = `rotateX(${(16 * (1 - ease)).toFixed(2)}deg) scale(${(0.92 + 0.08 * ease).toFixed(3)})`;
      frameEl.style.opacity = (0.55 + 0.45 * ease).toFixed(3);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 3. 胶囊标签：滑动的选中底块 */
  function setupGlider(group) {
    const tabs = Array.from(group.querySelectorAll('.pill-tab'));
    if (!tabs.length) return;
    const glider = document.createElement('span');
    glider.className = 'tab-glider';
    group.prepend(glider);
    group.classList.add('has-glider');
    const move = (tab) => {
      if (!tab) return;
      glider.style.left = tab.offsetLeft + 'px';
      glider.style.top = tab.offsetTop + 'px';
      glider.style.width = tab.offsetWidth + 'px';
      glider.style.height = tab.offsetHeight + 'px';
    };
    move(group.querySelector('.pill-tab.is-active') || tabs[0]);
    tabs.forEach((tab) => tab.addEventListener('click', () => requestAnimationFrame(() => move(tab))));
    window.addEventListener('resize', () => move(group.querySelector('.pill-tab.is-active')));
    setTimeout(() => move(group.querySelector('.pill-tab.is-active')), 400);
  }
  document.querySelectorAll('.pill-tabs').forEach(setupGlider);

  /* 4. 「复制给 AI」时迸出彩色粒子 */
  const burstColors = ['#2563EB', '#10B981', '#F59E0B', '#EC4899', '#0EA5E9'];
  function burst(el) {
    if (reduceMotion || !el.animate) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 14; i++) {
      const dot = document.createElement('span');
      dot.className = 'burst-dot';
      dot.style.left = cx + 'px';
      dot.style.top = cy + 'px';
      dot.style.background = burstColors[i % burstColors.length];
      document.body.appendChild(dot);
      const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const dist = 34 + Math.random() * 34;
      dot.animate(
        [
          { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
          { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(0.2)`, opacity: 0 },
        ],
        { duration: 620 + Math.random() * 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      ).onfinish = () => dot.remove();
    }
  }
  document.querySelectorAll('[data-ai-copy], [data-copy-shelf], #prompt-copy-btn, #tpl-modal-copy').forEach((btn) => {
    btn.addEventListener('click', () => burst(btn));
  });

  /* 5. 预览弹窗与提示词弹窗显示原站图标 */
  const spFav = $('sp-fav');
  document.querySelectorAll('[data-preview-url]').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (!spFav) return;
      const icon = card.getAttribute('data-preview-icon');
      if (icon) spFav.src = icon;
      else spFav.removeAttribute('src');
    });
  });

  const promptFav = $('prompt-fav');
  document.querySelectorAll('[data-ai-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = vaultMap[btn.getAttribute('data-ai-open')];
      if (!promptFav) return;
      const tile = promptFav.parentElement;
      if (item && item.icon) {
        promptFav.src = item.icon;
        tile.classList.remove('is-empty');
      } else {
        tile.classList.add('is-empty');
      }
    });
  });
  if (promptFav) promptFav.addEventListener('error', () => promptFav.parentElement.classList.add('is-empty'));

  /* 6b. Parts that came out of the vault: thinking button + agent status */
  const STATUS_COPY = {
    plan: { zh: '先看哪一块零件能用。', en: 'See which part fits first.' },
    run: { zh: '正在用这一块，先别换。', en: 'This part is in use. Stay with it.' },
    ask: { zh: '这一步要你点头，才继续。', en: 'This step waits for you.' },
  };
  document.querySelectorAll('[data-agent-status]').forEach((group) => {
    const line = group.parentElement.querySelector('[data-status-line]');
    group.querySelectorAll('[data-status]').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('[data-status]').forEach((b) => b.classList.remove('is-on'));
        btn.classList.add('is-on');
        const copy = STATUS_COPY[btn.getAttribute('data-status')];
        if (!line || !copy) return;
        const zh = line.querySelector('[data-line-zh]');
        const en = line.querySelector('[data-line-en]');
        if (zh) zh.textContent = copy.zh;
        if (en) en.textContent = copy.en;
      });
    });
  });
  document.querySelectorAll('[data-think-demo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-thinking')) return;
      const labels = btn.querySelectorAll('[data-think-label]');
      const write = (key) => {
        labels.forEach((el) => {
          const which = el.classList.contains('i18n-en') ? 'en' : 'zh';
          el.textContent = btn.getAttribute(`data-${key}-${which}`) || '';
        });
      };
      btn.classList.add('is-thinking');
      write('busy');
      setTimeout(() => {
        btn.classList.remove('is-thinking');
        write('done');
        setTimeout(() => write('idle'), 900);
      }, 1400);
    });
  });

  /* 6. 双读卡片的光标微光 */
  document.querySelectorAll('.dual-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
    });
  });
})();

/* Bench tool: grains that part around the pointer and gather home again. */
(function () {
  const root = document.querySelector('.grain-stage');
  const canvas = document.getElementById('grain-stage');
  if (!root || !canvas) return;
  const word = root.getAttribute('data-word') || '散开再聚';
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gap = 3.6;
  const reach = 86;
  const pad = 42;
  let grains = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let pointer = null;
  let raf = 0;
  let arrived = false;

  function ink() {
    return getComputedStyle(root).color || '#111';
  }

  function fontSpec() {
    const size = parseFloat(getComputedStyle(root).fontSize) || 96;
    const font = `800 ${size}px "PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", "WenQuanYi Micro Hei", "Droid Sans Fallback", sans-serif`;
    return { size, font };
  }

  function layout() {
    const { size, font } = fontSpec();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = font;
    width = Math.ceil(measure.measureText(word).width + size * 0.08);
    height = Math.ceil(size * 1.08);
    canvas.width = Math.ceil((width + pad * 2) * dpr);
    canvas.height = Math.ceil((height + pad * 2) * dpr);
    canvas.style.width = `${width + pad * 2}px`;
    canvas.style.height = `${height + pad * 2}px`;
    const sample = document.createElement('canvas');
    sample.width = width;
    sample.height = height;
    const pen = sample.getContext('2d');
    pen.font = font;
    pen.fillStyle = '#000';
    pen.textBaseline = 'alphabetic';
    pen.fillText(word, 4, Math.round(size * 0.86));
    const pixels = pen.getImageData(0, 0, width, height).data;
    const next = [];
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) {
        if (pixels[((y | 0) * width + (x | 0)) * 4 + 3] < 150) continue;
        const angle = Math.random() * Math.PI * 2;
        const dist = 22 + Math.random() * 48;
        const sx = x + Math.cos(angle) * dist;
        const sy = y - 18 + Math.sin(angle) * dist * 0.55;
        next.push({
          hx: x,
          hy: y,
          sx,
          sy,
          x: arrived || reduce ? x : sx,
          y: arrived || reduce ? y : sy,
          vx: 0,
          vy: 0,
          wait: (x / Math.max(width, 1)) * 380 + Math.random() * 140,
        });
      }
    }
    grains = next;
    if (grains.length) root.classList.add('is-live');
    wake(performance.now());
  }

  function wake(now) {
    if (raf) return;
    raf = requestAnimationFrame(draw);
    if (!canvas.dataset.born) canvas.dataset.born = String(now || performance.now());
  }

  function draw(now) {
    raf = 0;
    const born = Number(canvas.dataset.born) || now;
    const elapsed = now - born;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width + pad * 2, height + pad * 2);
    ctx.translate(pad, pad);
    ctx.fillStyle = ink();
    let moving = false;
    for (const grain of grains) {
      const intro = reduce || arrived ? 1 : Math.min(1, Math.max(0, (elapsed - grain.wait) / 820));
      if (intro < 1) {
        moving = true;
        const ease = 1 - (1 - intro) ** 3;
        grain.x = grain.sx + (grain.hx - grain.sx) * ease;
        grain.y = grain.sy + (grain.hy - grain.sy) * ease;
      } else {
        let pushX = 0;
        let pushY = 0;
        if (pointer && !reduce) {
          const dx = grain.x - pointer.x;
          const dy = grain.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < reach && dist > 0.4) {
            const force = (1 - dist / reach) * 3.4;
            pushX = (dx / dist) * force;
            pushY = (dy / dist) * force;
          }
        }
        grain.vx = (grain.vx + pushX + (grain.hx - grain.x) * 0.09) * 0.78;
        grain.vy = (grain.vy + pushY + (grain.hy - grain.y) * 0.09) * 0.78;
        grain.x += grain.vx;
        grain.y += grain.vy;
        if (Math.abs(grain.vx) + Math.abs(grain.vy) > 0.04 || Math.abs(grain.hx - grain.x) + Math.abs(grain.hy - grain.y) > 0.12) {
          moving = true;
        } else {
          grain.x = grain.hx;
          grain.y = grain.hy;
          grain.vx = 0;
          grain.vy = 0;
        }
      }
      ctx.beginPath();
      ctx.arc(grain.x, grain.y, 1.25, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!arrived && elapsed > 1400) arrived = true;
    if (moving || pointer) wake();
  }

  function localPoint(event) {
    const box = canvas.getBoundingClientRect();
    const scaleX = (width + pad * 2) / box.width;
    const scaleY = (height + pad * 2) / box.height;
    return {
      x: (event.clientX - box.left) * scaleX - pad,
      y: (event.clientY - box.top) * scaleY - pad,
    };
  }

  const onMove = (event) => {
    pointer = localPoint(event);
    wake();
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('mousemove', onMove);
  const onLeave = () => {
    pointer = null;
    wake();
  };
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('mouseleave', onLeave);
  canvas.addEventListener('pointerdown', (event) => {
    if (reduce) return;
    const point = localPoint(event);
    for (const grain of grains) {
      const dx = grain.x - point.x;
      const dy = grain.y - point.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist > reach * 1.5) continue;
      const kick = (1 - dist / (reach * 1.5)) * (8 + Math.random() * 7);
      grain.vx += (dx / dist) * kick;
      grain.vy += (dy / dist) * kick - 1.5;
    }
    wake();
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      arrived = true;
      layout();
    }, 160);
  });

  window.addEventListener('grain-show', () => {
    arrived = true;
    layout();
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  else layout();
})();

/* =============================================================================
   V8 · KINETIC MICRO-CONTROLS, VAULT COMPOSER & FRAMESCRIPT VIDEO STUDIO
   ============================================================================= */
(function () {
  const $ = (id) => document.getElementById(id);
  const vaultMap = window.__VAULT_MAP__ || {};

  async function copyPlain(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
    }
  }

  function showToast(msg) {
    const t = $('orbit-toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    setTimeout(() => { t.hidden = true; }, 2400);
  }

  /* 1. Homepage: 4-State Vector Icon Morpher + 3-Mode Harmonic Orb */
  const morphBtn = $('morph-demo-btn');
  const morphName = $('morph-demo-name');
  const MORPH_STATES = ['01 · Menu 菜单', '02 · Close 关闭', '03 · Run 运行', '04 · Verified 通过'];
  if (morphBtn) {
    morphBtn.addEventListener('click', () => {
      const next = ((Number(morphBtn.getAttribute('data-state')) || 0) + 1) % 4;
      morphBtn.setAttribute('data-state', String(next));
      if (morphName) morphName.textContent = MORPH_STATES[next];
    });
  }

  const orbBtn = $('orb-mode-btn');
  const orbLabel = $('orb-mode-label');
  const ORB_MODES = ['Breathing · 待命呼吸', 'Searching · 深度检索', 'Synthesizing · 高速合成'];
  if (orbBtn) {
    orbBtn.addEventListener('click', () => {
      const next = ((Number(orbBtn.getAttribute('data-orb-mode')) || 0) + 1) % 3;
      orbBtn.setAttribute('data-orb-mode', String(next));
      if (orbLabel) orbLabel.textContent = ORB_MODES[next];
    });
  }

  const statusDot = $('agent-status-dot');
  document.querySelectorAll('[data-agent-status] [data-status]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (statusDot) statusDot.setAttribute('data-mode', btn.getAttribute('data-status') || 'plan');
    });
  });

  /* 2. Vault Page: Gallery ⇄ Compact View Switcher & Multi-Select AI Composer */
  const vaultRoot = $('vault-gallery-root');
  document.querySelectorAll('[data-vault-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-vault-view') || 'gallery';
      document.querySelectorAll('[data-vault-view]').forEach((b) => b.classList.toggle('is-on', b === btn));
      if (vaultRoot) vaultRoot.setAttribute('data-view', view);
    });
  });

  const pickedIds = new Set();
  const tray = $('vault-composer-tray');
  const ctCount = $('ct-count');
  const ctChips = $('ct-chips');
  const ctScene = $('ct-scene-select');
  const ctCopyBtn = $('ct-copy-combo-btn');
  const ctClearBtn = $('ct-clear-btn');
  const presetComboBtn = $('preset-combo-btn');

  function syncComposerUI() {
    document.querySelectorAll('[data-vault-pick]').forEach((btn) => {
      const id = btn.getAttribute('data-vault-pick');
      const on = pickedIds.has(id);
      btn.classList.toggle('is-done', on);
      const lbl = btn.querySelector('.vp-label');
      if (lbl) lbl.textContent = on ? '已选' : '组合';
      const card = btn.closest('.vault-card');
      if (card) card.classList.toggle('is-picked-card', on);
    });
    if (!tray) return;
    if (pickedIds.size === 0) {
      tray.hidden = true;
      return;
    }
    tray.hidden = false;
    if (ctCount) ctCount.textContent = String(pickedIds.size);
    if (ctChips) {
      ctChips.innerHTML = '';
      pickedIds.forEach((id) => {
        const item = vaultMap[id];
        if (!item) return;
        const chip = document.createElement('span');
        chip.className = 'ct-chip';
        chip.innerHTML = `<strong>${item.name}</strong><button type="button" aria-label="移除">×</button>`;
        chip.querySelector('button').addEventListener('click', () => {
          pickedIds.delete(id);
          syncComposerUI();
        });
        ctChips.appendChild(chip);
      });
    }
  }

  document.querySelectorAll('[data-vault-pick]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-vault-pick');
      if (!id) return;
      if (pickedIds.has(id)) pickedIds.delete(id);
      else pickedIds.add(id);
      syncComposerUI();
    });
  });

  if (presetComboBtn) {
    presetComboBtn.addEventListener('click', () => {
      ['v-agentic-ui', 'v-skimbly', 'v-motion-primitives'].forEach((id) => {
        if (vaultMap[id]) pickedIds.add(id);
      });
      syncComposerUI();
      showToast('✦ 已载入三个网站（Agentic UI + 版式 + 动效），看屏幕底部拼装台');
    });
  }

  if (ctClearBtn) {
    ctClearBtn.addEventListener('click', () => {
      pickedIds.clear();
      syncComposerUI();
    });
  }

  if (ctCopyBtn) {
    ctCopyBtn.addEventListener('click', async () => {
      const list = [...pickedIds].map((id) => vaultMap[id]).filter(Boolean);
      if (!list.length) return;
      const scene = ctScene ? ctScene.value : '新做高质感 Web 界面';
      const blocks = list.map((it, idx) => {
        const lines = [`参考 ${idx + 1}：${it.name}${it.url ? '（' + it.url + '）' : ''}`, `核心亮点：${it.whyGood}`];
        if (it.borrow && it.borrow.length) lines.push(`重点借鉴：${it.borrow.join('；')}`);
        return lines.join('\n');
      });
      const masterPrompt = [
        `任务目标：我要${scene}。请综合下面我为你挑选的 ${list.length} 份百宝箱参考进行设计与实现。`,
        blocks.join('\n\n'),
        '执行要求：\n1. 把各份参考的长处融合进同一套协调的视觉语言里，绝不要拼凑生硬或使用廉价蓝紫发光渐变。\n2. 动手写代码前，先用 4 条要点告诉我你打算分别从每份参考里吸收什么，等我确认后再实现。',
      ].join('\n\n');
      await copyPlain(masterPrompt);
      ctCopyBtn.classList.add('is-done');
      const lbl = ctCopyBtn.querySelector('.btn-label');
      if (lbl) lbl.textContent = '已合并复制';
      showToast(`✦ 已将 ${list.length} 份参考合并成超级提示词，直接粘贴给 AI！`);
      setTimeout(() => {
        ctCopyBtn.classList.remove('is-done');
        if (lbl) lbl.textContent = '合并复制给 AI';
      }, 1700);
    });
  }

  /* 3. Product Lab: FrameScript Interactive Code-to-Video Studio Monitor */
  const fsMonitor = $('fs-monitor');
  const fsCodeView = $('fs-code-view');
  const fsPlayBtn = $('fs-play-toggle');
  const fsPlayhead = $('fs-playhead');
  const fsTimecode = $('fs-timecode');

  const FS_SCENES = {
    hook: `<Sequence from={0} durationInFrames={90} spring="snappy">\n  <KineticHeadline accent="#3B82F6" beatSync />\n  <CaptionTrack voice="zh-studio" text="改一行文案，整支 60fps 成片即刻重渲" />\n</Sequence>`,
    ui: `<Sequence from={90} durationInFrames={120} camera="push-in-1.18x">\n  <MountComponent src="@/components/VaultCard" theme="light" />\n  <CursorChoreography target="[data-ai-copy]" clickAtFrame={138} />\n</Sequence>`,
    chart: `<Sequence from={210} durationInFrames={90} easing="spring(180, 22)">\n  <BenchmarkBars data={[34, 52, 92]} highlightIndex={2} />\n  <EndCard metric="8.5x 提速" export={["16:9_4K.mp4", "9:16_Reel.mp4"]} />\n</Sequence>`,
  };
  const SCENE_ORDER = ['hook', 'ui', 'chart'];

  function setFsScene(sceneKey) {
    if (!fsMonitor) return;
    fsMonitor.setAttribute('data-scene', sceneKey);
    document.querySelectorAll('[data-fs-scene]').forEach((b) => b.classList.toggle('is-on', b.getAttribute('data-fs-scene') === sceneKey));
    document.querySelectorAll('[data-fs-panel]').forEach((p) => p.classList.toggle('is-on', p.getAttribute('data-fs-panel') === sceneKey));
    if (fsCodeView && FS_SCENES[sceneKey]) fsCodeView.textContent = FS_SCENES[sceneKey];
  }

  document.querySelectorAll('[data-fs-scene]').forEach((btn) => {
    btn.addEventListener('click', () => {
      fsPlaying = false;
      if (fsPlayBtn) fsPlayBtn.textContent = '▶';
      const sc = btn.getAttribute('data-fs-scene') || 'hook';
      const idx = SCENE_ORDER.indexOf(sc);
      if (idx >= 0) fsFrame = idx * 180;
      setFsScene(sc);
    });
  });

  document.querySelectorAll('[data-fs-ratio]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ratio = btn.getAttribute('data-fs-ratio') || '16:9';
      document.querySelectorAll('[data-fs-ratio]').forEach((b) => b.classList.toggle('is-on', b === btn));
      if (fsMonitor) fsMonitor.setAttribute('data-ratio', ratio);
    });
  });

  let fsPlaying = true;
  let fsFrame = 0;
  const TOTAL_FRAMES = 540; // 9 seconds @ 60fps
  if (fsPlayBtn) {
    fsPlayBtn.addEventListener('click', () => {
      fsPlaying = !fsPlaying;
      fsPlayBtn.textContent = fsPlaying ? '❚❚' : '▶';
    });
  }

  if (fsMonitor && fsPlayhead && fsTimecode) {
    let lastTs = performance.now();
    (function tickFs(now) {
      requestAnimationFrame(tickFs);
      if (fsPlaying && now - lastTs >= 16) {
        fsFrame = (fsFrame + 1) % TOTAL_FRAMES;
        lastTs = now;
        const pct = (fsFrame / TOTAL_FRAMES) * 100;
        fsPlayhead.style.left = pct.toFixed(2) + '%';
        const sec = Math.floor(fsFrame / 60);
        const frm = fsFrame % 60;
        fsTimecode.textContent = `00:0${sec}:${String(frm).padStart(2, '0')}`;
        const targetScene = SCENE_ORDER[Math.floor(fsFrame / 180)] || 'hook';
        if (fsMonitor.getAttribute('data-scene') !== targetScene) setFsScene(targetScene);
      }
    })(performance.now());
  }
})();


/* =============================================================================
   V9 · AMMUNITION DEPOT, EXCALIDRAW GENERATOR, TELEPROMPTER & SHARE CARD STUDIO
   ============================================================================= */
(function () {
  const $ = (id) => document.getElementById(id);
  const depotData = window.__DEPOT_DATA__ || { contexts: {}, skills: {}, signals: [], creator: {} };

  async function copyPlain(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
    }
  }

  function toast(msg) {
    const t = $('orbit-toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    setTimeout(() => { t.hidden = true; }, 2500);
  }

  function flashDone(btn, doneLabel, origLabel) {
    btn.classList.add('is-done');
    const lbl = btn.querySelector('.btn-label');
    if (lbl && doneLabel) lbl.textContent = doneLabel;
    setTimeout(() => {
      btn.classList.remove('is-done');
      if (lbl && origLabel) lbl.textContent = origLabel;
    }, 1600);
  }

  /* -------------------------------------------------------------------------
     1. Role-Specific Context Endpoints & Runnable SKILL.md Copy
     ----------------------------------------------------------------------- */
  document.querySelectorAll('[data-copy-context]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const key = btn.getAttribute('data-copy-context');
      const txt = depotData.contexts && depotData.contexts[key];
      if (!txt) return;
      const orig = btn.querySelector('.btn-label')?.textContent || '复制给 AI';
      await copyPlain(txt);
      flashDone(btn, '已整包复制', orig);
      toast(`✦ 已复制 ${key}.txt 完整上下文包，可直接粘贴喂给 AI`);
    });
  });

  document.querySelectorAll('[data-copy-url]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const rel = btn.getAttribute('data-copy-url') || '';
      const fullUrl = new URL(rel, window.location.origin).href;
      await copyPlain(fullUrl);
      toast(`✓ 已复制接口地址：${fullUrl}`);
    });
  });

  document.querySelectorAll('[data-copy-skill]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const slug = btn.getAttribute('data-copy-skill');
      const sk = depotData.skills && depotData.skills[slug];
      if (!sk) return;
      const orig = btn.querySelector('.btn-label')?.textContent || '复制指令给 AI';
      await copyPlain(sk.plainPrompt);
      flashDone(btn, '已复制指令', orig);
      toast(`✦ 已复制「${sk.name}」完整可执行指令`);
    });
  });

  /* -------------------------------------------------------------------------
     2. Future Self Depot (/originals): Tabs, Signals, Radar, Diff Slider, Blueprint
     ----------------------------------------------------------------------- */
  const depotTabs = document.querySelectorAll('[data-depot-tab]');
  const depotPanels = document.querySelectorAll('[data-depot-panel]');
  function setDepotTab(tabId, syncUrl = false) {
    depotTabs.forEach((btn) => btn.classList.toggle('is-active', btn.getAttribute('data-depot-tab') === tabId));
    depotPanels.forEach((sec) => {
      sec.hidden = tabId !== 'all' && sec.getAttribute('data-depot-panel') !== tabId;
    });
    if (syncUrl) {
      const u = new URL(window.location.href);
      if (tabId === 'all') u.searchParams.delete('tab');
      else u.searchParams.set('tab', tabId);
      history.replaceState(null, '', u);
    }
  }
  if (depotTabs.length) {
    const initTab = new URLSearchParams(window.location.search).get('tab') || 'all';
    if (document.querySelector(`[data-depot-tab="${initTab}"]`)) setDepotTab(initTab, false);
    depotTabs.forEach((btn) => {
      btn.addEventListener('click', () => setDepotTab(btn.getAttribute('data-depot-tab') || 'all', true));
    });
  }

  // Quick Signal Capture + Signal Multi-Select Composer
  const signalsMap = new Map((depotData.signals || []).map((s) => [s.id, s]));
  const pickedSignals = new Set();
  const sigTray = $('signal-composer-tray');
  const sigTrayCount = $('sig-tray-count');

  function syncSigTray() {
    if (!sigTray) return;
    sigTray.hidden = pickedSignals.size === 0;
    if (sigTrayCount) sigTrayCount.textContent = String(pickedSignals.size);
  }

  function bindSignalCheckboxes(scope = document) {
    scope.querySelectorAll('[data-sig-check]').forEach((cb) => {
      if (cb.dataset.bound) return;
      cb.dataset.bound = '1';
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-sig-check');
        if (cb.checked) pickedSignals.add(id);
        else pickedSignals.delete(id);
        syncSigTray();
      });
    });
  }
  bindSignalCheckboxes();

  const toggleQuickSigBtn = $('toggle-quick-signal-btn');
  const quickSigForm = $('quick-signal-form');
  const signalsList = $('signals-list');
  if (toggleQuickSigBtn && quickSigForm) {
    toggleQuickSigBtn.addEventListener('click', () => {
      quickSigForm.hidden = !quickSigForm.hidden;
      if (!quickSigForm.hidden) $('qs-title')?.focus();
    });
    quickSigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const kind = $('qs-kind')?.value || '当时判断';
      const title = ($('qs-title')?.value || '').trim();
      const body = ($('qs-body')?.value || '').trim();
      const rawTags = ($('qs-tags')?.value || '').trim();
      if (!title || !body || !signalsList) return;
      const tags = rawTags.split(/\s+/).filter(Boolean).map((t) => (t.startsWith('#') ? t : `#${t}`));
      const id = 'sig-local-' + Date.now();
      const today = new Date().toISOString().slice(0, 10);
      const record = { id, date: today, kind, title, body, tags };
      signalsMap.set(id, record);

      const card = document.createElement('article');
      card.className = 'signal-card spotlight-card';
      card.innerHTML = `
        <div class="sig-meta">
          <time>${today}</time>
          <span class="sig-kind tone-mint">${kind}</span>
          <label class="sig-pick-wrap"><input type="checkbox" data-sig-check="${id}" /><span>勾选串稿</span></label>
        </div>
        <h3></h3>
        <p class="sig-body"></p>
        <div class="sig-foot">
          <div class="sig-tags"></div>
          <div class="sig-actions">
            <button type="button" class="soft-pill-btn sm" data-open-share-card><span>生成分享卡</span></button>
          </div>
        </div>
      `;
      card.querySelector('h3').textContent = title;
      card.querySelector('.sig-body').textContent = body;
      const tagsWrap = card.querySelector('.sig-tags');
      tags.forEach((tg) => {
        const sp = document.createElement('span');
        sp.textContent = tg;
        tagsWrap.appendChild(sp);
      });
      const shareBtn = card.querySelector('[data-open-share-card]');
      shareBtn.setAttribute('data-share-kicker', `${today} · ${kind}`);
      shareBtn.setAttribute('data-share-title', title);
      shareBtn.setAttribute('data-share-body', body);
      shareBtn.setAttribute('data-share-tags', tags.join(' '));
      signalsList.prepend(card);
      bindSignalCheckboxes(card);
      bindShareCardTriggers(card);
      quickSigForm.reset();
      quickSigForm.hidden = true;
      toast('✓ 新闪念卡片已生成！可勾选串成初稿或导出分享图');
    });
  }

  $('sig-tray-clear')?.addEventListener('click', () => {
    pickedSignals.clear();
    document.querySelectorAll('[data-sig-check]').forEach((cb) => { cb.checked = false; });
    syncSigTray();
  });

  $('sig-copy-draft')?.addEventListener('click', async () => {
    const list = [...pickedSignals].map((id) => signalsMap.get(id)).filter(Boolean);
    if (!list.length) return;
    const dnaPrompt = depotData.creator?.voiceDna?.systemPrompt || '';
    const notesBlock = list.map((s, i) => `闪念 ${i + 1}（${s.kind}）：${s.title}\n展开：${s.body}`).join('\n\n');
    const prompt = [
      `任务：请把我平时攒下的这 ${list.length} 条真实思考切片串起来，帮我产出一套「Excalidraw 三格白板结构 + 90 秒自然口播逐字稿 + 小红书发布文案」。`,
      notesBlock,
      dnaPrompt,
    ].filter(Boolean).join('\n\n');
    await copyPlain(prompt);
    toast(`✦ 已将 ${list.length} 条闪念连同你的文风 DNA 合并复制，直接粘贴给 AI！`);
  });

  $('sig-send-creator')?.addEventListener('click', () => {
    const list = [...pickedSignals].map((id) => signalsMap.get(id)).filter(Boolean);
    if (!list.length) return;
    try {
      sessionStorage.setItem('orbit-pending-signals', JSON.stringify(list));
    } catch (e) {}
  });

  // Radar Filter
  const radarBtns = document.querySelectorAll('[data-radar-filter]');
  radarBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const ring = btn.getAttribute('data-radar-filter') || 'all';
      radarBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      document.querySelectorAll('[data-radar-ring]').forEach((card) => {
        card.style.display = ring === 'all' || card.getAttribute('data-radar-ring') === ring ? '' : 'none';
      });
    });
  });

  // Teardown Draggable Split Slider
  document.querySelectorAll('[data-teardown-card]').forEach((card) => {
    const stage = card.querySelector('.td-slider-stage');
    const range = card.querySelector('.tds-range');
    if (stage && range) {
      range.addEventListener('input', () => {
        stage.style.setProperty('--split', `${range.value}%`);
      });
    }
  });

  // Blueprint Persistent Checklist
  const bpChecks = document.querySelectorAll('[data-bp-check]');
  const bpProgress = $('bp-check-progress');
  function syncBpProgress() {
    if (!bpChecks.length) return;
    let done = 0;
    const state = {};
    bpChecks.forEach((cb) => {
      if (cb.checked) done += 1;
      state[cb.getAttribute('data-bp-check')] = cb.checked;
    });
    if (bpProgress) bpProgress.textContent = `${done} / ${bpChecks.length} 已核对`;
    try { localStorage.setItem('orbit-bp-checks', JSON.stringify(state)); } catch (e) {}
  }
  if (bpChecks.length) {
    try {
      const saved = JSON.parse(localStorage.getItem('orbit-bp-checks') || '{}');
      bpChecks.forEach((cb) => {
        const k = cb.getAttribute('data-bp-check');
        if (saved[k]) cb.checked = true;
        cb.addEventListener('change', syncBpProgress);
      });
      syncBpProgress();
    } catch (e) {}
    $('bp-reset-btn')?.addEventListener('click', () => {
      bpChecks.forEach((cb) => { cb.checked = false; });
      syncBpProgress();
      toast('↺ 自检清单已重置');
    });
  }

  /* -------------------------------------------------------------------------
     3. Canvas Visual Card Renderer (Used by both Step 3 Xiaohongshu & Global Modal)
     ----------------------------------------------------------------------- */
  const CARD_THEMES = {
    paper: {
      bg: '#fcfaf5',
      grid: '#e2dcd0',
      cardBg: '#ffffff',
      border: '#1e293b',
      kickerBg: '#fff3bf',
      kickerFg: '#92400e',
      ink: '#0f172a',
      sub: '#334155',
      accent: '#2563eb',
      tagFg: '#1d4ed8',
    },
    obsidian: {
      bg: '#0c0e14',
      grid: '#1e2433',
      cardBg: '#141822',
      border: '#d97706',
      kickerBg: 'rgba(245, 158, 11, 0.18)',
      kickerFg: '#fbbf24',
      ink: '#f8fafc',
      sub: '#cbd5e1',
      accent: '#f59e0b',
      tagFg: '#fbbf24',
    },
    cobalt: {
      bg: '#0f296b',
      grid: '#1d3f91',
      cardBg: '#153482',
      border: '#60a5fa',
      kickerBg: 'rgba(96, 165, 250, 0.24)',
      kickerFg: '#dbeafe',
      ink: '#ffffff',
      sub: '#dbeafe',
      accent: '#38bdf8',
      tagFg: '#93c5fd',
    },
  };

  function wrapCanvasText(ctx, text, maxWidth) {
    const paragraphs = String(text || '').split(/\n+/);
    const lines = [];
    for (const para of paragraphs) {
      let line = '';
      for (const ch of para) {
        const test = line + ch;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = ch;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
    }
    return lines;
  }

  function drawShareCanvas(canvas, opts) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const ratio = opts.ratio || '3:4';
    const W = ratio === '16:9' ? 1280 : 900;
    const H = ratio === '16:9' ? 720 : 1200;
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    const pal = CARD_THEMES[opts.theme] || CARD_THEMES.paper;

    // Background + subtle dot grid
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = pal.grid;
    for (let y = 28; y < H; y += 28) {
      for (let x = 28; x < W; x += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Inner Frame
    const pad = ratio === '16:9' ? 54 : 56;
    const cardW = W - pad * 2;
    const cardH = H - pad * 2;
    ctx.fillStyle = pal.cardBg;
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(pad, pad, cardW, cardH, 28);
    ctx.fill();
    ctx.stroke();

    // Hard offset shadow accent for paper style
    if (opts.theme === 'paper') {
      ctx.fillStyle = '#1e293b';
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.roundRect(pad + 10, pad + 10, cardW, cardH, 28);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    const innerX = pad + 52;
    const maxW = cardW - 104;
    let curY = pad + 68;

    // Kicker Pill
    const kicker = (opts.kicker || 'ORBIT AI WORKBENCH').slice(0, 38);
    ctx.font = '700 22px "Inter", "PingFang SC", sans-serif';
    const kw = Math.min(maxW, ctx.measureText(kicker).width + 36);
    ctx.fillStyle = pal.kickerBg;
    ctx.beginPath();
    ctx.roundRect(innerX, curY, kw, 44, 22);
    ctx.fill();
    ctx.fillStyle = pal.kickerFg;
    ctx.fillText(kicker, innerX + 18, curY + 30);
    curY += 96;

    // Title
    const titleSize = ratio === '16:9' ? 48 : 52;
    ctx.font = `800 ${titleSize}px "Plus Jakarta Sans", "PingFang SC", sans-serif`;
    ctx.fillStyle = pal.ink;
    const titleLines = wrapCanvasText(ctx, opts.title || '', maxW).slice(0, 4);
    for (const ln of titleLines) {
      ctx.fillText(ln, innerX, curY);
      curY += titleSize * 1.32;
    }

    // Accent Divider
    curY += 12;
    ctx.fillStyle = pal.accent;
    ctx.fillRect(innerX, curY, 88, 6);
    curY += 52;

    // Body Copy
    const bodySize = ratio === '16:9' ? 27 : 30;
    ctx.font = `500 ${bodySize}px "Inter", "PingFang SC", sans-serif`;
    ctx.fillStyle = pal.sub;
    const maxBodyLines = ratio === '16:9' ? 5 : 9;
    const bodyLines = wrapCanvasText(ctx, opts.body || '', maxW).slice(0, maxBodyLines);
    for (const ln of bodyLines) {
      ctx.fillText(ln, innerX, curY);
      curY += bodySize * 1.58;
    }

    // Footer Tags & Brand Stamp
    const footY = pad + cardH - 54;
    ctx.font = '700 23px "Inter", "PingFang SC", sans-serif';
    ctx.fillStyle = pal.tagFg;
    const tagStr = String(opts.tags || '').slice(0, 48);
    ctx.fillText(tagStr, innerX, footY - 36);

    ctx.font = '600 20px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillStyle = pal.sub;
    ctx.globalAlpha = 0.72;
    ctx.fillText(depotData.brandName || 'ORBIT · AI WORKBENCH & DEPOT', innerX, footY);
    ctx.globalAlpha = 1;
  }

  function downloadCanvasPng(canvas, filename) {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // Global Share Card Modal Binding
  const shareModal = $('share-card-modal');
  const shareCanvas = $('share-card-canvas');
  let scRatio = '3:4';
  let scTheme = 'paper';

  function refreshShareModalCanvas() {
    if (!shareCanvas) return;
    drawShareCanvas(shareCanvas, {
      ratio: scRatio,
      theme: scTheme,
      kicker: $('sc-kicker')?.value || '',
      title: $('sc-title')?.value || '',
      body: $('sc-body')?.value || '',
      tags: $('sc-tags')?.value || '',
    });
    shareCanvas.style.maxWidth = scRatio === '16:9' ? '380px' : '270px';
  }

  function bindShareCardTriggers(scope = document) {
    scope.querySelectorAll('[data-open-share-card]').forEach((btn) => {
      if (btn.dataset.scBound) return;
      btn.dataset.scBound = '1';
      btn.addEventListener('click', () => {
        if (!shareModal) return;
        if ($('sc-kicker')) $('sc-kicker').value = btn.getAttribute('data-share-kicker') || 'ORBIT · 弹药库切片';
        if ($('sc-title')) $('sc-title').value = btn.getAttribute('data-share-title') || '';
        if ($('sc-body')) $('sc-body').value = btn.getAttribute('data-share-body') || '';
        if ($('sc-tags')) $('sc-tags').value = btn.getAttribute('data-share-tags') || '#AI工作流 #实战复盘';
        shareModal.hidden = false;
        refreshShareModalCanvas();
      });
    });
  }
  bindShareCardTriggers();

  if (shareModal) {
    ['sc-kicker', 'sc-title', 'sc-body', 'sc-tags'].forEach((id) => {
      $(id)?.addEventListener('input', refreshShareModalCanvas);
    });
    shareModal.querySelectorAll('[data-sc-ratio]').forEach((btn) => {
      btn.addEventListener('click', () => {
        scRatio = btn.getAttribute('data-sc-ratio') || '3:4';
        shareModal.querySelectorAll('[data-sc-ratio]').forEach((b) => b.classList.toggle('is-active', b === btn));
        refreshShareModalCanvas();
      });
    });
    shareModal.querySelectorAll('[data-sc-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        scTheme = btn.getAttribute('data-sc-theme') || 'paper';
        shareModal.querySelectorAll('[data-sc-theme]').forEach((b) => b.classList.toggle('is-active', b === btn));
        refreshShareModalCanvas();
      });
    });
    $('sc-download-btn')?.addEventListener('click', () => {
      downloadCanvasPng(shareCanvas, `orbit-card-${scRatio.replace(':', 'x')}.png`);
      toast('⬇ 高清分享配图已导出！');
    });
  }

  /* -------------------------------------------------------------------------
     4. Creator System Studio (/creator) — Triangulator + Excalidraw + Prompter + XHS
     ----------------------------------------------------------------------- */
  const triInput = $('tri-topic-input');
  if (!triInput) return; // Only run Creator Studio wiring when on /creator

  const candidates = depotData.creator?.topicCandidates || [];
  const bannedWords = depotData.creator?.voiceDna?.bannedWords || [];
  const sliderHot = $('slider-hot');
  const sliderInt = $('slider-interest');
  const sliderAi = $('slider-ai');

  // Step 00: Venn Triangulator
  function evaluateTopic() {
    const hot = Number(sliderHot?.value || 0);
    const interest = Number(sliderInt?.value || 0);
    const ai = Number(sliderAi?.value || 0);
    if ($('val-hot')) $('val-hot').textContent = String(hot);
    if ($('val-interest')) $('val-interest').textContent = String(interest);
    if ($('val-ai')) $('val-ai').textContent = String(ai);

    const score = Math.round(hot * 0.28 + interest * 0.42 + ai * 0.30);
    if ($('venn-score-num')) $('venn-score-num').textContent = String(score);
    if ($('tri-score-text')) $('tri-score-text').textContent = `综合值得拍指数：${score} / 100`;

    // Move Venn circles closer as scores increase
    const pull = (v) => ((v - 50) / 50) * 14;
    $('venn-c-hot')?.setAttribute('cx', String(114 + pull(hot)));
    $('venn-c-int')?.setAttribute('cx', String(166 - pull(interest)));
    $('venn-c-ai')?.setAttribute('cy', String(148 - pull(ai)));
    $('venn-core-glow')?.setAttribute('r', String(Math.max(10, Math.round(score * 0.28))));

    const box = $('tri-verdict-box');
    const badge = $('tri-verdict-badge');
    const desc = $('tri-verdict-desc');
    if (!box || !badge || !desc) return;

    if (interest < 48 && hot >= 75) {
      box.setAttribute('data-state', 'trap');
      badge.textContent = '⚠️ 流量陷阱预警 · 建议换切角';
      desc.textContent = '热度虽高，但你的真实表达欲偏低。硬蹭通稿录出来容易像毫无感情的念稿机，建议改成「拿自己真实任务实测一处成败」。';
    } else if (hot < 48 && interest >= 75) {
      box.setAttribute('data-state', 'warn');
      badge.textContent = '自嗨小众预警 · 需借大众痛点做钩子';
      desc.textContent = '你自己很有研究热情，但路人第一眼可能觉得跟自己无关。开场前 3 秒必须先挂一个高频痛点（省时间/防翻车）把人留住。';
    } else if (score >= 78) {
      box.setAttribute('data-state', 'gold');
      badge.textContent = '✦ 黄金交集区 · 立刻进 Step 1 画白板';
      desc.textContent = '既有大众共鸣痛点，又有你的亲手实战体感与 AI 硬核增量。顺着下方三格白板锁死骨架即可开录！';
    } else {
      box.setAttribute('data-state', 'warn');
      badge.textContent = '潜力尚可 · 建议再收窄切口';
      desc.textContent = '题目略宽泛，建议点左侧「切角按钮」，只挑一个最扎心的反差细节打透，90 秒干脆收尾。';
    }
  }

  [sliderHot, sliderInt, sliderAi].forEach((s) => s?.addEventListener('input', evaluateTopic));

  // Step 01: Excalidraw Live Preview + .excalidraw JSON File Builder
  const exFields = ['center', 'pain', 'mech', 'action', 'takeaway'];
  let xhsTheme = 'paper';
  const xhsCanvas = $('xhs-inline-canvas');

  function refreshXhsInlineCanvas() {
    const pickedTags = [...document.querySelectorAll('.xhs-tag-pill.is-picked')].map((b) => b.getAttribute('data-xhs-tag'));
    drawShareCanvas(xhsCanvas, {
      ratio: '3:4',
      theme: xhsTheme,
      kicker: 'EXCALIDRAW × AI 实战笔记',
      title: $('xhs-active-title')?.value || $('ex-center')?.value || '',
      body: `${$('ex-pain')?.value || ''}\n\n→ ${$('ex-mech')?.value || ''}\n\n✓ ${$('ex-takeaway')?.value || ''}`,
      tags: pickedTags.slice(0, 4).join(' '),
    });
  }

  function syncExcalidrawPreview() {
    exFields.forEach((k) => {
      const val = $(`ex-${k}`)?.value || '';
      const target = $(`prev-ex-${k}`);
      if (target) target.textContent = val;
    });
    refreshXhsInlineCanvas();
  }
  exFields.forEach((k) => $(`ex-${k}`)?.addEventListener('input', syncExcalidrawPreview));

  function wrapExText(str, maxChars) {
    const clean = String(str || '').trim();
    const out = [];
    for (let i = 0; i < clean.length; i += maxChars) {
      out.push(clean.slice(i, i + maxChars));
    }
    return out.join('\n') || ' ';
  }

  function buildExcalidrawJson() {
    const now = Date.now();
    let seed = 10420;
    const baseEl = (extra) => ({
      angle: 0,
      strokeWidth: 2,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      groupIds: [],
      frameId: null,
      seed: (seed += 17),
      version: 1,
      versionNonce: (seed += 31),
      isDeleted: false,
      boundElements: null,
      updated: now,
      link: null,
      locked: false,
      ...extra,
    });

    const boxWithText = (idPrefix, x, y, w, h, bg, stroke, titleTag, content, dashed = false) => {
      const wrapped = `${titleTag}\n${wrapExText(content, Math.floor((w - 36) / 20))}`;
      const linesCount = wrapped.split('\n').length;
      return [
        baseEl({
          id: `${idPrefix}-rect`,
          type: 'rectangle',
          x,
          y,
          width: w,
          height: h,
          strokeColor: stroke,
          backgroundColor: bg,
          fillStyle: 'solid',
          strokeStyle: dashed ? 'dashed' : 'solid',
          roundness: { type: 3 },
        }),
        baseEl({
          id: `${idPrefix}-txt`,
          type: 'text',
          x: x + 20,
          y: y + Math.max(18, (h - linesCount * 28) / 2),
          width: w - 40,
          height: linesCount * 28,
          strokeColor: '#1e1e1e',
          backgroundColor: 'transparent',
          fillStyle: 'solid',
          roundness: null,
          text: wrapped,
          fontSize: 20,
          fontFamily: 1,
          textAlign: 'left',
          verticalAlign: 'top',
          baseline: 20,
          containerId: null,
          originalText: wrapped,
          lineHeight: 1.35,
        }),
      ];
    };

    const arrowEl = (id, x, y, dx, dy) =>
      baseEl({
        id,
        type: 'arrow',
        x,
        y,
        width: Math.abs(dx),
        height: Math.abs(dy),
        strokeColor: '#1e293b',
        backgroundColor: 'transparent',
        fillStyle: 'solid',
        roundness: { type: 2 },
        points: [[0, 0], [dx, dy]],
        lastCommittedPoint: null,
        startBinding: null,
        endBinding: null,
        startArrowhead: null,
        endArrowhead: 'arrow',
      });

    const elements = [
      ...boxWithText('banner', 120, 60, 960, 96, '#fff3bf', '#e67700', '【核心命题】', $('ex-center')?.value || ''),
      ...boxWithText('pain', 120, 210, 280, 190, '#ffe3e3', '#c92a2a', '01 · 痛点 / 旧做法', $('ex-pain')?.value || ''),
      arrowEl('arr-1', 412, 305, 48, 0),
      ...boxWithText('mech', 472, 210, 280, 190, '#e7f5ff', '#1864ab', '02 · 核心机制 / 转折', $('ex-mech')?.value || ''),
      arrowEl('arr-2', 764, 305, 48, 0),
      ...boxWithText('action', 824, 210, 256, 190, '#d3f9d8', '#2b8a3e', '03 · 落地实操方案', $('ex-action')?.value || ''),
      ...boxWithText('takeaway', 120, 452, 960, 92, '#f8f9fa', '#334155', '✦ 一句话带走结论：', $('ex-takeaway')?.value || '', true),
    ];

    return {
      type: 'excalidraw',
      version: 2,
      source: 'https://xuewu1231.github.io/orbit-ai-workbench/creator',
      elements,
      appState: {
        gridSize: 20,
        viewBackgroundColor: '#ffffff',
      },
      files: {},
    };
  }

  $('download-excalidraw-btn')?.addEventListener('click', () => {
    const jsonStr = JSON.stringify(buildExcalidrawJson(), null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orbit-storyboard.excalidraw';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('⬇ 已下载 orbit-storyboard.excalidraw！可直接拖进 Excalidraw 打开录屏');
  });

  $('excalidraw-prompt-copy')?.addEventListener('click', async () => {
    const sk = depotData.skills?.['excalidraw-storyboard']?.plainPrompt || '';
    const topic = triInput.value.trim();
    await copyPlain(`当前选题：${topic}\n\n${sk}`);
    toast('✦ 已复制 Excalidraw 白板分镜生成指令给 AI');
  });

  // Step 02: Spoken Script Renderer, Stats, Plastic Guard & Scrolling Teleprompter
  const scriptInput = $('spoken-script-input');
  const tpRendered = $('tp-rendered-script');
  const tpViewport = $('tp-viewport');
  const tpBox = $('teleprompter-box');
  const statPill = $('script-stat-pill');
  const plasticGuard = $('script-plastic-guard');

  function renderTeleprompterScript() {
    const raw = scriptInput?.value || '';
    const pureChars = raw.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, '').length;
    const totalSec = Math.max(5, Math.round((pureChars / 225) * 60));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (statPill) {
      statPill.textContent = `${pureChars} 字 · 预计口播 ${min ? `${min} 分 ` : ''}${sec} 秒`;
    }

    const hitBanned = bannedWords.filter((w) => raw.includes(w));
    if (plasticGuard) {
      if (hitBanned.length) {
        plasticGuard.className = 'plastic-guard-badge is-warn';
        plasticGuard.textContent = `⚠️ 发现塑料词：${hitBanned.join('、')}`;
      } else {
        plasticGuard.className = 'plastic-guard-badge is-clean';
        plasticGuard.textContent = '✓ 零塑料套话';
      }
    }

    if (tpRendered) {
      const paras = raw.split(/\n{2,}|\r?\n/).filter((p) => p.trim());
      tpRendered.innerHTML = '';
      paras.forEach((p) => {
        const pEl = document.createElement('p');
        const parts = p.split(/(\[[^\]]+\])/g);
        parts.forEach((part) => {
          if (/^\[[^\]]+\]$/.test(part)) {
            const cue = document.createElement('span');
            cue.className = 'tp-cue';
            cue.textContent = part;
            pEl.appendChild(cue);
          } else if (part) {
            pEl.appendChild(document.createTextNode(part));
          }
        });
        tpRendered.appendChild(pEl);
      });
    }
  }
  scriptInput?.addEventListener('input', renderTeleprompterScript);

  function insertAtCursor(ta, snippet) {
    if (!ta) return;
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    ta.value = ta.value.slice(0, start) + snippet + ta.value.slice(end);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = start + snippet.length;
    renderTeleprompterScript();
  }
  $('insert-cue-board')?.addEventListener('click', () => insertAtCursor(scriptInput, ' [切白板特写] '));
  $('insert-cue-pause')?.addEventListener('click', () => insertAtCursor(scriptInput, ' [停顿半秒] '));
  $('copy-raw-script')?.addEventListener('click', async () => {
    await copyPlain(scriptInput?.value || '');
    toast('✓ 已复制口播逐字稿');
  });
  $('copy-spoken-prompt')?.addEventListener('click', async () => {
    const sk = depotData.skills?.['xiaohongshu-spoken-pack']?.plainPrompt || '';
    const dna = depotData.creator?.voiceDna?.systemPrompt || '';
    const boardSummary = [
      `中心命题：${$('ex-center')?.value || ''}`,
      `痛点框：${$('ex-pain')?.value || ''}`,
      `机制框：${$('ex-mech')?.value || ''}`,
      `实操框：${$('ex-action')?.value || ''}`,
      `收尾金句：${$('ex-takeaway')?.value || ''}`,
    ].join('\n');
    await copyPlain(`请根据以下白板节点生成自然口播稿与小红书文案：\n${boardSummary}\n\n${sk}\n\n${dna}`);
    toast('✦ 已复制「白板转口播稿 + 文风 DNA」完整指令给 AI');
  });

  // Teleprompter Smooth Auto-Scroll
  let tpPlaying = false;
  let tpScrollFloat = 0;
  const tpPlayBtn = $('tp-play-toggle');
  const tpSpeedInput = $('tp-speed');
  const tpSpeedVal = $('tp-speed-val');

  function setTpPlaying(next) {
    tpPlaying = next;
    if (tpPlayBtn) tpPlayBtn.textContent = tpPlaying ? '❚❚ 暂停滚动' : '▶ 开启滚动提词';
    if (tpPlaying && tpViewport) tpScrollFloat = tpViewport.scrollTop;
  }

  tpPlayBtn?.addEventListener('click', () => setTpPlaying(!tpPlaying));
  $('tp-reset-btn')?.addEventListener('click', () => {
    setTpPlaying(false);
    tpScrollFloat = 0;
    if (tpViewport) tpViewport.scrollTop = 0;
  });
  tpSpeedInput?.addEventListener('input', () => {
    const mult = (Number(tpSpeedInput.value) / 2.5).toFixed(1);
    if (tpSpeedVal) tpSpeedVal.textContent = `${mult}×`;
  });

  const FONT_SIZES = ['md', 'lg', 'xl'];
  $('tp-font-toggle')?.addEventListener('click', () => {
    if (!tpBox) return;
    const cur = tpBox.getAttribute('data-size') || 'md';
    const next = FONT_SIZES[(FONT_SIZES.indexOf(cur) + 1) % FONT_SIZES.length];
    tpBox.setAttribute('data-size', next);
  });
  $('tp-mirror-toggle')?.addEventListener('click', () => {
    if (!tpBox) return;
    const cur = tpBox.getAttribute('data-mirror') === '1' ? '0' : '1';
    tpBox.setAttribute('data-mirror', cur);
    toast(cur === '1' ? '⇄ 已开启水平镜像模式' : '⇄ 已恢复正常显示');
  });
  $('tp-fullscreen-toggle')?.addEventListener('click', () => {
    if (!tpBox) return;
    if (!document.fullscreenElement && tpBox.requestFullscreen) {
      tpBox.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  });

  (function tickPrompter() {
    requestAnimationFrame(tickPrompter);
    if (!tpPlaying || !tpViewport) return;
    const speed = Number(tpSpeedInput?.value || 2.5) * 0.28;
    tpScrollFloat += speed;
    tpViewport.scrollTop = tpScrollFloat;
    if (tpViewport.scrollTop + tpViewport.clientHeight >= tpViewport.scrollHeight - 2) {
      setTpPlaying(false);
    }
  })();

  // Step 03: Xiaohongshu Title Chips, #Tag Toggles & Full Post Copy
  const xhsTitleOptions = $('xhs-title-options');
  const xhsActiveTitle = $('xhs-active-title');
  const xhsBodyInput = $('xhs-body-input');
  const xhsSelectedLine = $('xhs-selected-tags-line');

  function renderXhsTitleChips(titles) {
    if (!xhsTitleOptions) return;
    xhsTitleOptions.innerHTML = '';
    (titles || []).forEach((t, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'xhs-title-chip' + (idx === 0 ? ' is-on' : '');
      btn.textContent = `备选 ${idx + 1}：${t}`;
      btn.addEventListener('click', () => {
        xhsTitleOptions.querySelectorAll('.xhs-title-chip').forEach((b) => b.classList.remove('is-on'));
        btn.classList.add('is-on');
        if (xhsActiveTitle) xhsActiveTitle.value = t;
        refreshXhsInlineCanvas();
      });
      xhsTitleOptions.appendChild(btn);
    });
  }

  function syncSelectedTagsLine() {
    const picked = [...document.querySelectorAll('.xhs-tag-pill.is-picked')].map((b) => b.getAttribute('data-xhs-tag'));
    if (xhsSelectedLine) {
      xhsSelectedLine.textContent = picked.length
        ? `已挂载 ${picked.length} 个话题：${picked.join(' ')}`
        : '暂未选择话题，点击上方胶囊即可挂进文案末尾';
    }
    refreshXhsInlineCanvas();
  }

  function bindTagPills(scope = document) {
    scope.querySelectorAll('[data-xhs-tag]').forEach((btn) => {
      if (btn.dataset.tagBound) return;
      btn.dataset.tagBound = '1';
      btn.addEventListener('click', () => {
        btn.classList.toggle('is-picked');
        syncSelectedTagsLine();
      });
    });
  }
  bindTagPills();

  $('xhs-custom-tag-input')?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    let val = e.target.value.trim();
    if (!val) return;
    if (!val.startsWith('#')) val = `#${val}`;
    const firstRow = document.querySelector('.xtg-pills');
    if (firstRow) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'xhs-tag-pill is-picked';
      btn.setAttribute('data-xhs-tag', val);
      btn.textContent = val;
      firstRow.prepend(btn);
      bindTagPills(firstRow);
      syncSelectedTagsLine();
    }
    e.target.value = '';
  });

  xhsActiveTitle?.addEventListener('input', refreshXhsInlineCanvas);

  document.querySelectorAll('[data-xhs-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      xhsTheme = btn.getAttribute('data-xhs-theme') || 'paper';
      document.querySelectorAll('[data-xhs-theme]').forEach((b) => b.classList.toggle('is-on', b === btn));
      refreshXhsInlineCanvas();
    });
  });

  $('download-xhs-cover-btn')?.addEventListener('click', () => {
    downloadCanvasPng(xhsCanvas, 'xiaohongshu-cover-3x4.png');
    toast('⬇ 已导出高清 3:4 小红书封面图！');
  });

  $('copy-full-xhs-btn')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const title = (xhsActiveTitle?.value || '').trim();
    const body = (xhsBodyInput?.value || '').trim();
    const tags = [...document.querySelectorAll('.xhs-tag-pill.is-picked')].map((b) => b.getAttribute('data-xhs-tag')).join(' ');
    const fullPost = [title, body, tags].filter(Boolean).join('\n\n');
    await copyPlain(fullPost);
    flashDone(btn, '已复制整篇文案与话题', '一键复制完整小红书发布包');
    toast('✦ 已复制「标题 + 正文 + #话题」，直接去小红书粘贴即可！');
  });

  // Sync Whiteboard -> Spoken Script & Xiaohongshu
  $('sync-board-to-script')?.addEventListener('click', () => {
    const center = $('ex-center')?.value || '';
    const pain = $('ex-pain')?.value || '';
    const mech = $('ex-mech')?.value || '';
    const action = $('ex-action')?.value || '';
    const takeaway = $('ex-takeaway')?.value || '';

    if (scriptInput) {
      scriptInput.value = [
        `[镜头：特写白板左侧红框] 先看大多数人最容易卡住的地方——${pain}。`,
        `[切白板顶部标题] 所以今天只用这一张白板，跟你聊透：${center}。`,
        `[画笔：圈出中间蓝框] 真正的转折点其实在这儿：${mech}。`,
        `[顺箭头滑到右侧绿框 · 停顿半秒] 具体落到今天就能抄走的做法：${action}。`,
        `[拉回全景收尾] 最后送你白板底下这句话：${takeaway}`,
      ].join('\n\n');
      renderTeleprompterScript();
    }
    if (xhsActiveTitle) xhsActiveTitle.value = center.slice(0, 20);
    if (xhsBodyInput) {
      xhsBodyInput.value = `${pain}\n\n用一张 Excalidraw 三格白板把破局思路梳理清楚了：\n\n1. 关键转折：${mech}\n2. 实操落地：${action}\n\n${takeaway}`;
    }
    refreshXhsInlineCanvas();
    toast('✓ 已按最新白板节点同步刷新 Step 2 口播稿与 Step 3 小红书文案！');
  });

  // Load Candidate Preset Helper
  function loadCandidate(cand) {
    if (!cand) return;
    triInput.value = cand.title;
    if (sliderHot) sliderHot.value = String(cand.hot);
    if (sliderInt) sliderInt.value = String(cand.interest);
    if (sliderAi) sliderAi.value = String(cand.aiDepth);
    evaluateTopic();
    if ($('tri-verdict-desc') && cand.note) $('tri-verdict-desc').textContent = cand.note;

    if (cand.board) {
      if ($('ex-center')) $('ex-center').value = cand.board.center || '';
      if ($('ex-pain')) $('ex-pain').value = cand.board.pain || '';
      if ($('ex-mech')) $('ex-mech').value = cand.board.mechanism || '';
      if ($('ex-action')) $('ex-action').value = cand.board.action || '';
      if ($('ex-takeaway')) $('ex-takeaway').value = cand.board.takeaway || '';
    }
    if (scriptInput) scriptInput.value = cand.script || '';
    renderTeleprompterScript();

    renderXhsTitleChips(cand.xhsTitles || [cand.title]);
    if (xhsActiveTitle) xhsActiveTitle.value = cand.xhsTitles?.[0] || cand.title;
    if (xhsBodyInput) xhsBodyInput.value = cand.xhsBody || '';

    const wanted = new Set(cand.selectedTags || []);
    document.querySelectorAll('.xhs-tag-pill').forEach((pill) => {
      pill.classList.toggle('is-picked', wanted.has(pill.getAttribute('data-xhs-tag')));
    });
    syncExcalidrawPreview();
    syncSelectedTagsLine();
  }

  document.querySelectorAll('[data-topic-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-topic-preset');
      const found = candidates.find((c) => c.id === id);
      if (!found) return;
      document.querySelectorAll('[data-topic-preset]').forEach((b) => b.classList.toggle('is-on', b === btn));
      loadCandidate(found);
      toast(`✓ 已载入选题样张：${found.title.slice(0, 16)}…`);
    });
  });

  // Angle Reframing Buttons
  document.querySelectorAll('[data-apply-angle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-apply-angle');
      const topic = triInput.value.trim() || 'AI 工作流实战';
      if (mode === 'pitfall') {
        if ($('ex-center')) $('ex-center').value = `避坑实测：${topic.slice(0, 14)}`;
        if ($('ex-pain')) $('ex-pain').value = '跟风盲目套用热门方案 · 耗时又不稳定';
        if ($('ex-mech')) $('ex-mech').value = '拆出真正卡脖子的两个边界条件';
        if ($('ex-action')) $('ex-action').value = '只保留最小可用闭环，砍掉花哨步骤';
      } else if (mode === 'board') {
        if ($('ex-center')) $('ex-center').value = `一张白板拆透：${topic.slice(0, 13)}`;
        if ($('ex-pain')) $('ex-pain').value = '概念满天飞 · 听完还是不会自己上手';
        if ($('ex-mech')) $('ex-mech').value = '浓缩成输入 → 处理护栏 → 输出验证三步';
        if ($('ex-action')) $('ex-action').value = '照着这三个手绘框直接套进日常项目';
      } else {
        if ($('ex-center')) $('ex-center').value = `前后反差实测：${topic.slice(0, 13)}`;
        if ($('ex-pain')) $('ex-pain').value = '默认提示词直出 · 一股廉价模板塑料味';
        if ($('ex-mech')) $('ex-mech').value = '挂载私人弹药库标准 + 标杆参考约束';
        if ($('ex-action')) $('ex-action').value = '一遍出精品，沉淀成可复用的 SKILL.md';
      }
      syncExcalidrawPreview();
      $('step-excalidraw')?.scrollIntoView({ behavior: 'smooth' });
      toast('✦ 已按所选切角生成白板框架，可继续微调或下载 .excalidraw');
    });
  });

  $('copy-topic-brainstorm')?.addEventListener('click', async () => {
    const topic = triInput.value.trim();
    const dna = depotData.creator?.voiceDna?.systemPrompt || '';
    await copyPlain(
      `我正在筹备一期 AI 自媒体视频，初步方向是：「${topic}」。\n请结合「热门痛点 × 我的实战体感 × AI 硬核增量」帮我发散 5 个高完播率切入角度（包含：踩坑劝退切角、三格白板拆解切角、前后反差切角），并为每个切角写出前 3 秒开口第一句话。\n\n${dna}`
    );
    toast('✦ 已复制选题切角发散指令给 AI');
  });

  // Inject Hook from Hook Vault into Step 2 Script
  document.querySelectorAll('[data-inject-hook]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const hook = btn.getAttribute('data-inject-hook') || '';
      if (!scriptInput || !hook) return;
      scriptInput.value = `[镜头：开场前 3 秒直击痛点] ${hook}\n\n` + scriptInput.value;
      renderTeleprompterScript();
      $('step-teleprompter')?.scrollIntoView({ behavior: 'smooth' });
      toast('↑ 已将该黄金钩子塞进 Step 2 口播稿第一句！');
    });
  });

  // Check if Signals were sent over from /originals
  let hydratedFromSignals = false;
  try {
    const pendingRaw = sessionStorage.getItem('orbit-pending-signals');
    if (pendingRaw) {
      sessionStorage.removeItem('orbit-pending-signals');
      const sigs = JSON.parse(pendingRaw);
      if (Array.isArray(sigs) && sigs.length) {
        hydratedFromSignals = true;
        triInput.value = sigs[0].title;
        if ($('ex-center')) $('ex-center').value = sigs[0].title.slice(0, 22);
        if ($('ex-pain')) $('ex-pain').value = sigs[0].body.slice(0, 34);
        if ($('ex-mech')) $('ex-mech').value = (sigs[1]?.title || '提炼成可复用的结构与护栏').slice(0, 34);
        if ($('ex-action')) $('ex-action').value = (sigs[2]?.title || '沉淀进个人工作台随时调用').slice(0, 34);
        if ($('ex-takeaway')) $('ex-takeaway').value = '把踩过的坑变成随时能推上膛的弹药。';
        $('sync-board-to-script')?.click();
        toast(`✦ 已将 ${sigs.length} 条闪念自动铺进白板与口播流水线！`);
      }
    }
  } catch (e) {}

  // Initial Boot on /creator
  if (!hydratedFromSignals && candidates[0]) {
    loadCandidate(candidates[0]);
  } else {
    evaluateTopic();
    renderTeleprompterScript();
    syncExcalidrawPreview();
    syncSelectedTagsLine();
  }
})();


/* =============================================================================
   V10 · UNIFIED READER LEFT-RAIL LIVE PROGRESS BAR
   ============================================================================= */
(function () {
  const sheet = document.getElementById('reader-sheet');
  const pctEl = document.getElementById('rail-progress-pct');
  const fillEl = document.getElementById('rail-progress-fill');
  if (!sheet || !pctEl || !fillEl) return;

  function syncReaderProgress() {
    const rect = sheet.getBoundingClientRect();
    const viewH = window.innerHeight || document.documentElement.clientHeight;
    const total = Math.max(1, rect.height - viewH * 0.55);
    const passed = Math.min(total, Math.max(0, -rect.top + viewH * 0.28));
    const pct = Math.round((passed / total) * 100);
    pctEl.textContent = `${pct}%`;
    fillEl.style.width = `${pct}%`;
  }

  syncReaderProgress();
  window.addEventListener('scroll', syncReaderProgress, { passive: true });
  window.addEventListener('resize', syncReaderProgress, { passive: true });
})();


/* =============================================================================
   V11 · DELEGATED [data-copy] PLAIN-TEXT COPY HANDLER
   ============================================================================= */
(function () {
  async function writeClip(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta);
    }
  }

  function popToast(msg) {
    const t = document.getElementById('orbit-toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    setTimeout(() => { t.hidden = true; }, 2300);
  }

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]:not(.copy-cmd-btn):not(#wb-copy-btn)');
    if (!btn) return;
    const text = btn.getAttribute('data-copy');
    if (!text) return;
    await writeClip(text);
    const lbl = btn.querySelector('.btn-label');
    if (lbl) {
      const prev = lbl.textContent;
      btn.classList.add('is-done');
      lbl.textContent = '已复制';
      setTimeout(() => {
        btn.classList.remove('is-done');
        lbl.textContent = prev;
      }, 1500);
    }
    popToast('✦ 已复制纯文本内容，可直接粘贴给 AI');
  });
})();


/* =============================================================================
   V14 · CODE-VIDEO 5-SKIN DESIGN.MD STUDIO, 12-FX LIVE MATRIX & SPRING LAB
   ============================================================================= */
(function () {
  const hasAnyWidget =
    document.querySelector('[data-cv-skin-studio]') ||
    document.querySelector('[data-cv-fx-canvas]') ||
    document.querySelector('[data-cv-springs]') ||
    document.querySelector('[data-cv-flipbook]');
  if (!hasAnyWidget) return;

  const SKINS = {
    linear: {
      num: '01',
      name: 'Linear 暗黑精密风',
      desc: '深曜石底布配极细点阵与高对比冷白巨字，仅在核心数字与印章处点缀 ≤7% 朱砂红或电光靛，彻底告别廉价霓虹发光框。',
      bg: '#090A0F',
      surface: '#141724',
      fg: '#F4F4F6',
      muted: '#8A8F98',
      border: 'rgba(255,255,255,0.14)',
      grid: 'rgba(255,255,255,0.05)',
      marker: '#5E6AD2',
      hero: '#FF381C',
      invBg: '#F4F4F6',
      invFg: '#090A0F',
      roles: [
        { role: '75% 画布底色', hex: '#090A0F' },
        { role: '内嵌容器面', hex: '#141724' },
        { role: '18% 主墨水字', hex: '#F4F4F6' },
        { role: '≤7% 视觉锤色', hex: '#FF381C' },
      ],
    },
    apple: {
      num: '02',
      name: 'Apple 纯白画廊风',
      desc: '78% 纯净暖灰白画布 + 深炭黑紧凑无衬线大字 + 柔光漫射白卡，画面呼吸感极强，最适合产品发布与功能演示。',
      bg: '#F5F5F7',
      surface: '#FFFFFF',
      fg: '#1D1D1F',
      muted: '#86868B',
      border: 'rgba(0,0,0,0.10)',
      grid: 'rgba(0,0,0,0.04)',
      marker: '#D5E8FF',
      hero: '#0071E3',
      invBg: '#1D1D1F',
      invFg: '#F5F5F7',
      roles: [
        { role: '75% 画布底色', hex: '#F5F5F7' },
        { role: '纯净内卡片', hex: '#FFFFFF' },
        { role: '18% 深炭黑字', hex: '#1D1D1F' },
        { role: '≤7% 科技蓝锤', hex: '#0071E3' },
      ],
    },
    vox: {
      num: '03',
      name: 'Vox 暖纸社论科普风',
      desc: '温暖米白纸张底布配粗墨黑印刷边框，用亮黄荧光马克笔横刷重点词、朱砂红盖结论章，天生自带深度纪录片质感。',
      bg: '#F5F1E6',
      surface: '#FFFFFF',
      fg: '#111111',
      muted: '#57534E',
      border: '#111111',
      grid: 'rgba(17,17,17,0.09)',
      marker: '#FFE500',
      hero: '#FF381C',
      invBg: '#111111',
      invFg: '#F5F1E6',
      roles: [
        { role: '75% 暖白纸底', hex: '#F5F1E6' },
        { role: '18% 印刷重黑', hex: '#111111' },
        { role: '荧光笔高亮', hex: '#FFE500' },
        { role: '≤7% 朱砂红印', hex: '#FF381C' },
      ],
    },
    industrial: {
      num: '04',
      name: 'Teenage 工业机械橙风',
      desc: '哑光铝合金灰底配等宽技术刻度尺与高饱和安全橙（#FF5500），像精密合成器面板一样干脆利落，极客辨识度拉满。',
      bg: '#ECEBE6',
      surface: '#FAFAF7',
      fg: '#141414',
      muted: '#686660',
      border: 'rgba(20,20,20,0.22)',
      grid: 'rgba(20,20,20,0.08)',
      marker: '#FFD4BF',
      hero: '#FF5500',
      invBg: '#141414',
      invFg: '#ECEBE6',
      roles: [
        { role: '75% 铝合金灰', hex: '#ECEBE6' },
        { role: '机械面板白', hex: '#FAFAF7' },
        { role: '18% 蚀刻深黑', hex: '#141414' },
        { role: '≤7% 工业安全橙', hex: '#FF5500' },
      ],
    },
    cinema: {
      num: '05',
      name: 'Cinema 黑金聚光电影风',
      desc: '暖调胶片暗场配香槟金（#D4AF37）核心数字与绯红印记，压暗四周噪点聚焦舞台中心，适合商业人物、逆袭故事与认知金句。',
      bg: '#0B0A09',
      surface: '#171513',
      fg: '#FAF6EE',
      muted: '#9C9488',
      border: 'rgba(212,175,55,0.28)',
      grid: 'rgba(250,246,238,0.045)',
      marker: 'rgba(212,175,55,0.28)',
      hero: '#D4AF37',
      invBg: '#FAF6EE',
      invFg: '#0B0A09',
      roles: [
        { role: '75% 胶片暗底', hex: '#0B0A09' },
        { role: '暗金暖衬底', hex: '#171513' },
        { role: '18% 暖象牙字', hex: '#FAF6EE' },
        { role: '≤7% 香槟金锤', hex: '#D4AF37' },
      ],
    },
  };

  const FX_PROMPTS = {
    clash: '【01 左右反色对撞】开场前 3 秒将 1920x1080 画布沿 14° 斜线一分为二，左半屏深底砸入正面指标，右半屏浅底对撞砸入反差痛点，两屏在 t=0.28s 交汇瞬间触发 6px 衰减震动。',
    stomp: '【02 大字砸下+荧光笔划线】核心关键词采用 180px 字重 900 大字，从 scale(1.38) 经弹簧在 0.32s 内干脆落下；停稳 0.08s 后从左向右快速刷满底部亮色横条。',
    rip: '【03 划掉常见误区】先摆出大众常见错误想法卡片，t=0.9s 时用 10px 斜向红线在 0.16s 内划穿推走，原地弹出真正的反常识结论大字。',
    lock: '【04 压暗四周+给第 3 点上锁】四周叠加 75% 径向压暗聚焦中心，错峰 4 帧依次弹出 3 张要点卡，随后微推第 3 张并扣上悬念锁留到结尾揭晓。',
    macro: '【05 先放大看细节再拉远下结论】外层套 CameraRig：前 2.0s 以 scale(2.4) 特写聚焦在模拟聊天窗口的关键消息上；转折处用 0.48s 高阻尼弹簧拉回 scale(1.0) 全景并盖下结论方印。',
    portal: '【06 穿过圆孔进入下一章】换大章节时先用 0.14s 微退至 scale(0.92) 蓄力，随后锁定数字「0」或圆环中心，0.52s 加速放大至 scale(15) 穿过圆孔无缝切入反色新画面。',
    whip: '【07 0.28s 快速横甩换页】转场控制在 16 帧（0.28s）：旧画面带水平速度残影线快速左移滑出，新画面紧贴右侧顺着惯性减速停稳。',
    dive: '【08 往下深潜看底层】搭建上下双层纵向画布：上半层展示表面概念泡沫，摄像机顺着话音垂直下潜 1080px 穿过地平线与岩层，直抵地底核心数据。',
    motif: '【09 同一个图形连续变形串起全片】选定同一根红色竖条「1」贯穿首尾，通过宽高与圆角插值在各章依次变形为：探地钻头 → 水平拦截红线 → 方印 → 结尾变回 1,000,000 领头的 1。',
    laser: '【10 传送带+激光线拦截】画一条水平传送带让业务包裹向右滑行，上方立 3 道垂直红色激光线，违规包裹撞线瞬间闪红灯拦停。',
    cursor: '【11 仿真鼠标点击+数字滚动】用纯时间函数驱动矢量鼠标沿微弯弧线滑到按钮中心，做 scale(0.92) 按下回弹与波纹，旁边核心指标开启 tabular-nums 按弹簧滚动跳升。',
    physics: '【12 起跳微蹲蓄力+文字慢半拍】告别匀速平移：卡片起跳前先做 0.12s 往下微蹲 8px 蓄力，外框停稳瞬间内部文字延迟 40ms（2~3 帧）完成回弹。',
  };

  let activeSkinKey = 'linear';
  const visibleElements = new Set();

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleElements.add(entry.target);
          else visibleElements.delete(entry.target);
        });
      },
      { rootMargin: '180px 0px' }
    );
    document
      .querySelectorAll('[data-cv-skin-canvas], [data-cv-fx-canvas], [data-cv-springs-canvas], [data-cv-flipbook-canvas]')
      .forEach((el) => io.observe(el));
  } else {
    document
      .querySelectorAll('[data-cv-skin-canvas], [data-cv-fx-canvas], [data-cv-springs-canvas], [data-cv-flipbook-canvas]')
      .forEach((el) => visibleElements.add(el));
  }

  function showToast(msg) {
    const toastEl = document.getElementById('orbit-toast');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2200);
  }

  async function copyText(txt, msg) {
    try {
      await navigator.clipboard.writeText(txt);
    } catch (e) {}
    showToast(msg);
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function easeOutQuint(x) { return 1 - Math.pow(1 - x, 5); }
  function easeInCubic(x) { return x * x * x; }
  function easeInOutQuint(x) { return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2; }
  function easeOutBack(x) {
    const c1 = 2.05, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }
  function evalSpring(t, omega, zeta) {
    if (t <= 0) return 0;
    if (zeta >= 1) return 1 - (1 + omega * t) * Math.exp(-omega * t);
    const wd = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t));
  }

  function setupHiDPICanvas(canvas, logicalH) {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(260, Math.floor(rect.width));
    if (canvas._lw !== w || canvas._lh !== logicalH) {
      canvas._lw = w;
      canvas._lh = logicalH;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(logicalH * dpr);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    return { ctx: canvas.getContext('2d'), w, h: logicalH };
  }

  function paintBackdrop(ctx, w, h, s) {
    ctx.fillStyle = s.bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = s.grid;
    for (let x = 18; x < w; x += 22) {
      for (let y = 18; y < h; y += 22) ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  /* 1. Sync 5-Skin DESIGN.md Studio Inspector */
  function syncSkinStudios() {
    const s = SKINS[activeSkinKey] || SKINS.linear;
    document.querySelectorAll('[data-cv-skin-select]').forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-cv-skin-select') === activeSkinKey);
    });
    document.querySelectorAll('[data-cv-skin-studio]').forEach((studio) => {
      const titleEl = studio.querySelector('[data-cv-skin-title]');
      const descEl = studio.querySelector('[data-cv-skin-desc]');
      const ratioEl = studio.querySelector('[data-cv-ratio-bar]');
      const swEl = studio.querySelector('[data-cv-swatches]');
      if (titleEl) titleEl.textContent = `${s.num} · ${s.name}`;
      if (descEl) descEl.textContent = s.desc;
      if (ratioEl) {
        const spans = ratioEl.querySelectorAll('span');
        if (spans[0]) spans[0].style.background = s.bg;
        if (spans[1]) spans[1].style.background = s.fg;
        if (spans[2]) spans[2].style.background = s.hero;
      }
      if (swEl) {
        swEl.innerHTML = s.roles
          .map(
            (r) => `
          <button type="button" class="cv-swatch-chip" data-copy-hex="${r.hex}">
            <span class="cv-sw-box" style="background:${r.hex}"></span>
            <span class="cv-sw-meta"><small>${r.role}</small><code>${r.hex}</code></span>
          </button>`
          )
          .join('');
      }
    });
  }

  document.addEventListener('click', (e) => {
    const skinBtn = e.target.closest('[data-cv-skin-select]');
    if (skinBtn) {
      activeSkinKey = skinBtn.getAttribute('data-cv-skin-select') || 'linear';
      syncSkinStudios();
      renderAllOnce();
      return;
    }
    const hexChip = e.target.closest('[data-copy-hex]');
    if (hexChip) {
      const hex = hexChip.getAttribute('data-copy-hex');
      copyText(hex, `✦ 已复制色值 ${hex}`);
      return;
    }
    const copySkinBtn = e.target.closest('[data-cv-copy-skin]');
    if (copySkinBtn) {
      const s = SKINS[activeSkinKey] || SKINS.linear;
      const md = `# DESIGN.md · ${s.name}\n- Canvas: 1920x1080 @ 60fps, Safe Area >= 8%\n- 75% Canvas Background: ${s.bg}\n- Elevated Card Surface: ${s.surface}\n- 18% Primary Ink: ${s.fg} | Muted Secondary: ${s.muted}\n- <=7% Hero Visual Hammer: ${s.hero} | Highlight Bar: ${s.marker}\n- Video Type Scale: Hero Term 180px (weight 900, tracking -0.04em); Single-Focus Statement 84px (<=12 chars); Simulated UI 32px (tabular-nums).\n- Guardrails: Negative space >= 65%, zero dark neon glowing Bento boxes, zero colorful Emojis.`;
      copyText(md, `✦ 已复制「${s.name}」完整 DESIGN.md，可直接喂给 AI`);
      return;
    }
    const fxCopyBtn = e.target.closest('[data-cv-fx-copy]');
    if (fxCopyBtn) {
      const id = fxCopyBtn.getAttribute('data-cv-fx-copy');
      const s = SKINS[activeSkinKey] || SKINS.linear;
      const txt = `${FX_PROMPTS[id] || ''}\n配色基准：采用「${s.name}」（底色 ${s.bg} / 主字 ${s.fg} / 强调色 ${s.hero}），100% 由 prepareFrame(time) 纯函数加 clamp 钳制驱动。`;
      copyText(txt, `✦ 已复制 ${id.toUpperCase()} 视效 + 当前色系指令`);
    }
  });

  /* 2. Draw 16:9 Live DESIGN.md Skin Stage (5.4s 3-beat loop) */
  function drawSkinStage(canvas, time) {
    const { ctx, w, h } = setupHiDPICanvas(canvas, 300);
    const s = SKINS[activeSkinKey] || SKINS.linear;
    const dur = 5.4;
    const t = time % dur;

    if (t < 1.9) {
      paintBackdrop(ctx, w, h, s);
      // Top minimalist chapter rule
      ctx.fillStyle = s.muted;
      ctx.font = '700 11px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`CHAPTER 01 · ${s.name.toUpperCase()}`, 28, 30);
      ctx.fillStyle = s.hero;
      ctx.fillRect(28, 38, 68 * easeOutQuint(clamp(t / 0.4, 0, 1)), 3);

      const pop = easeOutBack(clamp(t / 0.36, 0, 1));
      const hl = easeOutQuint(clamp((t - 0.14) / 0.42, 0, 1));
      ctx.save();
      ctx.translate(w / 2, h / 2 + 4);
      ctx.scale(1.26 - 0.26 * pop, 1.26 - 0.26 * pop);
      ctx.fillStyle = s.marker;
      ctx.fillRect(-146, 4, 292 * hl, 28);
      ctx.fillStyle = s.fg;
      ctx.font = '900 58px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('泥坑嗅觉', 0, 0);
      ctx.restore();

      ctx.fillStyle = s.muted;
      ctx.font = '700 12.5px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('拍次 A · 75% 大留白 + 180px 满屏概念亮牌', w / 2, h - 22);
    } else if (t < 3.8) {
      paintBackdrop(ctx, w, h, s);
      const loc = t - 1.9;
      const pCard = easeOutBack(clamp(loc / 0.4, 0, 1));
      const cw = Math.min(410, w - 56);
      ctx.save();
      ctx.translate(w / 2, h / 2 - 4);
      ctx.scale(0.86 + 0.14 * pCard, 0.86 + 0.14 * pCard);
      ctx.fillStyle = s.surface;
      ctx.strokeStyle = s.border;
      ctx.lineWidth = activeSkinKey === 'vox' ? 2.2 : 1.2;
      ctx.beginPath();
      ctx.roundRect(-cw / 2, -68, cw, 136, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = s.muted;
      ctx.font = '700 11.5px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('LIVE METRIC · TABULAR-NUMS', -cw / 2 + 22, -38);

      const mult = Math.round(1 + 999 * easeOutQuint(clamp((loc - 0.1) / 0.85, 0, 1)));
      ctx.fillStyle = s.fg;
      ctx.font = '900 46px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(`×${mult}`, -cw / 2 + 22, 14);

      const pStamp = easeOutBack(clamp((loc - 0.45) / 0.34, 0, 1));
      if (pStamp > 0) {
        ctx.save();
        ctx.translate(cw / 2 - 78, 6);
        ctx.scale(pStamp, pStamp);
        ctx.fillStyle = s.hero;
        ctx.beginPath();
        ctx.roundRect(-54, -22, 108, 44, 9);
        ctx.fill();
        ctx.fillStyle = activeSkinKey === 'cinema' ? '#0B0A09' : '#FFFFFF';
        ctx.font = '900 14px -apple-system, "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('出了事我扛', 0, 0);
        ctx.restore();
      }
      ctx.restore();

      ctx.fillStyle = s.muted;
      ctx.font = '700 12.5px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('拍次 B · 拟真界面卡片 + 等宽跳动指标 + ≤7% 视觉锤色', w / 2, h - 22);
    } else {
      const loc = t - 3.8;
      ctx.fillStyle = s.invBg;
      ctx.fillRect(0, 0, w, h);
      const p = easeOutBack(clamp(loc / 0.36, 0, 1));
      ctx.save();
      ctx.translate(w / 2, h / 2 - 4);
      ctx.scale(0.84 + 0.16 * p, 0.84 + 0.16 * p);
      ctx.fillStyle = s.hero;
      ctx.font = '900 54px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1,000,000', 0, -10);
      ctx.fillStyle = s.invFg;
      ctx.font = '800 16px -apple-system, "PingFang SC", sans-serif';
      ctx.fillText('拍次 C · 高潮章节一键底字反色，瞬间拉满呼吸反差', 0, 32);
      ctx.restore();
    }
  }

  /* 3. Draw 12 Distinct 60fps Video FX Canvases */
  const fxStates = new Map();
  document.querySelectorAll('[data-cv-fx-canvas]').forEach((cv) => {
    fxStates.set(cv, { id: cv.getAttribute('data-cv-fx-canvas'), t: 0, speed: 1.0 });
  });

  document.addEventListener('click', (e) => {
    const spBtn = e.target.closest('[data-cv-fx-speed]');
    if (spBtn) {
      const card = spBtn.closest('[data-cv-fx-card]');
      const cv = card && card.querySelector('[data-cv-fx-canvas]');
      const st = cv && fxStates.get(cv);
      if (st) {
        st.speed = st.speed === 1.0 ? 0.3 : 1.0;
        spBtn.classList.toggle('is-slow', st.speed < 1);
        spBtn.textContent = st.speed < 1 ? '0.3x 慢放中' : '1.0x 正常';
      }
      return;
    }
    const rpBtn = e.target.closest('[data-cv-fx-replay]');
    if (rpBtn) {
      const card = rpBtn.closest('[data-cv-fx-card]');
      const cv = card && card.querySelector('[data-cv-fx-canvas]');
      const st = cv && fxStates.get(cv);
      if (st) st.t = 0;
    }
  });

  function drawSingleFx(cv, st) {
    const { ctx, w, h } = setupHiDPICanvas(cv, 184);
    const s = SKINS[activeSkinKey] || SKINS.linear;
    const id = st.id;
    const t = st.t;

    if (id === 'clash') {
      const p = easeOutQuint(clamp(t / 0.34, 0, 1));
      const shake = t > 0.3 && t < 0.56 ? Math.sin(t * 120) * 5 * (1 - (t - 0.3) / 0.26) : 0;
      ctx.save();
      ctx.translate(shake, 0);
      ctx.fillStyle = s.bg;
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.beginPath();
      const splitX = lerp(w + 40, w * 0.52, p);
      ctx.moveTo(splitX + 24, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h);
      ctx.lineTo(splitX - 24, h);
      ctx.closePath();
      ctx.fillStyle = s.invBg;
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = s.fg;
      ctx.font = '900 32px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('×10', w * 0.26 * p, h * 0.48);
      ctx.font = '700 12px -apple-system, "PingFang SC", sans-serif';
      ctx.fillStyle = s.muted;
      ctx.fillText('身价暴涨', w * 0.26 * p, h * 0.68);

      ctx.fillStyle = s.hero;
      ctx.font = '900 32px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText('¥0', lerp(w + 60, w * 0.76, p), h * 0.48);
      ctx.font = '700 12px -apple-system, "PingFang SC", sans-serif';
      ctx.fillStyle = s.invFg;
      ctx.fillText('加速归零', lerp(w + 60, w * 0.76, p), h * 0.68);
      ctx.restore();
    } else if (id === 'stomp') {
      paintBackdrop(ctx, w, h, s);
      const pop = easeOutBack(clamp((t - 0.15) / 0.34, 0, 1));
      const bar = easeOutQuint(clamp((t - 0.38) / 0.36, 0, 1));
      const sh = t > 0.36 && t < 0.56 ? Math.cos(t * 130) * 3.5 : 0;
      ctx.save();
      ctx.translate(w / 2, h / 2 + sh);
      const sc = t < 0.15 ? 1.45 : lerp(1.45, 1.0, pop);
      ctx.scale(sc, sc);
      ctx.fillStyle = s.marker;
      ctx.fillRect(-108, 4, 216 * bar, 22);
      ctx.fillStyle = s.fg;
      ctx.font = '900 40px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (t >= 0.15) ctx.fillText('停止升级!', 0, 0);
      ctx.restore();
    } else if (id === 'rip') {
      paintBackdrop(ctx, w, h, s);
      if (t < 1.55) {
        const slash = easeOutQuint(clamp((t - 0.85) / 0.22, 0, 1));
        ctx.fillStyle = s.surface;
        ctx.strokeStyle = s.border;
        ctx.beginPath();
        ctx.roundRect(w / 2 - 118, h / 2 - 36, 236, 72, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = s.muted;
        ctx.font = '700 15px -apple-system, "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('大众错觉：死等下一代大模型', w / 2, h / 2);
        if (slash > 0) {
          ctx.strokeStyle = s.hero;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(w / 2 - 126, h / 2 + 38);
          ctx.lineTo(lerp(w / 2 - 126, w / 2 + 126, slash), lerp(h / 2 + 38, h / 2 - 38, slash));
          ctx.stroke();
        }
      } else {
        const p2 = easeOutBack(clamp((t - 1.55) / 0.36, 0, 1));
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(p2, p2);
        ctx.fillStyle = s.hero;
        ctx.font = '900 28px -apple-system, "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('现有算力够吃几十年！', 0, -4);
        ctx.fillStyle = s.muted;
        ctx.font = '700 12px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText('反常识暴论立住钩子', 0, 26);
        ctx.restore();
      }
    } else if (id === 'lock') {
      ctx.fillStyle = s.bg;
      ctx.fillRect(0, 0, w, h);
      const cw = Math.min(82, (w - 64) / 3);
      ['01 泥坑', '02 红线', '03 ???'].forEach((label, idx) => {
        const p = easeOutBack(clamp((t - 0.15 - idx * 0.14) / 0.35, 0, 1));
        if (p <= 0) return;
        const cx = w / 2 + (idx - 1) * (cw + 12);
        ctx.save();
        ctx.translate(cx, h / 2);
        ctx.scale(p, p);
        ctx.fillStyle = idx === 2 ? s.hero : s.surface;
        ctx.strokeStyle = idx === 2 ? s.hero : s.border;
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -40, cw, 80, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = idx === 2 ? '#FFFFFF' : s.fg;
        ctx.font = '800 13px -apple-system, "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 0, idx === 2 ? 12 : 0);
        if (idx === 2 && t > 1.0) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.arc(0, -14, 7, Math.PI, 0);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(-9, -14, 18, 13);
        }
        ctx.restore();
      });
    } else if (id === 'macro') {
      paintBackdrop(ctx, w, h, s);
      const pull = easeInOutQuint(clamp((t - 1.5) / 0.55, 0, 1));
      const z = lerp(2.15, 1.0, pull);
      const px = lerp(74, 0, pull);
      ctx.save();
      ctx.translate(w / 2 + px, h / 2);
      ctx.scale(z, z);
      ctx.fillStyle = s.surface;
      ctx.strokeStyle = s.border;
      ctx.beginPath();
      ctx.roundRect(-142, -44, 178, 88, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = s.muted;
      ctx.font = '700 9.5px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('新加微信小号 · 零成交', -128, -24);
      ctx.fillStyle = s.fg;
      ctx.font = '800 13px -apple-system, "PingFang SC", sans-serif';
      ctx.fillText('底价多少？留 500 台~', -128, 2);
      ctx.fillStyle = s.hero;
      ctx.font = '700 10px -apple-system, "PingFang SC", sans-serif';
      ctx.fillText('AI 拟执行：锁死全部库存', -128, 24);

      if (pull > 0.25) {
        const sp = easeOutBack(clamp((t - 1.8) / 0.36, 0, 1));
        ctx.save();
        ctx.translate(92, 0);
        ctx.scale(sp, sp);
        ctx.fillStyle = s.hero;
        ctx.beginPath();
        ctx.roundRect(-48, -32, 96, 64, 9);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.font = '900 13px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText('同行套价!', 0, -4);
        ctx.font = '700 10px -apple-system, "PingFang SC", sans-serif';
        ctx.fillText('急拉叫停', 0, 15);
        ctx.restore();
      }
      ctx.restore();
    } else if (id === 'portal') {
      if (t < 1.75) {
        paintBackdrop(ctx, w, h, s);
        let sc = 1;
        if (t > 0.7 && t < 1.02) sc = 1 - 0.09 * easeOutQuint((t - 0.7) / 0.32);
        else if (t >= 1.02) sc = 0.91 + 14.5 * easeInCubic((t - 1.02) / 0.73);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(sc, sc);
        ctx.fillStyle = s.fg;
        ctx.font = '900 28px -apple-system, "PingFang SC", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('归零 ¥', -14, 0);
        ctx.strokeStyle = s.hero;
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.arc(12, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.fillStyle = s.invBg;
        ctx.fillRect(0, 0, w, h);
        const p = easeOutBack(clamp((t - 1.75) / 0.4, 0, 1));
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(0.65 + 0.35 * p, 0.65 + 0.35 * p);
        ctx.fillStyle = s.invFg;
        ctx.font = '900 26px -apple-system, "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('穿孔一镜到底换新章', 0, 0);
        ctx.restore();
      }
    } else if (id === 'whip') {
      paintBackdrop(ctx, w, h, s);
      const wp = easeInOutQuint(clamp((t - 1.1) / 0.30, 0, 1));
      const off = -w * wp;
      ctx.save();
      ctx.translate(off, 0);
      ctx.fillStyle = s.fg;
      ctx.font = '900 26px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('旧章节：算力泡沫', w / 2, h / 2);

      ctx.fillStyle = s.invBg;
      ctx.fillRect(w, 0, w, h);
      ctx.fillStyle = s.hero;
      ctx.font = '900 28px -apple-system, "PingFang SC", sans-serif';
      ctx.fillText('新章节：一线真金', w * 1.5, h / 2);
      ctx.restore();

      if (wp > 0.06 && wp < 0.94) {
        ctx.fillStyle = s.hero;
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(20 + i * 32, 34 + i * 28, 120, 3);
        }
      }
    } else if (id === 'dive') {
      paintBackdrop(ctx, w, h, s);
      const dp = easeInOutQuint(clamp((t - 0.6) / 1.15, 0, 1));
      const camY = -h * dp;
      ctx.save();
      ctx.translate(0, camY);
      // Surface layer
      ctx.strokeStyle = s.muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(20, h * 0.72);
      ctx.lineTo(w - 20, h * 0.72);
      ctx.stroke();
      ctx.fillStyle = s.muted;
      ctx.font = '700 14px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('地表之上：PPT 空心概念泡沫', w / 2, h * 0.42);

      // Underground gold layer
      ctx.fillStyle = s.surface;
      ctx.fillRect(0, h, w, h);
      ctx.fillStyle = s.hero;
      ctx.font = '900 36px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText('$290亿 真金矿脉', w / 2, h * 1.48);
      ctx.fillStyle = s.muted;
      ctx.font = '700 12px -apple-system, "PingFang SC", sans-serif';
      ctx.fillText('垂直钻透岩层 · 专属于一线泥坑数据', w / 2, h * 1.72);
      ctx.restore();
    } else if (id === 'motif') {
      paintBackdrop(ctx, w, h, s);
      const cx = w / 2, cy = h / 2 - 8;
      let bw = 16, bh = 68, bx = cx, by = cy, cap = '① 探地钻头';
      if (t < 0.9) {
        by = lerp(cy - 8, cy + 14, easeOutQuint(t / 0.9));
      } else if (t < 1.8) {
        const p = easeInOutQuint((t - 0.9) / 0.45);
        bw = lerp(16, 196, p);
        bh = lerp(68, 9, p);
        cap = '② 旋转 90° 变激光红线';
      } else if (t < 2.7) {
        const p = easeOutBack(clamp((t - 1.8) / 0.45, 0, 1));
        bw = lerp(196, 94, p);
        bh = lerp(9, 48, p);
        cap = '③ 收拢重锤变扛雷方印';
      } else {
        const p = easeInOutQuint(clamp((t - 2.7) / 0.45, 0, 1));
        bx = lerp(cx, cx - 78, p);
        bw = lerp(94, 16, p);
        bh = lerp(48, 64, p);
        cap = '④ 归位立成 1,000,000 支柱';
        if (p > 0.4) {
          ctx.fillStyle = s.fg;
          ctx.font = '900 30px ui-monospace, SFMono-Regular, monospace';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(',000,000', cx - 62, cy);
        }
      }
      ctx.fillStyle = s.hero;
      ctx.beginPath();
      ctx.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 5);
      ctx.fill();
      ctx.fillStyle = s.muted;
      ctx.font = '700 11.5px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cap, cx, h - 18);
    } else if (id === 'laser') {
      paintBackdrop(ctx, w, h, s);
      // Conveyor belt
      ctx.strokeStyle = s.border;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, h * 0.72);
      ctx.lineTo(w - 20, h * 0.72);
      ctx.stroke();

      const laserX = w * 0.62;
      ctx.strokeStyle = s.hero;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(laserX, 20);
      ctx.lineTo(laserX, h * 0.72);
      ctx.stroke();

      const hitT = 1.35;
      const boxX = t < hitT ? lerp(36, laserX - 24, t / hitT) : laserX - 24 - Math.sin((t - hitT) * 28) * 5 * Math.max(0, 1 - (t - hitT));
      ctx.fillStyle = t >= hitT ? s.hero : s.surface;
      ctx.strokeStyle = s.border;
      ctx.beginPath();
      ctx.roundRect(boxX - 24, h * 0.72 - 36, 48, 34, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = t >= hitT ? s.hero : s.muted;
      ctx.font = '800 12px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t >= hitT ? '✕ 越权承诺已被激光拦截！' : '待检回复滑向验收红线…', w / 2, h - 18);
    } else if (id === 'cursor') {
      paintBackdrop(ctx, w, h, s);
      const clickT = 1.1;
      const pressed = t > clickT && t < clickT + 0.22;
      const btnSc = pressed ? 0.91 : 1.0;
      ctx.save();
      ctx.translate(w * 0.32, h * 0.5);
      ctx.scale(btnSc, btnSc);
      ctx.fillStyle = t > clickT ? s.hero : s.surface;
      ctx.strokeStyle = s.border;
      ctx.beginPath();
      ctx.roundRect(-56, -22, 112, 44, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = t > clickT ? '#FFFFFF' : s.fg;
      ctx.font = '800 13px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(t > clickT ? '✓ 已激活杠杆' : '点击部署 Skill', 0, 0);
      ctx.restore();

      // Bezier cursor
      const cp = easeInOutQuint(clamp(t / clickT, 0, 1));
      const cx = lerp(w * 0.10, w * 0.35, cp);
      const cy = lerp(h * 0.84, h * 0.56, cp) - Math.sin(cp * Math.PI) * 26;
      ctx.fillStyle = s.fg;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 12, cy + 5);
      ctx.lineTo(cx + 5, cy + 13);
      ctx.closePath();
      ctx.fill();

      if (t > clickT) {
        const rp = clamp((t - clickT) / 0.55, 0, 1);
        ctx.strokeStyle = s.hero;
        ctx.globalAlpha = 1 - rp;
        ctx.beginPath();
        ctx.arc(w * 0.32, h * 0.5, 10 + 34 * rp, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const val = t < clickT ? 12 : Math.round(12 + 970 * easeOutQuint(clamp((t - clickT) / 1.1, 0, 1)));
      ctx.fillStyle = s.fg;
      ctx.font = '900 32px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${val}%`, w * 0.74, h * 0.5);
    } else {
      // physics
      paintBackdrop(ctx, w, h, s);
      ctx.strokeStyle = s.border;
      ctx.beginPath();
      ctx.moveTo(w / 2, 16);
      ctx.lineTo(w / 2, h - 16);
      ctx.stroke();

      const lp = clamp((t - 0.3) / 0.6, 0, 1);
      const ly = lerp(h * 0.72, h * 0.36, lp);
      ctx.fillStyle = s.surface;
      ctx.strokeStyle = s.border;
      ctx.beginPath();
      ctx.roundRect(w * 0.25 - 56, ly - 19, 112, 38, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = s.muted;
      ctx.font = '700 12px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✕ 匀速电梯', w * 0.25, ly);

      let ry = h * 0.72, sx = 1, sy = 1;
      if (t >= 0.16 && t < 0.34) {
        const ap = easeOutQuint((t - 0.16) / 0.18);
        ry = h * 0.72 + 10 * ap;
        sx = 1 + 0.09 * ap;
        sy = 1 - 0.09 * ap;
      } else if (t >= 0.34) {
        const sp = clamp((t - 0.34) / 0.58, 0, 1);
        ry = lerp(h * 0.72 + 10, h * 0.36, easeOutBack(sp));
      }
      const tp = clamp((t - 0.39) / 0.62, 0, 1);
      const lag = t >= 0.34 ? (lerp(h * 0.72 + 10, h * 0.36, easeOutBack(tp)) - ry) * 0.7 : 0;

      ctx.save();
      ctx.translate(w * 0.75, ry);
      ctx.scale(sx, sy);
      ctx.fillStyle = s.hero;
      ctx.beginPath();
      ctx.roundRect(-60, -20, 120, 40, 9);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 12.5px -apple-system, "PingFang SC", sans-serif';
      ctx.fillText('✓ 蓄力+滞后', 0, lag);
      ctx.restore();
    }
  }

  /* 4. 4-Track Spring Physics Comparator */
  const springStates = new Map();
  document.querySelectorAll('[data-cv-springs]').forEach((box) => {
    const cv = box.querySelector('[data-cv-springs-canvas]');
    if (cv) springStates.set(cv, { t: 0, speed: 1.0 });
  });

  document.addEventListener('click', (e) => {
    const spReplay = e.target.closest('[data-cv-sp-replay]');
    if (spReplay) {
      const box = spReplay.closest('[data-cv-springs]');
      const cv = box && box.querySelector('[data-cv-springs-canvas]');
      const st = cv && springStates.get(cv);
      if (st) st.t = 0;
      return;
    }
    const spSpeed = e.target.closest('[data-cv-sp-speed]');
    if (spSpeed) {
      const box = spSpeed.closest('[data-cv-springs]');
      const cv = box && box.querySelector('[data-cv-springs-canvas]');
      const st = cv && springStates.get(cv);
      if (st) {
        st.speed = st.speed === 1.0 ? 0.3 : 1.0;
        spSpeed.textContent = `速度 ${st.speed.toFixed(1)}x`;
      }
      return;
    }
    const spCopy = e.target.closest('[data-cv-sp-copy]');
    if (spCopy) {
      copyText(
        `export const CAMERA_SPRING = { stiffness: 150, damping: 26, mass: 1.1 }; // 沉稳推拉零回弹\nexport const CARD_SPRING   = { stiffness: 220, damping: 19, mass: 1.0 }; // 主体卡片清脆入场\nexport const TAP_SPRING    = { stiffness: 340, damping: 15, mass: 0.8 }; // 印章/按钮带蓄力脆弹`,
        '✦ 已复制三档标准物理弹簧常量'
      );
    }
  });

  function drawSpringsLab(cv, st) {
    const { ctx, w, h } = setupHiDPICanvas(cv, 228);
    const s = SKINS[activeSkinKey] || SKINS.linear;
    paintBackdrop(ctx, w, h, s);

    const xStart = Math.min(210, w * 0.34);
    const xEnd = w - 48;
    // Target finish line
    ctx.strokeStyle = s.border;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xEnd, 18);
    ctx.lineTo(xEnd, h - 18);
    ctx.stroke();
    ctx.setLineDash([]);

    const tracks = [
      { name: '✕ linear 机械匀速', val: clamp((st.t - 0.2) / 0.7, 0, 1), col: s.muted },
      { name: 'CAMERA (沉稳推拉)', val: evalSpring(st.t - 0.2, 11, 0.96), col: '#2563EB' },
      { name: 'CARD (清脆微弹)', val: evalSpring(st.t - 0.2, 14.5, 0.64), col: '#10B981' },
      {
        name: 'TAP (蓄力下蹲脆弹)',
        val: st.t < 0.2 ? -0.07 * easeOutQuint(st.t / 0.2) : evalSpring(st.t - 0.2, 18.5, 0.48),
        col: s.hero,
      },
    ];

    tracks.forEach((tr, idx) => {
      const y = 36 + idx * 48;
      ctx.fillStyle = s.fg;
      ctx.font = '700 12px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(tr.name, 18, y);

      ctx.strokeStyle = s.border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xStart, y);
      ctx.lineTo(xEnd, y);
      ctx.stroke();

      const px = lerp(xStart, xEnd, tr.val);
      ctx.fillStyle = tr.col;
      ctx.beginPath();
      ctx.roundRect(px - 16, y - 12, 32, 24, 7);
      ctx.fill();
    });
  }

  /* 5. Interactive Flipbook & Flashlight Demo */
  const fbStates = new Map();
  document.querySelectorAll('[data-cv-flipbook]').forEach((box) => {
    const cv = box.querySelector('[data-cv-flipbook-canvas]');
    if (cv) {
      fbStates.set(cv, {
        box,
        mode: 'flashlight',
        playing: true,
        t: 0,
        rangeEl: box.querySelector('[data-cv-fb-range]'),
        timeEl: box.querySelector('[data-cv-fb-time]'),
        playBtn: box.querySelector('[data-cv-fb-play]'),
      });
    }
  });

  document.addEventListener('click', (e) => {
    const modeBtn = e.target.closest('[data-cv-fb-mode]');
    if (modeBtn) {
      const box = modeBtn.closest('[data-cv-flipbook]');
      const cv = box && box.querySelector('[data-cv-flipbook-canvas]');
      const st = cv && fbStates.get(cv);
      if (st) {
        st.mode = modeBtn.getAttribute('data-cv-fb-mode') || 'flashlight';
        st.t = 0;
        box.querySelectorAll('[data-cv-fb-mode]').forEach((b) => b.classList.toggle('is-active', b === modeBtn));
        drawFlipbook(cv, st);
      }
      return;
    }
    const playBtn = e.target.closest('[data-cv-fb-play]');
    if (playBtn) {
      const box = playBtn.closest('[data-cv-flipbook]');
      const cv = box && box.querySelector('[data-cv-flipbook-canvas]');
      const st = cv && fbStates.get(cv);
      if (st) {
        st.playing = !st.playing;
        playBtn.textContent = st.playing ? '暂停' : '播放';
      }
    }
  });

  document.addEventListener('input', (e) => {
    const range = e.target.closest('[data-cv-fb-range]');
    if (!range) return;
    const box = range.closest('[data-cv-flipbook]');
    const cv = box && box.querySelector('[data-cv-flipbook-canvas]');
    const st = cv && fbStates.get(cv);
    if (st) {
      st.playing = false;
      if (st.playBtn) st.playBtn.textContent = '播放';
      st.t = parseFloat(range.value) || 0;
      if (st.timeEl) st.timeEl.textContent = `t = ${st.t.toFixed(2)}s (Frame ${String(Math.round(st.t * 60)).padStart(3, '0')})`;
      drawFlipbook(cv, st);
    }
  });

  function drawFlipbook(cv, st) {
    const { ctx, w, h } = setupHiDPICanvas(cv, 248);
    const s = SKINS[activeSkinKey] || SKINS.linear;
    if (st.mode === 'bento') {
      ctx.fillStyle = '#0D1017';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#FCA5A5';
      ctx.font = '800 12.5px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('✕ 反面教材：同屏塞满双霓虹框 + 80 个小字静止不动，观众 2 秒划走', 22, 28);
      const cw = (w - 58) / 2;
      ctx.strokeStyle = 'rgba(239,68,68,0.55)';
      ctx.fillStyle = 'rgba(239,68,68,0.08)';
      ctx.beginPath(); ctx.roundRect(22, 44, cw, 176, 12); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(16,185,129,0.55)';
      ctx.fillStyle = 'rgba(16,185,129,0.08)';
      ctx.beginPath(); ctx.roundRect(36 + cw, 44, cw, 176, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '500 12px -apple-system, "PingFang SC", sans-serif';
      ['MODULE 01 · 旧模式困境', '· 标准答案与题库快速贬值', '· 重复周报模板沦为免费算力', '· 缺乏真实业务场景壁垒'].forEach((ln, i) => ctx.fillText(ln, 36, 74 + i * 30));
      ['MODULE 02 · 新时代破局', '· 深入一线泥坑采集非标数据', '· 制定高标准自动化验收红线', '· 关键节点签字拍板承担责任'].forEach((ln, i) => ctx.fillText(ln, 50 + cw, 74 + i * 30));
      return;
    }

    paintBackdrop(ctx, w, h, s);
    if (st.t < 2.1) {
      const pop = easeOutBack(clamp(st.t / 0.38, 0, 1));
      const bar = easeOutQuint(clamp((st.t - 0.15) / 0.42, 0, 1));
      ctx.save();
      ctx.translate(w / 2, h / 2 - 4);
      ctx.scale(1.24 - 0.24 * pop, 1.24 - 0.24 * pop);
      ctx.fillStyle = s.marker;
      ctx.fillRect(-144, 4, 288 * bar, 26);
      ctx.fillStyle = s.fg;
      ctx.font = '900 52px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('敢拍板兜底', 0, 0);
      ctx.restore();
      ctx.fillStyle = s.muted;
      ctx.font = '700 12.5px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('0.0s–2.1s · 关灯打手电筒：留白 75%，一秒只照亮 1 个核心词', w / 2, h - 20);
    } else {
      const loc = st.t - 2.1;
      const num = Math.round(1 + 99 * easeOutQuint(clamp(loc / 0.8, 0, 1)));
      const sc = 0.84 + 0.16 * easeOutBack(clamp(loc / 0.4, 0, 1));
      ctx.save();
      ctx.translate(w / 2, h / 2 - 8);
      ctx.scale(sc, sc);
      ctx.fillStyle = s.hero;
      ctx.font = '900 68px ui-monospace, SFMono-Regular, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`×${num}`, 0, 0);
      ctx.restore();
      ctx.fillStyle = s.muted;
      ctx.font = '700 12.5px -apple-system, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2.1s–4.2s · 下一拍无缝切入单焦点数字视觉锤！', w / 2, h - 20);
    }
  }

  let skinTime = 0;
  function renderAllOnce() {
    document.querySelectorAll('[data-cv-skin-canvas]').forEach((cv) => drawSkinStage(cv, skinTime));
    fxStates.forEach((st, cv) => drawSingleFx(cv, st));
    springStates.forEach((st, cv) => drawSpringsLab(cv, st));
    fbStates.forEach((st, cv) => drawFlipbook(cv, st));
  }

  window.addEventListener('resize', () => {
    document.querySelectorAll('[data-cv-skin-canvas], [data-cv-fx-canvas], [data-cv-springs-canvas], [data-cv-flipbook-canvas]').forEach((c) => {
      c._lw = 0;
    });
    renderAllOnce();
  }, { passive: true });

  let lastTs = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - lastTs) / 1000);
    lastTs = now;

    skinTime += dt;
    document.querySelectorAll('[data-cv-skin-canvas]').forEach((cv) => {
      if (visibleElements.has(cv)) drawSkinStage(cv, skinTime);
    });

    fxStates.forEach((st, cv) => {
      if (!visibleElements.has(cv)) return;
      st.t = (st.t + dt * st.speed) % 3.4;
      drawSingleFx(cv, st);
    });

    springStates.forEach((st, cv) => {
      if (!visibleElements.has(cv)) return;
      st.t = (st.t + dt * st.speed) % 2.8;
      drawSpringsLab(cv, st);
    });

    fbStates.forEach((st, cv) => {
      if (!visibleElements.has(cv) || !st.playing) return;
      st.t = (st.t + dt) % 4.2;
      if (st.rangeEl) st.rangeEl.value = st.t.toFixed(2);
      if (st.timeEl) st.timeEl.textContent = `t = ${st.t.toFixed(2)}s (Frame ${String(Math.round(st.t * 60)).padStart(3, '0')})`;
      drawFlipbook(cv, st);
    });

    requestAnimationFrame(loop);
  }

  syncSkinStudios();
  renderAllOnce();
  requestAnimationFrame(loop);
})();


/* =============================================================================
   V15 · UNIFIED 3-COLUMN COLLAPSIBLE READER & INTERACTIVE JARGON TRANSLATOR
   ============================================================================= */
(function () {
  const triRoot = document.getElementById('tri-reader-root');
  const sheet = document.getElementById('reader-sheet');
  const resetBtn = document.getElementById('tri-reset-display');
  const hairlineFill = document.getElementById('tri-hairline-fill');
  const remainEl = document.getElementById('rail-remain-time');
  const STORE_KEY = 'orbit-tri-reader-prefs-v2';

  if (triRoot && sheet) {
    const isNarrow = window.matchMedia('(max-width: 1120px)').matches;
    const DEFAULTS = {
      left: isNarrow ? 'closed' : 'open',
      right: isNarrow ? 'closed' : 'open',
      font: 'sans',
      size: 'md',
      leading: 'normal',
      measure: 'normal',
    };
    let state = { ...DEFAULTS };
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        state = {
          ...state,
          font: saved.font || state.font,
          size: saved.size || state.size,
          leading: saved.leading || state.leading,
          measure: saved.measure || state.measure,
          ...(isNarrow ? {} : { left: saved.left || state.left, right: saved.right || state.right }),
        };
      }
    } catch (e) {}

    function save() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function applyState() {
      triRoot.setAttribute('data-left', state.left);
      triRoot.setAttribute('data-right', state.right);
      sheet.setAttribute('data-font', state.font);
      sheet.setAttribute('data-size', state.size);
      sheet.setAttribute('data-leading', state.leading);
      sheet.setAttribute('data-measure', state.measure);

      const bothClosed = state.left === 'closed' && state.right === 'closed';
      document.querySelectorAll('.tri-pane-btn[data-tri-toggle="left"]').forEach((b) =>
        b.classList.toggle('is-on', state.left === 'open')
      );
      document.querySelectorAll('.tri-pane-btn[data-tri-toggle="right"]').forEach((b) =>
        b.classList.toggle('is-on', state.right === 'open')
      );
      document.querySelectorAll('[data-tri-focus]').forEach((b) => {
        b.classList.toggle('is-on', bothClosed);
        const lbl = b.querySelector('[data-tri-focus-label]');
        if (lbl) lbl.textContent = bothClosed ? '退出专注' : '专注居中';
      });

      ['font', 'size', 'leading', 'measure'].forEach((attr) => {
        document.querySelectorAll(`[data-${attr}]`).forEach((btn) => {
          btn.classList.toggle('is-active', btn.getAttribute(`data-${attr}`) === state[attr]);
        });
      });

      if (resetBtn) {
        const customized =
          state.font !== 'sans' || state.size !== 'md' || state.leading !== 'normal' || state.measure !== 'normal';
        resetBtn.hidden = !customized;
      }

      // Trigger canvas resize if any interactive canvas exists inside article
      window.dispatchEvent(new Event('resize'));
    }

    function syncHairlineAndRemain() {
      const rect = sheet.getBoundingClientRect();
      const viewH = window.innerHeight || document.documentElement.clientHeight;
      const total = Math.max(1, rect.height - viewH * 0.55);
      const passed = Math.min(total, Math.max(0, -rect.top + viewH * 0.28));
      const ratio = passed / total;
      const pct = Math.round(ratio * 100);
      if (hairlineFill) hairlineFill.style.width = `${pct}%`;
      if (remainEl) {
        const totalMins = Number(remainEl.getAttribute('data-total-mins')) || 8;
        if (pct >= 96) {
          remainEl.textContent = '已读至文末 ✓';
        } else {
          const leftMins = Math.max(1, Math.ceil(totalMins * (1 - ratio)));
          remainEl.textContent = pct <= 3 ? `全文约 ${totalMins} 分钟` : `还剩约 ${leftMins} 分钟`;
        }
      }
    }

    window.addEventListener('scroll', syncHairlineAndRemain, { passive: true });
    window.addEventListener('resize', syncHairlineAndRemain, { passive: true });

    document.addEventListener('click', async (e) => {
      const sideBtn = e.target.closest('[data-tri-toggle]');
      if (sideBtn) {
        const side = sideBtn.getAttribute('data-tri-toggle');
        if (side === 'left' || side === 'right') {
          state[side] = state[side] === 'open' ? 'closed' : 'open';
          applyState();
          save();
        }
        return;
      }
      const focusBtn = e.target.closest('[data-tri-focus]');
      if (focusBtn) {
        const bothClosed = state.left === 'closed' && state.right === 'closed';
        state.left = bothClosed ? 'open' : 'closed';
        state.right = bothClosed ? 'open' : 'closed';
        applyState();
        save();
        return;
      }
      if (resetBtn && e.target.closest('#tri-reset-display')) {
        state.font = 'sans';
        state.size = 'md';
        state.leading = 'normal';
        state.measure = 'normal';
        applyState();
        save();
        return;
      }
      const copyUrlBtn = e.target.closest('[data-copy-page-url]');
      if (copyUrlBtn) {
        try { await navigator.clipboard.writeText(window.location.href); } catch (err) {}
        const toastEl = document.getElementById('orbit-toast');
        if (toastEl) {
          toastEl.textContent = '✦ 已复制本文链接';
          toastEl.hidden = false;
          setTimeout(() => { toastEl.hidden = true; }, 2000);
        }
        return;
      }
      const tocLink = e.target.closest('.tri-toc-list a');
      if (tocLink && window.matchMedia('(max-width: 1120px)').matches) {
        state.left = 'closed';
        applyState();
      }
      for (const attr of ['font', 'size', 'leading', 'measure']) {
        const optBtn = e.target.closest(`[data-${attr}]`);
        if (optBtn && triRoot.contains(optBtn)) {
          state[attr] = optBtn.getAttribute(`data-${attr}`);
          applyState();
          save();
          return;
        }
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
      if (e.key === '[') {
        state.left = state.left === 'open' ? 'closed' : 'open';
        applyState();
        save();
      } else if (e.key === ']') {
        state.right = state.right === 'open' ? 'closed' : 'open';
        applyState();
        save();
      } else if (e.key === '\\') {
        const bothClosed = state.left === 'closed' && state.right === 'closed';
        state.left = bothClosed ? 'open' : 'closed';
        state.right = bothClosed ? 'open' : 'closed';
        applyState();
        save();
      }
    });

    applyState();
    syncHairlineAndRemain();
  }

  /* Interactive 3-Scenario Jargon vs Plain Clarity Switcher */
  const JT_SCENARIOS = [
    {
      bad: '「我们这个新协议基于异步拜占庭容错共识与跨链原子交换原语，重构了去信任化流动性层……」',
      badNote: '听众反应：端着早上的咖啡越听越不信，心里只想念安静。',
      good: '「两个人不用找银行或中间人担保，就能直接在网上把各自手里的东西安全换过来，谁也骗不了谁。」',
      goodNote: '听众反应：三秒钟听懂这件事到底有什么用，立刻愿意接着往下聊。',
    },
    {
      bad: '「本季度我们通过全链路智能化触点矩阵赋能业务抓手，打通了私域转化生态的协同闭环。」',
      badNote: '听众反应：每个字都认识，连在一起不知道你到底干成了什么，只觉得心虚。',
      good: '「以前客服回一个询盘要翻三张表花 10 分钟，现在点一下自动带出历史报价，30 秒就能回完。」',
      goodNote: '听众反应：画面感极强，价值和省下的时间清清楚楚，当场点头。',
    },
    {
      bad: '「所谓费曼学习法，本质上是一种基于认知建构主义的高阶元认知输出倒逼输入机制。」',
      badNote: '听众反应：拿新术语去解释旧术语，连自己都没真正消化透。',
      good: '「假装对面坐着一个十二岁小孩，不用任何行话给他讲明白；卡住讲不顺的地方，就是你自己还没真懂的裂缝。」',
      goodNote: '听众反应：小孩子能懂，大人更懂，而且马上就能照着做。',
    },
  ];

(function () {
  const board = document.getElementById('memo-board');
  if (!board) return;
  const KEY = 'orbit-memos';
  const IMAGE_CAP = 6;
  const openList = board.querySelector('#memo-open');
  const doneList = board.querySelector('#memo-done');
  const form = board.querySelector('#memo-form');
  const input = board.querySelector('#memo-input');
  const countEl = board.querySelector('#memo-count');
  const doneWrap = board.querySelector('#memo-done-wrap');
  const doneToggle = board.querySelector('#memo-done-toggle');
  const donePanel = board.querySelector('#memo-done-panel');
  const clearBtn = board.querySelector('#memo-clear');
  const dayEl = board.querySelector('#memo-day');
  const findEl = board.querySelector('#memo-find');
  const fileInput = board.querySelector('#memo-file');
  let items = [];
  let doneOpen = false;
  let dragId = '';
  let view = 'hand';
  let query = '';
  let expandedId = '';
  let fileTargetId = '';
  let shotNote = '';
  const urls = new Map();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (Array.isArray(saved)) {
      items = saved.filter((item) => item && typeof item.text === 'string').map((item) => {
        const next = {
          id: typeof item.id === 'string' && item.id ? item.id : (Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
          text: item.text,
          done: Boolean(item.done),
        };
        const level = Number(item.priority);
        if (level === 1 || level === 2 || level === 3) next.priority = level;
        if (typeof item.note === 'string' && item.note.trim()) next.note = item.note.slice(0, 4000);
        if (typeof item.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.day)) next.day = item.day;
        if (Array.isArray(item.images)) {
          const images = item.images.filter((id) => typeof id === 'string' && id).slice(0, 6);
          if (images.length) next.images = images;
        }
        return next;
      });
    }
  } catch (e) {}

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  };

  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const todayStamp = (offset = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  };
  const dayLabel = (stamp) => {
    if (!stamp) return '';
    if (stamp === todayStamp(0)) return '今天';
    if (stamp === todayStamp(1)) return '明天';
    if (stamp === todayStamp(-1)) return '昨天';
    const parts = stamp.split('-').map(Number);
    if (parts[0] === new Date().getFullYear()) return parts[1] + '月' + parts[2] + '日';
    return parts[0] + '年' + parts[1] + '月' + parts[2] + '日';
  };
  let dbPromise = null;
  const db = () => {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open('orbit-memo', 1);
        req.onupgradeneeded = () => {
          if (!req.result.objectStoreNames.contains('images')) req.result.createObjectStore('images');
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }).catch((err) => {
        dbPromise = null;
        throw err;
      });
    }
    return dbPromise;
  };
  const idbPut = async (id, blob) => {
    const base = await db();
    await new Promise((resolve, reject) => {
      const tx = base.transaction('images', 'readwrite');
      tx.objectStore('images').put(blob, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  };
  const idbGet = async (ids) => {
    if (!ids.length) return [];
    const base = await db();
    return new Promise((resolve, reject) => {
      const tx = base.transaction('images', 'readonly');
      const store = tx.objectStore('images');
      const out = [];
      ids.forEach((id) => {
        const req = store.get(id);
        req.onsuccess = () => { if (req.result) out.push([id, req.result]); };
      });
      tx.oncomplete = () => resolve(out);
      tx.onerror = () => reject(tx.error);
    });
  };
  const forgetImages = async (ids) => {
    ids.forEach((id) => {
      const url = urls.get(id);
      if (url) URL.revokeObjectURL(url);
      urls.delete(id);
    });
    if (!ids.length) return;
    try {
      const base = await db();
      await new Promise((resolve, reject) => {
        const tx = base.transaction('images', 'readwrite');
        ids.forEach((id) => tx.objectStore('images').delete(id));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {}
  };
  const compressImage = (file) => new Promise((resolve, reject) => {
    const local = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(local);
        if (blob) resolve(blob);
        else reject(new Error('empty'));
      }, 'image/jpeg', 0.82);
    };
    img.onerror = () => {
      URL.revokeObjectURL(local);
      reject(new Error('read'));
    };
    img.src = local;
  });
  const addImages = async (item, files) => {
    const list = item.images ? item.images.slice() : [];
    const batch = [...files].filter((file) => file && file.type && file.type.startsWith('image/')).slice(0, IMAGE_CAP - list.length);
    if (!batch.length) {
      shotNote = list.length >= IMAGE_CAP ? '一条最多 6 张截图。' : '这张图读不了。';
      render();
      return;
    }
    let stored = 0;
    for (const file of batch) {
      try {
        const blob = await compressImage(file);
        const id = 'img-' + newId();
        await idbPut(id, blob);
        urls.set(id, URL.createObjectURL(blob));
        list.push(id);
        stored += 1;
      } catch (e) {}
    }
    if (stored) {
      item.images = list;
      shotNote = '';
      save();
    } else shotNote = '这张图没存下。';
    render();
  };
  const light = document.createElement('div');
  light.className = 'memo-light';
  light.hidden = true;
  const lightImg = document.createElement('img');
  lightImg.alt = '';
  light.appendChild(lightImg);
  light.addEventListener('click', () => { light.hidden = true; });
  document.body.appendChild(light);
  const openLight = (url) => {
    if (!url) return;
    lightImg.src = url;
    light.hidden = false;
  };
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !light.hidden) light.hidden = true;
  });

  const priorityOf = (item) => (item.priority === 1 || item.priority === 2 || item.priority === 3) ? item.priority : 0;
  const priorityLabel = { 1: '低', 2: '中', 3: '高' };
  const nextPriority = (level) => (level === 3 ? 2 : level === 2 ? 1 : level === 1 ? 0 : 3);

  const move = (item, dir, group) => {
    const from = group.indexOf(item);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= group.length) return;
    const other = group[to];
    const a = items.indexOf(item);
    const b = items.indexOf(other);
    items[a] = other;
    items[b] = item;
    save();
    render();
  };

  const place = (id, targetId, after) => {
    if (!id || id === targetId) return;
    const item = items.find((entry) => entry.id === id);
    const target = items.find((entry) => entry.id === targetId);
    if (!item || !target || Boolean(item.done) !== Boolean(target.done)) return;
    const rest = items.filter((entry) => entry !== item);
    let idx = rest.indexOf(target);
    if (after) idx += 1;
    rest.splice(idx, 0, item);
    items = rest;
    save();
    render();
  };

  const row = (item, index, group) => {
    const li = document.createElement('li');
    const openHere = expandedId === item.id;
    const hasBody = Boolean(item.note || (item.images && item.images.length) || item.day || openHere);
    li.className = 'memo-item' + (item.done ? ' is-done' : '') + (hasBody ? ' is-rich' : '');
    const grip = document.createElement('button');
    grip.type = 'button';
    grip.className = 'memo-grip';
    grip.draggable = true;
    grip.setAttribute('aria-label', '拖动调整顺序');
    grip.addEventListener('dragstart', (event) => {
      dragId = item.id;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.id);
      event.dataTransfer.setDragImage(li, 20, 18);
      li.classList.add('is-dragging');
    });
    grip.addEventListener('dragend', () => {
      dragId = '';
      li.classList.remove('is-dragging');
    });
    const check = document.createElement('button');
    check.type = 'button';
    check.className = 'memo-check';
    check.setAttribute('aria-label', item.done ? '还原这一条' : '划掉这一条');
    check.addEventListener('click', () => {
      item.done = !item.done;
      save();
      render();
    });
    const pri = document.createElement('button');
    pri.type = 'button';
    const level = priorityOf(item);
    pri.className = 'memo-pri' + (level ? ' is-set is-' + level : '');
    pri.textContent = priorityLabel[level] || '标';
    pri.setAttribute('aria-label', level ? ('优先级' + priorityLabel[level] + '，点击更换') : '标优先级');
    pri.addEventListener('click', () => {
      const next = nextPriority(level);
      if (next) item.priority = next;
      else delete item.priority;
      save();
      render();
    });
    const text = document.createElement('span');
    text.className = 'memo-text';
    text.textContent = item.text;
    text.addEventListener('click', () => {
      const field = document.createElement('input');
      field.className = 'memo-edit';
      field.value = item.text;
      field.setAttribute('aria-label', '修改这一条');
      text.replaceWith(field);
      field.focus();
      field.select();
      let closed = false;
      const commit = () => {
        if (closed) return;
        closed = true;
        const next = field.value.trim();
        if (next) item.text = next;
        save();
        render();
      };
      field.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        } else if (e.key === 'Escape') {
          closed = true;
          render();
        }
      });
      field.addEventListener('blur', commit);
    });
    const up = document.createElement('button');
    up.type = 'button';
    up.className = 'memo-move';
    up.textContent = '↑';
    up.disabled = index === 0;
    up.setAttribute('aria-label', '上移');
    up.addEventListener('click', () => move(item, -1, group));
    const down = document.createElement('button');
    down.type = 'button';
    down.className = 'memo-move';
    down.textContent = '↓';
    down.disabled = index === group.length - 1;
    down.setAttribute('aria-label', '下移');
    down.addEventListener('click', () => move(item, 1, group));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'memo-x';
    remove.setAttribute('aria-label', '删掉这一条');
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      const gone = item.images ? item.images.slice() : [];
      items = items.filter((entry) => entry.id !== item.id);
      if (expandedId === item.id) expandedId = '';
      save();
      render();
      forgetImages(gone);
    });
    li.addEventListener('dragover', (event) => {
      if (!dragId || dragId === item.id) return;
      event.preventDefault();
      const after = event.clientY > li.getBoundingClientRect().top + li.offsetHeight / 2;
      li.classList.toggle('is-drop-before', !after);
      li.classList.toggle('is-drop-after', after);
    });
    li.addEventListener('dragleave', () => {
      li.classList.remove('is-drop-before', 'is-drop-after');
    });
    li.addEventListener('drop', (event) => {
      event.preventDefault();
      const after = li.classList.contains('is-drop-after');
      li.classList.remove('is-drop-before', 'is-drop-after');
      place(dragId || event.dataTransfer.getData('text/plain'), item.id, after);
    });
    const main = document.createElement('div');
    main.className = 'memo-main';
    main.appendChild(text);
    if (item.note && !openHere) {
      const preview = document.createElement('p');
      preview.className = 'memo-preview';
      preview.textContent = item.note.replace(/\s+/g, ' ').trim();
      preview.addEventListener('click', () => {
        expandedId = item.id;
        render();
      });
      main.appendChild(preview);
    }
    if (item.images && item.images.length && !openHere) {
      const mini = document.createElement('div');
      mini.className = 'memo-mini';
      item.images.forEach((id) => {
        const img = document.createElement('img');
        img.alt = '';
        img.setAttribute('data-shot', id);
        if (urls.has(id)) img.src = urls.get(id);
        img.addEventListener('click', () => openLight(urls.get(id)));
        mini.appendChild(img);
      });
      main.appendChild(mini);
    }
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'memo-more' + (hasBody ? ' is-set' : '');
    more.textContent = openHere ? '收起' : '记下';
    more.setAttribute('aria-expanded', openHere ? 'true' : 'false');
    more.addEventListener('click', () => {
      expandedId = openHere ? '' : item.id;
      shotNote = '';
      render();
    });
    let when = null;
    if (item.day) {
      when = document.createElement('button');
      when.type = 'button';
      when.className = 'memo-when' + (!item.done && item.day < todayStamp() ? ' is-late' : '');
      when.textContent = dayLabel(item.day);
      when.addEventListener('click', () => {
        expandedId = item.id;
        render();
      });
    }
    const bits = [grip, check, pri, main];
    if (when) bits.push(when);
    bits.push(more, up, down, remove);
    li.append(...bits);
    if (openHere) li.appendChild(buildPanel(item));
    return li;
  };

  const buildPanel = (item) => {
    const panel = document.createElement('div');
    panel.className = 'memo-panel';
    const note = document.createElement('textarea');
    note.className = 'memo-note';
    note.maxLength = 4000;
    note.placeholder = '把想法写在这里';
    note.setAttribute('aria-label', '这一条的备忘');
    note.value = item.note || '';
    let noteTimer = 0;
    const commitNote = () => {
      const value = note.value.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
      if (value.trim()) item.note = value.slice(0, 4000);
      else delete item.note;
      save();
    };
    note.addEventListener('input', () => {
      window.clearTimeout(noteTimer);
      noteTimer = window.setTimeout(commitNote, 250);
    });
    note.addEventListener('blur', () => {
      window.clearTimeout(noteTimer);
      commitNote();
    });
    const rowLine = document.createElement('div');
    rowLine.className = 'memo-panel-row';
    const setDay = (day) => {
      if (day) item.day = day;
      else delete item.day;
      save();
      render();
    };
    [['今天', todayStamp(0)], ['明天', todayStamp(1)]].forEach(([label, day]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'memo-chip' + (item.day === day ? ' is-on' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => setDay(item.day === day ? '' : day));
      rowLine.appendChild(btn);
    });
    const date = document.createElement('input');
    date.type = 'date';
    date.className = 'memo-date';
    date.value = item.day || '';
    date.setAttribute('aria-label', '选一天');
    date.addEventListener('change', () => setDay(date.value));
    rowLine.appendChild(date);
    if (item.day) {
      const clearDay = document.createElement('button');
      clearDay.type = 'button';
      clearDay.className = 'memo-chip';
      clearDay.textContent = '不设日子';
      clearDay.addEventListener('click', () => setDay(''));
      rowLine.appendChild(clearDay);
    }
    const addShot = document.createElement('button');
    addShot.type = 'button';
    addShot.className = 'memo-chip';
    addShot.textContent = '加截图';
    addShot.addEventListener('click', () => {
      fileTargetId = item.id;
      if (fileInput) fileInput.click();
    });
    rowLine.appendChild(addShot);
    panel.append(note, rowLine);
    if (item.images && item.images.length) {
      const strip = document.createElement('div');
      strip.className = 'memo-shots';
      item.images.forEach((id) => {
        const fig = document.createElement('figure');
        const img = document.createElement('img');
        img.alt = '';
        img.setAttribute('data-shot', id);
        if (urls.has(id)) img.src = urls.get(id);
        img.addEventListener('click', () => openLight(urls.get(id)));
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'memo-shot-x';
        x.textContent = '×';
        x.setAttribute('aria-label', '去掉这张截图');
        x.addEventListener('click', () => {
          item.images = item.images.filter((entry) => entry !== id);
          if (!item.images.length) delete item.images;
          save();
          render();
          forgetImages([id]);
        });
        fig.append(img, x);
        strip.appendChild(fig);
      });
      panel.appendChild(strip);
    }
    if (shotNote && expandedId === item.id) {
      const noteLine = document.createElement('p');
      noteLine.className = 'memo-shot-note';
      noteLine.textContent = shotNote;
      panel.appendChild(noteLine);
    }
    return panel;
  };

  const matches = (item) => {
    if (!query) return true;
    return (item.text + ' ' + (item.note || '')).toLowerCase().includes(query);
  };
  const inView = (item) => {
    const today = todayStamp();
    if (view === 'today') return item.day === today;
    if (view === 'later') return Boolean(item.day && item.day > today);
    return true;
  };

  const render = () => {
    const token = ++renderToken;
    const open = items.filter((item) => !item.done && inView(item) && matches(item));
    const done = items.filter((item) => item.done && matches(item));
    const openAll = items.filter((item) => !item.done);
    if (open.length) openList.replaceChildren(...open.map((item, index) => row(item, index, open)));
    else {
      const empty = document.createElement('li');
      empty.className = 'memo-empty';
      if (query) empty.textContent = '没有对上的。';
      else if (view === 'today') empty.textContent = '今天还空着。';
      else if (view === 'later') empty.textContent = '还没有排到后面的。';
      else empty.textContent = openAll.length ? '' : '';
      openList.replaceChildren(...(empty.textContent ? [empty] : []));
    }
    doneList.replaceChildren(...done.map((item, index) => row(item, index, done)));
    const high = open.filter((item) => priorityOf(item) === 3).length;
    if (query) countEl.textContent = '找到 ' + (open.length + done.length) + ' 条';
    else if (view === 'today') countEl.textContent = open.length ? '今天 ' + open.length + ' 件' : '今天还空着';
    else if (view === 'later') countEl.textContent = open.length ? '之后 ' + open.length + ' 件' : '还没往后排';
    else countEl.textContent = openAll.length
      ? (high ? '还剩 ' + openAll.length + ' 件，' + high + ' 件要先做' : '还剩 ' + openAll.length + ' 件')
      : '今天清完了';
    if (dayEl) {
      const now = new Date();
      dayEl.textContent = (now.getMonth() + 1) + '月' + now.getDate() + '日 周' + '日一二三四五六'[now.getDay()];
    }
    board.querySelectorAll('[data-memo-view]').forEach((btn) => {
      btn.classList.toggle('is-on', btn.getAttribute('data-memo-view') === view);
    });
    const doneAll = items.filter((item) => item.done);
    doneWrap.hidden = doneAll.length === 0;
    doneToggle.textContent = '已完成 ' + doneAll.length;
    doneToggle.setAttribute('aria-expanded', (doneOpen || (query && done.length > 0)) ? 'true' : 'false');
    donePanel.hidden = !(doneOpen || (query && done.length > 0)) || done.length === 0;
    const missing = items.flatMap((item) => item.images || []).filter((id) => !urls.has(id));
    if (!missing.length) return;
    idbGet(missing).then((found) => {
      if (token !== renderToken) return;
      found.forEach(([id, blob]) => {
        if (!urls.has(id)) urls.set(id, URL.createObjectURL(blob));
      });
      board.querySelectorAll('img[data-shot]').forEach((img) => {
        const id = img.getAttribute('data-shot');
        if (id && urls.has(id) && !img.getAttribute('src')) img.src = urls.get(id);
      });
    }).catch(() => {});
  };
  let renderToken = 0;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const created = { id: newId(), text, done: false };
    if (view === 'today') created.day = todayStamp();
    if (view === 'later') created.day = todayStamp(1);
    items.unshift(created);
    input.value = '';
    save();
    render();
  });
  doneToggle.addEventListener('click', () => {
    doneOpen = !doneOpen;
    render();
  });
  clearBtn.addEventListener('click', () => {
    const gone = items.filter((item) => item.done).flatMap((item) => item.images || []);
    items = items.filter((item) => !item.done);
    doneOpen = false;
    save();
    render();
    forgetImages(gone);
  });
  board.querySelectorAll('[data-memo-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      view = btn.getAttribute('data-memo-view') || 'hand';
      render();
    });
  });
  if (findEl) {
    findEl.addEventListener('input', () => {
      query = findEl.value.trim().toLowerCase();
      render();
    });
  }
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const item = items.find((entry) => entry.id === fileTargetId);
      const files = [...fileInput.files];
      fileInput.value = '';
      if (item && files.length) addImages(item, files);
    });
  }
  board.addEventListener('paste', (event) => {
    const files = [...(event.clipboardData ? event.clipboardData.files : [])].filter((file) => file.type && file.type.startsWith('image/'));
    if (!files.length) return;
    event.preventDefault();
    const current = items.find((entry) => entry.id === expandedId);
    if (current) {
      addImages(current, files);
      return;
    }
    const created = { id: newId(), text: input.value.trim() || '截图', done: false };
    if (view === 'today') created.day = todayStamp();
    if (view === 'later') created.day = todayStamp(1);
    items.unshift(created);
    input.value = '';
    expandedId = created.id;
    addImages(created, files);
  });
  render();
})();

document.querySelectorAll('[data-jargon-translator]').forEach((card) => {
    const badEl = card.querySelector('[data-jt-bad]');
    const badNoteEl = card.querySelector('[data-jt-bad-note]');
    const goodEl = card.querySelector('[data-jt-good]');
    const goodNoteEl = card.querySelector('[data-jt-good-note]');
    card.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-jt-idx]');
      if (!tab) return;
      const idx = Number(tab.getAttribute('data-jt-idx')) || 0;
      const item = JT_SCENARIOS[idx] || JT_SCENARIOS[0];
      card.querySelectorAll('[data-jt-idx]').forEach((b) => b.classList.toggle('is-active', b === tab));
      if (badEl) badEl.textContent = item.bad;
      if (badNoteEl) badNoteEl.textContent = item.badNote;
      if (goodEl) goodEl.textContent = item.good;
      if (goodNoteEl) goodNoteEl.textContent = item.goodNote;
    });
  });
})();

(function () {
  const shelf = document.getElementById('tool-shelf');
  if (!shelf) return;

  const linkForm = document.getElementById('link-form');
  const linkInput = document.getElementById('link-input');
  const linkOut = document.getElementById('link-out');

  // LINK_PARSE_START
  function trimUrl(raw) {
    const cut = raw.match(/^[A-Za-z0-9:/?#\[\]@!$&'()*+,;=%._~-]+/);
    if (!cut) return '';
    return cut[0].replace(/[),.;]+$/g, '');
  }

  function allUrls(text) {
    const out = [];
    const seen = new Set();
    const push = (raw, href) => {
      if (!raw || seen.has(href)) return;
      seen.add(href);
      out.push({ raw, href });
    };
    const re = /https?:\/\/\S+/gi;
    let m;
    while ((m = re.exec(text))) {
      const raw = trimUrl(m[0]);
      push(raw, raw);
    }
    if (out.length) return out;
    const bareRe = /(?:v\.douyin\.com|xhslink\.com|xhslink\.cn|youtu\.be|(?:[\w.-]+\.)?(?:youtube(?:-nocookie)?|xiaohongshu|rednote|douyin|iesdouyin|twitter)\.com|x\.com)\/\S+/gi;
    while ((m = bareRe.exec(text))) {
      const raw = trimUrl(m[0]);
      push(raw, 'https://' + raw);
    }
    return out;
  }

  function readCaption(platform, before) {
    const compact = before.replace(/\s+/g, ' ').trim();
    let title = '';
    let author = '';
    if (platform === '抖音') {
      const work = compact.match(/【([^】]{1,40})的作品】\s*(.*)$/);
      if (work) {
        author = work[1].trim();
        title = work[2].trim();
      }
    }
    if (platform === '小红书') {
      const note = compact.match(/【([^】]{1,80}?)\s*[-–—]\s*小红书】\s*$/);
      if (note) title = note[1].trim();
      const who = compact.match(/(\S{1,30})发布了一篇小红书笔记/);
      if (who) author = who[1].replace(/^\d+/g, '').trim();
      if (!title) {
        const plain = compact.match(/【([^】]{1,80})】\s*$/);
        if (plain && !/小红书|复制|打开/.test(plain[1])) title = plain[1].trim();
      }
    }
    title = title.replace(/^[\s,，:：]+|[\s,，。!！]+$/g, '').trim();
    return { title, author };
  }

  function identify(href) {
    let url;
    try { url = new URL(href); } catch (e) { return null; }
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '').toLowerCase();
    const path = url.pathname;

    if (host === 'youtu.be' || host === 'music.youtube.com' || host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      let id = '';
      let kind = '视频';
      if (host === 'youtu.be') id = (path.split('/').filter(Boolean)[0] || '');
      else {
        const sm = path.match(/\/(?:shorts|embed|live|v)\/([^/?]+)/);
        if (sm) {
          id = sm[1];
          if (path.includes('/shorts/')) kind = '短视频';
          else if (path.includes('/live/')) kind = '直播';
        } else id = url.searchParams.get('v') || '';
      }
      id = decodeURIComponent(id).split('&')[0];
      if (!/^[\w-]{11}$/.test(id)) return { ok: false, message: '这是 YouTube 的链接，里面没有视频编号。' };
      const clean = kind === '短视频'
        ? 'https://www.youtube.com/shorts/' + id
        : 'https://www.youtube.com/watch?v=' + id;
      return { ok: true, platform: 'YouTube', kind, id, url: clean, cover: 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg', remote: true, note: '' };
    }

    if (host === 'x.com' || host === 'twitter.com' || host === 'mobile.twitter.com') {
      const id = (path.match(/\/status\/(\d+)/) || [])[1] || '';
      if (!id) return { ok: false, message: '这是 Twitter 的链接，里面没有帖子编号。' };
      const user = (path.match(/^\/([^/]+)\/status\//) || [])[1] || '';
      const handle = user && user !== 'i' ? user : '';
      const clean = handle ? 'https://x.com/' + handle + '/status/' + id : 'https://x.com/i/web/status/' + id;
      return { ok: true, platform: 'Twitter', kind: '帖子', id, url: clean, cover: '', remote: true, note: '' };
    }

    if (host.endsWith('xiaohongshu.com') || host === 'xhslink.com' || host === 'xhslink.cn' || host.endsWith('rednote.com')) {
      const note = path.match(/\/(?:explore|discovery\/item|item)\/([0-9a-fA-F]{16,32})/);
      if (note) {
        return { ok: true, platform: '小红书', kind: '笔记', id: note[1], url: 'https://www.xiaohongshu.com/explore/' + note[1], cover: '', remote: false, note: '' };
      }
      const profile = path.match(/\/user\/profile\/([^/?]+)/);
      if (profile) {
        return { ok: true, platform: '小红书', kind: '主页', id: profile[1], url: 'https://www.xiaohongshu.com/user/profile/' + profile[1], cover: '', remote: false, note: '' };
      }
      if (host === 'xhslink.com' || host === 'xhslink.cn') {
        const code = path.replace(/\/+$/, '');
        if (!code || code === '/') return { ok: false, message: '这是小红书的短链，短码不完整。' };
        return { ok: true, platform: '小红书', kind: '短链', id: '', url: 'https://' + host + code, cover: '', remote: false, note: '短链每次分享都不一样，笔记编号要打开原页面才看得到。' };
      }
      return { ok: false, message: '这是小红书的链接，里面没有笔记编号。' };
    }

    if (host === 'v.douyin.com' || host.endsWith('douyin.com') || host.endsWith('iesdouyin.com')) {
      const pathHit = path.match(/\/(?:share\/)?(?:video|note|slides|shipin|lvdetail|vsdetail)\/(\d{6,})/);
      const qId = ['modal_id', 'aweme_id', 'vid'].map((key) => url.searchParams.get(key)).find((value) => value && /^\d{6,}$/.test(value));
      const id = (pathHit && pathHit[1]) || qId || '';
      let kind = '视频';
      if (path.includes('/note')) kind = '图文';
      else if (path.includes('/slides')) kind = '图集';
      if (id) {
        const base = kind === '图文' ? 'note' : 'video';
        return { ok: true, platform: '抖音', kind, id, url: 'https://www.douyin.com/' + base + '/' + id, cover: '', remote: false, note: '' };
      }
      if (host === 'v.douyin.com') {
        const code = (path.split('/').filter(Boolean)[0] || '');
        if (!code) return { ok: false, message: '这是抖音的短链，短码不完整。' };
        return { ok: true, platform: '抖音', kind: '短链', id: '', url: 'https://v.douyin.com/' + code + '/', cover: '', remote: false, note: '短链每次分享都不一样，视频编号要打开原页面才看得到。' };
      }
      if (path.includes('/user/')) {
        const who = path.split('/').filter(Boolean).pop();
        return { ok: true, platform: '抖音', kind: '主页', id: who, url: 'https://www.douyin.com' + path.replace(/\/+$/, ''), cover: '', remote: false, note: '' };
      }
      return { ok: false, message: '这是抖音的链接，里面没有作品编号。' };
    }

    return null;
  }

  function parseShare(text) {
    const clean = String(text || '').replace(/[\u200b\ufeff]/g, '');
    const urls = allUrls(clean);
    if (!urls.length) return { ok: false, message: '这段里没有链接。整段分享文案可以直接贴，或贴一条 http 开头的地址。' };
    let fallback = null;
    for (const item of urls) {
      const info = identify(item.href);
      if (!info) continue;
      if (!info.ok) { fallback = fallback || info; continue; }
      const at = clean.indexOf(item.raw);
      const before = at >= 0 ? clean.slice(0, at) : '';
      const cap = readCaption(info.platform, before);
      return Object.assign({}, info, { title: cap.title, author: cap.author });
    }
    return fallback || { ok: false, message: '目前只认小红书、抖音、YouTube 和 Twitter。' };
  }
  // LINK_PARSE_END

  function renderLink(info) {
    linkOut.hidden = false;
    linkOut.replaceChildren();
    if (!info.ok) {
      const note = document.createElement('p');
      note.className = 'link-note';
      note.textContent = info.message;
      linkOut.appendChild(note);
      return null;
    }
    const card = document.createElement('div');
    card.className = 'link-result' + (info.cover ? '' : ' is-plain');
    if (info.cover) {
      const img = document.createElement('img');
      img.className = 'link-cover';
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      img.src = info.cover;
      img.addEventListener('error', () => {
        img.remove();
        card.classList.add('is-plain');
      });
      card.appendChild(img);
    }
    const body = document.createElement('div');
    const kicker = document.createElement('p');
    kicker.className = 'link-kicker';
    kicker.textContent = info.platform + ' · ' + info.kind;
    const titleEl = document.createElement('h3');
    titleEl.className = 'link-title';
    titleEl.textContent = info.title || (info.remote ? '正在读标题…' : '分享文案里没有标题');
    const rows = document.createElement('dl');
    rows.className = 'link-rows';
    const addRow = (label, value) => {
      if (!value) return null;
      const line = document.createElement('div');
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      line.append(dt, dd);
      rows.appendChild(line);
      return dd;
    };
    const authorDd = addRow('作者', info.author);
    addRow('编号', info.id);
    const open = document.createElement('div');
    open.className = 'link-open';
    const anchor = document.createElement('a');
    anchor.href = info.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = info.url;
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'soft-pill-btn';
    copyBtn.textContent = '复制链接';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(info.url);
        copyBtn.textContent = '已复制';
      } catch (err) {
        copyBtn.textContent = '请手动复制';
      }
    });
    open.append(anchor, copyBtn);
    body.append(kicker, titleEl, rows, open);
    if (info.note) {
      const note = document.createElement('p');
      note.className = 'link-note';
      note.textContent = info.note;
      body.appendChild(note);
    }
    card.appendChild(body);
    linkOut.appendChild(card);
    return {
      titleEl,
      addAuthor(name) {
        if (!name || authorDd) return;
        const line = document.createElement('div');
        const dt = document.createElement('dt');
        dt.textContent = '作者';
        const dd = document.createElement('dd');
        dd.textContent = name;
        line.append(dt, dd);
        rows.prepend(line);
      },
    };
  }

  let linkTicket = 0;
  linkInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      linkForm.requestSubmit();
    }
  });
  linkForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const mine = ++linkTicket;
    const info = parseShare(linkInput.value);
    const view = renderLink(info);
    if (!info.ok || !info.remote || !view) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    try {
      const res = await fetch('https://noembed.com/embed?url=' + encodeURIComponent(info.url), { signal: ctrl.signal });
      const data = await res.json();
      if (mine !== linkTicket) return;
      const title = data && !data.error && typeof data.title === 'string' ? data.title.trim() : '';
      const author = data && typeof data.author_name === 'string' ? data.author_name.trim() : '';
      if (title) view.titleEl.textContent = title;
      else if (!info.title) view.titleEl.textContent = '公开标题没读到，链接已经整理好';
      if (author) view.addAuthor(author);
    } catch (err) {
      if (mine !== linkTicket) return;
      if (!info.title) view.titleEl.textContent = '公开标题没读到，链接已经整理好';
    } finally {
      clearTimeout(timer);
    }
  });

  const speechInput = document.getElementById('speech-input');
  const speechStat = document.getElementById('speech-stat');
  const paintSpeech = () => {
    const count = (speechInput.value || '').replace(/\s/g, '').length;
    if (!count) {
      speechStat.textContent = '0 字 · 还不用开口';
      return;
    }
    const seconds = Math.max(1, Math.round((count / 240) * 60));
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const clock = min ? min + ' 分 ' + String(sec).padStart(2, '0') + ' 秒' : sec + ' 秒';
    speechStat.textContent = count + ' 字 · 大约 ' + clock;
  };
  speechInput.addEventListener('input', paintSpeech);

  const dirty = document.getElementById('prompt-dirty');
  const clean = document.getElementById('prompt-clean');
  const note = document.getElementById('prompt-note');
  const cleanText = (raw) => String(raw || '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*|__|\*|_|`/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  document.getElementById('prompt-clean-btn').addEventListener('click', () => {
    clean.value = cleanText(dirty.value);
    note.textContent = clean.value ? '已经清掉。' : '没有可清的内容。';
  });
  document.getElementById('prompt-copy-btn').addEventListener('click', async () => {
    const text = clean.value || cleanText(dirty.value);
    clean.value = text;
    if (!text) {
      note.textContent = '没有可复制的内容。';
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      note.textContent = '已复制。';
    } catch (e) {
      clean.focus();
      clean.select();
      note.textContent = '请手动复制下面这段。';
    }
  });
})();
