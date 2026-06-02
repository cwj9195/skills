# 前端实施设计书输出模板 (v4.0.0)

> 使用时将 `{模块名}`、`{路由}`、`{接口}` 等占位替换为真实内容；未知内容标 `(待确认)` 并使用结构化 TODO 格式。
> **v4 新增内容用 ⭐ 标记，不可删除。**

## 基础信息

| 项目 | 内容 |
| --- | --- |
| 文件状态 | [√] 草稿 [ ] 正式发布 |
| 需求名称 | TODO |
| 禅道/需求编号 | TODO |
| 当前版本 | V0.1.0 |
| 需求来源 | TODO |
| 作者 | TODO |
| 技术栈 | TODO |
| 生成工具 | frontend-design-doc-generator ⭐ |
| 工具版本 | v4.0.0 ⭐ |
| 生成时间 | TODO（当前日期） ⭐ |

## 版本履历

| 版本号 | 修改章节 | 修改内容 | 修改人 | 修改时间 |
| --- | --- | --- | --- | --- |
| V0.1.0 | 全文 | 初稿创建 | TODO | TODO |

## 一、需求概述

### 1.1 本期目标

| 目标 | 说明 |
| --- | --- |
| TODO | TODO |

### 1.2 需求范围

| 范围 | 包含内容 | 不包含内容 | 备注 |
| --- | --- | --- | --- |
| TODO | TODO | TODO | TODO |

## 二、前端模块总览

| 序号 | 模块 | 页面 | 优先级 | 说明 |
| --- | --- | --- | --- | --- |
| 1 | TODO | TODO | P0 | TODO |

## 三、公共约定

### 3.1 技术栈与项目约定

| 类型 | 约定 | 说明 | Evidence |
| --- | --- | --- | --- |
| 框架 | TODO | TODO | `package.json:xx` |
| 状态管理 | TODO | TODO | `package.json:xx` |
| UI 组件库 | TODO | TODO | `package.json:xx` |
| 列表页构建 | TODO | TODO | `pages/xxx/index.tsx:xx` |
| 权限控制 | TODO | TODO | `pages/xxx/index.tsx:xx` |
| 请求封装 | TODO | TODO | `request/xxx/index.ts:xx` |

### 3.2 代码库证据清单 ⭐ v4 新增

> 步骤 2 代码库探索的结构化产出，每个探索项必须记录。

| 探索项 | 文件路径 | 发现结论 | 复用方式 | import/注册位置 | 可信度 |
| --- | --- | --- | --- | --- | --- |
| 技术栈 | `package.json` | TODO | — | — | ✅已确认 |
| 目录结构 | `src/` | TODO | — | — | ✅已确认 |
| 列表页模式 | `pages/xxx/index.tsx:216` | TODO | TODO | TODO | ✅已确认 |
| 权限模式 | `pages/xxx/index.tsx:11-19` | TODO | TODO | TODO | ✅已确认 |
| 请求封装 | `request/xxx/index.ts:3-94` | TODO | TODO | TODO | ✅已确认 |
| 表单模式 | TODO | TODO | TODO | TODO | TODO |
| 路由配置 | TODO | TODO | TODO | TODO | ✅已确认 |
| 类型定义 | TODO | TODO | TODO | TODO | ✅已确认 |
| Store/Composable | TODO | TODO | TODO | TODO | TODO |
| 样式方案 | TODO | TODO | TODO | TODO | TODO |
| 上传/导入 | TODO | TODO | TODO | TODO | TODO |
| 相关模块 | TODO | TODO | TODO | TODO | TODO |

### 3.3 公共组件

| 组件 | 来源路径 | 现有示例 | 职责 | 关键 props/emit | 使用模块 |
| --- | --- | --- | --- | --- | --- |
| `<TODO选择器 />` | TODO | TODO | TODO | TODO | TODO |

### 3.4 公共权限规则

| 权限层级 | 控制对象 | 控制方式 | 说明 |
| --- | --- | --- | --- |
| 按钮级 | 新建/编辑/删除/导出 | TODO | TODO |
| 行级 | 行操作 | TODO | TODO |
| 数据级 | 可见数据范围 | TODO | TODO |

### 3.5 公共字典/状态

