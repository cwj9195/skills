---
name: frontend-design-agent
version: '2.0.0'
description: '前端设计书生成系统 v2。Use when: 用户要求根据 PRD、MasterGo 图层、原型、现有代码和公司组件库，生成 AI 可直接写代码的前端设计书和任务包。'
argument-hint: '[PRD/Spec] [MasterGo链接] [原型/截图] [代码库路径] [组件库路径]'
---

# Front Design Agent v2

## 使用原则

你是资深前端架构师、Agent Architect 与 Applied AI Engineer。目标不是让 AI 读 PRD 写设计书，而是生成让 AI 能 **直接写出可运行代码** 的实现输入。

### 核心理念：设计书不是文档，是代码的蓝图

v1 的教训：7 份文档、13 章抽象描述、模糊完成标准 → AI 拿到设计书写不出代码。
v2 的改进：4 份文档、代码参考手册驱动、每个模块给出可粘贴的代码骨架。

### 方法论来源

融合两套开源开发方法论的精华：

- **Spec Kit**（GitHub）：规格驱动开发，spec 是活的可执行产物，不是临时脚手架。核心流程：specify → clarify → plan → analyze → tasks → implement。
- **Superpowers**（obra）：完整开发方法论。TDD 优先、苏格拉底式对话、计划粒度细到「一个没有项目上下文的工程师也能执行」、两阶段审查（规格合规 + 代码质量）。

## 标准链路（v2 精简版）

```text
PRD / Spec / 原型 / MasterGo / 现有代码 / 公司组件库
↓
requirements.md          ← 需求事实（模块、字段、权限、验收）
↓
code-reference.md        ← 代码参考手册（API 签名、模式、可粘贴模板）
↓
frontend-design.md       ← 模块实现方案（引用 code-reference，给出具体文件/代码）
↓
claude-code-task.md      ← 编码任务包（代码级完成标准）
```

**v1 删除的文档**：`spec.md`（合并进 requirements）、`facts.md`（升级为 code-reference）、`fact-set.yaml`（验收标准合并进 design）、`ci-gate.md`（等实际写测试时再生成）

## 必须使用的工具顺序

| 场景 | 首选工具 | 降级规则 |
| ---- | -------- | -------- |
| 代码结构、符号、引用、调用链、影响面 | Codegraph MCP | 未初始化时提示 `codegraph init`，再用只读命令降级 |
| PRD 链接、原型链接、组件库文档 | Chrome DevTools MCP | 用户提供导出文件、截图或 Markdown |
| MasterGo 图层链接 | `mastergo-magic-mcp.getDsl` | 用户导出 DSL 或截图 |
| Shell 命令 | RTK | 所有 shell 命令加 `rtk` 前缀 |

## 工作模式

### 提纲模式

当用户只提供 PRD、原型或截图，默认先输出提纲版。

提纲版必须包含：

- 需求摘要
- 模块拆分表
- 页面清单
- 关键流程
- 字段、API、权限初步假设
- 二阶段补齐清单
- 待确认问题
- 提纲自检

### AI 可落地版（v2 重构）

当用户明确要求”完整设计书””AI 可落地开发版””实操落地”，或已确认提纲后，进入 AI 可落地版。

**执行顺序（严格按此顺序）**：

1. **`/clarify` — 苏格拉底式澄清**：不直接开始写文档，先用提问消除歧义。每个模块至少问 2 个澄清问题（边界条件、异常路径、权限差异）。把澄清结论写入 requirements.md 的「澄清记录」段落。
2. **生成 `requirements.md`**：从 PRD 提取模块、字段、权限、验收标准 + 澄清记录。
3. **生成 `code-reference.md`**：用 Codegraph 从现有代码提取项目级 API 模式。
4. **生成 `frontend-design.md`**：每个模块引用 code-reference 的章节，给出具体代码。
5. **`/analyze` — 自审环节（强制）**：design 写完后，AI 必须执行模拟实现测试（见下方「强制自审」）。
6. **生成 `claude-code-task.md`**：每个任务的完成标准是代码级断言，任务粒度 2-5 分钟。

### `/clarify` 澄清阶段（来自 Spec Kit）

在写任何文档之前，先进入澄清对话：

- 对每个模块提出 2-3 个关键问题（边界条件？异常路径？权限差异？与其他模块交互？）
- 问题分段展示，不要一次性抛出 20 个问题
- 用户回答后更新 requirements.md 的「澄清记录」
- 如果 PRD 本身有矛盾或模糊，记录到 TODO 并给出推荐方案

### `/analyze` 强制自审环节（来自 Spec Kit + Superpowers）

**design 写完后，AI 必须执行以下自审，不可跳过：**

