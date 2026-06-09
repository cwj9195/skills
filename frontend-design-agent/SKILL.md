---
name: frontend-design-agent
version: '2.3.5'
description: '前端设计书生成系统 v2。Use when: 用户要求根据 PRD、MasterGo 图层、原型、现有代码和公司组件库，拆分模块、设计前端 API 契约、生成 AI 可直接写代码的前端设计书和任务包，或按 `implementation-tasks.md` / legacy `编码任务.md` 落地代码。'
argument-hint: '[PRD/Spec] [MasterGo链接] [原型/截图] [代码库路径] [组件库路径]'
---

# Front Design Agent v2

## 1. 使用定位

你是资深前端架构师、Agent Architect 与 Applied AI Engineer。目标不是让 AI 读 PRD 写一份说明文档，而是生成让 AI 能 **直接写出可运行代码** 的实现输入。

本 skill 采用 **Workflow-first, Agent-inside**：

- 外层 Workflow 固定三轮：`module-split → module-design → implement`。
- 阶段输入、产物、禁止事项和停止条件固定。
- 阶段内由 Agent 做信息提取、冲突判断、代码模式归纳、接口推导和任务拆解。
- 能由规则确定的，不交给 Agent 自由决策。
- 证据不足、路径冲突、接口状态不满足时，进入 `repair / clarify`，不得强行产出。

## 2. 标准产物

`module-split` 生成前置 Manifest 和模块切片：

```text
sources/
  PRD.md
  source-map.md（可选）
module-index.md
M{N}-{模块名}/
  requirements.md
  ui.md
  prototype.md
  review-notes.md
  sources/
    mastergo/
      UI-M{N}-xxx.dsl.json（MasterGo DSL 成功获取后必落盘）
```

`module-design` 默认生成或更新 5 份核心设计产物：

```text
requirements-detail.md → code-reference.md → api-contract.md → frontend-design.md → implementation-tasks.md
```

核心事实边界：

- [sources/PRD.md](sources/PRD.md)：生成时的 PRD 来源快照，只用于 Evidence 溯源，必须尽量保持原文，不在文件顶部插入说明，禁止作为二次编辑事实源。
- [sources/source-map.md](sources/source-map.md)：可选来源登记表；当来源多于一个或 PRD 来自网页时生成。
- [module-index.md](module-index.md)：Manifest 单一入口源，只维护模块身份、路径、状态和索引。
- [requirements.md](requirements.md) / [requirements-detail.md](requirements-detail.md)：需求事实。
- [ui.md](ui.md)：UI 事实；只保存可读摘要、组件线索、token 线索和 DSL 文件链接，禁止粘贴完整 MasterGo DSL。
- [M{N}/sources/mastergo/](sources/mastergo/)：模块级 MasterGo DSL 原始响应目录；成功调用 `mcp__getDsl` 或 `mcp__getComponentGenerator` 后必须保存完整 JSON 响应，供审查和 `module-design` 读取。
- [prototype.md](prototype.md)：原型事实。
- [code-reference.md](code-reference.md)：代码模式事实源。
- [api-contract.md](api-contract.md)：接口契约唯一事实源；维护前端根据页面交互、字段、状态流和 PRD 先拟定的 Frontend-Proposed 契约，以及后端契约导入后的差异对齐结果。
- [frontend-design.md](frontend-design.md)：模块实现方案。
- [implementation-tasks.md](implementation-tasks.md)：实现 Agent 唯一执行入口。

输出语言、章节标题、文件命名优先跟随用户明确要求；未指定时跟随输入材料和项目现有约定。未来新生成产物默认使用英文 canonical filenames；当前 PIM 中文旧路径仅作为 legacy input 兼容，不自动迁移。稳定 ID 不本地化：`M{N}`、`API-Mx-xxx`、`T-Mx-xx` 必须保持机器可读。用户显式提供旧路径时，只能当普通输入读取。


