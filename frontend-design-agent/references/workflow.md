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
| 第一轮 UI 素材字段                                      | `module-ui-template.md`        | 截图、MasterGo、DSL、原型素材引用以模板为准 |
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
| `module-split`  | 用户提供 PRD/UI/原型，且未指定模块目录或模块文件           | `module-index.md`、各模块 `requirements.md` / `ui.md` / `prototype.md` / [review-notes.md](review-notes.md)   | 不生成 `api-contract.md`、设计书、任务包或代码 |
| `module-design` | 用户指定模块目录、模块文件，或明确要求针对某模块生成设计书 | `requirements-detail.md`、`code-reference.md`、`api-contract.md`、`frontend-design.md`、`implementation-tasks.md` | 不把完整 PRD 作为主要输入；不处理无关模块  |
| `implement`     | 用户提供 `implementation-tasks.md` 或要求按任务写代码                  | 代码改动、验证结果、Regression Check、Defensive Code                      | 不生成设计书；不回读完整 PRD；不改无关模块 |

无法判断时，先问用户选择：`module-split`、`module-design` 或 `implement`。

命名与语言策略：

- 输出语言、章节标题和文件命名优先跟随用户明确要求；未指定时跟随输入材料和项目现有约定。
- 未来新生成产物默认使用英文 canonical filenames；当前 PIM 中文旧路径仅作为 legacy input 兼容，不自动迁移。
- 读取入口同时兼容 legacy 中文文件名；写入新产物时使用 canonical 英文文件名，不主动迁移旧产物。
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
  requirements.md
  ui.md
  prototype.md
  review-notes.md
  sources/
    mastergo/
      UI-M1-xxx.dsl.json（MasterGo DSL 成功获取后必落盘）
M2-{模块名}/
  requirements.md
  ui.md
  prototype.md
  review-notes.md
  sources/
    mastergo/
      UI-M2-xxx.dsl.json（MasterGo DSL 成功获取后必落盘）
