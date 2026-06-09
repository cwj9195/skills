# api-contract.md 模板（v3.0 结构对齐 `成品库二期-接口定义.md`）

| 项目                 | 内容                                                 |
| -------------------- | ---------------------------------------------------- |
| 契约名称             | TODO                                                 |
| 所属设计根目录       | [apps/{app}/docs/design/](apps/{app}/docs/design/)                              |
| sources模块索引      | [module-index.md](module-index.md)                   |
| 当前更新模块         | [M{N}-{模块名}](module-index.md#M{N})                |
| 默认契约来源         | Frontend-Proposed                                    |
| 默认对齐状态         | NotCompared                                          |
| 生成时间             | TODO                                                 |
| 状态                 | [ ] Draft [ ] Reviewed [ ] Confirmed [ ] Changed     |

> **定位**：本文档是接口契约唯一事实源。[requirements-detail.md](M{N}-{模块名}/design/requirements-detail.md) 只写接口需求摘要，[frontend-design.md](M{N}-{模块名}/design/frontend-design.md) 和 [implementation-tasks.md](M{N}-{模块名}/design/implementation-tasks.md) 只引用接口 ID。本文档先维护 Frontend-Proposed API Contract；后端 OpenAPI/YApi/Markdown/接口表只作为 Backend Contract Evidence 导入，并通过差异表对齐。

---

## 0. 全局约定

### 0.1 命名规范

| 类型 | 规则 | 示例 |
| ---- | ---- | ---- |
| 接口 ID | `API-M{N}-xxx`，模块内连续编号 | `API-M2-001` |
| 请求模型 | `{Domain}{Action}Req` | `PreselectedImportRecordPageReq` |
| 非分页响应 data 模型 | `{Domain}{Action}Resp`，明确表示位于 `data` 节点 | `PreselectedImportUploadResp` |
| 分页 records 模型 | `{Domain}{Entity}Dto`，明确表示位于 `data.records[n]` | `PreselectedImportRecordDto` |
| 枚举 | `{Domain}{Field}Enum` | `ImportStatusEnum` |

### 0.2 统一普通响应 ApiRespResult\<T\>

非分页接口必须显式说明外层统一包装包含 `code/msg/data/success`，业务响应对象位于 `data`。

```json
{
  "code": "00000",
  "msg": "success",
  "data": {},
  "success": true
}
```

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| code | string | 是 | 业务响应码，成功示例为 `00000`。 |
| msg | string | 是 | 响应消息。 |
| data | T | 否 | 业务数据节点；非分页 Resp 模型字段均定义在该节点下。 |
| success | boolean | 是 | 请求是否成功。 |

### 0.3 统一分页响应 BasePageResult\<T\>

分页接口必须显式说明外层仍是 `ApiRespResult<BasePageResult<T>>`，分页信息位于 `data`，列表 DTO 位于 `data.records[n]`。

```json
{
  "code": "00000",
  "msg": "success",
  "data": {
    "current": 1,
    "pages": 1,
    "size": 50,
    "total": 0,
    "records": [],
    "sortRule": ""
  },
  "success": true
}
```

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| data.current | integer | 是 | 当前页。 |
| data.pages | integer | 是 | 总页数。 |
| data.size | integer | 是 | 每页记录数。 |
| data.total | integer | 是 | 总记录数。 |
| data.records | T[] | 是 | 分页列表；DTO 字段定义在 `data.records[n]`。 |
| data.sortRule | string | 否 | 排序规则。 |

---

## 1. 接口总览

| 模块 | 接口 | 方法 | 路径 |
| ---- | ---- | ---- | ---- |
| {模块名} | {接口名称} | GET/POST | `/{path}` |

---

## 2. {模块名}

> 模块级元数据：
>
> | 状态 | 契约来源 | 对齐状态 | 后端证据 | 证据 |
> | ---- | -------- | -------- | -------- | ---- |
> | Draft / Reviewed / Confirmed / Changed | Frontend-Proposed / Backend-Proposed / Aligned | NotCompared / Diff-Pending / Aligned | [OpenAPI/YApi/Markdown](TODO) / 无 | Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx) |

### 2.1 接口矩阵

