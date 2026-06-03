# FrontDesignAgent：前端设计书生成系统

## 1. 问题分析

当前目标不是让 AI 直接读取 PRD 后写代码，而是建立一条稳定、可追溯、可验证的前端交付链路：

```text
PRD / Spec / 原型 / MasterGo / 现有代码 / 公司组件库
↓
Spec 结构化
↓
Evidence 采集
↓
前端设计书
↓
Fact Set
↓
Claude Code 任务包
↓
Agent 实现
↓
CI Gate
```

核心问题有四个：

| 问题 | 影响 | 解决方式 |
| ---- | ---- | -------- |
| PRD 是自然语言 | 不同模型会产生不同理解 | 先转成 Spec，再派生前端 requirements 和验收标准 |
| 原型只表达视觉 | 无法直接约束接口、状态和异常 | 用 MasterGo DSL + 页面交互表补齐 |
| 代码库事实缺失 | AI 容易编造路径、组件和接口 | 强制 Codegraph Evidence |
| 设计书不可验证 | Agent 实现后缺少合并门禁 | 生成 Fact Set 和 CI Gate |

设计原则：

- Agent 不直接消费 PRD。
- Agent 不直接消费未验证的 Spec；Spec 必须先被转成可追溯的 requirements 和 facts。
- 前端设计书必须同时消费需求事实、原型事实、代码事实和组件库事实。
- Fact Set 是实现和 CI 的共同约束。

## 2. 系统架构

### 2.1 总体架构

采用“三层产物 + 五类 Agent + 三类 MCP”的架构。

```text
输入材料
  ├─ PRD / Spec / 验收标准
  ├─ MasterGo 图层链接 / 原型 / 截图
  ├─ 现有代码库
  ├─ 公司前端组件库
  └─ API 文档 / Mock / OpenAPI
        ↓
InputCollectorAgent
        ↓
RequirementStructAgent
        ↓
CodeFactAgent + PrototypeFactAgent
        ↓
DesignDocAgent
        ↓
FactSetAgent
        ↓
ClaudeCodeTaskAgent
        ↓
CI Gate
```

### 2.2 标准产物

| 产物 | 职责 | 是否给实现 Agent |
| ---- | ---- | ---------------- |
| `spec.md` | PRD 的结构化规格，记录用户故事、需求项、验收条件、边界 | 否，仅作来源 |
| `requirements.md` | 面向前端实现的需求视图，记录模块、页面、角色、权限、字段、验收 | 否，仅作来源 |
| `facts.md` | 代码、组件库、原型、接口 Evidence 汇总 | 是 |
| `frontend-design.md` | AI 可执行前端设计书，描述 How | 是 |
| `fact-set.yaml` | 可机器验证事实，约束测试和 CI | 是 |
| `claude-code-task.md` | 可直接交给编码 Agent 的任务包 | 是 |
| `ci-gate.md` | 合并前检查清单和命令 | 是 |

### 2.3 主流程

```text
输入材料
↓
Spec 结构化
↓
Evidence 采集
↓
模块拆解
↓
页面结构设计
↓
MasterGo DSL 映射
↓
组件复用设计
↓
字段字典和校验规则
↓
接口契约
↓
状态、缓存和数据链路
↓
异常、权限和状态机
↓
验收标准
↓
Fact Set
↓
Claude Code 任务包
↓
CI Gate
```

## 3. Agent 设计

### 3.1 InputCollectorAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 收集并归档 PRD、MasterGo、原型、截图、组件库、API 文档、代码路径 |
| 输入 | 用户链接、本地文件、截图、补充说明 |
| 输出 | 输入清单、访问状态、材料缺口、优先级 |
| 禁止 | 不做需求推断，不生成设计结论 |

必须输出：

- 输入来源表
- 可访问性检查
- 材料缺失清单
- 链接访问方式：Chrome DevTools MCP 优先
- MasterGo 链接解析结果：`fileId`、`layerId`、页面名称

### 3.2 RequirementStructAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 把 PRD 转成 Spec，再派生前端 requirements |
| 输入 | PRD、已有 Spec、业务补充 |
| 输出 | `spec.md`、`requirements.md` |
| 禁止 | 不写实现细节，不选择组件库 |

必须抽取：

- 业务目标
- 用户角色
- 模块清单
- 页面清单
- 字段与业务规则
- 权限规则
- 异常场景
- Given/When/Then 验收标准

### 3.3 CodeFactAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 从现有代码和组件库中提取可复用事实 |
| 输入 | 代码库路径、组件库路径、API 文件、路由文件 |
| 输出 | `facts.md` 中的代码事实部分 |
| 首选 MCP | Codegraph MCP |

探索顺序：

