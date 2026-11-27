/* ============================================================================
   EDITORIAL ARCHITECTURAL DIAGRAMS FOR CURATED MONOGRAPHS
   Responsive, dark-mode-native SVG figures invoked via :::diagram-xxx:::
   ============================================================================ */

function pickSandbox({ badge, label, tabs }) {
  const buttons = tabs
    .map(
      (tab, index) =>
        `<button type="button" class="sandbox-tab${index === 0 ? ' is-active' : ''}" data-pick="${tab.id}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}">${tab.label}</button>`
    )
    .join('');
  const panels = tabs
    .map(
      (tab, index) => `
      <div class="pick-panel" data-panel="${tab.id}" role="tabpanel"${index === 0 ? '' : ' hidden'}>
        <p class="pick-kicker">${tab.kicker}</p>
        <h3>${tab.title}</h3>
        <p>${tab.body}</p>
        <div class="pick-example"><span>小例子</span><p>${tab.example}</p></div>
      </div>`
    )
    .join('');
  return `
    <div class="interactive-sandbox" data-sandbox="pick" aria-label="${label}">
      <div class="sandbox-header"><span class="sandbox-badge">${badge}</span></div>
      <div class="sandbox-tabs" role="tablist">${buttons}</div>
      ${panels}
    </div>`;
}