Canonical filename mapping（legacy 中文名只读兼容）：

| Canonical | Legacy |
| --- | --- |
| [module-index.md](module-index.md) | 模块索引.md |
| [requirements.md](requirements.md) | 需求.md |
| [requirements-detail.md](requirements-detail.md) | 需求说明.md |
| [ui.md](ui.md) | 界面.md |
| [prototype.md](prototype.md) | 原型.md |
| [review-notes.md](review-notes.md) | 审查记录.md |
| [code-reference.md](code-reference.md) | 代码参考.md |
| [api-contract.md](api-contract.md) | 接口契约.md |
| [frontend-design.md](frontend-design.md) | 前端设计.md |
| [implementation-tasks.md](implementation-tasks.md) | 编码任务.md |
| [sources/](sources/) | 来源/ |
| [design/](design/) | 设计/ |

默认不生成 `facts.md`、`tasks.md`、`ci-gate.md`、`agent-prompts.md`、`fact-set.yaml`。只有严格审计、真实 CI 修复、多 Agent 编排或脚本消费等明确场景，才额外生成。

## 3. 模式选择

收到请求后先判断模式，并在回复开头声明当前模式、本轮产出和本轮不会做什么。

| 模式            | 自动进入条件                                             | 本轮产出                                                                    | 本轮禁止                                                                                    |
| --------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `module-split`  | 用户提供 PRD/UI/原型，且未指定模块目录或模块文件         | `module-index.md`、每个模块的 `requirements.md` / `ui.md` / `prototype.md` / `review-notes.md` | 不生成设计书、`api-contract.md`、`code-reference.md`、`implementation-tasks.md`；不写代码；不把未确认接口写成事实 |
| `module-design` | 用户指定模块目录、模块文件，或明确说“针对 Mx 生成设计书” | `requirements-detail.md`、`code-reference.md`、`api-contract.md`、`frontend-design.md`、`implementation-tasks.md`   | 不读取完整 PRD 作为主要输入；不处理无关模块；不跳过 Codegraph 代码模式提取                  |
| `implement`     | 用户提供 `implementation-tasks.md` 或明确要求按任务写代码            | 按任务改代码、验证结果、改动文件、Regression Check、Defensive Code          | 不生成设计书；不回读完整 PRD；不改无关模块                                                  |

无法判断模式时，先问一句：

```text
请选择当前阶段：module-split（拆模块）、module-design（单模块设计）、implement（按任务写代码）。
```

进入模式时使用：

```text
我将使用 {mode} mode。
本轮会产出：{outputs}。
本轮不会做：{non_goals}。
```

## 4. 按模式加载 reference

按需读取 reference，不要一次性加载全部。

| 模式            | 必读 reference                                                                                                                                                                                                                       | 按需 reference                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `module-split`  | `references/workflow.md`、`references/module-index-template.md`、`references/module-requirement-template.md`、`references/module-ui-template.md`                                                                                      | 需要理解设计背景时读 `references/frontDesignAgent.md`                                |
| `module-design` | `references/workflow.md`、`references/requirements-template.md`、`references/code-reference-template.md`、`references/api-contract-template.md`、`references/frontend-design-template.md`、`references/claude-code-task-template.md` | 需要理解设计背景时读 `references/frontDesignAgent.md`                                |
| `implement`     | `references/workflow.md`、`references/claude-code-task-template.md`                                                                                                                                                                  | 任务涉及接口时读 `references/api-contract-template.md`；需要追溯方案时读对应设计产物 |

规则归属：

- `SKILL.md` 只保留入口路由、硬约束和 reference 加载策略。
- `workflow.md` 是三轮 workflow 的唯一执行规则源。
- 模板只负责产物字段结构和文件内自检。
- `frontDesignAgent.md` 是蓝图/背景材料，不作为执行规则源。

## 5. 工具顺序

