---
name: element-style-inspector
description: '查看指定元素的 computed style，支持跨页面元素样式比对。Use when: 需要检查某个元素的样式、调试 CSS 差异、比对两个页面同一元素的样式差异、排查样式覆盖问题。触发词：查看样式、元素样式、style inspector、样式比对、样式对比、compare styles、inspect style。'
argument-hint: '[元素描述] [--compare <对比页面URL> <对比元素描述>]'
---

# Element Style Inspector

在浏览器中查看指定元素的计算样式（computed style），并可选地与另一个页面的元素进行样式比对，输出差异报告。

## 何时使用

- 调试某个元素的颜色、字体、间距、布局等样式问题
- 需要精确了解元素当前生效的所有计算样式
- 比对两个页面（如 dev vs prod、A/B 版本）中同一组件的样式差异
- 排查样式覆盖、CSS 优先级问题

## 前置条件

- 内置浏览器中已打开目标页面（通过 `open_browser_page` 或已有页面）
- 如需跨页面比对，需提供对比页面的 URL

## 流程

### 步骤 1：定位目标元素

1. 对目标页面调用 `mcp_io_github_chr_take_snapshot`（或 `read_page`）获取页面快照
2. 根据用户描述的元素（如"表头单元格"、"提交按钮"、"[data-slot='top']"）在快照中匹配对应的 `uid`
3. 如果无法确定唯一元素，列出候选让用户选择

### 步骤 2：提取计算样式

对目标 `uid` 元素执行 `mcp_io_github_chr_evaluate`，运行 [extract-styles 脚本](./scripts/extract-styles.js)：

```javascript
(uid) => {
  // extract-styles.js 内容内联执行（见 scripts/extract-styles.js）
  const el = document.querySelector(`[data-ref="${uid}"]`) 
    || document.querySelector(uid)
    || (typeof uid === 'string' && uid.match(/^\d+$/) ? document.querySelectorAll('*')[parseInt(uid)] : null);
  if (!el) return { error: 'Element not found', uid };
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const box = el.closest('[class]')?.className || '';
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || undefined,
    className: el.className || undefined,
    rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
    styles: { /* 由脚本定义的关键样式属性列表 */ },
  };
}
```

> 实际执行时引用 `./scripts/extract-styles.js` 中的完整函数体，不要手动截断。

### 步骤 3：格式化输出

将提取结果整理为可读表格：

| 属性 | 值 |
|------|-----|
| 元素 | `<div class="xxx">` |
| 位置 | x: 100, y: 200, 300×40 |
| color | `rgb(0, 0, 0)` |
| font-size | `14px` |
| ... | ... |

**输出规则：**
- 只输出非默认值的样式（过滤掉 `visibility: visible`、`overflow: visible` 等浏览器默认值）
- 相关属性分组展示：排版（font/text）、盒模型（margin/padding/border）、布局（display/position/flex）、视觉（color/background/shadow）
- 如用户关注特定属性（如"只看颜色和字体"），过滤后只展示相关组

### 步骤 4：跨页面比对（可选）

当用户指定 `--compare` 或要求比对时，执行 [compare-styles 参考流程](./references/compare-workflow.md)：

1. 先对当前页面元素完成步骤 2，记为 **样式 A**
2. 打开对比页面（`open_browser_page` 或 `navigate_page`）
3. 对比页面重复步骤 1-2 完成定位和提取，记为 **样式 B**
4. 逐属性对比，生成差异报告

**差异报告格式：**

```
### 样式差异报告

| 属性 | 页面 A | 页面 B | 差异 |
|------|--------|--------|------|
| font-size | 14px | 16px | ⚠️ +2px |
| color | #333 | #333 | ✅ 一致 |
| padding | 8px 12px | 4px 8px | ⚠️ 不同 |
| background | transparent | #fff | ⚠️ 不同 |

差异属性数：3 / 总属性数：42
```

## 输出规范

- 差异属性排在前面，一致属性可折叠或省略（超过 10 个一致项时只显示差异）
- 用 ⚠️ 标记有差异的属性，✅ 标记一致的属性
- 如果元素不存在或无法定位，明确告知用户并建议替代选择器
- 颜色值统一使用 `rgb/rgba` 格式（避免 hex/keyword 混用导致误报差异）