export function renderArticleDiagram(token) {
  switch (token) {
    /* 1. AI PM Five-Layer Request Stack */
    case ':::diagram-pm-five-layers:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 388" role="img" aria-label="一次 AI 请求穿过的五层技术栈与产品决策边界">
          <rect x="4" y="4" width="812" height="380" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">REQUEST ANATOMY · 一次请求自上而下穿过的五层与 PM 决策抓手</text>

          <!-- L5 -->
          <rect x="24" y="50" width="246" height="54" rx="12" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="40" y="73" fill="var(--blue)" font-size="11" font-weight="800">L5 · 应用编排与 Agent 层</text>
          <text x="40" y="92" fill="var(--ink-primary)" font-size="13" font-weight="700">单轮问答 / 固定工作流 / 自主智能体</text>
          <rect x="288" y="50" width="504" height="54" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="306" y="73" fill="var(--ink-primary)" font-size="12.5" font-weight="700">PM 必懂拍板：什么时候用死板但稳的 Workflow，什么时候放权给 Agent？</text>
          <text x="306" y="92" fill="var(--ink-secondary)" font-size="12">交互兜底设计：思考态反馈、引用溯源、高危动作人工审批门禁（Human-in-the-loop）</text>

          <!-- L4 -->
          <rect x="24" y="116" width="246" height="54" rx="12" fill="var(--bg-card)" stroke="var(--border-strong)"/>
          <text x="40" y="139" fill="var(--blue)" font-size="11" font-weight="800">L4 · 推理服务与网关层</text>
          <text x="40" y="158" fill="var(--ink-primary)" font-size="13" font-weight="700">TTFT 首字延迟 · 并发限流 · 缓存降级</text>
          <rect x="288" y="116" width="504" height="54" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="306" y="139" fill="var(--ink-primary)" font-size="12.5" font-weight="700">PM 必懂拍板：首字等 1.5s 还是 8s？走流式打字机还是异步通知？</text>
          <text x="306" y="158" fill="var(--ink-secondary)" font-size="12">成本抓手：系统提示词固定前缀吃满 Prompt Caching（立省 50%–90% 输入费）</text>

          <!-- L3 -->
          <rect x="24" y="182" width="246" height="54" rx="12" fill="var(--bg-card)" stroke="var(--border-strong)"/>
          <text x="40" y="205" fill="var(--mint)" font-size="11" font-weight="800">L3 · 基础大模型层</text>
          <text x="40" y="224" fill="var(--ink-primary)" font-size="13" font-weight="700">通用 / 深度推理 / 多模态 / Embedding</text>
          <rect x="288" y="182" width="504" height="54" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="306" y="205" fill="var(--ink-primary)" font-size="12.5" font-weight="700">PM 必懂拍板：不看公开刷榜分，拿 50 条业务真题测准召率与「大海捞针」衰减</text>
          <text x="306" y="224" fill="var(--ink-secondary)" font-size="12">选型常识：窗口长 ≠ 注意力不涣散；快模型做分类抽取，慢推理模型啃复杂规划</text>

          <!-- L2 -->
          <rect x="24" y="248" width="246" height="54" rx="12" fill="var(--bg-card)" stroke="var(--border-strong)"/>
          <text x="40" y="271" fill="var(--orange)" font-size="11" font-weight="800">L2 · 数据、知识注入与训练层</text>
          <text x="40" y="290" fill="var(--ink-primary)" font-size="13" font-weight="700">上下文工程 · RAG 检索 · SFT / RL</text>
          <rect x="288" y="248" width="504" height="54" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="306" y="271" fill="var(--ink-primary)" font-size="12.5" font-weight="700">PM 必懂拍板：缺实时业务事实先上 RAG（开卷考），绝不盲目砸钱做微调！</text>
          <text x="306" y="290" fill="var(--ink-secondary)" font-size="12">决定上限的是脏文档清洗、切片粒度（Chunking）与权限隔离，而非换向量库</text>

          <!-- L1 -->
          <rect x="24" y="314" width="246" height="52" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="40" y="336" fill="var(--ink-muted)" font-size="11" font-weight="800">L1 · 算力硬件与部署底座</text>
          <text x="40" y="354" fill="var(--ink-primary)" font-size="13" font-weight="700">GPU 显存（VRAM）· 云 API vs 私有化</text>
          <rect x="288" y="314" width="504" height="52" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="306" y="336" fill="var(--ink-primary)" font-size="12.5" font-weight="700">PM 必懂拍板：算清「按 Token 付费」与「包卡独占运维」的盈亏平衡点与合规红线</text>
          <text x="306" y="354" fill="var(--ink-muted)" font-size="12">交给基建研发：CUDA 算子优化、张量并行切分、量化精度压测</text>
        </svg>
        <figcaption>图 1 · 五层技术栈地图：越往上离用户体验越近，越往下决定能力边界与商业毛利</figcaption>
      </figure>`;

    /* 2. RAG vs Long Context vs Fine-Tuning Decision Matrix */
    case ':::diagram-rag-vs-ft:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 248" role="img" aria-label="上下文注入、RAG 检索与微调三路线决策对比">
          <rect x="4" y="4" width="812" height="240" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">DECISION TREE · 模型答不对业务问题时，选哪条路补课？</text>

          <rect x="24" y="52" width="244" height="172" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="42" y="80" fill="var(--blue)" font-size="12" font-weight="800">路线 A · 直接塞进上下文</text>
          <text x="42" y="102" fill="var(--ink-primary)" font-size="15" font-weight="700">Prompt + 缓存前缀</text>
          <text x="42" y="128" fill="var(--ink-secondary)" font-size="12">· 资料总量 &lt; 5 万字且相对固定</text>
          <text x="42" y="150" fill="var(--ink-secondary)" font-size="12">· 零切片丢失，今天写完今天上线</text>
          <text x="42" y="172" fill="var(--ink-secondary)" font-size="12">· 搭配 Prompt Cache 压低成本</text>
          <text x="42" y="204" fill="var(--mint)" font-size="12" font-weight="700">✓ MVP 验证期第一顺位</text>

          <rect x="288" y="52" width="244" height="172" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="306" y="80" fill="var(--blue)" font-size="12" font-weight="800">路线 B · RAG 检索增强（开卷考）</text>
          <text x="306" y="102" fill="var(--ink-primary)" font-size="15" font-weight="700">混合检索 + 重排注入</text>
          <text x="306" y="128" fill="var(--ink-secondary)" font-size="12">· 知识库庞大、每天动态增删</text>
          <text x="306" y="150" fill="var(--ink-secondary)" font-size="12">· 必须附带原文出处链接防幻觉</text>
          <text x="306" y="172" fill="var(--ink-secondary)" font-size="12">· 需要按用户角色做文档权限隔离</text>
          <text x="306" y="204" fill="var(--blue)" font-size="12" font-weight="700">✓ 企业私域知识问答标配</text>

          <rect x="552" y="52" width="244" height="172" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="570" y="80" fill="var(--orange)" font-size="12" font-weight="800">路线 C · SFT 微调（肌肉记忆）</text>
          <text x="570" y="102" fill="var(--ink-primary)" font-size="15" font-weight="700">高质量样本改模型权重</text>
          <text x="570" y="128" fill="var(--ink-secondary)" font-size="12">· 固定特殊输出格式 / 专属文风</text>
          <text x="570" y="150" fill="var(--ink-secondary)" font-size="12">· 把大模型的专项能力蒸馏给小模型</text>
          <text x="570" y="172" fill="var(--ink-secondary)" font-size="12">· 周期长、换底座要重训、不适合记新事实</text>
          <text x="570" y="204" fill="var(--orange)" font-size="12" font-weight="700">! 仅在海量高频降本时启用</text>
        </svg>
        <figcaption>图 2 · 黄金口诀：缺事实找 RAG，改规矩/压延迟才碰微调，绝不拿微调当数据库用</figcaption>
      </figure>`;

    /* 3. Token Gateway Smart Routing Tradeoff */
    case ':::diagram-gateway-routing:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 244" role="img" aria-label="Token 网关智能路由的账面幻觉与真实工程代价">
          <rect x="4" y="4" width="812" height="236" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">TRADE-OFF CASE · 为什么他们拍板砍掉「全自动智能路由」？</text>

          <rect x="24" y="52" width="372" height="168" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="44" y="80" fill="var(--orange)" font-size="12" font-weight="800">✕ 看起来很美的「自动难度分流」隐性总账</text>
          <text x="44" y="108" fill="var(--ink-secondary)" font-size="12.5">1. 前置意图分类器本身增加 <tspan font-weight="700" fill="var(--ink-primary)">150–300ms</tspan> 首字延迟</text>
          <text x="44" y="132" fill="var(--ink-secondary)" font-size="12.5">2. 短句奥数题易被误判为「简单」，小模型答崩伤口碑</text>
          <text x="44" y="156" fill="var(--ink-secondary)" font-size="12.5">3. 触发兜底重跑 = 付两次钱 + 等两倍时间</text>
          <text x="44" y="180" fill="var(--ink-secondary)" font-size="12.5">4. 线上客诉时无法稳定复现「当时到底落到了哪个模型」</text>
          <text x="44" y="205" fill="var(--ink-muted)" font-size="11.5">结论：流量未上规模前，省下的毛票不够填研发与排障的坑</text>

          <rect x="420" y="52" width="376" height="168" rx="16" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.6"/>
          <text x="440" y="80" fill="var(--mint)" font-size="12" font-weight="800">✓ 产品阶段最优拍板：确定性主备链路 + 业务按场景指定</text>
          <text x="440" y="108" fill="var(--ink-secondary)" font-size="12.5">1. 调用方按业务接口固定模型（摘要口固定快模型，规划口固定强模型）</text>
          <text x="440" y="132" fill="var(--ink-secondary)" font-size="12.5">2. 网关专注把「多云鉴权、计费对账、超时自动切备胎」做稳</text>
          <text x="440" y="156" fill="var(--ink-secondary)" font-size="12.5">3. 零额外路由延迟，每一笔请求路径 100% 可预期、可回放</text>
          <text x="440" y="180" fill="var(--ink-secondary)" font-size="12.5">4. 攒够真实线上日志与成本基线后，二期再按数据定自动策略</text>
          <text x="440" y="205" fill="var(--mint)" font-size="11.5" font-weight="700">核心认知：懂技术是为了算清代价、勇敢做减法，而不是炫技堆功能</text>
        </svg>
        <figcaption>图 3 · 技术判断力试金石：不看单点算法多炫，看整条链路的延迟、准确率、排障与人力总账</figcaption>
      </figure>`;

    /* 4. Tobi (@tobiadonadon_): The 4 Default AI Slop Looks */
    case ':::diagram-four-ai-slop-looks:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 264" role="img" aria-label="Tobi 总结的 AI 默认生成四大套路脸诊断图鉴">
          <rect x="4" y="4" width="812" height="256" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">THE 4 DEFAULT AI LOOKS · 只要命中任一套路的 3 个特征，说明模型在走安全默认值</text>

          <rect x="24" y="52" width="184" height="162" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="38" y="78" fill="var(--orange)" font-size="11" font-weight="800">01 · Paper Edition</text>
          <text x="38" y="98" fill="var(--ink-primary)" font-size="14" font-weight="700">伪文艺纸刊风</text>
          <text x="38" y="122" fill="var(--ink-secondary)" font-size="11.5">· 衬线大标题 + 1 个橙色斜体词</text>
          <text x="38" y="144" fill="var(--ink-secondary)" font-size="11.5">· 满屏等宽小字 NOW BOOKING</text>
          <text x="38" y="166" fill="var(--ink-secondary)" font-size="11.5">· 角落必写 LISBON / NEW YORK</text>

          <rect x="220" y="52" width="184" height="162" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="234" y="78" fill="var(--blue)" font-size="11" font-weight="800">02 · Launch Page</text>
          <text x="234" y="98" fill="var(--ink-primary)" font-size="14" font-weight="700">黑紫发光发布页</text>
          <text x="234" y="122" fill="var(--ink-secondary)" font-size="11.5">· 纯黑背景配蓝紫弥散光晕</text>
          <text x="234" y="144" fill="var(--ink-secondary)" font-size="11.5">· 首屏一张 3D 倾斜透视截图</text>
          <text x="234" y="166" fill="var(--ink-secondary)" font-size="11.5">· 胶囊发光徽章配渐变主标题</text>

          <rect x="416" y="52" width="184" height="162" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="430" y="78" fill="var(--mint)" font-size="11" font-weight="800">03 · KPI Dashboard</text>
          <text x="430" y="98" fill="var(--ink-primary)" font-size="14" font-weight="700">四宫格指标看板</text>
          <text x="430" y="122" fill="var(--ink-secondary)" font-size="11.5">· 顶栏永远并排 4 张 KPI 卡片</text>
          <text x="430" y="144" fill="var(--ink-secondary)" font-size="11.5">· 右上角千篇一律绿字 +12.4%</text>
          <text x="430" y="166" fill="var(--ink-secondary)" font-size="11.5">· 底下配迷你折线图与毫无重点的表</text>

          <rect x="612" y="52" width="184" height="162" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="626" y="78" fill="var(--ink-muted)" font-size="11" font-weight="800">04 · Dark Dev Tool</text>
          <text x="626" y="98" fill="var(--ink-primary)" font-size="14" font-weight="700">暗黑极客工具页</text>
          <text x="626" y="122" fill="var(--ink-secondary)" font-size="11.5">· 炭黑网格线配绿色终端光标</text>
          <text x="626" y="144" fill="var(--ink-secondary)" font-size="11.5">· 矫枉过正版：米白大字 + 页头时钟</text>
          <text x="626" y="166" fill="var(--ink-secondary)" font-size="11.5">· 把竞品 Logo 换上去毫无违和感</text>

          <text x="28" y="240" fill="var(--ink-primary)" font-size="12.5" font-weight="700">破局解药：别只对 AI 喊「不要模板感」，而是给它具体参考物 + 1 个能让朋友记住的交互动作（Signature Move）</text>
        </svg>
        <figcaption>图 1 · AI 审美平庸（Slop）不是因为丑，而是因为没有具象参考时，模型每一步都选了概率最高的安全默认值</figcaption>
      </figure>`;

    /* 5. Construct Design MCP 3-Step Workflow */
    case ':::diagram-construct-mcp-flow:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 218" role="img" aria-label="Construct Design 通过 MCP 改变 Claude 设计工作流的三步机制">
          <rect x="4" y="4" width="812" height="210" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">MCP DESIGN WORKFLOW · 让模型先「看见好设计 + 读懂方法论」再落笔写代码</text>

          <rect x="24" y="54" width="236" height="136" rx="15" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="42" y="80" fill="var(--blue)" font-size="11.5" font-weight="800">01 · search_designs()</text>
          <text x="42" y="102" fill="var(--ink-primary)" font-size="14.5" font-weight="700">按创意概念检索手工样本</text>
          <text x="42" y="128" fill="var(--ink-secondary)" font-size="12">不搜干瘪组件名，而是读设计背后的</text>
          <text x="42" y="148" fill="var(--ink-secondary)" font-size="12">画面构思（如「聚光灯照出剪影彩照」）</text>

          <path d="M266 122 H286" stroke="var(--blue)" stroke-width="2"/>
          <polygon points="286,117 294,122 286,127" fill="var(--blue)"/>

          <rect x="298" y="54" width="236" height="136" rx="15" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="316" y="80" fill="var(--blue)" font-size="11.5" font-weight="800">02 · design_guide()</text>
          <text x="316" y="102" fill="var(--ink-primary)" font-size="14.5" font-weight="700">边写边读工作室级设计准则</text>
          <text x="316" y="128" fill="var(--ink-secondary)" font-size="12">真正改变模型品味的一步：注入字体</text>
          <text x="316" y="148" fill="var(--ink-secondary)" font-size="12">层级、色彩比例、动效节奏与自审清单</text>

          <path d="M540 122 H560" stroke="var(--blue)" stroke-width="2"/>
          <polygon points="560,117 568,122 560,127" fill="var(--blue)"/>

          <rect x="572" y="54" width="224" height="136" rx="15" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.5"/>
          <text x="590" y="80" fill="var(--mint)" font-size="11.5" font-weight="800">03 · get_design()</text>
          <text x="590" y="102" fill="var(--ink-primary)" font-size="14.5" font-weight="700">拉取真人源码并对齐项目色板</text>
          <text x="590" y="128" fill="var(--ink-secondary)" font-size="12">把干净的 React 实现直接写进工程目录</text>
          <text x="590" y="148" fill="var(--ink-secondary)" font-size="12">自动适配你项目现有的品牌色与文案</text>
        </svg>
        <figcaption>图 2 · 模板省的是时间，而挂载在中间的 Design Guide（设计思维准则）才真正改变了模型的审美回路</figcaption>
      </figure>`;

    /* 6. Karpathy Mental Model: 1TB Lossy Zip vs Working Context vs Deterministic Tools */
    case ':::diagram-karpathy-zip-memory:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 242" role="img" aria-label="Karpathy 白板心智模型：1TB 互联网有损压缩包与上下文工作内存">
          <rect x="4" y="4" width="812" height="234" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">KARPATHY EXCALIDRAW MODEL · 分清「脑子里的模糊印象」与「桌面上摊开的精确材料」</text>

          <rect x="24" y="52" width="244" height="164" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="42" y="78" fill="var(--orange)" font-size="11.5" font-weight="800">参数权重 · Parametric Memory</text>
          <text x="42" y="102" fill="var(--ink-primary)" font-size="14.5" font-weight="700">1TB 互联网「有损压缩包」</text>
          <text x="42" y="128" fill="var(--ink-secondary)" font-size="12">· 预训练花千万美金读完半年多前的网页</text>
          <text x="42" y="150" fill="var(--ink-secondary)" font-size="12">· 擅长通识推理与模式迁移，但细节模糊</text>
          <text x="42" y="172" fill="var(--ink-secondary)" font-size="12">· 绝不要逼它凭空背诵精确数字或冷门新规</text>

          <rect x="288" y="52" width="244" height="164" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="306" y="78" fill="var(--blue)" font-size="11.5" font-weight="800">上下文窗口 · Working Memory</text>
          <text x="306" y="102" fill="var(--ink-primary)" font-size="14.5" font-weight="700">高速工作台面（Token 序列）</text>
          <text x="306" y="128" fill="var(--ink-secondary)" font-size="12">· 直接贴入当前代码文件、文档与一手资料</text>
          <text x="306" y="150" fill="var(--ink-secondary)" font-size="12">· 信息零损耗在场，模型推理准确率飙升</text>
          <text x="306" y="172" fill="var(--ink-secondary)" font-size="12">· 黄金纪律：保持上下文干净，不塞无关噪音</text>

          <rect x="552" y="52" width="244" height="164" rx="16" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.5"/>
          <text x="570" y="78" fill="var(--mint)" font-size="11.5" font-weight="800">外部确定性工具 · Tool Offload</text>
          <text x="570" y="102" fill="var(--ink-primary)" font-size="14.5" font-weight="700">搜索查新 + Python 算准</text>
          <text x="570" y="128" fill="var(--ink-secondary)" font-size="12">· 算 423524 × 3124 直接调 Python 解释器</text>
          <text x="570" y="150" fill="var(--ink-secondary)" font-size="12">· 查最新事实直接调 Web Search / Deep Research</text>
          <text x="570" y="172" fill="var(--ink-secondary)" font-size="12">· 让概率模型做规划，让确定性代码做计算</text>
        </svg>
        <figcaption>图 1 · Karpathy 屏幕实操的第一课：理解模型本质是个「有损 zip 包」，就知道为什么上下文装载与工具卸载如此关键</figcaption>
      </figure>`;

    /* 7. Karpathy / Nozelcode: 4 Pillars -> Harness, Loops, Graphs */
    case ':::diagram-pillars-to-system:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 262" role="img" aria-label="从日常四支柱演进到自治系统三原语 Harness、Loops 与 Graphs">
          <rect x="4" y="4" width="812" height="254" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">FROM CHATTING TO SYSTEMS · 四大日常基本功 → 三大系统级架构原语</text>

          <!-- Left: 4 Pillars -->
          <rect x="24" y="52" width="332" height="184" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="42" y="78" fill="var(--ink-primary)" font-size="13.5" font-weight="800">单兵高效四支柱（把每次交互喂准）</text>
          <rect x="42" y="92" width="142" height="58" rx="10" fill="var(--bg-shell)"/>
          <text x="54" y="113" fill="var(--blue)" font-size="12" font-weight="700">1. Prompts</text>
          <text x="54" y="133" fill="var(--ink-secondary)" font-size="11">清晰意图与结构约束</text>
          <rect x="196" y="92" width="142" height="58" rx="10" fill="var(--bg-shell)"/>
          <text x="208" y="113" fill="var(--blue)" font-size="12" font-weight="700">2. Context</text>
          <text x="208" y="133" fill="var(--ink-secondary)" font-size="11">精准喂入最小充分资料</text>
          <rect x="42" y="160" width="142" height="58" rx="10" fill="var(--bg-shell)"/>
          <text x="54" y="181" fill="var(--blue)" font-size="12" font-weight="700">3. Tools</text>
          <text x="54" y="201" fill="var(--ink-secondary)" font-size="11">代码解释器与联网检索</text>
          <rect x="196" y="160" width="142" height="58" rx="10" fill="var(--bg-shell)"/>
          <text x="208" y="181" fill="var(--blue)" font-size="12" font-weight="700">4. Workflows</text>
          <text x="208" y="201" fill="var(--ink-secondary)" font-size="11">按难度选对模型串成线</text>

          <path d="M364 144 H396" stroke="var(--blue)" stroke-width="2.2" stroke-dasharray="4 3"/>
          <polygon points="396,139 406,144 396,149" fill="var(--blue)"/>

          <!-- Right: 3 System Primitives -->
          <rect x="414" y="52" width="382" height="184" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="434" y="78" fill="var(--blue)" font-size="13.5" font-weight="800">自治系统三原语（让 AI 自己闭环干活）</text>
          <text x="434" y="108" fill="var(--ink-primary)" font-size="12.5" font-weight="700">① Harness（运行底座 / 护栏容器）</text>
          <text x="434" y="127" fill="var(--ink-secondary)" font-size="11.5">把文件系统、沙盒终端、权限门禁与上下文拼装封成稳固外骨骼</text>
          <text x="434" y="156" fill="var(--ink-primary)" font-size="12.5" font-weight="700">② Loops（执行 → 验证 → 修正反馈环）</text>
          <text x="434" y="175" fill="var(--ink-secondary)" font-size="11.5">不指望一把生成全对；让编译器、测试或评分器自动打回迭代</text>
          <text x="434" y="204" fill="var(--ink-primary)" font-size="12.5" font-weight="700">③ Graphs（有向状态图与分支并发）</text>
          <text x="434" y="223" fill="var(--ink-secondary)" font-size="11.5">拆解复杂大任务：路由分发、多路并行探索、汇总验收交付</text>
        </svg>
        <figcaption>图 2 · 高手不靠装几十个花哨插件，而是把 Prompts + Context + Tools 装进带 Loops 与 Graphs 的稳固 Harness 里</figcaption>
      </figure>`;

    /* 8. Four-Layer Cognition Concentric Circles */
    case ':::diagram-cognition-circles:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 232" role="img" aria-label="一元、二元、多元到系统认知的四层跃迁图">
          <rect x="4" y="4" width="812" height="224" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <circle cx="148" cy="118" r="88" fill="var(--blue)" fill-opacity="0.08" stroke="var(--blue)" stroke-width="1.5"/>
          <circle cx="148" cy="130" r="64" fill="var(--blue)" fill-opacity="0.11" stroke="var(--blue)" stroke-width="1.3"/>
          <circle cx="148" cy="142" r="42" fill="var(--blue)" fill-opacity="0.16" stroke="var(--blue)" stroke-width="1.2"/>
          <circle cx="148" cy="154" r="20" fill="var(--ink-primary)" fill-opacity="0.18" stroke="var(--ink-primary)"/>
          <text x="148" y="48" text-anchor="middle" fill="var(--blue)" font-size="11" font-weight="800">04 系统认知</text>
          <text x="148" y="82" text-anchor="middle" fill="var(--ink-primary)" font-size="11" font-weight="700">03 多元认知</text>
          <text x="148" y="114" text-anchor="middle" fill="var(--ink-secondary)" font-size="10.5" font-weight="700">02 二元</text>
          <text x="148" y="158" text-anchor="middle" fill="var(--ink-primary)" font-size="10" font-weight="800">01 一元</text>

          <rect x="272" y="34" width="520" height="168" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="294" y="64" fill="var(--ink-primary)" font-size="13" font-weight="700">· 一元认知（非黑即白）：只靠快思考本能反应，困在单一视角与情绪内耗里</text>
          <text x="294" y="96" fill="var(--ink-primary)" font-size="13" font-weight="700">· 二元认知（换位合作）：能理解并尊重不同立场与利益，开始促成共识与协作</text>
          <text x="294" y="128" fill="var(--ink-primary)" font-size="13" font-weight="700">· 多元认知（兼容并蓄）：头脑中同时容纳相反观点仍能正常行事，向上向下皆可沟通</text>
          <text x="294" y="160" fill="var(--blue)" font-size="13" font-weight="800">· 系统认知（十楼看二楼）：不计局部满分，搭建生态、筛选协同、果断止损重塑</text>
          <text x="294" y="186" fill="var(--ink-muted)" font-size="11.5">破圈三动作：敢把自己推向不可知 · 克制对技巧的空谈崇拜（拼工作总量） · 课题分离拉高视角</text>
        </svg>
        <figcaption>四层认知演进：高维认知圈天然向下兼容低维子集——二楼出的问题，要站到十楼才能看清结构解</figcaption>
      </figure>`;

    /* 9. PM Full-Cycle Persistent Project Hub */
    case ':::diagram-pm-full-cycle-loop:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 218" role="img" aria-label="产品经理用持久化项目空间贯穿十步需求闭环">
          <rect x="4" y="4" width="812" height="210" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="24" y="30" width="230" height="158" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="42" y="58" fill="var(--blue)" font-size="11.5" font-weight="800">PERSISTENT PROJECT · 长期空间</text>
          <text x="42" y="82" fill="var(--ink-primary)" font-size="14.5" font-weight="700">一份活的产品上下文底座</text>
          <text x="42" y="108" fill="var(--ink-secondary)" font-size="12">· 现状说明 + 旧 PRD + 组件规范</text>
          <text x="42" y="130" fill="var(--ink-secondary)" font-size="12">· 访谈原话与会议拍板（AI 摸不到的真相）</text>
          <text x="42" y="152" fill="var(--mint)" font-size="12" font-weight="700">· 每次评审/研发变更必须写回此处！</text>

          <rect x="282" y="30" width="514" height="72" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="302" y="55" fill="var(--ink-primary)" font-size="13" font-weight="700">上半场（发散与收敛）：市场查证 → 需求调研 → 需求分析 → 原型与双读者 PRD</text>
          <text x="302" y="79" fill="var(--ink-secondary)" font-size="12">分工铁律：AI 擅长把异常分支想全（做加法）；PM 负责砍掉过度设计、断出处真伪（做减法）</text>

          <rect x="282" y="116" width="514" height="72" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="302" y="141" fill="var(--ink-primary)" font-size="13" font-weight="700">下半场（对齐与回流）：方案评审 → 研发落地 → 测试走查 → 线上运营反馈回灌</text>
          <text x="302" y="165" fill="var(--ink-secondary)" font-size="12">双层交付：同一份 PRD 既给人读，也留结构化 Markdown 给研发/测试侧的下一个 Agent 接力</text>
        </svg>
        <figcaption>告别「一次性写 PPT 工具人」：让每一次会议取舍与线上反馈都回流进同一个长期项目空间</figcaption>
      </figure>`;

    /* 10. Verification & Codebase Garden Pyramid */
    case ':::diagram-verify-pyramid:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 226" role="img" aria-label="Agent 工程信任地基：静态约束、运行时证据与三轮停手门禁">
          <rect x="4" y="4" width="812" height="218" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="24" y="28" width="244" height="170" rx="16" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.6"/>
          <text x="42" y="56" fill="var(--mint)" font-size="11.5" font-weight="800">LAYER 01 · 最底层硬约束</text>
          <text x="42" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">架构隔离 + 编译器 + Lint</text>
          <text x="42" y="106" fill="var(--ink-secondary)" font-size="12">· 清理代码花园杂草防 Agent 照抄</text>
          <text x="42" y="128" fill="var(--ink-secondary)" font-size="12">· 易错 API 直接在框架层禁止调用</text>
          <text x="42" y="150" fill="var(--ink-secondary)" font-size="12">· 100% 确定性拦截，胜过写百行叮嘱</text>

          <rect x="288" y="28" width="244" height="170" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="306" y="56" fill="var(--blue)" font-size="11.5" font-weight="800">LAYER 02 · 运行时真实验证</text>
          <text x="306" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">E2E + 属性测试 + 差异对比</text>
          <text x="306" y="106" fill="var(--ink-secondary)" font-size="12">· 给 Agent 浏览器与模拟器真跑一遍</text>
          <text x="306" y="128" fill="var(--ink-secondary)" font-size="12">· 属性测试专抓极端边界不变量</text>
          <text x="306" y="150" fill="var(--ink-secondary)" font-size="12">· 评审看录屏/截图证据而非肉眼盯全量</text>

          <rect x="552" y="28" width="244" height="170" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="570" y="56" fill="var(--orange)" font-size="11.5" font-weight="800">LAYER 03 · 裁判独立与叫人线</text>
          <text x="570" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">REVIEW.md + 3 次失败停手</text>
          <text x="570" y="106" fill="var(--ink-secondary)" font-size="12">· 改动绝不能篡改基线分支上的裁判规则</text>
          <text x="570" y="128" fill="var(--ink-secondary)" font-size="12">· 自修连续 3 轮未过立刻停手呼叫人类</text>
          <text x="570" y="150" fill="var(--ink-secondary)" font-size="12">· 线上漏网事故反哺进触发式检查表</text>
        </svg>
        <figcaption>并发运行十几个 Agent 的前提：把口头叮嘱沉淀成自动化检查，人只负责定义「什么叫真正做完」</figcaption>
      </figure>`;

    /* 11. Dan Koe One-Person Creative Studio */
    case ':::diagram-one-person-studio:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 206" role="img" aria-label="Dan Koe 一人创意团队三层职责顺序">
          <rect x="4" y="4" width="812" height="198" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="24" y="28" width="244" height="150" rx="15" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="42" y="56" fill="var(--blue)" font-size="11.5" font-weight="800">STEP 01 · 品牌策略（定魂）</text>
          <text x="42" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">提炼「知识签名」与世界观</text>
          <text x="42" y="106" fill="var(--ink-secondary)" font-size="12">帮谁解决什么痛、反对什么旧活法、</text>
          <text x="42" y="126" fill="var(--ink-secondary)" font-size="12">不靠透支信任换一次性虚荣爆款</text>

          <rect x="288" y="28" width="244" height="150" rx="15" fill="var(--bg-card)" stroke="var(--border-strong)"/>
          <text x="306" y="56" fill="var(--mint)" font-size="11.5" font-weight="800">STEP 02 · 内容地图（定骨架）</text>
          <text x="306" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">栏目 × 选题 × 验证过的结构</text>
          <text x="306" y="106" fill="var(--ink-secondary)" font-size="12">3–4 个支柱栏目拆出多切角矩阵，</text>
          <text x="306" y="126" fill="var(--ink-secondary)" font-size="12">对齐近期真正跑出高留存的表达外壳</text>

          <rect x="552" y="28" width="244" height="150" rx="15" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="570" y="56" fill="var(--orange)" font-size="11.5" font-weight="800">STEP 03 · 规模交付（AI 协作成稿）</text>
          <text x="570" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">填入个人观点产出多端成片</text>
          <text x="570" y="106" fill="var(--ink-secondary)" font-size="12">多数人失败在于跳过前两步直接吐稿；</text>
          <text x="570" y="126" fill="var(--ink-secondary)" font-size="12">获客破局：无需许可先替目标做出 10 篇</text>
        </svg>
        <figcaption>一人创意团队的正确顺序：先锁死「知识签名」与内容地图，最后才让 AI 套进验证结构出草稿</figcaption>
      </figure>`;

    /* 12. Code-Driven Isometric Explode Film Pipeline */
    case ':::diagram-code-video-pipeline:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 206" role="img" aria-label="等轴爆炸大片：代码驱动视频的九步控帧与两次人工拍板">
          <rect x="4" y="4" width="812" height="198" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="24" y="28" width="244" height="150" rx="15" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="42" y="56" fill="var(--ink-muted)" font-size="11.5" font-weight="800">01 · 图纸清洗与分层减法</text>
          <text x="42" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">删不可见碎件 · 同类编组 ★人拍板</text>
          <text x="42" y="106" fill="var(--ink-secondary)" font-size="12">把 856 个原始 CAD 零件收敛到清晰层级，</text>
          <text x="42" y="126" fill="var(--ink-secondary)" font-size="12">既防上下文崩溃，又让爆炸层次分明</text>

          <rect x="288" y="28" width="244" height="150" rx="15" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="306" y="56" fill="var(--blue)" font-size="11.5" font-weight="800">02 · 轨迹防穿模与遮挡预计算</text>
          <text x="306" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">先分层再散开 · 逐帧查穿插 ★人拍板</text>
          <text x="306" y="106" fill="var(--ink-secondary)" font-size="12">每一帧前后遮挡预先算死消除闪烁，</text>
          <text x="306" y="126" fill="var(--ink-secondary)" font-size="12">900 帧零穿模硬指标写进 Skill 门禁</text>

          <rect x="552" y="28" width="244" height="150" rx="15" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.5"/>
          <text x="570" y="56" fill="var(--mint)" font-size="11.5" font-weight="800">03 · 导演运镜与双形态交付</text>
          <text x="570" y="80" fill="var(--ink-primary)" font-size="14.5" font-weight="700">0.25s 卡点甩镜 + 交互网页同出</text>
          <text x="570" y="106" fill="var(--ink-secondary)" font-size="12">等轴底上叠透视推拉与动态模糊，</text>
          <text x="570" y="126" fill="var(--ink-secondary)" font-size="12">不满意改一行参数重渲，审美靠人写死</text>
        </svg>
        <figcaption>扩散模型抽盲盒 vs 代码算画面：把踩过的闪烁、穿模与运镜坑全部固化成 Skill 硬规则</figcaption>
      </figure>`;

    /* 13. Anthropic teams: six jobs */
    case ':::diagram-anthropic-six-jobs:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 292" role="img" aria-label="Anthropic 内部用 Claude Code 的六件事，以及分别是谁在做">
          <rect x="4" y="4" width="812" height="284" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="20" y="18" width="252" height="124" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="36" y="44" fill="var(--ink-muted)" font-size="11" font-weight="800">01 · 看仓库</text>
          <text x="36" y="70" fill="var(--ink-primary)" font-size="15" font-weight="700">先问该打开哪几个文件</text>
          <text x="36" y="96" fill="var(--ink-secondary)" font-size="12">数据从哪流到看板</text>
          <text x="36" y="122" fill="var(--blue)" font-size="11.5" font-weight="700">数据基建 · 产品工程</text>

          <rect x="284" y="18" width="252" height="124" rx="14" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="300" y="44" fill="var(--blue)" font-size="11" font-weight="800">02 · 写测试</text>
          <text x="300" y="70" fill="var(--ink-primary)" font-size="15" font-weight="700">写完别把测试丢掉</text>
          <text x="300" y="96" fill="var(--ink-secondary)" font-size="12">先要伪代码，再按测试往下写</text>
          <text x="300" y="122" fill="var(--blue)" font-size="11.5" font-weight="700">产品设计 · 安全 · 推理</text>

          <rect x="548" y="18" width="252" height="124" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="564" y="44" fill="var(--ink-muted)" font-size="11" font-weight="800">03 · 查故障</text>
          <text x="564" y="70" fill="var(--ink-primary)" font-size="15" font-weight="700">报错和截图一起给</text>
          <text x="564" y="96" fill="var(--ink-secondary)" font-size="12">顺着调用把原因找出来</text>
          <text x="564" y="122" fill="var(--blue)" font-size="11.5" font-weight="700">安全 · 产品工程 · 数据基建</text>

          <rect x="20" y="154" width="252" height="120" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="36" y="180" fill="var(--ink-muted)" font-size="11" font-weight="800">04 · 做原型</text>
          <text x="36" y="206" fill="var(--ink-primary)" font-size="15" font-weight="700">不会那门语言也能跑起来</text>
          <text x="36" y="232" fill="var(--ink-secondary)" font-size="12">设计稿进去，自己写、自己改</text>
          <text x="36" y="254" fill="var(--blue)" font-size="11.5" font-weight="700">产品设计 · 数据科学</text>

          <rect x="284" y="154" width="252" height="120" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="300" y="180" fill="var(--ink-muted)" font-size="11" font-weight="800">05 · 收文档</text>
          <text x="300" y="206" fill="var(--ink-primary)" font-size="15" font-weight="700">散落说明收成几页手册</text>
          <text x="300" y="232" fill="var(--ink-secondary)" font-size="12">下次出事直接拿来当上下文</text>
          <text x="300" y="254" fill="var(--blue)" font-size="11.5" font-weight="700">推理 · 安全</text>

          <rect x="548" y="154" width="252" height="120" rx="14" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.5"/>
          <text x="564" y="180" fill="var(--mint)" font-size="11" font-weight="800">06 · 做小工具</text>
          <text x="564" y="206" fill="var(--ink-primary)" font-size="15" font-weight="700">部门自己做出能用的东西</text>
          <text x="564" y="232" fill="var(--ink-secondary)" font-size="12">广告变体、内部电话树</text>
          <text x="564" y="254" fill="var(--blue)" font-size="11.5" font-weight="700">增长市场 · 法务</text>
        </svg>
        <figcaption>六件事横跨写代码的人和不写代码的人。官方觉得意外的，是后两格。</figcaption>
      </figure>`;

    /* 14. Security workflow before / after */
    case ':::diagram-test-before-after:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 188" role="img" aria-label="安全工程团队写测试的前后对比">
          <rect x="4" y="4" width="812" height="180" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="20" y="22" width="382" height="144" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="38" y="50" fill="var(--ink-muted)" font-size="11" font-weight="800">以前</text>
          <text x="38" y="78" fill="var(--ink-primary)" font-size="15" font-weight="700">写着写着，测试就没了</text>
          <text x="38" y="108" fill="var(--ink-secondary)" font-size="12.5">设计文档，糊一版代码，再重构</text>
          <text x="38" y="130" fill="var(--ink-secondary)" font-size="12.5">最后一步常常是：测试不做了</text>

          <rect x="418" y="22" width="382" height="144" rx="14" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.6"/>
          <text x="436" y="50" fill="var(--mint)" font-size="11" font-weight="800">现在</text>
          <text x="436" y="78" fill="var(--ink-primary)" font-size="15" font-weight="700">先要一版伪代码</text>
          <text x="436" y="108" fill="var(--ink-secondary)" font-size="12.5">让它按测试驱动往下写</text>
          <text x="436" y="130" fill="var(--ink-secondary)" font-size="12.5">人隔一会儿回来看，不全程盯着</text>
        </svg>
        <figcaption>安全工程团队自己的改法。测得到的代码，比写完再补测试稳。</figcaption>
      </figure>`;

    /* 15. Kubernetes IP exhaustion incident */
    case ':::diagram-ip-exhaustion:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 176" role="img" aria-label="数据基建一次故障：从截图到找到 IP 用完">
          <rect x="4" y="4" width="812" height="168" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <rect x="20" y="28" width="244" height="120" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="36" y="56" fill="var(--ink-muted)" font-size="11" font-weight="800">01</text>
          <text x="36" y="84" fill="var(--ink-primary)" font-size="15" font-weight="700">集群不再调度 Pod</text>
          <text x="36" y="112" fill="var(--ink-secondary)" font-size="12.5">把监控面板的截图给它</text>

          <rect x="288" y="28" width="244" height="120" rx="14" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="304" y="56" fill="var(--blue)" font-size="11" font-weight="800">02</text>
          <text x="304" y="84" fill="var(--ink-primary)" font-size="15" font-weight="700">一屏一屏点控制台</text>
          <text x="304" y="112" fill="var(--ink-secondary)" font-size="12.5">它带着人走 Google Cloud 的菜单</text>

          <rect x="556" y="28" width="244" height="120" rx="14" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.5"/>
          <text x="572" y="56" fill="var(--mint)" font-size="11" font-weight="800">03</text>
          <text x="572" y="84" fill="var(--ink-primary)" font-size="15" font-weight="700">Pod 的 IP 用完了</text>
          <text x="572" y="112" fill="var(--ink-secondary)" font-size="12.5">接着给出新建地址池的命令</text>
        </svg>
        <figcaption>数据基建团队的一次故障。他们说，这样少花了大约 20 分钟。</figcaption>
      </figure>`;

    /* 16. AI Code Video: Opening Hooks & Real Dynamic UI Effects */
    case ':::diagram-code-video-effects:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 296" role="img" aria-label="AI 代码视频：四大黄金开场钩子与五大真实动态入镜效果">
          <rect x="4" y="4" width="812" height="288" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">VISUAL ARSENAL · 前 3 秒黄金开场 4 式 × 把「真实动态交互」直接写进视频帧</text>

          <!-- Left: 4 Opening Hooks -->
          <rect x="24" y="50" width="362" height="222" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="42" y="78" fill="var(--orange)" font-size="12" font-weight="800">A · 前 3 秒开场视觉钩子（0–90 帧抓死眼球）</text>
          <text x="42" y="108" fill="var(--ink-primary)" font-size="13" font-weight="700">01 重字砸屏卡点（Kinetic Stomp）</text>
          <text x="42" y="126" fill="var(--ink-secondary)" font-size="11.5">痛点关键词随重音逐词弹入 + 底部荧光笔动态划线</text>
          <text x="42" y="154" fill="var(--ink-primary)" font-size="13" font-weight="700">02 前后反差滑杆（Split Before/After Wipe）</text>
          <text x="42" y="172" fill="var(--ink-secondary)" font-size="11.5">左灰暗混乱旧界面，分割线一扫切出右侧清爽新方案</text>
          <text x="42" y="200" fill="var(--ink-primary)" font-size="13" font-weight="700">03 实时指令唤醒（Live Prompt Wakeup）</text>
          <text x="42" y="218" fill="var(--ink-secondary)" font-size="11.5">光标高速敲入一句话回车，输入框原地撑开成完整界面</text>
          <text x="42" y="246" fill="var(--ink-primary)" font-size="13" font-weight="700">04 暗角聚光特写（Vignette Spotlight）</text>
          <text x="42" y="262" fill="var(--ink-secondary)" font-size="11.5">四周压暗 70%，只留一束柔光锁死报错红框或反差指标</text>

          <!-- Right: 5 Live Dynamic Effects -->
          <rect x="404" y="50" width="392" height="222" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="422" y="78" fill="var(--blue)" font-size="12" font-weight="800">B · 代码视频独有的「真实动态」入镜（黑盒生视频做不到）</text>
          <text x="422" y="108" fill="var(--ink-primary)" font-size="13" font-weight="700">① 真实组件矢量挂载（Live Component Mount）</text>
          <text x="422" y="126" fill="var(--ink-secondary)" font-size="11.5">真实网页卡片/代码块直接入镜，推近 3 倍依然零锯齿</text>
          <text x="422" y="154" fill="var(--ink-primary)" font-size="13" font-weight="700">② 拟真光标编排（Choreographed Cursor）</text>
          <text x="422" y="172" fill="var(--ink-secondary)" font-size="11.5">贝塞尔弧线移动 → 悬停高亮 → 按下回弹波纹 → 图标变勾</text>
          <text x="422" y="200" fill="var(--ink-primary)" font-size="13" font-weight="700">③ 数据滚轮与流光连线（Spring Counter &amp; Flow）</text>
          <text x="422" y="218" fill="var(--ink-secondary)" font-size="11.5">指标数字里程表跳变、柱状图弹簧生长、架构线脉冲流光</text>
          <text x="422" y="246" fill="var(--ink-primary)" font-size="13" font-weight="700">④ 3D 透视叠卡与逐词高亮字幕（3D Tilt &amp; Word Sync）</text>
          <text x="422" y="262" fill="var(--ink-secondary)" font-size="11.5">平面卡片转入三维空间分层拆解 + 字幕胶囊随人声滑动</text>
        </svg>
        <figcaption>图 1 · 代码视频的核心护城河：不是放静态截图，而是让真实的按钮、光标、数字与三维层级在帧里活起来</figcaption>
      </figure>`;

    /* 17. Virtual Camera Choreography & Cutting Rhythm */
    case ':::diagram-camera-choreography:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 256" role="img" aria-label="虚拟摄像机运镜体系与切镜弹簧节奏铁律">
          <rect x="4" y="4" width="812" height="248" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">VIRTUAL CAMERA &amp; PACING · 告别死板 PPT 平移：套一层虚拟摄像机 + 物理弹簧阻尼</text>

          <rect x="24" y="52" width="248" height="176" rx="15" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="42" y="78" fill="var(--blue)" font-size="11.5" font-weight="800">01 · 虚拟摄像机容器（CameraRig）</text>
          <text x="42" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">动机位，别乱动十几个子元素</text>
          <text x="42" y="128" fill="var(--ink-secondary)" font-size="12">· 推镜特写：scale(1 → 1.85) + 微倾 6°</text>
          <text x="42" y="150" fill="var(--ink-secondary)" font-size="12">· 拉镜全局：局部痛点瞬间拉出整套架构</text>
          <text x="42" y="172" fill="var(--ink-secondary)" font-size="12">· 滑轨跟拍：焦点始终锁在光标/高亮流上</text>
          <text x="42" y="196" fill="var(--blue)" font-size="11.5" font-weight="700">· 悬浮微呼吸：停留期 ±4px 消除死板感</text>

          <rect x="286" y="52" width="248" height="176" rx="15" fill="var(--bg-card)" stroke="var(--border-strong)"/>
          <text x="304" y="78" fill="var(--mint)" font-size="11.5" font-weight="800">02 · 高级转场（Transitions）</text>
          <text x="304" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">0.25s 甩镜 + 匹配变形转场</text>
          <text x="304" y="128" fill="var(--ink-secondary)" font-size="12">· 甩镜 Whip Pan：14 帧高速横甩叠模糊</text>
          <text x="304" y="150" fill="var(--ink-secondary)" font-size="12">· 匹配剪辑 Match Cut：输入框直接撑成看板</text>
          <text x="304" y="172" fill="var(--ink-secondary)" font-size="12">· 拒绝满屏乱飞的廉价百叶窗与旋转淡出</text>
          <text x="304" y="196" fill="var(--mint)" font-size="11.5" font-weight="700">· J-Cut 铁律：音效比切镜提前 4 帧响起</text>

          <rect x="548" y="52" width="248" height="176" rx="15" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="566" y="78" fill="var(--orange)" font-size="11.5" font-weight="800">03 · 呼吸与弹簧节奏（Timing）</text>
          <text x="566" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">3 秒换气律 + 严禁 Linear 匀速</text>
          <text x="566" y="128" fill="var(--ink-secondary)" font-size="12">· 每 90–180 帧必有一次景别或焦点切换</text>
          <text x="566" y="150" fill="var(--ink-secondary)" font-size="12">· 摄像机推进：高阻尼稳重（damping 26）</text>
          <text x="566" y="172" fill="var(--ink-secondary)" font-size="12">· 卡片弹入：清脆微回弹（damping 18）</text>
          <text x="566" y="196" fill="var(--orange)" font-size="11.5" font-weight="700">· 列表错峰 Stagger：每项延迟 3–5 帧</text>
        </svg>
        <figcaption>图 2 · 电影感来自克制的物理惯性：推镜看细节、拉镜看结构、甩镜换篇章</figcaption>
      </figure>`;

    /* 18. Standardized Code-Video Production Pipeline */
    case ':::diagram-video-standard-sop:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 218" role="img" aria-label="标准化稳定产出高质量代码视频的四步工程管线">
          <rect x="4" y="4" width="812" height="210" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">STANDARDIZED PIPELINE · 不靠换模型抽盲盒，靠「四步规格单 + 确定性帧门禁」稳定出大片</text>

          <rect x="22" y="54" width="182" height="138" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="38" y="80" fill="var(--blue)" font-size="11" font-weight="800">STEP 01 · 锁死全局底座</text>
          <text x="38" y="102" fill="var(--ink-primary)" font-size="13.5" font-weight="700">Theme &amp; 安全区常量</text>
          <text x="38" y="126" fill="var(--ink-secondary)" font-size="11.5">60fps · 四色 HEX · 字阶</text>
          <text x="38" y="146" fill="var(--ink-secondary)" font-size="11.5">预设 3 套标准弹簧曲线</text>
          <text x="38" y="166" fill="var(--ink-secondary)" font-size="11.5">留足四周 10% 防遮挡边距</text>

          <rect x="218" y="54" width="182" height="138" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="234" y="80" fill="var(--blue)" font-size="11" font-weight="800">STEP 02 · 导演分镜表</text>
          <text x="234" y="102" fill="var(--ink-primary)" font-size="13.5" font-weight="700">先对齐帧区间再写码</text>
          <text x="234" y="126" fill="var(--ink-secondary)" font-size="11.5">拆成独立 Sequence 片段</text>
          <text x="234" y="146" fill="var(--ink-secondary)" font-size="11.5">标明每幕运镜词与唯一焦点</text>
          <text x="234" y="166" fill="var(--ink-secondary)" font-size="11.5">人先拍板分镜，绝不闷头写</text>

          <rect x="414" y="54" width="190" height="138" rx="14" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="430" y="80" fill="var(--blue)" font-size="11" font-weight="800">STEP 03 · 确定性编码红线</text>
          <text x="430" y="102" fill="var(--ink-primary)" font-size="13.5" font-weight="700">100% 纯帧号函数驱动</text>
          <text x="430" y="126" fill="var(--ink-secondary)" font-size="11.5">严禁 CSS transition 动画</text>
          <text x="430" y="146" fill="var(--ink-secondary)" font-size="11.5">严禁 setTimeout / 随机数</text>
          <text x="430" y="166" fill="var(--mint)" font-size="11.5" font-weight="700">✓ 任意帧并发渲染零闪屏</text>

          <rect x="618" y="54" width="180" height="138" rx="14" fill="var(--bg-card)" stroke="var(--mint)" stroke-width="1.5"/>
          <text x="634" y="80" fill="var(--mint)" font-size="11" font-weight="800">STEP 04 · 抽帧验收精修</text>
          <text x="634" y="102" fill="var(--ink-primary)" font-size="13.5" font-weight="700">三帧快照查溢出穿模</text>
          <text x="634" y="126" fill="var(--ink-secondary)" font-size="11.5">导出每幕入场/峰值/定格帧</text>
          <text x="634" y="146" fill="var(--ink-secondary)" font-size="11.5">检查字号对比与对齐基线</text>
          <text x="634" y="166" fill="var(--ink-secondary)" font-size="11.5">单改某幕参数毫秒级重出</text>
        </svg>
        <figcaption>图 3 · 稳定高质量的秘密：把模糊的「做好看点」拆解成主题 Token、精准运镜术语与纯帧号确定性红线</figcaption>
      </figure>`;

    /* 19. Clean UI Four-Color & Card-in-Card Specification */
    case ':::diagram-ui-aesthetic-spec:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 246" role="img" aria-label="去塑料感四色比例铁律与外灰内白双层卡规范">
          <rect x="4" y="4" width="812" height="238" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">CLEAN UI SPECIFICATION · 为什么顶级产品看着干净耐看？靠的是比例纪律，而不是堆渐变特效</text>

          <rect x="24" y="52" width="248" height="168" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="42" y="78" fill="var(--blue)" font-size="11.5" font-weight="800">01 · 四色比例铁律（60-30-8-2）</text>
          <text x="42" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">全页严禁超过 4 个核心色值</text>
          <text x="42" y="128" fill="var(--ink-secondary)" font-size="12">· 60% 画布浅灰底（#F6F7F9）</text>
          <text x="42" y="150" fill="var(--ink-secondary)" font-size="12">· 30% 纯白内容卡（#FFFFFF）</text>
          <text x="42" y="172" fill="var(--ink-secondary)" font-size="12">· 8% 深炭黑文字（#0A0A0B）</text>
          <text x="42" y="196" fill="var(--blue)" font-size="11.5" font-weight="700">· ≤2% 唯一品牌强调色点睛</text>

          <rect x="286" y="52" width="248" height="168" rx="16" fill="var(--bg-card)" stroke="var(--border-strong)"/>
          <text x="304" y="78" fill="var(--mint)" font-size="11.5" font-weight="800">02 · 外灰内白双层卡（Card-in-Card）</text>
          <text x="304" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">用色温差取代生硬粗黑框</text>
          <text x="304" y="128" fill="var(--ink-secondary)" font-size="12">· 外壳圆角 24px + 1px 极淡边</text>
          <text x="304" y="150" fill="var(--ink-secondary)" font-size="12">· 内嵌纯白工作区圆角 16px</text>
          <text x="304" y="172" fill="var(--ink-secondary)" font-size="12">· 阴影用两层低透明漫射光</text>
          <text x="304" y="196" fill="var(--mint)" font-size="11.5" font-weight="700">· 禁蓝紫霓虹发光边与毛玻璃滥用</text>

          <rect x="548" y="52" width="248" height="168" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="566" y="78" fill="var(--orange)" font-size="11.5" font-weight="800">03 · 字重反差与矢量秩序</text>
          <text x="566" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">细节对齐决定专业可信度</text>
          <text x="566" y="128" fill="var(--ink-secondary)" font-size="12">· 标题字距收紧 -0.03em 显紧凑</text>
          <text x="566" y="150" fill="var(--ink-secondary)" font-size="12">· 所有数据指标开 tabular-nums</text>
          <text x="566" y="172" fill="var(--ink-secondary)" font-size="12">· 统一 1.75px 线性几何 SVG 图标</text>
          <text x="566" y="196" fill="var(--orange)" font-size="11.5" font-weight="700">· 正文与按钮全面清零彩色 Emoji</text>
        </svg>
        <figcaption>图 1 · 审美不是玄学：把颜色数量、圆角嵌套关系与字体字距写成死规矩，AI 一遍就能写出工作室质感</figcaption>
      </figure>`;

    /* 20. Translating Vague Adjectives into Deterministic Parameters */
    case ':::diagram-prompt-translation:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 236" role="img" aria-label="从模糊感觉词到确定性工程参数的翻译方法">
          <rect x="4" y="4" width="812" height="228" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">PARAMETER TRANSLATION · 为什么说「高级、丝滑、大气」必翻车？因为模型需要的是可计算的物理边界</text>

          <rect x="24" y="52" width="356" height="158" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="44" y="80" fill="var(--orange)" font-size="12" font-weight="800">✕ 必翻车的模糊感觉词（AI 会退回平庸均值）</text>
          <text x="44" y="110" fill="var(--ink-secondary)" font-size="12.5">· “帮我做一个高端大气、很有科技感的官网”</text>
          <text x="44" y="136" fill="var(--ink-secondary)" font-size="12.5">· “动效要炫酷一点、丝滑一点，别太死板”</text>
          <text x="44" y="162" fill="var(--ink-secondary)" font-size="12.5">· “把这个口播写成一段好看的产品演示视频”</text>
          <text x="44" y="190" fill="var(--ink-muted)" font-size="11.5">后果：满屏蓝紫渐变 + 廉价 Emoji + 匀速乱飞 PPT</text>

          <path d="M390 131 L428 131" stroke="var(--blue)" stroke-width="2.2" stroke-dasharray="4 3"/>
          <polygon points="426,125 438,131 426,137" fill="var(--blue)"/>

          <rect x="446" y="52" width="350" height="158" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="466" y="80" fill="var(--blue)" font-size="12" font-weight="800">✓ 一遍命中的确定性参数指令（锁死上下限）</text>
          <text x="466" y="110" fill="var(--ink-primary)" font-size="12.5" font-weight="600">· 四色 HEX + 外灰内白双层卡 + 留白间距阶梯</text>
          <text x="466" y="136" fill="var(--ink-primary)" font-size="12.5" font-weight="600">· 弹簧 stiffness:210 / damping:20 + 错峰 4 帧</text>
          <text x="466" y="162" fill="var(--ink-primary)" font-size="12.5" font-weight="600">· 先出帧级分镜单 → CameraRig 推镜 1.6x 锁焦点</text>
          <text x="466" y="190" fill="var(--mint)" font-size="11.5" font-weight="700">结果：审美稳定可控，换哪个主力模型都不走样</text>
        </svg>
        <figcaption>图 1 · 提示词的核心功夫：把脑子里的「品味直觉」翻译成模型无法偷懒曲解的色值、帧号、阻尼与红线</figcaption>
      </figure>`;

    /* 21. Dan Martell: five shifts, stacked */
    case ':::diagram-martell-five-shifts:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 392" role="img" aria-label="Dan Martell 白板上的五层，一层压一层">
          <rect x="4" y="4" width="812" height="384" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="36" fill="var(--ink-muted)" font-size="12" font-weight="700">五层是叠上去的。下面没做，上面就是空的。</text>

          <rect x="24" y="54" width="772" height="58" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="44" y="78" fill="var(--ink-muted)" font-size="12" font-weight="700">01</text>
          <text x="84" y="78" fill="var(--ink-primary)" font-size="15" font-weight="700">别用它把蠢事做得更快</text>
          <text x="84" y="98" fill="var(--ink-secondary)" font-size="13">先找出这件事唯一卡住的地方，人和工具都压在那一处。</text>

          <rect x="24" y="120" width="772" height="58" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="44" y="144" fill="var(--ink-muted)" font-size="12" font-weight="700">02</text>
          <text x="84" y="144" fill="var(--ink-primary)" font-size="15" font-weight="700">先是你加上它，再是团队加上它</text>
          <text x="84" y="164" fill="var(--ink-secondary)" font-size="13">老板自己是盖子。你不用透，团队的上限就锁在你这里。</text>

          <rect x="24" y="186" width="772" height="58" rx="12" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="44" y="210" fill="var(--blue)" font-size="12" font-weight="700">03</text>
          <text x="84" y="210" fill="var(--ink-primary)" font-size="15" font-weight="700">先写清角色，再写提示词</text>
          <text x="84" y="230" fill="var(--ink-secondary)" font-size="13">职责、做成什么样、什么不许做。提示词是角色定了之后的一句。 </text>

          <rect x="24" y="252" width="772" height="58" rx="12" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="44" y="276" fill="var(--ink-muted)" font-size="12" font-weight="700">04</text>
          <text x="84" y="276" fill="var(--ink-primary)" font-size="15" font-weight="700">家底是你整理过的数据和例子</text>
          <text x="84" y="296" fill="var(--ink-secondary)" font-size="13">工具会换。干净的事实和做过的样例，才是下次还能用的那一份。</text>

          <rect x="24" y="318" width="772" height="52" rx="12" fill="var(--bg-card)" stroke="var(--border-strong)"/>
          <text x="44" y="340" fill="var(--ink-muted)" font-size="12" font-weight="700">05</text>
          <text x="84" y="340" fill="var(--ink-primary)" font-size="15" font-weight="700">做完要有一圈反馈，否则只是自动再跑一遍</text>
          <text x="84" y="358" fill="var(--ink-secondary)" font-size="13">结果回来，改下一次怎么做。一年五十二次，比换一个新工具有用。</text>
        </svg>
        <figcaption>图 1 · 白板上的五层。他反复说，这几层是堆在一起的，不是五条并列的建议。</figcaption>
      </figure>`;

    /* 22. Learning loop */
    case ':::diagram-martell-learning-loop:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 220" role="img" aria-label="学习闭环：做完、看结果、写回去、再做">
          <rect x="4" y="4" width="812" height="212" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="36" fill="var(--ink-muted)" font-size="12" font-weight="700">没有这一圈，它就不是会干活的人，只是一条自动脚本。</text>

          <rect x="28" y="64" width="168" height="88" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="112" y="104" text-anchor="middle" fill="var(--ink-primary)" font-size="16" font-weight="700">做完</text>
          <text x="112" y="128" text-anchor="middle" fill="var(--ink-secondary)" font-size="12">按角色交一件事</text>

          <path d="M204 108 H236" stroke="var(--blue)" stroke-width="1.8"/>
          <polygon points="236,102 248,108 236,114" fill="var(--blue)"/>

          <rect x="256" y="64" width="168" height="88" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="340" y="104" text-anchor="middle" fill="var(--ink-primary)" font-size="16" font-weight="700">看结果</text>
          <text x="340" y="128" text-anchor="middle" fill="var(--ink-secondary)" font-size="12">哪里对，哪里错</text>

          <path d="M432 108 H464" stroke="var(--blue)" stroke-width="1.8"/>
          <polygon points="464,102 476,108 464,114" fill="var(--blue)"/>

          <rect x="484" y="64" width="168" height="88" rx="14" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.5"/>
          <text x="568" y="104" text-anchor="middle" fill="var(--ink-primary)" font-size="16" font-weight="700">写回去</text>
          <text x="568" y="128" text-anchor="middle" fill="var(--ink-secondary)" font-size="12">改角色，补例子</text>

          <path d="M568 152 V176 H112 V152" fill="none" stroke="var(--blue)" stroke-width="1.6" stroke-dasharray="4 3"/>
          <polygon points="106,160 112,148 118,160" fill="var(--blue)"/>
          <text x="340" y="198" text-anchor="middle" fill="var(--ink-muted)" font-size="12">下一周用改过的版本再做。他举的节奏是一年五十二次。</text>
        </svg>
        <figcaption>图 2 · 学习闭环。反馈要进到下一次的做法里，停在聊天记录里不算。</figcaption>
      </figure>`;

    /* 23. Articulation: four daily practices */
    case ':::diagram-articulate-four:::':
      return `
      <figure class="editorial-diagram step-list" aria-label="把话说清楚的四件日常练习">
        <p class="step-kicker">四件都是每天能做的。先养尺子，再写，再放慢，再放进小事里。</p>
        <ol>
          <li><span>01</span><div><strong>先吃好的</strong><p>你平时读的、听的，就是你后来觉得「这句不错」的那把尺子。</p></div></li>
          <li class="is-focus"><span>02</span><div><strong>写下来</strong><p>写是为了看见裂缝。脑子里那一版，总是比纸上好看。</p></div></li>
          <li><span>03</span><div><strong>把速度放慢</strong><p>停一下。用沉默留白，比赶紧用「嗯」「那个」把空填上更清楚。</p></div></li>
          <li><span>04</span><div><strong>小事上也练</strong><p>厨房里、一条消息里怎么说，到了要紧的场合，就是那个样子。</p></div></li>
        </ol>
        <figcaption>图 1 · 他给的四件练习。写是枢纽：吃好的养尺子，放慢给节奏，小事上练，是不把它留到面试那一天。</figcaption>
      </figure>`;

    /* 24. MotionHarness Flipbook Engine Principle */
    case ':::diagram-mh-flipbook-engine:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 248" role="img" aria-label="剪映手工剪辑、黑盒文生视频与 MotionHarness 连环画抓拍引擎三路线对比">
          <rect x="4" y="4" width="812" height="240" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">HOW MOTIONHARNESS WORKS · 为什么讲商业逻辑与真实界面，代码连环画引擎是降维打击？</text>

          <rect x="22" y="52" width="232" height="168" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="38" y="78" fill="var(--ink-muted)" font-size="11.5" font-weight="800">01 · 剪映 / PR（手工剪贴报）</text>
          <text x="38" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">人肉找图 + 逐帧拉曲线</text>
          <text x="38" y="128" fill="var(--ink-secondary)" font-size="12">· 放大截图必糊成马赛克</text>
          <text x="38" y="150" fill="var(--ink-secondary)" font-size="12">· 改两个字要重排十几条轨道</text>
          <text x="38" y="194" fill="var(--ink-muted)" font-size="11.5">痛点：极耗体力，好动效难跨期复用</text>

          <rect x="268" y="52" width="232" height="168" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="284" y="78" fill="var(--orange)" font-size="11.5" font-weight="800">02 · 文生视频（开盲盒拍片）</text>
          <text x="284" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">适合风景实拍，不擅讲逻辑</text>
          <text x="284" y="128" fill="var(--ink-secondary)" font-size="12">· 中文排版与数据图表易乱码</text>
          <text x="284" y="150" fill="var(--ink-secondary)" font-size="12">· 无法精准只改某一个按钮或数字</text>
          <text x="284" y="194" fill="var(--orange)" font-size="11.5">痛点：不可控，没法精确推演干货</text>

          <rect x="514" y="52" width="282" height="168" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="532" y="78" fill="var(--blue)" font-size="11.5" font-weight="800">03 · MotionHarness（代码连环画棚）</text>
          <text x="532" y="102" fill="var(--ink-primary)" font-size="14" font-weight="700">prepareFrame(time) 每秒抓拍 60 张</text>
          <text x="532" y="128" fill="var(--ink-secondary)" font-size="12">· 中文字体与真微信/代码界面 4K 锐利</text>
          <text x="532" y="150" fill="var(--ink-secondary)" font-size="12">· 改一句话 1 秒重算，好镜头存积木永久复用</text>
          <text x="532" y="194" fill="var(--mint)" font-size="11.5" font-weight="700">✓ 100% 确定性可控 · 越做越省力</text>
        </svg>
        <figcaption>图 1 · MotionHarness 的本质：把时间 t 当成输入参数，让浏览器高速连拍每一帧再焊上音轨直出 MP4</figcaption>
      </figure>`;

    /* 24. Flashlight Single-Focus vs Crowded Webpage Bento */
    case ':::diagram-mh-flashlight-brain:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 242" role="img" aria-label="网页开大灯多框过载与爆款视频关灯手电筒单焦点对比">
          <rect x="4" y="4" width="812" height="234" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">FLASHLIGHT LAW · 去 AI 课件味的第一性原理：从「开大灯看整墙报纸」切换到「关灯拿手电筒照一个词」</text>

          <rect x="24" y="52" width="368" height="162" rx="16" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="44" y="78" fill="var(--orange)" font-size="12" font-weight="800">✕ AI 默认网页习惯：开大灯塞满一屏（眼球打架）</text>
          <text x="44" y="106" fill="var(--ink-secondary)" font-size="12">· 顶栏标题 + 左右双霓虹框 + 6 条列表 + 英文小徽章</text>
          <text x="44" y="130" fill="var(--ink-secondary)" font-size="12">· 同屏 80 个字静止 10 秒，逼观众用左脑吃力读课件</text>
          <text x="44" y="154" fill="var(--ink-secondary)" font-size="12">· 画面在重复配音台词，耳朵和眼睛互相抢戏</text>
          <text x="44" y="190" fill="var(--ink-muted)" font-size="11.5">结果：观众 2 秒钟视觉疲劳，手指立刻上滑划走</text>

          <path d="M402 133 L432 133" stroke="var(--blue)" stroke-width="2.2" stroke-dasharray="4 3"/>
          <polygon points="430,127 442,133 430,139" fill="var(--blue)"/>

          <rect x="450" y="52" width="346" height="162" rx="16" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="470" y="78" fill="var(--blue)" font-size="12" font-weight="800">✓ 爆款视频导演思维：手电筒 + 心跳交替</text>
          <text x="470" y="106" fill="var(--ink-primary)" font-size="12.5" font-weight="600">· 单焦点铁律：留白 ≥ 65%，同屏绝不超过 10 个字</text>
          <text x="470" y="130" fill="var(--ink-primary)" font-size="12.5" font-weight="600">· 心跳收缩（1.5s）：180px 巨字亮术语锤进脑海</text>
          <text x="470" y="154" fill="var(--ink-primary)" font-size="12.5" font-weight="600">· 心跳舒张（3.5s）：物理小剧场或真微信特写演出来</text>
          <text x="470" y="190" fill="var(--mint)" font-size="11.5" font-weight="700">结果：右脑 0.1 秒直觉秒懂，视线被牢牢吸在屏幕中央</text>
        </svg>
        <figcaption>图 2 · 声音负责讲句子，画面只负责演瞬间——画面一旦替配音写总结陈词，立刻退化成 PPT</figcaption>
      </figure>`;

    /* 25. Visual Motif Continuity: One Vermilion "1" Across 4 Acts */
    case ':::diagram-mh-motif-one:::':
      return `
      <figure class="editorial-diagram">
        <svg viewBox="0 0 820 226" role="img" aria-label="一物贯穿全片巧思：同一根朱砂红的 1 依次变形为钻头、激光红线、兜底方印与百万倍支柱">
          <rect x="4" y="4" width="812" height="218" rx="22" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
          <text x="28" y="34" fill="var(--ink-muted)" font-size="11" font-weight="800" letter-spacing="1.2">VISUAL MOTIF · 告别东拼西凑的图标库：用「同一根朱砂红的 1」变形贯穿全片四幕</text>

          <rect x="22" y="52" width="182" height="146" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="38" y="76" fill="var(--blue)" font-size="11" font-weight="800">ACT 01 · 泥坑嗅觉</text>
          <rect x="105" y="92" width="12" height="54" rx="4" fill="var(--orange)"/>
          <circle cx="111" cy="158" r="7" fill="var(--mint)"/>
          <text x="38" y="182" fill="var(--ink-primary)" font-size="12" font-weight="700">「1」变探地钻头挖真金</text>

          <rect x="218" y="52" width="182" height="146" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="234" y="76" fill="var(--blue)" font-size="11" font-weight="800">ACT 02 · 验收红线</text>
          <rect x="242" y="122" width="134" height="10" rx="5" fill="var(--orange)"/>
          <text x="282" y="110" fill="var(--ink-muted)" font-size="11" font-weight="700">✕ 拦截废稿</text>
          <text x="234" y="182" fill="var(--ink-primary)" font-size="12" font-weight="700">旋转 90° 变激光安检线</text>

          <rect x="414" y="52" width="182" height="146" rx="14" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
          <text x="430" y="76" fill="var(--blue)" font-size="11" font-weight="800">ACT 03 · 拍板兜底</text>
          <rect x="463" y="98" width="84" height="50" rx="8" fill="var(--orange)"/>
          <text x="477" y="128" fill="#FFFFFF" font-size="12" font-weight="800">出了事我扛</text>
          <text x="430" y="182" fill="var(--ink-primary)" font-size="12" font-weight="700">收拢重锤变军令状红印</text>

          <rect x="610" y="52" width="188" height="146" rx="14" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.6"/>
          <text x="626" y="76" fill="var(--blue)" font-size="11" font-weight="800">ACT 04 · 终章合体</text>
          <rect x="634" y="96" width="16" height="52" rx="4" fill="var(--orange)"/>
          <text x="658" y="134" fill="var(--ink-primary)" font-size="26" font-weight="800" font-family="monospace">000,000</text>
          <text x="626" y="182" fill="var(--mint)" font-size="12" font-weight="700">立回最值钱的那个「1」</text>
        </svg>
        <figcaption>图 3 · 草蛇灰线伏脉千里：当观众最后发现钻头、红线、印章全都是同一个「1」时，作品瞬间有了电影灵魂</figcaption>
      </figure>`;

    /* 26. Interactive 5-Skin DESIGN.md Live Impact Stage */
    case ':::live-design-skins:::':
      return renderLiveDesignSkinsHTML();
    case ':::live-skin-mini-bar:::':
      return renderLiveSkinMiniBarHTML();

    /* 27. 3-Tier 12-Effect Live Video FX Matrices */
    case ':::live-fx-tier-1:::':
      return renderLiveFxTierHTML(1);
    case ':::live-fx-tier-2:::':
      return renderLiveFxTierHTML(2);
    case ':::live-fx-tier-3:::':
      return renderLiveFxTierHTML(3);

    /* 28. Interactive 4-Track Spring Physics Comparator */
    case ':::live-springs-compare:::':
      return renderLiveSpringsCompareHTML();

    /* 29. Interactive Flipbook & Flashlight Scrubber */
    case ':::live-flipbook-demo:::':
      return renderLiveFlipbookDemoHTML();

    /* 30. Which of the three creative jobs is missing */
    case ':::sandbox-creative-gap:::':
      return pickSandbox({
        badge: '点一下 · 你现在缺的是哪一步',
        label: '一人创意团队里，缺了哪一步',
        tabs: [
          {
            id: 'draft-only',
            label: '我直接让 AI 写',
            kicker: '缺了前两步',
            title: '稿子会像稿子，不像这个人',
            body: '模型没有方向，也没有这个人已经验证过的结构，只能把随机想法吐成帖子。发出去偶尔会有一条还行，停更之后没有人问起你。',
            example: '同一个人，一周写七条「行业观察」。读者看完只记得词，不记得是谁写的。先补一句：我帮的那个人，糟糕的一天长什么样。没有这句，七条都是路人。',
          },
          {
            id: 'topics-only',
            label: '我有选题，没立场',
            kicker: '内容策略有了，品牌没有',
            title: '账号能长大，人记不住',
            body: '选题、封面、标题、留存，这些能把数字做上去。可别人看完不知道你相信什么、反对什么。账号一停，就像没来过。',
            example: '你研究出「这种开头留存高」，于是每条都用这个开头。三个月后数据不错，私信里没人说「我就是冲你这个看法来的」。看法要先写在品牌那一页上，再拿去套结构。',
          },
          {
            id: 'first-client',
            label: '我想要第一单',
            kicker: '先交出十篇，再开口',
            title: '不必等对方答应你代写',
            body: '挑一个你愿意长期做的人。用上面的流程替他做出内容地图，再写出十篇，自己改顺，送过去。喜欢再谈。私信可以每天几封。不想只发私信，就把过程摊成一条短视频。',
            example: 'JK Molina 当年给 Dan 的私信就是这样：知道对方不想找人代写，还是先写了十篇。Dan 把这叫做不必先得到许可的学徒。十篇是样品，不是报价单。',
          },
        ],
      });

    /* 31. What the one morning hour is for */
    case ':::sandbox-one-hour:::':
      return pickSandbox({
        badge: '点一下 · 这一小时放在哪',
        label: '每天早上那一小时该做什么',
        tabs: [
          {
            id: 'no-product',
            label: '还没有东西卖',
            kicker: '先有能交换的那一件',
            title: '这一小时只做产品',
            body: '没有东西，内容就是在空地上招手。早上第一小时用来把一件能卖的东西做出来：一篇能收费的课、一个小工具、一次能交付的服务。别先写十条自我介绍。',
            example: '你想帮人把周报写短。这一小时不要发「我开始做一人公司了」。写清楚：对方交来一堆材料，你交回一页能直接发的周报，多少钱，多久。这就是产品。',
          },
          {
            id: 'no-audience',
            label: '有东西，没人看见',
            kicker: '杠杆要有人走过来',
            title: '这一小时只让人看见',
            body: '东西再好，没出现在别人眼前，就没有交换。有了产品之后，早上那一小时用来做一条能被看见的内容，并且让它指回那件东西。',
            example: '他拿约会打比方：你这个人值得认识，但从不出现，约不到。你天天出现，人却空，也约不到想要的那位。产品和露面，缺一不可。',
          },
          {
            id: 'build-all',
            label: '什么都想自己做',
            kicker: '小时很贵，订阅不贵',
            title: '别人的毕生事业，付钱',
            body: '谁都能造一点东西，不代表你该把小时花在每一样上。别人死磕过的排期、记账、剪辑，每月十几美元。你拿这小时去省它，是把最高杠杆的时间换成了最低的那一截。',
            example: '为了省掉一个月 15 美元的排期工具，你花了四个早上自己做。那四小时本可以写出一篇还在替你引人的文章。工具留给把这件事当毕生事业的人。',
          },
        ],
      });

    /* 32. AI PM layers */
    case ':::sandbox-ai-pm-layer:::':
      return pickSandbox({
        badge: '点一下 · 四类岗位每天在决定什么',
        label: 'AI 产品经理的四类岗位',
        tabs: [
          {
            id: 'model',
            label: '模型层',
            kicker: '定义模型该会什么',
            title: '把「感觉更好」拆成能打分的维度',
            body: '这一层管模型能力、数据、评测，还有训练和推理要花多少。不是画一个功能页面。DeepSeek 的 Agent 数据策略、OpenAI 的 Core Models，都在这层。岗位不多，但搜索、推荐、算法产品的人，门槛对得上。',
            example: '两份行业报告，你一眼觉得第二份好。这一岗要你接着说：好在事实、深度、结构，还是数据可靠。说不出维度，评测就还停在口味，模型也改不动。',
          },
          {
            id: 'platform',
            label: '平台层',
            kicker: '让别人稳当地用上模型',
            title: '协议、价目、用量，都是产品',
            body: '模型有了，开发者和别的团队还用不顺。开放平台、Agent 开发台、知识库、企业里的权限和计量，都在这层。腾讯混元的 API、百度的 Agent 知识引擎、阶跃的 Agent Harness，名字不同，都是在给模型加外围。',
            example: '平台要接一家新的模型厂商。你得问三句：接口和参数怎么对齐；能力和价格、上下文长度怎么摆给调用方；Token 怎么数、怎么计费。问不出这三句，方案会在第一家客户那里裂开。',
          },
          {
            id: 'native',
            label: '原生应用',
            kicker: '没有 AI，产品就不成立',
            title: '用法还没有行业范本',
            body: '聊天助手、AI 编程、AI 创作，核心价值建在模型上。月之暗面招的 AI Native，要你把模型变成用户能直接用的东西，并碰到提示词、流程和工具调用。形态变得快，能自己搭一个最小版本的人跟得上。',
            example: '你要做一个「替人盯合同」的助手。先别写三十页需求。拿三份真实合同，试两个模型，记下它在哪一类风险上会装懂。这一轮试出来的边界，比一份完整原型值钱。',
          },
          {
            id: 'embed',
            label: '老产品加 AI',
            kicker: '用户和生意都还在',
            title: 'AI 是新手段，问题是旧的',
            body: '点评把搜索做得更能帮人决定吃什么，电商帮商家写商品，办公软件做问答和流程。产品已经有人用、有流程、有赚钱的办法。你的工作是：AI 放在哪能改指标，以及怎么嵌进原来的体系，而不是另起一个聊天框。',
            example: '商家原来要写半天商品描述。你加了生成。上线后投诉变多，因为尺寸写错。评测不能只看「写得像不像人」，要看错尺寸的比例降了没有。行业经验在这里比模型名词值钱。',
          },
        ],
      });

    /* 33. AI PM path from current experience */
    case ':::sandbox-ai-pm-path:::':
      return pickSandbox({
        badge: '点一下 · 从你已经会的出发',
        label: '不同背景的产品经理往哪转',
        tabs: [
          {
            id: 'domain',
            label: '我懂一门业务',
            kicker: '不必先去做聊天助手',
            title: '把 AI 嵌进你已经懂的那条流程',
            body: '电商、广告、协作、人力、法律、医疗，样本里都有岗位。公司要的是：你知道原来的指标，也知道 AI 放进去会改哪一个。跨去一个全新的 C 端产品可以，学习成本更高。',
            example: '你做了五年招聘。与其从零学一个通用助手，不如看：简历筛选里，哪一步人在重复读、哪一步错了代价大。就在那一步做一版，用你们真实的简历试，不要用教程里的 PDF。',
          },
          {
            id: 'cloud',
            label: '我做过平台',
            kicker: '云、企业软件、安全、数据',
            title: '外围能力正在单独成岗',
            body: '模型服务、计量计费、知识怎么接进 Agent、工具调用的权限，和你做过的开放平台是同一类问题，多了推理成本和 Token。Agent 开始能读文件、跑操作之后，安全也不再只是「这句话得体不得体」。',
            example: '你做过对象存储的权限。Agent 现在能替用户改业务系统。第一问不是模型聪不聪明，是它能碰到哪些数据、做错了谁收得回来。这问法你已经会。',
          },
          {
            id: 'search',
            label: '我做过搜索或数据',
            kicker: '评测可以是一门专业',
            title: '去模型效果，而不是只去应用',
            body: '样本里模型层岗位少，但 DeepSeek、字节、OpenAI 都在招把效果说清楚的人。你的优势是：本来就在定义「什么叫好结果」，以及坏例子怎么进下一轮。',
            example: '搜索里你做过「点了又返回」。放到模型上，就是回答看起来通顺，用户却去别处核对。把这类坏例子收成固定样本，比再背一篇 RAG 教程更像这个岗位。',
          },
          {
            id: 'newapp',
            label: '我想做全新应用',
            kicker: '可以，但别用教程当作品',
            title: '用一个你会长期用的场景证明',
            body: '简历上写熟悉 RAG、Agent、提示词，区分度很低。他建议拿一个你自己的真实场景做下去，并且碰到真问题：检索不准、知识旧了、回答没有原文可对。解决问题的过程，才是作品。',
            example: '跟着教程做一个能读 PDF 的知识库，一个下午就完。换成你自己的笔记：上周改过的结论，它还在引用旧的。你怎么让它知道哪条作废。这一问，比界面好不好看更像产品。',
          },
        ],
      });

    /* 34. Jensen's four decisions, applied to this week */
    case ':::sandbox-jensen-call:::':
      return pickSandbox({
        badge: '点一下 · 这周你碰到的是哪一种',
        label: '用黄仁勋那场演讲里的四条，对一下这周的决定',
        tabs: [
          {
            id: 'too-expensive',
            label: '客户都说太贵',
            kicker: '先分清市场新不新',
            title: '成熟生意里该听，新生意里先问规律',
            body: '头五年，Dell、惠普、IBM 都说他的芯片超出主板预算。他赌的是两件事叠在一起：芯片会按摩尔定律变便宜，人对画面真实的胃口喂不饱。客户用今年的毛利表，算不到「有人愿意单买一张显卡」。',
            example: '如果你们的市场已经有价格和标准，客户说太贵，通常该听。如果市场还没成形，而你说得出它变便宜、需求变大的那条规律，贵的那一版可能才是产品。说不出规律，就只是固执。',
          },
          {
            id: 'good-enough',
            label: '这代已经够好',
            kicker: '够好是降价的开始',
            title: '在最好卖的时候拆掉它',
            body: '固定功能的图形芯片正赚钱，他把 GPU 改成可编程，做出着色器语言。那一代又热又难做，公司差点被压垮。他的算法是：你不自己拆，性能翻倍、价格减半会替你拆，然后大家打价格战。',
            example: '你们的导出功能大家都能用了，竞品用一半价格做出八成。再把导出加快 10%，换不来价钱。该问的是：下一件别人还做不到、我们愿意为此重做架构的是什么。',
          },
          {
            id: 'safe-deal',
            label: '来了一笔稳单',
            kicker: '稀缺的是注意力',
            title: '钱进来，人可能被调走',
            body: '主机厂商拿钱来做定制芯片，账上看着稳。他后来说代价很高：最紧的是那几十个架构师的时间，不是账上的现金。人被抽去配合定制，主航道就慢一拍。',
            example: '一个大客户要你们按他的旧表格做三个月定制，钱是好钱。先数会抽走谁。如果是唯一能做下一代的那两个人，这笔单是在花你们的主业。',
          },
          {
            id: 'vote',
            label: '三个人要投票',
            kicker: '股权可以平，决定不能平',
            title: '拐角后面看不见时，要有一个人拍板',
            body: '三个创始人起步时各出大约 200 美元，股份和薪水都差不多。从第一天就定了：做决定的只有一个 CEO。他说早期的战略没有标准答案，三个人投票，投出来的是谁都不得罪的平庸方案。',
            example: '合伙做侧项目，三个人对定价各执一词，于是取中间。中间那个价谁都不痛，也谁都不信。平分股份没问题。方向上留一个人，在看不清时愿意担。',
          },
        ],
      });

    /* 35. Before the money leaves */
    case ':::sandbox-before-money:::':
      return pickSandbox({
        badge: '点一下 · 这笔钱出去之前',
        label: '花钱或加班之前，先对上他的五问',
        tabs: [
          {
            id: 'buy',
            label: '想买一样东西',
            kicker: '第一问：往口袋里放，还是往外拿',
            title: '先分清他所说的资产和负债',
            body: '他用《富爸爸穷爸爸》的分法：资产是把钱放进你口袋的东西，负债是不停从口袋里掏钱的东西。收入高却存不下，常常是因为买进来的大多在放大后一种。',
            example: '两个人月入差不多。一个加上房贷、车贷、消费贷，每个月被掏走。一个把余钱放进会自己产生收入的东西。几年后看起来「谁更能挣」的差别，先是从这句问法开始的。自住的房子比这句口号复杂，问法先留下。',
          },
          {
            id: 'overtime',
            label: '想靠加班多赚',
            kicker: '时间换钱有天花板',
            title: '一天还是只有 24 小时',
            body: '他引纳瓦尔：靠出租时间富不了，要有股权，或者代码和媒体这种复制成本接近零的东西。劳动力杠杆是雇人，资本杠杆是用钱放大，代码和媒体不需要谁批准。',
            example: '你把咨询从一小时 500 收到一小时 800，上限仍是你醒着的时间。把同一套判断写成一篇还能被转发的文章，或收成别人睡着时也能买的东西，小时才开始脱离你本人。',
          },
          {
            id: 'fomo',
            label: '看见别人都在买',
            kicker: '第三问是人性，不是算术',
            title: '先认出这股劲是从哪来的',
            body: '他举了三件常见的事：花钱是为了被看见或缓一下；不敢投是怕亏的那一下太疼；总觉得不够，是对以后没有把握，钱成了这股情绪的出口。认出来，是为了下一步做得醒，不是为了骂自己。',
            example: '朋友群里都在转一笔「再不上车就晚了」。你打开付款页时心跳变快。先停十秒，问这是这笔东西本身，还是怕被落下。怕被落下的那一笔，他归进「不必冒的风险」。',
          },
          {
            id: 'enough',
            label: '想等赚够再学',
            kicker: '不做，和赚够，都不是终点',
            title: '漏出去的那一端，和赚进来一样要紧',
            body: '他引《金钱心理学》：有人把精力全放在把收入做高，另一端几乎不管。少花不必花的，储蓄率就上去了。不为了短期收入，把身体、家里和自己的名字赔进去。赚到某个数字就收工，他不信。挣钱是一直在改、一直在学。',
            example: '这个月多接一单，能多一笔。要连续三个周末，并且用你已经答应读者的那个时间。他会把这一单算进「不做」。数字还没到，学习也不该停。最后一张卡提起《学习之道》，原句在图里被截掉了，我们不补。',
          },
        ],
      });

    default:
      return '';
  }
}

