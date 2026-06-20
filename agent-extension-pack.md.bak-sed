# Agent 拓展包

> 这是长期记忆文件，保存基础包之外的稳定偏好、经验沉淀和项目规则索引。基础包路径：`/Users/amoy/.cc-switch/skills/agent.md`。

## 目录

| 节  | 主题                          | 触发场景                                  |
| --- | ----------------------------- | ----------------------------------------- |
| §0  | 维护规则与写入准入            | 改拓展包前、判断能否写入                  |
| §1  | 写入模式（确认后/强制/周期）  | 判断是否该沉淀长期记忆                    |
| §2  | 长期偏好补充                  | 称呼缺失、结束报告字段争议                |
| §3  | 记忆体系维护经验              | 基础包体积、一次性偏好污染、索引自包含    |
| §4  | 工作流补充                    | 改 skills/MCP 源、工作树改动              |
| §5  | 项目规则索引                  | 进入 web-base 等已索引项目                |
| §6  | 待确认事项                    | 自动化提炼、多端同步                      |
| §7  | MCP 开发通用经验（7.1–7.3）   | 写 MCP、协议坑、cc-switch 管理、node 路径 |
| §8  | session-bridge MCP（8.1–8.7） | 跨工具会话读取、检索历史对话、grep 检索法 |
| §9  | rtk / shell 操作经验          | 写文件、管道污染、定位文件                |
| §10 | 工具链路与平台认知            | 平台工具 vs agent 工具、敏感信息读取      |

## 0. 维护规则

1. 本文件不重复基础包硬规则，只记录补充信息、经验和项目限定规则索引。
2. 新增或更新条目时，必须包含：内容、来源、适用范围、状态、最后确认时间。
3. 写入准入标准：重复出现 2 次以上、用户明确确认、跨项目稳定适用，满足其一才建议写入。
4. 不写入一次性任务、临时情绪、未验证猜测、当前会话私有上下文。
5. 条目状态统一使用：有效、项目限定、待确认、冲突、过期。
6. 若条目与当前项目 AGENTS 或系统/开发者指令冲突，优先遵守更高优先级指令，并在结束报告中说明。

## 1. 写入模式

| 模式       | 触发方式                                                                                | 写入规则                                                                                 | 状态   | 最后确认时间 |
| ---------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------ | ------------ |
| 确认后写入 | 默认模式；任务收尾只给长期记忆建议。                                                    | 用户说“确认写入长期记忆”后，才修改本文件。                                               | 有效   | 2026-06-12   |
| 强制写入   | 用户说“本次强制写入长期记忆：...”。                                                     | 本轮必须整理并写入对应条目，来源标为“用户强制要求”，并补齐适用范围、状态、最后确认时间。 | 有效   | 2026-06-12   |
| 周期复盘   | 未来可用 `/loop 1w 复盘最近 Codex/ClaudeCode 对话，提炼长期记忆候选并更新拓展包` 触发。 | 默认只生成候选清单；只有启用自动写入模式后才直接改文件。                                 | 待确认 | 2026-06-12   |

## 2. 长期偏好补充

| 内容                                                                                                 | 来源                                               | 适用范围 | 状态 | 最后确认时间 |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------- | ---- | ------------ |
| 用“主人”作为基础包加载偏离的可见信号；如果称呼缺失，应优先检查基础包是否被读取。                     | 用户粘贴的 Istishia 评论；会话确认                 | 全部会话 | 有效 | 2026-06-12   |
| 结束报告除完成内容与验证结果外，应包含风险、Regression Check、Defensive Code、是否建议沉淀长期记忆。 | `/Users/amoy/.cc-switch/skills/agent.md`；会话确认 | 全部会话 | 有效 | 2026-06-12   |
| 称呼缺失信号**主要服务用户外部监督**，非 agent 可靠自检器。2026-06-20 实证：连续 5 轮漏叫主人时 agent 未依本条自纠，由用户指出才纠正。根因（悖论）：要求"会漏规则的 agent"自检"漏规则"，自检这步也会漏；注意力被技术任务占满时规则自检随之失效。可靠纠正=用户反馈闭环；harness 级强制 > 规则驱动。 | 本会话实证 | 全部会话 | 有效 | 2026-06-20 |

