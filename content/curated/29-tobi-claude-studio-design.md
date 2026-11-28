---
slug: tobi-claude-studio-design
kind: curated
publisher: creators
coverTitle: 告别|默认脸
coverFace: poster
category: 设计工程 · Tobi / Construct Design
title: 如何让 Claude 像真正的设计工作室一样做设计
subtitle: Claude 现在一分钟就能给你搭好落地页，问题是每次给你的都是同一张脸。所谓「AI 味」往往不是丑，而是每一个选择都停在了最安全的默认值上。
access: free
date: 2026.11.22
readingTime: 约 9 分钟阅读
audioDuration: 8:30
originalAuthor: Tobi
originalOrg: X · @tobiadonadon_
sourceUrl: https://x.com/tobiadonadon_/status/2124269680122638822
coverAccent: vermilion
coverSymbol: compass
pairedSkill: "clean-ui-guardrail"
relatedSlugs: iso-explode-film,karpathy-nozelcode-ai-system,pm-tech-stack
summary: Tobi 英文长文《How to Make Claude Design Like a Real Studio》逐段完整第一人称中译及全部 5 张原版作品/终端截图：拆解四大默认套路脸、Construct Design MCP 的三步调用链路，以及哪怕不用组件库也能立刻带走的三条去模板铁律。
studioNoteTitle: 读前导读 · 英文原文逐段第一人称直译 + 全部 5 张原帖实拍图
studioNoteBody: 本文完整直译自 Tobi（@tobiadonadon_）的英文原帖长文，保留作者第一人称语气与全部 5 张原图及图注（点击可放大细看）。文内同时保留了我们绘制的「四大 AI 套路脸速查图」与「MCP 三步注入流程图」，方便和本站实战百宝箱里的反塑料设计护栏对照使用。
cover: /covers/tobi-claude-studio-design.jpg
tags: 设计,代码
order: 5
---

Claude 现在几乎什么都能造出来。让它写一个落地页，一分钟就能端到你面前。

唯一的问题是：**你每次得到的都是同一张落地页。**

同样的衬线大标题。
同样挑出一个词改成斜体、涂上橙色。
同样在顶上摆一排极小的等宽字体标签写着 `"now booking"`。
同样在角落里写着 `"lisbon / new york"`。

![今晚我让裸 Claude Code 生成「一个品牌工作室的落地页，做得好看点」，它给我的就是这张页面。还行，但这也是眼下所有模型都在生成的同一张页面。](/figures/tobi-claude-studio-design/img_03.jpg)

AI 罐头味（slop）通常并不是「丑」。它只是把每一个选择都留在了默认值上。

当模型手头没有任何东西可参考时，它就会这样做：选最安全的字体、最安全的排版、最安全的配色。

所以我决定给它一点真正值得看的东西。

---

## 这是什么（What It Is）

它叫 **Construct Design**。这是我社区里的一个设计库：一共 **223 件作品**，全部可在线运行、全部纯手工打磨，因此完全没有 AI 模板味：

- **36 个网站首屏（Website heroes）**
- **37 个 iPhone 应用界面（App screens）**
- **150 个交互组件**（按钮、卡片、滑块、小部件等等）

每一件作品都是从**一个具体的创意点子**出发，而不是从现成模板出发：比如一家品牌工作室官网，移动一束光就能照出藏在纯黑剪影背后的彩色照片；一个电话助手应用，带着一颗在第二声铃响前就会接起电话的玻璃光球；一个像从某人随身笔记本里撕下一页的作品集，你可以亲手把上面的拍立得照片拿起来端详。

![部分网站作品实拍。它们全都是动态交互的，静态截图其实低估了实际效果。](/figures/tobi-claude-studio-design/img_04.jpg)

![几张 iPhone 应用界面。库里的组件都是从这些真实界面里抽出来的，因此整体气质完全统一。](/figures/tobi-claude-studio-design/img_05.jpg)

---

