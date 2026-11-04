# 性能检查与客户端体积对比

本页记录 2026-11-04 的历史构建对比。基线提交为 `1ed9f92`，优化提交为 `960a7c9`。两次使用 Next.js 15.5.21、Node v24.22.1 和既有依赖构建。下文的路由体积、页面数量和回归结果属于这两个提交的记录，当前构建可按文中命令重新测量。

## 变更

- 全站 Header 从服务器接收 12 个产品段的 `slug/href/index/label`，不再在浏览器导入完整 taxonomy、分类及重复的 familyLinks。
- `/products` 在服务器一次计算当前 q 的排序结果、索引数量和参考编号判断；客户端仅保留输入、分页展开、焦点与事件追踪。完整搜索索引、产品与资源文章留在服务器。无查询时结果为空；有查询时传入该查询的全部匹配，保留原来的 6 个主要结果、18 条初始展开和每次增加 12 条。
- RFQ 与 equivalent URL 构造函数原样移到不依赖数据的 `src/lib/productRequestHref.ts`，旧 taxonomy 导出继续兼容，防止客户端为构造链接而带入完整分类数据。
- 删除 RequestTypeSelector 和两个 sourcing-intake hooks 的重复 `use client`，由 SourcingIntakeForm 的边界覆盖。显式边界从 12 处减到 9 处；这些交互依赖仍在客户端，减少标记本身不作为体积收益。
- 新增 `scripts/client-boundary-regression.mjs`，检查去除类型后的真实本地运行时依赖，阻止任意客户端入口重新导入完整目录和内容数据。该优化提交的检查覆盖 9 个入口、25 个运行时模块。

## next build 原始输出

`/products` First Load JS：**157 kB → 130 kB，减少 27 kB（约 17.2%）**；路由自身 Size：23.8 kB → 6.82 kB。共享运行时保持 102 kB。下表保留 Next.js 的显示精度与单位；两次生成静态页面均为 1027/1027，路由列表和类型保持一致。

| 路由 | Size 前 | Size 后 | First Load JS 前 | First Load JS 后 |
| --- | ---: | ---: | ---: | ---: |
| `/` | 186 B | 186 B | 124 kB | 124 kB |
| `/_not-found` | 997 B | 997 B | 103 kB | 103 kB |
| `/about` | 181 B | 181 B | 105 kB | 105 kB |
| `/api/analytics` | 156 B | 156 B | 102 kB | 102 kB |
| `/api/request-quote` | 156 B | 156 B | 102 kB | 102 kB |
| `/api/rfq` | 156 B | 156 B | 102 kB | 102 kB |
| `/api/rfq/internal` | 156 B | 156 B | 102 kB | 102 kB |
| `/api/turnstile/config` | 156 B | 156 B | 102 kB | 102 kB |
| `/apple-icon.png` | 0 B | 0 B | 0 B | 0 B |
| `/applications` | 181 B | 181 B | 105 kB | 105 kB |
| `/contact` | 165 B | 165 B | 115 kB | 115 kB |
| `/equivalent-finder` | 184 B | 184 B | 118 kB | 118 kB |
| `/equivalents` | 156 B | 156 B | 102 kB | 102 kB |
| `/icon.png` | 0 B | 0 B | 0 B | 0 B |
| `/manifest.webmanifest` | 156 B | 156 B | 102 kB | 102 kB |
| `/privacy` | 181 B | 181 B | 105 kB | 105 kB |
| `/private-label` | 181 B | 181 B | 105 kB | 105 kB |
| `/private-label-oem` | 184 B | 184 B | 118 kB | 118 kB |
| `/products` | 23.8 kB | 6.82 kB | 157 kB | 130 kB |
| `/products/[segment]` | 194 B | 194 B | 113 kB | 113 kB |
| `/products/[segment]/[subcategory]` | 194 B | 194 B | 113 kB | 113 kB |
| `/products/[segment]/[subcategory]/[family]` | 195 B | 195 B | 113 kB | 113 kB |
| `/products/[segment]/[subcategory]/[family]/[product]` | 195 B | 195 B | 113 kB | 113 kB |
| `/quality` | 181 B | 181 B | 105 kB | 105 kB |
| `/ready-supply` | 184 B | 184 B | 118 kB | 118 kB |
| `/request-quote` | 165 B | 165 B | 115 kB | 115 kB |
| `/resources` | 181 B | 181 B | 105 kB | 105 kB |
| `/resources/[slug]` | 181 B | 181 B | 105 kB | 105 kB |
| `/robots.txt` | 156 B | 156 B | 102 kB | 102 kB |
| `/samples` | 177 B | 177 B | 118 kB | 118 kB |
| `/services` | 181 B | 181 B | 105 kB | 105 kB |
| `/sitemap.xml` | 156 B | 156 B | 102 kB | 102 kB |
| `/supplier-qualification` | 181 B | 181 B | 105 kB | 105 kB |
| `/suppliers` | 181 B | 181 B | 105 kB | 105 kB |
| `/support` | 181 B | 181 B | 105 kB | 105 kB |
| `/terms` | 156 B | 156 B | 102 kB | 102 kB |
| `/trust-center` | 178 B | 178 B | 111 kB | 111 kB |
| `/workflows` | 181 B | 181 B | 105 kB | 105 kB |

