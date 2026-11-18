---
slug: rethinking-claude-code-best-practices
kind: curated
publisher: youtube
coverFace: ticket
coverTitle: 说明|做减法
category: YouTube · Claude Code 演讲
title: 重新思考 Claude Code 最佳实践：给 CLAUDE.md 做减法与自检闭环
subtitle: 随着新一代旗舰模型推理能力跃升，早期塞满全大写警告的繁琐规则反而成了绊脚石——详解现代三层安全边界与 Hooks 自动把关。
access: free
date: 2026.11.16
readingTime: 约 18 分钟阅读
audioDuration: 15:40
originalAuthor: Lydia Hallie
originalOrg: YouTube · Anthropic 演讲
sourceUrl: https://www.youtube.com/watch?v=vlfCjWuv4es
coverAccent: vermilion
coverSymbol: layers
pairedSkill: "skill-verify-gate"
relatedSlugs: karpathy-how-i-use-llms,anthropic-context-engineering,openai-harness-engineering
summary: 编译自 Anthropic 核心成员 Lydia Hallie 演讲：为什么旧的最佳实践正在失效？如何用精简规则、本地沙箱与退出码钩子实现放手并行开发。
studioNoteTitle: 我们的实战笔记 · 听完这场演讲当天我们就删掉了 60% 的冗余规则
studioNoteBody: 很多团队的 CLAUDE.md 或项目规则文件都是“记仇本”——模型犯一次错就加一行全大写 NEVER DO X，半年下来攒了八百行，模型注意力反而散了。Lydia 给出的判断标准极其犀利：『凡是模型自己读一眼代码仓就能看懂的目录结构和常规约定，一行都别写进 CLAUDE.md；只写真正无法从源码推断的隐性约束』。配合 Stop Hook 自动跑单测，体验脱胎换骨。
---

在 AI Engineer 峰会上，Anthropic Claude Code 团队成员 Lydia Hallie 分享了一个令不少老用户意外的结论：**一年前大家奉为圭臬的许多提示词与配置技巧，在新一代推理模型面前不仅多余，甚至正在拖慢 Agent 的智商。**

## 一、给 `CLAUDE.md` 做狠减法：只写“读代码看不出来的事”

早期模型探索能力弱，需要人工把整个目录树、技术栈名称全喂在根目录规则里。但现在的模型在几秒内就能通过文件检索摸清项目骨架。

- **该删掉的噪音**：常规目录说明、语言基础规范、满篇情绪化的 `CRITICAL: IMPORTANT: NEVER...` 全大写咆哮。
- **真正该保留的干货**：非标准的构建测试命令、历史遗留坑点（例如“某个看似废弃的接口仍有线上定时任务调用，严禁删除”）、团队特有的架构取舍边界。
- **低频专业规范全部迁入按需 Skill**：设计规范、发版流程只在对应任务触发时按需读取，平时保持上下文零负担。

## 二、三层递进安全边界：既要敢放权，又要兜住底

频繁点“允许执行”会彻底打断心流，而裸奔开最高权限又有误伤风险。现代工程防线分为三层：

1. **第一层（配置文件硬性 Deny 规则）**：在项目设置中明确封锁 `.env`、密钥目录与高危远端强推指令，无论模型怎么推理都无法触碰红线。
2. **第二层（操作系统级本地沙箱 `/sandbox`）**：限制文件系统写入范围仅限当前工作区，网络访问按需白名单放行，放心开启自动执行模式。
3. **第三层（云端隔离会话）**：遇到需要连续跑数小时的大模块重构或并行探索分支，直接派发到独立云端容器，与本地开发环境物理隔离。

## 三、用确定性 Hooks 替代肉眼盯屏

与其在提示词里反复叮嘱“写完记得跑测试”，不如直接在生命周期钩子（如 `Stop` 钩子）里挂上一行硬校验脚本：

- 当 Agent 准备结束回合交卷时，自动执行增量类型检查与核心测试；
- 一旦测试失败返回非零退出码，系统自动把报错信息塞回给 Agent 强制继续修复，直到全部绿灯才通知人类验收。
