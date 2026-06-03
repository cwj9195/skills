# Front Design Agent v2 工作流

## 1. 状态机（v2.1 完整版）

| 状态 | 进入条件 | 行为 | 下一状态 |
| ---- | -------- | ---- | -------- |
| `initial` | 收到 PRD、原型、MasterGo 或设计书需求 | 识别输入材料、判断模式 | `clarify` / `outline` |
| **`clarify`**（新增） | 收到需求材料 | **苏格拉底式澄清：分段提问，消除歧义** | `outline` |
| `outline` | 澄清完成，或只给 PRD/原型 | 输出提纲版（分段呈现） | `confirm` |
| `confirm` | 提纲版已输出 | 等待用户确认模块、页面、优先级 | `evidence` |
| `evidence` | 用户要求 AI 落地版或已确认提纲 | 使用 MCP 采集 Evidence | `code_ref` |
| `code_ref` | Evidence 达标 | **CodeReferenceAgent：提取项目级代码模式** | `design` / `repair` |
| `design` | code-reference.md 已生成 | 生成模块实现方案（引用 code-reference，分段呈现） | **`analyze`** |
| **`analyze`**（新增） | frontend-design.md 已生成 | **强制自审：模拟实现测试 + 交叉引用检查** | `task` / `design` / `repair` |
| `task` | 自审通过 | 生成代码级完成标准的任务包（粒度 2-5 分钟） | `verify` |
| **`verify`**（新增） | claude-code-task.md 已生成 | **验证：任务粒度检查 + 完成标准可断言检查** | `done` / `task` |
| `repair` | Evidence 不足 / 自审不通过 / 验证失败 | 列阻塞项和临时方案 | `clarify` / `confirm` / `evidence` |
| `done` | 全部验证通过 | 交付 4 份文档 | — |

### 状态转换图

```text
initial → clarify → outline → confirm → evidence → code_ref → design → analyze → task → verify → done
              ↑         ↑        ↑          |           |        |        |        |        |
              |         |        |          └── repair ←┘        |        |        |        |
              |         |        └──────────── repair ←──────────┘        |        |        |
              |         └────────────────────── repair ←──────────────────┘        |        |
              └────────────────────────────── repair ←─────────────────────────────┘        |
```

### 关键变更（v1 → v2 → v2.1）

| v1 | v2 | v2.1 | 原因 |
| -- | -- | ---- | ---- |
| 无澄清 | 无澄清 | **clarify 阶段** | 消除歧义比赶进度重要（Spec Kit） |
| 直接生成 | 直接生成 | **analyze 自审** | 必须验证"只看 design 能否写代码"（Spec Kit） |
| 无验证 | 无验证 | **verify 阶段** | 任务粒度 + 完成标准可断言（Superpowers） |
| evidence → design | evidence → code_ref → design | evidence → code_ref → design → **analyze** | 没有自审的设计书不可信 |

## 2. `/clarify` 苏格拉底式澄清阶段（来自 Spec Kit）

### 触发条件

收到 PRD 或需求材料后，**必须先进入 clarify 阶段**，不可跳过。

### 执行规则

1. **分段提问**：不要一次性抛出 20 个问题。每轮最多 3-5 个问题，等用户回答后再问下一轮。
2. **聚焦关键歧义**：
   - 边界条件（数据为空、超长、并发、权限不足时怎么处理？）
   - 异常路径（网络超时、接口失败、表单校验失败时的 UI 表现？）
   - 权限差异（不同角色看到的内容差异？按钮显隐规则？）
   - 模块交互（跨模块的数据流？共享状态？路由跳转？）
3. **记录澄清结论**：每轮澄清结论写入 requirements.md 的「澄清记录」段落。
4. **PRD 矛盾处理**：如果 PRD 本身有矛盾，记录到 TODO 并给出推荐方案，让用户选择。
5. **退出条件**：所有模块的关键歧义已消除（至少每个模块问了 2 个问题）。

### 澄清问题模板

```text
## 澄清轮次 {N}

### Q1: {模块名} - {边界/异常/权限/交互}
{具体问题描述}
- A) {选项A}
- B) {选项B}
- C) {选项C}

### Q2: ...
```

## 3. `/analyze` 强制自审阶段（来自 Spec Kit）

### 触发条件

frontend-design.md 写完后，**必须执行自审**，不可跳过。

