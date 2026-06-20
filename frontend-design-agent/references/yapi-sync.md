# YApi 同步操作手册（可选下游）

> 定位：本手册说明如何把 `api-contract.md` 经 OpenAPI 3.0 导入 YApi。**不在 skill 的 workflow 默认环节**，
> 仅当需要"以前端契约为源头录入 YApi（团队单一源）"时手动执行。skill 本身仍只产出 `api-contract.md`。
> 配合独立工具 [../scripts/contract-to-swagger.mjs](../scripts/contract-to-swagger.mjs) 使用。

## 0. 前提与定位

- YApi 是团队接口单一源；`api-contract.md` 是前端工作副本（拟定态 + 与 YApi 对齐结果）。
- 流向（双向闭环）：前端拟定 → 导出 OpenAPI 3.0 → 导入 YApi（draft）；后端实现/确认在 YApi；前端读 YApi 对齐。
- YApi 原生按 **OpenAPI 3.0 / components.schemas** 存储，故脚本输出 OAS3（`$ref` 用 `#/components/schemas/`），与 YApi 同构。
- MCP 鉴权：`yapi-mcp-goods` 在本机 `cc-switch.db` 里已配 `--yapi-base-url` 与 `--yapi-token`（敏感信息，不入 git 源；故「源」里看不到 token 是正常的）。MCP 读已验证可用，写用同一 token。

## 1. 生成 openapi.json

```bash
rtk node scripts/contract-to-swagger.mjs <api-contract.md> <out.openapi.json> \
  --title "xxx 接口契约" --host http://<yapi-host> --base-path /
```

脚本内置 `$ref` 自检；「$ref 自检通过」即可导入。剩余警告多为真实的「无 JSON 响应 DTO」（文件流/布尔/回调），不影响导入。

## 2. MCP 路径（主，无需额外 token）

`yapi-mcp-goods` 已具备读写能力，按接口循环 upsert：

1. 定位项目：`yapi_list_projects` 或已知 `projectId`（如 PIM 商品中心 274）。
2. 取分类：`yapi_get_categories(projectId)` → 按模块名匹配 `catid`。
3. 逐接口 upsert：
   - merge 判定：`yapi_search_apis(pathKeyword=<path>)` 查是否已存在 → 得 `apiId`。
   - 调 `yapi_save_api`：必填 `projectId` / `catid` / `title` / `path` / `method`；存在则传 `id`(apiId) 走更新，否则新增。
   - 请求体：`req_body_type=json`，`req_body_other` 取 openapi.json 中该接口 `requestBody.content.application/json.schema`。
   - 响应体：`res_body_type=json`，`res_body` 取 `responses[200].content.application/json.schema`。
4. 读回校验：`yapi_get_api_desc(projectId, apiId)` 确认 path/method/字段。

> `$ref` 用 `#/components/schemas/Xxx`，与 YApi 原生格式一致。若 `yapi_save_api` 对孤立 schema 的 `$ref` 解析不全（找不到被引用 schema），就把 res_body/req_body_other 的 `$ref` 就地展开为 inline。建议先拿一个接口试，能解析就不展开。

## 3. CLI 路径（后补，需 project token）

YApi open import（端点与 token 确认后启用）：

```bash
curl -X POST "<YAPI_BASE>/api/open/import_data?token=<PROJECT_TOKEN>" \
  -H "Content-Type:application/json" \
  -d "{\"type\":\"swagger\",\"json\":$(cat out.openapi.json),\"merge\":\"normal\",\"catid\":<catid>}"
```

- `merge=normal`：全新初始化；`merge=merge`：已有接口增量对齐（按 path+method 匹配）。
- token 在 YApi「项目设置 → token」生成。

## 4. 初始化 vs merge

- 全新项目/模块：`merge=normal`，catid 用新建分类。
- 已有接口对齐：`merge=merge`，按 path+method 匹配更新，保留人工备注。

## 5. 同步后

若与 YApi 已有接口出现差异，回写 `api-contract.md` 的「前后端差异表」，不得直接覆盖前端拟定契约。
