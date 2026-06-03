# facts.md 模板

> `facts.md` 是 Frontend Spec Agent 的核心门禁。所有 design 结论必须能回溯到 PRD、MasterGo 分析、facts 或 TODO。

## 基础信息

| 项目 | 内容 |
| ---- | ---- |
| 需求名称 | TODO |
| 事实来源 | Codegraph / 组件库 / 示例页面 / 开发规范 / API 文档 |
| 生成时间 | TODO |
| 生成 Agent | Facts Agent |
| 可信度 | ✅Verified / ⚠️Unverified / ❌Unknown |

## 一、项目结构事实

| 探索项 | 文件路径 | 发现结论 | 复用方式 | import/注册位置 | 可信度 |
| ------ | -------- | -------- | -------- | --------------- | ------ |
| 页面目录 | TODO | TODO | TODO | TODO | TODO |
| 路由配置 | TODO | TODO | TODO | TODO | TODO |
| 请求目录 | TODO | TODO | TODO | TODO | TODO |
| 组件目录 | TODO | TODO | TODO | TODO | TODO |
| hooks/utils | TODO | TODO | TODO | TODO | TODO |

## 二、组件库事实

| 组件 | 来源路径 | 现有示例 | 职责 | props | emit/slots | 使用场景 | Evidence |
| ---- | -------- | -------- | ---- | ----- | ---------- | -------- | -------- |
| TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

## 三、相邻页面事实

| 页面/模块 | 文件路径 | 可复用模式 | 涉及组件 | 数据链路 | 权限/校验 | Evidence |
| --------- | -------- | ---------- | -------- | -------- | --------- | -------- |
| TODO | TODO | TODO | TODO | TODO | TODO | TODO |

## 四、请求与类型事实

| 模块 | API 文件 | API Map/函数 | 方法 | 路径 | 类型定义 | 调用示例 | Evidence |
| ---- | -------- | ------------ | ---- | ---- | -------- | -------- | -------- |
| TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

## 五、权限与状态事实

| 对象 | 权限码/状态码 | 展示规则 | 控制方式 | 来源 | 可信度 |
| ---- | ------------- | -------- | -------- | ---- | ------ |
| TODO | TODO | TODO | TODO | TODO | TODO |

## 六、开发规范事实

| 规范项 | 当前约定 | Evidence | 对 design.md 的约束 |
| ------ | -------- | -------- | ------------------- |
| TSX 属性 | TODO | TODO | TODO |
| JSDoc | TODO | TODO | TODO |
| 测试策略 | TODO | TODO | TODO |
| 目录命名 | TODO | TODO | TODO |

## 七、Unknown 与 TODO

| ID | 类型 | 问题 | 是否阻塞 design | 影响范围 | 临时方案 | 确认后修改位置 |
| -- | ---- | ---- | -------------- | -------- | -------- | -------------- |
| F-TODO-1 | TODO | TODO | 是/否 | TODO | TODO | design.md |

## 八、Facts 自检

| # | 检查项 | 状态 | 说明 |
| - | ------ | ---- | ---- |
| 1 | 已优先使用 Codegraph MCP | ✅/❌ | TODO |
| 2 | 关键组件均有 Evidence 或 TODO | ✅/❌ | TODO |
| 3 | 路由/请求/页面目录已确认 | ✅/❌ | TODO |
| 4 | 未编造路径、组件、接口、权限码 | ✅/❌ | TODO |
| 5 | 可进入 design.md 生成 | ✅/❌ | TODO |

