# 前端设计.md 模板（v2）

| 项目          | 内容                                                                              |
| ------------- | --------------------------------------------------------------------------------- |
| 需求名称      | TODO                                                                              |
| 来源 Manifest | `模块索引.md#M{N}`                                                                |
| 来源 需求说明 | `需求说明.md`                                                                     |
| 来源代码参考  | `代码参考.md`                                                                     |
| 来源接口契约  | 以 Manifest 的根级 API 契约路径为准；模块设计目录默认相对路径 `../../接口契约.md` |
| 来源模块目录  | 以 Manifest 中当前模块记录为准                                                    |
| 来源 UI 素材   | 当前文件位于 `M{N}/设计/` 时，截图使用 `../../来源/xxx`                            |
| 生成工具      | frontend-design-agent v2                                                          |
| 生成时间      | TODO                                                                              |
| 状态          | [ ] 草稿 [ ] 已自审 [ ] 可交付                                                    |

## 0. 总览与公共约定

### 0.1 模块依赖 代码参考 映射

| 模块                 | 主要引用章节                        | 次要引用章节                |
| -------------------- | ----------------------------------- | --------------------------- |
| TODO（如 M3 成品库） | [§1 列表页工厂](代码参考.md#code-ref-1)、[§2 表单项](代码参考.md#code-ref-2)、[§3 工具栏](代码参考.md#code-ref-3) | [§6 请求层](代码参考.md#code-ref-6)、[§7 路由](代码参考.md#code-ref-7)、[§8 权限](代码参考.md#code-ref-8) |

### 0.2 公共约定

| 项目           | 约定                        |
| -------------- | --------------------------- |
| 技术栈         | TODO（与 [代码参考 §0](代码参考.md#code-ref-0) 一致） |
| 新模块文件目录 | TODO                        |
| API 文件目录   | TODO                        |
| 组件目录       | TODO                        |

### 0.3 API Contract 引用

> 只引用 `接口契约.md` 的接口 ID，不在本文档复制完整请求/响应结构。

| 模块 | 接口 ID                                | 场景 | 状态                                                | 前端接入点 |
| ---- | -------------------------------------- | ---- | --------------------------------------------------- | ---------- |
| M{N} | [API-M{N}-TODO](../../接口契约.md#api-m{N}-todo) / 无 | TODO | Draft / Reviewed / Confirmed / Changed / 无新增变更 | TODO       |

---

## 模块 M{N}: {模块名}

> **完整度**：完整版 / 差异版
> 完整版：P0 核心模块，给出所有代码骨架
> 差异版：其余模块，只写与完整版不同的部分

### 基于 代码参考 哪些章节

| 引用章节      | 本模块的差异                                              |
| ------------- | --------------------------------------------------------- |
| §1 列表页工厂 | TODO（如"增加了左侧类目树筛选器"）                        |
| §2 表单项     | TODO（如"使用了 vendor(multi) 和 category 两个特殊工厂"） |
| ...           | ...                                                       |

### 文件清单（可直接创建）

| 文件路径                                  | 说明       | 类型 |
| ----------------------------------------- | ---------- | ---- |
| `pages/{module}/index.tsx`                | 列表页主体 | 新增 |
| `pages/{module}/columns.ts`               | 表格列定义 | 新增 |
| `pages/{module}/store.ts`                 | 模块状态   | 新增 |
| `pages/{module}/components/Xxx.tsx`       | 子组件     | 新增 |
| `request/record/goods/{module}/index.ts`  | API 定义   | 新增 |
| `request/record/goods/{module}/typing.ts` | 类型定义   | 新增 |
| `routers/part.ts`                         | 路由池     | 修改 |
| `routers/local-router.ts`                 | 菜单树     | 修改 |
| `request/record/enter.ts`                 | API 聚合   | 修改 |

### 路由注册（可直接粘贴）

```ts
// part.ts 路由池
// TODO: 给出完整的路由定义代码

// local-router.ts 菜单树
// TODO: 给出完整的菜单树配置代码
```

### API 注册（可直接粘贴）

> APIMap 代码必须引用 `接口契约.md` 中真实存在的接口 ID；method/path/请求/响应语义以 `接口契约.md` 为准。

```ts
// request/record/goods/{module}/index.ts
// TODO: 给出完整的 APIMap 定义，并在注释中标明接口 ID
export const {module}ApiMap = {
  // API-M{N}-TODO
  page: ['POST', '/goods/{module}/page', PageReq, PageRes],
  // ...
};

// request/record/goods/{module}/typing.ts
// TODO: 给出完整的类型定义
```

### Store 定义（可直接粘贴）

```ts
// pages/{module}/store.ts
// TODO: 给出完整的 Store 定义代码
```

### 页面实现要点

#### 列表页

```ts
// pages/{module}/index.tsx
// TODO: 给出列表页核心代码骨架
// - createPage 的 callBack 函数
// - form.body 的筛选条件配置（标注每个字段用哪个 useFormItem 工厂）
// - table.columns 的列定义
// - table.plugins 的工具栏配置
// - table.vxeProps 的表格属性
```

#### form.body 字段清单

| 字段标签 | 字段 key | useFormItem 工厂 | 工厂参数 | 备注 |
| -------- | -------- | ---------------- | -------- | ---- |
| TODO     | TODO     | TODO             | TODO     | TODO |

#### table.columns 列清单

| 列标题 | 字段 key | 宽度 | 特殊渲染 | 合并行 | 备注 |
| ------ | -------- | ---- | -------- | ------ | ---- |
| TODO   | TODO     | TODO | TODO     | 是/否  | TODO |

#### table.plugins 配置

```ts
// TODO: 给出工具栏插件配置代码
```

#### 详情页/编辑页（如有）

```ts
// TODO: 给出详情页/编辑页的核心组件结构和关键交互代码
```

### 子组件清单

| 组件名 | 文件路径 | Props | Emits | 核心逻辑 |
| ------ | -------- | ----- | ----- | -------- |
| TODO   | TODO     | TODO  | TODO  | TODO     |

### UI 布局（来自 MasterGo DSL）

```text
// TODO: 从 MasterGo DSL 提取的页面布局结构
// 容器布局、组件嵌套、尺寸和间距
```

### UI 素材引用

| UI Source ID | 页面/状态 | 截图 | DSL 状态 | 证据 |
| ------------ | --------- | ---- | -------- | -------- |
| [UI-M{N}-001](../界面.md#ui-m{N}-001) | TODO | [截图](../../来源/TODO.png) / 无 | 待提取 / 已提取 / 失败 | [UI-M{N}-001](../界面.md#ui-m{N}-001) |

> 表格内截图使用 `[截图](../../来源/xxx.png)`；需要正文预览时使用 `![截图说明](../../来源/xxx.png)`。禁止只写反引号路径作为唯一引用。
> 引用 UI Source ID 时必须使用 `[UI-M{N}-001](../界面.md#ui-m{N}-001)`；引用接口 ID 时必须使用 `[API-M{N}-TODO](../../接口契约.md#api-m{N}-todo)`，禁止裸写 ID 作为唯一引用。

### 验收标准

| 场景 | Given | When | Then | 验证方式   |
| ---- | ----- | ---- | ---- | ---------- |
| TODO | TODO  | TODO | TODO | e2e / unit |

---

## 附录：TODO 汇总

| ID       | 类型 | 问题 | 阻塞  | 临时方案 | 负责人 |
| -------- | ---- | ---- | ----- | -------- | ------ |
| D-TODO-1 | TODO | TODO | 是/否 | TODO     | TODO   |