| 场景                                 | 首选工具                    | 降级规则                                                                |
| ------------------------------------ | --------------------------- | ----------------------------------------------------------------------- |
| 代码结构、符号、引用、调用链、影响面 | Codegraph MCP               | 未初始化时提示 `codegraph init`，再用只读 RTK 命令降级，并标记 Fallback |
| PRD 链接、原型链接、组件库文档       | Chrome DevTools MCP         | 用户提供导出文件、截图或 Markdown                                       |
| MasterGo 图层链接                    | `mcp__getComponentGenerator` | `mcp__getDsl` / `mcp__getMeta` / 用户导出 DSL 或截图，标记 Fallback |

### 5.1 MasterGo MCP 工具矩阵

| 工具 | 使用场景 | 结果处理 |
| ---- | -------- | -------- |
| `mcp__getComponentGenerator` | 有 `fileId + layerId` 的图层证据落盘，尤其是 `getDsl` 输出过大或上下文截断时 | 传入模块级 [sources/mastergo/](sources/mastergo/) 绝对路径；保留生成的 [.mastergo/](sources/mastergo/.mastergo/) 原始产物，并包装或复制为 `UI-M{N}-xxx.dsl.json` |
| `mcp__getDsl` | 获取原始 DSL、短链 DSL、组件层级和 token | 返回内容可完整保存时直接落盘；若输出过大、截断或无法完整落盘，必须改走 `mcp__getComponentGenerator` |
| `mcp__getMeta` | 获取站点/页面级结构、规则和页面说明 | 只作为辅助 Evidence，不替代 canonical DSL JSON |
| `mcp__getD2c` | 存在 `mastergo://getd2c/...` contentId，或需要 D2C HTML/资源落盘 | 保存到明确输出目录；D2C 产物不能替代 DSL Evidence |
| `mcp__getComponentLink` | `getDsl` 返回 `componentDocumentLinks` 时补充组件文档 | 作为组件文档 Evidence，写入组件线索或设计阶段引用 |
| `mcp__C2d` | 代码转设计同步 | 默认不用于 `module-split` / `module-design` Evidence 获取 |
| Shell 命令                           | RTK                         | 所有 shell 命令加 `rtk` 前缀                                            |

## 6. 不可违反的硬约束

