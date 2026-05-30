# 跨页面样式比对流程

当 SKILL.md 流程中需要执行 `--compare` 比对时，按以下步骤操作。

## 前提

- 已完成当前页面的样式提取（样式 A）
- 用户提供了对比页面的 URL 和元素描述

## 步骤

### 1. 打开对比页面

- 若对比页面已在浏览器中打开，通过 `mcp_io_github_chr_select_page` 切换
- 否则通过 `open_browser_page` 打开新页面
- 等待页面加载完成（`navigate_page` type=url）

### 2. 定位对比元素

与主流程步骤 1 相同：
1. 对对比页面调用 `mcp_io_github_chr_take_snapshot`
2. 根据用户描述匹配 `uid`
3. 如无法确定，列出候选让用户选择

### 3. 提取对比元素样式

与主流程步骤 2 相同，对 `uid` 执行 `mcp_io_github_chr_evaluate` 运行 [extract-styles 脚本](../scripts/extract-styles.js)，记为 **样式 B**。

### 4. 生成差异报告

**对比规则：**

1. 逐属性比较两组 `styles` 对象
2. 将属性分为三类：
   - **仅存在于 A**：页面 A 有、页面 B 无（B 使用浏览器默认值）
   - **仅存在于 B**：页面 B 有、页面 A 无（A 使用浏览器默认值）
   - **两者都有但值不同**：样式冲突
   - **两者都有且值相同**：一致（可折叠）
3. 颜色值统一转为 `rgba()` 格式后比较（避免 `#fff` vs `white` vs `rgb(255,255,255)` 的误报差异）
4. 短缩写属性（如 `margin: 8px 12px`）展开后比较，避免因浏览器解析差异导致误报

**输出模板：**

```
## 样式差异报告

**元素 A**：`<tag class="...">` @ 页面 A（URL）
**元素 B**：`<tag class="...">` @ 页面 B（URL）

### ⚠️ 有差异的属性（N 个）

| 属性 | 元素 A | 元素 B | 备注 |
|------|--------|--------|------|
| font-size | 14px | 16px | +2px |
| padding-top | 8px | 4px | -4px |
| background-color | rgba(255,255,255,0) | rgba(0,0,0,0.05) | A 透明，B 有底色 |

### ✅ 一致的属性（M 个）
> color, display, position, font-weight, border, ...（M 个属性值完全一致）

### 📌 仅存在于元素 A（K 个）
> outline: 2px solid blue, cursor: pointer, ...

### 📌 仅存在于元素 B（L 个）
> box-shadow: 0 2px 8px rgba(0,0,0,0.12), ...

---

**总结**：差异属性 N 个 / 总属性 (A: X, B: Y) 个，关键差异集中在 [排版/盒模型/视觉] 组。
```

## 注意事项

- 如果对比元素在页面结构上差异很大（如嵌套层级不同），应在报告开头说明 DOM 结构差异
- 如用户未指定对比元素描述，默认使用与页面 A 相同的元素描述去匹配
- 两次页面快照之间不要切换浏览器焦点，避免状态不一致
