# frontend-design.md 模板

| 项目 | 内容 |
| ---- | ---- |
| 需求名称 | TODO |
| 来源 requirements | `requirements.md` |
| 来源 facts | `facts.md` |
| 生成工具 | frontend-design-agent |
| 工具版本 | v1.0.0 |
| 生成时间 | TODO |
| 状态 | [ ] 提纲版 [ ] AI 可落地版 [ ] 已确认 |

## 0. 总览与公共约定

| 项目 | 约定 |
| ---- | ---- |
| 技术栈 | TODO |
| 路由约定 | TODO |
| API 约定 | TODO |
| 状态管理 | TODO |
| 组件库 | TODO |
| 权限模式 | TODO |

## 模块：TODO

### 1. 模块证据与范围

| 探索项 | 文件路径 | 发现结论 | 复用方式 | import/注册位置 | 可信度 |
| ------ | -------- | -------- | -------- | --------------- | ------ |
| TODO | TODO | TODO | TODO | TODO | Verified/Inferred/Fallback |

### 2. 文件变更计划

| 变更类型 | 文件路径 | 实现内容 | 依赖 | 参考实现 |
| -------- | -------- | -------- | ---- | -------- |
| 新增/修改 | TODO | TODO | TODO | Evidence(path:line) |

### 3. 页面结构与路由

```text
页面线框图 TODO
```

```ts
// 路由示例 TODO
```

### 4. UI 布局与交互契约

| 区域 | 组件 | 布局 | 交互 | 状态 | Evidence |
| ---- | ---- | ---- | ---- | ---- | -------- |
| TODO | TODO | TODO | TODO | TODO | MasterGo(fileId:layerId) |

### 5. 数据模型与字段字典

| 字段标签 | 字段 key | 类型 | 控件类型 | 必填 | 默认值 | 校验规则 | 枚举值/数据源 | API 映射 | 展示规则 |
| -------- | -------- | ---- | -------- | ---- | ------ | -------- | ------------- | -------- | -------- |
| TODO | TODO | string | TODO | 是/否 | TODO | TODO | TODO | TODO | TODO |

```ts
interface TodoRequest {
  id: string;
}

interface TodoResponse {
  id: string;
}
```

### 6. API 契约

| 接口名称 | API 函数名 | API 文件 | 方法 | 路径 | 入参 schema | 出参 schema | 错误处理 | 调用时机 | loading key | 成功后处理 | 状态 |
| -------- | ---------- | -------- | ---- | ---- | ----------- | ----------- | -------- | -------- | ----------- | ---------- | ---- |
| TODO | TODO | TODO | GET | /api/todo(待确认) | TODO | TODO | TODO | TODO | TODO | TODO | 待确认 |

```ts
export const todoApiMap = {
  query: '/api/todo',
};
```

### 7. 组件复用与新建组件契约

| 组件 | 来源路径 | 现有示例 | 职责 | props | emit/slots | 使用场景 | Evidence |
| ---- | -------- | -------- | ---- | ----- | ---------- | -------- | -------- |
| TODO | TODO | TODO | TODO | TODO | TODO | TODO | Evidence(path:line) |

| 中文名 | 代码名 | 文件路径 | 职责 | props | emits | slots | exposed | 使用方 |
| ------ | ------ | -------- | ---- | ----- | ----- | ----- | ------- | ------ |
| TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

### 8. 状态、缓存与数据链路

| 状态名 | 存放位置 | 初始值 | 写入时机 | 清空时机 | 是否持久化 |
| ------ | -------- | ------ | -------- | -------- | ---------- |
| TODO | TODO | TODO | TODO | TODO | 是/否 |

```ts
export function useTodoModule() {
  return {};
}
```

### 9. 权限、校验与状态机

| 权限层级 | 控制对象 | 规则 | 无权限展示 |
| -------- | -------- | ---- | ---------- |
| TODO | TODO | TODO | TODO |

| 状态 | 中文名 | UI 表现 | 允许动作 | 禁止动作 |
| ---- | ------ | ------- | -------- | -------- |
| idle | 初始 | TODO | TODO | TODO |

### 10. 异常、边界与性能

| 场景 | 处理 | UI 表现 | 验证方式 |
| ---- | ---- | ------- | -------- |
| TODO | TODO | TODO | TODO |

### 11. Hooks 与工具函数

```ts
export interface UseTodoOptions {
  enabled: boolean;
}
```

### 12. 实现步骤

| 步骤 | 操作 | 涉及文件 | 前置依赖 | 完成标准 |
| ---- | ---- | -------- | -------- | -------- |
| 1 | TODO | TODO | TODO | TODO |

### 13. 验收标准与 TODO

| 场景 | Given | When | Then | 验证方式 |
| ---- | ----- | ---- | ---- | -------- |
| TODO | TODO | TODO | TODO | TODO |

| ID | 类型 | 问题 | 是否阻塞实现 | 影响范围 | 临时方案 | 负责人 | 优先级 | 确认后需修改章节 |
| -- | ---- | ---- | ------------ | -------- | -------- | ------ | ------ | ---------------- |
| D-TODO-1 | TODO | TODO | 是/否 | TODO | TODO | TODO | P0/P1/P2 | TODO |
