# _HOOKS — hook 脚本单一源

> 与 `_MCP/` 同构：hook 脚本存此处（**源**），cc / codex 的 hook 配置各自指向这里的脚本（**消费**），单一源、避免双写漂移。

## 规划脚本
- `check-template.sh`（待落地）：回复结束时检查输出模板三件套（主人 / 本轮使用 / 结束报告），缺则阻断（cc Stop）或记录（codex）。

## 两端引用方式
- **cc**：`~/.claude/settings.json` → `hooks.Stop[].command` 指向此处脚本
- **codex**：codex hooks 配置（`/hooks` 管理）指向此处脚本

## 边界（诚实）
脚本（检查逻辑）能单一源；但 cc / codex hook 事件覆盖不对等——cc 有 `Stop` 可 `exit 2` 阻断补齐；codex 事件较少（`Stop` 等价待确认），执行力可能降级为记录。
