---
slug: openai-codex-agent-loop
kind: curated
publisher: openai
coverFace: index
coverTitle: 一轮|之内
category: OpenAI · Codex
title: 拆开 Codex 的 Agent 循环：一次对话里实际发生了什么
subtitle: Codex 的核心不是一个更长的提示词，而是一轮一轮的循环：组提示、调用模型、执行工具、把结果追加回去，直到模型交出给用户的那句话。
access: free
date: 2026.11.18
readingTime: 约 9 分钟阅读
audioDuration: 08:20
originalAuthor: Michael Bolin
originalOrg: OpenAI
sourceUrl: https://openai.com/index/unrolling-the-codex-agent-loop/
coverAccent: blue
coverSymbol: minimal
pairedSkill: ""
relatedSlugs: openai-harness-engineering,anthropic-building-effective-agents
summary: 精编自 OpenAI《Unrolling the Codex agent loop》。一次用户消息可以触发很多次推理和工具调用；上下文窗口同时吃进输入和输出，所以循环本身要管长度。
studioNoteTitle: 我们的实战笔记 · 读这篇是为了不再把「回合」和「工具调用」混为一谈
studioNoteBody: 排障时最常见的误会是：用户只发了一句，就以为模型只跑了一次。Codex 这篇把回合（turn）和回合内部的工具循环分开了。我们看代理日志时现在先数工具调用，再看最后那句给用户的话。另外它写明指令、工具、输入是三条不同的通道，这影响我们怎么写 MCP 工具的描述。
---

Codex CLI 是跑在你机器上的软件代理。OpenAI 用「Codex」指一整套产品（命令行、云端、编辑器插件），这篇讲的是底下共用的 harness：用户、模型和工具之间的那圈循环。实现是开源的，仓库在 [github.com/openai/codex](https://github.com/openai/codex)。

## 一轮循环里只有两种出口

用户的话先被收进提示。模型做一次推理，输出要么是给用户的最终回复，要么是一次工具调用，例如「跑这条命令，把输出告诉我」。

如果是工具调用，harness 在本地执行，把输出追加回上下文，再问模型一次。如此重复，直到模型不再要工具，而是写出给用户的 assistant 消息。对软件代理来说，真正的产物经常是磁盘上改过的代码；但每一回合仍以一句话结束，例如「我加上了你要的 architecture.md」。这句话是循环的终止信号，控制权回到用户。

用户接下来再发一句，才是下一回合。新回合的提示会带上之前的消息和工具调用。对话越长，每次推理的提示越长。

## 上下文窗口是输入加输出

每个模型有一个上下文窗口，一次推理能用的 token 上限，输入和输出都算在里面。一个回合里如果工具调用上百次，窗口会被撑满。所以「把历史裁短、把该记的记到仓库里」是 harness 的职责，不是用户每次手动做的事。

## 提示不是你打的那一句

Codex 通过 Responses API 做推理。端点可以换：ChatGPT 登录、API key、本地开源模型，或兼容该 API 的云。真正送给模型的是一份有角色的条目列表，优先级从高到低大致是 `system`、`developer`、`user`、`assistant`。

请求里和循环最相关的三段是：

- **instructions**：系统或开发者说明。Codex 可以从配置文件读，否则用该模型自带的基础说明。
- **tools**：模型可以调用的工具，包括 CLI 自带的 shell、更新计划的 `update_plan`、由 API 提供的网页搜索，以及用户接上的 MCP。
- **input**：这一次的文本、图片或文件。

工具描述本身就是提示的一部分。名字含糊、参数重叠，模型就会在循环里选错命令。OpenAI 把这条循环公开出来，是为了让人改自己的 harness 时知道：慢、贵、跑飞，常常发生在工具结果被原样堆回窗口的那些圈里，而不是发生在用户看见的最后一句话上。
