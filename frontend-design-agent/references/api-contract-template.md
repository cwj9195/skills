# api-contract.md 模板（v2.3 默认产物）

| 项目                 | 内容                                                 |
| -------------------- | ---------------------------------------------------- |
| 契约名称             | TODO                                                 |
| 所属设计根目录       | [apps/{app}/docs/design/](apps/{app}/docs/design/)                              |
| sources模块索引         | [module-index.md](module-index.md)                                        |
| 当前更新模块         | [M{N}-{模块名}](module-index.md#M{N})                                  |
| 模块设计目录默认引用 | [M{N}-{模块名}/design/](M{N}-{模块名}/design/) 内使用 [../../api-contract.md](../../api-contract.md) |
| 状态                 | [ ] Draft [ ] Reviewed [ ] Confirmed [ ] Changed     |
| 生成时间             | TODO                                                 |

> **定位**：本文档是接口契约唯一事实源。[requirements-detail.md](M{N}-{模块名}/design/requirements-detail.md) 只写接口需求摘要，[frontend-design.md](M{N}-{模块名}/design/frontend-design.md) 和 [implementation-tasks.md](M{N}-{模块名}/design/implementation-tasks.md) 只引用接口 ID，不复制完整请求/响应结构。[module-index.md](module-index.md) 只允许索引接口 ID，不得复制 method/path/请求响应结构。

## 1. 状态定义

| 状态        | 含义                                 | 可进入实现         |
| ----------- | ------------------------------------ | ------------------ |
| `Draft`     | 前端根据 PRD/UI/原型推导，未人工确认 | 否                 |
| `Reviewed`  | 产品/前端已审查，后端未确认          | 仅 Mock 或本地骨架 |
| `Confirmed` | 后端/联调方已确认，可用于真实联调    | 是                 |
| `Changed`   | 已确认后发生变更，必须记录变更原因   | 视变更确认结果     |

## 2. 模块接口覆盖记录

| 模块 | 是否有新增/变更接口 | 覆盖说明                                   | 状态                                   | 证据                 |
| ---- | ------------------- | ------------------------------------------ | -------------------------------------- | -------------------- |
| M{N} | 是/否               | 无新增/变更接口 / 见接口总览 [API-M{N}-TODO](#api-m{N}-todo) | Draft / Reviewed / Confirmed / Changed | Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx) |

## 3. 接口总览

| 接口 ID       | 模块 | 场景 | Method              | Path                             | 状态                                   | 权限 | 证据 | 原文摘要 |
| ------------- | ---- | ---- | ------------------- | -------------------------------- | -------------------------------------- | ---- | ---- | -------- |
| [API-M{N}-TODO](#api-m{N}-todo) | M{N} | TODO | GET/POST/PUT/DELETE | `/TODO` / Proposed path: `/TODO` | Draft / Reviewed / Confirmed / Changed | TODO | Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx) | TODO / Inferred |

## 4. 接口详情

<a id="api-m{N}-todo"></a>
### API-M{N}-TODO：TODO

| 项目     | 内容                                                                      |
| -------- | ------------------------------------------------------------------------- |
| 模块     | M{N}                                                                      |
| 场景     | TODO                                                                      |
| Method   | TODO                                                                      |
| Path     | TODO / Proposed path: TODO                                                |
| 权限     | TODO                                                                      |
| 状态     | Draft / Reviewed / Confirmed / Changed                                    |
| 证据 | Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx) |
| 原文摘要 | TODO / Clarify(round:question) / API(doc:section) / Inferred |

#### 请求参数

| 字段 | 类型 | 必填  | 说明 | 证据 |
| ---- | ---- | ----- | ---- | -------- |
| TODO | TODO | 是/否 | TODO | Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx) |

#### 响应结构

| 字段 | 类型 | 说明 | 证据 |
| ---- | ---- | ---- | -------- |
| TODO | TODO | TODO | Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx) |

#### 错误码与异常

| 错误码/场景 | 前端处理 | 证据 |
| ----------- | -------- | -------- |
| TODO        | TODO     | Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx) |

#### 变更记录

| 时间 | 状态变化                               | 变更原因 | 确认人/sources |
| ---- | -------------------------------------- | -------- | ----------- |
| TODO | Draft → Reviewed / Confirmed / Changed | TODO     | TODO        |

## 5. 人工审查清单

- [ ] 每个接口都有稳定接口 ID。
- [ ] 每个接口都有 method、path、请求参数、响应结构、错误码、权限和状态。
- [ ] “无新增/变更接口”只出现在模块接口覆盖记录，不进入接口总览。
- [ ] Draft 接口如使用 Proposed path，已标记 Inferred / 待确认。
- [ ] `Draft` 接口未进入真实联调任务。
- [ ] [frontend-design.md](M{N}-{模块名}/design/frontend-design.md) 和 [implementation-tasks.md](M{N}-{模块名}/design/implementation-tasks.md) 只引用接口 ID。
- [ ] Source ID 引用必须指向 [module-index.md](module-index.md) 的 Source Registry，例如 `[PRD-001](module-index.md#source-prd-001)`。
- [ ] 已确认接口发生变化时，状态标记为 `Changed` 并补充变更记录。
