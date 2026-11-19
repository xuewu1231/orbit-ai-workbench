# Orbit · AI Workbench

我们团队的 AI 工作台与灵感总站：人能看懂「好在哪、怎么用」，AI 能一键拿到整理好的参考提示词，Agent 能直接读取 `/llms.txt`。

## 里面有什么

- **实战百宝箱**（`/ecosystem`）：分三格
  - 设计灵感：设计得好的网站、UI 组件库、视觉风格
  - 学习收藏：Prompt / Bot 市场、实战指南
  - 技能工具箱：Skill、工作流、AI 工具
  - 每条收藏都有「✦ 复制给 AI」（干净纯文本提示词）、悬停网站预览、原站图标、色号一键复制
- **填空模板**：交接单、反问对齐、岗位卡、收藏卡，填完直接复制给 AI
- **产品孵化**（`/products`）：已上线、内测中与构想池
- **经历 / 精选好文**：Markdown 驱动的长文阅读页。经历分自己做的、公司里、简便办法；公司里再分知识、决策、现状。
- **给 AI 读的接口**：`/llms.txt`、`/vault.json`

## 本地运行

需要 Node.js 18+，无第三方依赖。

```bash
npm run dev     # 本地预览 http://localhost:4321（改内容后刷新即可）
npm run build   # 导出纯静态站点到 dist/，可直接部署到 Vercel / Cloudflare Pages
```

## 怎么加内容

| 想加什么 | 改哪里 |
| :--- | :--- |
| 收藏一个网站 / 组件库 / Skill | 页面右上角「＋ 收录」，或编辑 `content/catalog/ecosystem.json` 的 `vaultItems` |
| 产品或构想 | `content/catalog/ecosystem.json` 的 `products` |
| 填空模板 | `content/catalog/ecosystem.json` 的 `templates` |
| 首页 AI 工作台 | `content/catalog/workbench.json` |
| 经历 | `content/originals/*.md`（`lane: made / company / method`，公司笔记再写 `module: knowledge / decision / now`；`<!-- PRO_CUT -->` 以下为 Pro 内容） |
| 精选好文 | `content/curated/*.md`（`studioNoteBody` 为我们的实战笔记） |
| 品牌名、定价 | `content/site.json` |

收藏条目的 `shelf` 字段决定放在哪一格（`design` / `learning` / `toolkit`），填了 `url` 会自动使用原站图标，也可以用 `icon` 字段指定图标地址。

## 目录结构

```
content/     站点内容（JSON + Markdown）
lib/         内容加载、Markdown 解析、页面模板
public/      样式、交互脚本、预览截图
scripts/     静态构建脚本
server.mjs   本地开发服务器（含收录接口）
```