| 接口 ID | 接口名称 | Method | Path | Request | Response | 类型 | 状态 |
| ------- | -------- | ------ | ---- | ------- | -------- | ---- | ---- |
| [API-M{N}-TODO](#api-m{N}-todo) | TODO | TODO | `/TODO` | `TODOReq` / Query / FormData | `ApiRespResult<TODOResp>` / `ApiRespResult<BasePageResult<TODODto>>` | 普通 / 分页 / 文件 | Draft / Reviewed / Confirmed / Changed |

---

<a id="api-m{N}-todo"></a>
### 2.2 API-M{N}-TODO：TODO

| 项 | 内容 |
| ---- | ---- |
| 路径 | `GET/POST /{path}` |
| 入参 | `TODOReq` |
| 出参 | `ApiRespResult<TODOResp>` / 分页 `TODODto` |

> 前端推导依据：需求: [REQ-M{N}-TODO](M{N}-{模块名}/design/requirements-detail.md#req-m{N}-todo) / UI: [UI-M{N}-TODO](M{N}-{模块名}/ui.md#ui-m{N}-todo) / 流程: [FLOW-M{N}-TODO](M{N}-{模块名}/design/requirements-detail.md#flow-m{N}-todo)
>
> 证据: Source: [PRD-001](module-index.md#source-prd-001)<br/>快照: [sources/PRD.md:Lx-Ly](sources/PRD.md#Lx)
>
> 原文摘要: TODO / Clarify(round:question) / Backend Contract Evidence / Inferred

#### `TODOReq`

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| TODO | TODO | 是/否 | TODO |

#### `TODOResp`

> 包裹在标准响应的 `data` 节点中返回（见 §0.2 `ApiRespResult<T>`）。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| TODO | TODO | TODO |

#### `TODODto`（分页场景使用）

> 位于 `BasePageResult<T>` 的 `data.records[n]`（见 §0.3）。

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| TODO | TODO | TODO |

#### `TODOEnum`

| 值 | 名称 | 前端展示 | 说明 |
| -- | ---- | -------- | ---- |
| TODO | TODO | TODO | TODO |

> 无新增枚举时写"无新增枚举"。

---

## N+1. 错误码

| 错误码 | 说明 |
| ------ | ---- |
| TODO | TODO |

---

## N+2. 前后端差异表

| 差异 ID | 类型 | Frontend-Proposed | Backend-Proposed | 影响 | 处理结论 | 状态 | 证据 |
| ------- | ---- | ----------------- | ---------------- | ---- | -------- | ---- | ---- |
| DIFF-M{N}-001 | method/path / request / response / enum/status / error code | TODO | TODO / 无 | TODO | 待确认 / 采用前端 / 采用后端 / 双方调整 | NotCompared / Diff-Pending / Aligned | Frontend: [API-M{N}-TODO](#api-m{N}-todo)<br/>Backend: [OpenAPI/YApi/Markdown](TODO) / 无 |

---

## N+3. 待评审确认点

- [ ] TODO

---

## N+4. 人工审查清单

- [ ] 每个接口都有稳定接口 ID。
- [ ] 每个接口都有 method、path、请求参数、响应结构、错误码和状态。
- [ ] §0 全局约定包含 `ApiRespResult<T>` 和 `BasePageResult<T>` 的完整 JSON 示例和字段表。
- [ ] 非分页接口出参标注 `ApiRespResult<TODOResp>`，响应数据表通过 blockquote 引用 §0.2。
- [ ] 分页接口出参标注 `ApiRespResult<BasePageResult<TODODto>>`，DTO 表通过 blockquote 引用 §0.3。
- [ ] 各接口响应不重复列出 `code/msg/data/success` 四个字段。
- [ ] 接口详情使用 `路径/入参/出参` 三行表，无冗长元数据表。
- [ ] 每个接口都有 Req、Resp/Dto、Enum；无枚举时写"无新增枚举"。
- [ ] 接口矩阵中 Response 字段显式标注完整类型（含 `ApiRespResult<>` 或 `BasePageResult<>`）。
- [ ] 禁止只写简短"响应结构: 字段/类型/说明"作为最终接口契约。
- [ ] 每个接口都有契约来源、对齐状态和前端推导依据。
- [ ] 无后端契约材料时，接口仍作为 Frontend-Proposed / Draft / NotCompared 生成。
- [ ] 有后端契约材料时，必须填写前后端差异表，不得直接覆盖 Frontend-Proposed 契约。
- [ ] "无新增/变更接口"只出现在模块接口覆盖记录，不进入接口总览。
- [ ] Draft 接口如使用 Proposed path，已标记 Inferred / 待确认。
- [ ] `Draft` 接口未进入真实联调任务。
- [ ] 真实联调前已完成差异处理，接口状态为 `Confirmed` 且对齐状态为 `Aligned`。
- [ ] [frontend-design.md](M{N}-{模块名}/design/frontend-design.md) 和 [implementation-tasks.md](M{N}-{模块名}/design/implementation-tasks.md) 只引用接口 ID。
- [ ] Source ID 引用必须指向 [module-index.md](module-index.md) 的 Source Registry，例如 `[PRD-001](module-index.md#source-prd-001)`。
- [ ] 已确认接口发生变化时，状态标记为 `Changed` 并补充变更记录。