| 字典/状态 | 值 | 展示方式 | 说明 |
| --- | --- | --- | --- |
| TODO | TODO | Tag/Select/Radio | TODO |

### 3.6 目录与命名约定 ⭐ v4 新增

| 约定 | 规范 | 示例 |
| --- | --- | --- |
| 页面目录 | TODO | `apps/pim/pages/{moduleName}/index.tsx` |
| 组件目录 | TODO | `apps/pim/pages/{moduleName}/components/` |
| API 目录 | TODO | `apps/pim/request/record/goods/{moduleName}/index.ts` |
| 类型文件 | TODO | `apps/pim/pages/{moduleName}/types.ts` |
| 样式文件 | TODO | TODO |
| 路由注册 | TODO | `apps/pim/routers/part.ts` |

### 3.7 API 与类型约定 ⭐ v4 新增

| 约定 | 规范 | 示例 |
| --- | --- | --- |
| API Map 格式 | TODO | `['post', '/goods/xxx/page', Req, Res]` |
| 类型命名 | TODO | `XxxPageReq` / `XxxPageRes` / `XxxItem` |
| 请求函数命名 | TODO | `useXxxPage` / `useXxxDetail` |

---

## 四、模块一：{模块名}

### 4.1 模块证据与范围 ⭐ v4 新增

> 每个模块必须首先列出证据来源，确保结论可追溯。

#### 4.1.1 证据来源

| 信息点 | 结论 | 来源 | 可信度 | 备注 |
| --- | --- | --- | --- | --- |
| 需求模块 | TODO | PRD `行号` | ✅Verified | |
| 原型节点 | TODO | MasterGo `fileId:layerId` | ✅Verified / ⚠️Unverified | |
| 现有路由 | TODO | `apps/pim/routers/part.ts:xx` | ✅已确认 | |
| 现有列表实现 | TODO | `apps/pim/pages/xxx/index.tsx:xx` | ✅已确认 | |
| 现有权限模式 | TODO | `apps/pim/pages/xxx/index.tsx:xx` | ✅已确认 | |
| 现有请求模式 | TODO | `apps/pim/request/record/goods/xxx/index.ts:xx` | ✅已确认 | |

#### 4.1.2 模块边界

| 维度 | 包含 | 不包含 |
| --- | --- | --- |
| 页面 | TODO | TODO |
| 接口 | TODO | TODO |
| 权限 | TODO | TODO |

### 4.2 文件变更计划（实施蓝图） ⭐ v4 重构

#### 4.2.1 文件变更清单

| 变更类型 | 文件路径 | 实现内容 | 依赖 | 参考实现 |
| --- | --- | --- | --- | --- |
| 类型 | 新建 | `apps/pim/pages/{moduleName}/types.ts` — TODO | 无 | TODO |
| API | 修改 | `apps/pim/request/record/goods/{moduleName}/index.ts` — TODO | 类型文件 | TODO |
| Hook | 新建 | `apps/pim/pages/{moduleName}/useModuleLogic.ts` — TODO | API + 类型 | — |
| 组件 | 新建 | `apps/pim/pages/{moduleName}/components/ModuleDrawer.tsx` — TODO | Hook + 类型 | TODO |
| 页面 | 修改 | `apps/pim/pages/{moduleName}/index.tsx` — TODO | 组件 | TODO |
| 路由 | 修改 | `apps/pim/routers/part.ts` — TODO | 页面 | TODO |
| 样式 | 新建 | `apps/pim/pages/{moduleName}/ModuleDrawer.less` — TODO | 无 | — |

#### 4.2.2 依赖顺序

```text
① 类型定义（无依赖）
  → ② API 层（依赖类型）
    → ③ Store/Hooks（依赖 API + 类型）
      → ④ 子组件（依赖 Hooks + 类型）
        → ⑤ 页面容器（依赖子组件）
          → ⑥ 路由/权限注册（依赖页面）
```

#### 4.2.3 复用映射

| 需求中的页面/组件 | 代码库中对应的现有模式 | 复用方式 |
| --- | --- | --- |
| TODO | TODO | TODO |

#### 4.2.4 阻塞项

| ID | 阻塞内容 | 是否阻塞实现 | 影响步骤 | 临时方案 |
| --- | --- | --- | --- | --- |
| B1 | TODO | 是/否 | 步骤 N | TODO |

