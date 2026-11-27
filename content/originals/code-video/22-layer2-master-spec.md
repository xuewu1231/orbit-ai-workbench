---
slug: spec-code-video-standard
kind: original
portal: code-video
layer: 2
section: spec
category: 第二层 · 审美与视觉规范
chapter: 02
title: 代码视频执行规范（DESIGN.md + MOTION.md 完整原件）
subtitle: 开工前直接放进项目根目录喂给 AI 的标准文件：把画布安全边距、字号阶梯、色彩禁忌与纯时间动画规则一次性定死。
access: free
date: 2026.11.26
readingTime: 约 9 分钟阅读 · 附两份完整标准原件
pairedSkill: "motion-harness-director"
relatedSlugs: cv-design-md-and-skins,cv-live-fx-atlas,cv-springs-and-pipeline
summary: 代码视频项目的唯一标准化执行文件：包含画布与防遮挡安全区参数表、帧确定性工程准则说明，以及可直接复制保存为 DESIGN.md 和 MOTION.md 的完整原件。
studioNoteTitle: 精益求精只留这一份硬规范，每次新建视频项目直接放进去
studioNoteBody: 在对话框里临时叮嘱 AI「字大一点、别写慢渐变」，聊上十轮它就忘了。最稳妥的工程习惯是在项目根目录常驻 DESIGN.md（管画面长相）和 MOTION.md（管镜头动作与渲染不闪屏），让 AI 每次动笔前强制对齐。
---

前面我们讲透了原理和配色，但在真正让 AI 写代码做视频时，如果每次都靠嘴临时叮嘱，很容易顾头不顾尾——改好了字号，它又忘了留底部字幕区；调好了颜色，它又偷偷写了会导致导出闪屏的 `CSS transition`。

所以最省心、最稳定的做法，就是把所有规矩收敛成 **1 套标准规范文件** 放在项目文件夹里。这一篇把各项硬指标的原理列清楚，并在文末附上**可直接复制保存的 `DESIGN.md` 与 `MOTION.md` 完整原件**。

---

## 一、画布尺寸、防遮挡安全区与字阶标准表

做视频和做网页有个容易忽视的差别：**视频发布到小红书、B 站、视频号或抖音后，屏幕四周和底部会被平台的头像、点赞按钮、进度条和字幕挡住一大块！** 如果代码里把文字贴边放，发出去就会被切掉半截。

| 规范项 | 横屏视频标准（`1920 × 1080`） | 竖屏视频标准（`1080 × 1920`） | 常见翻车点与强制要求 |
| :--- | :--- | :--- | :--- |
| **帧率与时长基准** | 统一 `60fps`（每帧 `16.67ms`） | 统一 `60fps`（每帧 `16.67ms`） | 禁止混用 24/30fps 公式导致卡顿感 |
| **四周安全内边距** | 左右各留 `≥ 96px`，顶部留 `≥ 86px` | 左右各留 `≥ 72px`，顶部留 `≥ 180px` | 竖屏右侧最下 `420px` 避开点赞转发图标列 |
| **底部字幕呼吸带** | 底部强制留空 `110px – 130px` | 底部强制留空 `260px – 300px` | 核心图形和底栏数字绝不能压进字幕区 |
| **一级主重点大字** | `160px – 220px`（字重 `900`） | `112px – 148px`（字重 `900`） | 字间距统一收紧 `-0.04em`，拒绝松散 |
| **二级单焦点短句** | `68px – 96px`（同屏 `≤ 12` 汉字） | `50px – 68px`（单行 `≤ 9` 汉字） | 严禁出现三四行小字堆叠的长段落 |
| **三级模拟界面字** | `28px – 36px`（数字开 `tabular-nums`） | `26px – 32px`（数字开 `tabular-nums`） | 模拟微信/代码框只画核心局部，删掉多余侧栏 |

---

## 二、保证导出零闪屏、有电影感的 6 条动作工程准则

:::diagram-camera-choreography:::

这 6 条规则是专门写给编码 Agent 的“防翻车护栏”，每一条都对应一个真实踩过的坑：

1. **纯时间函数驱动（严禁异步与隐式渐变）**
   - 画面中每一个元素在任意时刻 `t` 的状态，必须由 `prepareFrame(time)` 同步直接算出。严禁出现 `transition`、`animation`、`setTimeout`、`setInterval` 或依赖上一帧累加的变量（如 `x += 2`），否则多线程并发分段渲染导出时必出断裂和闪屏。
2. **插值进度强制锁死 `[0, 1]` 闭区间（Clamp）**
   - 写位移或透明度公式时，必须先用 `clamp((time - start) / duration, 0, 1)` 锁死上下限。否则一段 `0.5 秒` 的入场动画到了第 `3 秒` 还在继续往屏幕外狂飞。
3. **随机数必须绑定固定种子（Seeded Random）**
   - 如果画面需要画粒子、震动抖动或岩石纹理，必须使用确定性的伪随机函数（如 `Math.sin(index * 999)` 或带固定 `seed` 的生成器），保证同一帧重拍一百次结果完全一致。
4. **外层套统一摄像机容器（`<CameraRig>`）**
   - 不要让页面上五六个元素各自写复杂的缩放位移。最外层统一放一个全屏 `<CameraRig>` 容器：推近看细节就改摄像机的 `scale` 和 `translate`，换章节做横甩或穿孔也统一动摄像机，再叠加一层极轻微的连续呼吸感（如 `Math.sin(time * 1.6) * 2.5px`），画面立刻摆脱死板感。
5. **字体与本地素材先加载完再抓拍**
   - 抓拍第一帧前必须确保字体已就绪（`await document.fonts.ready`），所有图标使用内联矢量 `<svg>` 而非慢速外链图片，杜绝前几帧字体回退成默认宋体或图片空白。
