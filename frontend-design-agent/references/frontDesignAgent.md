# FrontDesignAgent v2.1：前端设计书生成系统

## 1. 问题分析

### v1 的核心问题

| 问题 | 影响 | v2 解决方式 |
| ---- | ---- | ----------- |
| 7 份文档冗余严重 | spec↔requirements 重叠 70%，fact-set↔ci-gate 重叠 80% | **精简为 4 份文档** |
| 缺少代码级模板 | API 签名和用法只写名字不写签名 | **新增 code-reference.md** |
| 设计数据是推断的 | MasterGo DSL 未实际调用 | **强制 DSL 采集** |
| 完成标准太模糊 | "列表加载+筛选+分页"无法指导 AI | **代码级完成标准** |
| 13 章固定章节过重 | 小模块也写 13 章，填充废话 | **完整版 vs 差异版** |
| **无澄清阶段** | 歧义未消除就开始写文档 | **`/clarify` 苏格拉底式澄清** |
| **无自审验证** | design 写完不知道能不能用 | **`/analyze` 模拟实现测试** |
| **任务粒度无控制** | 一个大任务 AI 写半天 | **2-5 分钟粒度 + `/verify`** |

### v2.1 设计原则

- **设计书不是文档，是代码的蓝图**：AI 拿到后能直接写出可运行代码
- **code-reference.md 是基石**：没有代码参考手册，design 就是空中楼阁
- **4 份文档，各有分工**：requirements（做什么）→ code-reference（怎么写）→ design（具体方案）→ task（做哪些）
- **先提取再设计**：CodeReferenceAgent 先于 DesignDocAgent 运行
- **澄清先于文档**：消除歧义比赶进度重要（来自 Spec Kit）
- **证据优于声明**：所有"已完成"必须有可验证证据（来自 Superpowers）
- **分段呈现**：不要一次性抛出长文档，逐段确认（来自 Superpowers）

### 方法论来源

| 来源 | 核心理念 | 引入的能力 |
| ---- | -------- | ---------- |
| **Spec Kit**（GitHub） | 规格驱动开发，spec 是活的可执行产物 | `/clarify`（苏格拉底式澄清）、`/analyze`（模拟实现测试）、多步骤迭代精炼 |
| **Superpowers**（obra） | 完整开发方法论，TDD、系统化、降低复杂度 | 任务粒度控制（2-5 分钟）、分段呈现、证据优于声明、两阶段审查 |

## 2. 系统架构

### 2.1 总体架构（v2 精简版）

```text
输入材料
  ├─ PRD / Spec / 验收标准
  ├─ MasterGo 图层链接 / 原型 / 截图
  ├─ 现有代码库
  └─ 公司前端组件库
        ↓
InputCollectorAgent（收集材料）
        ↓
RequirementStructAgent（→ requirements.md）
        ↓
CodeReferenceAgent（→ code-reference.md）★ v2 核心新增
        ↓
PrototypeFactAgent（→ DSL 数据注入 design）
        ↓
DesignDocAgent（→ frontend-design.md）
        ↓
TaskAgent（→ claude-code-task.md）
```

### 2.2 标准产物（v2 精简版）

| 产物 | 职责 | 给谁 |
| ---- | ---- | ---- |
| `requirements.md` | 需求事实：模块、字段、权限、验收标准 | DesignDocAgent + 实现 Agent |
| `code-reference.md` | 代码模式：API 签名、用法范例、注意事项 | DesignDocAgent + 实现 Agent |
| `frontend-design.md` | 模块实现方案：引用 code-reference，给出具体代码 | 实现 Agent |
| `claude-code-task.md` | 编码任务包：代码级完成标准 | 实现 Agent |

### 2.3 v1 删除的产物

| 产物 | 删除原因 |
| ---- | -------- |
| `spec.md` | 与 requirements.md 重叠 70%，合并为 requirements 第 0 章 |
| `facts.md` | 只描述事实不给代码，升级为 code-reference.md |
| `fact-set.yaml` | 验收标准合并进 frontend-design.md 各模块验收章节 |
| `ci-gate.md` | 空壳，等实际写测试时再生成 |

### 2.4 主流程（v2.1 完整版）