### 4.3 页面结构与路由

#### 4.3.1 路由定义

| 页面 | 路由 | 参数 | 路由注册文件 | 说明 |
| --- | --- | --- | --- | --- |
| 列表页 | `{列表路由}` | - | `apps/pim/routers/part.ts` | 使用 TODO 构建 |
| 详情/编辑页 | `{详情路由}` | `id`、`mode` | `apps/pim/routers/part.ts` | 同一路由复用，`mode=edit/view` 区分 |

路由代码（完整 `import()` 懒加载定义）：

```typescript
// 注册位置：apps/pim/routers/part.ts
['pim:{moduleName}:list', {
  path: '/{moduleName}/index',
  name: '{ModuleName}List',
  component: () => import('#/pim/pages/{moduleName}/index.tsx'),
  meta: { title: '{模块名}', keepAlive: true }
}],
```

#### 4.3.2 页面层级关系

```text
{模块名}
├── 列表页
│   ├── 筛选区
│   ├── 操作栏
│   ├── 表格区
│   └── 分页栏
├── 新建/编辑页或抽屉
└── 详情/审批页
    ├── 基本信息区
    ├── 明细区
    └── 底部操作区
```

#### 4.3.3 布局逻辑（ASCII 线框图）

```text
┌──────────────────────────────────────────────┐
│ 筛选区：筛选项 1 / 筛选项 2 / 筛选项 3        │
├──────────────────────────────────────────────┤
│ 操作栏：新建 / 导入 / 导出 / 批量操作         │
├──────────────────────────────────────────────┤
│ 表格区：业务字段 + 状态 + 操作列              │
├──────────────────────────────────────────────┤
│ 分页栏：页码 / 每页条数 / 总数                │
└──────────────────────────────────────────────┘
```

#### 4.3.4 筛选区与操作区

| 区域 | 元素 | 组件 | 默认值 | 交互 |
| --- | --- | --- | --- | --- |
| 筛选区 | TODO | TODO | TODO | TODO |
| 操作区 | TODO | Button | - | TODO |

#### 4.3.5 表格列定义

| 列 | 字段 key | 宽度 | 排序 | 展示/交互说明 |
| --- | --- | --- | --- | --- |
| 序号 | `index` | 60px | 否 | TODO |
| TODO | `TODO` | TODO | TODO | TODO |

#### 4.3.6 交互细节

| 场景 | 触发方式 | 前端行为 | 反馈 |
| --- | --- | --- | --- |
| 查询 | 点击查询/回车 | 组装筛选参数，请求列表 | 表格 loading |
| 重置 | 点击重置 | 清空筛选项并恢复默认值 | 刷新列表 |
| 查看详情 | 点击详情 | 跳转详情路由 | TODO |
| 未保存离开 | 切换路由/关闭抽屉 | 弹确认框 | 保存/不保存/取消 |

### 4.4 UI 布局与交互契约 ⭐ v4 新增

> 将原型视觉信息转化为前端可执行描述。

#### 4.4.1 布局规则

| 区域 | 规则 | 尺寸/间距 |
| --- | --- | --- |
| TODO | TODO | TODO |

#### 4.4.2 交互场景契约

| 场景 | 触发条件 | UI 变化 | 反馈 | 异常处理 |
| --- | --- | --- | --- | --- |
| 空态 | TODO | TODO | TODO | — |
| 加载态 | TODO | TODO | TODO | TODO |
| 错误态 | TODO | TODO | TODO | TODO |
| 成功态 | TODO | TODO | TODO | — |

### 4.5 数据模型与字段字典

> 字段必须与 PRD 逐一对应，不允许遗漏。字段数量 > 20 时按业务分组。

#### 4.5.1 字段字典 ⭐ v4 升级为 10 列

| 字段标签 | 字段 key | 类型 | 控件类型 | 必填 | 默认值 | 校验规则 | 枚举值/数据源 | API 映射 | 展示规则 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TODO | `TODO` | string/number/boolean/array | 文本/下拉/选择器/日期 | 是/否 | TODO | TODO | TODO | TODO | TODO |

#### 4.5.2 自动计算字段 ⭐ v4 新增

| 字段 | 计算公式 | 触发时机 | 前端是否计算 |
| --- | --- | --- | --- |
| TODO | TODO | TODO | 是/否（展示后端结果） |

