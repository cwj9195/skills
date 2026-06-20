# frontend-design-agent 维护说明

> 本文件给人类维护者看，用来解释目录里每个文件的职责和读取时机。它不作为 agent 执行规则源；执行规则以 [SKILL.md](SKILL.md) 和 [references/workflow.md](references/workflow.md) 为准。

## 快速判断

- 入口路由看 [SKILL.md](SKILL.md)。
- 三阶段状态机、产物边界、MasterGo 规则、Evidence 门禁看 [references/workflow.md](references/workflow.md)。
- 只做 module-split 时，通常只需要读 [references/module-index-template.md](references/module-index-template.md)、[references/module-template.md](references/module-template.md)，多模块时再读 [workflows/module-split-parallel.md](workflows/module-split-parallel.md)。
- 做 module-design 时，按 `requirements-detail -> code-reference -> api-contract -> frontend-design -> implementation-tasks` 的顺序读对应模板。
- 做实现时，以生成后的 `implementation-tasks.md` 为唯一执行入口，不回读完整 PRD。

## 文件职责

| 文件 | 职责 | 何时读取 | 维护建议 |
| ---- | ---- | -------- | -------- |
| [SKILL.md](SKILL.md) | skill 触发后的入口路由、必读 reference、硬约束摘要 | 每次使用本 skill 后先读 | 保持短，只放入口和不可违反摘要 |
| [references/workflow.md](references/workflow.md) | 三轮 workflow 的唯一执行规则源 | 所有模式都读 | 阶段边界、停止条件、Evidence、MasterGo 规则都维护在这里 |
| [references/module-index-template.md](references/module-index-template.md) | module-split 的 Manifest 和 Source Registry 模板 | module-split | 只维护索引结构，不复制模块详情 |
| [references/module-template.md](references/module-template.md) | module-split 每个模块的单文件模板 | module-split | 继续保持单文件，覆盖需求、字段、UI、流程、接口线索、Review Notes、Gate |
| [workflows/module-split-parallel.md](workflows/module-split-parallel.md) | 多模块拆分时的 extract / verify / aggregate 编排 | 模块数 >= 5 或产出文件较多时 | 只维护并行编排和 gate schema，不放业务模板 |
| [references/requirements-template.md](references/requirements-template.md) | module-design 的需求详情模板 | module-design | 第二轮需求事实源，承接 module.md 的澄清项 |
| [references/code-reference-template.md](references/code-reference-template.md) | 代码模式提取模板 | module-design | 保留按需加载，不和其他设计模板合并 |
| [references/api-contract-template.md](references/api-contract-template.md) | 根级前端接口契约模板 | module-design | 前端工作流内接口契约唯一事实源 |
| [references/frontend-design-template.md](references/frontend-design-template.md) | 前端实现设计书模板 | module-design | 只引用 code-reference 和 api-contract，不复制契约全文 |
| [references/claude-code-task-template.md](references/claude-code-task-template.md) | 实现任务包模板 | module-design / implement | 实现 Agent 的任务入口和验证门禁 |
| [references/yapi-sync.md](references/yapi-sync.md) | YApi/OpenAPI 可选同步手册 | 需要从 api-contract 导出到 YApi 时 | 不属于默认 workflow，只按需读取 |
| [scripts/contract-to-swagger.mjs](scripts/contract-to-swagger.mjs) | `api-contract.md` 到 OpenAPI 3.0 JSON 的辅助脚本 | 执行 YApi 同步时 | 保持独立工具，不在默认流程里自动运行 |

## 阶段读取路径

### module-split

1. [SKILL.md](SKILL.md)
2. [references/workflow.md](references/workflow.md)
3. [references/module-index-template.md](references/module-index-template.md)
4. [references/module-template.md](references/module-template.md)
5. [workflows/module-split-parallel.md](workflows/module-split-parallel.md)：仅多模块或需要并行编排时读取

输出原则：每个模块只生成 `module.md`。历史 `requirements.md` / `ui.md` / `prototype.md` / `review-notes.md` 只读兼容，不作为新产物。

### module-design

1. [SKILL.md](SKILL.md)
2. [references/workflow.md](references/workflow.md)
3. [references/requirements-template.md](references/requirements-template.md)
4. [references/code-reference-template.md](references/code-reference-template.md)
5. [references/api-contract-template.md](references/api-contract-template.md)
6. [references/frontend-design-template.md](references/frontend-design-template.md)
7. [references/claude-code-task-template.md](references/claude-code-task-template.md)

输出原则：先把模块事实、代码模式、接口契约、实现设计和任务包串起来；不要跳过 Codegraph 代码模式提取。

### implement

1. [SKILL.md](SKILL.md)
2. [references/workflow.md](references/workflow.md)
3. [references/claude-code-task-template.md](references/claude-code-task-template.md)
4. 任务涉及接口时读 [references/api-contract-template.md](references/api-contract-template.md)

输出原则：只按 `implementation-tasks.md` 的任务 ID 执行，不用“实现某模块”替代任务 ID。

## 不要放回来的文件

以下文件已经删除，不要作为 active skill 文件放回：

- `references/module-requirement-template.md`
- `references/module-ui-template.md`
- `references/frontDesignAgent.md`
- `问题.md`

原因：

- module-split 已收敛为每模块单文件 `module.md`。
- legacy 四文件兼容是读取策略，只在 [references/workflow.md](references/workflow.md) 中保留文字说明。
- 背景蓝图和历史问题容易和执行规则冲突；如需记录经验，优先写入外部长期记忆或单独复盘文档。

## 当前优化判断

- 当前保留的 12 个执行文件是三阶段链路下的合理下限之一。
- 不建议继续把 `code-reference-template.md`、`api-contract-template.md`、`frontend-design-template.md`、`claude-code-task-template.md` 合成一个大文件；它们分别对应 module-design 的不同事实源，按需加载更省上下文。
- 如果未来确认不再使用 `module-design`，可以整体删除第二轮模板。
- 如果未来确认不再需要 YApi/OpenAPI 同步，可以删除 [references/yapi-sync.md](references/yapi-sync.md) 和 [scripts/contract-to-swagger.mjs](scripts/contract-to-swagger.mjs)。

## 维护原则

- 新执行规则优先写 [references/workflow.md](references/workflow.md)。
- 新产物结构优先写对应 template。
- [SKILL.md](SKILL.md) 只维护路由和硬约束摘要。
- README 只解释目录结构，不承载执行规则。
