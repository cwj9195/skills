---
name: frontend-design-agent
description: 'Use when Codex needs to turn PRD/specs, MasterGo layers, prototypes, existing code, or component-library evidence into frontend module splits, frontend API contracts, implementation-ready design docs, or code changes driven by implementation-tasks.md.'
---

# Front Design Agent v2

## 1. 定位

使用本 skill 时，目标是产出 AI 能直接执行的前端实现输入，而不是泛化说明文档。

本 skill 采用 **Workflow-first, Agent-inside**：

- 外层 workflow 固定三轮：`module-split -> module-design -> implement`。
- 阶段输入、产物、禁止事项、停止条件以 [references/workflow.md](references/workflow.md) 为唯一执行规则源。
- `SKILL.md` 只保留入口路由、reference 加载策略、工具顺序和不可违反摘要。
- 模板文件只负责产物结构和文件内自检；不要把模板字段复制回 `SKILL.md`。

## 2. 模式选择

收到请求后先判断模式，并在回复开头声明：

```text
我将使用 {mode} mode。
本轮会产出：{outputs}。
本轮不会做：{non_goals}。
```

| 模式 | 自动进入条件 | 本轮产出 | 本轮禁止 |
| --- | --- | --- | --- |
| `module-split` | 用户提供 PRD/UI/原型，且未指定模块目录或模块文件 | [module-index.md](module-index.md)、每个模块的 [module.md](module.md) | 不生成设计书、[api-contract.md](api-contract.md)、[code-reference.md](code-reference.md)、[implementation-tasks.md](implementation-tasks.md)；不写代码；不把未确认接口写成事实 |
| `module-design` | 用户指定模块目录、模块文件，或明确说“针对 Mx 生成设计书” | [requirements-detail.md](requirements-detail.md)、[code-reference.md](code-reference.md)、根级 [api-contract.md](api-contract.md)、[frontend-design.md](frontend-design.md)、[implementation-tasks.md](implementation-tasks.md) | 不读取完整 PRD 作为主要输入；不处理无关模块；不跳过 Codegraph 代码模式提取 |
| `implement` | 用户提供 [implementation-tasks.md](implementation-tasks.md) 或明确要求按任务写代码 | 按任务改代码、验证结果、改动文件、Regression Check、Defensive Code | 不生成设计书；不回读完整 PRD；不改无关模块 |

无法判断模式时，只问一句：

```text
请选择当前阶段：module-split（拆模块）、module-design（单模块设计）、implement（按任务写代码）。
```

## 3. 必读 reference

按模式读取 reference，不要一次性加载全部。所有细则以 reference 为准。

| 模式 | 必读 reference | 按需 reference |
| --- | --- | --- |
| `module-split` | [references/workflow.md](references/workflow.md)、[references/module-index-template.md](references/module-index-template.md)、[references/module-template.md](references/module-template.md) | 需要理解设计背景时读 [references/frontDesignAgent.md](references/frontDesignAgent.md)；legacy 四文件输入只读兼容，不作为新产物模板 |
| `module-design` | [references/workflow.md](references/workflow.md)、[references/requirements-template.md](references/requirements-template.md)、[references/code-reference-template.md](references/code-reference-template.md)、[references/api-contract-template.md](references/api-contract-template.md)、[references/frontend-design-template.md](references/frontend-design-template.md)、[references/claude-code-task-template.md](references/claude-code-task-template.md) | 需要理解设计背景时读 [references/frontDesignAgent.md](references/frontDesignAgent.md) |
| `implement` | [references/workflow.md](references/workflow.md)、[references/claude-code-task-template.md](references/claude-code-task-template.md) | 任务涉及接口时读 [references/api-contract-template.md](references/api-contract-template.md)；需要追溯方案时读对应设计产物 |

多模块强制路由：

- `module-split` / `module-design` 且目标模块数 >= 5，或单次产出 >= 10 个模块级文件时，必须读取 [workflows/module-split-parallel.md](workflows/module-split-parallel.md)。
- 该 playbook 负责 Workflow 并行的 `extract / verify / aggregate` 编排；有多 Agent 工具时用 sub-agent 承载，无法使用时按同阶段串行模拟并记录 Fallback。

## 4. 标准产物

`module-split` 只生成单文件模块产物：

```text
sources/
  PRD.md
  source-map.md（可选）
module-index.md
M{N}-{模块名}/
  module.md
  sources/
    mastergo/
      UI-M{N}-xxx.dsl.json（MasterGo DSL 成功获取后必落盘）
```

历史四文件模块材料只作为 legacy input 兼容读取；新运行的 `module-split` 不生成、不声明、不推荐拆分模块文件。

`module-design` 默认生成或更新：

```text
requirements-detail.md -> code-reference.md -> api-contract.md -> frontend-design.md -> implementation-tasks.md
```

