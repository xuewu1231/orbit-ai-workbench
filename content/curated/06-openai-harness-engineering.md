---
slug: openai-harness-engineering
kind: curated
publisher: openai
category: OpenAI · Codex
title: Harness Engineering：人负责环境，Codex 负责写代码
subtitle: OpenAI 用一个内部产品做了五个月实验：人不直接写代码。工程师的工作变成设计仓库、反馈回路，以及代理能读懂的知识地图。
access: free
date: 2026.11.18
readingTime: 约 10 分钟阅读
audioDuration: 09:00
originalAuthor: Ryan Lopopolo
originalOrg: OpenAI
sourceUrl: https://openai.com/index/harness-engineering/
coverAccent: vermilion
coverSymbol: layers
pairedSkill: ""
relatedSlugs: openai-codex-agent-loop,anthropic-long-running-harness,less-tools-better-agents
summary: 精编自 OpenAI《Harness engineering》。一个约百万行、由 Codex 写出的内部产品，说明人的稀缺资源是注意力：把应用、日志和文档变成代理能自己核对的环境。
studioNoteTitle: 我们的实战笔记 · 我们从这篇里拿走的三条
studioNoteBody: 这篇和「少写专用工具」是同一类教训的另一面。工具可以少，但环境必须清楚。我们把仓库说明从一份越写越长的总纲，改成短地图加 docs 目录之后，代理少了很多照着过期规矩行事的情况。另外他们让每个 git worktree 都能自己把应用和日志拉起来，这点和我们做悬停预览、本地验收是同一逻辑：不能只听代理说改好了。
---

2026 年 2 月，OpenAI 的 Ryan Lopopolo 写了这次实验：从一个空仓库开始，应用逻辑、测试、CI、文档、可观测性和内部工具都由 Codex 写。人负责把目标说清楚，并在失败时补上代理缺的那项能力。他们估计，这条路大约用了手写同等产品十分之一的时间。

五个月里，仓库到了大约一百万行。三名工程师驱动 Codex，后来团队到七人，吞吐没有掉下去，人均大约每天 3.5 个合并的 pull request，累计大约 1500 个。产品有内部日活用户。数字本身不是重点，重点是这些改动不是人敲进去的。

## 工程师的新工作

一开始慢，不是因为模型不会写，而是环境没说清。代理缺少能往前走的工具、抽象和仓库结构。人的做法变成：把大目标拆成设计、实现、审查、测试这些小块，让 Codex 先把小块造出来，再用它们解锁更难的任务。失败时不问「再试一次」，而问缺了哪项能力，以及怎样让这项能力既看得懂、又强制生效。

人几乎只通过提示词进入系统：描述任务，让代理开 pull request，再要求它在本地自审、请其他代理审、按反馈改，直到审查通过。人可以看 PR，但不是必经步骤。单次运行有时会在一个任务上持续工作到六小时。

## 让应用自己能被代理看见

人做验收的时间很快变成瓶颈。他们的办法是把界面、日志和指标直接交给 Codex：

- 每个 git worktree 可以单独把应用拉起来，一次改动一个实例。
- 接上 Chrome DevTools，让代理能看 DOM、截图、自己点页面，复现 bug 再验证修复。
- 日志、指标、追踪做成随 worktree 起落的本地栈。代理用查询语言看日志和指标，像「启动要在 800 毫秒内」「这四条关键路径没有超过两秒的 span」这种要求才做得了。

## 知识库是目录，不是一本厚说明书

他们试过一份巨大的 `AGENTS.md`，失败得很整齐：上下文被说明书占满；所有规则都「重要」就等于没有重点；文件马上过期；也无法做新鲜度和归属检查。

后来的结构是：大约 100 行的 `AGENTS.md` 只当目录，真正的记录放在结构化的 `docs/` 里。设计文档、执行计划、生成出来的库表结构、产品规格和参考资料分开存放。代理需要细节时再打开对应文件，而不是每次把整本手册塞进上下文。

## 落到我们自己的仓库

1. 仓库根上的说明保持短，只回答「去哪读」。长规矩放进可以单独打开的文档。
2. 每条代理任务都要有它自己能跑的验收，而不是等人眼看截图。
3. 进度和设计决策写进仓库，不写在某一次聊天记录里。