## 3. 记忆体系维护经验

| 经验                                               | 正确做法                                                             | 来源                                              | 适用范围            | 状态 | 最后确认时间 |
| -------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------- | ------------------- | ---- | ------------ |
| 基础包过大会增加每轮上下文负担。                   | 基础包只保留硬规则；丰富偏好、踩坑经验和项目索引放拓展包，按需读取。 | 用户粘贴的 Istishia 评论；微信文章正文            | 全局 agent 记忆管理 | 有效 | 2026-06-12   |
| 把一次性偏好写进长期规则，会污染后续会话。         | 写入前检查是否满足写入准入标准；不满足时只在当前任务内遵守。         | 微信文章正文；用户粘贴的 Istishia 评论            | 长期记忆维护        | 有效 | 2026-06-12   |
| 只靠新会话临时说明，会导致偏好和踩坑经验反复丢失。 | 将稳定经验沉淀为可读取文件，并从基础包引用。                         | 微信文章正文《一个让Codex变得越来越聪明的小方法》 | 全局 agent 记忆管理 | 有效 | 2026-06-12   |

## 4. 工作流补充

| 内容                                                                               | 来源                                     | 适用范围             | 状态 | 最后确认时间 |
| ---------------------------------------------------------------------------------- | ---------------------------------------- | -------------------- | ---- | ------------ |
| 修改 skills 或 MCP 配置时，优先修改 cc-switch 源信息；下游同步产物不作为主编辑点。 | `/Users/amoy/.cc-switch/skills/agent.md` | skills、MCP 配置维护 | 有效 | 2026-06-12   |
| 工作树可能已有用户改动；执行修改前后都要避免回滚无关变更。                         | 系统协作规则；会话确认                   | 所有代码变更         | 有效 | 2026-06-12   |

## 5. 项目规则索引

| 项目/路径                                   | 规则摘要                                                                                                                                                                                                                               | 生效条件                                                                     | 来源                                    | 状态     | 最后确认时间 |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------- | -------- | ------------ |
| `/Users/amoy/Desktop/project/cckg/web-base` | 严格证据模式：仓库事实需要路径和锚点；证据不足时写 Unknown/TODO，不强行下结论。                                                                                                                                                        | 当前 cwd 属于该项目，或当前项目 AGENTS 显式引用该规则。                      | `web-base/AGENTS.md`                    | 项目限定 | 2026-06-12   |
| `/Users/amoy/Desktop/project/cckg/web-base` | UI/交互 bug 收尾必须包含 Regression Check 与 Defensive Code。                                                                                                                                                                          | 当前 cwd 属于该项目，或当前项目 AGENTS 显式引用该规则。                      | `web-base/AGENTS.md`                    | 项目限定 | 2026-06-12   |
| `/Users/amoy/Desktop/project/cckg/web-base` | 新增函数、组件、接口及公共声明时补齐 JSDoc；复杂注释解释设计原因、边界和权衡。                                                                                                                                                         | 当前 cwd 属于该项目，或当前项目 AGENTS 显式引用该规则。                      | `web-base/AGENTS.md`                    | 项目限定 | 2026-06-12   |
| `/Users/amoy/Desktop/project/cckg/web-base` | 不削弱测试资产，不删除关键断言，不扩大 exclusions 绕过问题。                                                                                                                                                                           | 当前 cwd 属于该项目，或当前项目 AGENTS 显式引用该规则。                      | `web-base/AGENTS.md`                    | 项目限定 | 2026-06-12   |
| `/Users/amoy/Desktop/project/cckg/web-base` | PIM M2 `PreselectedImportPreviewFieldsDto` 字段清单以 `apps/pim/docs/260608-第1版/sources/PRD.md:306-364` 的“临时预览表编辑规则”为准；`rowIndex/importStatus` 放外层 `PreselectedImportPreviewDto`，`fields` 从 `sameProductNo` 开始。 | 维护 `apps/pim/docs/PIM商品中心接口契约.md` 或同步 M2 预选品批量导入契约时。 | 用户确认写入长期记忆；本轮 PIM 契约修正 | 项目限定 | 2026-06-13   |