#### 4.5.3 字段联动规则 ⭐ v4 新增

| 触发字段 | 联动字段 | 联动逻辑 |
| --- | --- | --- |
| TODO | TODO | TODO |

### 4.6 API 契约 ⭐ v4 重构

#### 4.6.1 API 契约表（12 列）

| 接口名称 | API 函数名 | API 文件 | 方法 | 路径 | 入参 schema | 出参 schema | 错误处理 | 调用时机 | loading key | 成功后处理 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 列表查询 | `useModulePage` | `request/record/goods/module/index.ts` | POST | `/goods/module/page` `(待确认)` | `ModulePageReq` | `ModulePageRes` | Toast 错误信息 | 页面初始化/查询/分页 | `loading` | 刷新表格 | `(待确认)` |
| TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

#### 4.6.2 API Map 代码

```typescript
// 注册位置：apps/pim/request/record/goods/{moduleName}/index.ts
import type * as T from './typing'

export const APIMap = {
  '{moduleName}_page': ['post', '/goods/{moduleName}/page',
    T.{ModuleName}PageReq, T.{ModuleName}PageRes],
  '{moduleName}_detail': ['get', '/goods/{moduleName}/detail',
    { id: string }, T.{ModuleName}DetailRes],
  // ... 所有接口
}
```

#### 4.6.3 TypeScript Interface

```typescript
// 文件路径：apps/pim/request/record/goods/{moduleName}/typing.ts

/** {模块名}列表查询请求参数 */
export interface {ModuleName}PageReq {
  /** 当前页码 */
  current: number
  /** 每页条数 */
  pageSize: number
  // ... 所有筛选字段（必须含 JSDoc）
}

/** {模块名}列表查询响应数据 */
export interface {ModuleName}PageRes {
  total: number
  list: {ModuleName}Item[]
}

/** {模块名}数据项 */
export interface {ModuleName}Item {
  /** 主键 */
  id: string
  // ... 所有字段（必须含 JSDoc）
}
```

#### 4.6.4 API 字段映射表 ⭐ v4 新增

| 页面字段 | 字段 key | API 入参字段 | API 出参字段 | 是否需要转换 | 转换逻辑 |
| --- | --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | 是/否 | TODO |

### 4.7 组件复用与新建组件契约

#### 4.7.1 复用组件

| 组件 | 来源路径 | 现有示例 | 职责 | props | emit/slots | 使用场景 | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<TODO />` | TODO | TODO | TODO | TODO | TODO | TODO | `path:line` |

#### 4.7.2 新建组件契约 ⭐ v4 新增

| 中文名 | 代码名 | 文件路径 | 职责 | props | emits | slots | exposed | 使用方 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TODO | `TODO` | `pages/{moduleName}/components/TODO.tsx` | TODO | 见下方代码 | 见下方代码 | TODO | TODO | TODO |

新建组件 Props/Emit 代码：

```typescript
// 文件路径：apps/pim/pages/{moduleName}/components/TODO.tsx

/** {组件名} Props */
export interface {ComponentName}Props {
  /** TODO */
  TODO: boolean
}

/** {组件名} Emits */
export interface {ComponentName}Emits {
  (e: 'update:TODO', value: boolean): void
  (e: 'TODO'): void
}
```

#### 4.7.3 组件通信

| 来源组件 | 目标组件 | 通信方式 | 数据 |
| --- | --- | --- | --- |
| 父页面 | 表单组件 | props | 初始值/模式 |
| 表单组件 | 父页面 | emit | submit/cancel |
| 任意组件 | Store | Store | 字典/缓存 |

### 4.8 状态、缓存与数据链路

#### 4.8.1 状态与缓存设计 ⭐ v4 新增

| 状态名 | 存放位置 | 初始值 | 写入时机 | 清空时机 | 是否持久化 |
| --- | --- | --- | --- | --- | --- |
| TODO | `ref()` / `reactive()` / `store` | TODO | TODO | TODO | 否 |

#### 4.8.2 初始化链路

```text
进入页面
  → 初始化权限/字典/默认筛选项
  → 请求列表接口
  → 渲染筛选区、操作区、表格区
