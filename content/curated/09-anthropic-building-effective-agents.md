---
slug: anthropic-building-effective-agents
kind: curated
publisher: anthropic
category: Anthropic · Agent
title: 构建有效的 Agent：先用工作流，再把自主权交出去
subtitle: Anthropic 把「代理式系统」拆成两条：路径写死的工作流，和由模型自己决定下一步的 Agent。大多数团队该停在更简单的那条上。
access: free
date: 2026.11.18
readingTime: 约 11 分钟阅读
audioDuration: 09:40
originalAuthor: Erik S.、Barry Zhang
originalOrg: Anthropic
sourceUrl: https://www.anthropic.com/research/building-effective-agents
coverAccent: slate
coverSymbol: layers
pairedSkill: ""
relatedSlugs: anthropic-context-engineering,anthropic-long-running-harness,less-tools-better-agents
summary: 精编自 Anthropic《Building effective agents》。工作流换的是可预测，Agent 换的是灵活和成本。文中的五种工作流加上三条原则，仍然是决定「要不要做成自主循环」的清单。
studioNoteTitle: 我们的实战笔记 · 这篇是我们决定不做「一个大 Agent」的依据
studioNoteBody: 官方在文首注明：2024 年 12 月之后工具生态变了，当前做法要配合他们后来的 Managed Agents 文档看。模式本身没过时。我们内部凡是分类清楚的活，都先写成路由或提示链，只有步骤数事先写不死的活才进自主循环。工具描述我们现在当提示词来写，因为他们在 SWE-bench 上花在工具上的时间比花在总提示上还多。
---

Anthropic 把客户和自己做的系统放在一起看，成功的实现很少靠一层很厚的框架。他们先把名词分开：

- **工作流**：模型和工具按事先写好的代码路径编排。
- **Agent**：模型自己决定过程和下一个工具，任务怎么完成由它掌控。

两者都算代理式系统，但代价不同。Agent 用更高的延迟和费用换任务表现。很多应用把一次模型调用、加上检索和几个例子，优化到位就够了。

## 框架是加速器，也是盲区

Claude Agent SDK、AWS 的 Strands、以及拖拽式的 Rivet、Vellum，都能省掉调用、解析工具、把多次调用串起来这些体力活。代价是提示和原始响应被包住，不好查，也容易让人过早加上不需要的复杂度。他们的建议是：能用 API 写几行就先写几行；如果用框架，得读得懂底下那层。

## 从增强的模型到五种工作流

基本块是带检索、工具和记忆的模型。在此之上，常见模式是：

1. **提示链**：一步的输出是下一步的输入，中间可以加程序检查。适合能切成固定子任务的活，例如先写提纲并检查，再写正文。
2. **路由**：先分类，再送进专门的提示、模型或工具。简单问题走小模型，难问题走强模型，就是这一类。
3. **并行**：要么把任务切开同时跑，要么同一件事跑多次再投票。护栏和主回答分成两次调用，通常比塞进同一次更稳。
4. **编排者与工人**：中心模型临时决定子任务，而不是事先写死。改很多文件的编码任务、要自己决定搜哪些来源的研究，适合这种。
5. **生成者与评估者**：一个模型写，另一个按明确标准提意见，循环到达标。适合翻译润色、以及「还要不要再搜一轮」这种可以判断的研究。

真正的自主 Agent，用在步骤数无法事先写死、你又信得过它的决策时。它必须每一步都拿到环境里的事实（工具结果、测试输出），并设最大回合之类的停止条件。编码和客服是他们看到最贴的两类：编码能用测试验证，客服既要对话也要查订单、执行退款，成功与否也量得出来。

## 三条他们反复用的原则

1. 设计保持简单。
2. 把计划步骤展示出来，方便人看它为什么这么走。
3. 认真做 Agent 和计算机之间的界面：工具文档、参数、边界都要经得起测试。

工具格式不是小事。写 diff 要预先知道改了几行，把代码塞进 JSON 要转义，这些都比模型在网上见过的普通文本更难写。他们的经验是参数用绝对路径而不是相对路径，模型就少走丢；一个人和初级工程师都说不清该用哪个工具的时候，模型也选不对。
