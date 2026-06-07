# code-reference.md 模板

| 项目       | 内容                     |
| ---------- | ------------------------ |
| 需求名称   | TODO                     |
| 来源代码库 | TODO（使用 `[代码库](相对路径或URL)`）       |
| 来源组件库 | TODO（使用 `[组件库](相对路径或URL)`）       |
| 生成工具   | frontend-design-agent v2 |
| 生成时间   | TODO                     |
| 状态       | [ ] 草稿 [ ] 已确认      |

> **本手册的目标**：让实现 AI 拿到设计书后能直接写出可运行的代码。
> 每个章节覆盖一个核心代码模式，给出：完整签名 + 真实使用范例 + 注意事项。
> 所有代码范例来自现有项目代码，不是凭空编写的。
> 每个核心章节必须保留显式锚点，例如 `<a id="code-ref-1"></a>`；`frontend-design.md` 和 `implementation-tasks.md` 只能引用真实存在的代码参考锚点。

---

<a id="code-ref-0"></a>
## 0. 项目技术栈速查

| 项目     | 版本/约定                                 |
| -------- | ----------------------------------------- |
| 框架     | TODO（如 Vue 3 + TypeScript + TSX）       |
| 构建     | TODO（如 Vite）                           |
| UI 库    | TODO（如 ant-design-vue）                 |
| 表格     | TODO（如 vxe-grid）                       |
| 状态管理 | TODO（如模块级 ref + 函数导出，非 Pinia） |
| 请求库   | TODO（如自封装 useRequest）               |
| 路由     | TODO（如 vue-router）                     |

---

<a id="code-ref-1"></a>
## 1. 列表页工厂

> **提取方法**：在项目中找到最完整、最具代表性的列表页，提取其完整实现模式。
> Codegraph 查询：`codegraph_context("最完整的列表页实现")` 或搜索项目中的 createPage/listPage 等关键词。

### 1.1 工厂函数签名

```ts
// 从组件库或 hooks 中提取的列表页工厂签名
// TODO: 从实际代码中提取
```

### 1.2 回调参数（CallBackOptions）

```ts
// TODO: 从实际代码中提取回调函数的参数类型
```

### 1.3 返回值结构（CallBackReturn）

```ts
// TODO: 从实际代码中提取返回值类型
```

### 1.4 完整列表页模板

```ts
// TODO: 从现有最完整的列表页提取，保留所有关键代码
// 参考页面：TODO（文件路径写在代码块外时必须使用 Markdown 链接）
```

### 1.5 注意事项

- TODO：列出使用此工厂时的常见坑点

---

<a id="code-ref-2"></a>
## 2. 表单项工厂

> **提取方法**：搜索项目中所有表单字段工厂方法。
> Codegraph 查询：`codegraph_context("表单字段工厂 useFormItem")`

### 2.1 可用工厂方法一览

| 工厂方法 | 参数 | 返回值 | 使用场景 |
| -------- | ---- | ------ | -------- |
| TODO     | TODO | TODO   | TODO     |

### 2.2 各工厂详细用法

```ts
// TODO: 每个工厂方法给出一个真实使用范例
```

### 2.3 自定义表单项

```ts
// TODO: 如何创建自定义表单项
```

---

<a id="code-ref-3"></a>
## 3. 工具栏插件

> **提取方法**：搜索项目中的 usePlugin* 系列工厂。
> Codegraph 查询：`codegraph_search("usePlugin")`

### 3.1 可用插件一览

| 插件工厂 | 签名 | 用途 |
| -------- | ---- | ---- |
| TODO     | TODO | TODO |

### 3.2 各插件详细用法

```ts
// TODO: 每个插件给出真实使用范例
```

---

<a id="code-ref-4"></a>
## 4. 抽屉/弹窗模式

> **提取方法**：搜索项目中新增/编辑抽屉的完整实现。
> Codegraph 查询：`codegraph_context("新增编辑抽屉模式")`

### 4.1 命令式抽屉

```ts
// TODO: 提取命令式抽屉（如 useDrawer）的完整 API
```

### 4.2 声明式抽屉

```ts
// TODO: 提取声明式抽屉（如 BaseDrawer）的 props 和用法
```

### 4.3 新增/编辑完整模式

```ts
// TODO: 提取包含新增/编辑/脏数据拦截的完整抽屉模式
```

### 4.4 脏数据拦截（未保存检测）

