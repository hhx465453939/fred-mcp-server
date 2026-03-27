# FRED API 覆盖面 Debug 迭代记录

## 结论（基于代码证据）

- **当前实现支持 FRED API v1 + GeoFRED（Maps API）+ FRED API v2**。
- **官方文档中列出的 v1 大类端点已全覆盖**：Categories / Releases / Series / Sources / Tags。
- **GeoFRED（Maps API）文档端点已覆盖**：`shapes`、`series/group`、`regional/data`。
- **FRED API v2 文档端点已覆盖**：`fred/v2/release/observations`。

### 证据索引（关键文件）

- **v1 base URL 与请求封装**：`src/common/request.ts`
- **MCP tools 注册（对外能力）**：`src/fred/tools.ts`
- **Categories/Releases/Sources 浏览**：`src/fred/browse.ts`
- **Series 搜索与元信息**：`src/fred/search.ts`
- **Series observations 拉取**：`src/fred/series.ts`

## 当前对外工具（Node 调用入口）

本项目对外暴露 3 个 MCP tools：

- `fred_browse`：categories/releases/sources 浏览 + category_series/release_series
- `fred_search`：series/search（含 tag_names/exclude_tag_names 作为 search 过滤参数）
- `fred_get_series`：series/observations（含数据变换、频率聚合等参数透传）

## 覆盖矩阵（对照官方 v1 文档大类）

> 说明：以下 endpoint 均为相对路径，实际请求为 `https://api.stlouisfed.org/fred/{endpoint}`。

| 官方大类 | 官方端点（代表项） | 当前实现 | 备注 |
|---|---|---:|---|
| Categories | `category` | ✅ | 根/详情浏览（本项目：无 `category_id` 时请求 `category`） |
| Categories | `category/children` | ✅ | 传 `category_id` 时请求 children |
| Categories | `category/series` | ✅ | category_series 能力 |
| Categories | `category/related` | ✅ | 全量端点工具已实现 |
| Categories | `category/tags` | ✅ | 全量端点工具已实现 |
| Categories | `category/related_tags` | ✅ | 全量端点工具已实现 |
| Releases | `releases` | ✅ | releases 列表 |
| Releases | `release/series` | ✅ | release_series 能力 |
| Releases | `release` | ✅ | 全量端点工具已实现 |
| Releases | `releases/dates` | ✅ | 全量端点工具已实现 |
| Releases | `release/dates` | ✅ | 全量端点工具已实现 |
| Releases | `release/sources` | ✅ | 全量端点工具已实现 |
| Releases | `release/tags` | ✅ | 全量端点工具已实现 |
| Releases | `release/related_tags` | ✅ | 全量端点工具已实现 |
| Releases | `release/tables` | ✅ | 全量端点工具已实现 |
| Series | `series/search` | ✅ | fred_search |
| Series | `series` | ✅ | getSeriesInfo（用于补充元信息） |
| Series | `series/observations` | ✅ | fred_get_series（核心数据） |
| Series | `series/categories` | ✅ | 全量端点工具已实现 |
| Series | `series/release` | ✅ | 全量端点工具已实现 |
| Series | `series/tags` | ✅ | 全量端点工具已实现 |
| Series | `series/updates` | ✅ | 全量端点工具已实现 |
| Series | `series/vintagedates` | ✅ | 全量端点工具已实现 |
| Sources | `sources` | ✅ | sources 列表 |
| Sources | `source` | ✅ | 全量端点工具已实现 |
| Sources | `source/releases` | ✅ | 全量端点工具已实现 |
| Tags | `tags` | ✅ | 全量端点工具已实现 |
| Tags | `related_tags` | ✅ | 全量端点工具已实现 |
| Tags | `tags/series` | ✅ | 全量端点工具已实现 |
| Maps API | maps 相关端点 | ✅ | 通过 GeoFRED tools 覆盖（见下方） |

## FRED API v2 覆盖

| 官方 v2 端点 | 当前实现 |
|---|---:|
| `fred/v2/release/observations` | ✅ |

## Debug 迭代计划（补齐覆盖面）

## 运行问题记录（MCP 挂载故障）

### 症状

- Cursor MCP 启动 stdio 进程后报错：`ERR_MODULE_NOT_FOUND`，提示无法从 `build/index.js` 导入 `build/fred/tools.js`。

### 定位

- 这类错误通常来自 **build 产物不完整/未更新** 或 MCP 客户端仍在使用旧进程/旧产物。
- 本仓库 `tsconfig.json` 的 `include` 覆盖 `src/**/*`，正常 `pnpm build` 后应生成 `build/fred/tools.js` 等文件。

### 复现验证

- 在仓库根目录执行：
  - `pnpm install`
  - `pnpm build`
  - `node -e "import('./build/index.js')"`
- 若 `import ok`，说明 Node 侧模块解析正常，剩余问题多半是 **客户端需要重启/重新加载 server**。
- 进一步验证 stdio server 是否真的启动（应当常驻等待输入）：
  - `node build/index.js`
  - 预期输出包含：`FRED MCP Server starting...` 与 `FRED MCP Server running on stdio`
  - 若进程立刻退出，优先检查 “是否直接执行判断（Windows 兼容）”。

## 覆盖补齐完成记录（v1 + GeoFRED + v2）

### 已实现（代码层）

- **FRED API v1**：Categories / Releases / Series / Sources / Tags **全量端点工具**已实现（见 `src/fred/*.api.ts` 与 `src/fred/tools.ts` 新增 tool 注册）
- **GeoFRED（Maps API）**：`shapes` / `series/group` / `regional/data` 已实现（见 `src/fred/maps.api.ts`）
- **FRED API v2**：`fred/v2/release/observations` 已实现（见 `src/fred/v2.api.ts`）

### 验证（Checkfix）

- `pnpm build` ✅
- `pnpm lint` ✅
- Jest（Windows 直跑）✅：`node --experimental-vm-modules --no-warnings ./node_modules/jest/bin/jest.js`

### 迭代 1（优先级 P0：让覆盖更“可用”）

- [x] 新增 `fred_tags` 工具：封装 `tags` / `related_tags` / `tags/series`
- [x] 新增 `fred_release_observations_v2` 工具：封装 `fred/v2/release/observations`
- [x] 新增 `fred_release_dates` 工具：封装 `releases/dates` 与 `release/dates`
- [x] 新增 `fred_series_meta` 工具：封装 `series/categories`、`series/release`、`series/tags`

**验收（Checkfix）**

- `pnpm lint` 通过（TypeScript 编译无误）
- `pnpm test` 通过
- 新工具具备最小 happy-path 集成测试（至少 1 个真实 series/release_id 的 mock/或可配置实测）

### 迭代 2（P1：补齐 browsing/metadata）

- [x] `source`、`source/releases` 支持
- [x] `category/related`、`category/tags`、`category/related_tags` 支持
- [x] `release/sources`、`release/tags`、`release/related_tags`、`release/tables` 支持

### 迭代 3（P2：高级能力）

- [x] `series/updates`、`series/vintagedates`
- [x] Maps API（如需要）

