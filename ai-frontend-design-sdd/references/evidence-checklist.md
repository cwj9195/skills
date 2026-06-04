# 证据清单

## 输入可用性

开始前建立表格：

```text
输入 | 来源 | 是否可访问 | 已验证内容 | 缺失内容 | 状态
PRD | ... | ... | ... | ... | ...
MasterGo | ... | ... | ... | ... | ...
原型 | ... | ... | ... | ... | ...
当前代码 | ... | ... | ... | ... | ...
企业组件库 | ... | ... | ... | ... | ...
API/接口 | ... | ... | ... | ... | ...
```

## PRD 证据

检查：

- 功能目标
- 用户角色
- 业务流程
- 字段规则
- 权限规则
- 验收标准
- 非功能要求
- 边界与异常

## UI/原型证据

检查：

- 页面入口
- 页面布局
- 组件类型
- 表单字段
- 表格列
- 操作按钮
- 弹窗/抽屉/气泡确认
- loading/empty/error/disabled/readonly/saving 状态
- 响应式规则
- 文案与提示

## 代码证据

优先用 Codegraph MCP 检查：

- 路由入口
- 页面组件
- 业务组件
- 组合 hooks
- store
- request/api
- 权限组件或指令
- 国际化
- 测试文件
- 共享组件影响面

证据格式：

```text
Evidence: `path/to/file.ts:12` 片段：xxx
Evidence: Codegraph symbol `useFoo` callers: A, B, C
```

## 组件库证据

检查：

- 是否已有目标组件
- props/slots/events
- disabled/readonly/loading 语义
- 表单校验方式
- 表格分页/筛选/排序方式
- 弹窗确认方式
- 图标与按钮规范
- 主题 token 与间距规范

## API 证据

检查：

- 接口路径
- method
- 请求参数
- 响应结构
- 错误码
- 权限失败
- 幂等/重复提交
- 分页/排序/筛选
- mock 或现有调用示例

## 验收证据

检查：

- 可自动化测试点
- 手工回归路径
- 构建/typecheck/test 命令
- 已知失败基线
- 不能执行的原因

## AI 可执行性证据

检查：

- 是否有固定文件链路：`facts.md`、`spec.md`、`code-reference.md`、`frontend-design.md`、`tasks.md`、`claude-code-task.md`、`ci-gate.md`、`agent-prompts.md`、`fact-set.yaml`
- 是否每个模块都有范围、页面、路由、组件、状态、接口、权限、异常、测试、实现
- 是否每个任务都有目标、输入证据、输出文件、依赖、验收、停止条件
- 是否有实现顺序和依赖关系
- 是否有 Current Evidence Gate 与 Required Engineering Gate
- 是否有可复制的 Agent Prompt
- 是否明确不确定项的处理方式

## Fail-Closed 条件

出现以下情况，不继续编造：

- PRD 与 UI 核心流程冲突。
- API 字段缺失且无法从代码推导。
- 组件库能力未知且会影响架构。
- 权限或保存语义不明。
- 当前代码证据无法定位入口。
- 验收标准不可验证。