```ts
// TODO: 提取未保存数据检测和拦截的完整实现
```

---

<a id="code-ref-5"></a>
## 5. 脏数据检测

> **提取方法**：搜索项目中的 diff/changed/edited 相关 hooks。
> Codegraph 查询：`codegraph_context("脏数据检测 diff changed")`

### 5.1 API 签名

```ts
// TODO: 提取脏数据检测工具的完整 API
```

### 5.2 使用范例

```ts
// TODO: 给出表单+表格双项配置的完整范例
```

---

<a id="code-ref-6"></a>
## 6. 请求层

> **提取方法**：搜索项目中的 request/api/useRequest 等。
> Codegraph 查询：`codegraph_context("请求层 request api useRequest")`

### 6.1 API 定义格式

```ts
// TODO: 提取 APIMap 的定义格式（如 [method, path, ReqType, ResType]）
```

### 6.2 聚合方式

```ts
// TODO: 提取 enter.ts 或 index.ts 的聚合方式
```

### 6.3 响应处理

```ts
// TODO: 提取响应数据的统一处理格式
```

### 6.4 调用范例

```ts
// TODO: 给出完整的 API 调用范例
```

---

<a id="code-ref-7"></a>
## 7. 路由注册

> **提取方法**：搜索项目中的 router/route 配置文件。
> Codegraph 查询：`codegraph_context("路由注册 route config")`

### 7.1 路由池格式

```ts
// TODO: 提取路由定义格式
```

### 7.2 菜单树格式

```ts
// TODO: 提取菜单树配置格式
```

### 7.3 命名约定

```text
// TODO: 提取路由/菜单的命名约定
```

---

<a id="code-ref-8"></a>
## 8. 权限控制

> **提取方法**：搜索项目中的 permission/auth/codes 等。
> Codegraph 查询：`codegraph_context("权限控制 permission auth codes")`

### 8.1 权限码定义

```ts
// TODO: 提取权限码的定义格式
```

### 8.2 权限检查

```ts
// TODO: 提取权限检查的使用方式
```

### 8.3 权限注入

```ts
// TODO: 提取权限注入的方式
```

---

<a id="code-ref-9"></a>
## 9. 状态管理

> **提取方法**：搜索项目中的 store/useXxxStore 等。
> Codegraph 查询：`codegraph_context("状态管理 store")`

### 9.1 Store 模式

```ts
// TODO: 提取 Store 的定义模式（如模块级 ref + 函数导出）
```

### 9.2 使用范例

```ts
// TODO: 给出完整的 Store 使用范例
```

---

<a id="code-ref-10"></a>
## 10. 抽屉组件

> **提取方法**：搜索项目中的 drawer/BaseDrawer 等。
> Codegraph 查询：`codegraph_context("抽屉组件 drawer")`

### 10.1 命令式抽屉 API

| 方法 | 签名 | 说明 |
| ---- | ---- | ---- |
| TODO | TODO | TODO |

### 10.2 声明式抽屉 Props

| Prop | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| TODO | TODO | TODO   | TODO |

---

<a id="code-ref-11"></a>
## 11. 导出功能

> **提取方法**：搜索项目中的 export/download/exportExcel 等。
> Codegraph 查询：`codegraph_context("导出功能 export download")`

### 11.1 导出字段配置

```ts
// TODO: 提取导出字段的配置格式
```

### 11.2 导出接口调用

```ts
// TODO: 提取导出接口的调用方式
```

### 11.3 导出前校验

```ts
// TODO: 提取导出前的数量校验逻辑
```

---

<a id="code-ref-12"></a>
## 12. 审批流

> **提取方法**：搜索项目中的 approval/审批 等。
> Codegraph 查询：`codegraph_context("审批流 approval")`

### 12.1 审批组件 API

```ts
// TODO: 提取审批流组件的完整 API
```

### 12.2 使用范例

```ts
// TODO: 给出完整的审批流使用范例
```

---

<a id="code-ref-appendix-a"></a>
## 附录 A：常用 import 清单

```ts
// TODO: 列出项目中常用的 import 路径
// 从现有代码中统计
```

<a id="code-ref-appendix-b"></a>
## 附录 B：关键约定速查

| 约定项       | 规则 |
| ------------ | ---- |
| 文件命名     | TODO |
| 组件命名     | TODO |
| API 函数命名 | TODO |
| 路由命名     | TODO |
| 权限码命名   | TODO |
| Store 命名   | TODO |