```

| 时机 | 请求/动作 | 参数来源 | 结果去向 |
| --- | --- | --- | --- |
| 页面进入 | TODO | 路由 query / 默认值 | 列表数据 |
| 字典加载 | TODO | 固定字典 key | Select/Radio/Tag |

#### 4.8.3 查询/分页/排序链路

| 操作 | 请求时机 | 参数组装 | 刷新范围 |
| --- | --- | --- | --- |
| 查询 | 点击查询 | 表单值 + 分页重置为第 1 页 | 表格 |
| 分页 | 页码变化 | 表单值 + page/pageSize | 表格 |
| 排序 | 排序变化 | 表单值 + sortField/sortOrder | 表格 |

#### 4.8.4 新建/编辑/审批链路

```text
打开表单
  → 加载详情/默认值
  → 前端校验
  → 提交接口
  → 成功提示
  → 关闭表单/跳转详情
  → 刷新列表或详情
```

| 操作 | 前端校验 | 接口 | 成功后处理 | 失败后处理 |
| --- | --- | --- | --- | --- |
| 新建 | TODO | TODO | TODO | TODO |
| 编辑 | TODO | TODO | TODO | TODO |
| 审批通过 | TODO | TODO | TODO | TODO |
| 审批驳回 | TODO | TODO | TODO | TODO |

#### 4.8.5 数据变更联动

| 变更来源 | 影响页面 | 联动逻辑 |
| --- | --- | --- |
| 新建成功 | 列表页 | 刷新第一页或保持当前筛选刷新 |
| 编辑成功 | 列表页/详情页 | 刷新当前行/详情 |
| 审批成功 | 列表页/详情页 | 刷新状态和待审人 |

### 4.9 权限、校验与状态机

#### 4.9.1 权限控制

| 权限层级 | 控制对象 | 规则 | 无权限展示 |
| --- | --- | --- | --- |
| 按钮级 | 新建/编辑/导出 | TODO | 隐藏或禁用 |
| 行级 | 行操作 | TODO | 隐藏或禁用 |
| 数据级 | 列表数据/选择器数据 | TODO | 后端过滤为主，前端透传查询条件 |

#### 4.9.2 校验规则

| 校验项 | 前端是否做 | 原因 | 错误提示 |
| --- | --- | --- | --- |
| TODO | ✅ 做 / ❌ 不做 / ⚠️ 轻量提示 | TODO | TODO |

#### 4.9.3 状态枚举与转换图

```text
状态转换图（文本形式）：
  idle ──[上传文件]──→ uploading
  uploading ──[成功]──→ uploaded
  uploading ──[失败]──→ error
  uploading ──[取消]──→ idle
  error ──[重新上传]──→ uploading
```

| 状态 | 中文名 | UI 表现 | 允许动作 | 禁止动作 |
| --- | --- | --- | --- | --- |
| `idle` | 未上传 | TODO | TODO | — |
| `uploading` | 上传中 | TODO | TODO | TODO |
| `error` | 上传失败 | TODO | TODO | — |
| `uploaded` | 已上传 | TODO | TODO | TODO |

#### 4.9.4 行级状态矩阵（如适用）

> 当不同行可以有不同状态时使用此表。如列表页所有行状态一致，可省略。

| 整体状态 | 行状态 | 编辑 | 勾选删除 | 操作A | 操作B |
| --- | --- | --- | --- | --- | --- |
| 状态X | 状态X | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| 状态Y | 状态Y_子1 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| 状态Y | 状态Y_子2 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

### 4.10 异常、边界与性能 ⭐ v4 新增

#### 4.10.1 异常处理

| 异常场景 | 处理方式 | 用户反馈 | 恢复方式 |
| --- | --- | --- | --- |
| 接口超时 | TODO | Toast：请求超时，请稍后重试 | 重试按钮 |
| 接口失败 | TODO | Toast：错误信息 | 保留表单数据 |
| 并发修改 | TODO | TODO | TODO |
| 网络断开 | TODO | TODO | TODO |

#### 4.10.2 边界条件

| 场景 | 处理方式 |
| --- | --- |
| 空数据 | 表格展示空状态 |
| 超长文本 | 单行省略，悬停 Tooltip 展示全文 |
| 重复提交 | 提交按钮 loading，接口返回前禁用 |
| 大数据量 | TODO |

#### 4.10.3 性能策略

| 场景 | 策略 |
| --- | --- |
| 大列表 | 分页加载；必要时虚拟滚动 |
| 远程搜索 | 防抖 300ms |
| 图片/附件 | 懒加载/按需预览 |
| 批量操作 | 分批提交或后端异步任务 |

### 4.11 Hooks 与工具函数

自定义 Hooks 代码：

```typescript
// 文件路径：apps/pim/pages/{moduleName}/useModuleLogic.ts