事实边界：

- [sources/PRD.md](sources/PRD.md)：PRD 原文快照，只用于 Evidence 溯源，禁止作为二次编辑事实源。
- [module-index.md](module-index.md)：Manifest 单一入口源，只维护模块身份、路径、状态和索引。
- [module.md](module.md)：module-split 的模块事实源，按章节合并需求、字段、权限、UI Evidence、Prototype/Flow、API Hints、Review Notes 和 Gate。
- [sources/mastergo/*.dsl.json](sources/mastergo/*.dsl.json)：MasterGo / 组件规格原始证据，只落盘引用，不塞入 [module.md](module.md) 全文。
- [api-contract.md](api-contract.md)：前端工作流内的接口契约唯一事实源；团队层面接口定义单一源仍是 YApi。
- [implementation-tasks.md](implementation-tasks.md)：实现 Agent 唯一执行入口。

命名策略：

- 输出语言、章节标题、文件命名优先跟随用户明确要求；未指定时跟随输入材料和项目现有约定。
- 新生成产物默认使用英文 canonical filenames；legacy 中文文件名只读兼容，不主动迁移。
- 稳定 ID 不本地化：`M{N}`、`API-Mx-xxx`、`T-Mx-xx` 必须保持机器可读。

## 5. 工具顺序

| 场景 | 首选工具 | 降级规则 |
| --- | --- | --- |
| 代码结构、符号、引用、调用链、影响面 | Codegraph MCP | 未初始化时提示 `codegraph init`，再用只读 RTK 命令降级，并标记 Fallback |
| PRD 链接、原型链接、组件库文档 | Chrome DevTools MCP | 用户提供导出文件、截图或 Markdown |
| MasterGo 图层链接 | `mcp__getComponentGenerator` | `mcp__getDsl` / `mcp__getMeta` / `mcp__getD2c`（仅 D2C contentId）/ `mcp__getComponentLink`（仅组件文档链接）/ 用户导出 DSL 或截图 |
| Shell 命令 | RTK | 所有 shell 命令加 `rtk` 前缀 |

MasterGo 详细采集、落盘和降级规则见 [references/workflow.md](references/workflow.md)。

## 6. 不可违反摘要

- 不新增第四种模式。
- `module-split` 完成后停在人工审查/补图阶段，不自动进入 `module-design`。
- `module-split` 必须生成 [sources/PRD.md](sources/PRD.md) 来源快照，并在 [module-index.md](module-index.md) 维护 Source Registry。
- `module-split` 每模块只生成 1 个 [module.md](module.md)。历史四文件模块材料只读兼容，不作为新产物、不作为推荐输出。
- 所有设计结论必须有 Evidence；条目级 Evidence 必须同时包含 Source Registry 链接、快照行号链接和原文摘要。
- 引用型稳定 ID 必须可跳转；所有文件路径、代码位置、组件文档、sources URL、快照行号必须使用 Markdown 链接。
- MasterGo 链接必须解析并按 [references/workflow.md](references/workflow.md) 的工具矩阵尝试落盘；有 MasterGo 链接但当前环境没有任何 MasterGo MCP 工具时，必须在生成模块前进入 repair/Blocked，向用户说明无法满足“拆分阶段拿到 UI 信息”，不得静默产出 Split 完成态。
- 只有 canonical DSL JSON 可解析并映射到 UI Source 时才能标记 Verified；PRD 图片、截图和口头描述只能是 Fallback Evidence。
- `module-design` 必须生成或更新根级 [api-contract.md](api-contract.md)，并严格采用 [references/api-contract-template.md](references/api-contract-template.md)。
- 后端 OpenAPI/YApi/Markdown/接口表是 Backend Contract Evidence，不是 Frontend-Proposed 契约的前置条件；导入后必须做差异对齐。
- `frontend-design.md` 写完后必须执行 `/analyze` 自审；`implementation-tasks.md` 写完后必须执行 `/verify`。
- `implement` 只能按 [implementation-tasks.md](implementation-tasks.md) 的任务 ID 执行，不得用“实现某模块”替代任务 ID。
- 组件选择顺序：公司组件库 > 业务公共组件 > 当前模块内新组件。
- 默认不生成 `facts.md`、`tasks.md`、`ci-gate.md`、`agent-prompts.md`、`fact-set.yaml`；只有严格审计、真实 CI 修复、多 Agent 编排或脚本消费等明确场景才额外生成。

## 7. 实现模式输出

`implement` 完成后必须输出：

- 改动文件。
- 验证命令和结果。
- `Regression Check`：列出检查过的点击、回调、状态写入或请求链路。
- `Defensive Code`：列出新增的防御判断；没有则写“无”。

如果接口字段、path、状态、权限、路由或任务范围冲突，停止并输出阻塞项，不擅自扩大范围。
