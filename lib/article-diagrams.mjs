/* ============================================================================
   EDITORIAL ARCHITECTURAL DIAGRAMS FOR CURATED MONOGRAPHS
   Responsive, dark-mode-native SVG figures invoked via :::diagram-xxx:::
   ============================================================================ */

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

    default:
      return '';
  }
}
