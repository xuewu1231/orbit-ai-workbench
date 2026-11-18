---
slug: openai-image-prompting
kind: curated
category: OpenAI · 图像
title: GPT Image 生图与修图：先定义画面，再一次只改一件事
subtitle: OpenAI 的图像提示指南把生成和修图拆开。生成要写清主体、构图和约束；修图要写清改哪里、留下哪里，并用参考图的角色而不是形容词碰运气。
access: free
date: 2026.11.18
readingTime: 约 8 分钟阅读
audioDuration: 07:20
originalAuthor: OpenAI 开发者文档
originalOrg: OpenAI
sourceUrl: https://developers.openai.com/api/docs/guides/image-prompting
coverAccent: pine
coverSymbol: rings
pairedSkill: ""
relatedSlugs: karpathy-how-i-use-llms,gemini-prompt-design
summary: 精编自 OpenAI《Image prompting》。当前文档以 GPT-Image-2.6 的 Flare 与 Sunburst 为例：用质量档控制细节，用复杂度档控制布局规划，修图时把变更和保留项分开写。
studioNoteTitle: 我们的实战笔记 · 我们用它来收封面和界面配图
studioNoteBody: 百宝箱里的网站截图是浏览器拍的，不走生图。但文章封面、空状态插画、需要透明底的图标，就适用这篇。我们吃过的亏是一条提示里同时改风格、文案和构图，结果每次只对上其中一件。现在生成用「场景 / 主体 / 细节 / 约束」四段，修图永远写「只改 X，保留身份、光线和其余文字」。
---

文档的用法很直白：先决定你要的那张图，再写主体、构图、风格和限制。修图时单独点名要变的部分和必须不动的部分。一次只改一个因素，然后看结果。

## 两个模型，两条工作流

指南里的当前型号是 GPT-Image-2.6。Flare 更小，优先速度。Sunburst 是基座型号，适合更吃细节或必须改准的编辑。两者都能生成、编辑，也都支持透明背景。

选择可以按这条来：现有流程已经够好、或者你在用上一代 Flare，就先拿同一批提示试 2.6 Flare，看质量和耗时。上一代在复杂版式或小字上不够，再试 Sunburst。Sunburst 达标之后，再用相同提示、参考图、尺寸和质量档回头比一次 Flare。

和质量有关的旋钮不要一起拧：

- `quality` 管纹理、小字这类视觉细节，有 auto、low、medium、high，以及更高档。
- `complexity` 管模型在动笔前规划多少。布局已经在提示里定死时，调高它往往看不出差别；布局留白很多时，高复杂度会重新安排主体和文字的位置。局部小修从低复杂度开始，避免把周围一起改掉。
- `size` 用像素尺寸。自定义尺寸时两边用 16 的倍数，宽高比落在 1:3 到 3:1。
- `background` 可以要透明。透明 PNG 或 WebP 要检查解码后的 alpha，不要只看预览发灰。

## 提示词本身的八条

1. 写明用途和构图：产品照片、广告还是图解，主体放哪。复杂需求分成场景、主体、细节、约束。
2. 格式选你改得动的那种。短句、段落、接近 JSON 的结构都可以，没有一种魔法语法。
3. 写看得见的东西：材料、光、颜色、媒介。要照片就直说 photorealistic，不要只堆气氛词。
4. 人要写清景别、视线和手脚在做什么。
5. 必须出现的文字加引号，并写位置和字体感觉。不需要的文字明确说不要，然后自己核对拼写。
6. 修图时用「只改 X」，并列出要保住的身份、几何、版式、光线和标签。
7. 多张参考图要编号，并指定哪张是主体、哪张是风格、哪张是背景。
8. 下一轮把上一张输出当作输入，只提一个改动，关键约束再写一遍。不要指望「和上次一样」能记住所有限制。

矢量输出可以要 SVG，方便改路径和重新上色。循环动画要写清起始姿势，以及镜头动不动，模型才知道绕回哪一帧。
