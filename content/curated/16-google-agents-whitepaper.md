---
slug: google-agents-architecture
kind: curated
publisher: google
coverTitle: Google〈Agents〉架构白皮书
category: Gemini · Google
title: Google 官方《Agents》架构白皮书：模型、工具分类学与编排循环全解
subtitle: 厘清生成式 AI 应用与真正自治 Agent 的本质边界——系统拆解推理核、三大工具形态（Extensions / Functions / Data Stores）与认知编排层。
access: free
date: 2026.11.11
readingTime: 约 15 分钟阅读
audioDuration: 13:10
originalAuthor: Julia Wiesinger、Patrick Marlow 等
originalOrg: Google
sourceUrl: https://www.kaggle.com/whitepaper-agents
coverAccent: blue
coverSymbol: rings
pairedSkill: "workflow-deep-digest"
relatedSlugs: gemini-long-context-playbook,gemini-prompt-design,anthropic-building-effective-agents
summary: Google 官方出品的 Agent 架构百科图谱：清晰界定 Extensions（服务端直连）、Functions（客户端受控执行）与 Data Stores 的选型决策树。
studioNoteTitle: 我们的实战笔记 · 工具到底该在“服务端直调”还是“客户端拦截执行”？
studioNoteBody: 很多团队在做产品架构设计时，分不清什么时候该让 Agent 直接调外部 API，什么时候该只让模型吐出 JSON 由前端或宿主机代为执行。Google 这份白皮书把工具干净地切成了三类，尤其是『Function Calling 客户端代执行模式』——既保留了模型的灵活决策，又把鉴权密钥、人工二次确认和 UI 状态同步牢牢控在应用层手里，是我们设计企业级产品最稳的范式。
---

当所有产品都自称“AI Agent”时，到底什么才是工程意义上真正的 Agent？Google 团队在这份广为流传的架构白皮书中给出了教科书级的组件拆解。

如果把传统大模型比作“知识渊博但被关在房间里的大脑”，那么 **Agent 就是由「Model（大脑）+ Tools（手脚与感官）+ Orchestration Layer（神经中枢循环）」共同组成的行动系统**。

## 一、三大工具形态的清晰选型边界

白皮书最核心的贡献之一，是将五花八门的工具调用归纳为三种互补架构模式：

1. **Extensions（智能体服务端直连扩展）**：通过丰富的示例教模型直接构造并向外部 API 发起实时请求（如查天气、搜航班、调地图），适合低风险、强实时的自动化闭环。
2. **Functions（模型仅输出结构化调用意图，客户端控制执行）**：模型绝不直接触碰外部网络或数据库，只输出函数名与参数 JSON，交由你的客户端/应用后端校验权限甚至弹窗请用户点击“确认”后再执行——**最适合涉及写操作、资金或敏感内网系统的场景**。
3. **Data Stores（非结构化与结构化知识库）**：将 PDF、网页、内部表格通过索引接入，为推理提供有据可查的实时事实支撑。

## 二、编排层（Orchestration Layer）的三种推理范式

神经中枢如何决定下一步该想什么、调哪个工具？根据任务确定性不同可灵活组合：

- **ReAct（Reasoning + Acting 交替循环）**：每观察一次真实工具返回，动态修正下一步计划，最适合开放式探索与排障。
- **Chain-of-Thought（长思维链分解）**：适合逻辑严密的数学、代码架构推演与多条件权衡。
- **Tree-of-Thoughts（多分支探索回溯）**：针对高难度战略规划或创意生成，并行展开多条候选路径择优推进。