```text
输入材料
↓
⓪ /clarify：苏格拉底式澄清（分段提问，消除歧义）
   └─ 每模块至少 2 个澄清问题
   └─ 结论记录到 requirements.md「澄清记录」
↓
① InputCollectorAgent：收集 PRD/MasterGo/原型/代码/组件库
↓
② RequirementStructAgent：PRD + 澄清记录 → requirements.md
   └─ 分段呈现，每段 1 个模块
↓
③ CodeReferenceAgent：Codegraph 提取项目级代码模式 → code-reference.md
   ├─ 列表页工厂（签名+范例）
   ├─ 表单项工厂（所有工厂方法）
   ├─ 工具栏插件
   ├─ 抽屉/弹窗模式
   ├─ 脏数据检测
   ├─ 请求层
   ├─ 路由注册
   ├─ 权限控制
   ├─ 状态管理
   ├─ 导出功能
   └─ 审批流
↓
④ PrototypeFactAgent：MasterGo DSL → 提取布局/尺寸/组件树
↓
⑤ DesignDocAgent：引用 code-reference + DSL 数据 → frontend-design.md
   ├─ P0 模块写完整版（所有代码骨架）
   └─ 其余模块写差异版（只写与完整版的差异）
↓
⑥ /analyze：强制自审（模拟实现测试 + 交叉引用检查）
   └─ 6 项检查，≥ 4/6 通过 → 继续
   └─ ≤ 3/6 通过 → 回退到 evidence 重新采集
↓
⑦ TaskAgent：引用 design → claude-code-task.md
   ├─ 代码级完成标准（可转 assert）
   ├─ 任务粒度 2-5 分钟
   └─ 每个任务含验证步骤
↓
⑧ /verify：最终验证（粒度 + 断言 + 依赖 + 回归）
   └─ 6 项检查全部通过 → done
   └─ 有检查不通过 → 回退到 task 修正
```

## 3. Agent 设计

### 3.1 InputCollectorAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 收集并归档所有输入材料 |
| 输入 | 用户链接、本地文件、截图、补充说明 |
| 输出 | 输入清单、访问状态、材料缺口 |
| 禁止 | 不做需求推断，不生成设计结论 |

### 3.2 RequirementStructAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 把 PRD 转成结构化 requirements |
| 输入 | PRD、已有 Spec（如有）、业务补充 |
| 输出 | `requirements.md`（含原 spec.md 内容） |
| 禁止 | 不写实现细节，不选择组件库 |

### 3.3 CodeReferenceAgent（v2 核心新增）

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 从现有代码中提取项目级代码模式 |
| 输入 | 代码库路径、组件库路径 |
| 输出 | `code-reference.md` |
| 首选 MCP | Codegraph MCP |
| **关键约束** | **此 Agent 的输出是 DesignDocAgent 的前置依赖** |

提取模式（按项目技术栈调整）：

| 序号 | 模式 | Codegraph 入口查询 |
| ---- | ---- | ------------------ |
| 1 | 列表页工厂 | `codegraph_context("最完整的列表页")` |
| 2 | 表单项工厂 | `codegraph_context("表单字段工厂 useFormItem")` |
| 3 | 工具栏插件 | `codegraph_search("usePlugin")` |
| 4 | 抽屉/弹窗 | `codegraph_context("新增编辑抽屉")` |
| 5 | 脏数据检测 | `codegraph_context("脏数据 diff changed")` |
| 6 | 请求层 | `codegraph_context("请求 request APIMap")` |
| 7 | 路由注册 | `codegraph_context("路由 route config")` |
| 8 | 权限控制 | `codegraph_context("权限 permission codes")` |
| 9 | 状态管理 | `codegraph_context("状态管理 store")` |
| 10 | 导出功能 | `codegraph_context("导出 export download")` |
| 11 | 审批流 | `codegraph_context("审批 approval")` |

**每个模式必须输出**：
- 完整的 TypeScript 签名（从代码中提取，不是猜测）
- 至少 1 个来自现有代码的真实使用范例
- 注意事项（踩坑点、特殊处理、与其他模式的交互）

### 3.4 PrototypeFactAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 从 MasterGo/原型中提取页面事实 |
| 输入 | MasterGo 图层链接、原型链接、截图 |
| 输出 | 布局数据（注入 frontend-design.md 对应模块） |
| 首选 MCP | MasterGo MCP、Chrome DevTools MCP |

v2 DSL 处理规则：
- DSL ≤ 50KB：直接内联
- DSL > 50KB：提取关键结构（组件树、尺寸、布局），忽略纯装饰节点

### 3.5 DesignDocAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 生成模块实现方案 |
| 输入 | `requirements.md`、`code-reference.md`、DSL 数据 |
| 输出 | `frontend-design.md` |
| **关键约束** | **必须引用 code-reference.md 的章节号** |

