---
name: frontend-spec-agent-lab
description: 隔离实验版 Frontend Spec Agent。用于在不改动现有 FrontendSpecAgent 与 frontend-design-doc-generator 源文件的前提下，把 PRD、旧设计书、MasterGo/Figma、现有代码库和企业组件库转换为 requirements.md、facts.md、design.md、tasks.md、review.md 样例闭环。
---

# Frontend Spec Agent Lab

## 定位

本 skill 是隔离实验版，用来验证 `PRD / 旧设计书 / 原型 / 代码库 / 企业组件库 -> Frontend Implementation Spec -> Tasks` 的闭环。

它不覆盖、不修改以下已有源：

- `/Users/amoy/.cc-switch/skills/FrontendSpecAgent.md`
- `/Users/amoy/.cc-switch/skills/frontend-design-doc-generator/SKILL.md`
- `/Users/amoy/.cc-switch/skills/frontend-design-doc-generator/references/*`

## 标准产物

每个样例目录必须包含：

- `requirements.md`：需求范围、页面、流程、字段、权限、验收和待确认问题。
- `facts.md`：代码库、组件库、相邻页面、请求、路由、规范事实。
- `design.md`：AI 可落地前端实现设计书，保留 13 章节结构。
- `tasks.md`：可交给编码 Agent 的任务拆解。
- `review.md`：Review Agent 门禁结论。

## 工作流

1. 识别输入材料：PRD、旧设计书、MasterGo/Figma、API 文档、补充说明。
2. 优先用 Codegraph MCP 收集项目结构、符号、页面、路由、请求、组件、hooks、影响面。
3. 当 Codegraph 不足以给出完整 Markdown 或行号时，再用 `rtk sed`、`rtk rg` 读取文件。
4. 如输入包含 MasterGo 链接，使用 `mastergo-magic-mcp.getDsl`；无法访问时标 `(待确认：原型未提供)`。
5. 按 `requirements -> facts -> design -> tasks -> review` 顺序输出。

## 参考文件

按需读取：

- `references/company-component-map.md`
- `references/facts-template.md`
- `references/tasks-template.md`
- `references/review-checklist.md`

## 硬规则

- 禁止从 PRD 直接跳到代码。
- 禁止写“按原型实现”“参考 PRD”“参考设计稿”等空描述。
- 所有关键结论必须来自需求、旧设计书、Codegraph Evidence、文件 Evidence、MasterGo 分析或结构化 TODO。
- 不编造不存在的路径、组件、接口、权限码、字段 key。
- 缺 MasterGo 或 API 文档不阻塞样例生成，但必须进入 TODO。
- `tasks.md` 必须从 `design.md` 拆解，不能重新自由规划。