/* ============================================================================
   SHARED LIVE VISUALIZERS FOR CODE-VIDEO COLUMN & MASTER ARTICLES
   ============================================================================ */

const CV_SKINS_META = [
  {
    id: 'linear',
    num: '01',
    name: 'Linear 暗黑精密',
    tag: 'AI 工具 · 硬核架构首选',
    swatches: ['#090A0F', '#F4F4F6', '#5E6AD2', '#FF381C'],
  },
  {
    id: 'apple',
    num: '02',
    name: 'Apple 纯白画廊',
    tag: '产品发布 · 极简旗舰首选',
    swatches: ['#F5F5F7', '#1D1D1F', '#0071E3', '#FF3B30'],
  },
  {
    id: 'vox',
    num: '03',
    name: 'Vox 暖纸社论',
    tag: '商业拆解 · 深度科普首选',
    swatches: ['#F5F1E6', '#111111', '#FFE500', '#FF381C'],
  },
  {
    id: 'industrial',
    num: '04',
    name: 'Teenage 工业机械橙',
    tag: '极客硬件 · 参数测评首选',
    swatches: ['#ECEBE6', '#141414', '#D4D1C7', '#FF5500'],
  },
  {
    id: 'cinema',
    num: '05',
    name: 'Cinema 黑金聚光',
    tag: '人物传记 · 认知金句首选',
    swatches: ['#0B0A09', '#FAF6EE', '#D4AF37', '#E11D48'],
  },
];

