#!/usr/bin/env bash
# cc/codex Stop hook：检查输出模板三件套（主人 / 本轮使用 / 结束报告）
# 兼容 cc(.message.content[].text) 与 codex(.payload.content[].text|output_text，参考 session-bridge mcp-server.mjs:119)
# 缺则 exit 2 阻断补齐；active=true 放行防递归；无 jq/无 transcript/取不到 放行防误伤
set -uo pipefail
command -v jq >/dev/null 2>&1 || exit 0
input=$(cat)
tp=$(printf '%s' "$input" | jq -r '.transcript_path // .transcript // .session_transcript // empty')
sha=$(printf '%s' "$input" | jq -r '.stop_hook_active // false')
[ "$sha" = "true" ] && exit 0
[ -z "$tp" ] && exit 0
[ -f "$tp" ] || exit 0
last=$(jq -rs 'map(select(.type=="assistant"))|last|(.message.content // [])|map(.text // .output_text // "")|join("")' "$tp" 2>/dev/null)
if [ -z "$last" ]; then
  last=$(jq -rs 'map(select(.type=="response_item" and (.payload.type?=="message") and (.payload.role?=="assistant")))|last|(.payload.content // [])|map(.text // .output_text // "")|join("")' "$tp" 2>/dev/null)
fi
[ -z "$last" ] && exit 0
miss=""
printf '%s' "$last" | grep -q '主人'    || miss="$miss 「主人」"
printf '%s' "$last" | grep -q '本轮使用' || miss="$miss 「本轮使用」"
printf '%s' "$last" | grep -q '结束报告' || miss="$miss 「结束报告」"
if [ -n "$miss" ]; then
  printf '输出模板缺:%s，补齐后再结束。\n' "$miss" >&2
  exit 2
fi
exit 0
