---
slug: long-running-context-engineering
kind: curated
publisher: anthropic
category: Agent 与工程架构
title: 长周期运行 Agent 的上下文工程与自检护栏设计
coverTitle: 长任务的交接账本
subtitle: 当一个复杂功能需要 Agent 连续推进数小时、跨越多个上下文窗口时，如何设计进度交接账本与防跑偏护栏？
access: free
date: 2026.11.03
readingTime: 约 13 分钟阅读
audioDuration: 11:45
originalAuthor: 前沿 Agent 实验室工程总结
originalOrg: Anthropic / Manus 工程实践精要
sourceUrl: https://www.anthropic.com/engineering
coverAccent: pine
coverSymbol: layers
pairedSkill: "@folio/skill-verify-gate"
relatedSlugs: anthropic-long-running-harness,anthropic-context-engineering,less-tools-better-agents
summary: 梳理长链路自治 Agent 最核心的三个工程支柱：结构化交接文件、不可篡改的验收清单，以及沙箱环境快速重置能力。
studioNoteTitle: 我们的实战笔记 · 我们怎么用「交接单」跑长任务？
studioNoteBody: 很多人在让 AI 写大项目时喜欢在一个超长对话框里死磕到底，聊到后面模型开始遗忘最初约束甚至胡乱删改。这篇工程总结点破了窗户纸：要把每一次上下文窗口当成“一班岗的工程师”，换班靠的不是把十万字聊天记录硬塞给下一任，而是留下一张干净的『进度账本 + 实测快照』。我们据此封装了内部的交接模板，复杂重构稳定性大幅提升。
---

在五分钟能搞定的单文件小需求上，几乎任何主流编程助手都能表现得像个天才；但一旦进入**跨几十个文件、持续数小时的真实工程战役**，缺乏上下文工程设计的 Agent 往往会迅速退化。

常见的典型症状只有两种：**要么“一步迈太大”，试图一口气改完所有模块导致编译雪崩；要么“过早宣布胜利”，只跑通了表面分支就匆忙交差。**

## 破局核心：模拟成熟工程团队的「换班交接协议」

人类软件工程是如何解决跨天、跨人协作的？靠的不是让接班同事把前任一整天的自言自语听一遍，而是靠 **Git 提交记录 + 清晰的验收测试表 + 交接备忘录**。

长周期 Agent 架构同样需要立起这三根柱子：

1. **初始化引导员与增量执行员分离**：第一棒专门负责摸清环境、启动脚本，并拆解出一份结构化的功能验收清单（默认全部标记为未通过）；后续每一棒只允许认领其中 1 个原子目标，跑通验证并提交干净快照后立刻交棒。
2. **外部化状态账本（Progress Ledger）**：把“已验证事实、当前阻塞原因、下一步唯一焦点”写入工作区固定文件，每次新开干净上下文时只需读取这份两百行不到的账本即可满血接续。
3. **只认真实运行证据，不信口头承诺**：禁止 Agent 在未实际跑通构建与端到端校验脚本前修改验收状态位。

## 团队即刻可用的落地清单

- **单次会话超过 40% 窗口占用且切换子模块时**：主动让当前 Agent 将关键决策、涉及文件路径与待办事项写入 `HANDOFF.md`，然后开启全新会话载入该文件继续推进。
- **把启动与自检浓缩为单行脚本**：在项目根目录准备一个幂等的 `./scripts/verify.sh`，让每一棒 Agent 上岗第一秒就能确认基线是否健康。
