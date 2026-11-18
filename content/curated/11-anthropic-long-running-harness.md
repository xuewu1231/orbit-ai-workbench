---
slug: anthropic-long-running-harness
kind: curated
category: Anthropic · Agent
title: 长时间运行的 Agent：换班靠进度文件，不靠记忆
subtitle: 压缩上下文并不能让 Agent 做完一个要干很多小时的项目。Anthropic 用初始化代理和编码代理两套开场白，外加一份不许偷改的功能清单，把长任务拆成一班一班的增量。
access: free
date: 2026.11.18
readingTime: 约 10 分钟阅读
audioDuration: 09:10
originalAuthor: Justin Young
originalOrg: Anthropic
sourceUrl: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
coverAccent: vermilion
coverSymbol: layers
pairedSkill: ""
relatedSlugs: long-running-context-engineering,anthropic-context-engineering,openai-harness-engineering
summary: 精编自 Anthropic《Effective harnesses for long-running agents》。新会话没有上一班的记忆。用 init 脚本、进度笔记和全部标成未通过的功能 JSON，避免一口吃掉整个项目或过早宣布完成。
studioNoteTitle: 我们的实战笔记 · 这篇把我们的交接单说成了可执行的文件
studioNoteBody: 我们之前那篇长周期笔记讲的是原则：交接账本、验收清单、能重置的环境。这篇是 Anthropic 把原则写成文件名的版本。我们照着加了一条：功能清单用 JSON，代理只能改通过与否，不能改描述。Markdown 清单太容易被模型「顺手整理」掉。另外，没跑过浏览器里的完整路径，就不许把一条功能标成通过。
---

长任务的难处不是单次窗口不够大，而是每一班开始时，新会话不记得上一班。压缩（compaction）能把历史挤短，但挤出来的说明经常不够清，下一班仍会猜。Anthropic 在 Claude Agent SDK 上看到两种反复出现的失败：要么一口吃掉整个应用，写到一半窗口用完，留下没有文档的半成品；要么看见已经有一些功能，就宣布整个项目做完了。

他们的拆法是两套开场白，工具和系统提示相同，只有第一句用户要求不同。

## 第一班只负责把环境铺好

初始化代理不急着做功能。它要留下：

- 一个 `init.sh`，后面每一班都知道怎么把开发服务器拉起来。
- 一份进度笔记（文中的 `claude-progress.txt`），记录已经做过什么。
- 一次初始 git 提交，让后面能对照、也能回滚。
- 一份功能清单。以「做一个 claude.ai」这种高层次要求为例，他们把需求展开成两百条以上的端到端描述，例如「用户能新开对话、输入、回车、看到回复」。每条一开始都是未通过。

清单用 JSON，而不是 Markdown。模型不太会整文件重写 JSON。提示里要写硬：不许删测试、不许改描述来让任务变简单，只许改 `passes` 字段。

## 之后每一班只做一条，并离开时保持干净

编码代理每次只领一条功能。做完要提交 git，并更新进度笔记。Anthropic 说的「干净」是指：没有明显 bug，代码和文档整齐，下一个人可以直接开下一条，而不必先收拾上一班的残局。

开场固定走一遍，省得每班重新发明轮子：

1. `pwd`，确认自己只能改这个目录。
2. 读 git 日志和进度笔记。
3. 读功能清单，选还没做的最高优先级的一条。
4. 跑 `init.sh`，先用浏览器把基本路径点通。基本功能是坏的，就先修，不要在坏的基线上加功能。

他们用 Puppeteer MCP 让模型像用户一样点。只跑单元测试或对开发服务器发 `curl`，模型会把没走通的界面标成完成。浏览器也有盲区，例如原生 alert 它看不见，依赖弹窗的功能就更容易漏。

## 四类失败和对应的文件

- **太早宣布整个项目完成**：初始化代理留下全部标成未通过的功能 JSON；编码代理开场先读清单，只选一条。
- **留下坏代码或没写下来的进度**：初始化代理留下初始提交和进度笔记；编码代理开场读笔记和日志并做一次冒烟，收工时提交并写笔记。
- **没测完就标通过**：清单里写清端到端步骤；编码代理按用户路径自测后，才改 `passes`。
- **不知道怎么把项目跑起来**：初始化代理写 `init.sh`；之后每一班开场先读这个脚本。

文中也留下一个还没下结论的问题：一个通用编码代理，和测试、验收、收拾代码分开的多个代理，哪一种更好，他们当时没有定论。这份 harness 主要是在全栈网页上试出来的。
