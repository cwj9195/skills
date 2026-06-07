# module-index.md 模板（Manifest 单一入口源）

> **定位**：本文档是三轮链路的 Manifest 单一入口源，只维护模块身份、路径、状态和索引。详细需求、UI、原型、接口契约、代码模式、实现方案和任务明细分别由对应文件维护。

## 1. 设计根信息

| 项目               | 内容                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| 设计根目录         | [apps/{app}/docs/design/](apps/{app}/docs/design/)                                                 |
| 来源快照目录       | [sources/](sources/)                                                                 |
| 根级 API 契约      | [api-contract.md](api-contract.md)                                                           |
| PRD sources           | Source ID: [PRD-001](#source-prd-001)                                   |
| UI / MasterGo sources | TODO / 无                                                               |
| 原型sources           | TODO / 无                                                               |
| 生成时间           | TODO                                                                    |
| 总体状态           | Split / Reviewed / Designing / Designed / Implementing / Done / Blocked |
| 证据               | Source Registry                                                         |

## 2. Source Registry

> 来源快照只用于 Evidence 溯源，禁止作为二次编辑事实源。[sources/PRD.md](sources/PRD.md) 必须尽量保持原始内容，不在顶部插入说明，避免行号偏移。PRD 来自网页时，优先用 Chrome DevTools 保存为 [sources/PRD.md](sources/PRD.md)；无法稳定导出时，必须记录降级原因和可信度。若来源很多，可将本表同步拆到 [sources/source-map.md](sources/source-map.md)，但 [module-index.md](module-index.md) 必须保留摘要。

| Source ID | 来源类型 | 原始地址或路径 | 快照路径 | 获取时间 | 可信度 | 降级原因 | 说明 |
| --------- | -------- | -------------- | -------- | -------- | ------ | -------- | ---- |
| PRD-001   | 本地 PRD / 网页 PRD | TODO | [sources/PRD.md](sources/PRD.md) | TODO | Verified / Fallback / Unverified | 无 / TODO | TODO |
| UI-001    | MasterGo | TODO / 无 | 无 / [sources/MasterGo.md](sources/MasterGo.md) | TODO | Verified / Fallback / Unverified | 无 / TODO | `module-design` 阶段调用 getDsl |
| PROTO-001 | CoDesign / 原型 | TODO / 无 | TODO / 无 | TODO | Verified / Fallback / Unverified | 无 / TODO | TODO |

<a id="source-prd-001"></a>
### PRD-001

| 项目 | 内容 |
| ---- | ---- |
| Source ID | PRD-001 |
| 快照路径 | [sources/PRD.md](sources/PRD.md) |
| 说明 | TODO |

<a id="source-ui-001"></a>
### UI-001

| 项目 | 内容 |
| ---- | ---- |
| Source ID | UI-001 |
| 快照路径 | 无 / [sources/MasterGo.md](sources/MasterGo.md) |
| 说明 | `module-design` 阶段调用 getDsl |

<a id="source-proto-001"></a>
### PROTO-001

| 项目 | 内容 |
| ---- | ---- |
| Source ID | PROTO-001 |
| 快照路径 | TODO / 无 |
| 说明 | TODO |

### 2.1 [sources/source-map.md](sources/source-map.md) 模板

> 当来源多于一个、PRD 来自网页、或需要记录降级原因时生成。若生成本文件，内容必须与 Source Registry 的 Source ID 保持一致。

| Source ID | 来源类型 | 原始地址或路径 | 快照路径 | 获取时间 | 可信度 | 降级原因 | 备注 |
| --------- | -------- | -------------- | -------- | -------- | ------ | -------- | ---- |
| PRD-001   | 本地 PRD / 网页 PRD | TODO | [sources/PRD.md](sources/PRD.md) | TODO | Verified / Fallback / Unverified | 无 / TODO | [sources/PRD.md](sources/PRD.md) 不插入说明头 |

## 3. 模块 Manifest

| 模块 ID | 模块名称 | 模块目录             | 需求文件                    | 界面文件                    | 原型文件                    | 审查记录                        | 设计输出目录              | 模块状态                                                                | 人工审查状态                    | 接口 ID 索引       | 证据              |
| ------- | -------- | -------------------- | --------------------------- | --------------------------- | --------------------------- | ------------------------------- | ------------------------- | ----------------------------------------------------------------------- | ------------------------------- | ------------------ | ----------------- |
| M{N}    | TODO     | [M{N}-{模块名}/](M{N}-{模块名}/) | [requirements.md](M{N}-{模块名}/requirements.md) | [ui.md](M{N}-{模块名}/ui.md) | [prototype.md](M{N}-{模块名}/prototype.md) | [review-notes.md](M{N}-{模块名}/review-notes.md) | [design/](M{N}-{模块名}/design/) | Split / Reviewed / Designing / Designed / Implementing / Done / Blocked | 待审查 / 已审查 / 待补图 / 阻塞 | API-M{N}-TODO / 无 | PRD-001:Lx-Ly |

### 3.1 命名与语言策略

业务路径命名优先跟随用户明确要求；未指定时跟随项目现有约定。未来新生成产物默认使用英文 canonical filenames；当前 PIM 中文旧路径仅作为 legacy input 兼容，不自动迁移。不要主动查找、生成、迁移或写回旧英文产物名；如果用户显式提供旧英文文件路径，可作为普通输入读取。所有路径字段必须使用 Markdown 链接。

## 4. 模块锚点

> [requirements-detail.md](M{N}-{模块名}/design/requirements-detail.md)、[frontend-design.md](M{N}-{模块名}/design/frontend-design.md)、[implementation-tasks.md](M{N}-{模块名}/design/implementation-tasks.md) 顶部的 Source Manifest: [module-index.md#M{N}](module-index.md#M{N}) 指向本节对应模块锚点。每个模块必须使用 `<a id="M{N}"></a>` 提供稳定锚点，避免 Markdown 自动锚点在中文标题下不可解析。模块路径事实以“模块 Manifest”表为准，本节不复制完整需求、接口详情或任务明细。

<a id="M{N}"></a>
### M{N}: TODO

| 项目         | 内容                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| 模块 ID      | M{N}                                                                    |
| 当前目录     | 见模块 Manifest 表                                                      |
| 设计输出目录 | 见模块 Manifest 表                                                      |
| 接口 ID 索引 | API-M{N}-TODO / 无                                                      |
| 当前状态     | Split / Reviewed / Designing / Designed / Implementing / Done / Blocked |
| 证据         | [PRD-001](#source-prd-001):Lx-Ly                                        |

## 5. 跨模块规则与依赖

| ID   | 规则 / 依赖 | 影响模块 | 证据 |
| ---- | ----------- | -------- | -------- |
| CR-1 | TODO        | M{N}     | Source: [PRD-001](#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx)<br/>原文摘要: TODO |

<a id="cr-1"></a>
### CR-1 TODO

| 项目 | 内容 |
| ---- | ---- |
| 规则 ID | CR-1 |
| 影响模块 | M{N} |
| 证据 | Source: [PRD-001](#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx) |
| 原文摘要 | TODO |

## 6. 人工审查与补图记录

| 模块 ID | 类型                 | 问题 / 缺口 | 当前处理 | 是否阻塞 | 证据 |
| ------- | -------------------- | ----------- | -------- | -------- | -------- |
| M{N}    | 补图 / 冲突 / 待确认 | TODO        | TODO     | 是/否    | Source: [PRD-001](#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx)<br/>原文摘要: TODO |

## 7. 证据规则

- [ ] 模块级 Evidence 只作为范围摘要，例如 [PRD-001](#source-prd-001):L417-L818。
- [ ] 需求、字段、权限、流程、UI/原型引用必须有条目级 Evidence。
- [ ] 条目级 Evidence 使用 `证据` + `原文摘要`；`证据` 必须包含 Source Registry 链接和 PRD 快照行号链接。
- [ ] 第一轮模块文件推荐格式：`证据: Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:L457-L463](../sources/PRD.md#L457)` + `原文摘要: TODO`。
- [ ] 第二轮设计文件使用 `证据: Source: [PRD-001](../../module-index.md#source-prd-001)<br/>快照: [../../sources/PRD.md:L457-L463](../../sources/PRD.md#L457)`。
- [ ] 如果链接不可用，仍在 `证据` 中保留文本型路径和行号。
- [ ] 引用 Source ID 时使用 `[PRD-001](#source-prd-001)`、`[UI-001](#source-ui-001)` 这类可跳转链接；Source Registry 表中的定义值可以裸写。

## 8. Manifest 边界

- [ ] 只维护模块身份、路径、状态和索引。
- [ ] 不复制完整需求、完整 UI DSL、完整请求响应结构、代码骨架或任务明细。
- [ ] `M{N}` 作为稳定主键，目录名调整时只更新 Manifest 路径。
- [ ] 接口详情以根级 [api-contract.md](api-contract.md) 为唯一事实源，本文只索引接口 ID。
- [ ] 多模块并行时只更新当前模块行和当前模块 section，不重排全表。
- [ ] 跨模块规则、模块 ID、接口 ID 等被引用时必须使用 `[CR-1](#cr-1)`、`[M{N}](#M{N})`、`[API-M{N}-TODO](api-contract.md#api-m{N}-todo)` 这类可跳转链接。
