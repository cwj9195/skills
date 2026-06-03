# Front Design Agent 工作流

## 1. 状态机

| 状态 | 进入条件 | 行为 | 下一状态 |
| ---- | -------- | ---- | -------- |
| `initial` | 收到 PRD、原型、MasterGo 或设计书需求 | 识别输入材料、判断模式 | `outline` / `evidence` |
| `outline` | 只给 PRD/原型，或模块边界未确认 | 输出提纲版 | `confirm` |
| `confirm` | 提纲版已输出 | 等待用户确认模块、页面、优先级 | `evidence` |
| `evidence` | 用户要求 AI 落地版或已确认提纲 | 使用 MCP 采集 Evidence | `design` / `repair` |
| `design` | Evidence 达标 | 生成前端设计书、Fact Set、任务包、CI Gate | `done` |
| `repair` | Evidence 不足或冲突过多 | 列阻塞项和临时方案 | `confirm` |

## 2. 输入处理

| 输入 | 处理方式 | Evidence |
| ---- | -------- | -------- |
| PRD | 抽取业务目标、用户故事、需求项、验收、边界 | `PRD(section:line)` |
| Spec | 作为结构化需求源，核对模块、字段、权限、验收 | `Spec(section:line)` |
| MasterGo 链接 | 解析 `fileId`、`layerId`，调用 DSL | `MasterGo(fileId:layerId)` |
| 原型链接 | Chrome DevTools MCP 打开并提取页面流程 | `Prototype(url/page)` |
| 代码库 | Codegraph MCP 读取结构、路由、接口、组件 | `Evidence(path:line)` |
| 组件库 | 从文档或代码使用方式提取 props、slots、事件 | `Evidence(path:line)` |
| API 文档 | 提取 method、path、入参、出参、错误码 | `API(doc:section)` |

## 3. MCP 使用规则

### Codegraph

优先顺序：

1. `codegraph_status`
2. `codegraph_files`
3. `codegraph_context`
4. `codegraph_explore`
5. `codegraph_impact`

若 Codegraph 未初始化：

```text
记录阻塞项：Codegraph 未初始化。
建议用户执行：codegraph init。
如必须继续，降级为只读 RTK 命令，可信度标记 Fallback。
```

### Chrome DevTools

用于访问：

- PRD 链接
- 原型链接
- 内部组件库文档
- 登录态系统页面

### MasterGo

检测到 MasterGo 链接时必须：

1. 解析 `fileId`、`layerId`。
2. 调用 `mastergo-magic-mcp.getDsl`。
3. 抽取页面宽度、栅格、布局、组件层级、token、交互状态。
4. 映射到公司组件库或业务公共组件。
5. 无法识别的图层进入 TODO。

## 4. Evidence 可信度

| 可信度 | 定义 |
| ------ | ---- |
| `Verified` | 来自 Codegraph、MasterGo DSL、API 文档或明确 PRD 行 |
| `Inferred` | 基于现有命名约定、相邻模块实现推导 |
| `Fallback` | Codegraph 或链接不可用时，用只读命令、截图或用户描述补充 |
| `Unverified` | 无可验证来源，必须进入 TODO |

## 5. 输出顺序

1. `spec.md`
2. `requirements.md`
3. `facts.md`
4. `frontend-design.md`
5. `fact-set.yaml`
6. `claude-code-task.md`
7. `ci-gate.md`

## 6. 自检门槛

- 每个业务模块都有 13 个固定章节。
- 全文至少 15 个代码 Evidence。
- 全文至少 8 个 PRD、Spec 或原型 Evidence。
- 每个模块至少 1 个状态机表。
- 每个模块至少 3 条 Given/When/Then。
- TODO 总数不超过 15。
- 阻塞 TODO 必须有临时方案。
