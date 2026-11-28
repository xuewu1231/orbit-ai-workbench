---
slug: anthropic-teams-claude-code
kind: curated
publisher: practice
coverFace: index
coverTitle: 各队|怎么用
category: Anthropic · 官方内部实践
title: Anthropic 内部各团队是如何使用 Claude Code 的
subtitle: 从线上故障排查、陌生代码库导览到跨部门自建自动化工具：法务团队搭起了电话语音树，增长市场团队几分钟生成数百条合规广告变体。
access: free
date: 2025.07.24
readingTime: 约 9 分钟阅读
audioDuration: 8:40
originalAuthor: Anthropic
originalOrg: Anthropic 官方博客
sourceUrl: https://claude.com/resources/articles/how-anthropic-teams-use-claude-code
coverAccent: pine
coverSymbol: layers
pairedSkill: ""
relatedSlugs: claude-code-verification,karpathy-nozelcode-ai-system,pm-ai-full-cycle
summary: Anthropic 官方长文《How Anthropic teams use Claude Code》逐段完整第一人称直译：真实记录基础设施、产品工程、安全工程、产品设计、推理团队、增长营销与法务部门如何在日常工作中把 Claude Code 当作思想伙伴。
studioNoteTitle: 读前导读 · Anthropic 官方原文逐段完整中译 + 三张流程拆解图
studioNoteBody: 本文已将原先的第三人称转述全面替换为 Anthropic 官方文章《How Anthropic teams use Claude Code》的逐段第一人称完整直译（原文无内嵌位图，我们在对应章节保留了三张自绘流程拆解图，直观还原各团队用法与 K8s 排障现场）。想继续看他们写完代码后如何自动验收，可连读下一篇《Claude Code 团队如何思考「验证」》。
cover: /covers/anthropic-teams-claude-code.jpg
tags: Agent,代码
order: 12
---

像 Claude Code 这样的智能体编程（Agentic coding）工具，正在帮助开发者加速工作流程、自动化重复性任务，并攻克复杂的软件工程项目。随着这一领域不断演进，我们每天都在从用户那里发现全新的应用场景——其中也包括我们自己的员工。

为了深入了解更多细节，我们坐下来与 Anthropic 各个部门的员工聊了聊，了解他们在日常工作中究竟是如何使用 Claude Code 的。

虽然他们的许多用法在意料之中——调试排错、梳理陌生代码库、管理研发工作流——但另一些用法却大大出乎我们的意料：**法务团队用它搭建了电话转接树（phone tree）系统；市场营销人员在几秒钟内生成了数百个广告变体；数据科学家在完全不懂 JavaScript 的情况下做出了复杂的可视化应用。**

背后的趋势变得非常清晰：智能体编程不仅仅是在加速传统的软件开发，它正在**消融技术工作与非技术工作之间的边界**——让任何一个能够把问题描述清楚的人，都变成能够亲手造出解决方案的人。

以下是我们调研到的真实用法。

:::diagram-anthropic-six-jobs:::

---

## 一、代码库导览与快速理解（Codebase navigation and understanding）

公司各个团队都在使用 Claude Code，帮助新入职员工乃至资深老员工快速熟悉我们的代码仓库。

我们**基础设施（Infrastructure）团队**新入职的数据科学家，会把整个代码仓库喂给 Claude Code 来迅速进入高效产出状态。Claude 会读取代码库中的 `CLAUDE.md` 文件，识别出与当前任务相关的模块，解释数据流水线之间的依赖关系，并指明哪些上游数据源正在往看板（dashboards）供数——直接替代了传统的数据目录（data catalog）工具。

我们的**产品工程（Product Engineering）团队**则把 Claude Code 称为任何编程任务的「第一站（first stop）」。无论是修 Bug、开发新功能还是做代码分析，他们都会先让 Claude 找出应该重点查看哪些文件，省去了在动手开发新功能前耗费大量时间人工搜集上下文的过程。

---

## 二、测试编写与代码审查（Testing and code review）

智能体编程工具之所以格外受欢迎，很大程度上源于它能自动化两项至关重要却又枯燥繁琐的编程任务：**编写单元测试**与**审查代码**。

**产品设计（Product Design）团队**使用 Claude Code 为新功能编写全面的测试用例。他们还通过 GitHub Actions 实现了 Pull Request 评论的自动化，由 Claude 自动处理代码格式问题与测试用例重构。

**安全工程（Security Engineering）团队**则彻底扭转了他们过去那种「写设计文档 → 拼凑粗糙代码 → 重构 → 最后放弃补测试」的旧工作流：现在他们会先让 Claude 生成伪代码，引导它按**测试驱动开发（TDD）**的方式推进，并定期介入检查。这带来了更可靠、可测试性更强的代码。

:::diagram-test-before-after:::

智能体编程还可以用来把测试翻译成其他编程语言。例如，当**推理（Inference）团队**需要在自己不够熟悉的语言（如 Rust）中测试某项功能时，他们只需用自然语言讲清楚想测什么，Claude 就会直接用代码库原生的语言把测试逻辑写出来。

---

## 三、线上调试与故障排查（Debugging and troubleshooting）

生产环境故障要求争分夺秒地解决，但在高压之下试图推理陌生的代码往往会导致延误。对于公司里的许多团队来说，Claude Code 通过实时分析堆栈跟踪（stack traces）、技术文档和系统行为，大幅加快了诊断与修复速度。