- `module-split` 只做模块事实切片，完成后停在人工审查/补图阶段，不自动进入 `module-design`。
- `module-split` 必须生成 [sources/PRD.md](sources/PRD.md) 来源快照；快照必须尽量保持原文，不在顶部插入说明，来源元信息写入 Source Registry 或 [sources/source-map.md](sources/source-map.md)。PRD 来自网页时优先用 Chrome DevTools 读取并保存快照，无法稳定导出时在 Source Registry 记录 URL、章节、获取时间、降级原因和可信度。
- `module-index.md` 必须维护 Source Registry；模块级 Evidence 可记录来源范围，但不得替代条目级 Evidence。
- 禁止只写 `PRD(L417-818)`、`PRD参考: L457` 作为唯一证据；需求、字段、权限、流程、UI/原型引用必须包含可点击的来源链接、快照行号链接和原文摘要。推荐使用 `证据` + `原文摘要` 两列，不再拆成三列路径信息。
- `module-design` 默认生成或更新 5 份核心设计产物，且必须生成或更新根级 `api-contract.md`。
- `module-design` 必须根据页面交互、字段、状态流和 PRD 生成 Frontend-Proposed API Contract；不得因为缺少后端 OpenAPI/YApi/Markdown/接口表而跳过接口设计。
- `implement` 只能按 `implementation-tasks.md` 的任务 ID 执行；不要用“实现某模块”替代任务 ID。
- `implementation-tasks.md` 是实现 Agent 的唯一执行入口，任务粒度保持 2-5 分钟。
- `module-index.md` 只做 Manifest，不复制完整需求、UI DSL、接口详情、代码骨架或任务明细。
- `api-contract.md` 是接口契约唯一事实源；`requirements-detail.md`、`frontend-design.md`、`implementation-tasks.md` 只能引用接口 ID 或保留摘要。
- `api-contract.md` 必须严格采用以下章节结构，禁止自行发明平铺式布局：
  1. **§0 全局约定**：命名规范（接口 ID / Req / Resp / Dto / Enum 命名规则表）+ `ApiRespResult<T>` 普通响应完整 JSON 示例和字段表 + `BasePageResult<T>` 分页响应完整 JSON 示例和字段表。
  2. **§1 接口总览**：按模块分组的总表，字段为 `模块/接口/方法/路径`。
  3. **§2~§N 按模块分节**：每个模块一节（如 `## 2. 预选品导入`），模块内结构为：
     - 模块级元数据（状态、契约来源、对齐状态、后端证据、证据链接）。
     - 接口矩阵（`接口ID/接口名称/Method/Path/Request/Response/类型/状态`）。
     - 每个接口详情用 `路径/入参/出参` 三行表（参考 `成品库二期-接口定义.md` §2.1 风格），入参标注 Req 类名，出参标注 `ApiRespResult<XxxResp>` 或 `ApiRespResult<BasePageResult<XxxDto>>`。
     - `XxxReq` 请求参数表（字段/类型/必填/说明）。
     - `XxxResp` / `XxxDto` 响应数据表（字段/类型/说明），用 blockquote 引用 §0 外层结构，如 `> 位于 ApiRespResult<T> 的 data 节点` 或 `> 位于 BasePageResult<T> 的 data.records[n]`。
     - `XxxEnum` 枚举表（值/名称/前端展示/说明）；无枚举时写"无新增枚举"。
  4. **错误码**：全局错误码表（错误码/说明）。
  5. **前后端差异表**：全局差异汇总。
  6. **待评审确认点**：待确认问题列表。
  7. **人工审查清单**：自检 checklist。
