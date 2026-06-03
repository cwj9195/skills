# Review Checklist（Lab）

## 产物完整性

| 检查项 | 通过标准 | 状态 | 说明 |
| ------ | -------- | ---- | ---- |
| requirements.md | 范围、页面、流程、字段、权限、TODO 完整 | ✅/❌ | TODO |
| facts.md | 有代码库、组件、路由、请求 Evidence | ✅/❌ | TODO |
| design.md | 保留 13 章节，设计结论可追溯 | ✅/❌ | TODO |
| tasks.md | 可交给编码 Agent 分任务执行 | ✅/❌ | TODO |
| review.md | 给出是否进入编码的结论 | ✅/❌ | TODO |

## 门禁结论

| 结论 | 条件 | 处理 |
| ---- | ---- | ---- |
| 可进入编码 | P0/P1 检查通过，阻塞 TODO 已清零 | 交给编码 Agent |
| 可先做 Outline | 范围明确但原型/API 不完整 | 保留 TODO，不进入实现 |
| 阻塞 | 关键范围、接口、权限或组件 Evidence 缺失 | 补输入后重审 |