const CV_FX_TIERS = {
  1: [
    {
      id: 'clash',
      code: '01',
      tierLabel: '开头抓人',
      title: '左右反色对撞（对比冲突）',
      desc: '适合开场前 3 秒抛出强烈反差问题（如「翻十倍」对撞「归零」），两边撞上的瞬间带轻微震动，一下子抓住视线。',
    },
    {
      id: 'stomp',
      code: '02',
      tierLabel: '开头抓人',
      title: '大字砸下 + 荧光笔划线',
      desc: '说到最关键的一个词时，超大号文字从放大状态干脆落下，底下紧接着刷过一条亮色马克笔，帮观众瞬间记住重点。',
    },
    {
      id: 'rip',
      code: '03',
      tierLabel: '开头抓人',
      title: '划掉常见误区，亮出真结论',
      desc: '先摆出大家平时深信不疑的错误想法，用红线一笔划穿推走，原地弹出你真正想讲的反常识结论。',
    },
    {
      id: 'lock',
      code: '04',
      tierLabel: '开头抓人',
      title: '压暗四周 + 给第 3 点上把锁',
      desc: '把四周压暗聚焦中间，依次弹出三个要点，故意把最重磅的第 3 点锁起来留到最后讲，让观众忍不住看完。',
    },
  ],
  2: [
    {
      id: 'macro',
      code: '05',
      tierLabel: '镜头推拉',
      title: '先放大看细节，再拉远下结论',
      desc: '先把镜头放大 2 倍多怼在聊天记录或代码细节上让观众看清门道，话锋一转迅速拉回全景盖下总结印章。',
    },
    {
      id: 'portal',
      code: '06',
      tierLabel: '自然转场',
      title: '穿过圆孔进入下一章（一镜到底）',
      desc: '换大段落时不用生硬切黑屏：先往后微退蓄力，再直接放大穿过数字「0」或圆环的中心，顺滑进入反色新画面。',
    },
    {
      id: 'whip',
      code: '07',
      tierLabel: '自然转场',
      title: '0.28 秒快速横甩换页',
      desc: '像摄像师猛地转头一样：旧画面带几条速度残影快速往左甩出，新画面顺着惯性从右边滑进来稳稳停住。',
    },
    {
      id: 'dive',
      code: '08',
      tierLabel: '镜头推拉',
      title: '往下深潜穿透表面看底层',
      desc: '讲「表面现象 vs 底层真相」时最好用：镜头从地表漂浮的泡沫一路垂直往下钻，穿过岩层看到地底的核心数据。',
    },
  ],
  3: [
    {
      id: 'motif',
      code: '09',
      tierLabel: '画面巧思',
      title: '同一个图形连续变形串起全片',
      desc: '不用每段换一堆乱七八糟的图标：让同一根红色竖条「1」在各章依次变成钻头、拦截红线、方印，最后变回领头的 1。',
    },
    {
      id: 'laser',
      code: '10',
      tierLabel: '把道理画成图',
      title: '传送带 + 激光线（讲规则与拦截）',
      desc: '讲枯燥的审核标准或安全边界时，画一条滚动的传送带让包裹撞上红色激光线当场停住，比列三行文字直观十倍。',
    },
    {
      id: 'cursor',
      code: '11',
      tierLabel: '真实界面演示',
      title: '仿真鼠标点击 + 数字滚动跳升',
      desc: '把干净的软件按钮搬进画面：鼠标沿弧线滑过去点一下泛起波纹，旁边的核心数字像里程表一样滚动涨上去。',
    },
    {
      id: 'physics',
      code: '12',
      tierLabel: '动画手感',
      title: '起跳前微蹲蓄力 + 文字慢半拍停稳',
      desc: '左边是机器味很重的匀速平移；右边在弹起前先往下微蹲蓄力，停稳时里面的字慢两帧回弹，看着立刻有分量感。',
    },
  ],
};