6. **严控同屏元素上限与错峰节奏**
   - 概念镜头同屏可见独立模块不超过 `3` 个；并列出现 `2–3` 张卡片或标签时，必须按 `index * 0.06s`（约 4 帧）依次错峰弹入，禁止僵硬齐刷刷闪现。

---

## 三、直接复制落盘的标准文件原件

### 文件 1：项目根目录 `DESIGN.md`（负责锁死视觉、色板与字号）

*(注：下方色值默认填的是最百搭的「Vox 暖纸社论风」，如果你在上一篇预览台挑中了其他皮肤，把一键复制出来的色值替换掉第 2 节即可。)*

```markdown
# DESIGN.md — Code-Video Visual Specification

## 1. Canvas & Safe Area
- Resolution: 1920x1080 @ 60fps (Landscape)
- Safe Padding: top 86px, left/right 96px, bottom 120px (reserved for voiceover captions — never place key visuals in the bottom 120px).
- Negative Space Rule: Keep >= 65% clean background space on all conceptual & typography shots.

## 2. Color System (Strict 75 : 18 : 7 Ratio)
- 75% Canvas Background: `#F5F1E6` (Warm Editorial Paper)
- Elevated Surface / Simulated UI Card: `#FFFFFF` with `2px solid #111111` border
- 18% Primary Ink: `#111111` | Secondary Muted Ink: `#57534E`
- <= 7% Single Hero Accent: `#FF381C` (Vermilion Red — strictly reserved for key metrics, stamps, and intercept lines)
- Marker Highlight Bar: `#FFE500` (for kinetic underline/highlight behind anchor terms)
- Chapter Climax Inversion: Flip background to `#111111` and primary ink to `#F5F1E6` on major turning points instead of introducing new colors.

## 3. Video Typography Scale (3x Web Scale)
- Font Stack: `"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", -apple-system, sans-serif`; Monospace for metrics: `"JetBrains Mono", ui-monospace, SFMono-Regular, monospace`.
- Level 1 Hero Term / Metric: `168px - 210px`, weight `900`, letter-spacing `-0.04em`, line-height `1.05`.
- Level 2 Single-Focus Phrase: `72px - 92px`, weight `800`, strictly `<= 12` Chinese characters on screen.
- Level 3 Simulated App UI (WeChat / Terminal / Card): `28px - 36px`, weight `600-700`. Every animated number MUST set `font-variant-numeric: tabular-nums`.

## 4. Visual Redlines (Zero Tolerance)
- NO dark-mode neon purple/cyan/red/green glowing Bento boxes.
- NO two-column bullet-point slide layouts summarizing the voiceover.
- NO native colorful Emojis anywhere on canvas (use clean geometric SVG strokes or bespoke physical props).
- NO meaningless decorative English corner badges (`MODULE 01`, `AI SYSTEM READY`, fake progress bars).
```

### 文件 2：项目根目录 `MOTION.md`（负责锁死镜头、弹簧与纯时间确定性）

```markdown
# MOTION.md — Deterministic Camera & Animation Specification

## 1. Pure Time Determinism (Top Engineering Rule)
- 100% of positions, scales, rotations, opacities, SVG stroke-dashoffsets, and rolling numbers MUST be pure, synchronous functions of `prepareFrame(time)`.
- STRICTLY FORBIDDEN: CSS `transition`, CSS `@keyframes` / `animation`, `setTimeout`, `setInterval`, stateful frame counters, or unseeded `Math.random()`.
- Every progress calculation `(time - tStart) / duration` MUST be explicitly clamped to `[0, 1]`.

## 2. Standard Spring & Micro-Physics Presets
- Ban `linear` easing for spatial movement. Use three distinct physical profiles:
  1. `CAMERA_SPRING` (stiffness: 150, damping: 26, mass: 1.1) — Smooth, zero-bounce camera push/pull/pan.
  2. `CARD_SPRING` (stiffness: 220, damping: 19, mass: 1.0) — Crisp entrance for hero terms and UI cards.
  3. `TAP_SPRING` (stiffness: 340, damping: 15, mass: 0.8) — Snappy impact for stamps, button clicks, and locks.
- Anticipation & Follow-Through:
  - Add a `0.12s` reverse crouch (`8px` down or `scale(0.92)`) before high-energy jumps or portal zooms.
  - Delay inner card text by `40ms` (`2-3 frames`) relative to its container for physical weight.
  - Stagger sibling items by `60ms` (`index * 0.06s`).

## 3. CameraRig & Transitions
- Wrap the entire stage in a single `<CameraRig>` container with subtle continuous handheld drift (`±2.5px` low-frequency sine wave) and decaying 60fps impact shake (`0.22s`) on heavy slams.
- Prefer purposeful transitions over generic fades:
  - Macro Focus (`scale(2.4)` on real UI detail -> `0.48s` pull-out to `scale(1.0)` full view with stamp).
  - Portal Zoom-Through (`scale(0.92)` crouch -> `scale(15)` through circular letter/hole into inverted-color act).
  - Whip Pan (`0.28s` fast horizontal slide with motion-streak lines).

## 4. Narrative Pacing & Continuity
- Heartbeat Alternation: Alternate `1.5s-2.0s` giant typography anchors with `3.5s-5.0s` physical metaphors or 1:1 simplified software UI scenes.
- Eye Trace: Align the birth coordinates `(X, Y)` of the incoming focal element with the resting coordinates of the outgoing action.
- Visual Motif: Thread ONE central geometric prop morphing continuously across chapters rather than scattering unrelated icons.
```
