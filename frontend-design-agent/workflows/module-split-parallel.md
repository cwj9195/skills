# module-split-parallel

> 复用脚本：按 §3.1 内容密度门禁并行生成多模块 `module-split` 产物。  
> 对应：[SKILL.md §5.3 多模块并行生成（默认执行模式）](../SKILL.md) 与 [workflow.md §3.1 内容密度门禁](../references/workflow.md)。

## 何时调用

满足任一即强制调用本脚本：

- `module-split` 阶段，目标模块数 ≥ 5
- 单次产出 ≥ 10 个模块级文件（`requirements.md` / `ui.md` / `prototype.md` / `review-notes.md`）
- 调用方已有"质量断崖"复现记录（参见 [[module-design-quality-decay]]）

不触发：单文件 bug fix、单组件设计、模块数 ≤ 3。

## 调用方式

```js
// 伪代码：实际用本 Skill 的 Workflow 工具调用
const args = {
  prdPath: "/abs/path/to/prd.md",
  outputDir: "/abs/path/to/apps/{app}/docs/{version}/",
  modules: [
    { id: "M1", name: "一期迭代优化", prdLineRange: "L78-L116" },
    { id: "M2", name: "预选品批量导入", prdLineRange: "L121-L432" },
    // ...
  ],
  gateProfile: "default" | "strict",  // 第一次调用 default，第二次（回填）strict
  sourceRegistry: "PRD-001",           // 必填，挂在 module-index#source-prd-001
}
await workflow("module-split-parallel", args)
```

## 三阶段流水线

| 阶段 | Agent 数 | 共享输入 | 产物 |
| --- | --- | --- | --- |
| `extract` | N（=模块数） | `sources/PRD.md` + §3.1 schema + 行号映射 + `gateProfile` | 每模块 4 件套 + `sources/mastergo/*.dsl.json`（按需） |
| `verify` | N | 同上 + 上阶段产物 | 每模块 `_gate.json`（PASS / FAIL / Blocked） |
| `aggregate` | 1 | 上阶段全部产物 | `module-index.md`（含 cross-module rules） |

## §3.1 内容密度门禁 schema（agent 间共享）

每次 `extract` agent 必须按下表自检，输出 `_gate.json`：

```json
{
  "moduleId": "M2",
  "gateProfile": "default",
  "checks": {
    "reqDensity":   { "status": "PASS|FAIL|Blocked", "metric": "REQ数+平均跨度", "threshold": "≥3 条 / ≤50 行" },
    "fieldCoverage":{ "status": "PASS|FAIL|Blocked", "metric": "FIELD 覆盖 PRD 字段表行数 / 实际", "threshold": "100% 覆盖" },
    "uiEvidence":   { "status": "PASS|FAIL|Blocked", "metric": "UI Source Verified 数 / 全部 Source 数", "threshold": "100% 或附 Fallback 理由" },
    "apihintDistinct": { "status": "PASS|FAIL|Blocked", "metric": "APIHINT 与同类模块的相似度", "threshold": "差异 ≥ 30% 或提 CR" },
    "reviewNotesDistinct": { "status": "PASS|FAIL|Blocked", "metric": "每模块独有待确认项", "threshold": "≥ 1" }
  },
  "verdict": "PASS|FAIL|Blocked",
  "blockedReasons": [],
  "fallbackReasons": []
}
```

`gateProfile=strict` 时，所有 threshold 收紧：跨度 ≤ 30 行、相似度差异 ≥ 50%、UI 100% Verified（不允许 Fallback）。

## Agent prompt 模板（`extract` 阶段）

```text
你是 module-split 阶段的 extract agent。任务：为模块 M{N}「{name}」产出 4 件套。

## 必读
- /Users/amoy/.cc-switch/skills/frontend-design-agent/SKILL.md §5.3
- /Users/amoy/.cc-switch/skills/frontend-design-agent/references/workflow.md §3 + §3.1
- {prdPath} 切片：{prdLineRange}

## 输入
- prdPath：{prdPath}
- outputDir：{outputDir}M{N}-{name}/
- 共享 schema：上方 §3.1 gate schema
- gateProfile：{gateProfile}

## 产出（强制）
1. {outputDir}M{N}-{name}/requirements.md
2. {outputDir}M{N}-{name}/ui.md
3. {outputDir}M{N}-{name}/prototype.md
4. {outputDir}M{N}-{name}/review-notes.md
5. （按需）{outputDir}M{N}-{name}/sources/mastergo/*.dsl.json
6. {outputDir}M{N}-{name}/_gate.json

## 硬规则（违反即 Blocked）
- 所有引用型 ID 必须用 [ID](#anchor) 或 [ID](相对路径#anchor)，锚点小写
- 所有文件路径必须用 [text](path) 链接，禁止裸写反引号路径作为唯一引用
- Evidence 必须同时含 Source Registry 链接 + 快照行号链接 + 原文摘要
- PRD 行号以 {outputDir}sources/PRD.md 快照为准
- 每个 Req/Rule/Field/UI Source 都要有 PRD 行号证据，禁止只写 "PRD(L417-818)"

## 内容密度门禁（gateProfile={gateProfile}）
- REQ ≥ 3 条 / 平均跨度 ≤ {strict ? 30 : 50} 行
- FIELD 100% 覆盖该模块 PRD 中字段表行
- UI Source 100% Verified 或附 Fallback 理由（strict 不允许 Fallback）
- APIHINT 与同类模块差异 ≥ {strict ? 50 : 30}%，否则提 CR
- review-notes ≥ 1 条本模块独有待确认

完成后输出 _gate.json，再结束本轮。
```

## Agent prompt 模板（`verify` 阶段）

```text
你是 verify agent。任务：读 M{N}-*/_gate.json 与 4 件套产物，跑 §3.1 五项门禁的二次核对。

## 必读
- SKILL.md §5.3
- workflow.md §3.1
- M{N}-*/_gate.json
- M{N}-*/{requirements,ui,prototype,review-notes}.md

## 输出
- 覆盖 _gate.json 的 verdict（PASS/FAIL/Blocked）
- 失败项必须给可执行修复指令（"再读 PRD Lx-Ly，补字段 xxx"）
```

## Agent prompt 模板（`aggregate` 阶段）

```text
你是 aggregate agent。任务：聚合 N 个模块的产物，写 module-index.md。

## 必读
- SKILL.md §2 + §5.3
- module-index-template.md

## 输出
- module-index.md（Source Registry + 模块 Manifest + 跨模块规则 + 人工审查记录）
- 提炼同类模块（≥2）的共性为 CR，写入"跨模块规则与依赖"
```

## 回填语义

- 第一次调用 `gateProfile=default`：拆边界，允许字段级契约后置
- 第二次调用 `gateProfile=strict`：同 Workflow，更严 schema，回填到字段级 + UI 100% Verified + 申请单类去重
- 不重写框架，只重写深内容

## 失败处理

- 任一模块 verdict=Blocked → 该模块进 `repair`，不回 module-design
- 连续 2 次（default + strict）仍 Blocked → 停止聚合，输出阻塞项给用户
- aggregate 失败 → 全量回退到 manual，单 agent 串行模式输出

## 元数据

- 维护者：frontend-design-agent
- 来源：apps/pim/docs/260620-第2版/ 复盘后沉淀
- 关联 memory：[[module-design-quality-decay]]、[[three-layer-defenses-for-modular-design]]