## Claude 是怎么用它的（How Claude Uses It）

这个设计库自带一个 MCP 服务。你只需要连接一次：

```bash
claude mcp add --transport http construct-design "https://www.tobiadonadon.com/api/mcp?key=YOUR_KEY"
```

接着，就像平时一样自然地向 Claude 提需求即可：`“帮我的工作室搭一个首屏，使用 construct design（build the hero for my studio, use construct design）”`。

在幕后，它会依次完成三件事：

1. **`search_designs`**：找到创意内核最贴合你需求的那件设计（它会去读完整的设计描述，而不只是搜名字）；
2. **`design_guide`**：读取设计这一类页面应当遵循的方法准则——涵盖设计流程、字体排印、色彩、版式、动效与自检清单；
3. **`get_design`**：拉取真实源码，由 Claude 改写适配后直接写进你的项目文件里。

![终端里的完整运行实录：新增一个文件，并自动适配成你的品牌色。](/figures/tobi-claude-studio-design/img_02.jpg)

:::diagram-construct-mcp-flow:::

它在 Claude Code、Claude 桌面端、Cursor、Codex 和 VS Code 里都能直接用。

---

## 真正起决定性作用的部分（The Part That Actually Matters）

现成的设计作品帮你省下的是时间；**而那份设计指南（guide），才是真正改变 Claude 设计思考方式的核心。**

这套方法提炼自我的两个设计 Skill（`app designer pro` 和 `web designer pro`），经过精简浓缩，好让模型在边写代码时边读进去。哪怕你从来不用我的组件库，里面也有**三条核心原则**非常值得直接带走：

:::diagram-four-ai-slop-looks:::

1. **认清「四张默认套路脸」**。模型直接生成的页面，十有八九会掉进这四个模子里：
   - **报纸社论风（The Paper Edition）**：衬线大标题里夹一个强调色斜体词、满屏等宽小标签（也就是文章开头那张图）；
   - **产品发布页风（The Launch Page）**：纯黑底、紫色发光光晕、倾斜摆放的产品截图；
   - **数据看板风（The Dashboard）**：顶上一排四张带迷你折线图的 KPI 卡片；
   - **暗黑开发者工具风（The Dark Dev Tool）**。
   如果你的页面跟其中任何一种撞上了三个特征，立刻停手，退回去重想核心创意。

2. **挑一个「标志性动作（Signature move）」**。做一个别人看完真的会专门向朋友描述出来的交互细节。滚动时的渐显上浮（fade-up on scroll）不算，鼠标悬停微微抬起（hover lift）也不算。

3. **做一次「竞品换标测试（The swap test）」**。把竞争对手的 Logo 换到你的页面上。如果看起来毫无违和感，说明你自己的想法压根就没有落到页面上。

同时还要当心**矫枉过正（overcorrection）**。如果你只是笼统地对模型喊一句「不要做得太普通（don't be generic）」，你得到的就会是另一套千篇一律的「极简工作室作品集」：米白底色、大得吓人的标题、带编号的等宽小标签、再加一个挂在顶栏实时跳秒的数字时钟。**请追求「具体而独特（specific）」——极简只是通往独特的一种方式，而不是唯一方式。**

![每一件设计都附带源码与重建它的 Prompt；在拷走之前，你可以直接在页面上调整颜色、文字和光影。](/figures/tobi-claude-studio-design/img_06.jpg)

---

## 如何开始（How To Start）

打开设计库挑出你喜欢的方向，用一行命令接好 MCP，然后在向模型描述你要做什么时顺手加上一句 `“use construct design”`。它就会自己找到参考设计、读完设计准则，并把代码文件写进你的工程。

设计库地址：[https://www.tobiadonadon.com/projects/construct/design](https://www.tobiadonadon.com/projects/construct/design)

---

**原文出处：**
- [X · Tobi（@tobiadonadon_）*How to Make Claude Design Like a Real Studio*](https://x.com/tobiadonadon_/status/2124269680122638822)