## 6. 待确认事项

| 事项                                                                                                  | 当前状态 | 下一步                               |
| ----------------------------------------------------------------------------------------------------- | -------- | ------------------------------------ |
| 是否需要自动化脚本定期从 Codex `sessions/`、`logs_2.sqlite`、`session_index.jsonl` 提炼拓展包候选项。 | 待确认   | 另起设计，不在当前拓展包精简中实现。 |
| 是否需要把拓展包同步到 Claude、Gemini、OpenCode 等其他客户端入口。                                    | 待确认   | 观察 Codex 全局入口效果后再决定。    |

## 7. MCP 开发通用经验

> 来源：2026-06-18 session-bridge MCP 开发过程沉淀。适用范围：所有本地 MCP 开发、cc-switch 维护。状态：有效。最后确认时间：2026-06-18。

### 7.1 MCP server 协议硬规则（踩坑：缺 jsonrpc → parse error 死循环洪水）
- 响应**必须** `{jsonrpc:"2.0", id, result|error}`；缺 `jsonrpc` 字段，client 解析失败 → 互相 parse error → 死循环刷屏（实测 101MB 日志）。
- initialize 的 protocolVersion **协商**：返回 client 发的版本（codex 要 2025-06-18，不能硬编码 2024-11-05）。
- stdio 传输 = line-delimited JSON（newline 分隔），不是 LSP 的 Content-Length。

### 7.2 cc-switch 的 MCP 管理（源信息 = cc-switch.db）
- `~/.cc-switch/cc-switch.db` 的 `mcp_servers` 表(id/name/server_config/enabled_claude/enabled_codex/...) 是 MCP 源信息。改 MCP 只改它，不改 .claude.json/codex config.toml。
- 同步机制：启动时全量 db→配置；运行中 `enabled_*` 字段有 watcher 实时同步；`server_config`(command/args) 改动**不实时同步**，需重启 cc-switch。
- cc-switch 是 GUI app(CC Switch.app) 且代理接管 claude(127.0.0.1:15721)，重启会短暂断 cc 连接。

### 7.3 node 路径避 GUI PATH 坑
- nvm node(~/.nvm/versions/node/vX/bin/node) 只在交互 shell PATH；GUI app(cc-switch) spawn 子进程的 PATH 可能不含。
- MCP server_config 的 command 优先用 node 全路径（不依赖 PATH）。cc(VSCode 扩展)/codex 实测 PATH 含 node；cc-switch GUI 测试连接可能用 GUI PATH 报超时。

## 8. session-bridge MCP 与会话续传

> 来源：2026-06-18 实现全过程 + 2026-06-20 检索经验。适用范围：跨工具会话读取、检索历史对话。状态：有效。最后确认时间：2026-06-20。

### 8.1 概念区分（避免混淆）
- 微信《AI Agent Handoff》的 Handoff = 多 Agent 协作**任务移交**（上下文隔离/分发回收/同框架同协议）。
- 主人需求 = 跨工具**会话续传**（上下文继承/增量/回原会话/跨厂商）——方向相反，不能套同一框架。
- session vs turn：一个对话框多次聊天，session ID 全程不变（=那份 transcript 文件），每 turn 各自内部 id；上下文连续=每轮重喂整份 session；交接=搬整份 session（用 session id 定位）。

