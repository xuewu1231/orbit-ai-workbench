---
slug: gemini-prompt-design
kind: curated
publisher: google
coverFace: low
coverTitle: 提示|怎么摆
category: Gemini · Google
title: Gemini 提示设计：指令、例子和约束怎么摆
subtitle: Google AI Studio 的提示指南不靠一套神秘模板。它把输入分成问题、任务、对象和补全，并说明新一代 Gemini 已经不再吃你手调的 temperature。
access: free
date: 2026.11.18
readingTime: 约 9 分钟阅读
audioDuration: 08:00
originalAuthor: Google AI Studio 文档
originalOrg: Google
sourceUrl: https://aistudio.google.com/docs/prompting-strategies
coverAccent: blue
coverSymbol: compass
pairedSkill: ""
relatedSlugs: gemini-workspace-notebook,openai-image-prompting,karpathy-deep-dive-llms
summary: 精编自 Gemini API《Prompt design strategies》。把任务写具体，用格式一致的 few-shot，把关键约束放在系统指令开头。Gemini 4 与 3.6 及以后会忽略自定义的 temperature、topP、topK。
studioNoteTitle: 我们的实战笔记 · 调参习惯要按模型代际分开
studioNoteBody: 我们有一批旧请求还在传 temperature。文档写明 Gemini 4 和 Gemini 3.6 及以上会忽略这些值，并在响应头里给弃用警告，以后会直接 400。所以 Gemini 这边我们把力气移回提示结构：分隔符、系统指令里的角色和输出格式、以及例子的格式必须彼此一样。随机性不再是我们能拧的旋钮。
---

Google 把提示设计定义成：写出能让模型给出准确、高质量回答的自然语言请求。文档强调这些做法是起点，要按你的失败案例改，而不是背完就能用。

## 四种输入，不要混着写

- **问题**：模型来回答，例如起五个店名，只要名字。
- **任务**：模型来完成，例如列出露营必带的五样东西。
- **对象**：模型对给出的条目做分类或变换。
- **补全**：你写好开头或给一个例子加响应前缀，让模型顺着填完。菜单抽取这类任务，与其用长指令解释「不要输出没点的菜」，不如给一个例子和半截 JSON，让它补全。

约束单独写：摘要不超过多少句、不要做哪些事。输出格式也单独写：表格、要点、一段电梯演讲。系统指令适合放稳定的说话方式，例如「回答保持对话感」。

## 例子通常比再加一条规矩有用

零样本是不给例子。少样本是给几个做对了的例子，让模型自己看出格式、措辞和范围。文档建议默认就带例子；例子如果已经把任务演示清楚，有的指令句可以删。

例子之间的结构必须一样，包括标签、空行和分隔方式。格式一乱，模型会把「格式不统一」也学进去。该给的背景写进提示，不要假设模型知道你的菜单、你的字段含义或你今天的日期。

## 采样参数正在退出

`temperature`、`topP`、`topK` 仍然解释着旧模型怎么抽样：温度越低越稳定，topK 和 topP 限制候选 token。文档写明，Gemini 4 和 Gemini 3.6 及以上会忽略你传入的这三个值，并返回弃用警告，后续版本会改成 400 错误。更早的 Gemini 3 则建议保持默认，手调会伤害推理表现。新请求里应删掉这些字段。

## Gemini 3 更吃结构

这一代适合直接、结构清楚的提示：

- 用一种分隔方式把上下文和任务分开，XML 式标签或 Markdown 标题都可以，一篇提示里别混用。
- 角色、行为约束、输出格式放在系统指令里，或放在用户提示的最前面。
- 需要它注意「今天是哪一天」、注意自己的知识截止、或必须依据你给的材料作答时，把这些句子写进系统指令，而不是藏在长文中间。

AI Studio 的 Run settings 里还可以开结构化输出、函数调用、代码执行和 grounding。提示结构稳定之后，再开这些工具，比先调一堆采样参数更有效。
