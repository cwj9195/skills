---
name: ai-frontend-design-sdd
description: 生成 AI 可执行落地的前端设计书。Use when Codex needs to turn product PRD, MasterGo UI, prototype flows, current frontend code, enterprise component library, API constraints, or GitHub/spec-kit style SDD inputs into an evidence-based implementation design for AI agents, including frontend architecture, Agent breakdown, Skills/MCP plan, prompts, acceptance gates, risks, and file-level execution tasks.
---

# AI Frontend Design SDD

## 版本与适用范围

- 版本：v2.0.0
- 更新时间：2026-06-03
- 适用模型：GPT-5/Codex、Claude 系列、Qwen/弱遵循模型；弱模型必须严格按 `references/output-contract.md` 的文件模板填空，不允许自由改章节。
- 更新原因：强化“AI 可落地可执行设计书”的稳定产出，补齐固定文件链路、模块拆分、自检清单、Prompt 模板和版本约束。

## 工作目标

把分散输入转成“AI 能按图施工”的前端设计书，而不是只写页面说明。输出必须让后续编码 Agent 能明确知道：为什么做、做什么、去哪找证据、改哪些模块、用哪些组件、如何验收、何时停止。

## 总流程

1. 建立证据底座：收集 PRD、MasterGo、原型、当前代码、企业组件库、API/权限/路由/状态约束；所有仓库事实必须附 `Evidence(路径+锚点/片段)`。
2. 归一需求语言：把产品目标、页面流程、字段、状态、权限、异常、边界条件统一成 SDD 的 Spec/Plan/Tasks。
3. 做代码和组件库映射：优先使用 Codegraph MCP 分析项目结构、符号、调用关系和影响面；需要视觉或线上页面时优先使用 Chrome DevTools MCP。
4. 产出设计书：按固定文件链路和固定章节输出，明确 Agent、Skills、MCP、Prompt、实现任务、验收门禁和风险。
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
- 落地到目录时，必须生成完整文件链路：`README.md`、`facts.md`、`spec.md`、`code-reference.md`、`frontend-design.md`、`tasks.md`、`claude-code-task.md`、`ci-gate.md`、`agent-prompts.md`、`fact-set.yaml`。
- 必须区分事实、推断、建议：事实带 Evidence；推断标注 `Inference`；未知标注 `❌Unknown` 或 `TODO`。
- 必须输出 AI 执行任务包：每个任务含目标、输入、输出文件、依赖、验收、回滚/停止条件。
- 复杂项目必须拆分模块：总览设计 + 模块任务包 + 代码参考 + CI Gate；不得只输出单个超长 `frontend-design.md`。
- 必须保护测试资产：不得为了设计通过而删除关键断言、放宽门禁、扩大 exclusions。
- 必须执行输出前自检：每个模块是否包含范围、页面、路由、组件、状态、接口、权限、异常、测试、实现；所有未确认接口是否标 TODO；所有仓库事实是否有 Evidence；任务是否可独立验证。

## 快速执行

当用户给出“根据 PRD + MasterGo + 原型 + 当前代码 + 组件库产出前端设计书”类请求时：

1. 读取 `references/evidence-checklist.md`，列出已知输入与缺失输入。
2. 读取 `references/sdd-workflow.md`，按阶段收集证据并做冲突裁决。
3. 读取 `references/output-contract.md`，生成最终设计书或写入目标目录。
4. 若用户要求落地文件，优先生成：
   - `README.md`
   - `facts.md`
   - `spec.md`
   - `code-reference.md`
   - `frontend-design.md`
   - `tasks.md`
   - `claude-code-task.md`
   - `ci-gate.md`
   - `agent-prompts.md`
   - `fact-set.yaml`

## 模块拆分策略

大型前端项目必须按模块拆分，避免实现 Agent 一次读取过多上下文：

1. 先生成总览文件：`facts.md`、`spec.md`、`frontend-design.md`、`code-reference.md`、`ci-gate.md`。
2. 再生成模块任务：`tasks.md` 中每个任务是 0.5-2 小时可独立验证的最小交付单元，并用 `claude-code-task.md` 汇总可直接交给实现 Agent 的执行入口。
3. 若单个模块超过 10 个页面或 20 个任务，额外生成 `modules/{module-id}.md`；否则在 `frontend-design.md` 中按模块压缩描述。
4. 模块章节必须回答 10 个问题：范围、页面、路由、组件、状态、接口、权限、异常、测试、实现。
5. 不得用“建议/可以考虑”替代决策；证据不足时写 TODO 和推荐处理。

## 质量门禁

- 每个功能点必须能追溯到 PRD、UI/原型、代码或组件库证据之一。
- 每个页面/组件必须说明状态、权限、事件、请求、错误和空态。
- 每个实现任务必须小到单个 Agent 可独立执行和验证。
- 每个产物文件必须符合 `references/output-contract.md` 的模板和自检清单。
- 最终回复必须说明使用了哪些 skills、哪些 MCP、改了哪些文件。
