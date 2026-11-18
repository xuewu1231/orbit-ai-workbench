---
slug: simon-willison-llm-workflows
kind: curated
publisher: creators
coverTitle: 用好大模型写代码的实战铁律
category: X / 独立开发者实战笔记
title: Simon Willison 的 AI 辅助编程指南：把大模型当成不知疲倦的高速实习生
subtitle: 作为开源界最高产的 AI 实践者之一，Simon Willison 拆解了他每天如何用大模型秒造小工具、写测试兜底，以及为什么“你自己的工程积累越深，AI 杠杆反而越大”。
access: free
date: 2026.11.13
readingTime: 约 11 分钟阅读
audioDuration: 09:30
originalAuthor: Simon Willison
originalOrg: Simon Willison · Weblog / X
sourceUrl: https://simonwillison.net/2025/Mar/11/using-llms-for-code/
coverAccent: blue
coverSymbol: minimal
pairedSkill: "skill-verify-gate"
relatedSlugs: x-builders-agentic-workflow,dan-koe-ai-business-2027,karpathy-how-i-use-llms
summary: 精编自 Simon Willison《Here's how I use LLMs to help me write code》：讲透上下文投喂、微型单页小工具爆发力，以及人工把关底线。
studioNoteTitle: 我们的实战笔记 · “单文件小工具（HTML Tools）”真是被低估的生产力金矿
studioNoteBody: Simon Willison 有一个特别值得学的习惯：遇到任何日常繁琐小需求（比如对比两份 JSON、裁切预览图、解析一段日志），他不会去搜一堆满是广告的在线网站，而是花两分钟让 AI 生成一个零依赖的独立 HTML 小工具，存进自己的工具库里永久复用。我们百宝箱里不少内部小工具，就是照这个思路攒出来的。
---

Django 联合创始人、Datasette 作者 Simon Willison 是技术圈公认最勤奋的一线 AI 实测记录者。在这篇广为流传的实战长文里，他毫无保留地摊开了自己每天与大模型结对写代码的真实手法。

## 一、别指望它替你思考架构，让它替你消灭体力活

很多人第一次用 AI 写代码失望，是因为丢过去一句模糊的大需求，指望模型直接端出一套完美无瑕的复杂系统。

Simon 的定位非常清醒：**你自己依然是总设计师与最终责任人**，大模型则是一个打字如飞、背熟了所有冷门库 API、随时愿意重写五遍的高速搭档。你越清楚底层原理、越懂怎么选型，就越能在一分钟内指出它的偏差并把它拉回正轨。

## 二、上下文给得越干净，一次成型的概率越高

模型不会读心术，它只看得到当前窗口里的 token：

- 动工前，先把项目里已经写好的一两个**标杆文件**喂给它当样板，比写十条抽象代码规范管用得多。
- 遇到模型还不熟悉的新版 SDK 或内部库，直接把那几页官方文档或源码贴进上下文，立刻就能消掉大部分“胡编函数名”的幻觉。
- 一旦一个会话里试错了好几轮、上下文里堆满报错废话，果断新开一个干净窗口，把确认正确的结论带过去重开。

## 三、解锁“随手造一次性小工具”的自由

过去写一个小工具如果预计要花三小时，而手工处理只要二十分钟，人就会忍着手工干。现在写一个零依赖单页 HTML 工具只要两分钟，投入产出比彻底反转了：

1. 零后端、零构建步骤，纯 HTML + CSS + 原生 JS 一个文件搞定。
2. 跑通以后顺手推到 GitHub Pages，自己和同事随时打开浏览器就能用。
3. 攒上几十个之后，它们又反过来成了给 AI 下次造新工具的最佳参考样本库。

## 四、绝不跳过的底线：每一行入库代码都要能跑通测试

AI 写测试的速度比人快得多。哪怕原型阶段跑得再猛，合并进主干前也要先让它补齐自动化测试，并亲眼看见测试先红后绿——**把枯燥的敲键盘交给模型，把审视与拍板留给自己。**
