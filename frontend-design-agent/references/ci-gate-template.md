# ci-gate.md 模板

| 项目 | 内容 |
| ---- | ---- |
| 需求名称 | TODO |
| 来源任务 | `claude-code-task.md` |
| 来源 Fact Set | `fact-set.yaml` |
| 当前状态 | [ ] 未验证 [ ] 通过 [ ] 失败 [ ] 既有失败 |

## 1. 规格门禁

| 检查项 | 命令/方式 | 期望 | 状态 | 备注 |
| ------ | --------- | ---- | ---- | ---- |
| requirements | 人工/脚本检查 | 模块、角色、权限、验收完整 | TODO | TODO |
| facts | 脚本检查 | 包含 Evidence，可信度明确 | TODO | TODO |
| frontend-design | 脚本检查 | 每模块 13 章节齐全 | TODO | TODO |
| fact-set | 脚本检查 | Given/When/Then 可转测试 | TODO | TODO |
| claude task | 脚本检查 | 包含 Regression Check / Defensive Code | TODO | TODO |

## 2. 工程门禁

| 命令 | 期望 | 状态 | 失败处理 |
| ---- | ---- | ---- | -------- |
| `pnpm run test:run` | 通过 | TODO | 修复或记录既有失败 |
| `pnpm run typecheck` | 通过 | TODO | 修复或记录既有失败 |
| `pnpm run build` | 通过 | TODO | 正式交付前执行 |
| `pnpm run lint` | 通过 | TODO | 按项目实际命令调整 |

## 3. Fact 验证映射

| Fact ID | 测试类型 | 测试文件 | 验证命令 | 状态 |
| ------- | -------- | -------- | -------- | ---- |
| TODO | unit/e2e/contract | TODO | TODO | TODO |

## 4. 阻塞项

| ID | 类型 | 问题 | 是否阻塞交付 | 临时方案 | 负责人 |
| -- | ---- | ---- | ------------ | -------- | ------ |
| C-TODO-1 | TODO | TODO | 是/否 | TODO | TODO |