### 自审检查项（逐条执行）

| 序号 | 检查项 | 验证方法 | 不通过动作 |
| ---- | ------ | -------- | ---------- |
| 1 | **模拟实现** | 只看 code-reference.md + design 的某个模块，尝试写出 index.tsx 骨架 | 回补缺失的代码骨架 |
| 2 | **代码粘贴测试** | design 中"可直接粘贴"的代码块，检查语法和 import 路径 | 修正代码 |
| 3 | **完成标准测试** | 每个任务完成标准能否写成 assert 断言 | 改写为代码级断言 |
| 4 | **交叉引用** | design 引用的 code-reference 章节号是否真实存在 | 修正引用 |
| 5 | **缺失模式** | 是否有模块需要 code-reference 未覆盖的代码模式 | 回补新章节 |
| 6 | **粒度检查** | 每个任务是否可在 2-5 分钟内完成 | 拆分过大的任务 |

### 自审结果输出格式

```text
## /analyze 自审结果

| 序号 | 检查项 | 结果 | 缺失内容 | 回补动作 |
| ---- | ------ | ---- | -------- | -------- |
| 1 | 模拟实现 | ✅ / ❌ | TODO | TODO |
| 2 | 代码粘贴 | ✅ / ❌ | TODO | TODO |
| 3 | 完成标准 | ✅ / ❌ | TODO | TODO |
| 4 | 交叉引用 | ✅ / ❌ | TODO | TODO |
| 5 | 缺失模式 | ✅ / ❌ | TODO | TODO |
| 6 | 粒度检查 | ✅ / ❌ | TODO | TODO |

通过：{N}/6
```

### 退出条件

- ✅ 6/6 通过 → 进入 `task` 阶段
- ⚠️ 4-5/6 通过 → 就地回补缺失内容，重新自审
- ❌ ≤ 3/6 通过 → 回到 `evidence` 阶段重新采集

## 4. `verify` 最终验证阶段（来自 Superpowers）

### 触发条件

claude-code-task.md 写完后执行。

### 验证检查项

| 检查项 | 标准 | 验证方法 |
| ------ | ---- | -------- |
| 任务粒度 | 每个任务 2-5 分钟可完成 | 检查任务涉及文件数和代码量 |
| 精确文件路径 | 每个任务列出精确的文件路径 | grep 检查 TODO 路径 |
| 验证步骤 | 每个任务有明确的验证步骤 | 检查每个任务是否有"验证"段落 |
| 完成标准可断言 | 完成标准能转成 assert | 尝试把标准写成伪代码断言 |
| 依赖关系 | 任务间依赖正确标注 | 检查前置依赖是否已定义 |
| 回归覆盖 | 回归检查清单覆盖已有功能 | 对比现有模块列表 |

## 5. 分段呈现规则（来自 Superpowers）

### 核心原则

不要一次性抛出 500 行的长文档。分段呈现，让用户逐段确认。

### 执行规则

| 文档 | 分段方式 | 每段长度 |
| ---- | -------- | -------- |
| requirements.md | 按模块分段，每段 1 个模块 | ≤ 100 行/段 |
| code-reference.md | 按代码模式分段，每段 1 个模式 | ≤ 80 行/段 |
| frontend-design.md | 按模块分段，先完整模块再差异模块 | ≤ 150 行/段 |
| claude-code-task.md | 按模块分段，每段 1 个模块的任务清单 | ≤ 100 行/段 |

### 分段呈现流程

```text
1. 呈现第 1 段 → 等用户确认 → 呈现第 2 段 → 等用户确认 → ...
2. 如果用户对某段有修改意见 → 就地修改 → 重新确认 → 继续下一段
3. 全部段落确认后 → 合并为完整文档
```

### 例外

- 用户明确说"一次性输出"时，可以不分段
- 提纲版可以一次性输出（因为它本身是概览）

## 6. 输入处理

