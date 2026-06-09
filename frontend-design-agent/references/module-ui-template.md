# ui.md 模板（module-split 第一轮）

> 本文件记录当前模块的 UI / 视觉 / 设计稿事实，用于人工审查和后续 `module-design`。MasterGo 链接必须优先尝试 `mcp__getComponentGenerator`，必要时补充 `mcp__getDsl` / `mcp__getMeta`；成功后完整 DSL 或组件规格必须保存到模块内 [sources/mastergo/](sources/mastergo/) 并在本文件链接引用。本文件只写可读摘要、组件线索、token 线索和 DSL 文件链接，不粘贴完整 DSL JSON；截图、DSL、原型素材路径必须使用 Markdown 链接，不得只写反引号路径作为唯一引用。

| 项目          | 内容                           |
| ------------- | ------------------------------ |
| 模块 ID       | M{N}                           |
| 模块名称      | TODO                           |
| Source Manifest | [../module-index.md#M{N}](../module-index.md#M{N})          |
| 生成时间      | TODO                           |
| 状态          | Split / Reviewed / Blocked     |

## 1. UI Source 清单

| UI Source ID | 页面/状态名称 | MasterGo 链接 | 截图 | DSL 状态 | DSL 文件 | 证据 | 原文摘要 |
| ------------ | ------------- | ------------- | ---- | -------- | -------- | -------- | -------- |
| UI-M{N}-001 | TODO | [MasterGo](TODO) / 无 | [截图](../sources/TODO.png) / 无 | 待提取 / 已落盘 / 超时 / 失败 / Unverified / Verified | [DSL JSON](sources/mastergo/UI-M{N}-001.dsl.json) / 无 | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx) | TODO |

## 2. UI Source 详情锚点

> 每个 UI Source 定义处必须提供稳定锚点。其他表格或正文引用该 UI Source 时，必须写成 `[UI-M{N}-001](#ui-m{N}-001)`，不得裸写 ID 作为唯一引用。

<a id="ui-m{N}-001"></a>
### UI-M{N}-001 TODO

| 项目 | 内容 |
| ---- | ---- |
| UI Source ID | UI-M{N}-001 |
| 页面/状态名称 | TODO |
| MasterGo 链接 | [MasterGo](TODO) / 无 |
| 截图 | [截图](../sources/TODO.png) / 无 |
| DSL 状态 | 待提取 / 已落盘 / 超时 / 失败 / Unverified / Verified |
| DSL 文件 | [DSL JSON](sources/mastergo/UI-M{N}-001.dsl.json) / 无 |
| DSL 摘要 | TODO：根节点、页面尺寸、主要区域、关键状态；摘要不能替代原始 DSL Evidence。 |
| 主要组件 | TODO |
| 关键 token | TODO |
| 证据 | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx) |
| 原文摘要 | TODO |

## 3. UI 结构与组件

| UI Source ID | 区域 | 组件/元素 | 交互状态 | 证据 |
| ------------ | ---- | --------- | -------- | -------- |
| [UI-M{N}-001](#ui-m{N}-001) | TODO | TODO | 默认 / hover / disabled / loading / error / empty | [PRD-001:Lx-Ly](../sources/PRD.md#Lx) / [UI-M{N}-001](#ui-m{N}-001) |

## 4. 截图预览（可选）

> 表格里默认使用 `[截图](../sources/xxx.png)`，避免图片撑爆表格；需要视觉核对时，在本节用图片语法展开。

### UI-M{N}-001 TODO

![UI-M{N}-001 TODO](../sources/TODO.png)

## 5. MasterGo DSL 记录

| UI Source ID | DSL 获取状态 | DSL 文件 | 提取时间 | 结构摘要 | 组件文档线索 | 降级方式 | 证据 |
| ------------ | ------------ | -------- | -------- | -------- | ------------ | -------- | -------- |
| [UI-M{N}-001](#ui-m{N}-001) | 待提取 / 已落盘 / 超时 / 失败 / Unverified / Verified | [DSL JSON](sources/mastergo/UI-M{N}-001.dsl.json) / 无 | TODO | TODO | TODO | 无 / 用户截图 / 用户导出 DSL | [MasterGo](TODO) / Fallback |

### 5.1 getComponentGenerator 成功落盘示例

| 项目 | 示例 |
| ---- | ---- |
| 原始产物 | [sources/mastergo/.mastergo/组件名.json](sources/mastergo/.mastergo/组件名.json) |
| canonical DSL | [sources/mastergo/UI-M{N}-001.dsl.json](sources/mastergo/UI-M{N}-001.dsl.json) |
| DSL 状态 | 已落盘 / Verified |
| 说明 | canonical 文件可包装 `mcp__getComponentGenerator` 规格 JSON，并补充 `source`、`fileId`、`layerId`、`uiSourceId`、`generatedAt` 等元信息。 |

## 6. 素材与 ID 链接规范

- [ ] 表格内截图路径使用 `[截图](../sources/xxx.png)`。
- [ ] 正文预览图使用 `![截图说明](../sources/xxx.png)`。
- [ ] 禁止只写 `` `../sources/xxx.png` `` 作为唯一引用。
- [ ] 第一轮 [M{N}/ui.md](ui.md) 使用 [../sources/xxx](../sources/xxx)。
- [ ] 第二轮 [M{N}/design/frontend-design.md](design/frontend-design.md) 若引用截图，使用 [../../sources/xxx](../../sources/xxx)。
- [ ] 每个 UI Source 必须包含 UI Source ID、页面/状态名称、MasterGo 链接、截图链接、DSL 状态、DSL 文件链接、证据和原文摘要。
- [ ] MasterGo DSL 成功获取时，必须存在对应 [sources/mastergo/UI-M{N}-001.dsl.json](sources/mastergo/UI-M{N}-001.dsl.json) 原始 JSON；摘要不能替代原始 Evidence。
- [ ] [ui.md](ui.md) 只写 DSL 摘要、主要组件、交互状态、关键 token 和文件链接，禁止粘贴完整 DSL JSON。
- [ ] 每个 UI Source 定义处必须有 `<a id="ui-m{N}-001"></a>` 形式的稳定锚点，生成实际模块时替换为 `ui-m2-001` 这类小写锚点。
- [ ] 引用 UI Source 时必须写 `[UI-M{N}-001](#ui-m{N}-001)`，禁止裸写 `UI-M{N}-001` 作为唯一引用。