/**
 * {模块名}业务逻辑 Hook
 * @param params 查询参数
 * @returns 数据、操作方法、状态
 */
export function useModuleLogic(params: Ref<Params>) {
  const data = ref<Data>()
  const loading = ref(false)

  // 核心业务逻辑
  const calculate = () => { ... }

  // 联动监听
  watch(() => params.value, () => { ... })

  return { data, loading, calculate }
}
```

工具函数（如有）：

```typescript
// 文件路径：apps/pim/pages/{moduleName}/utils.ts

/**
 * TODO
 */
export function moduleUtil(input: Type): Result {
  // ...
}
```

### 4.12 实现步骤 ⭐ v4 新增

| 步骤 | 操作 | 涉及文件 | 前置依赖 | 完成标准 |
| --- | --- | --- | --- | --- |
| 1 | 新建类型文件 | `types.ts` | 无 | 类型定义完整，无编译错误 |
| 2 | 新增 API 映射 | `request/record/goods/xxx/index.ts` + `typing.ts` | 步骤 1 | API Map 注册完成，四元组格式正确 |
| 3 | 编写业务 Hook | `useModuleLogic.ts` | 步骤 1 + 2 | Hook 可独立测试 |
| 4 | 实现子组件 | `components/ModuleDrawer.tsx` | 步骤 3 | 组件 Props/Emit 正确，可独立渲染 |
| 5 | 组装页面 | `pages/xxx/index.tsx` | 步骤 4 | 页面完整可用 |
| 6 | 注册路由与权限 | `routers/part.ts` + 页面 codes | 步骤 5 | 路由可访问，权限控制生效 |
| 7 | 联调测试 | 全部 | 步骤 6 | 全链路通过 |

### 4.13 验收标准与 TODO

#### 4.13.1 验收标准 ⭐ v4 新增

| 场景 | Given | When | Then | 验证方式 |
| --- | --- | --- | --- | --- |
| 列表查询 | 用户有 `{moduleName}:list` 权限 | 进入列表页 | 展示默认筛选结果，表格可分页 | 手工/自动化 |
| 新建提交 | 表单校验通过 | 点击保存 | Toast 成功，列表刷新，新增记录在第一页 | 手工 |
| 权限控制 | 用户无 `create` 权限 | 进入列表页 | 新建按钮隐藏/禁用 | 手工 |
| TODO | TODO | TODO | TODO | TODO |

#### 4.13.2 TODO / 待确认事项（结构化 9 列） ⭐ v4 重构

| ID | 类型 | 问题 | 是否阻塞实现 | 影响范围 | 临时方案 | 负责人 | 优先级 | 确认后需修改章节 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | 接口 | TODO | 否 | 4.6 API 契约 | 基于命名约定推导，标 `(待确认)` | 后端 | P1 | 4.6 API 契约 |
| T2 | 权限 | TODO | 否 | 4.9 权限控制 | 暂定权限码，标 `(待确认)` | 产品 | P1 | 4.9 权限控制 |
| T3 | 字段 | TODO | 是 | 4.5 字段字典 | mock 数据先行开发，接口确认后替换 | 后端 | P0 | 4.5 + 4.6 |

---

## 五、路由汇总

| 路径 | 页面 | 模块 | 参数 | 路由注册文件 | 说明 |
| --- | --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | TODO | TODO |

## 六、接口清单

| 模块 | 接口名称 | API 函数名 | API 文件 | 方法 | 路径 | 说明 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | TODO | TODO | TODO | 暂定 |

## 七、全局 TODO / 待确认事项 ⭐ v4 重构

> 所有模块 TODO 汇总，统一编号和追踪。

| ID | 类型 | 问题 | 是否阻塞实现 | 影响范围 | 临时方案 | 负责人 | 优先级 | 确认后需修改章节 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | 接口 | TODO | 否 | TODO | TODO | 后端 | P1 | TODO |
| T2 | 权限 | TODO | 否 | TODO | TODO | 产品 | P1 | TODO |

## 八、验收标准汇总 ⭐ v4 新增

> 所有模块验收标准汇总。

| 模块 | 场景 | Given | When | Then | 验证方式 |
| --- | --- | --- | --- | --- | --- |
| TODO | TODO | TODO | TODO | TODO | 手工/自动化 |

## 九、测试策略

| 类型 | 测试项 | 前置数据 | 操作步骤 | 期望结果 | 覆盖模块 | 自动化/手工 |
| --- | --- | --- | --- | --- | --- | --- |
| 功能 | 列表查询 | TODO | 默认查询、组合筛选、分页、排序 | TODO | TODO | 手工 |
| 功能 | 新建/编辑 | TODO | 必填校验、保存成功、保存失败 | TODO | TODO | 手工 |
| 权限 | 按钮权限 | TODO | 有权限/无权限展示 | TODO | TODO | 手工 |
| 权限 | 数据权限 | TODO | 不同角色数据范围 | TODO | TODO | 手工 |
| 状态 | 状态流转 | TODO | 各状态间转换正确性、按钮可用性 | TODO | TODO | 手工 |
| 异常 | 接口失败 | TODO | loading 关闭、错误提示、数据保留 | TODO | TODO | 手工 |
| 性能 | 大数据列表 | TODO | 查询耗时、滚动、批量操作 | TODO | TODO | 手工 |

## 十、错误处理规范 ⭐ v4 新增

| 错误类型 | 处理方式 | 用户反馈 | 日志记录 |
| --- | --- | --- | --- |
| 接口 4xx | TODO | Toast 提示具体错误 | console.error |
| 接口 5xx | TODO | Toast：服务器异常 | console.error + Sentry |
| 表单校验失败 | TODO | 字段级红色提示 | — |
| 网络断开 | TODO | 全局提示 | — |
| 并发冲突 | TODO | TODO | TODO |

## 自检结果（20 项） ⭐ v4 升级

| # | 检查项 | 类型 | 状态 | 说明 |
| --- | --- | --- | --- | --- |
| 1 | 基础信息含工具版本 v4.0.0 | 格式 | ✅/❌ | |
| 2 | 代码库证据清单已输出 | 完整性 | ✅/❌ | 共 N 项 |
| 3 | 每个模块含 13 个子章节 | 完整性 | ✅/❌ | |
| 4 | 每个模块含实施蓝图 | 完整性 | ✅/❌ | |
| 5 | 每模块代码块 ≥ 6 | 量化 | ✅/❌ | 平均 N 个 |
| 6 | 每模块 TypeScript interface ≥ 2 | 量化 | ✅/❌ | |
| 7 | 每模块状态机表格已定义 | 完整性 | ✅/❌ | |
| 8 | 每模块字段字典 10 列表格已列出 | 完整性 | ✅/❌ | |
| 9 | 每模块 ASCII 线框图 ≥ 1 | 量化 | ✅/❌ | 共 N 张 |
| 10 | 每模块 API 契约 12 列表格已列出 | 完整性 | ✅/❌ | |
| 11 | 每模块新建组件契约表已列出 | 完整性 | ✅/❌ | |
| 12 | 每模块状态与缓存设计表已列出 | 完整性 | ✅/❌ | |
| 13 | 每模块实现步骤表已列出 | 完整性 | ✅/❌ | |
| 14 | 每模块验收标准 ≥ 3 条 | 量化 | ✅/❌ | 共 N 条 |
| 15 | 文件变更计划含 5 列 | 完整性 | ✅/❌ | |
| 16 | Evidence 引用 ≥ 23 处 | 量化 | ✅/❌ | 代码 N 处 + PRD N 处 |
| 17 | TODO ≤ 15 处 | 量化 | ✅/❌ | 共 N 处 |
| 18 | 阻塞型 TODO 100% 有临时方案 | 质量 | ✅/❌ | |
| 19 | PRD 需求列表全覆盖 | 完整性 | ✅/❌ | 含一期优化清单 |
| 20 | 无禁止项违反 | 质量 | ✅/❌ | |
