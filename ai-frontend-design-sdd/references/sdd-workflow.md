# SDD 工作流

## 目录

1. 输入归档
2. 证据化调研
3. Spec 分解
4. Plan 设计
5. Tasks 编排
6. 冲突处理
7. 验收闭环

## 1. 输入归档

把输入分成五类：

- PRD：业务目标、用户角色、功能范围、字段规则、验收标准。
- MasterGo UI：布局、组件、间距、颜色、状态、交互细节、响应式要求。
- 原型：页面流、点击路径、弹窗/抽屉/表单流程、异常路径。
- 当前代码：路由、页面、组件、状态、请求、权限、测试、构建约束。
- 企业组件库：可复用组件、设计 token、表单/表格/弹窗规范、禁用与权限语义。

对每类输入记录：

- 来源
- 可访问方式
- 已验证事实
- 冲突点
- 缺失点

## 2. 证据化调研

优先使用 Codegraph MCP：

- `codegraph_context`：理解页面、模块、功能域。
- `codegraph_search`：查找组件、函数、store、route、api 名称。
- `codegraph_trace`：分析点击到请求、请求到状态更新、路由到页面加载。
- `codegraph_impact`：评估共享组件或请求层改动影响面。
- `codegraph_explore`：一次性查看相关符号源码。

优先使用 Chrome DevTools MCP：

- 检查 MasterGo/原型/本地页面的真实 UI。
- 截图保存视觉证据。
- 验证交互链路、DOM 状态、网络请求、控制台错误。

降级读取文件时，只读取回答问题所需的最小片段，并记录 Evidence。

## 3. Spec 分解

用 GitHub/spec-kit SDD 思路拆分：

- `User Story`：谁在什么场景下完成什么目标。
- `Functional Requirements`：必须实现的行为。
- `Non-functional Requirements`：性能、可访问性、兼容、权限、安全。
- `Data Contract`：字段、枚举、默认值、校验、接口映射。
- `State Contract`：加载、空态、错误、禁用、只读、编辑中、保存中。
- `Acceptance Criteria`：可验证、可自动化、可复现。

每条需求标注来源：

```text
FR-001: xxx
Evidence: PRD:章节/截图；MasterGo:画板/节点；Code:路径:行号
Status: ✅Verified / ⚠️Unverified / ❌Unknown
```

输出到 `spec.md` 时必须使用 `references/output-contract.md` 的模板；弱模型不得自行调整章节。

## 4. Plan 设计

Plan 必须覆盖：

- 前端模块边界：页面、容器组件、展示组件、组合 hooks、store、request/api。
- 组件库适配：优先复用企业组件；缺口说明是否封装局部 adapter。
- 数据流：入口事件、权限判断、请求参数、响应转换、状态写入、刷新策略。
- 交互流：点击、提交、取消、确认、回退、重复操作、防抖/幂等。
- 错误流：接口失败、权限失败、字段校验失败、空数据、部分成功。
- 测试策略：小改动回归清单，高风险链路最小行为测试。

复杂项目必须按模块设计，每个模块回答：

- 范围
- 页面/路由
- 组件复用/新增组件
- 数据流
- 状态与缓存
- API 契约
- 权限与脱敏
- 异常与边界
- 测试与验收
- 实现顺序

## 5. Tasks 编排

任务必须面向执行 Agent：

```text
Task-001: 实现 xxx 页面容器
目标: ...
输入: PRD-xx, UI-xx, Code Evidence-xx
输出文件: ...
依赖: Task-000
验收: ...
停止条件: 缺少接口字段 xxx / 组件库不支持 yyy
```

拆分原则：

- 一个任务只跨一个清晰责任边界。
- 一个任务目标耗时控制在 0.5-2 小时，超过则继续拆分。
- 共享契约先改，业务页面后改。
- 先测试或回归清单，再实现。
- 每个任务都能独立验证。

## 6. 冲突处理

冲突优先级默认：

1. 已确认 PRD 验收口径
2. 最新 MasterGo/原型
3. 当前代码中稳定约定
4. 企业组件库能力
5. Agent 推断

若冲突无法裁决：

- 标为 `TODO`
- 写明冲突来源
- 不把推断写成事实
- 给出推荐方案与风险

## 7. 验收闭环

设计书完成前检查：

- 每个功能点有证据或 TODO。
- 每个页面状态完整：loading、empty、error、readonly、disabled、saving。
- 每个交互有入口、回调、状态变化、失败处理。
- 每个 API 有参数、响应、错误、权限说明。
- 每个任务有输出文件和验收方式。
- 最终可交给编码 Agent 直接执行。

写入目录前还必须执行 `references/output-contract.md` 的“输出前自检清单”。若任何一项无法满足，必须在 `TODO & Known Issues` 和 `fact-set.yaml.todos` 中记录。