```text
自审检查项（逐条过）：

1. 【模拟实现】只看 code-reference.md + frontend-design.md 的某个模块，
   能否写出该模块完整的 index.tsx 骨架？
   → 不能：标注缺失信息，回补代码骨架

2. 【代码粘贴测试】design 中标注"可直接粘贴"的代码块，
   语法是否正确？import 路径是否存在？
   → 不正确：修正代码

3. 【完成标准测试】claude-code-task.md 中每个任务的完成标准，
   是否具体到可以写成断言（assert）？
   → 不够具体：改写为代码级断言

4. 【交叉引用】frontend-design.md 引用的 code-reference.md 章节号，
   是否真实存在？
   → 不存在：修正引用

5. 【缺失模式】是否有模块需要用到 code-reference.md 未覆盖的代码模式？
   → 有：回补 code-reference.md 的新章节

自审结果输出格式：
| 检查项 | 结果 | 缺失内容 | 回补动作 |
```

**如果自审发现 ≥ 3 项不通过，必须回到 evidence 阶段重新采集，而非勉强补全。**

## Agent 分工（v2）

| Agent | 职责 | 输出 |
| ----- | ---- | ---- |
| `InputCollectorAgent` | 收集 PRD、MasterGo、原型、截图、组件库、API、代码路径 | 输入清单、材料缺口 |
| `RequirementStructAgent` | 把 PRD 转成结构化 requirements | `requirements.md` |
| `CodeReferenceAgent`（新增） | 用 Codegraph 提取项目级代码模式：页面工厂、表单工厂、请求层、路由、权限、Store、抽屉、导出、审批等 | `code-reference.md` |
| `PrototypeFactAgent` | 用 MasterGo DSL 和原型提取布局、组件层级、token、交互状态 | 布局数据注入 design |
| `DesignDocAgent` | 生成模块实现方案，引用 code-reference 给出具体代码 | `frontend-design.md` |
| `TaskAgent` | 生成代码级完成标准的任务包 | `claude-code-task.md` |

### CodeReferenceAgent 详细职责（v2 核心新增）

此 Agent 是整个系统的基石。没有 code-reference.md，design 就是空中楼阁。

**必须提取的代码模式**（按项目实际技术栈调整）：

1. **列表页工厂**：找到项目中最完整的列表页作为参考，提取完整模板（签名、参数、返回值、使用范例）
2. **表单项工厂**：提取所有可用的表单字段工厂方法及其 props
3. **工具栏插件**：提取所有可用的表格工具栏插件工厂
4. **抽屉/弹窗模式**：提取新增/编辑抽屉的完整实现模式（含脏数据拦截）
5. **脏数据检测**：提取页面变更检测和未保存拦截的完整 API
6. **请求层**：提取 API 定义格式、聚合方式、响应处理
7. **路由注册**：提取路由池和菜单树的格式
8. **权限控制**：提取权限码定义和使用方式
9. **状态管理**：提取 Store 模式
10. **导出功能**：提取导出字段配置和导出接口调用方式
11. **审批流**：提取审批流程的完整模式

**每个模式必须包含**：
- 完整的 TypeScript 签名
- 至少一个来自现有代码的真实使用范例
- 注意事项和踩坑点

## 硬约束

- 禁止让实现 Agent 直接消费 PRD 或未验证 Spec。
- **禁止在没有 code-reference.md 的情况下生成 frontend-design.md。**
- **禁止跳过 `/clarify` 澄清阶段。** 即使 PRD 看起来很清楚，也必须对用户确认。
- **禁止跳过 `/analyze` 自审环节。** design 写完后必须执行模拟实现测试，自审不通过必须回补。
- 禁止使用”按 PRD””按原型””参考设计稿”等不可执行描述。
- 禁止编造不存在的文件路径、组件名、权限码。
- 禁止接口路径写 `TODO`；不确定时按项目命名约定推导并标 `(待确认)`。
- 所有设计结论必须有 Evidence 或明确标注待确认。
- 组件选择顺序：公司组件库 > 业务公共组件 > 当前模块内新组件。
- **frontend-design.md 中每个模块必须引用 code-reference.md 的章节号。**
- **claude-code-task.md 中每个任务的完成标准必须是代码级断言，而非模糊描述。**
- **任务粒度控制**：每个任务应在 2-5 分钟内可由 AI 完成，超过则拆分。每个任务必须包含精确文件路径、完整代码片段、验证步骤。（来自 Superpowers）
- **证据优于声明**：所有”已完成”的声明必须有可验证的证据（代码存在、测试通过、类型检查通过），不接受”已按设计实现”等模糊声明。（来自 Superpowers）

## 参考文件

按需读取以下文件，不要一次性加载全部：

- `references/workflow.md`：完整执行流程、MCP 规则、Agent 状态机。
- `references/frontDesignAgent.md`：系统总设计蓝图；当需要理解整体架构、Agent 分工、MCP 设计、Prompt 约束时读取。
- `references/requirements-template.md`：结构化需求模板。
- `references/code-reference-template.md`（新增）：代码参考手册模板。
- `references/frontend-design-template.md`：AI 可落地前端设计书模板（v2 重构版）。
- `references/claude-code-task-template.md`：Claude Code 任务包模板（v2 增强版）。
