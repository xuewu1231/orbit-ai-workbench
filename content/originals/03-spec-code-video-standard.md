---
slug: spec-code-video-standard
kind: original
portal: ai-coding
section: spec
category: 可执行规范 · 代码视频
chapter: Spec 03
title: 代码视频工程与母版规范：纯帧号确定性渲染、弹簧常量与五大色板
subtitle: 用 AI 写代码做视频（Remotion / Canvas 帧序列）最怕导出闪屏、卡片飞出画布、动作像死板 PPT。这份规范把底层确定性红线、物理弹簧预设与五套配色母版一次性钉死。
access: free
date: 2026.11.24
readingTime: 约 10 分钟阅读
pairedSkill: "code-video-director"
relatedSlugs: ai-code-video-handbook,spec-ui-aesthetic,iso-explode-film
summary: 代码驱动视频的底层硬性标准：纯帧号确定性渲染最高红线、插值 clamp 钳制、三级物理弹簧常量、外层虚拟摄像机容器、画幅安全区字阶，以及五大可复用主题色板参数。
studioNoteTitle: 规范使用方式 · 分镜单确认后、让 AI 正式写视频组件代码前必贴此规范
studioNoteBody: 网页前端和代码视频有一个致命区别：网页按真实时间单线程跑，而视频渲染器会把第 10 帧、第 120 帧分给十几个无头浏览器并发截图合成 MP4。只要代码里混进一行 CSS transition 或 setTimeout，导出的视频就会疯狂闪屏错位。这条红线必须靠硬规范锁死。
---

当我们用 React / TypeScript / SVG（如 Remotion 体系或自研帧渲染引擎）让 AI 生成高清视频时，**工程规范直接决定了成片是「电影级丝滑」还是「导出即闪屏报废」**。

下面把所有代码视频项目通用的工程红线、物理弹簧常量与视觉色板整理成标准字典，开工写码前直接挂载即可。

:::diagram-video-standard-sop:::

---

## 一、五条不可逾越的工程硬红线

1. **最高红线：100% 纯帧号确定性渲染（Deterministic Frame）**
   - **严禁使用**：CSS `transition`、CSS `@keyframes animation`、`setTimeout` / `setInterval`、自增外部变量，以及无固定种子的 `Math.random()`。
   - **唯一合法做法**：画面上任何时刻的位置、缩放、透明度、路径长度与数字数值，必须 100% 是当前帧号 `frame` 的纯函数（通过 `spring({ frame, fps })` 或 `interpolate(frame, ...)` 计算）。保证随便跳到第 `N` 帧截图，结果永远分毫不差。
2. **插值边界强制钳制（Extrapolate Clamp）**
   - 所有 `interpolate` 调用必须显式加上 `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }`，防止帧号超出动画区间后元素继续无限放大或飞出屏幕外。
3. **外层虚拟摄像机统一运镜（CameraRig Wrapper）**
   - 不要让画面里的十几个子元素各自乱飞。全场用一层 `<CameraRig>` 包裹，统一控制推拉（`scale`）、平移摇镜（`translateX/Y`）、微倾角与停留期悬浮微呼吸，画面秩序感立刻稳住。
4. **画幅防遮挡安全区（Safe Area）与视频级字阶**
   - 横屏 `1920×1080` 四周必须留足 `10%`（左右 `192px`、上下 `108px`）安全边距；竖屏 `1080×1920` 顶部留 `12%`、底部留 `18%`（避开短视频平台标题栏与点赞按钮遮挡）。
   - 视频是隔屏快速扫视的媒介：**所有字号必须比普通网页放大 `1.5x` 以上**（1080p 主标题 `64px–96px`、卡片标题 `36px–44px`、正文标签绝不小于 `24px`），且单张镜头卡片内文案不超过 `15` 个字。
5. **按幕拆解独立组件（Scene Modularity）**
   - 严禁把两分钟视频塞进一个上千行的单文件里。每一幕（通常 `120–240` 帧，即 2–4 秒）单独拆成 `Scene01Hook.tsx`、`Scene02LiveUI.tsx`，在主时间轴里用 `<Sequence from={...} durationInFrames={...}>` 清晰编排，改哪一幕就只动哪一幕。

---

## 二、三级标准物理弹簧常量（彻底告别匀速平移）

严禁对位移和缩放使用死板的 `linear` 线性插值。在项目顶层统一预设以下三套经过调校的物理弹簧常量，按物体重量对号入座：