在应急响应期间，**安全工程团队**会把报错堆栈和相关文档喂给 Claude Code，让它顺着代码库追踪控制流。过去通常需要人工翻查 10 到 15 分钟的问题，现在的解决速度**提升了 3 倍**。

借助 Claude Code，**产品工程团队**也有了充足的底气去直接处理陌生代码库里的 Bug。他们会直接问 Claude：「你能修一下这个 Bug 吗？下面是我观察到的现象」，然后直接审查 Claude 给出的修复方案，不再需要事事依赖其他工程团队协助排障。

在一次真实案例中，当 Kubernetes 集群突然停止调度 Pod 时，**数据基础设施（Data Infrastructure）团队**用 Claude Code 进行了故障诊断。他们把监控面板截图喂给 Claude，Claude 一步步引导他们在 Google Cloud 控制台菜单里层层排查，最终精准定位到是 **Pod IP 地址池耗尽（pod IP address exhaustion）**。随后 Claude 直接给出了创建新 IP 地址池并将其挂载回集群的精确命令，在系统中断期间为团队省下了宝贵的 **20 分钟**。

:::diagram-ip-exhaustion:::

---

## 四、快速原型与功能开发（Prototyping and feature development）

传统上，构建新功能需要深厚的技术积累与可观的时间投入。Claude Code 让快速原型设计乃至完整应用开发成为可能，让各团队无论编程功底深浅都能迅速验证想法。

**产品设计团队**的成员会把 Figma 设计稿直接喂给 Claude Code，然后搭起自治循环（autonomous loops）：由 Claude Code 编写新功能代码、运行测试并持续迭代。他们把抽象的问题交给 Claude，让它自主运转，最后在收尾打磨前审查方案即可。在一个案例中，他们甚至在极少人工干预的情况下，让 Claude 自己给自己实现了一套 Vim 快捷键绑定。

在使用 Claude Code 的过程中，**产品设计团队**还发现了一个意想不到的妙用：**在设计阶段就提前梳理错误状态、逻辑分支与系统状态，把边界情况（edge cases）在设计期就揪出来**，而不是等到研发阶段才暴露。这从根本上提升了初版设计的质量，并省下了后续数小时的调试返工。

尽管并不精通 TypeScript，**数据科学家**们依然用 Claude Code 搭建出了完整的 React 应用，用来可视化强化学习（RL）模型的表现。在沙盒环境里通过单次提示（one-shot prompting），工具就能从零写出整套 TypeScript 可视化代码，而数据科学家本人甚至不需要读懂底层前端实现。由于任务目标清晰单纯，如果第一版提示词不够理想，他们只需微调几句再跑一次即可。

---

## 五、文档沉淀与知识管理（Documentation and knowledge management）

技术文档常常零散地分布在内部 Wiki、代码注释以及团队成员各自的脑海里。Claude Code 通过 MCP 与 `CLAUDE.md` 文件将这些碎片知识整合为易于取用的格式，让每个有需要的人都能随时调用专业经验。

没有机器学习背景的**推理团队**成员，依靠 Claude 来解释与模型底层强相关的特定函数。过去通常需要花一小时在 Google 上到处搜索调研的内容，现在只需 **10 到 20 分钟**就能搞定——**调研时间直接缩短了 80%**。

**安全工程团队**则让 Claude 吞入多份来源各异的文档，提炼生成精简的 Markdown 运维手册（runbooks）与排障指南。在排查真实的生产环境故障时，直接把这些浓缩后的文档当作上下文喂给模型，往往比去庞大的知识库里大海捞针高效得多。

---

## 六、业务自动化与工作流提效（Automation and workflow optimization）

智能体编程工具还能帮助业务团队搭建定制化的自动化工具——在过去，这类需求往往必须排队申请专职研发资源，或者采购昂贵的商业软件。

**增长营销（Growth Marketing）团队**搭建了一套智能体工作流：自动读取包含数百条广告数据的 CSV 文件，识别出表现不佳的广告，并在严格的字符长度限制内生成全新的文案变体。借助两个各司其职的子智能体（sub-agents），这套系统能在**几分钟内（而不是过去的好几个小时）生成数百条新广告**。

他们还开发了一款 **Figma 插件**：能够自动识别画板（frames），通过程序化替换标题与描述，批量生成多达 100 组广告视觉变体——把过去数小时的手动复制粘贴压缩到了**每批次仅需 0.5 秒**。

在一个格外独特的案例中，**法务（Legal）团队**用它做出了「电话语音导航树（phone tree）」原型系统，帮助内部同事快速转接匹配到 Anthropic 对应领域的负责律师——生动证明了非技术职能部门同样无需传统研发资源就能自建专属工具。

---

## 用 Claude Code 解锁全新可能（Unlocking new possibilities with Claude Code）

这些内部故事揭示了一个共同规律：**当你聚焦于用它去增强真实的人类工作流时，Claude Code 发挥出的威力最大。** 最成功的团队不会仅仅把 Claude Code 当成一台「代码生成器」，而是把它当成一位**思想伙伴（thought partner）**。

他们大胆探索各种可能性、极速搭建验证原型，并在技术与非技术同事之间共享新发现。这种人类与 AI 协同合作的方式，正在创造出我们才刚刚开始理解的巨大机遇。

---

**原文出处：**
- [Anthropic Official · *How Anthropic teams use Claude Code*（2025.07.24）](https://claude.com/resources/articles/how-anthropic-teams-use-claude-code)