## 补充：包含 layout 的脚本统计

Next.js 15.5.21 的构建表没有自动把 App Router 的 `/layout` 独有脚本并入每条路由的 First Load JS（本地实现见 `node_modules/next/dist/build/utils.js` 的 `getJsPageSizeInKb`）。所以首页等显示值不变，不能据此判断导航优化没有收益。

补充统计按 `.next/app-build-manifest.json` 中 `pages['/layout']` 与对应 page 条目的并集去重，只取 `.js` 文件，每个文件使用 Node `gzipSync` 默认参数单独压缩后求和。单位为十进制 kB（1000 字节），未含 HTML、RSC、CSS、图片、导航预取及后续动态加载；这是构建文件统计，不是浏览器实测下载量，不与上表口径混用。

| Manifest 条目（含 layout） | gzip 前 kB | gzip 后 kB | 差值 kB |
| --- | ---: | ---: | ---: |
| `/layout` | 120.73 | 111.06 | -9.66 |
| `/page` | 139.05 | 129.38 | -9.66 |
| `/products/page` | 162.70 | 136.04 | -26.66 |
| `/products/[segment]/page` | 124.82 | 115.15 | -9.66 |
| `/products/[segment]/[subcategory]/page` | 124.82 | 115.15 | -9.66 |
| `/products/[segment]/[subcategory]/[family]/page` | 124.82 | 115.16 | -9.66 |
| `/products/[segment]/[subcategory]/[family]/[product]/page` | 124.82 | 115.16 | -9.66 |
| `/request-quote/page` | 133.86 | 124.20 | -9.66 |
| `/trust-center/page` | 126.07 | 116.41 | -9.66 |

可在构建后重算当前值：

```sh
node --input-type=module <<'JS'
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
const { pages } = JSON.parse(readFileSync('.next/app-build-manifest.json'));
for (const route of ['/layout', '/page', '/products/page', '/request-quote/page']) {
  const files = [...new Set([...pages['/layout'], ...pages[route]])].filter(f => f.endsWith('.js'));
  const bytes = files.reduce((sum, f) => sum + gzipSync(readFileSync('.next/' + f)).length, 0);
  console.log(route, bytes, 'gzip bytes');
}
JS
```

## 图片

现有 5 处图片均已使用 `next/image`、本地 WebP 和 `fill`；保留容器尺寸避免布局跳动。首页通栏 Hero 保持 `100vw` 与 `priority`。其余图片维持默认懒加载，按实际网格、页面留白与 1280px 容器上限调整 `sizes`：

| 位置 | 原宽屏 sizes | 新宽屏上限 |
| --- | --- | ---: |
| ProductCategoryCard | 30vw | 390px |
| PrioritySourcingLinesSection | 30vw | 392px |
| WhatBioAxisDoesSection | 38vw | 472px |
| trust-center | 38vw | 480px |

中小屏分别匹配实际列数和 40/64/80px 页面横向留白。图片更改影响候选资源选择，不计入 JS 缩减数字；没有声称已实测图片传输量或 LCP 改善。

## 对比提交的验证记录

- `npm run lint`、`node node_modules/typescript/bin/tsc --noEmit --incremental false`、`npm run build`：通过。
- `npm test` 的 12 项离线回归：request-types、taxonomy-builders、taxonomy-search、product-search、product-profile、family-page、category-page、structured-data、rfq-queue、trust-evidence、public-trust-intake、release-readiness：全部通过。
- 额外运行 `node scripts/accessibility-static-regression.mjs`、`node scripts/rfq-roundtrip-phase-regression.mjs`、`node scripts/client-boundary-regression.mjs`：通过。
- 搜索回归包含 20 个排序查询、429 个索引路径、944 个 RFQ 预填链接、分页和 query 重置；增加真实服务器页面的空 q、空白、数组和未知参考编号输入检查。URL helper 保持原函数实现，现有路由、面包屑和 RFQ query/context 回归通过。
- 跳过需要浏览器或运行中 URL 的 accessibility、scientific-units、rfq-payload-limit、rfq-edge-limit regression，以及 route-smoke、Lighthouse 和真实 RFQ roundtrip；本次仅做离线验证，没有启动浏览器、请求线上、提交真实 RFQ 或测量现场性能。

后续可用已有 `scripts/lighthouse-baseline.mjs` 在相同设备、浏览器和生产构建条件下验证 LCP/CLS；当前结果仅证明构建体积与离线行为。极宽泛查询仍传递其全部匹配结果以保留现有展开行为，未引入新的分页 API。

当前验证入口和全部回归脚本的运行条件见[回归检查清单](regression-checks.md)。
