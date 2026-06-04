# 输出契约

## 固定文件链路

当用户要求写入设计目录时，必须生成以下文件，不得只生成单个长文档：

| 文件 | 必填 | 目的 |
| --- | --- | --- |
| `README.md` | 是 | 目录索引、使用顺序、适用范围 |
| `facts.md` | 是 | 输入可用性、仓库事实、PRD/UI/API/组件库证据、TODO |
| `spec.md` | 是 | 用户故事、功能需求、数据/状态/权限/验收契约 |
| `code-reference.md` | 是 | 可复用代码模式、组件库映射、不可改边界 |
| `frontend-design.md` | 是 | 前端架构、模块方案、Agent/Skills/MCP/Prompt/实现/风险 |
| `tasks.md` | 是 | AI 可执行任务包 |
| `claude-code-task.md` | 是 | 可直接交给实现 Agent 的分阶段执行入口 |
| `ci-gate.md` | 是 | Current Evidence Gate、Required Engineering Gate、回归路径 |
| `agent-prompts.md` | 是 | 可复制给子 Agent 的 Prompt |
| `fact-set.yaml` | 是 | 结构化事实集，供后续 Agent 快速加载 |

## 设计书章节

输出必须使用以下章节：

1. 问题分析
2. 系统架构
3. Agent设计
4. Skills设计
5. MCP设计
6. Prompt设计
7. 实现方案
8. 风险与优化
9. TODO & Known Issues

## 1. 问题分析

包含：

- 背景目标
- 用户与场景
- 范围内/范围外
- 核心业务流程
- 输入证据表
- 冲突与缺口

## 2. 系统架构

包含：

- 页面/模块架构
- 数据流架构
- 状态管理策略
- 请求/API 策略
- 权限与路由策略
- 组件库复用策略
- 测试与质量门禁

## 3. Agent设计

至少定义：

- `Requirement Analyst Agent`：抽取 PRD、原型与验收标准。
- `UI Mapping Agent`：映射 MasterGo 到组件、布局和状态。
- `Code Archaeologist Agent`：用 Codegraph 建立代码证据与影响面。
- `Component Library Agent`：确认企业组件能力与封装边界。
- `Frontend Architect Agent`：合并架构方案与任务拆解。
- `QA Gate Agent`：检查证据、测试、回归与风险。

每个 Agent 写清：

- 输入
- 输出
- 使用工具
- 停止条件
- 质量标准

## 4. Skills设计

说明本次需要哪些 skills：

- SDD 设计书生成 skill
- MasterGo/UI 解读 skill（如存在或需创建）
- 企业组件库映射 skill（如存在或需创建）
- 代码证据采集 skill（如存在或需创建）

不要假设 skill 已存在；不存在则写“建议创建”。

## 5. MCP设计

说明 MCP 协作：

- Codegraph MCP：代码结构、符号、调用链、影响面。
- Chrome DevTools MCP：MasterGo/原型/本地页面视觉与交互验证。
- 文件系统 MCP：写入设计书与任务文件。
- Git MCP：查看变更、分支、提交差异。
- 其他 MCP：仅在用户环境明确可用时使用。

每个 MCP 必须写：

- 用途
- 输入
- 输出
- 失败降级
- 证据格式

## 6. Prompt设计

至少输出：

- 总控 Agent Prompt
- 需求分析 Agent Prompt
- UI 映射 Agent Prompt
- 代码证据 Agent Prompt
- 任务拆解 Agent Prompt
- QA Gate Agent Prompt

Prompt 必须包含：

- 角色
- 输入
- 输出格式
- 禁止项
- Fail-Closed 规则
- Evidence 规则

## 7. 实现方案

包含：

- 文件产物清单
- 任务拆解表
- 修改顺序
- 依赖关系
- 回归检查
- 验收命令或手工验证方式

任务表字段：

```text
ID | 目标 | 输入证据 | 输出文件 | 依赖 | 验收 | 风险 | 状态
```

## 8. 风险与优化

覆盖：

- 需求风险
- UI 风险
- 技术风险
- 组件库风险
- 测试风险
- Agent 执行风险
- 后续优化

## 9. TODO & Known Issues

所有缺失证据和阻塞项写这里：

```text
- [ ] TODO-001: xxx
  缺失证据: ...
  影响: ...
  推荐处理: ...
```

## 文件产物建议