| 输入 | 处理方式 | Evidence |
| ---- | -------- | -------- |
| PRD | 抽取业务目标、用户故事、需求项、验收、边界 | `PRD(section:line)` |
| Spec | 合并进 requirements.md 第 0 章 | `Spec(section:line)` |
| MasterGo 链接 | 解析 `fileId`、`layerId`，调用 DSL | `MasterGo(fileId:layerId)` |
| 原型链接 | Chrome DevTools MCP 打开并提取页面流程 | `Prototype(url/page)` |
| 代码库 | Codegraph MCP 读取结构、路由、接口、组件、**代码模式** | `Evidence(path:line)` |
| 组件库 | 从文档或代码使用方式提取 props、slots、事件 | `Evidence(path:line)` |
| API 文档 | 提取 method、path、入参、出参、错误码 | `API(doc:section)` |
| **澄清记录** | 用户回答的澄清问题 | `Clarify(round:question)` |

## 7. MCP 使用规则

### Codegraph

优先顺序：

1. `codegraph_status`
2. `codegraph_files`
3. `codegraph_context` — **提取代码模式的关键入口**
4. `codegraph_explore` — **深入读取具体实现**
5. `codegraph_impact`

CodeReferenceAgent 的 Codegraph 探索顺序：

```text
1. codegraph_context("项目中最完整的列表页实现") → 找到参考页
2. codegraph_explore(参考页的关键符号) → 读取完整实现
3. codegraph_context("表单字段工厂") → 提取 formItem 工厂
4. codegraph_context("请求层 APIMap") → 提取请求模式
5. codegraph_context("路由注册") → 提取路由模式
6. codegraph_context("权限控制") → 提取权限模式
...（按需扩展）
```

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

**DSL 结果处理规则**

DSL 返回的 JSON 可能很大（数百 KB），处理策略：

1. 如果 DSL 数据 ≤ 50KB，直接内联到 frontend-design.md
2. 如果 DSL 数据 > 50KB，提取关键结构（组件树、尺寸、布局），生成精简版
3. 提取时关注：容器布局（flex/grid）、组件类型和嵌套层级、间距和尺寸 token
4. 忽略：纯装饰节点、重复的原子元素

## 8. Evidence 可信度

| 可信度 | 定义 |
| ------ | ---- |
| `Verified` | 来自 Codegraph、MasterGo DSL、API 文档或明确 PRD 行 |
| `Inferred` | 基于现有命名约定、相邻模块实现推导 |
| `Fallback` | Codegraph 或链接不可用时，用只读命令、截图或用户描述补充 |
| `Unverified` | 无可验证来源，必须进入 TODO |
| `Clarified`（新增） | 来自用户在 clarify 阶段的明确回答 |

## 9. 输出顺序（v2 精简版）

| 顺序 | 文档 | 说明 |
| ---- | ---- | ---- |
| 1 | `requirements.md` | 需求事实 + 澄清记录 |
| 2 | `code-reference.md` | 代码参考手册 |
| 3 | `frontend-design.md` | 模块实现方案（引用 code-reference） |
| 4 | `claude-code-task.md` | 编码任务包（代码级完成标准，粒度 2-5 分钟） |

## 10. 自检门槛（v2.1 完整版）

### requirements.md 自检

- [ ] 每个模块有清晰的字段、权限、验收标准
- [ ] 包含澄清记录（clarify 阶段的结论）
- [ ] 所有 Given/When/Then 验收标准覆盖核心场景

### code-reference.md 自检

- [ ] 至少覆盖 10 个核心代码模式
- [ ] 每个模式都有完整的 TypeScript 签名
- [ ] 每个模式都有至少 1 个来自现有代码的真实使用范例
- [ ] 所有 import 路径都是 Verified（来自 Codegraph）
- [ ] /analyze 自审中「缺失模式」检查通过

### frontend-design.md 自检

- [ ] 每个模块都引用了 code-reference.md 的章节号
- [ ] 每个模块都给出了具体的文件路径（可创建的文件列表）
- [ ] 每个模块都有可粘贴的代码骨架
- [ ] 核心模块（P0）写完整版，其余模块写差异版
- [ ] MasterGo DSL 数据已注入对应模块的 UI 布局章节
- [ ] /analyze 自审中「模拟实现」检查通过

### claude-code-task.md 自检

- [ ] 每个任务的完成标准是代码级断言，而非模糊描述
- [ ] 完成标准引用 createPage/useFormItem/useRequest 等具体 API
- [ ] 任务间的依赖关系正确标注
- [ ] 每个任务粒度 2-5 分钟，超过的已拆分
- [ ] 每个任务包含精确文件路径、完整代码片段、验证步骤
- [ ] verify 阶段所有检查项通过
