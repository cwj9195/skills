# Front Design Agent v2 工作流

## 0. Workflow-first 定位

本文件是三轮链路的唯一执行规则源，不是纯 Agent 自由规划。

- 外层 Workflow 固定阶段、输入、产物和停止条件。
- 内层 Agent 负责信息提取、冲突判断、代码模式归纳、接口推导、任务拆解和代码生成。
- `mode_select` 是 workflow 路由，不是新增业务模式。
- `module-split`、`module-design`、`implement` 是 workflow 主阶段。
- `clarify`、`evidence`、`code_ref`、`api_contract`、`design`、`analyze`、`task`、`verify` 是阶段内子流程。
- 证据不足、路径冲突、接口状态不满足时进入 `repair / clarify`，不得强行产出。

### 规则归属表

| 规则类型                                               | 唯一维护位置                   | 说明                                   |
| ------------------------------------------------------ | ------------------------------ | -------------------------------------- |
| 入口路由、硬约束摘要、reference 加载策略               | `SKILL.md`                     | 保持短，避免重复 workflow 细则         |
| 三轮状态机、阶段输入输出、停止条件、MCP 调用规则、门禁 | `workflow.md`                  | 本文件是执行规则主源                   |
| Manifest 字段与 Source Registry                        | `module-index-template.md`     | 不在 workflow 重复字段清单             |
| 第一轮模块文件                                          | `module-template.md`           | module-split 单文件结构，包含 UI Evidence、Prototype/Flow、Review Notes 与 Gate |
| 需求说明字段                                           | `requirements-template.md`     | 不在 workflow 重复章节模板             |
| 代码参考字段                                           | `code-reference-template.md`   | 不在 workflow 重复代码模式模板         |
| 接口契约字段和状态表                                   | `api-contract-template.md`     | 接口契约结构以模板为准                 |
| 前端设计章节                                           | `frontend-design-template.md`  | 设计产物结构以模板为准                 |
| 编码任务字段                                           | `claude-code-task-template.md` | 任务字段、任务粒度和验证输出以模板为准 |
| 设计理念、背景、取舍                                   | `frontDesignAgent.md`          | 只作蓝图/背景材料，不作为执行规则源    |

## 1. 状态机

| 状态           | 进入条件                                         | 行为                                                                        | 下一状态                                        |
| -------------- | ------------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------- |
| `initial`      | 收到 PRD、原型、MasterGo、模块目录或任务包需求   | 识别输入材料                                                                | `mode_select`                                   |
| `mode_select`  | 已识别输入材料                                   | 自动判断 `module-split` / `module-design` / `implement`；无法判断时询问用户 | `module_split` / `clarify` / `implement`        |
| `module_split` | 用户提供 PRD/UI/原型，且未指定模块目录或模块文件 | 拆分模块，生成 `module-index.md` 与模块文件夹，等待人工审查/补图                | `done` / `repair`                               |
| `clarify`      | 进入 `module-design` 且模块材料存在              | 检查当前模块边界、异常、权限、接口或 UI 冲突                                | `evidence`                                      |
| `evidence`     | 澄清完成或确认无需补问                           | 使用 MCP 采集 Evidence                                                      | `code_ref`                                      |
| `code_ref`     | Evidence 达标                                    | 用 Codegraph 提取项目级代码模式，生成 `code-reference.md`                         | `api_contract` / `repair`                       |
| `api_contract` | `module-design` 必经                             | 生成或更新根级 [api-contract.md](api-contract.md)                                                | `design` / `repair`                             |
| `design`       | 需求、代码参考、接口契约达标                     | 生成 `frontend-design.md`                                                          | `analyze`                                       |
| `analyze`      | `frontend-design.md` 已生成                             | 模拟实现、引用、代码骨架和任务可断言性自审                                  | `task` / `design` / `repair`                    |
| `task`         | 自审通过                                         | 生成 `implementation-tasks.md`                                                          | `verify`                                        |
| `verify`       | `implementation-tasks.md` 已生成                             | 检查任务粒度、路径、验证步骤、接口状态和 Manifest 引用                      | `done` / `task`                                 |
| `implement`    | 用户提供 `implementation-tasks.md` 或要求按任务写代码        | 只按任务 ID 执行代码改动，输出验证结果                                      | `done` / `repair`                               |
| `repair`       | Evidence 不足、自审不通过、验证失败或任务阻塞    | 列阻塞项和临时方案                                                          | `mode_select` / `clarify` / `evidence` / `task` |
| `done`         | 当前模式完成                                     | 交付当前模式产物                                                            | —                                               |

