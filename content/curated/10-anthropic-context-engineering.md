---
slug: anthropic-context-engineering
kind: curated
category: Anthropic · Agent
title: Anthropic 的上下文工程：注意力是有预算的
subtitle: 提示词写得漂亮只是开始。Agent 每转一圈都会产生新信息，上下文工程要决定下一圈到底把哪些 token 留下来。
access: free
date: 2026.11.18
readingTime: 约 10 分钟阅读
audioDuration: 08:50
originalAuthor: Anthropic 工程团队
originalOrg: Anthropic
sourceUrl: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
coverAccent: pine
coverSymbol: compass
pairedSkill: ""
relatedSlugs: anthropic-building-effective-agents,long-running-context-engineering,openai-harness-engineering
summary: 精编自 Anthropic《Effective context engineering for AI agents》。上下文会腐烂，工具集一臃肿模型就会选错，及时检索往往比事先把所有资料塞进窗口更稳。
studioNoteTitle: 我们的实战笔记 · 「刚好的高度」是我们改系统提示的标准
studioNoteBody: 我们的系统提示曾经两头都踩过：一头写成连分支都写死的伪代码，一头只剩「请仔细完成任务」。这篇把中间地带说清楚了，用章节而不是一大段。另一条我们正在用的是及时检索：仓库里只放路径和短索引，让代理自己打开文件，而不是每次对话附上整份手册。
---

Anthropic 对这两个词的区分是：提示工程关心指令怎么写，尤其是系统提示；上下文工程关心一次推理时，窗口里全部 token 的取舍，包括工具定义、MCP、外部数据和历史消息。Agent 每转一圈都会制造更多可能有用的信息，所以取舍是循环发生的，不是开写之前做完的一次性工作。

## 上下文会腐烂

模型上下文变长之后，并不是均匀地变笨，而是更难从里面准确捞回信息。这和 Transformer 的注意力有关：token 两两相关，序列一长，注意力被摊薄；训练时见过的长序列也更少。所以上下文是一份边际收益递减的预算。目标不是装满，而是留下最小的一组高信号 token。

## 系统提示、工具、例子，各有一种常见的坏法

**系统提示**要落在两个极端之间。一头是把行为写成脆弱的 if-else，以后没法维护。另一头是空话，假装模型和你共享背景。合适的高度是：足够具体，又给模型留下可执行的判断。用 Markdown 标题或 XML 式标签把背景、工具用法、输出格式分开。从最短的能用版本测起，再按失败案例补句子，而不是一开始写全。

**工具**是代理和外界的合同。功能重叠、一个人也说不清该用哪一个的工具集，模型同样选错。返回值要省 token，参数名要像写给初级工程师的文档。

**例子**仍然有用，但不是把所有边界条件都塞进提示。挑少数几个典型例子，格式保持一致。例子够清楚时，有些指令句甚至可以删掉。

## 事先检索，还是让它自己去找

很多应用在推理前用嵌入检索把资料塞进提示。Anthropic 看到另一条路在变常见：代理只握着轻量的指针（路径、查询、链接），需要时再用工具把正文读进来。Claude Code 就是这样处理大结果的：自己写查询，再用 `head` 和 `tail` 看局部，而不是把整份数据放进窗口。目录名、文件名和时间戳本身就是信号。

代价是更慢，也更依赖工具和规矩设计得好。折中做法是混合：少量稳定的说明（例如 `CLAUDE.md`）每次都放进去，其余靠搜索按需打开。内容不常变的法律、财务材料，更适合多放一点预检索；代码仓库更适合让模型自己导航。他们的总建议没有变：先做能工作的最简单版本。
