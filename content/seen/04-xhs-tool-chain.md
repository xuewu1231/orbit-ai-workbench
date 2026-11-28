---
slug: xhs-tool-chain
kind: seen
title: 小红书运营从「找选题」到「发布」，GitHub 上串成一条链的 5 个开源仓库
subtitle: 五一同学（@wuyi_ai）整理的五段式开源工具链原帖与工作流架构原图：找选题 → 拆爆款 → 定封面 → 做图文 → 自动发布。
access: free
date: 2026.11.21
readingTime: 约 6 分钟
originalAuthor: 五一同学
originalOrg: X · @wuyi_ai
sourceUrl: https://x.com/wuyi_ai/status/2123979715115421988
cover: /covers/xhs-tool-chain.jpg
tags: 自媒体,Agent
order: 4
summary: 原封不动收录五一同学（@wuyi_ai）原帖全文、全部 GitHub 仓库链接与随帖附带的 xiaohongshu-ops 全流程架构图，并附五棒交接助读拆解。
studioNoteTitle: 读前导读 · 原帖全文与工作流架构原图完整收录
studioNoteBody: 本文完整保留五一同学（@wuyi_ai）原帖原文与随帖附带的小红书 AI 运营系统架构图（点击可放大查看完整五步闭环与数据回流细节）。下方虚线框内补充了我们对「这五个仓库每一步究竟该向下一棒交接什么产物」的实战梳理，可与本站「自媒体系统」对照参考。
---

## 原帖全文（@wuyi_ai）

卧槽，小红书运营每天忙的那一套，GitHub 上已经有人给 AI 配齐工具了！

**找选题 → 拆爆款 → 定封面 → 做图文 → 发布**

这 5 个开源项目，把这条链路串起来 👇

### 1、找选题｜Agent-Reach
搜小红书、X、YouTube、B站，收集热点和选题线索。
- 仓库地址：[https://github.com/Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach)

### 2、拆爆款｜xiaohongshu-ops-skill
分析爆款内容，也能辅助诊断账号数据问题。
- 仓库地址：[https://github.com/Xiangyu-CAS/xiaohongshu-ops-skill](https://github.com/Xiangyu-CAS/xiaohongshu-ops-skill)

### 3、定封面｜xhs-visual-director-skill
封面怎么设计、每页放什么画面、提示词怎么写，一起规划。
- 仓库地址：[https://github.com/ziguishian/xhs-visual-director-skill](https://github.com/ziguishian/xhs-visual-director-skill)

### 4、做卡片｜baoyu-xhs-images
把文章拆成适合小红书发布的图文卡片，收录在 `baoyu-skills` 仓库中。
- 仓库地址：[https://github.com/JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills)

### 5、发布｜xiaohongshu-mcp
连接支持 MCP 的 AI 客户端，辅助完成发布操作。

先收藏，下次做小红书，别再对着空白编辑框干坐着了！

![原帖配图：小红书 AI 运营全流程闭环架构示意（调研抓热点 → 选题定角度 → 创作写正文与配图 → 合规后发布 → 数据复盘沉淀记忆）](/figures/xhs-tool-chain/img_01.jpg)

---

:::diagram-xhs-five-handoffs:::

:::guide 助读拆解 · 把 5 个仓库真正跑顺的关键：盯住每一棒的「交接物」
光把五个仓库克隆下来并不会自动出爆款，真正让流水线不卡壳的是明确**上一步必须交给下一步什么具体产物**：
1. **找选题（Agent-Reach）→ 交出「带热度的具体真问题清单」**：不是泛泛的“AI 很火”，而是“谁在什么场景下卡住了、评论区都在追问哪一句”。
2. **拆爆款（xiaohongshu-ops-skill）→ 交出「标题承诺结构与首屏反差公式」**：提炼同类高赞帖赢在哪种对比、哪类痛点切口，而不是堆砌形容词。
3. **定封面（xhs-visual-director-skill）→ 交出「逐页分镜单（每页只讲一件事）」**：先定好封面视觉锚点与每张卡片的信息密度，再进生图/排版。
4. **做卡片（baoyu-xhs-images）→ 交出「风格统一的高清套图」**：把分好镜的精炼文案渲染成统一版式的系列长图/方图。
5. **发布与复盘（xiaohongshu-mcp）→ 完成「最后一公里投递 + 数据回灌」**：发布本身只是手部动作，发完把收藏率/完播率写回选题库，整条飞轮才真正转起来。
:::

**原帖出处：**
- [X · 五一同学（@wuyi_ai）](https://x.com/wuyi_ai/status/2123979715115421988)
