---
slug: x-builders-agentic-workflow
kind: curated
publisher: creators
coverFace: band
coverTitle: 先写|规格
category: X · 独立开发者编程工作流
title: 从 Vibe Coding 到严谨交付：一线工程师高产不翻车的 AI 研发工作流
subtitle: 代码生成的成本跌到了地板，但“验证与兜底”的成本从未下降——综合 Addy Osmani 与 X 头部构建者验证有效的规格先行与防认知投降法则。
access: free
date: 2026.11.05
readingTime: 约 14 分钟阅读
audioDuration: 12:10
originalAuthor: Addy Osmani
originalOrg: Addy Osmani · X / Blog
sourceUrl: https://addyosmani.com/blog/ai-coding-workflow/
coverAccent: pine
coverSymbol: minimal
pairedSkill: "skill-verify-gate"
relatedSlugs: dan-koe-ai-business-2027,simon-willison-llm-workflows,openai-harness-engineering
summary: 为什么同样用 AI 写项目，有人三天搭出可维护精品，有人三天堆出一座改不动的屎山？提炼“规格先行、小步提交、严防认知投降”六条实战铁律。
studioNoteTitle: 我们的实战笔记 · 警惕“认知投降（Cognitive Surrender）”这句话太清醒了
studioNoteBody: 在 X（Twitter）开发者社区里，越来越多资深架构师都在强调同一个教训：随口说一句模糊想法就让 AI 狂吐两千行自己根本没看懂的代码，前两天爽感拉满，第三天改需求时寸步难行。Addy Osmani 总结的『先跟 AI 对齐一页纸 Spec → 拆成 15 分钟可验证的小切片 → 每跑通一块立刻 Git Commit 存档』，是我们目前在所有新产品原型开发上坚持的标准节奏。
---

当“凭感觉聊天写代码（Vibe Coding）”风靡技术圈一年后，一线高产工程师与独立开发者们逐渐分化出了截然不同的两种结局：做一次性小玩具时随性发挥毫无问题，但**做需要长期迭代的正式产品时，纪律严明的规格驱动工作流（Spec-Driven Agentic Engineering）才是真正的十倍杠杆。**

## 一、开工前花 15 分钟写透 `SPEC.md`，省掉后面三天返工

绝不在脑子一团浆糊时直接对 Agent 喊“帮我做个某某网站”：

1. **先用对话模式做“技术访谈”**：让模型扮演挑剔的技术负责人，连续向你发问厘清数据模型、边界状态、错误处理与明确不做的范围，最终落盘成一份干净的 `SPEC.md`。
2. **把大蓝图切成原子里程碑**：每个步骤都必须小到能在几分钟内独立运行测试看清对错。

## 二、小步 Git 存档点（Checkpoints）与双模型交叉互审

- **绿灯即存档**：每当 Agent 完成一个小功能并通过测试，立刻做一次干净的 Git Commit。一旦下一轮尝试把布局或状态机改乱，一秒钟就能无痛回滚到上一个健康存档点，绝不在错误泥潭里反复打补丁。
- **换一双眼睛挑刺**：用主力模型写完复杂模块后，另开一个干净窗口（或调用另一个擅长挑错的模型）只喂入 `git diff`，专门检查安全漏洞、边界空指针与死代码。

## 三、底线原则：严防“认知投降（Cognitive Surrender）”

AI 可以替你敲下 95% 的样板与实现代码，但**人类必须牢牢掌握核心数据流向、模块边界契约与业务不变量**。凡是合入主干却连自己都讲不清“它为什么能跑通”的黑盒代码，迟早会在关键时刻变成昂贵的技术债。
