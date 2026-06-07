# FrontDesignAgent v2.3 蓝图

> 本文件是设计蓝图和背景材料，用于理解系统取舍；不作为执行规则源。执行规则以 `workflow.md` 为准，产物结构以各模板为准。

## 1. 设计目标

FrontDesignAgent 的目标不是生成“看起来完整”的前端设计文档，而是把 PRD、UI、原型、代码模式和接口契约整理成 AI 能直接落地代码的输入。

核心判断：

- 设计书不是文档，是代码蓝图。
- Workflow-first, Agent-inside：外层 workflow 固定阶段，内层 Agent 做分析和生成。
- 三轮链路固定：`module-split → module-design → implement`。
- `implement` 是约束最强的阶段，只能按 `编码任务.md` 的任务 ID 执行。

## 2. 为什么从 v1 演进到 v2.3

| v1 问题                                     | v2.3 取舍                                      |
| ------------------------------------------- | ---------------------------------------------- |
| 文档多且重叠，事实源漂移                    | 收敛为中文业务产物和单一事实源                 |
| 设计描述抽象，AI 写不出代码                 | 增加 `代码参考.md` 和可粘贴代码骨架            |
| 接口散落在多个文件                          | `接口契约.md` 成为接口契约唯一事实源           |
| 任务太大，无法直接执行                      | `编码任务.md` 控制到 2-5 分钟粒度              |
| PRD、UI、原型冲突没有承接点                 | 第一轮用模块切片和 `审查记录.md` 支持人工审查  |
| MasterGo 链接只被记录，缺少真实 UI Evidence | 检测到链接必须尝试 `mastergo-magic-mcp.getDsl` |
| ID 只能阅读不能跳转                         | 引用型稳定 ID 使用 Markdown 链接和显式锚点     |

## 3. 架构概览

```text
输入材料
  ├─ PRD / MasterGo / 原型 / 截图
  ├─ 模块索引.md + 模块文件夹
  └─ 编码任务.md
        ↓
mode_select
        ├─ module-split：生成 模块索引.md + 模块文件夹
        ├─ module-design：生成 5 份核心设计产物
        └─ implement：按 编码任务.md 执行代码改动
```

产物分工：

| 产物          | 职责                                                               |
| ------------- | ------------------------------------------------------------------ |
| `模块索引.md` | Manifest 单一入口源：模块 ID、路径、状态、接口 ID 索引和审查状态   |
| `需求说明.md` | 需求事实：模块、字段、权限、验收标准和澄清记录                     |
| `代码参考.md` | 代码模式：API 签名、真实范例、注意事项                             |
| `接口契约.md` | 接口契约总账：接口 ID、method、path、请求/响应、错误码、权限、状态 |
| `前端设计.md` | 模块实现方案：引用代码参考和接口 ID，给出文件与代码骨架            |
| `编码任务.md` | 实现 Agent 执行入口：任务 ID、依赖、验收断言、验证命令、停止条件   |

## 4. Agent 职责模型

这些 Agent 是职责划分，不要求实现为独立 runtime。

| Agent                  | 职责                                                  | 输出                     |
| ---------------------- | ----------------------------------------------------- | ------------------------ |
| InputCollectorAgent    | 收集 PRD、MasterGo、原型、截图、组件库、API、代码路径 | 输入清单、材料缺口       |
| RequirementStructAgent | 将模块需求整理成结构化需求事实                        | `需求说明.md`            |
| CodeReferenceAgent     | 用 Codegraph 提取项目级代码模式                       | `代码参考.md`            |
| ApiContractAgent       | 维护根级接口契约总账                                  | `接口契约.md`            |
| PrototypeFactAgent     | 从 MasterGo/原型提取 UI 和交互事实                    | `界面.md` 或设计布局章节 |
| DesignDocAgent         | 生成模块实现方案                                      | `前端设计.md`            |
| TaskAgent              | 生成代码级任务包                                      | `编码任务.md`            |

## 5. MCP 设计取舍

| 场景                   | 首选 MCP                    | 降级方式                                        |
| ---------------------- | --------------------------- | ----------------------------------------------- |
| 代码结构、符号、调用链 | Codegraph MCP               | 只读 RTK 命令，标记 Fallback                    |
| PRD/原型/组件库文档    | Chrome DevTools MCP         | 用户导出文件、截图或 Markdown                   |
| MasterGo 图层          | `mastergo-magic-mcp.getDsl` | 用户导出 DSL 或截图，标记 Fallback / Unverified |

Codegraph 是 `代码参考.md` 的主要证据来源；MasterGo DSL 成功后才是 Verified UI Evidence。

## 6. 关键风险

| 风险                                   | 处理原则                                                      |
| -------------------------------------- | ------------------------------------------------------------- |
| 模式判断不清                           | 先询问用户选择 `module-split` / `module-design` / `implement` |
| `module-split` 过早设计                | 停止生成设计书，只输出模块切片和审查项                        |
| 接口 Draft 被用于真实联调              | 停止任务，要求接口状态推进到 Confirmed                        |
| Manifest 过重                          | Manifest 只保留身份、路径、状态和索引，不复制事实详情         |
| ID 引用不可追踪                         | 定义处提供显式锚点，引用处使用 Markdown 链接                 |
| `frontDesignAgent.md` 与 workflow 冲突 | 以 `workflow.md` 为准，本文件只保留设计背景                   |
| 任务越界实现                           | `implement` 只按 `编码任务.md` 的任务 ID 执行                 |

## 7. 与方法论的关系

| 来源        | 引入能力                               |
| ----------- | -------------------------------------- |
| Spec Kit    | clarify、analyze、规格驱动、任务前置   |
| Superpowers | 任务粒度、分段呈现、证据优先、验证闭环 |

这些方法论只提供原则。实际执行顺序、产物规则和停止条件以 `workflow.md` 为准。
