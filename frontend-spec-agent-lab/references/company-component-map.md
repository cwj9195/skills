# 企业组件映射规则（Lab）

| 业务语义 | 优先组件/模式 | 证据策略 | 未确认处理 |
| -------- | ------------- | -------- | ---------- |
| 筛选表单 | `createPage` 搜索区 / `FormItem` / `SelectSearch` | 查相邻列表页 | 标 `(待确认)` |
| 字典展示 | `Dict` / `useDict` / `DictPro` | 查列表列配置与字典调用 | 标字典 key 待确认 |
| 权限控制 | `hasAuth` / `Permission` | 查权限码和按钮 disabled | 标权限码待确认 |
| 列表表格 | `createPage` / `vxe-table` | 查相邻列表页 | 标表格模式待确认 |
| 抽屉详情 | `draw` / 详情页模式 / `useDrawer` | 查 detail、drawDetail | 标容器模式待确认 |
| 上传/素材 | `tc-upload` / 素材库模式 | 查 PIM 组件和素材库页面 | 标限制规则待确认 |
| 图片裁剪 | `tc-cropper` | 查 PIM 组件 | 标裁剪规格待确认 |
| 类目选择 | `material-category-selector` / 类目树模式 | 查组件和 store 类目树 | 标层级规则待确认 |
| 批量填充 | `batchFillSku.tsx` 模式 | 查预选品批量填充 | 标字段范围待确认 |

规则：

- 组件选择以当前项目 Evidence 为准。
- 组件映射与旧设计书冲突时，写入 TODO，不直接覆盖。
- 无证据时不强行命名新组件。

