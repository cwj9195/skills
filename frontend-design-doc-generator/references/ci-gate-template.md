# CI Gate 模板

| 项目 | 内容 |
| ---- | ---- |
| 需求名称 | TODO |
| 来源任务 | `claude-code-task.md` |
| 当前状态 | [ ] 未验证 [ ] 通过 [ ] 失败 [ ] 既有失败 |

## 1. 规格门禁

| 检查项 | 命令/方式 | 期望 | 状态 | 备注 |
| ------ | --------- | ---- | ---- | ---- |
| Spec Kit 结构 | `pnpm run spec-kit:check` | 通过 | TODO | TODO |
| v6 设计书 | 脚本检查 | `工具版本 v6.0.0` 且 13 章节齐全 | TODO | TODO |
| Evidence | 脚本检查 | facts/fact-set 包含 Evidence | TODO | TODO |
| Claude Task | 脚本检查 | 包含 Regression Check / Defensive Code | TODO | TODO |

## 2. 工程门禁

| 命令 | 期望 | 状态 | 失败处理 |
| ---- | ---- | ---- | -------- |
| `pnpm run test:run` | 通过 | TODO | 修复或记录既有失败 |
| `pnpm run typecheck` | 通过 | TODO | 当前 Node/vue-tsc 既有失败需单独记录 |
| `pnpm run build` | 通过 | TODO | 正式交付前执行 |

## 3. 阻塞项

| ID | 类型 | 问题 | 是否阻塞交付 | 临时方案 | 负责人 |
| -- | ---- | ---- | ------------ | -------- | ------ |
| C-TODO-1 | TODO | TODO | 是/否 | TODO | TODO |