1. 用 `codegraph_status` 检查索引。
2. 用 `codegraph_files` 查看项目结构。
3. 用 `codegraph_context` 读取路由、接口、组件库、状态管理、权限模式。
4. 用 `codegraph_explore` 查看关键实现片段。
5. 如果 Codegraph 未初始化，提示执行 `codegraph init`；仍不可用时，才降级为只读命令，并在 Evidence 可信度标 `Fallback`。

必须禁止：

- 禁止编造不存在的组件路径。
- 禁止编造不存在的权限码。
- 禁止把接口路径写成 `TODO`。

### 3.4 PrototypeFactAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 从 MasterGo、原型和截图中提取页面事实 |
| 输入 | MasterGo 图层链接、原型链接、截图 |
| 输出 | 页面结构、布局、组件层级、交互状态、设计 token |
| 首选 MCP | MasterGo MCP、Chrome DevTools MCP |

MasterGo 处理规则：

| 步骤 | 动作 | 输出 |
| ---- | ---- | ---- |
| 1 | 解析链接 | `fileId`、`layerId`、页面名 |
| 2 | 调用 `mastergo-magic-mcp.getDsl` | DSL 原始结构 |
| 3 | 提取层级 | 页面区域、弹窗、抽屉、表单、表格、按钮 |
| 4 | 提取 token | 尺寸、间距、颜色、字体、圆角、阴影 |
| 5 | 映射组件 | 公司组件库组件、业务公共组件、新建组件 |
| 6 | 标记状态 | 默认、加载、禁用、空态、错误、成功 |

### 3.5 DesignDocAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 生成 AI 可独立实现的前端设计书 |
| 输入 | `spec.md`、`requirements.md`、`facts.md`、原型 DSL、组件库事实 |
| 输出 | `frontend-design.md` |
| 模式 | 提纲版、AI 可落地版 |

AI 可落地版每个业务模块必须包含 13 个章节：

1. 模块证据与范围
2. 文件变更计划
3. 页面结构与路由
4. UI 布局与交互契约
5. 数据模型与字段字典
6. API 契约
7. 组件复用与新建组件契约
8. 状态、缓存与数据链路
9. 权限、校验与状态机
10. 异常、边界与性能
11. Hooks 与工具函数
12. 实现步骤
13. 验收标准与 TODO

### 3.6 FactSetAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 把设计书转成可验证事实 |
| 输入 | `frontend-design.md` |
| 输出 | `fact-set.yaml`、`ci-gate.md` |

Fact 类型：

| 类型 | 示例 | 验证方式 |
| ---- | ---- | -------- |
| 页面 Fact | tab、表单项、按钮、弹窗 | E2E / 组件测试 |
| 交互 Fact | 点击、提交、校验、跳转 | E2E |
| 数据 Fact | 请求参数、响应字段、缓存 key | Contract Test |
| 权限 Fact | 可见性、禁用态、无权限提示 | Unit / E2E |
| 验收 Fact | Given/When/Then | 自动化测试 |

## 4. Skills 设计

### 4.1 Skill 落地位置

需要在 cc-switch 源信息中落地：

```text
/Users/amoy/.cc-switch/skills/frontend-design-agent/
  SKILL.md
  references/
    workflow.md
    spec-template.md
    requirements-template.md
    facts-template.md
    frontend-design-template.md
    fact-set-template.yaml
    claude-code-task-template.md
    ci-gate-template.md
```

当前项目保留同构源文件：

```text
cc-switch-skills/frontend-design-agent/
```

### 4.2 Skill 触发场景

当用户提出以下需求时必须使用：

- 根据 PRD、原型、MasterGo 生成前端设计书
- 生成 AI 可落地开发版设计书
- 把 PRD 转成 Claude Code 可执行任务
- 把前端设计书转成 Fact Set
- 建立前端 Agent / MCP / Skill 工作流

### 4.3 Skill 输入协议

| 输入 | 必填 | 说明 |
| ---- | ---- | ---- |
| PRD / Spec | 是 | 业务目标、需求模块、验收标准 |
| MasterGo 图层链接 | 否 | 有则必须抽 DSL |
| 原型链接 / 截图 | 否 | 补充交互和布局 |
| 现有代码库路径 | 是 | 用于 Evidence |
| 公司组件库路径或文档 | 是 | 用于组件复用 |
| API 文档 / Mock | 否 | 缺失时基于项目命名约定推导并标待确认 |

### 4.4 Skill 输出协议

| 输出 | 内容 |
| ---- | ---- |
| `spec.md` | PRD 的结构化规格 |
| `requirements.md` | 结构化需求 |
| `facts.md` | Evidence 汇总 |
| `frontend-design.md` | AI 可执行前端设计书 |
| `fact-set.yaml` | 可验证事实 |
| `claude-code-task.md` | 编码 Agent 任务包 |
| `ci-gate.md` | 验收和合并门禁 |

## 5. MCP 设计

### 5.1 MCP 优先级