```text
initial → mode_select ┬→ module_split → done
                      ├→ clarify → evidence → code_ref → api_contract → design → analyze → task → verify → done
                      └→ implement → done
                                  ↑        ↑          ↑               ↑        ↑        ↑
                                  └──────── repair ←──┴───────────────┴────────┴────────┘
```

## 2. 模式选择

收到请求后先判断模式，并在回复开头声明当前模式、本轮产出和本轮不会做什么。

| 模式            | 自动进入条件                                               | 输出                                                                      | 禁止                                       |
| --------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| `module-split`  | 用户提供 PRD/UI/原型，且未指定模块目录或模块文件           | `module-index.md`、各模块 `module.md`   | 不生成 `api-contract.md`、设计书、任务包或代码 |
| `module-design` | 用户指定模块目录、模块文件，或明确要求针对某模块生成设计书 | `requirements-detail.md`、`code-reference.md`、`api-contract.md`、`frontend-design.md`、`implementation-tasks.md` | 不把完整 PRD 作为主要输入；不处理无关模块  |
| `implement`     | 用户提供 `implementation-tasks.md` 或要求按任务写代码                  | 代码改动、验证结果、Regression Check、Defensive Code                      | 不生成设计书；不回读完整 PRD；不改无关模块 |

无法判断时，先问用户选择：`module-split`、`module-design` 或 `implement`。

`module-design` 输入规则：优先读取目标模块的 `module.md` 作为 module-split 阶段事实源，并从其中的 Scope & Requirements、Fields & Permissions、UI Evidence、Prototype/Flow、API Hints、Review Notes 生成第二轮设计产物。历史 `requirements.md` / `ui.md` / `prototype.md` / `review-notes.md` 只在用户显式提供旧目录且缺少 `module.md` 时作为 legacy input 读取；不得要求或补生成这些文件。

命名与语言策略：

- 输出语言、章节标题和文件命名优先跟随用户明确要求；未指定时跟随输入材料和项目现有约定。
- 未来新生成产物默认使用英文 canonical filenames；当前 PIM 中文旧路径仅作为 legacy input 兼容，不自动迁移。
- 读取入口同时兼容 legacy 中文文件名和历史四文件模块材料；写入新产物时使用 canonical 英文文件名，不主动迁移旧产物。
- 稳定 ID 不本地化：`M{N}`、`API-Mx-xxx`、`T-Mx-xx` 必须保持机器可读。

## 3. `module-split` 模块拆分阶段

触发：用户提供 PRD、MasterGo UI、原型或截图，并希望先按业务模块拆分供人工审查。

输出：

```text
module-index.md
sources/
  PRD.md
  source-map.md（可选）
M1-{模块名}/
  module.md
  sources/
    mastergo/
      UI-M1-xxx.dsl.json（MasterGo DSL 成功获取后必落盘）
M2-{模块名}/
  module.md
  sources/
    mastergo/
      UI-M2-xxx.dsl.json（MasterGo DSL 成功获取后必落盘）
```

`module.md` 必须包含以下章节：模块元信息、需求/规则、字段与权限、UI Evidence、Prototype/Flow、API Hints、Review Notes、Gate。module-split 只维护这一个模块事实源，避免需求、UI、流程和审查结论在多个文件中分叉。

Legacy input fallback：读取时兼容 `模块索引.md`、`来源/`、`需求.md`、`界面.md`、`原型.md`、`审查记录.md`，也可读取历史 `requirements.md` / `ui.md` / `prototype.md` / `review-notes.md`，但新写入仍使用 canonical 英文路径和单一 `module.md`。

执行规则：

- 默认生成 [sources/PRD.md](sources/PRD.md) 作为生成时来源快照，只用于 Evidence 溯源，必须尽量保持原文，不在文件顶部插入说明，禁止作为二次编辑事实源。
- 当来源多于一个、PRD 来自网页、或需要记录网页降级信息时，生成 [sources/source-map.md](sources/source-map.md)；否则 Source Registry 可直接写入 [module-index.md](module-index.md)。
- [module-index.md](module-index.md) 必须维护 Source Registry，登记 Source ID、来源类型、原始地址或路径、快照路径、获取时间和可信度。
- [module-index.md](module-index.md) 是 Manifest，只维护模块身份、路径、状态和索引；字段结构见 [module-index-template.md](module-index-template.md)。
- 每个模块目录只生成 `module.md`。截图、DSL、原型素材路径必须写入 `module.md` 对应章节并使用 Markdown 链接，不得只写反引号路径作为唯一引用。
- 素材分类必须稳定：
  - PRD 正文与 [sources/PRD.md](sources/PRD.md) 是需求事实 Evidence。
  - PRD 内嵌图片是 fallback visual evidence，可登记在 `module.md` 的 UI Evidence 或 [sources/source-map.md](sources/source-map.md)，但不能替代 MasterGo DSL Verified Evidence。
  - MasterGo DSL / 组件规格 JSON 是 UI Verified Evidence；成功落盘后由 `module.md` 的 UI Evidence 摘要引用。
  - CoDesign、原型导出、流程截图是 Prototype Evidence；页面跳转、流程分支、交互意图写入 `module.md` 的 Prototype/Flow，不并入 UI Evidence。
