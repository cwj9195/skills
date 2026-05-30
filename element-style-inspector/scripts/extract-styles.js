/**
 * 从 DOM 元素中提取 computed style 并格式化为结构化数据。
 * 通过 evaluate 在浏览器页面内执行。
 *
 * @param {string|number} uid - 元素标识（a11y snapshot 的 uid、CSS 选择器或元素序号）
 * @returns {{ tag, id, className, rect, styles, error? }} 结构化样式数据
 */
function extractStyles(uid) {
  // 通过 data-ref 属性、CSS 选择器或索引查找元素
  const el =
    document.querySelector(`[data-ref="${uid}"]`) ||
    document.querySelector(uid) ||
    (typeof uid === 'string' && /^\d+$/.test(uid)
      ? document.querySelectorAll('*')[parseInt(uid)]
      : null);

  if (!el) return { error: 'Element not found', uid };

  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();

  /** 需要提取的样式属性，按分组组织 */
  const groups = {
    layout: [
      'display', 'position', 'top', 'right', 'bottom', 'left',
      'float', 'clear', 'z-index',
      'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-self',
      'grid-template-columns', 'grid-template-rows', 'gap',
      'overflow', 'overflow-x', 'overflow-y',
    ],
    box: [
      'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
      'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'border', 'border-width', 'border-style', 'border-color', 'border-radius',
      'box-sizing', 'box-shadow',
    ],
    typography: [
      'font', 'font-family', 'font-size', 'font-weight', 'font-style',
      'line-height', 'letter-spacing', 'word-spacing',
      'text-align', 'text-decoration', 'text-transform', 'text-overflow',
      'text-indent', 'text-shadow', 'white-space', 'word-break', 'word-wrap',
      'color',
    ],
    visual: [
      'background', 'background-color', 'background-image',
      'opacity', 'visibility',
      'outline', 'outline-offset',
      'transform', 'transform-origin',
      'transition', 'animation',
      'cursor', 'pointer-events', 'user-select',
    ],
  };

  /** 浏览器默认值，用于过滤无信息量的属性 */
  const defaults = {
    display: 'inline', position: 'static', top: 'auto', right: 'auto', bottom: 'auto', left: 'auto',
    float: 'none', clear: 'none', 'z-index': 'auto',
    'flex-direction': 'row', 'flex-wrap': 'nowrap', 'justify-content': 'flex-start',
    'align-items': 'stretch', 'align-self': 'auto',
    overflow: 'visible', 'overflow-x': 'visible', 'overflow-y': 'visible',
    'min-width': 'auto', 'min-height': 'auto', 'max-width': 'none', 'max-height': 'none',
    'box-sizing': 'content-box', 'box-shadow': 'none',
    'font-style': 'normal', 'text-align': 'start', 'text-decoration': 'none solid',
    'text-transform': 'none', 'text-overflow': 'clip', 'text-indent': '0px',
    'text-shadow': 'none', 'white-space': 'normal',
    'word-break': 'normal', 'word-wrap': 'normal', 'word-spacing': '0px',
    'letter-spacing': 'normal', 'line-height': 'normal',
    'background-image': 'none',
    opacity: '1', visibility: 'visible',
    outline: 'none', 'outline-offset': '0px',
    transform: 'none', 'transform-origin': '50% 50% 0px',
    transition: 'all 0s ease 0s', animation: 'none',
    cursor: 'auto', 'pointer-events': 'auto', 'user-select': 'auto',
    border: 'none', 'border-width': '0px', 'border-style': 'none',
    'border-radius': '0px', 'border-color': '',
    'background-color': 'rgba(0, 0, 0, 0)',
  };

  const styles = {};
  const allProps = Object.values(groups).flat();

  for (const prop of allProps) {
    const value = cs.getPropertyValue(prop);
    const def = defaults[prop];
    // 跳过默认值和空值
    if (value && value !== def && value !== 'none' && value !== '0px' && value !== 'normal') {
      styles[prop] = value;
    }
  }

  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || undefined,
    className: typeof el.className === 'string' ? el.className : undefined,
    rect: {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
    styles,
  };
}

// 函数通过 evaluate 调用时会自动执行
return extractStyles(uid);