| 常量名称 | 标准物理参数 | 视觉体感描述 | 适用镜头对象 |
| :--- | :--- | :--- | :--- |
| **`CAMERA_SPRING`** | `mass: 1.2, damping: 26, stiffness: 120` | 沉稳厚重、零多余晃动 | 外层摄像机推镜特写、拉镜揭晓全景、大画布滑轨平移 |
| **`CARD_SPRING`** | `mass: 0.9, damping: 20, stiffness: 210` | 轻快利落、带极轻微弹性定格 | 真实 UI 卡片浮现、代码窗口展开、柱状图生长（配合每项延迟 `4` 帧错峰） |
| **`TAP_SPRING`** | `mass: 0.6, damping: 16, stiffness: 320` | 清脆干脆、有指尖按压回弹感 | 拟真光标点击按钮微缩、重音关键词砸屏卡点、徽章点亮 |

---

## 三、五大可复用视觉主题色板母版

开拍前先指定其中一套主题母版，锁死全局 `THEME` 常量：

| 主题代号 | 代表四色（底 / 面 / 主字 / 唯一强调色） | 核心质感法则 | 最佳适用片型 |
| :--- | :--- | :--- | :--- |
| **01 · Keynote 纯白精密** | `#F5F5F7` / `#FFFFFF` / `#0A0A0B` / `#2563EB` | 外灰内白双层卡 + 柔和漫射阴影 + 紧凑黑体 | 产品发布大片、清爽 SaaS 功能演示 |
| **02 · Obsidian 暗黑极客** | `#090A0F` / `#131620` / `#F8FAFC` / `#38BDF8` | `1px` 银白顶光微边框 + 语法高亮代码窗 | AI Agent、CLI 编程工具、底层架构拆解 |
| **03 · Paper 纸感手绘** | `#FAF8F4` / `#FFF3BF` / `#1E293B` / `#EA580C` | 细点阵网格纸底 + `2px` 硬边卡 + SVG 动态画圈连线 | 知识口播配片、概念推演、白板流升级版 |
| **04 · Hardware 工业仪器** | `#E5E5E5` / `#18181B` / `#111111` / `#FF4F00` | 等宽编号角标（`SCENE 01 // 60FPS`）+ 十字刻度 + 信号橙 | 模型横评跑分、硬核参数对比卡点片 |
| **05 · Reel 竖屏高能卡点** | `#0D0F14` / `#191D28` / `#FFFFFF` / `#F59E0B` | 视觉强锁竖屏中轴 + 逐词跟随胶囊大字幕 | 小红书 / 视频号 / Shorts 9:16 干货短视频 |

---

## 四、直接复制给 AI 的代码视频工程规范指令

分镜确认后，把下面这段纯文本直接发给 AI 开始写视频代码：

```text
请按已确认的分镜单编写 60fps 视频组件代码，并严格执行以下 6 条工程硬规范：

1. 纯帧号确定性渲染（最高红线）：严禁使用 CSS transition、CSS animation、setTimeout 或无固定种子的 Math.random()。所有位移、缩放、透明度、SVG 路径进度与数字滚动必须 100% 由当前帧 frame 通过 spring() 或 interpolate() 纯函数计算得出，确保多线程并发导出 MP4 零闪屏。
2. 插值边界钳制：所有 interpolate 必须显式配置 extrapolateLeft: 'clamp' 与 extrapolateRight: 'clamp'。
3. 预设三级物理弹簧与主题常量：在顶层定义 THEME 四色常量，以及三套物理弹簧——CAMERA_SPRING（mass:1.2, damping:26, stiffness:120 用于运镜）、CARD_SPRING（mass:0.9, damping:20, stiffness:210 用于卡片入场）、TAP_SPRING（mass:0.6, damping:16, stiffness:320 用于点击与重音卡点），严禁使用死板的 linear 匀速位移。
4. 虚拟摄像机容器：使用外层 CameraRig 容器统一编排推拉（scale）、摇移（translate）与停留期微幅呼吸浮动，禁止让子元素杂乱飞入。
5. 视频级字阶与安全区：画幅四周留足 10% Safe Area（竖屏底部留 18%）；字号比普通网页放大 1.5 倍以上，单张卡片文字不超过 15 字，所有数字开启 tabular-nums，图标统一使用几何线性 SVG，禁用 Emoji。
6. 按幕独立拆分：每一幕拆分为独立组件文件，在主时间轴中通过 Sequence 清晰串联。
```