- MasterGo DSL 成功获取后，完整响应必须保存到模块内 [sources/mastergo/](sources/mastergo/)；`module.md` 只写摘要、组件线索、token 线索和 DSL 文件链接。
- 只记录接口线索，例如列表查询、导入、导出、校验、提交；不得生成正式 [api-contract.md](api-contract.md)。
- 不提前确定 method/path/字段为已确认事实。
- PRD、UI、原型冲突写入 `module.md` 的 Review Notes，不得擅自裁决为事实。
- 没有 UI/原型证据时，模块仍可拆分，但必须在 `module.md` 标注暂无证据和待补充项。
- `module.md` 的 Review Notes 章节承担人工审查与补证清单，但不是最终事实源：
  - module-split 完成后，用户或后续 agent 应逐项处理本文件里的阻塞/待确认。
  - 能关闭的问题，回写“处理结论 + Evidence”，并同步更新 `module.md` 受影响章节。
  - 需要降级的问题，保留 Fallback / Unverified 原因和后续补证路径。
  - 进入 module-design 前，未关闭的问题必须转入 [requirements-detail.md](requirements-detail.md) 的澄清记录或阻塞项；不得静默忽略。
- 所有事实必须带 Evidence；模块级 Evidence 只能说明来源范围，需求、字段、权限、流程、UI/原型引用必须写条目级 Evidence。
- 禁止只写 `PRD(L417-818)`、`PRD参考: L457` 作为唯一证据。
- 条目级 Evidence 必须同时包含可点击的来源链接、快照行号链接和原文摘要。第一轮模块文件使用 `证据: Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)`；第二轮设计文件使用 `证据: Source: [PRD-001](../../module-index.md#source-prd-001)<br/>快照: [../../sources/PRD.md:Lx-Ly](../../sources/PRD.md#Lx)`。如果链接不可用，仍必须在 `证据` 中保留文本型路径和行号。
- 完成后停在人工审查/补图阶段，不自动进入 `module-design`。

网页 PRD 处理：

- 优先用 Chrome DevTools 读取网页内容并保存为 [sources/PRD.md](sources/PRD.md) 快照。
- 如果网页无法稳定导出 Markdown，必须在 Source Registry 记录原始 URL、章节名、获取时间、降级方式和可信度。
- 后续模块文件引用快照或 Source Registry，不直接依赖网页实时内容；网页 PRD 转 Markdown 后，行号以 [sources/PRD.md](sources/PRD.md) 快照为准。

MasterGo 规则：

