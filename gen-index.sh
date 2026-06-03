#!/bin/bash
# gen-index.sh — 自动生成 Skills 中文索引 INDEX.md
# 用法: ./gen-index.sh          # 手动执行一次
#       ./gen-index.sh --watch  # 后台监听模式，文件夹变动自动更新

SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
INDEX_FILE="$SKILLS_DIR/INDEX.md"

# ---- 中文描述映射（新增 Skill 时在这里加一个 case）----
get_desc() {
  case "$1" in
    agent-browser-cli)
      echo "🌐 **浏览器控制** — 用 Rust CLI 接管你正在用的 Chrome，保留登录态和 Cookie。支持点击、填写、截图、PDF、网络监控、多标签/多 Profile 管理。";;
    babysit)
      echo "🔄 **PR 自动管理** — 自动跟踪 PR 状态，处理评审意见、修复 CI 失败，循环维护直到 PR 可以合并。";;
    element-style-inspector)
      echo "🎨 **元素样式检查** — 查看浏览器中指定元素的 computed style，支持跨页面样式比对，排查 CSS 差异和覆盖问题。";;
    find-skills)
      echo "🔍 **发现新 Skills** — 搜索和安装社区 Skills，当你想知道「有没有某个功能的 Skill」时使用。";;
    frontend-design-agent)
      echo "📐 **前端设计书生成系统** — 根据 PRD、MasterGo、原型、现有代码和公司组件库，生成 AI 可落地的前端设计书、Fact Set、任务包和 CI 门禁。";;
    frontend-design-doc-generator)
      echo "📋 **前端设计书生成** — 根据 PRD、原型、UI 设计和代码库，生成 AI 可独立实现的前端实施设计书。";;
    loop)
      echo "⏰ **定时循环执行** — 按间隔重复执行某个命令或 Skill，适合轮询状态、定时检查等场景。";;
    shell)
      echo "💻 **Shell 命令执行** — 用 /shell 前缀直接执行终端命令，跳过 AI 处理，原样执行。";;
    skill-vetter)
      echo "🛡️ **Skill 安全审查** — 安装第三方 Skill 前做安全检查，识别可疑权限、危险模式和红旗指令。";;
    split-to-prs)
      echo "✂️ **拆分 PR** — 把一大堆改动拆成多个小 PR，方便 code review。";;
    statusline)
      echo "📊 **CLI 状态栏** — 配置 Claude Code 命令行底部的自定义状态栏，显示会话信息。";;
    summarize)
      echo "🧾 **内容摘要转写** — 对 URL、YouTube 视频、PDF、播客等生成摘要或转写文字稿。";;
    update-cli-config)
      echo "⚙️ **CLI 配置修改** — 查看和修改 Claude Code CLI 配置（权限、审批模式、vim 模式、沙箱等）。";;
    *)
      # 没有映射时，从 SKILL.md 提取
      if [ -f "$SKILLS_DIR/$1/SKILL.md" ]; then
        echo "❓ **$1** — $(grep -m1 '^description:' "$SKILLS_DIR/$1/SKILL.md" | sed "s/^description:[[:space:]]*//" | sed "s/['\">-]//g" | head -c 80)"
      else
        echo "❓ **$1** — （无描述文件）"
      fi
      ;;
  esac
}

# ---- 生成 ----
generate() {
  local now
  now=$(date '+%Y-%m-%d %H:%M')
  local count=0
  local rows=""

  for dir in "$SKILLS_DIR"/*/; do
    [ -d "$dir" ] || continue
    local name
    name=$(basename "$dir")
    count=$((count + 1))
    local desc
    desc=$(get_desc "$name")
    rows="${rows}| $count | \`$name\` | ${desc//|/\\|} |"$'\n'
  done

  cat > "$INDEX_FILE" << EOF
# Skills 中文索引

> ⚡ 自动生成，请勿手动编辑。由 \`gen-index.sh\` 脚本维护。
> 最后更新：$now

## 当前可用 Skills（共 $count 个）

| # | Skill 名称 | 一句话说明 |
|---|---|---|
${rows}
## 全局指令文件

| 文件 | 说明 |
|---|---|
| \`RTK.md\` | RTK (Rust Token Killer) 使用规则，Shell 命令加 rtk 前缀节省 Token |
| \`agent.md\` | Agent 相关指令 |
EOF

  echo "[$now] INDEX.md 已更新（$count 个 Skills）"
}

# ---- 监听模式 ----
if [ "$1" = "--watch" ]; then
  echo "👀 监听 $SKILLS_DIR 变动中...（Ctrl+C 退出）"
  generate
  fswatch -0 "$SKILLS_DIR" | while read -d '' event; do
    sleep 0.5
    generate
  done
else
  generate
fi