### 8.2 现成工具调研结论（都是「导出→开新会话 resume」，做不到回原会话增量补）
cli-continues(1271⭐,Node,MIT) / casr(79,Rust) / ctxmv(32,Swift) / agent-migrator(10,**CC-BY-SA 协议，公司项目慎用**)。故自建 session-bridge（会话内给 ID 读取 + since 增量 + 回原会话）。

### 8.3 codex/claude 会话存储格式（session-bridge 解析依据）
| 工具   | 路径                                                          | 索引                                            | 文件 diff 源                                    | 消息 uuid   | 增量锚点          |
| ------ | ------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- | ----------- | ----------------- |
| codex  | ~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl                  | session_index.jsonl(thread_name/cwd/updated_at) | event_msg.patch_apply_end.unified_diff          | 无稳定 uuid | timestamp         |
| claude | ~/.claude/projects/<编码>/<sessionId>.jsonl(文件名=sessionId) | 无                                              | Edit(old_string/new_string)/Write(content) 重建 | 有 uuid     | uuid 或 timestamp |
- 项目编码：cwd 的 `/` 替换为 `-`。session ID = 文件名 uuid，全程不变。

### 8.4 跨工具 MCP：当前会话 ID 获取（2026-06-18 已修正）
- cc：子进程注入 `CLAUDE_CODE_SESSION_ID`，MCP/bash 都能 `process.env` 读，自动获取。
- codex：spawn 子进程确有 `env_clear()`+白名单（env 拿不到），**但 codex 在每次 `tools/call` 时把 session id 放进 `params._meta["x-codex-turn-metadata"].session_id`**（实证 /tmp/sb.log 握手日志）→ MCP 从 `_meta` 读即可自动获取。早期「codex 注定拿不到、需降级 list 指认」结论已证伪（会话 019ed884 修复验证）。
- 通用做法：`current_session` 探测式，按适配器顺序试每个工具特征（env / _meta key），返回首个命中。

### 8.5 session-bridge MCP 落地（v0.2.0 适配器化重构后，2026-06-18）
- **权威源**：`~/.cc-switch/skills/_MCP/handoff/mcp-server.mjs`（~420 行，零依赖 Node ESM）。`~/.codex/handoff/` 是历史遗留死副本，**已删**（db 不引用）。
- 工具：list_sessions / read_session(id, source?, since?, max_chars?) / current_session。read 默认输出上限 60000 字符（超限截断+提示），max_chars 可覆盖。
- 水位：`~/.cache/session-bridge/watermark.json`（XDG 运行时目录，首次自动从旧路径迁移，旧文件保留兜底），**不再写源码目录**。
- 注册：cc-switch.db mcp_servers，id=session-bridge，cc+codex 启用。
- 调试日志：`SB_DEBUG=1` 才写 /tmp/sb.log（默认关，生产干净）。
- 验证(2026-06-18)：current/list/read 全量/增量/截断/自动探测 source 全通；协议层 initialize/tools/list/tools/call 正常。

### 8.6 session-bridge 适配器化 + 扩展新工具方式（2026-06-18）
- 架构：source 解析抽成**适配器注册表** `adapters=[codexAdapter, claudeAdapter]`，每个实现 `{ source, find(id,project?), list(project,limit), parse(file), currentSession(env,meta) }`。主干遍历注册表，不 switch source。
- **加 opencode/pi 等新工具** = 加一个 adapter 对象 + 在 `adapters` push 一行，主干零改动。需先探明该工具：① 会话存储路径+格式（写 parse/find/list）② currentSession 特征（env 变量或 _meta key）。
- 兼容性分层：MCP 协议层任何客户端(opencode/pi)都能调 list/read 读 cc/codex 会话；读其自身会话需对应 adapter（未实现）。
- v0.2.0 修复清单：①watermark 迁移 ~/.cache ②删 .codex/handoff 死副本+源目录死 watermark ③调试日志 SB_DEBUG 门控 ④read 体积上限+截断 ⑤list 流式读取(不全量解析) ⑥错误可见化(lastError+console.error) ⑦适配器化重构。
- 已知：read 大会话时 rtk 包装对大 stdout 处理慢（非 MCP 慢，parse 瞬间完成），直接 MCP 调用不受影响；stdio MCP 改代码需重启/新会话才加载（当前会话挂旧进程）。