export function renderLiveDesignSkinsHTML() {
  const tabsHtml = CV_SKINS_META.map(
    (sk, idx) => `
      <button type="button" class="cv-skin-card${idx === 0 ? ' is-active' : ''}" data-cv-skin-select="${sk.id}">
        <div class="cv-sc-top">
          <span class="cv-sc-num">${sk.num}</span>
          <span class="cv-sc-dots">
            ${sk.swatches.map((hex) => `<i style="background:${hex}"></i>`).join('')}
          </span>
        </div>
        <strong class="cv-sc-name">${sk.name}</strong>
        <small class="cv-sc-tag">${sk.tag}</small>
      </button>`
  ).join('');

  return `
    <div class="cv-skin-studio" data-cv-skin-studio>
      <div class="cv-skin-picker" role="tablist" aria-label="切换 5 套视频 DESIGN.md 皮肤母版">
        ${tabsHtml}
      </div>

      <div class="cv-skin-main-grid">
        <div class="cv-skin-stage-wrap">
          <div class="cv-skin-stage-bar">
            <span class="cv-live-pill"><i class="cv-rec-dot"></i> 1920×1080 · 60FPS 实时皮肤预览台</span>
            <span class="cv-stage-hint" data-cv-skin-phase>三拍循环：巨字亮牌 → 拟真数据卡 → 反色转场</span>
          </div>
          <div class="cv-skin-canvas-box">
            <canvas data-cv-skin-canvas height="300"></canvas>
          </div>
        </div>

        <div class="cv-skin-inspector">
          <div class="cv-si-head">
            <span class="cv-si-kicker">COLOR &amp; TYPE SPEC · 视觉规范参数</span>
            <h4 data-cv-skin-title>01 · Linear 暗黑精密风</h4>
            <p data-cv-skin-desc>深曜石底布配极细微网格与高对比冷白巨字，仅在核心数字与印章处点缀≤7%朱砂红或电光靛，彻底告别廉价霓虹发光框。</p>
          </div>

          <div class="cv-ratio-block">
            <div class="cv-ratio-labels">
              <span>75% 底布与留白</span>
              <span>18% 主墨水字</span>
              <span>7% 视觉锤</span>
            </div>
            <div class="cv-ratio-bar" data-cv-ratio-bar>
              <span style="width:75%;background:#090A0F"></span>
              <span style="width:18%;background:#F4F4F6"></span>
              <span style="width:7%;background:#FF381C"></span>
            </div>
          </div>

          <div class="cv-swatch-grid" data-cv-swatches aria-label="点击复制色板 HEX"></div>

          <div class="cv-type-ruler">
            <div class="cv-tr-row"><b class="is-lg">Aa 180px</b><span>满屏概念亮牌 · Weight 900 · 字距 -0.04em</span></div>
            <div class="cv-tr-row"><b class="is-md">Aa 84px</b><span>单焦点短句冲击 · 同屏严格 ≤ 12 汉字</span></div>
            <div class="cv-tr-row"><b class="is-sm">1,024</b><span>拟真界面 32px · 强制 tabular-nums 防抖</span></div>
          </div>

          <div class="cv-si-actions">
            <button type="button" class="solid-pill-btn sm cv-full-btn" data-cv-copy-skin>复制当前皮肤完整 DESIGN.md 给 AI →</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderLiveSkinMiniBarHTML() {
  const pills = CV_SKINS_META.map(
    (sk, idx) =>
      `<button type="button" class="cv-mini-skin-pill${idx === 0 ? ' is-active' : ''}" data-cv-skin-select="${sk.id}"><i style="background:${sk.swatches[0]};border-color:${sk.swatches[3]}"></i><span>${sk.num} · ${sk.name}</span></button>`
  ).join('');
  return `
    <div class="cv-mini-skin-bar" role="group" aria-label="切换全页 12 组视效的 DESIGN.md 配色">
      <span class="cv-msb-label">实时联动色系：</span>
      <div class="cv-msb-pills">${pills}</div>
    </div>
  `;
}

export function renderLiveFxTierHTML(tier = 1) {
  const list = CV_FX_TIERS[tier] || CV_FX_TIERS[1];
  const cardsHtml = list
    .map(
      (fx) => `
      <article class="cv-fx-card" data-cv-fx-card="${fx.id}">
        <div class="cv-fx-top">
          <span class="cv-fx-code"><b>${fx.code}</b> · ${fx.tierLabel}</span>
          <button type="button" class="cv-fx-speed-btn" data-cv-fx-speed="${fx.id}" title="切换 0.3x 慢动作看清蓄力与阻尼细节">1.0x 正常</button>
        </div>
        <div class="cv-fx-stage">
          <canvas data-cv-fx-canvas="${fx.id}" height="184"></canvas>
        </div>
        <div class="cv-fx-body">
          <h4>${fx.title}</h4>
          <p>${fx.desc}</p>
          <div class="cv-fx-foot">
            <button type="button" class="soft-pill-btn sm" data-cv-fx-replay="${fx.id}">重播</button>
            <button type="button" class="ai-copy-btn" data-cv-fx-copy="${fx.id}"><span class="btn-label">复制动画描述给 AI</span></button>
          </div>
        </div>
      </article>`
    )
    .join('');

  return `<div class="cv-fx-grid" data-cv-fx-tier="${tier}">${cardsHtml}</div>`;
}

export function renderLiveSpringsCompareHTML() {
  return `
    <div class="cv-springs-box" data-cv-springs>
      <div class="cv-sp-head">
        <div>
          <span class="cv-si-kicker">DETERMINISTIC SPRING LAB · 四轨物理阻尼实测</span>
          <h4>同屏对比：为什么封杀 <code>linear</code> 匀速，按职责配三档弹簧？</h4>
        </div>
        <div class="cv-sp-btns">
          <button type="button" class="soft-pill-btn sm" data-cv-sp-speed>速度 1.0x</button>
          <button type="button" class="solid-pill-btn sm" data-cv-sp-replay>触发四轨同步弹射 ↻</button>
          <button type="button" class="ai-copy-btn" data-cv-sp-copy><span class="btn-label">复制三档弹簧常量</span></button>
        </div>
      </div>
      <div class="cv-sp-canvas-wrap">
        <canvas data-cv-springs-canvas height="228"></canvas>
      </div>
    </div>
  `;
}

export function renderLiveFlipbookDemoHTML() {
  return `
    <div class="cv-flipbook-box" data-cv-flipbook>
      <div class="cv-fb-top">
        <div class="cv-fb-modes" role="tablist" aria-label="切换网页看板反例与手电筒单焦点">
          <button type="button" class="cv-fb-mode is-active" data-cv-fb-mode="flashlight">✓ 爆款视频：关灯打手电筒（1 秒 1 焦点）</button>
          <button type="button" class="cv-fb-mode" data-cv-fb-mode="bento">✕ AI 默认习惯：开大灯塞满双框（PPT 课件味）</button>
        </div>
        <button type="button" class="soft-pill-btn sm" data-cv-fb-play>暂停</button>
      </div>
      <div class="cv-fb-stage">
        <canvas data-cv-flipbook-canvas height="248"></canvas>
      </div>
      <div class="cv-fb-scrub">
        <label>拖动 <code>prepareFrame(t)</code> 验证纯时间确定性站位：</label>
        <input type="range" min="0" max="4.2" step="0.01" value="0" data-cv-fb-range />
        <code data-cv-fb-time>t = 0.00s (Frame 000)</code>
      </div>
    </div>
  `;
}
