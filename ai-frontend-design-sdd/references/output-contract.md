# 输出契约

## 设计书章节

输出必须使用以下章节：

1. 问题分析
2. 系统架构
3. Agent设计
4. Skills设计
5. MCP设计
6. Prompt设计
7. 实现方案
8. 风险与优化
9. TODO & Known Issues

## 1. 问题分析

包含：

- 背景目标
- 用户与场景
- 范围内/范围外
- 核心业务流程
- 输入证据表
- 冲突与缺口

## 2. 系统架构

包含：

- 页面/模块架构
- 数据流架构
- 状态管理策略
- 请求/API 策略
- 权限与路由策略
- 组件库复用策略
- 测试与质量门禁

## 3. Agent设计

至少定义：

- `Requirement Analyst Agent`：抽取 PRD、原型与验收标准。
- `UI Mapping Agent`：映射 MasterGo 到组件、布局和状态。
- `Code Archaeologist Agent`：用 Codegraph 建立代码证据与影响面。
- `Component Library Agent`：确认企业组件能力与封装边界。
- `Frontend Architect Agent`：合并架构方案与任务拆解。
- `QA Gate Agent`：检查证据、测试、回归与风险。

每个 Agent 写清：

- 输入
- 输出
- 使用工具
- 停止条件
- 质量标准

## 4. Skills设计

说明本次需要哪些 skills：

- SDD 设计书生成 skill
- MasterGo/UI 解读 skill（如存在或需创建）
- 企业组件库映射 skill（如存在或需创建）
- 代码证据采集 skill（如存在或需创建）

不要假设 skill 已存在；不存在则写“建议创建”。

## 5. MCP设计

说明 MCP 协作：

- Codegraph MCP：代码结构、符号、调用链、影响面。
- Chrome DevTools MCP：MasterGo/原型/本地页面视觉与交互验证。
- 文件系统 MCP：写入设计书与任务文件。
- Git MCP：查看变更、分支、提交差异。
- 其他 MCP：仅在用户环境明确可用时使用。

每个 MCP 必须写：

- 用途
- 输入
- 输出
- 失败降级
- 证据格式

## 6. Prompt设计

至少输出：

- 总控 Agent Prompt
- 需求分析 Agent Prompt
- UI 映射 Agent Prompt
- 代码证据 Agent Prompt
- 任务拆解 Agent Prompt
- QA Gate Agent Prompt

Prompt 必须包含：

- 角色
- 输入
- 输出格式
- 禁止项
- Fail-Closed 规则
- Evidence 规则

## 7. 实现方案

包含：

- 文件产物清单
- 任务拆解表
- 修改顺序
- 依赖关系
- 回归检查
- 验收命令或手工验证方式

任务表字段：

```text
ID | 目标 | 输入证据 | 输出文件 | 依赖 | 验收 | 风险 | 状态
```

## 8. 风险与优化

覆盖：

- 需求风险
- UI 风险
- 技术风险
- 组件库风险
- 测试风险
- Agent 执行风险
- 后续优化

## 9. TODO & Known Issues

所有缺失证据和阻塞项写这里：

```text
- [ ] TODO-001: xxx
  缺失证据: ...
  影响: ...
  推荐处理: ...
```

## 文件产物建议

当需要写入设计目录时，推荐生成：

- `spec.md`：SDD Spec，记录需求与验收。
- `frontend-design.md`：架构、UI、数据流、实现方案。
- `code-reference.md`：代码证据与组件库映射。
- `tasks.md`：AI 可执行任务。
- `agent-prompts.md`：可复制给子 Agent 的 prompts。

## 语言与证据

- 默认使用中文。
- 仓库事实必须附 Evidence。
- 外部 UI 或原型事实必须附来源截图、链接、节点名或访问路径。
- 推断必须标注 `Inference`。
- 证据不足必须标注 `TODO` 或 `❌Unknown`。
