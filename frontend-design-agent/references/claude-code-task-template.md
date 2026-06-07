# implementation-tasks.md 模板（v2.3）

| 项目              | 内容                                                                              |
| ----------------- | --------------------------------------------------------------------------------- |
| 任务包名称        | TODO                                                                              |
| Source Manifest     | [module-index.md#M{N}](../../module-index.md#M{N})                                                                |
| Source requirements-detail     | [requirements-detail.md](requirements-detail.md)                                                                     |
| Source code-reference      | [code-reference.md](code-reference.md)                                                                     |
| Source api-contract      | 以 Manifest 的根级 API 契约路径为准；模块设计目录默认相对路径 [../../api-contract.md](../../api-contract.md) |
| Source frontend-design      | [frontend-design.md](frontend-design.md)                                                                     |
| 状态              | [ ] 草稿 [ ] 可执行 [ ] 已完成                                                    |
| /analyze 自审结果 | TODO（通过 N/6）                                                                  |
| /verify 验证结果  | TODO（通过 N/6）                                                                  |

> **定位**：本文档是实现 Agent 的唯一执行入口，承载任务拆解、门禁命令、回归检查与停止条件。默认不再生成独立 [tasks.md](tasks.md) 或 [ci-gate.md](ci-gate.md)。

## 0. 任务入口发现顺序

当用户只提供模块目录或设计目录时，按以下顺序查找任务入口，找到第一个即停止：

1. 用户显式提供的 [implementation-tasks.md](implementation-tasks.md) 或 legacy [编码任务.md](编码任务.md)。
2. [{模块目录}/design/implementation-tasks.md]({模块目录}/design/implementation-tasks.md)。
3. [{模块目录}/implementation-tasks.md]({模块目录}/implementation-tasks.md)。
4. Legacy fallback：[{模块目录}/设计/编码任务.md]({模块目录}/设计/编码任务.md)。
5. Legacy fallback：[{模块目录}/编码任务.md]({模块目录}/编码任务.md)。

如果用户显式提供 legacy 中文任务包路径，可作为普通输入读取；如本轮需要更新任务包，写回 canonical [design/implementation-tasks.md](design/implementation-tasks.md)，不得同时维护两份任务事实源。

## 1. 执行边界

| 项目       | 内容                                                            |
| ---------- | --------------------------------------------------------------- |
| 任务目标   | TODO                                                            |
| 必须修改   | TODO                                                            |
| 禁止修改项 | 不改无关模块、不弱化测试、不扩大 exclusions、不改已确认接口语义 |
| 前置依赖   | TODO                                                            |
| 阻塞 TODO  | TODO                                                            |

## 2. 必读输入（按优先级）

| 顺序 | 文件                | 用途                                                                | 必读 |
| ---- | ------------------- | ------------------------------------------------------------------- | ---- |
| 1    | [code-reference.md](code-reference.md)       | 代码模式参考（最先读，理解项目怎么写的）                            | 是   |
| 2    | [frontend-design.md](frontend-design.md)       | 模块实现方案（引用 code-reference 章节）                                  | 是   |
| 3    | [requirements-detail.md](requirements-detail.md)       | 需求范围、字段、权限、验收 + 澄清记录                               | 是   |
| 4    | [../../api-contract.md](../../api-contract.md) | 默认接口契约总账；任务涉及接口时读取对应接口 ID，无接口任务确认“无” | 是   |
| 5    | [module-index.md#M{N}](../../module-index.md#M{N})  | Manifest 单一入口源；路径或模块状态不清时回溯当前模块记录           | 否   |

> **v2.3 治理收敛**：[facts.md](facts.md)、[tasks.md](tasks.md)、[ci-gate.md](ci-gate.md)、[agent-prompts.md](agent-prompts.md)、[fact-set.yaml](fact-set.yaml) 默认不生成。
> 需求事实进入 requirements-detail；代码事实进入 code-reference；接口契约进入 api-contract；实现方案进入 frontend-design；任务治理、门禁命令、回归检查和停止条件进入 implementation-tasks。

## 3. 任务清单

### 3.{N} M{N} {模块名}

| 任务 ID   | 目标 | 涉及文件 | 前置依赖 | 需求引用           | 代码引用           | API 引用                               | 骨架/插入点 | 验收断言 | 回归检查 | 验证命令 | 停止条件 |
| --------- | ---- | -------- | -------- | ------------------ | ------------------ | -------------------------------------- | ----------- | -------- | -------- | -------- | -------- |
| [T-M{N}-01](#t-m{N}-01) | TODO | TODO | TODO | [REQ-M{N}-001](requirements-detail.md#req-m{N}-001) | [code-reference §1](code-reference.md#code-ref-1) | [API-M{N}-TODO](../../api-contract.md#api-m{N}-todo) / 无 | TODO | TODO | TODO | TODO | TODO |

<a id="t-m{N}-01"></a>
#### T-M{N}-01 TODO

| 项目 | 内容 |
| ---- | ---- |
| 任务 ID | T-M{N}-01 |
| 需求引用 | [REQ-M{N}-001](requirements-detail.md#req-m{N}-001) |
| 代码引用 | [code-reference §1](code-reference.md#code-ref-1) |
| API 引用 | [API-M{N}-TODO](../../api-contract.md#api-m{N}-todo) / 无 |
| 停止条件 | TODO |

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

#### 字段填写规则

每个任务必须填满以下字段，禁止只写“参考设计实现”：

- `目标`：一句话描述本任务完成后的代码状态。
- `涉及文件`：精确到文件路径链接；新增文件写完整路径链接，例如 `[store.ts](apps/pim/pages/preselected/batch-import/store.ts)`。
- `需求引用`：引用 requirements-detail.md 中真实存在的 ID 或章节，使用 `[REQ-M{N}-001](requirements-detail.md#req-m{N}-001)` 形式。
- `代码引用`：引用 [code-reference.md](code-reference.md) 中真实存在的显式锚点，例如 `[code-reference §1](code-reference.md#code-ref-1)`，禁止使用占位或不存在的假锚点。
- `API 引用`：任务涉及接口时引用 [api-contract.md](../../api-contract.md) 中真实存在的接口 ID，使用 `[API-M{N}-TODO](../../api-contract.md#api-m{N}-todo)` 形式；无接口任务写“无”。
- `骨架/插入点`：给出可粘贴代码骨架、函数名、组件名或明确插入位置。
- `验收断言`：必须能转成 assert 伪代码。
- `回归检查`：列出本任务会影响的点击、回调、权限、disabled、保存或请求链路。
- `验证命令`：写实际可执行命令；项目要求 RTK 时命令必须带 `rtk` 前缀。
- `停止条件`：接口、权限、设计稿、基线失败等无法安全继续时的停止点。
- `接口状态停止条件`：真实联调任务依赖接口状态 `Confirmed`；前端本地骨架或 Mock 至少 `Reviewed`；`Draft` 或接口语义冲突必须停止。

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

| 场景 | Given | When | Then | 验证方式              |
| ---- | ----- | ---- | ---- | --------------------- |
| TODO | TODO  | TODO | TODO | e2e / unit / contract |

### 4.2 Regression Check

> 列出必须回归的已有功能，防止新代码破坏旧功能。
> **证据优于声明**：回归必须通过实际运行验证，不接受"已确认无影响"等模糊声明。
> UI/交互任务必须覆盖入口点击、弹窗确认、`Permission` / `disabled` / `visible` 语义、`onClick` / `onSubmit` / `emit` 到状态写入或保存回调。

- TODO

### 4.3 Gate Commands

> 汇总本任务包交付前必须执行的验证命令；如果存在历史基线失败，必须标明 Evidence 和影响范围。

| 命令 | 目的 | 预期结果 | 历史基线 |
| ---- | ---- | -------- | -------- |
| TODO | TODO | TODO     | TODO     |

### 4.4 Defensive Code

> 列出必须防御的场景。

- API 返回空数据时不崩溃
- TODO（其他防御场景）

## 5. /verify 验证记录

> 任务包写完后，执行以下验证并记录结果。

| 检查项         | 标准                                                    | 结果  | 备注 |
| -------------- | ------------------------------------------------------- | ----- | ---- |
| 任务粒度       | 每个任务 2-5 分钟，≤ 3 文件，≤ 100 行                   | ✅ / ❌ | TODO |
| 精确文件路径   | 每个任务列出精确文件路径链接                                | ✅ / ❌ | TODO |
| 章节引用       | 每个任务引用真实存在的 需求说明/代码参考 章节           | ✅ / ❌ | TODO |
| 接口引用       | 涉及接口的任务引用真实存在的接口 ID，并写明状态停止条件 | ✅ / ❌ | TODO |
| 验证命令       | 每个任务有明确验证命令                                  | ✅ / ❌ | TODO |
| 完成标准可断言 | 每个标准能转成 assert 伪代码                            | ✅ / ❌ | TODO |
| 依赖关系       | 前置依赖正确标注                                        | ✅ / ❌ | TODO |
| 回归覆盖       | 回归清单覆盖已有功能                                    | ✅ / ❌ | TODO |
| 停止条件       | 每个任务有明确停止条件                                  | ✅ / ❌ | TODO |
| 链接合规       | 目标文件、涉及文件、sources文件、代码位置、Evidence 和引用型 ID 均可点击 | ✅ / ❌ | TODO |
