---
slug: ai-agent-book-3
kind: seen
title: 《深入理解 AI Agent》出了 3.0，文风改成了教你
subtitle: 李博杰隔了两个月发的更新说明。值得留的不是书单，是他把力气放在模型外面。
access: free
date: 2026.11.22
readingTime: 约 6 分钟
originalAuthor: Bojie Li
originalOrg: X · @bojie_li
sourceUrl: https://x.com/bojie_li/status/2124530971710308709
summary: 3.0 把综述改成教学，并继续把 Harness 放在模型外面。书在 GitHub，这条帖子只是门。
relatedSlugs: anthropic-teams-claude-code,karpathy-nozelcode-ai-system
---

这是一条更新说明，不是一篇新论文。李博杰说，《深入理解 AI Agent》隔了两个月，发布 3.0。仓库在 [github.com/bojieli/ai-agent-book](https://github.com/bojieli/ai-agent-book)。他这条帖子引用的是自己今年 7 月的开源说明。那次他把书的骨架写成一句：Agent 等于模型，加上上下文，加上工具。模型以外的工程，他叫做 Harness，才是真正拉开差距的地方。

## 3.0 他自己列出的变化

各章大部分重写了。他想去掉一些 AI 味，把综述式的写法改成教学式的，让人更容易跟上。

新增的部分，按他的原文，有这些：一类叫 Jev 的决策模型，用在事件过滤、工具安不安全、评测时的评分标准、检索时筛掉什么、多模态信息怎么变稀疏。个人代理怎么办事，他点了 Meta Muse、Pine、dsh superagent。办公场景点了 Multica、LobeHub。科研场景点了 Anthropic 证明黎曼猜想、OpenAI 证明千禧年问题这类工作。语音交互按最近的进展改过。书里很多图重画了。社区译了蒙古语版本。合进了三十多个社区改动，处理了二十多个问题。

我没有把 3.0 全书读完。上面这些是他帖子里的清单，不是我读完后的目录。

## 读完留下的

更新说明通常不值得留。这条留，是因为两处和我正在做的事撞上了。

一处是文风。他把「综述」改成「教学」。综述是把名词排整齐，教学是带着一个人从不会走到会。看见这一页如果只堆链接和金句，就是综述。一篇东西要能再读，得让人跟着做，或者至少跟着想。他自己改书的方向，就是这一页该有的方向。

另一处是那句老公式。模型会过时，上下文和工具的做法更值得反复看。这个站其实就是一个很小的 Harness：复利系统里的网站是给模型看的上下文，Skill 是给模型用的工具，看见和弹药库是人自己留下的上下文。书比这个站厚得多。哪天要系统学 Agent，从仓库读，不要从这条帖子读。帖子只负责记住：3.0 到了，门在 GitHub，力气在模型外面。