v2 模块结构：
- P0 核心模块：**完整版**（所有代码骨架、文件清单、路由/API/Store 注册代码）
- 其余模块：**差异版**（只写与完整版的差异部分）

### 3.6 TaskAgent

| 项目 | 内容 |
| ---- | ---- |
| 目标 | 生成代码级完成标准的任务包 |
| 输入 | `frontend-design.md`、`code-reference.md` |
| 输出 | `claude-code-task.md` |
| **关键约束** | **完成标准必须是代码级断言** |

完成标准示例：
- ❌ `列表加载+筛选+分页`
- ✅ `createPage 返回 { api: { list, autoLoad:true }, form: { body: { fieldA(text), fieldB(vendor:multi) } }, table: { plugins: [usePluginBtn, usePluginDel], vxeProps: { height:'100%' } } }`

## 4. MCP 设计

### 4.1 MCP 优先级

| 场景 | 首选 MCP | 降级方式 |
| ---- | -------- | -------- |
| 代码结构、符号、调用链 | Codegraph MCP | 只读 RTK 命令 |
| PRD/原型/组件库文档 | Chrome DevTools MCP | 用户导出文件 |
| MasterGo 图层 | MasterGo MCP | 用户导出 DSL |

### 4.2 CodeReferenceAgent 的 Codegraph 使用

```text
1. codegraph_status → 确认索引就绪
2. codegraph_files → 了解项目结构
3. codegraph_context("关键模式") → 找到模式入口
4. codegraph_explore(入口符号) → 深入读取实现
5. codegraph_node(具体符号) → 获取签名和源码
```

## 5. Prompt 设计

### 5.1 ClarifyAgent 角色约束（v2.1 新增）

```text
你是需求澄清专家。
你的任务不是写文档，而是通过苏格拉底式提问消除需求歧义。
每轮最多 3-5 个问题。分段呈现，等用户回答后再继续。
问题聚焦：边界条件、异常路径、权限差异、模块交互。
禁止跳过澄清直接生成文档。
```

### 5.2 CodeReferenceAgent 角色约束

```text
你是代码模式提取专家。
你的任务是从现有项目中提取可复用的代码模式，而不是设计新模式。
每个模式必须有：完整签名、真实代码范例、注意事项。
禁止编造签名。禁止使用伪代码。所有代码必须来自实际文件。
```

### 5.3 DesignDocAgent 角色约束

```text
你是前端设计专家。
你必须先读取 code-reference.md，理解项目怎么写的，然后设计新模块怎么写。
每个模块必须引用 code-reference 的章节号。
禁止使用"按 PRD""参考设计稿"等不可执行描述。
分段呈现：每段 1 个模块，等用户确认后再继续。
```

### 5.4 AnalyzeAgent 角色约束（v2.1 新增）

```text
你是设计书审查专家。
你的任务是用 6 项检查验证 design 能否让 AI 直接写代码。
最关键的一项：只看 code-reference.md + design，你能否写出该模块完整的 index.tsx？
如果不能，标注缺失信息并要求回补。
自审结果必须用表格输出，不可用模糊的"基本满足"。
```

### 5.5 TaskAgent 角色约束

```text
你是任务分解专家。
每个任务必须满足：2-5 分钟粒度、≤ 3 个文件、≤ 100 行新代码。
完成标准必须能转成 assert 伪代码，不可用模糊描述。
每个任务必须包含验证步骤。
```

## 6. 质量门禁（v2.1 完整版）

### 6.1 requirements.md 门禁

| 检查项 | 标准 |
| ------ | ---- |
| 澄清记录 | 每个模块 ≥ 2 个澄清问题已回答 |
| 模块覆盖 | 所有 PRD 模块已覆盖 |
| 验收标准 | 每个模块有 Given/When/Then |

### 6.2 code-reference.md 门禁

| 检查项 | 标准 |
| ------ | ---- |
| 模式覆盖 | ≥ 10 个核心代码模式 |
| 签名完整性 | 每个模式有完整 TypeScript 签名 |
| 范例真实性 | 每个模式有 ≥ 1 个真实代码范例 |
| import 路径 | 所有路径 Verified（来自 Codegraph） |

### 6.3 frontend-design.md 门禁

| 检查项 | 标准 |
| ------ | ---- |
| code-reference 引用 | 每个模块引用 ≥ 1 个章节号 |
| 文件清单 | 每个模块给出可创建的文件列表 |
| 代码骨架 | P0 模块有完整可粘贴代码 |
| DSL 数据 | 有 MasterGo 链接的模块注入了布局数据 |

### 6.4 /analyze 自审门禁（v2.1 新增）

