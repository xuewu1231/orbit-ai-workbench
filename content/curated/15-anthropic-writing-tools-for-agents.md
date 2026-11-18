---
slug: writing-tools-for-agents
kind: curated
publisher: anthropic
coverFace: band
coverTitle: 工具|要好用
category: Anthropic · 工具与 MCP 设计
title: 如何为 AI Agent 编写好用的工具：别把传统后端 API 直接丢给大模型
subtitle: 传统 API 是给确定性代码调用的，而 Agent 工具是给非确定性推理模型看的——详解工具合并、命名空间、高密度返回与评测驱动调优。
access: pro
date: 2026.11.14
readingTime: 约 15 分钟阅读
audioDuration: 12:50
originalAuthor: Anthropic 工程团队
originalOrg: Anthropic
sourceUrl: https://www.anthropic.com/engineering/writing-tools-for-agents
coverAccent: slate
coverSymbol: layers
pairedSkill: "skill-verify-gate"
relatedSlugs: less-tools-better-agents,anthropic-context-engineering,anthropic-building-effective-agents
summary: 为什么直接把公司内部 50 个 REST 接口包装成 MCP 工具必败无疑？Anthropic 团队手把手教你设计高命中率、省 Token 的 Agent 专属工具契约。
studioNoteTitle: 我们的实战笔记 · 做 Orbit MCP 前必看的避坑说明书
studioNoteBody: 很多人在写 MCP Server 时，偷懒直接把后端的 CRUD 小接口一对一映射成工具（比如先调 get_user_id、再调 list_projects、再调 get_project_detail）。对传统程序来说这很正常，但对 Agent 来说这意味着三次慢速往返和三倍出错概率！按这篇的原则，我们规划 Orbit MCP 时只留两个高内聚工具：search_vault 和 get_prompt，一次调用直接拿回完整可用上下文。
---

当团队准备让 Agent 接入内部业务系统或编写自定义 MCP Server 时，最常见的败笔就是**直接拿现有的 REST API 自动生成工具列表**。

Anthropic 指出：人类程序员写代码调底层小接口没问题，但 Agent 每次调工具都要付出高昂的上下文与推理代价，工具设计必须转向**以 Agent 认知为中心（Agent- Ergonomic Design）**。

## 一、合并细碎动作，围绕“完整意图”设计工具

不要逼着 Agent 连续调五次底层原子接口才能凑齐信息：

- **反例**：分别暴露 `list_users`、`list_events`、`create_event` 三个碎接口，每次返回几百条无用 ID。
- **正例**：直接提供贴合任务意图的 `schedule_event` 或带上下文聚合的 `search_customer_context`，内部在代码层一次性查齐关联信息，干净利落地返回给模型。

<!-- PRO_CUT -->

## 二、用清晰的命名空间与可操作报错引导模型自愈

1. **前缀命名空间（Namespacing）**：当同时挂载多个系统工具时，用统一前缀（如 `github_search_issues` vs `linear_search_issues`）消除歧义。
2. **返回人类可读的语义化标识**：尽量减少毫无意义的纯 UUID 参数传递，优先支持可读的路径或唯一短别名，能显著降低模型抄错参数的概率。
3. **报错信息要写清“怎么改才对”**：不要只抛出一行冰冷的 `400 Bad Request`，而是在错误返回里直接提示：“参数 `limit` 超出上限 50，请改传 1–50 之间的整数或使用 `cursor` 分页”——模型看到后下一轮就能自动改对。

## 三、让 Coding Agent 帮你自动评测并改写工具说明书

工具的描述文案与参数注释本质上就是系统提示词的一部分：

- 准备 20–30 个贴近真实业务的复杂复合任务集；
- 跑完后把失败或绕远路的调用轨迹喂给 Claude Code，让它分析“模型为什么误解了这个参数”，直接迭代优化工具 Schema 描述，往往能带来显著的准确率提升。