当需要写入设计目录时，必须生成“固定文件链路”中的所有文件；若用户明确要求轻量版，至少保留 `facts.md`、`spec.md`、`code-reference.md`、`frontend-design.md`、`tasks.md`、`claude-code-task.md`、`ci-gate.md`。

## 文件模板

### README.md

必须包含：

- 目录用途
- 文件说明表
- 推荐读取顺序
- 未确认项处理规则

### facts.md

必须包含：

- 输入证据表：输入、来源、是否可访问、已验证内容、缺失内容、状态
- 仓库事实：路径、结论、Evidence
- PRD/UI/API/组件库事实
- TODO & Known Issues

### spec.md

必须包含：

- 问题分析：背景目标、用户与场景、范围内/范围外
- 用户故事表：ID、用户故事、验收标准、Evidence
- 功能需求表：ID、需求、状态
- Data Contract：字段、枚举、默认值、校验、接口映射
- State Contract：loading、empty、error、disabled、readonly、saving、dirty
- Permission Contract：菜单、按钮、数据、字段、脱敏
- Acceptance Criteria：Given/When/Then

### code-reference.md

必须包含：

- Codegraph 探索摘要
- 可复用页面/组件/hooks/request/store 模式
- 组件库映射表
- APIMap/请求封装写法
- 权限与按钮写法
- 不可改边界

### frontend-design.md

必须包含本文件前述 9 个设计书章节；复杂项目必须按模块写：

```text
模块名
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
```

### tasks.md

任务表字段固定为：

```text
ID | 目标 | 输入证据 | 输出文件 | 依赖 | 验收 | 风险 | 停止条件 | 状态
```

每个任务必须是 0.5-2 小时可独立验证的最小交付单元。

### claude-code-task.md

必须包含：

- 实现 Agent 开场指令：使用哪些文件、哪些 tools/MCP、禁止项
- 分阶段执行顺序：baseline、共享契约、模块实现、验证、复盘
- 当前批次任务：从 `tasks.md` 选出的 1-3 个任务
- 每个任务的输入文件、改动文件、验收命令、手工回归路径
- 停止条件：接口缺失、UI 冲突、权限不明、基线失败

### ci-gate.md

必须包含：

- Current Evidence Gate：当前可证实的 test/typecheck/build/coverage 状态
- Required Engineering Gate：目标门禁
- Regression Check：入口点击、弹窗确认、权限/disabled/visible、onClick/onSubmit 到状态写入或保存回调
- Known Issues：历史失败、无法执行原因

### agent-prompts.md

必须至少包含：

- 总控 Agent Prompt
- 需求分析 Agent Prompt
- UI 映射 Agent Prompt
- 代码证据 Agent Prompt
- 任务拆解 Agent Prompt
- QA Gate Agent Prompt

每个 Prompt 必须包含：角色、输入、输出格式、禁止项、Fail-Closed 规则、Evidence 规则。

### fact-set.yaml

必须包含：

- meta：feature、version、generated_at、source、output_dir
- inputs：PRD、UI、prototype、code、component_library、api
- modules：模块 id、名称、优先级、状态、evidence、todos
- quality_gates：current、required
- todos：结构化待确认项

## 语言与证据

- 默认使用中文。
- 仓库事实必须附 Evidence。
- 外部 UI 或原型事实必须附来源截图、链接、节点名或访问路径。
- 推断必须标注 `Inference`。
- 证据不足必须标注 `TODO` 或 `❌Unknown`。

## 输出前自检清单

输出前逐项检查，缺失则补齐或写 TODO：

- [ ] 是否生成固定文件链路全部文件，包含 `claude-code-task.md`。
- [ ] 每个模块是否回答范围、页面、路由、组件、状态、接口、权限、异常、测试、实现。
- [ ] 每个仓库事实是否有 `Evidence(路径:行号)` 或 `Evidence(Codegraph MCP ...)`。
- [ ] 每个 UI/原型事实是否有截图、链接、节点名或 TODO。
- [ ] 每个 API 是否有 method、path、params、response、错误/权限说明；未确认是否标 DRAFT/TODO。
- [ ] 每个任务是否有输入证据、输出文件、依赖、验收、停止条件。
- [ ] CI Gate 是否区分当前门禁与目标门禁。
- [ ] 是否保护测试资产，未放宽断言、门禁或 coverage exclusions。
