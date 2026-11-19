---
slug: lauren-tan-grok-garden
kind: curated
publisher: xai
coverFace: band
coverTitle: 代码|是花园
category: SpaceXSI · Grok Bot
title: Grok Bot 的产品工程师：垃圾代码怎么收成能信任的花园
subtitle: Lauren Tan（Potato）在 SpaceXSI 做 Grok Bot。2026 年 11 月 11 日她在旧金山讲了一场：先把代码库收干净，再让 agent 自己合并。
access: free
date: 2026.11.11
readingTime: 约 8 分钟阅读
audioDuration: 7:10
originalAuthor: Lauren Tan
originalOrg: SpaceXSI · Grok Bot
sourceUrl: https://mp.weixin.qq.com/s/bspAIGzuEPTcQmSCGGBMqQ
coverAccent: pine
coverSymbol: layers
pairedSkill: ""
relatedSlugs: claude-code-verification,xai-grok-agent-tools,grok-reasoning-and-multi-agent
summary: 她把信任放成一座倒金字塔：代码库和静态检查在下，验证在中，文字指令在最上。杂草会被下一个 agent 当成规矩抄走。数字是她当场说的。
studioNoteTitle: 我们的实战笔记 · 和验收那本是同一件事，她把顺序说得更硬
studioNoteBody: 修一次错，就把它变成代码里的一条检查，而不是再往说明里加一行。上一本写的是 Claude Code 团队怎么验收，这一本是 Grok Bot 这边先修花园、再谈自动化。微信是中文译稿，演讲视频在文末。
---

这篇记的是 Lauren Tan 的一场演讲。她自称 Potato，头衔是 SpaceXSI 首席工程师，做的产品是 Grok Bot。2026 年 11 月 11 日，她在旧金山的 AI Engineer Code Summit 讲了 *All Code Is Slop (Except Mine)*。视频在 [YouTube](https://www.youtube.com/watch?v=O_zcc6Xl12g)，大会页在 [ai.engineer](https://ai.engineer/code/2026/talks/lauren-tan)。你发来的微信是根据演讲和自动字幕整理的中文译稿。下面是我们的笔记，不是译文。

她的论点是：agent 让每个人都能堆出很多代码。工程师的工作变成，在产量上去的同时，质量不掉。她不爱「软件工厂」这个说法，她说这件事归到信任。不是盲信，是把环境投到你敢让它自己做对。她说自己花了半年，才敢在睡觉时也让合并请求出去。

## 信任先放在代码里

她用一座倒金字塔分配时间。底下两层是确定的，来自你自己的代码：API、架构、重构，以及 lint、类型、编译器和测试。这两层用来限制 agent 能做什么，让做对变成默认。

再往上是验证，运行时的和形式化的。用来找错，查不变量，也用来看 agent 有没有理解你的目标。

最上才是文字：rules、skills、`agents.md`，留给需要判断、写不进代码的东西。

她的顺序很具体。agent 按输入产出结果，代码库是最大的一份输入。所以每次纠正它，先想能不能变成一条确定的检查。写进说明里的一行，不如写进代码里容易复现，也更敢信。

## 代码库是花园

她记得 2024 年上班，一天审同事的三个合并请求。现在这个数字接近 300。每个工程师后面是几百甚至几千个 agent，代码像水流进来。约束和护栏是新代码生长时靠着的地基。

变通、反模式、过时代码、技术债，在库里看起来就像既定写法，下一个 agent 会抄。她把这比成花园里的杂草。所以库要尽量干净，抄走的才是好的。

## 写进 Dune 的几条禁令

Dune 是他们给 Grok Bot 做的客户端框架。她说技术上不复杂，可以把它想成 Electron 应用的 Next.js。有意思的是限制。需要很多技巧才用得好的东西，用不好就会变成垃圾。React 的 `useEffect` 是她举的例子。agent 尤其不擅长。他们的办法是在产品代码里禁用，只允许出现在 Dune API 内部的少数地方。她说这个问题就此消失，评审时不用再修。

另一条来自他们在 Cursor 这个 Electron 应用里看到的反模式：agent 把主线程的代码 import 进渲染线程，造成长任务和卡顿。Grok Bot 和 Dune 里有两个顶层目录，名字就叫 Electron renderer 和 Electron main。两个目录之间的 import 被依赖图和 lint 禁止。评审时少想一件事。

她还注意到 agent 会用 Markdown 给自己找借口。文档、注释、rules、skills 都会变成「这件事很难，所以这个补丁是合理的」。在 Cursor 里，agent 喜欢用 `setTimeout`、`requestAnimationFrame`、`requestIdleCallback` 去填命令式和声明式之间的缝，再写一大段注释解释。定时器被快速创建和销毁，垃圾回收变频繁，界面就卡。他们在 Grok Bot 里禁掉大约 99% 的注释，因为注释很快过时，人也很少读，而且注释没有强制力。「告诉下一个 agent 别这么做」不会变成你能信任的东西。lint 要给出能修根因的报错，而不是鼓励再打一个补丁。

她的总原则：每次修 agent，要么变成这样一条确定的检查，要么用更好的 API 或架构把这类问题从代码里拿掉。要看的东西会越来越少。少到一个程度，大部分合并请求可以让 agent 自己合。

## 评审改成看证据

她说他们的代码评审，现在主要是看验证产物：视频、截图、图表、形式化结果。

运行时验证就是让 agent 用人和开发者一样的工具把代码跑起来，比如 Chrome DevTools 协议。技能里有一张 feature map，从用户视角列出应用里的功能。你说「左边面板上的那个」，它不用猜。技能里用他们自己的命令行，同一套驱动反复用，也测得了。

形式化验证还在试。跨设备、跨平台的通知，用 TLA+ 做模型。他们自己的虚拟化库，用 Lean 证明不要闪、不要抖。她说已经用这个找出过不少错，但不是万能药，只是环境里的又一层。

界面上的属性测试，他们用一个叫 Bombadil 的库，抓到过几个界面 bug。她引用 Cindy 六个月前的一条帖：小错混进代码，就没法信任自己的 agent。六个月后，Cindy 说自己每天 70% 的 token 花在验证上。Lauren 说她自己的大部分 token 也在验证上。这些工具并不新，以前是因为难写、难维护，贵。agent 把这个成本打下来了。

她在自己的 pstack 插件里做了一个 state chart，从用户视角把状态机画出来，配上视频和截图。

## 她当场报的速度

这些数字都是她在台上说的，我们没有另行核对。

她自己上个月往生产环境发了 3000 个合并请求。Grok Bot 团队上个月发了 11000 个。客户端大约每天一个新稳定版。2026 年 10 月，大约 227 人至少创建过一个合并请求。撤回的比例相对下降，停在 0.5%。她同时说，启动、打字、打开新聊天、在聊天之间切换，自上线以来变快了。Grok Bot 仍是 Electron，她说有上限，但以这个速度和这么多贡献者，她觉得已经不错。

她的提醒放在自动化前面：先用 lint 挡住新的反模式，再清理旧的，并确认验证真的可靠。内部循环如果产出的是垃圾，把这个循环自动化，只会得到更多垃圾，再用更多 token 去修。地基做好之后，Grok Bot 可以接外圈。她举的例子是：每次发一个新版本，Grok Bot 在 Cursor 里开一个新项目，把整个应用像真实用户一样跑一遍做模糊测试，针对每个 bug 打开带修复的合并请求，并自动合并。她说这能成立，是因为代码库质量够高，大部分产品代码不再需要深入的人工评审。
