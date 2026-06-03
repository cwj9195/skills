# claude-code-task.md 模板（v2.1）

| 项目 | 内容 |
| ---- | ---- |
| 任务包名称 | TODO |
| 来源 requirements | `requirements.md` |
| 来源 code-reference | `code-reference.md` |
| 来源 design | `frontend-design.md` |
| 状态 | [ ] 草稿 [ ] 可执行 [ ] 已完成 |
| /analyze 自审结果 | TODO（通过 N/6） |
| /verify 验证结果 | TODO（通过 N/6） |

## 1. 执行边界

| 项目 | 内容 |
| ---- | ---- |
| 任务目标 | TODO |
| 必须修改 | TODO |
| 禁止修改项 | 不改无关模块、不弱化测试、不扩大 exclusions、不改已确认接口语义 |
| 前置依赖 | TODO |
| 阻塞 TODO | TODO |

## 2. 必读输入（按优先级）

| 顺序 | 文件 | 用途 | 必读 |
| ---- | ---- | ---- | ---- |
| 1 | `code-reference.md` | 代码模式参考（最先读，理解项目怎么写的） | 是 |
| 2 | `frontend-design.md` | 模块实现方案（引用 code-reference 章节） | 是 |
| 3 | `requirements.md` | 需求范围、字段、权限、验收 + 澄清记录 | 是 |

> **v2 变更**：`facts.md`、`fact-set.yaml`、`ci-gate.md` 已删除，相关内容合并进 design 和 requirements。

## 3. 任务清单

### 3.{N} M{N} {模块名}

| 任务 ID | 任务名称 | 涉及文件 | 前置依赖 | 验证步骤 | 完成标准（代码级） |
| ------- | -------- | -------- | -------- | -------- | ------------------ |
| T-M{N}-01 | TODO | TODO | TODO | 见下方 | 见下方 |

#### 任务粒度规则（来自 Superpowers）

> **每个任务必须满足以下粒度约束**：
>
> - **时间**：2-5 分钟可由 AI 完成（超出则拆分为子任务）
> - **文件数**：单个任务涉及 ≤ 3 个文件（超出则拆分）
> - **代码量**：单个任务产出 ≤ 100 行新代码（超出则拆分）
> - **原子性**：任务完成后可以独立编译/运行，不依赖后续任务
>
> **拆分标记**：如果一个任务被拆分，用 `-a`、`-b` 后缀标记，并在前置依赖中标注顺序。
>
> 示例：
> ```
> T-M3-04-a  创建 SpuSkuTable 组件骨架        → 1 个文件，~60 行
> T-M3-04-b  SpuSkuTable 合并行逻辑 + spanMethod → 1 个文件，~80 行
> T-M3-04-c  SpuSkuTable 跨页排序 + 列配置      → 2 个文件，~50 行
> ```

#### 验证步骤规则

> 每个任务必须有验证步骤，写在「验证步骤」列中：
>
> ```
> 1. TypeScript 编译通过：npx tsc --noEmit --project apps/pim/tsconfig.json
> 2. 文件存在且非空
> 3. import 路径可解析
> ```

#### 完成标准写法（v2 核心改进）

> ❌ v1 写法（模糊）：`列表加载+筛选+分页`
>
> ✅ v2 写法（代码级断言）：
> ```
> - createPage 返回 { api: { list, autoLoad:true }, form: { body: {...} }, table: { plugins: [...], vxeProps: {...} } }
> - api.list 调用 useRequest('/goods/{module}/page', { ...params, sortRule })
> - 分页: pageField:'current', pageSizeField:'size'
> - form.body 包含: fieldA(text), fieldB(vendor:multi), fieldC(dict)
> - table.columns 包含 N 列
> - 权限: codes.view/edit 已注册
> ```
>
> **断言检查**：每个完成标准条目必须能转成以下伪代码形式：
> ```
> assert file('path/to/file').contains('expected code pattern')
> assert file('path/to/file').exports('expectedSymbol')
> assert tsc('--noEmit').passes
> ```
> 不能转成断言的完成标准 → 必须改写。

## 4. 验收与回归

### 4.1 核心场景验收

| 场景 | Given | When | Then | 验证方式 |
| ---- | ----- | ---- | ---- | -------- |
| TODO | TODO | TODO | TODO | e2e / unit / contract |

### 4.2 Regression Check

> 列出必须回归的已有功能，防止新代码破坏旧功能。
> **证据优于声明**：回归必须通过实际运行验证，不接受"已确认无影响"等模糊声明。

- TODO

### 4.3 Defensive Code

> 列出必须防御的场景。

- API 返回空数据时不崩溃
- TODO（其他防御场景）

## 5. /verify 验证记录

> 任务包写完后，执行以下验证并记录结果。

| 检查项 | 标准 | 结果 | 备注 |
| ------ | ---- | ---- | ---- |
| 任务粒度 | 每个任务 2-5 分钟，≤ 3 文件，≤ 100 行 | ✅ / ❌ | TODO |
| 精确文件路径 | 每个任务列出精确文件路径 | ✅ / ❌ | TODO |
| 验证步骤 | 每个任务有明确验证步骤 | ✅ / ❌ | TODO |
| 完成标准可断言 | 每个标准能转成 assert 伪代码 | ✅ / ❌ | TODO |
| 依赖关系 | 前置依赖正确标注 | ✅ / ❌ | TODO |
| 回归覆盖 | 回归清单覆盖已有功能 | ✅ / ❌ | TODO |
