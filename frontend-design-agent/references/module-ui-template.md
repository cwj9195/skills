# 界面.md 模板（module-split 第一轮）

> 本文件记录当前模块的 UI / 视觉 / 设计稿事实，用于人工审查和后续 `module-design`。MasterGo 链接必须在后续阶段尝试 `mastergo-magic-mcp.getDsl`；截图、DSL、原型素材路径必须使用 Markdown 链接，不得只写反引号路径作为唯一引用。

| 项目          | 内容                           |
| ------------- | ------------------------------ |
| 模块 ID       | M{N}                           |
| 模块名称      | TODO                           |
| 来源 Manifest | `../模块索引.md#M{N}`          |
| 生成时间      | TODO                           |
| 状态          | Split / Reviewed / Blocked     |

## 1. UI Source 清单

| UI Source ID | 页面/状态名称 | MasterGo 链接 | 截图 | DSL 状态 | 证据 | 原文摘要 |
| ------------ | ------------- | ------------- | ---- | -------- | -------- | -------- |
| UI-M{N}-001 | TODO | [MasterGo](TODO) / 无 | [截图](../来源/TODO.png) / 无 | 待提取 / 已提取 / 失败 | 来源: [PRD-001](../模块索引.md#source-prd-001)<br/>快照: [../来源/PRD.md:Lx-Ly](../来源/PRD.md#Lx) | TODO |

## 2. UI Source 详情锚点

> 每个 UI Source 定义处必须提供稳定锚点。其他表格或正文引用该 UI Source 时，必须写成 `[UI-M{N}-001](#ui-m{N}-001)`，不得裸写 ID 作为唯一引用。

<a id="ui-m{N}-001"></a>
### UI-M{N}-001 TODO

| 项目 | 内容 |
| ---- | ---- |
| UI Source ID | UI-M{N}-001 |
| 页面/状态名称 | TODO |
| MasterGo 链接 | [MasterGo](TODO) / 无 |
| 截图 | [截图](../来源/TODO.png) / 无 |
| DSL 状态 | 待提取 / 已提取 / 失败 |
| 证据 | 来源: [PRD-001](../模块索引.md#source-prd-001)<br/>快照: [../来源/PRD.md:Lx-Ly](../来源/PRD.md#Lx) |
| 原文摘要 | TODO |

## 3. UI 结构与组件

| UI Source ID | 区域 | 组件/元素 | 交互状态 | 证据 |
| ------------ | ---- | --------- | -------- | -------- |
| [UI-M{N}-001](#ui-m{N}-001) | TODO | TODO | 默认 / hover / disabled / loading / error / empty | [PRD-001:Lx-Ly](../来源/PRD.md#Lx) / [UI-M{N}-001](#ui-m{N}-001) |

## 4. 截图预览（可选）

> 表格里默认使用 `[截图](../来源/xxx.png)`，避免图片撑爆表格；需要视觉核对时，在本节用图片语法展开。

### UI-M{N}-001 TODO

![UI-M{N}-001 TODO](../来源/TODO.png)

## 5. MasterGo DSL 记录

| UI Source ID | DSL 获取状态 | 处理结果 | 降级方式 | 证据 |
| ------------ | ------------ | -------- | -------- | -------- |
| [UI-M{N}-001](#ui-m{N}-001) | 待提取 / 已提取 / 失败 | TODO | 无 / 用户截图 / 用户导出 DSL | [MasterGo](TODO) / Fallback |

## 6. 素材与 ID 链接规范

- [ ] 表格内截图路径使用 `[截图](../来源/xxx.png)`。
- [ ] 正文预览图使用 `![截图说明](../来源/xxx.png)`。
- [ ] 禁止只写 `` `../来源/xxx.png` `` 作为唯一引用。
- [ ] 第一轮 `M{N}/界面.md` 使用 `../来源/xxx`。
- [ ] 第二轮 `M{N}/设计/前端设计.md` 若引用截图，使用 `../../来源/xxx`。
- [ ] 每个 UI Source 必须包含 UI Source ID、页面/状态名称、MasterGo 链接、截图链接、DSL 状态、证据和原文摘要。
- [ ] 每个 UI Source 定义处必须有 `<a id="ui-m{N}-001"></a>` 形式的稳定锚点，生成实际模块时替换为 `ui-m2-001` 这类小写锚点。
- [ ] 引用 UI Source 时必须写 `[UI-M{N}-001](#ui-m{N}-001)`，禁止裸写 `UI-M{N}-001` 作为唯一引用。