- MasterGo 是 module-split 的 UI Evidence 输入，不应默认后置到 module-design。用户表达“拆分阶段必须拿 UI”时，MasterGo 获取失败即为当前阶段 Blocked。
- 执行任何模块产物写入前，必须做 MasterGo 工具可用性预检：确认当前工具列表中是否存在 `mcp__getComponentGenerator`、`mcp__getDsl`、`mcp__getMeta`、`mcp__getD2c`、`mcp__getComponentLink` 中至少一个。若 PRD 存在 MasterGo 链接而一个都不可用，停止生成 Split 完成态，输出 repair/Blocked：缺少 MasterGo MCP 工具，需启用 MCP、提供 DSL 导出或确认允许 Fallback。
- 检测到 MasterGo 链接时，必须先解析 `fileId`、`layer_id`、`source_layer_id` 和 `shortLink`；禁止把 `page_id` 当作 `layerId`。
- 有 `fileId + layerId` 时，优先调用 `mcp__getComponentGenerator`，`rootPath` 传入模块级 [sources/mastergo/](sources/mastergo/) 绝对路径。
- `mcp__getDsl` 仍可用于原始 DSL 或短链 DSL；如果返回内容可完整保存，可直接保存为 [sources/mastergo/UI-M{N}-xxx.dsl.json](sources/mastergo/UI-M{N}-xxx.dsl.json)。
- 若 `mcp__getDsl` 输出过大、上下文截断或无法完整落盘，必须继续尝试 `mcp__getComponentGenerator`；只有该路径也失败、超时或不可解析，才标记 Fallback / Unverified。
- 只有存在 `mastergo://getd2c/...` 或等价 D2C contentId 时，才调用 `mcp__getD2c`；D2C 结果能完整保存时，也必须包装成 canonical DSL JSON。
- 只有 DSL 或组件规格返回 `componentDocumentLinks` 时，才调用 `mcp__getComponentLink` 补组件文档；组件文档是辅助 Evidence，不能替代 DSL。
- `mcp__getComponentGenerator` 成功后，保留 [.mastergo/](sources/mastergo/.mastergo/) 下的 `component-workflow.md` 与组件规格 JSON，并将规格 JSON 包装或复制为 canonical [sources/mastergo/UI-M{N}-xxx.dsl.json](sources/mastergo/UI-M{N}-xxx.dsl.json)。
- 只有 canonical DSL JSON 可解析，且包含对应 `layerId` / `uiSourceId` 或能与 UI Source 明确映射，才能作为 Verified UI Evidence 写入 `module.md`。
- DSL 成功分支：在 `module.md` 的 UI Evidence 中写 DSL 文件链接、提取时间、结构摘要、主要组件、交互状态和关键 token；如 Review Notes 存在对应阻塞项，改为已解决或部分解决，并保留未成功图层的待补记录。
- DSL 失败分支：不写已落盘 / Verified；在 `module.md` 的 Review Notes 记录失败工具、失败原因、是否已重试 `mcp__getComponentGenerator`、重试时间、降级方式和待补材料，标记 Fallback / Unverified。
- `module.md` 禁止粘贴完整 DSL JSON；完整 DSL 只能以 [sources/mastergo/](sources/mastergo/) 文件链接作为原始 Evidence。
- `module.md` 表格内截图使用 `[截图](../sources/xxx.png)`，正文预览使用 `![截图说明](../sources/xxx.png)`。
- [frontend-design.md](frontend-design.md) 位于 [M{N}/design/](M{N}/design/) 时，如引用截图，使用 `[截图](../../sources/xxx.png)` 或 `![截图说明](../../sources/xxx.png)`。
- 所有 UI Source 引用必须可跳转：定义处提供 `<a id="ui-m{N}-001"></a>`，引用处使用 `[UI-M{N}-001](#ui-m{N}-001)`；生成实际模块时替换为 `ui-m2-001` 这类小写锚点，禁止裸写 `UI-M{N}-001` 作为唯一引用。


## 3.1 `module-split` 内容密度门禁（强制）

> 形状合规（锚点/Evidence/链接）由 §3 执行规则保证；内容密度由本门禁保证。**形状合规 ≠ 质量合格。** 全部模块文件完成后，必须逐模块通过本门禁，不达标进入 `repair` 回补，不得仅凭形状合规结束 module-split。

| 维度 | 量化标准 | 不达标处理 |
| ---- | -------- | ---------- |
| 需求密度 | 每模块 REQ ≥ 3 条；每条 Evidence 的 PRD 快照跨度 ≤ 50 行（大模块按 50 行粒度拆多条） | 合并或拆分 REQ |
| 字段覆盖 | 该模块 PRD 范围内全部"字段名/字段名称"表格行必须登记为 FIELD 条目；字段级契约可后置到 module-design，但字段集不可缺 | 回 PRD 补 FIELD |
| UI 证据 | 每个 UI Source 必须 Verified DSL 已落盘，或标注 Fallback/Unverified 并写明降级原因；禁止只写"待提取"而无理由 | 补 DSL 或写明降级原因 |
| 接口线索区分度 | 同类模块（如多个申请单）的 APIHINT 不得逐字雷同；共性提炼为跨模块规则 CR，模块内只写差异 | 提炼 CR |
| Review Notes 区分度 | 同类模块的阻塞项/待补不得复制粘贴；每模块至少 1 条本模块独有待确认 | 补模块独有待确认 |

完成 module-split 前逐模块自检：REQ ≥ 3 且跨度合规 / FIELD 覆盖该模块 PRD 全部字段行 / UI Source 全 Verified 或附 Fallback 理由 / APIHINT 与 Review Notes 与同类模块有区分。任一不达标的模块不得标记 Split 完成；连续无法回补进入 `repair` 并列阻塞项。多模块并行生成时，本门禁是各 agent 共享的统一标准，避免并行集体降级。