```

Legacy input fallback：读取时兼容 `模块索引.md`、`来源/`、`需求.md`、`界面.md`、`原型.md`、`审查记录.md`，但新写入仍使用 canonical 英文路径。

执行规则：

- 默认生成 [sources/PRD.md](sources/PRD.md) 作为生成时来源快照，只用于 Evidence 溯源，必须尽量保持原文，不在文件顶部插入说明，禁止作为二次编辑事实源。
- 当来源多于一个、PRD 来自网页、或需要记录网页降级信息时，生成 [sources/source-map.md](sources/source-map.md)；否则 Source Registry 可直接写入 [module-index.md](module-index.md)。
- [module-index.md](module-index.md) 必须维护 Source Registry，登记 Source ID、来源类型、原始地址或路径、快照路径、获取时间和可信度。
- [module-index.md](module-index.md) 是 Manifest，只维护模块身份、路径、状态和索引；字段结构见 [module-index-template.md](module-index-template.md)。
- 每个模块目录包含 `requirements.md`、`ui.md`、`prototype.md`、[review-notes.md](review-notes.md)。
- [ui.md](ui.md) 字段结构见 `module-ui-template.md`；截图、DSL、原型素材路径必须使用 Markdown 链接，不得只写反引号路径作为唯一引用。
- MasterGo DSL 成功获取后，完整响应必须保存到模块内 [sources/mastergo/](sources/mastergo/)；[ui.md](ui.md) 只写摘要、组件线索、token 线索和 DSL 文件链接。
- 只记录接口线索，例如列表查询、导入、导出、校验、提交；不得生成正式 [api-contract.md](api-contract.md)。
- 不提前确定 method/path/字段为已确认事实。
- PRD、UI、原型冲突写入 [review-notes.md](review-notes.md)，不得擅自裁决为事实。
- 没有 UI/原型证据时，模块仍可拆分，但必须在对应文件标注暂无证据和待补充项。
- 所有事实必须带 Evidence；模块级 Evidence 只能说明来源范围，需求、字段、权限、流程、UI/原型引用必须写条目级 Evidence。
- 禁止只写 `PRD(L417-818)`、`PRD参考: L457` 作为唯一证据。
- 条目级 Evidence 必须同时包含可点击的来源链接、快照行号链接和原文摘要。第一轮模块文件使用 `证据: Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)`；第二轮设计文件使用 `证据: Source: [PRD-001](../../module-index.md#source-prd-001)<br/>快照: [../../sources/PRD.md:Lx-Ly](../../sources/PRD.md#Lx)`。如果链接不可用，仍必须在 `证据` 中保留文本型路径和行号。
- 完成后停在人工审查/补图阶段，不自动进入 `module-design`。

网页 PRD 处理：

- 优先用 Chrome DevTools 读取网页内容并保存为 [sources/PRD.md](sources/PRD.md) 快照。
- 如果网页无法稳定导出 Markdown，必须在 Source Registry 记录原始 URL、章节名、获取时间、降级方式和可信度。
- 后续模块文件引用快照或 Source Registry，不直接依赖网页实时内容；网页 PRD 转 Markdown 后，行号以 [sources/PRD.md](sources/PRD.md) 快照为准。

MasterGo 规则：

- 检测到 MasterGo 链接时，必须先解析 `fileId`、`layer_id`、`source_layer_id` 和 `shortLink`；禁止把 `page_id` 当作 `layerId`。
- 有 `fileId + layerId` 时，优先调用 `mcp__getComponentGenerator`，`rootPath` 传入模块级 [sources/mastergo/](sources/mastergo/) 绝对路径。
- `mcp__getDsl` 仍可用于原始 DSL 或短链 DSL；如果返回内容可完整保存，可直接保存为 [sources/mastergo/UI-M{N}-xxx.dsl.json](sources/mastergo/UI-M{N}-xxx.dsl.json)。
- 若 `mcp__getDsl` 输出过大、上下文截断或无法完整落盘，必须继续尝试 `mcp__getComponentGenerator`；只有该路径也失败、超时或不可解析，才标记 Fallback / Unverified。
- `mcp__getComponentGenerator` 成功后，保留 [.mastergo/](sources/mastergo/.mastergo/) 下的 `component-workflow.md` 与组件规格 JSON，并将规格 JSON 包装或复制为 canonical [sources/mastergo/UI-M{N}-xxx.dsl.json](sources/mastergo/UI-M{N}-xxx.dsl.json)。
- 只有 canonical DSL JSON 可解析，且包含对应 `layerId` / `uiSourceId` 或能与 UI Source 明确映射，才能作为 Verified UI Evidence 写入 [ui.md](ui.md)。
- DSL 成功分支：在 [ui.md](ui.md) 中写 DSL 文件链接、提取时间、结构摘要、主要组件、交互状态和关键 token；如 [review-notes.md](review-notes.md) 存在对应阻塞项，改为已解决或部分解决，并保留未成功图层的待补记录。
- DSL 失败分支：不写已落盘 / Verified；在 [review-notes.md](review-notes.md) 记录失败工具、失败原因、是否已重试 `mcp__getComponentGenerator`、重试时间、降级方式和待补材料，标记 Fallback / Unverified。
- [ui.md](ui.md) 禁止粘贴完整 DSL JSON；完整 DSL 只能以 [sources/mastergo/](sources/mastergo/) 文件链接作为原始 Evidence。
- [ui.md](ui.md) 表格内截图使用 `[截图](../sources/xxx.png)`，正文预览使用 `![截图说明](../sources/xxx.png)`。
- [frontend-design.md](frontend-design.md) 位于 [M{N}/design/](M{N}/design/) 时，如引用截图，使用 `[截图](../../sources/xxx.png)` 或 `![截图说明](../../sources/xxx.png)`。
- 所有 UI Source 引用必须可跳转：定义处提供 `<a id="ui-m{N}-001"></a>`，引用处使用 `[UI-M{N}-001](#ui-m{N}-001)`；生成实际模块时替换为 `ui-m2-001` 这类小写锚点，禁止裸写 `UI-M{N}-001` 作为唯一引用。

## 4. `module-design` 单模块设计阶段

触发：用户指定某个模块目录、模块文件，或提供 `module-index.md + M{N}` 要求生成设计书。

模块定位：

- 优先读取 [module-index.md#M{N}](module-index.md#M{N})，通过 Manifest 定位模块输入、设计输出目录和根级公共产物路径。
- [module-index.md](module-index.md) 中必须有 `<a id="M{N}"></a>` 稳定锚点和 `### M{N}: 模块名` 标题。
- 自动读取当前模块的 `requirements.md`、`ui.md`、`prototype.md`、[review-notes.md](review-notes.md)。
- 若 [ui.md](ui.md) 中存在已提取 / Verified 的 MasterGo UI Source，必须读取对应 [sources/mastergo/](sources/mastergo/) DSL JSON 或结构化提炼文件；只有摘要而无原始 DSL 文件时，必须记录阻塞，不得直接生成 UI 设计。
- 只有 Manifest 缺少模块、路径不可解析或输入文件缺失时，才向用户索要路径或补充材料。
- 不读取完整 PRD 作为主要输入，不处理其他模块。

执行顺序：

1. `clarify`：检查当前模块关键歧义；若无需补问，在 `requirements-detail.md` 的「澄清记录」写明依据。
2. `evidence`：采集 PRD/UI/原型/代码/组件库 Evidence。
3. `code_ref`：用 Codegraph 生成 `code-reference.md`。
4. `api_contract`：生成或更新根级 [api-contract.md](api-contract.md)，先产出 Frontend-Proposed API Contract；如已有后端契约材料，再导入为 Backend Contract Evidence 并做差异对齐。
5. `design`：生成 `frontend-design.md`，引用 `code-reference.md` 章节和接口 ID。
6. `analyze`：执行强制自审，不通过则回补。
7. `task`：生成 `implementation-tasks.md`。
8. `verify`：验证任务粒度、路径、接口状态、Manifest 引用和完成标准。

API 契约规则：

- [api-contract.md](api-contract.md) 位于设计根目录，例如 [apps/pim/docs/design/api-contract.md](apps/pim/docs/design/api-contract.md)。
- 单模块设计产物位于 `{module-dir}/design/` 时，默认相对引用为 [../../api-contract.md](../../api-contract.md)。
- 每次 `module-design` 都必须生成或更新 [api-contract.md](api-contract.md)；无新增/变更接口也要写入“模块接口覆盖记录”。
- 无后端 OpenAPI/YApi/Markdown/接口表时，仍必须从需求、UI 交互、字段和流程状态推导 Frontend-Proposed 契约；不得跳过接口设计。
- 后端 OpenAPI/YApi/Markdown/接口表出现时，只作为 Backend Contract Evidence 导入；必须先与 Frontend-Proposed 契约做 diff，不得直接覆盖。
- 对齐差异必须写入 [api-contract.md](api-contract.md) 的差异表；差异未解决时，对应接口不得进入 `Confirmed`。
- 接口总览只放真实接口 ID，不把“无新增/变更接口”当作接口行。
- 接口状态只能是 `Draft`、`Reviewed`、`Confirmed`、`Changed`；不新增状态值。
- Draft 接口允许使用 `Proposed path`，但必须标记 `Draft` / `Inferred` / `(待确认)`，契约来源为 `Frontend-Proposed`，对齐状态为 `NotCompared`。
- 真实联调必须 `Confirmed` 且对齐状态为 `Aligned`；Mock 或本地骨架至少 `Reviewed`；`Diff-Pending` 只能进入 Mock 或本地骨架。
- 多模块并行设计时，只允许更新当前模块 section、全局总览中当前模块对应行，以及当前模块相关差异表。
- `api-contract.md` 生成时必须严格按模板章节顺序输出：§0 全局约定 → §1 接口总览 → §2~§N 模块分节 → 错误码 → 差异表 → 待评审确认点 → 审查清单。
- 每个模块的接口详情必须使用 `路径/入参/出参` 三行表 + Req/Resp/Dto/Enum 字段表，不得使用冗长的元数据表。
- 响应类型必须在三行表的「出参」字段中显式标注 `ApiRespResult<XxxResp>` 或 `ApiRespResult<BasePageResult<XxxDto>>`。
- 新增模块时，在 §0 之后按编号新增模块节，同步更新 §1 总览表和差异表。

## 5. `implement` 按任务实现阶段

触发：用户提供 `implementation-tasks.md` 或明确要求按任务写代码。

任务入口发现顺序：

1. 用户显式提供的 [implementation-tasks.md](implementation-tasks.md) 或 legacy [编码任务.md](编码任务.md)。
2. [{模块目录}/design/implementation-tasks.md]({模块目录}/design/implementation-tasks.md)。
3. [{模块目录}/implementation-tasks.md]({模块目录}/implementation-tasks.md)。
4. Legacy fallback：[{模块目录}/设计/编码任务.md]({模块目录}/设计/编码任务.md)。
5. Legacy fallback：[{模块目录}/编码任务.md]({模块目录}/编码任务.md)。

执行规则：

- 用户必须指定本轮执行的任务 ID 或任务范围。
- 只按 `implementation-tasks.md` 执行；不要用“实现某模块”替代任务 ID。
- 必要时读取同目录 [frontend-design.md](frontend-design.md)、[code-reference.md](code-reference.md) 和任务引用的根级 [api-contract.md](api-contract.md)。
- 必要时通过 Source Manifest: [module-index.md#M{N}](module-index.md#M{N}) 回溯模块路径。
- 不回读完整 PRD，不处理无关模块，不做无关重构。
- 涉及真实联调的任务必须依赖 `Confirmed` 接口；仅做本地骨架或 Mock 时接口状态至少为 `Reviewed`。
- 接口字段、path、状态或已确认语义冲突时，停止并输出阻塞项。

完成后输出：

- 改动文件。
- 验证命令和结果。
- `Regression Check`：列出检查过的点击、回调、状态写入或请求链路。
- `Defensive Code`：列出新增防御；没有则写“无”。

## 6. 引用 ID 可跳转规则

所有“引用、证明、指向”的稳定 ID 必须用 Markdown 链接表现，定义处必须提供显式 HTML 锚点，不依赖 Markdown 自动锚点。生成实际产物时锚点统一小写，禁止使用大写锚点。

锚点命名统一小写，保留连字符：

| ID 类型 | 示例 ID | 锚点 | 同文件引用 | 跨文件引用示例 |
| ------- | ------- | ---- | ---------- | -------------- |
| UI Source | UI-M2-001 | `ui-m2-001` | `[UI-M2-001](#ui-m2-001)` | `[UI-M2-001](../ui.md#ui-m2-001)` |
| 需求 | REQ-M2-001 | `req-m2-001` | `[REQ-M2-001](#req-m2-001)` | `[REQ-M2-001](requirements-detail.md#req-m2-001)` |
| 业务规则 | RULE-M2-001 | `rule-m2-001` | `[RULE-M2-001](#rule-m2-001)` | `[RULE-M2-001](requirements-detail.md#rule-m2-001)` |
| 字段 | FIELD-M2-001 | `field-m2-001` | `[FIELD-M2-001](#field-m2-001)` | `[FIELD-M2-001](requirements-detail.md#field-m2-001)` |
| 权限 | PERM-M2-001 | `perm-m2-001` | `[PERM-M2-001](#perm-m2-001)` | `[PERM-M2-001](requirements-detail.md#perm-m2-001)` |
| 流程/状态 | FLOW-M2-001 | `flow-m2-001` | `[FLOW-M2-001](#flow-m2-001)` | `[FLOW-M2-001](requirements-detail.md#flow-m2-001)` |
| 接口线索 | APIHINT-M2-001 | `apihint-m2-001` | `[APIHINT-M2-001](#apihint-m2-001)` | `[APIHINT-M2-001](requirements.md#apihint-m2-001)` |
| 接口需求 | APIREQ-M2-001 | `apireq-m2-001` | `[APIREQ-M2-001](#apireq-m2-001)` | `[APIREQ-M2-001](requirements-detail.md#apireq-m2-001)` |
| 验收 | AC-M2-001 | `ac-m2-001` | `[AC-M2-001](#ac-m2-001)` | `[AC-M2-001](requirements-detail.md#ac-m2-001)` |
| 待确认问题 | Q-M2-1 | `q-m2-1` | `[Q-M2-1](#q-m2-1)` | `[Q-M2-1](requirements.md#q-m2-1)` |
| 接口 | API-M2-001 | `api-m2-001` | `[API-M2-001](#api-m2-001)` | `[API-M2-001](../../api-contract.md#api-m2-001)` |
| 任务 | T-M2-01 | `t-m2-01` | `[T-M2-01](#t-m2-01)` | `[T-M2-01](implementation-tasks.md#t-m2-01)` |
| 跨模块规则 | CR-1 | `cr-1` | `[CR-1](#cr-1)` | `[CR-1](../module-index.md#cr-1)` |
| 代码参考章节 | CODE-REF-1 | `code-ref-1` | `[CODE-REF-1](#code-ref-1)` | `[code-reference §1](code-reference.md#code-ref-1)` |
| Source | PRD-001 | `source-prd-001` | `[PRD-001](#source-prd-001)` | `[PRD-001](../module-index.md#source-prd-001)` |

允许裸写 ID 的唯一场景：该行就是 ID 的定义值，并且同一条记录或其详情段提供了对应锚点。作为引用值时必须写成链接。代码块、命令、字符串字面量和代码注释里的 ID 可以裸写，但代码块外必须提供对应 Markdown 链接。

## 7. MCP 与 Evidence

### Codegraph

用于代码结构、符号、引用、调用链、影响面和代码模式提取。优先顺序：

1. `codegraph_status`
2. `codegraph_files`
3. `codegraph_context`
4. `codegraph_explore`
5. `codegraph_impact`

若 Codegraph 未初始化，记录阻塞项并建议用户执行 `codegraph init`。如必须继续，降级为只读 RTK 命令，可信度标记 Fallback。

### Chrome DevTools

用于访问 PRD 链接、原型链接、内部组件库文档和登录态系统页面。无法访问时，要求用户提供导出文件、截图或 Markdown。

### MasterGo

检测到 MasterGo 链接时必须采集 MasterGo Evidence。优先顺序：

1. `mcp__getComponentGenerator`：有 `fileId + layerId` 时优先使用，负责本地落盘组件工作流和规格 JSON。
2. `mcp__getDsl`：用于原始 DSL 或短链 DSL；内容可完整保存时可直接成为 canonical DSL。
3. `mcp__getMeta`：用于站点/页面级结构和规则，只作辅助 Evidence。
4. `mcp__getD2c`：仅在存在 `mastergo://getd2c/...` contentId 或需要 D2C HTML/资源落盘时使用。
5. `mcp__getComponentLink`：仅在 DSL 返回 `componentDocumentLinks` 时补组件文档。

结果处理：

- canonical DSL 文件必须命名为 `UI-M{N}-xxx.dsl.json`，放在模块级 [sources/mastergo/](sources/mastergo/)。
- `mcp__getComponentGenerator` 的 [.mastergo/](sources/mastergo/.mastergo/) 原始产物必须保留，canonical 文件可包装其组件规格并补充 `source`、`fileId`、`layerId`、`uiSourceId`、`generatedAt` 等元信息。
- `mcp__getDsl` 输出过大或截断时，不得直接要求用户补材料，必须尝试 `mcp__getComponentGenerator`。
- 失败时记录失败工具、失败原因、重试情况、最终状态、降级方式和证据来源。

### Evidence 可信度

| 可信度       | 定义                                                     |
| ------------ | -------------------------------------------------------- |
| `Verified`   | 来自 Codegraph、MasterGo DSL、API 文档或明确 PRD 行      |
| `Clarified`  | 来自用户在 clarify 阶段的明确回答                        |
| `Inferred`   | 基于现有命名约定、相邻模块实现推导                       |
| `Fallback`   | Codegraph 或链接不可用时，用只读命令、截图或用户描述补充 |
| `Unverified` | 无可验证sources，必须进入 TODO                              |

Evidence 格式：

```md
证据: Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:L457-L463](../sources/PRD.md#L457)
原文摘要: 成品库列表结构，包含类目筛选器、字段筛选器、商品信息列表、导出入口。
```

正式产物中 `证据` 字段应同时链接到 Source Registry 和 PRD 快照：第一轮模块文件使用 `Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)`，第二轮设计文件使用 `Source: [PRD-001](../../module-index.md#source-prd-001)<br/>快照: [../../sources/PRD.md:Lx-Ly](../../sources/PRD.md#Lx)`，根级文件使用 `Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx)`。

模块级 Evidence 可以写 `PRD-001:L417-L818` 作为范围摘要，但不得替代条目级 Evidence。

## 8. 自审与门禁

### `analyze`

`frontend-design.md` 写完后必须执行 `/analyze`：

- 只看 [code-reference.md](code-reference.md) + [api-contract.md](api-contract.md) + [frontend-design.md](frontend-design.md)，能否写出目标模块骨架。
- 可粘贴代码块语法、import 路径和引用章节是否真实。
- 任务完成标准能否转成 assert。
- 是否有缺失代码模式需要回补 [code-reference.md](code-reference.md)。
- 链接合规检查：文件路径、代码位置、组件文档、sources URL、快照行号必须可点击；引用型 ID 必须可跳转；Evidence 必须同时包含 Source Registry 链接和快照行号链接。
- 任务是否可在 2-5 分钟内完成。

不通过时回补对应文件；连续无法回补时进入 `repair`。

### `verify`

`implementation-tasks.md` 写完后必须执行 `/verify`：

- 每个任务有任务 ID、依赖、精确文件路径链接、验证步骤、回归检查和停止条件。
- 每个任务粒度 2-5 分钟；超过 3 个文件或 100 行新增代码时拆分。
- 涉及接口的任务引用 [api-contract.md](api-contract.md) 中真实存在的接口 ID；无接口任务写“无”。
- Draft 不进入真实联调；Mock/本地骨架至少 Reviewed；真实联调必须 Confirmed。
- 模块设计目录默认可解析 [../../api-contract.md](../../api-contract.md)。
- [module-index.md#M{N}](module-index.md#M{N}) 中模块锚点、模块目录、输入文件、设计输出目录和根级 API 契约路径可解析。
- 链接合规检查：任务表中的目标文件、涉及文件、代码位置和sources文件必须使用 Markdown 链接；引用型 ID 必须可跳转；命令和代码块可保留反引号路径。

## 9. 分段呈现

不要一次性抛出超长文档。默认按模块、代码模式或任务清单分段呈现，让用户逐段确认。用户明确说“一次性输出”时可以跳过分段。