| 检查项 | 标准 | 不通过动作 |
| ------ | ---- | ---------- |
| 模拟实现 | 只看 code-reference + design 能写出 index.tsx | 回补代码骨架 |
| 代码粘贴 | "可粘贴"代码语法正确、import 路径存在 | 修正代码 |
| 完成标准 | 每个任务完成标准能写成 assert | 改写为断言 |
| 交叉引用 | design 引用的章节号真实存在 | 修正引用 |
| 缺失模式 | 无模块需要未覆盖的代码模式 | 回补章节 |
| 粒度检查 | 每个任务 2-5 分钟 | 拆分任务 |

**退出条件**：≥ 4/6 通过 → 继续；≤ 3/6 → 回退 evidence 重新采集

### 6.5 claude-code-task.md 门禁

| 检查项 | 标准 |
| ------ | ---- |
| 完成标准 | 每个任务是代码级断言 |
| API 引用 | 完成标准引用 code-reference 中的 API |
| 依赖关系 | 任务间依赖正确标注 |
| 任务粒度 | 每个任务 ≤ 3 文件、≤ 100 行 |
| 验证步骤 | 每个任务有明确验证步骤 |

### 6.6 /verify 最终验证门禁（v2.1 新增）

| 检查项 | 标准 | 不通过动作 |
| ------ | ---- | ---------- |
| 粒度检查 | 2-5 分钟/任务 | 拆分过大的任务 |
| 精确路径 | 无 TODO 路径 | 补全路径 |
| 验证步骤 | 每任务有验证步骤 | 补全步骤 |
| 可断言 | 每标准可转 assert | 改写标准 |
| 依赖完整 | 前置依赖已定义 | 修正依赖 |
| 回归覆盖 | 回归清单覆盖已有功能 | 补全清单 |

**退出条件**：6/6 通过 → done；有不通过 → 回退 task 修正

## 7. 风险与优化

| 风险 | v2.1 处理方式 |
| ---- | ----------- |
| Codegraph 未初始化 | 提示初始化；降级 Evidence 标记 Fallback |
| MasterGo DSL 数据过大 | 提取关键结构，生成精简版 |
| 项目代码模式不统一 | 选最具代表性的实现，标注差异 |
| 新需求无现有参考 | 标注为"新模式"，给出推荐实现 |
| design 过度自然语言化 | 强制代码骨架、字段字典表、API 表 |
| **用户拒绝澄清** | 记录"用户跳过澄清"到 TODO，基于最佳实践推断，标注 Unverified |
| **自审循环** | 连续 2 轮自审 ≤ 3/6 → 标记阻塞，要求用户介入 |
| **任务拆分过细** | 如果某模块拆出 > 20 个任务 → 合并同类任务，保持 ≤ 15 |
| **分段呈现拖慢节奏** | 用户明确说"一次性输出"时跳过分段 |

## 8. 与 Spec Kit / Superpowers 的对照

### 从 Spec Kit 引入

| Spec Kit 能力 | 在本 Skill 中的对应 |
| ------------- | ------------------- |
| `/speckit.specify` → spec.md | → requirements.md |
| `/speckit.clarify` → 追加澄清记录 | → `/clarify` 阶段（苏格拉底式提问） |
| `/speckit.plan` → plan.md + research.md | → code-reference.md + frontend-design.md |
| `/speckit.analyze` → 代理审计计划 | → `/analyze` 自审环节（6 项检查） |
| `/speckit.tasks` → tasks.md（带 `[P]` 并行标记） | → claude-code-task.md（代码级完成标准） |
| `/speckit.implement` → 按序执行 | → 交给实现 Agent |
| constitution.md → 项目治理原则 | → requirements.md 第 0 章「公共约定」 |

### 从 Superpowers 引入

| Superpowers 能力 | 在本 Skill 中的对应 |
| ----------------- | ------------------- |
| brainstorming skill → 苏格拉底式设计对话 | → `/clarify` 阶段 |
| writing-plans skill → 计划详细到无上下文也能执行 | → 任务粒度 2-5 分钟 + 精确文件路径 |
| test-driven-development → RED-GREEN-REFACTOR | → 每个任务含验证步骤 |
| requesting-code-review → 预审查清单 | → `/verify` 最终验证 |
| subagent-driven-development → 两阶段审查 | → `/analyze`（规格合规）+ `/verify`（代码质量） |
| 分段呈现设计供确认 | → 分段呈现规则 |
| 证据优于声明 | → 硬约束：所有"已完成"必须有可验证证据 |