### 8.7 按关键词检索历史会话（2026-06-20）
> 来源：2026-06-20 主人要求「搜之前 swagger/openapi 导入 yapi 的对话」。适用范围：跨项目会话检索。状态：有效。最后确认时间：2026-06-20。
- read_session 只能按 ID 读、**不能搜关键词**；list_sessions 的 summary 只取开头一小段，目标话题常不在摘要里。按摘要盲读大会话（如 16M 的 codex 会话）既吃上下文又常落空。
- **正确顺序：grep 本地 jsonl 定位会话文件 → 再 read_session 读上下文**。路径见 8.3（codex `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`；claude `~/.claude/projects/<编码>/<sessionId>.jsonl`，编码=cwd 的 `/`→`-`）。
- 关键词收敛三步：① 英文独特词（`swagger`/`openapi`）找出候选文件集合；②「两词同行」`rtk rg -e "yapi.*(swagger|openapi)" -e "(swagger|openapi).*yapi"` 收敛到真正相关行（单文件大量命中常是工具返回里的 `$ref`/schema 残留，非用户意图）；③ 用户原话在 `event_msg.user_message.message` / `content[].text`，用精确中文短语（`转成openapi`/`上传到yapi`/`导入yapi`）最能锁定请求本身。
- 输出过大时：`grep -v tool-results` / `head -N` / 先 `uniq -c` 看命中会话分布，避免 400KB 污染上下文。
- **教训（本次实证）**：开头按摘要盲读 3 个大会话后才切 grep；以后「在历史会话里找某话题」应 **grep 优先**，read_session 仅用于读已定位会话的上下文。

## 9. rtk / shell 操作经验

> 来源：日常 rtk 使用实证。适用范围：所有需 shell 操作的场景。状态：有效。最后确认时间：2026-06-18。

- `rtk cat > file <<'EOF'`(写文件)、`rtk sqlite3 db <<'SQL'`(执行 SQL)、`rtk node <<'JS'`(跑脚本) 均工作。
- `rtk find | rtk head` 管道输出可能被污染(输出 hex 串)；定位文件用 `rtk find` 单跑或 `rtk ls` 逐步。
- `ls -t` 输出带 size 会污染变量，取文件用 `find`(纯路径)。

## 10. 工具链路与平台认知

> 来源：2026-06-18 本会话 cc-switch.log 实证 + 工具结果"Z.ai Built-in"标记。适用范围：全部会话。状态：有效。最后确认时间：2026-06-18。
- **cc 实际链路**：cc → cc-switch 代理(127.0.0.1:15721) → 中转服务(腾讯云 81.70.81.85:23100) → model=glm-5.2。harness 声明 MiniMax-M2，实际路由 glm-5.2（中转前后端模型可能不一致）。
- **工具两层（关键区分）**：
  - agent 工具（cc-switch.db 的 mcp_servers：session-bridge/codegraph/fetch/...）：**本地执行**，cc-switch 可管，日志可见。
  - 平台工具（webReader/web_search_prime，标 `Z.ai Built-in`）：中转平台(Z.ai/智谱)注入，**平台侧执行**，cc-switch 管不到，请求经腾讯云中转。
- **机制**：模型/平台提供工具是普遍能力（类比 OpenAI web_search/code_interpreter、Gemini grounding、智谱 web_search_prime）——模型生成 tool_call → 平台拦截执行 → 结果注入模型上下文，对 agent 半透明。
- **隐私偏好（重要）**：涉及公司敏感信息（代码/会话/密钥）的读取，只用本地 MCP（fetch/session-bridge），避开平台 webReader/web_search_prime（经中转）。
