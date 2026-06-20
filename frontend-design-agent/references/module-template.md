# module.md 模板（module-split 单文件）

> 本文件是 module-split 阶段唯一模块事实源，聚合需求、UI Evidence、Prototype/Flow、API Hints、Review Notes 和 Gate。历史四文件材料只作为 legacy input 读取，不作为新产物。

| 项目 | 内容 |
| ---- | ---- |
| 模块 ID | M{N} |
| 模块名称 | TODO |
| Source Manifest | [M{N}](../module-index.md#M{N}) |
| Source PRD | [PRD-001](../module-index.md#source-prd-001) |
| Artifact Profile | single-file |
| 生成时间 | TODO |
| Gate | PASS / FAIL / Blocked |

## 1. Scope & Requirements

| ID | 类型 | 内容 | 证据 |
| ---- | ---- | ---- | ---- |
| REQ-M{N}-001 | REQ | TODO | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |
| RULE-M{N}-001 | RULE | TODO | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |

## 2. Fields & Permissions

| ID | 类型 | 字段/角色 | 规则/范围 | 证据 |
| ---- | ---- | ---- | ---- | ---- |
| FIELD-M{N}-001 | FIELD | TODO | TODO | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |
| PERM-M{N}-001 | PERM | TODO | TODO | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |

<a id="ui-evidence"></a>
## 3. UI Evidence

| UI Source ID | 页面/状态名称 | MasterGo 链接 | 截图 | DSL 状态 | DSL 文件 | 证据 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| UI-M{N}-001 | TODO | [MasterGo](TODO) / 无 | [截图](../sources/TODO.png) / 无 | Verified / Fallback / Unverified / Blocked | [DSL JSON](sources/mastergo/UI-M{N}-001.dsl.json) / 无 | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |

### 3.1 UI Structure

| UI Source ID | 区域 | 组件/元素 | 交互状态 | 证据 |
| ---- | ---- | ---- | ---- | ---- |
| [UI-M{N}-001](#ui-m{N}-001) | TODO | TODO | 默认 / hover / disabled / loading / error / empty | [PRD-001:Lx-Ly](../sources/PRD.md#Lx) / [UI-M{N}-001](#ui-m{N}-001) |

<a id="prototype-flow"></a>
## 4. Prototype & Flow

| ID | 触发/入口 | 流程/状态 | 证据 |
| ---- | ---- | ---- | ---- |
| FLOW-M{N}-001 | TODO | TODO | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |
| STATE-M{N}-001 | TODO | TODO | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |

## 5. API Hints

> 本节只记录接口线索，不生成正式 method/path/请求/响应结构。正式接口契约由 module-design 阶段生成。

| ID | 场景 | 线索 | 是否确认 | 证据 |
| ---- | ---- | ---- | ---- | ---- |
| APIHINT-M{N}-001 | TODO | TODO，不确认 method/path。 | 待确认 | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |

<a id="review-notes"></a>
## 6. Review Notes

| ID | 类型 | 问题 / 缺口 | 当前处理 | 是否阻塞 | 证据 |
| ---- | ---- | ---- | ---- | ---- | ---- |
| RN-M{N}-001 | UI / 原型 / 接口 / 边界 | TODO | TODO | 是 / 否 | Source: [PRD-001](../module-index.md#source-prd-001)<br/>快照: [../sources/PRD.md:Lx-Ly](../sources/PRD.md#Lx)<br/>原文摘要: TODO |

## 7. Gate

| 检查项 | 状态 | 指标 | 阈值 / 说明 |
| ---- | ---- | ---- | ---- |
| reqDensity | PASS / FAIL / Blocked | TODO | REQ ≥ 3；单条 Evidence 跨度 ≤ 50 行 |
| fieldCoverage | PASS / FAIL / Blocked | TODO | 字段表 100% 登记；无字段表需说明 |
| uiEvidence | PASS / FAIL / Blocked | TODO | MasterGo DSL Verified；或用户明确允许 Fallback |
| apihintDistinct | PASS / FAIL / Blocked | TODO | 同类模块接口线索不得逐字雷同 |
| reviewNotesDistinct | PASS / FAIL / Blocked | TODO | 至少 1 条模块独有待确认 |

## 8. Checklist

- [ ] 所有 REQ/RULE/FIELD/PERM/FLOW/UI/APIHINT/RN 均有 Source Registry 链接、PRD 快照行号和原文摘要。
- [ ] MasterGo 链接已按工具矩阵尝试获取；用户要求“拆分阶段必须拿 UI”时，未取到 DSL 必须 Blocked。
- [ ] 未生成 `api-contract.md`、`frontend-design.md`、`implementation-tasks.md`。
- [ ] 本文件是当前模块唯一事实源；不要再生成重复模块文件。