| 场景 | 首选 MCP | 降级方式 |
| ---- | -------- | -------- |
| 代码结构、符号、调用链、影响面 | Codegraph MCP | 只读 RTK 命令 |
| PRD 链接、原型链接、内部系统 | Chrome DevTools MCP | 用户导出 Markdown/PDF/截图 |
| MasterGo 图层 | MasterGo MCP | 用户导出 DSL 或截图 |

### 5.2 Codegraph 使用规则

必须优先使用：

- `codegraph_status`
- `codegraph_files`
- `codegraph_context`
- `codegraph_explore`
- `codegraph_impact`

Codegraph 未初始化时：

```text
1. 记录阻塞项：Codegraph 未初始化
2. 建议执行：codegraph init
3. 如用户要求继续，则使用只读 RTK 命令降级
4. 所有降级 Evidence 标记可信度为 Fallback
```

### 5.3 Chrome DevTools 使用规则

链接访问优先使用 Chrome DevTools MCP，适用：

- PRD 链接
- 原型链接
- 内部组件库文档
- 登录态系统页面
- 线上参考页面

### 5.4 MasterGo MCP 使用规则

检测到 `mastergo.com`、`fileId`、`layerId` 时必须：

1. 解析链接参数。
2. 调用 `mastergo-magic-mcp.getDsl`。
3. 输出 DSL Evidence。
4. 映射页面结构和组件层级。
5. 标记无法识别的图层为 TODO，而不是编造。

## 6. Prompt 设计

### 6.1 角色约束

```text
你是资深前端架构师、Agent Architect 和 Applied AI Engineer。
你的目标不是让 AI 猜需求，而是构建让 AI 能持续高质量工作的系统。
你必须先收集 Evidence，再输出设计。
```

### 6.2 Evidence 约束

```text
所有设计结论必须来自以下来源之一：
- PRD / Spec
- MasterGo DSL / 原型 / 截图
- 现有代码库
- 公司前端组件库
- API 文档 / Mock

无法验证的内容必须标记为待确认，并给出临时方案。
```

### 6.3 设计书约束

```text
每个模块必须包含：
- 页面结构与路由
- UI 布局与交互契约
- 字段字典
- API 契约
- 组件复用与新建组件契约
- 状态、缓存与数据链路
- 权限、校验与状态机
- 异常、边界与性能
- 实现步骤
- Given/When/Then 验收标准
```

### 6.4 实现约束

```text
输出必须能被 Claude Code 直接执行。
设计书必须包含文件变更计划、接口路径、字段类型、组件 props、状态机、测试场景和阻塞 TODO。
禁止使用“按 PRD”“按原型”“参考设计稿”等不可执行描述。
```

## 7. 实现方案

### 7.1 当前项目改造

| 文件/目录 | 变更 |
| --------- | ---- |
| `frontDesignAgent.md` | 从理念文档升级为系统落地文档 |
| `cc-switch-skills/frontend-design-agent/SKILL.md` | 新增 Skill 源信息 |
| `cc-switch-skills/frontend-design-agent/references/` | 新增模板和工作流 |

### 7.2 cc-switch 安装

把当前项目中的 skill 源同步到：

```text
/Users/amoy/.cc-switch/skills/frontend-design-agent/
```

同步后执行：

```bash
rtk /Users/amoy/.cc-switch/skills/gen-index.sh
```

### 7.3 生成前端设计书的执行顺序

1. 读取用户 PRD、已有 Spec、MasterGo、原型和组件库输入。
2. 如果没有 Spec，先生成 `spec.md`；如果已有 Spec，先核对 PRD 与 Spec 是否一致。
3. 使用 Chrome DevTools MCP 访问链接材料。
4. 使用 MasterGo MCP 获取 DSL。
5. 使用 Codegraph MCP 获取代码事实。
6. 输出提纲版，确认模块边界。
7. 输出 AI 可落地版前端设计书。
8. 生成 Fact Set。
9. 生成 Claude Code 任务包。
10. 生成 CI Gate。

## 8. 风险与优化

| 风险 | 处理方式 |
| ---- | -------- |
| PRD 和原型冲突 | PRD 业务规则优先，原型作为交互和布局 Evidence，冲突进入 TODO |
| MasterGo 图层命名混乱 | 结合 DSL 层级、尺寸、文本、组件形态推断 |
| 组件库文档缺失 | 从现有代码使用方式反推组件契约 |
| Codegraph 未初始化 | 提示初始化；降级 Evidence 标记 `Fallback` |
| 设计书过度自然语言化 | 强制字段字典、API 表、状态机、验收表 |
| TODO 过多 | 超过 15 个 TODO 时回到 Evidence 采集阶段 |

## 9. 使用记录与文件变更

本系统落地时必须在最终回复中说明：

- 使用了哪些 skills
- 使用了哪些 MCP
- 修改了哪些文件
- 哪些验证已完成
- 哪些阻塞项仍存在
