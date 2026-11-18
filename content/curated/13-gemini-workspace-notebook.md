---
slug: gemini-workspace-notebook
kind: curated
category: Gemini · Google
title: 谷歌的上班用法：四段提示，加上只读你文件的 Notebook
subtitle: Workspace 团队把 Gemini 的日常提示收成角色、任务、上下文、格式。Notebook 则规定模型只能根据你上传的材料回答，适合把一叠散文件变成团队能问的资料。
access: free
date: 2026.11.18
readingTime: 约 8 分钟阅读
audioDuration: 07:10
originalAuthor: Google Workspace 团队
originalOrg: Google
sourceUrl: https://workspace.google.com/resources/ai/writing-effective-prompts/
coverAccent: slate
coverSymbol: minimal
pairedSkill: ""
relatedSlugs: gemini-prompt-design,karpathy-how-i-use-llms
summary: 精编自 Google 的 Gemini 提示指南，以及 Workspace 博客里关于 Notebook 的用法。日常写作用四段式提示；研究一叠内部文档时，把源文件放进 Gemini Notebook，而不是指望通用对话记得它们。
studioNoteTitle: 我们的实战笔记 · 对外问答和内部资料要分两个入口
studioNoteBody: Karpathy 在用法视频里也单独演示了 NotebookLM：它适合「吃透这一叠」，不适合开放世界。Google 自己的指南把这件事说得更硬：Notebook 只使用你上传的来源。我们现在把行业事实类问题留在普通 Gemini 或带来源的搜索里，把会议纪要、方案和访谈放进 Notebook。提示词则固定四段，避免同事各写各的。
---

Gemini 做在 Gmail、文档、表格里，提示仍然是一段对话的开头，往往要来回改几次才像你要的。Google 给非研究人员的框架就四段：

- **Persona**：它以什么身份说话。例如业务分析师。
- **Task**：具体要它做什么。例如抽出本周必须给负责人看的行动项。
- **Context**：用哪些细节或文件。例如只关注需要管理层马上处理的事项。
- **Format**：要表格、要点、邮件，还是别的。例如三条的摘要。

他们举的整句是：你是专业的业务分析师。总结本周项目更新里的主要行动项。聚焦需要领导立刻处理的事项。用三条要点给出摘要。

配套的习惯也很浅，但够用：用完整句子；说清是总结、改写、改语气还是新写；先短、再在下一句里收紧；把自己 Drive 里的文件点进去，而不是把背景重打一遍。提示词写不顺时，可以先对 Gemini 说「把这句改成一条更有效的提示：……」，看它补上的角色和格式是否真是你要的，再贴回去跑。

## Notebook 是另一个产品边界

Workspace 博客和 Google 的上班快速指南把 Gemini Notebook（NotebookLM 这一路）说成资料枢纽，而不是另一个聊天窗口。你上传方案、研究、访谈或手册，它只根据这些来源回答。适合的问法是「这几份客户访谈里最常出现的五个主题是什么」，不适合拿去问上传范围以外的新闻。

指南里列出的派生能力，都还是围着这些来源转：音频概览、视频概览、思维导图、基于来源的报告、测验和抽认卡。笔记本可以命名并分享给团队，让别人问同一堆材料，而不是每人各自把 PDF 丢进一个新对话。

入口在 [notebook.google](https://notebook.google/) 或 [notebooklm.google.com](https://notebooklm.google.com/)。和 AI Studio 那份面向 API 的提示指南配合看：四段式负责人怎么问，API 文档负责系统指令、例子和工具；Notebook 负责「答案必须落在这叠文件里」。
