---
slug: ai-agent-book-3
kind: seen
title: 开源书《深入理解 AI Agent》发布 3.0：围绕「Agent = LLM + 上下文 + 工具」重写十章
subtitle: 李博杰（@bojie_li）开源著作 3.0 更新说明与全书十章完整导览原稿：去掉综述式 AI 味改成教学式讲解，聚焦模型之外的 Harness 工程。
access: free
date: 2026.11.22
readingTime: 约 8 分钟
originalAuthor: 李博杰（Bojie Li）
originalOrg: X · @bojie_li
sourceUrl: https://x.com/bojie_li/status/2124530971710308709
cover: /covers/ai-agent-book-3.jpg
tags: Agent,代码
order: 3
summary: 完整收录李博杰 3.0 发布原帖、引用原帖中的十章完整大纲与书中「开发范式演进 & Agent 架构」原图：Agent = LLM + 上下文 + 工具，模型之外的一切 Harness 工程才是真正的竞争力所在。
studioNoteTitle: 读前导读 · 原帖与引用帖完整照录 + 书中核心架构原图
studioNoteBody: 本文已恢复为李博杰（@bojie_li）3.0 发布推文与所引开源长帖的一字不改原稿，并嵌入原帖所附的书中核心架构配图（图 0-1 大模型开发范式演进与图 0-2 AI Agent 组成结构，点击可放大细看）。文末保留了我们的十章阅读顺序导览。
relatedSlugs: anthropic-teams-claude-code,karpathy-nozelcode-ai-system
---

## 3.0 版本发布说明（原帖全文）

两个月没有更新了，《深入理解 AI Agent》发布 3.0 版本了！

- 重写了各章节的大部分内容，消除了一些 AI 味，把综述式的文风改成了教学式的，更容易理解
- 新增 Jev 类决策模型在事件过滤、工具安全判断、评测 rubric、RAG 筛选、多模态信息稀疏化等方面的应用
- 新增 Meta Muse、Pine、dsh superagent 等 personal agent 的办事逻辑
- 新增 Multica、LobeHub 等办公 agent
- 新增 Anthropic 证明黎曼猜想、OpenAI 证明千禧年问题等科研 agent
- 修订语音交互部分，纳入一些最新的工作
- 重绘书中大量插图
- 新增社区翻译的蒙古语版本
- 合入社区的 30+ PR，解决 20+ issues

---

## 全书核心公式与十章完整大纲（引用原帖全文）

去年 8–10 月在图灵讲的《AI Agent 实战营》课程，终于整理成书啦，在 GitHub 开源发布了。《深入理解 AI Agent：设计原理与工程实践》欢迎大家下载传播 PDF，欢迎大家提意见、提 issue！

开源仓库：[https://github.com/bojieli/ai-agent-book](https://github.com/bojieli/ai-agent-book)

![书中核心配图：图 0-1 大模型时代的开发范式演进 与 图 0-2 AI Agent 组成架构](/figures/ai-agent-book-3/img_01.jpg)

:::diagram-agent-harness-formula:::

全书围绕核心公式 **`Agent = LLM + 上下文 + 工具`** 展开，十章内容如下：

- **第 1 章 · Agent 基础知识**：从“模型即 Agent”的新范式出发，建立 `Agent = LLM + 上下文 + 工具` 的核心公式，并引入 **Harness 工程**——模型之外的一切工程能力，才是真正的竞争力所在。
- **第 2 章 · 上下文工程**：上下文决定 Agent 的能力上限。深入大模型 API 的上下文结构、KV Cache 友好设计、提示工程、动态提示词与 Agent Skills、状态栏元信息，以及上下文压缩策略。
- **第 3 章 · 用户记忆和知识库**：让 Agent 跨会话记住用户、并接入外部知识。涵盖用户记忆系统、RAG 基础管道，以及超越扁平文本的知识组织与检索（结构化索引、知识图谱等）。
- **第 4 章 · 工具**：工具是 Agent 的双手。讲工具分类与通用设计原则、MCP 协议与工具选择的挑战、感知/执行/协作三类工具，以及事件驱动的异步 Agent。
- **第 5 章 · Coding Agent 与代码生成**：代码是“能创造新工具的工具”，是通用 Agent 的元能力。以生产级 Coding Agent 为例，展示这一最强通用工具的完整实现。
- **第 6 章 · Agent 的评估**：把 Agent 的表现变成可比较的信号。从评估环境、数据集设计、指标体系，到统计显著性、可观测性、评估驱动选型，直至生产级内部评估与仿真环境。
- **第 7 章 · 模型后训练**：预训练、SFT、RL 三阶段全景。何时选 SFT、何时选 RL，RLHF、算法比较、数据与环境，以及让模型学会工具调用、提升样本效率的前沿探索。
- **第 8 章 · Agent 的自我进化**：不改权重也能成长。三种学习范式，从经验中学习、主动工具发现，到“从工具使用者到工具创造者”，让 Agent 从“聪明”走向“熟练”。
- **第 9 章 · 多模态与实时交互**：把感知与行动从文本扩展到语音、GUI 与物理世界。语音三范式（级联/端到端全模态/全双工）、流式语音感知与合成、Computer Use 与机器人操作。
- **第 10 章 · 多 Agent 协作**：群体的智能可以高于个体。多 Agent 分类框架、何时真正优于单 Agent、共享与不共享上下文的协作、失败模式，以及涌现的“Agent 社会”。

---

:::guide 助读导览 · 十章排布顺序本身就是一份极好的工程路线图
仔细看李博杰排定的章节先后顺序：**先立公式与 Harness（第 1 章）→ 再把单窗口上下文与 KV Cache 做干净（第 2 章）→ 接上跨会话记忆与结构化知识（第 3 章）→ 配齐工具与 Coding 元能力（第 4–5 章）→ 立住评估标尺（第 6 章）→ 最后才去碰后训练、自进化与多智能体（第 7–10 章）。** 很多团队一上来就急着搭第 10 章的「多 Agent 群聊」，却连第 2 章的上下文与第 6 章的评估都没做，回看这份目录能少走很多弯路。
:::

**出处与仓库：**
- 原帖链接：[X · Bojie Li（@bojie_li）](https://x.com/bojie_li/status/2124530971710308709)
- GitHub 开源全书：[github.com/bojieli/ai-agent-book](https://github.com/bojieli/ai-agent-book)
