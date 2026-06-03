---
name: ai-frontend-design-sdd
description: 生成 AI 可执行落地的前端设计书。Use when Codex needs to turn product PRD, MasterGo UI, prototype flows, current frontend code, enterprise component library, API constraints, or GitHub/spec-kit style SDD inputs into an evidence-based implementation design for AI agents, including frontend architecture, Agent breakdown, Skills/MCP plan, prompts, acceptance gates, risks, and file-level execution tasks.
---

# AI Frontend Design SDD

## 工作目标

把分散输入转成“AI 能按图施工”的前端设计书，而不是只写页面说明。输出必须让后续编码 Agent 能明确知道：为什么做、做什么、去哪找证据、改哪些模块、用哪些组件、如何验收、何时停止。

## 总流程

1. 建立证据底座：收集 PRD、MasterGo、原型、当前代码、企业组件库、API/权限/路由/状态约束；所有仓库事实必须附 `Evidence(路径+锚点/片段)`。
2. 归一需求语言：把产品目标、页面流程、字段、状态、权限、异常、边界条件统一成 SDD 的 Spec/Plan/Tasks。
3. 做代码和组件库映射：优先使用 Codegraph MCP 分析项目结构、符号、调用关系和影响面；需要视觉或线上页面时优先使用 Chrome DevTools MCP。
4. 产出设计书：按固定章节输出，明确 Agent、Skills、MCP、Prompt、实现任务、验收门禁和风险。
5. Fail-Closed：证据不足、设计稿冲突、接口不明、组件能力未知时，不编造结论；写入 `TODO & Known Issues`。

详细流程见 `references/sdd-workflow.md`。输出格式见 `references/output-contract.md`。证据清单见 `references/evidence-checklist.md`。

## 强制工具策略

- 代码探索、结构分析、符号定义/引用、依赖链路、影响面评估：先用 Codegraph MCP。
- MasterGo/原型/线上页面/浏览器状态：先用 Chrome DevTools MCP；若不可用，说明降级路径和缺失证据。
- Shell 命令：若项目要求 RTK，则所有 shell 命令加 `rtk` 前缀。
- 文件读取：只有 Codegraph 无法提供完整内容、或需要验证具体文件片段时，才降级读取文件。

## 设计书硬约束

- 必须包含：问题分析、系统架构、Agent设计、Skills设计、MCP设计、Prompt设计、实现方案、风险与优化、TODO & Known Issues。
- 必须将 “GitHub/spec-kit SDD” 拆成：Spec（需求与验收）、Plan（架构与技术方案）、Tasks（可执行任务）。
- 必须区分事实、推断、建议：事实带 Evidence；推断标注 `Inference`；未知标注 `❌Unknown` 或 `TODO`。
- 必须输出 AI 执行任务包：每个任务含目标、输入、输出文件、依赖、验收、回滚/停止条件。
- 必须保护测试资产：不得为了设计通过而删除关键断言、放宽门禁、扩大 exclusions。

## 快速执行

当用户给出“根据 PRD + MasterGo + 原型 + 当前代码 + 组件库产出前端设计书”类请求时：

1. 读取 `references/evidence-checklist.md`，列出已知输入与缺失输入。
2. 读取 `references/sdd-workflow.md`，按阶段收集证据并做冲突裁决。
3. 读取 `references/output-contract.md`，生成最终设计书或写入目标目录。
4. 若用户要求落地文件，优先生成：
   - `spec.md`
   - `frontend-design.md`
   - `code-reference.md`
   - `tasks.md`
   - `agent-prompts.md`

## 质量门禁

- 每个功能点必须能追溯到 PRD、UI/原型、代码或组件库证据之一。
- 每个页面/组件必须说明状态、权限、事件、请求、错误和空态。
- 每个实现任务必须小到单个 Agent 可独立执行和验证。
- 最终回复必须说明使用了哪些 skills、哪些 MCP、改了哪些文件。