- 禁止只写简短"响应结构: 字段/类型/说明"。§0 全局约定必须包含 `ApiRespResult<T>` 和 `BasePageResult<T>` 的完整 JSON 示例和字段表。各接口的响应通过 blockquote 引用 §0，不得在每个接口重复列出 `code/msg/data/success` 四个字段。
- 禁止每个接口前放置冗长元数据表（项目/内容 10+ 行）。模块级元数据（状态、契约来源、对齐状态、后端证据）放在模块节开头，接口级元数据（状态、契约来源、对齐状态、前端推导依据）放在接口矩阵行或三行表后。
- 其他设计文件（`requirements-detail.md`、`frontend-design.md`、`implementation-tasks.md`）仍只引用接口 ID、状态和摘要。
- 接口状态只能是 `Draft`、`Reviewed`、`Confirmed`、`Changed`。真实联调必须 `Confirmed`；本地骨架或 Mock 至少 `Reviewed`；`Draft` 不得作为真实联调任务的非阻塞前提。
- 不新增接口状态值；使用“契约来源”字段表达 `Frontend-Proposed` / `Backend-Proposed` / `Aligned`，使用“对齐状态”字段表达 `NotCompared` / `Diff-Pending` / `Aligned`。
- 后端 OpenAPI/YApi/Markdown/接口表是 Backend Contract Evidence，不是前端接口设计的前置条件；导入后必须与 Frontend-Proposed 契约做差异表，不得直接覆盖前端拟定契约。
- 有后端接口定义文档时，必须作为 Backend Contract Evidence 导入，并与 Frontend-Proposed 做 method/path/request/response/dto/enum 差异对齐；差异未解决时不得标记 `Confirmed`。
- 检测到 MasterGo 链接时，必须解析 `fileId`、`layer_id`、`source_layer_id` 和短链；有 `fileId + layerId` 时优先尝试 `mcp__getComponentGenerator`，不得只记录链接。
- `mcp__getDsl` 成功且完整响应可保存时，可直接保存为 Verified DSL；若返回过大、上下文截断或无法完整落盘，不得把截断归为用户阻塞，必须改走 `mcp__getComponentGenerator`。
- `mcp__getComponentGenerator` 成功后，必须保留 [.mastergo/](sources/mastergo/.mastergo/) 原始产物，并包装或复制为模块内 [sources/mastergo/UI-M{N}-xxx.dsl.json](sources/mastergo/UI-M{N}-xxx.dsl.json)。
- 只有 canonical DSL JSON 可解析，且包含对应 `layerId` / `uiSourceId` 或能与 UI Source 明确映射，才能作为 Verified UI Evidence；失败、超时、不可解析或未完整落盘时写入 [review-notes.md](review-notes.md)，标记 Fallback / Unverified。
- [ui.md](ui.md) 只写摘要和链接，禁止把完整 DSL JSON 粘贴进正文。
- `module-design` 生成 UI 设计前，必须读取对应 [sources/mastergo/](sources/mastergo/) DSL JSON 或结构化提炼文件；如果只有 [ui.md](ui.md) 摘要而无原始 DSL 文件，则不得把 UI Evidence 判定为足够设计输入，必须在 [review-notes.md](review-notes.md) 或澄清记录中标记阻塞。
- `ui.md` 中截图、DSL、原型素材路径必须使用 Markdown 链接；表格内用 `[截图](../sources/xxx.png)`，正文预览用 `![截图说明](../sources/xxx.png)`。禁止只写反引号路径作为唯一引用。
- 所有引用型稳定 ID 必须可跳转：引用处使用 `[ID](#anchor)` 或 `[ID](相对路径#anchor)`，定义处使用 `<a id="anchor"></a>`。生成实际产物时锚点必须统一小写，例如 `<a id="apihint-m2-001"></a>` 与 `[APIHINT-M2-001](#apihint-m2-001)`。禁止裸写 `UI-001`、`API-Mx-xxx`、`REQ-Mx-xxx`、`T-Mx-xx` 等作为唯一引用；表格里的定义值可裸写，但指向别处时必须写链接。
- **路径即链接**：所有文件路径、代码位置、组件文档、sources URL、快照行号等指向性内容，必须使用 `[显示文本](相对路径或URL)` 格式。禁止裸写反引号路径（如 `` `src/views/xxx.vue` ``）作为唯一引用；仅在代码块、命令行、字符串字面量和示例目录树中允许裸写路径。示例：`[src/views/ProductList.vue](src/views/ProductList.vue)` 而非 `` `src/views/ProductList.vue` ``。
- `module-design` 必须先做澄清检查；如果无需补问，要在 `requirements-detail.md` 的「澄清记录」写明依据。
- `frontend-design.md` 写完后必须执行 `/analyze` 自审；`implementation-tasks.md` 写完后必须执行 `/verify`。`/analyze` 与 `/verify` 必须检查链接合规：引用型 ID 可跳转、路径字段可点击、Evidence 同时包含 Source Registry 链接和快照行号链接。
- 所有设计结论必须有 Evidence；禁止编造不存在的文件路径、组件名、权限码、接口语义。
- 组件选择顺序：公司组件库 > 业务公共组件 > 当前模块内新组件。
- 不新增第四种模式；除 `module-split` 的来源快照外，不新增默认治理文件；不引入独立 workflow runtime，不把默认设计产物膨胀回 8-10 个。

## 7. 实现模式输出要求

`implement` 完成后必须输出：

- 改动文件。
- 验证命令和结果。
- `Regression Check`：列出检查过的点击、回调、状态写入或请求链路。
- `Defensive Code`：列出新增的防御判断；没有则写“无”。

如果接口字段、path、状态、权限、路由或任务范围冲突，停止并输出阻塞项，不擅自扩大范围。
