#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
bad_total=0
old_terms=("R""EQ" "F""IELD" "R""ULE" "F""LOW" "S""TATE" "P""ERM" "A""PIHINT" "R""N" "P""ASS" "F""AIL" "B""locked" "V""erified" "F""allback" "U""nverified")
old_pattern="$(IFS='|'; echo "${old_terms[*]}")"
old_human_1="Review"" Notes"
old_human_2="UI"" Source"

if [[ ! -d "$ROOT" ]]; then
  echo "目录不存在: $ROOT"
  exit 2
fi

echo "开始校验模块拆分产物: $ROOT"

while IFS= read -r module_file; do
  module_dir="$(dirname "$module_file")"
  module_name="$(basename "$module_dir")"
  bad=0

  echo "检查: $module_name"

  if grep -Eq "\\b(${old_pattern})\\b|${old_human_1}|${old_human_2}|ui-evidence|prototype-flow|review-notes|api-hints|gate-checklist|fields-permissions" "$module_file"; then
    echo "  失败: 存在旧英文标签或旧锚点"
    bad=$((bad + 1))
  fi

  if grep -Eq '\|[[:space:]]*字段-M[0-9]+-[0-9]+[[:space:]]*\|[[:space:]]*字段[[:space:]]*\|[[:space:]]*(\*\*字段名称\*\*|\*\*展示内容\*\*|\*\*展示规则\*\*|:---|[0-9]+)[[:space:]]*\|' "$module_file"; then
    echo "  失败: 字段列表疑似混入表头或分隔符"
    bad=$((bad + 1))
  fi

  short_needs="$(awk -F'|' '/\|[[:space:]]*需求-M[0-9]+-[0-9]+/ {gsub(/^ +| +$/, "", $4); if (length($4) <= 10) count++} END {print count + 0}' "$module_file")"
  if [[ "${short_needs:-0}" -gt 0 ]]; then
    echo "  失败: 存在疑似标题搬运的短需求 $short_needs 条"
    bad=$((bad + 1))
  fi

  if grep -Eq '\|[[:space:]]*规则-M[0-9]+-[0-9]+.*(<img|<font|<br|/>)' "$module_file"; then
    echo "  失败: 规则中存在 HTML 碎片"
    bad=$((bad + 1))
  fi

  if grep -Eq '模块特有：PRD中[0-9]+个子章节|参数替换模板' "$module_file"; then
    echo "  失败: 审查记录疑似模板化"
    bad=$((bad + 1))
  fi

  if echo "$module_name" | grep -q '钉钉' && grep -q '接口线索.*批量导入' "$module_file"; then
    echo "  失败: 钉钉通知模块出现不相关导入接口线索"
    bad=$((bad + 1))
  fi

  if echo "$module_name" | grep -q '推送' && grep -q '接口线索.*列表查询' "$module_file"; then
    echo "  失败: 推送模块出现泛化列表查询接口线索"
    bad=$((bad + 1))
  fi

  dsl_missing="$(
    python3 - "$module_file" <<'PY'
import pathlib, re, sys
module = pathlib.Path(sys.argv[1])
text = module.read_text(encoding='utf-8')
rows = [line for line in text.splitlines() if line.lstrip().startswith('|') and '界面-' in line and 'DSL' in line]
missing = []
for line in rows:
    if '已验证' not in line:
        continue
    refs = re.findall(r'sources/mastergo/([^\]\)\s|]+\.dsl\.json)', line)
    if not refs:
        missing.append('已验证界面缺少 DSL 文件链接')
        continue
    for ref in refs:
        if not (module.parent / 'sources' / 'mastergo' / ref).exists():
            missing.append(ref)
for item in missing:
    print(item)
PY
  )"
  if [[ -n "$dsl_missing" ]]; then
    echo "  失败: 已验证 DSL 文件不存在或未链接: $dsl_missing"
    bad=$((bad + 1))
  fi

  gate_file="$module_dir/_gate.json"
  if [[ ! -f "$gate_file" ]]; then
    echo "  失败: 缺少 _gate.json"
    bad=$((bad + 1))
  else
    gate_error="$(
      python3 - "$gate_file" <<'PY'
import json, pathlib, sys
gate = pathlib.Path(sys.argv[1])
try:
    data = json.loads(gate.read_text(encoding='utf-8'))
except Exception as exc:
    print(f'JSON 解析失败: {exc}')
    raise SystemExit(0)
allowed_status = {'通过', '失败', '阻塞', '已验证', '未验证', '降级证据', '待确认'}
old_keys = {'gateProfile', 'gateResult', 'gateStatus', 'verdict', 'checks', 'status', 'reason', 'value', 'threshold', 'summary', 'notes', 'dslSource'}
required_any = {'门禁状态', '门禁'}
errors = []
if not any(k in data for k in required_any):
    errors.append('缺少中文门禁状态字段')
def walk(value, path=''):
    if isinstance(value, dict):
        for k, v in value.items():
            if k in old_keys:
                errors.append(f'旧英文 key: {path}/{k}')
            walk(v, f'{path}/{k}')
    elif isinstance(value, list):
        for i, v in enumerate(value):
            walk(v, f'{path}[{i}]')
    elif isinstance(value, str):
        old_values = {'P'+'ASS', 'F'+'AIL', 'B'+'locked', 'V'+'erified', 'F'+'allback', 'U'+'nverified'}
        if value in old_values:
            errors.append(f'旧英文状态: {path}={value}')
walk(data)
for item in errors:
    print(item)
PY
    )"
    if [[ -n "$gate_error" ]]; then
      echo "  失败: _gate.json 不符合中文门禁结构: $gate_error"
      bad=$((bad + 1))
    fi
  fi

  if [[ "$bad" -gt 0 ]]; then
    echo "  结论: 失败 ($bad)"
    bad_total=$((bad_total + bad))
  else
    echo "  结论: 通过"
  fi
done < <(find "$ROOT" -mindepth 2 -maxdepth 2 -name module.md | sort)

if [[ "$bad_total" -gt 0 ]]; then
  echo "总计失败项: $bad_total"
  exit 1
fi

echo "全部通过"
