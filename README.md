[English](https://github.com/linbin-mk/dsh-brand-deepseek/blob/main/README.en.md) | 简体中文

# dsh-brand-deepseek

[![npm 版本](https://img.shields.io/npm/v/@linbin-mk/dsh-brand-deepseek)](https://www.npmjs.com/package/@linbin-mk/dsh-brand-deepseek)
[![发布流水线](https://github.com/linbin-mk/dsh-brand-deepseek/actions/workflows/publish.yml/badge.svg)](https://github.com/linbin-mk/dsh-brand-deepseek/actions/workflows/publish.yml)
[![许可证](https://img.shields.io/npm/l/@linbin-mk/dsh-brand-deepseek)](LICENSE)
[![Node](https://img.shields.io/node/v/@linbin-mk/dsh-brand-deepseek)](package.json)
[![平台](https://img.shields.io/badge/platform-Web%20%E5%AE%A2%E6%88%B7%E7%AB%AF-lightgrey)](#要求)

`dsh-brand-deepseek` 是一个**纯第三方、自包含**的 DeepSeek Harness 客户端插件。它把 Web 客户端侧边栏的品牌替换成 DeepSeek 官方样式——鲸鱼标志加 `deepseek` 字标；开启后还会把空白会话页聊天框上方的标题行替换成官方标题（鲸鱼标志 + 想从哪里开始?）。它全部通过 Harness 已公开的插槽系统覆盖外壳的 `DSH 本地构建` 回退品牌，**不需要改动 Harness 源码**。

插件占用两个单占位插槽：`sidebar.brand.mark`（鲸鱼标志）与 `sidebar.brand.name`（`deepseek` 字标）；标题行的替换走 `conversation.hero.brand.mark` 插槽加一段作用域受控的样式表。

## 功能

- **侧边栏品牌** —— 官方 DeepSeek 鲸鱼标志与字标，默认填充官方 DeepSeek 蓝。
- **会话页标题行** —— 开启后，空白会话聊天框上方的标题行改为 DeepSeek 品牌标题（鲸鱼标志 + 想从哪里开始?），官方默认标题（探索未至之境 + 预览版徽章）被隐藏、整行居中；关闭后回到官方默认标题。
- **品牌样式设置页**（左下角**设置 → 品牌样式**）：
  - **自定义样式**开关 —— 关闭即恢复官方默认品牌（`DSH 本地构建` / `DSH Local Build` + 构建版本徽章）：品牌插槽整体注销，由外壳回退渲染；
  - **会话页标题**开关 —— 独立切换标题行（默认开启）；
  - **轨迹页签**与 **Session 日志按钮**开关 —— 独立显示/隐藏会话页头部这两处外壳元素（默认都开启），纯 DOM 层操作，不影响背后的轨迹数据与导出功能；
  - **十种品牌颜色**可选（当前配色 = 官方 DeepSeek 蓝，为默认项），选择后立即生效并通过 Host 设置 RPC 持久化，刷新后仍在。
- **实时预览** —— 设置页的预览区跟随两个状态渲染：自定义样式关闭时展示当前外壳回退品牌（鱼形标志、本地化标签与构建版本徽章）。

## 要求

- Node.js `^22.19` 或 `>=24`
- DeepSeek Harness `0.1.5-rc.1` 或兼容的 `0.1.5` 预发布版本，以及提供 `ctx.slots`、`ctx.remote.settings` 与 `ctx.locale` 的 **Web profile**
- Web profile 中需带有插件声明的客户端模块（`@deepseek-ai/dsh-client-ui-primitives`、`-ui-sidebar`、`-ui-settings`、`-ui-renderer`、`-locale`、`dsh-api-remotes`）；默认 Web profile 已包含
- 产物不含任何指向 Harness checkout 的路径依赖

## 安装

把已发布的包安装进自定义 Web profile。包内声明了 `dsh.bundle`，因此 `dsh plugin add` 会自动补上 `brand-deepseek` 这一行：

```sh
dsh --profile web-brand --from-default-profile web --dump-config
dsh plugin --profile web-brand add @linbin-mk/dsh-brand-deepseek
dsh --profile web-brand
```

改为安装本地构建的 tarball：

```sh
pnpm install
pnpm build
pnpm test
npm pack
dsh plugin --profile web-brand add ./linbin-mk-dsh-brand-deepseek-0.1.4.tgz
```

从同一个 profile 移除插件：

```sh
dsh plugin --profile web-brand remove @linbin-mk/dsh-brand-deepseek
```

## 设置

Host 半侧注册 `dsh-brand-deepseek` 设置命名空间，字段默认值如下，通过 Harness 带修订保护的设置传输写入，因此修改立即生效、无需重启 Harness。命名空间名与包名**故意不同**：包名是加载标识（`@linbin-mk/dsh-brand-deepseek`），命名空间只用于持久化，改包名不会让已有设置失效。

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| `enabled` | `true` | 自定义品牌样式总开关。关闭后品牌插槽被注销，侧边栏回到外壳的官方默认品牌。 |
| `hero` | `true` | 空白会话页标题行是否使用 DeepSeek 品牌标题。 |
| `trajectoryTab` | `true` | 会话页头部的「轨迹」页签是否可见（轨迹数据不受影响）。 |
| `sessionLogButton` | `true` | 会话页头部的「Session 日志」按钮是否可见（导出功能不受影响）。 |
| `color` | `#4176e6` | 品牌颜色，十选一，官方蓝为默认。 |

## 工作原理

- **Host 半侧**（`lib/index.js`）只做一件事：注册 `dsh-brand-deepseek` 设置命名空间，让客户端半侧的 `settings.describe` / `settings.mutate` 调用被接受并持久化。
- **客户端半侧**（`lib/client.js`）是一个由 tsdown 打包、以 `window.__ModuleLoader__.load({ id, factory })` 自注册的 CJS bundle。`id` 必须等于**包名**——Harness 用入口名索引客户端模块表，名字不一致时该行解析失败、整个 GUI 起不来（而 `--dump-config` 仍显示正常）。`tsdown.config.ts` 直接从 `package.json` 取 `name` 写进 banner，`scripts/smoke-client.mjs` 再断言一次两者相等，因此重命名不会静默漂移。
- **标题行样式**按 CSS Module 的 `<hash>_<local>` 形状匹配 Harness 的局部类名，并用会话外壳的 `[data-composer-seat]` 限定作用域、锚定在标题行自己的 `_fishHitbox` 后代上，因此不会波及其他模块（ContextMeter、ApprovalPanel）的同名 `.headline`。官方默认标题按它用过的**每个**局部名隐藏——`0.1.5-rc.1` 的 `_headlineText`，以及 `0.1.5-rc.2` 起包裹标题与徽章的 `_titleGroup`；没出现过该局部名的版本上，对应选择器只是空操作。若将来这些名字被再次改掉，插件退化为「品牌标题 + 官方标题并排显示」，而不是报错或让整个页面起不来。
- **两个外壳开关**（轨迹页签、Session 日志按钮）按类名后缀定位元素、用本地化文案兜底，并用 `MutationObserver` 在 React 重挂载后重新应用；若两者都改名，元素保持可见，而不是误隐藏。

## 构建与验证

```sh
pnpm install
pnpm build         # src/ -> lib/（lib/ 已提交，安装后无需构建）
pnpm build:check   # 重新构建并断言 lib/ 与提交内容一致
pnpm test          # 两个冒烟测试
```

`pnpm test` 依次跑：`scripts/smoke-client.mjs`（按浏览器加载器的真实方式加载 `lib/client.js`，断言 bundle id == 包名、导出与 `inject` 契约）和 `scripts/smoke-visibility.mjs`（在 jsdom 里挂载 `apply()`，验证两个持久化开关驱动 DOM，包括重挂载后的观察者补偿与文案兜底定位）。jsdom 只是本包的开发依赖，运行时不需要。

## 常见问题

- **侧边栏没有任何变化。** 先确认插件行还在（这一步只覆盖 Host 半侧；客户端半侧的失败只在浏览器控制台里暴露）：

  ```sh
  dsh --profile web-brand --dump-config | grep -A 2 brand-deepseek
  ```

  再打开浏览器控制台：客户端 bundle 的加载错误会直接打在这里。
- **页面显示 `Failed to load plugins`。** Harness 用**包名**索引客户端模块表，bundle 注册的 `id` 必须是同一个字符串。本仓库用构建期派生 + 冒烟测试断言把这个约束固定住了；如果你在 fork 里改了包名，请一并重建 `lib/`（`pnpm build`），不要手改 `lib/client.js`。
- **刚发版后 `dsh plugin add` 报 404。** 全新版本在 registry 读路径上需要几分钟才可见；`dist-tags` 与元数据通常先可用。稍后重试即可，不要重复发布。
- **通过镜像安装报 `ERR_PNPM_FETCH_404`。** npmmirror 等镜像同步新版本有自己的节奏。给这条命令加上 `--registry=https://registry.npmjs.org`，或等镜像同步。
- **pnpm 拒绝或询问刚发布的版本。** 这是 pnpm 的 `minimumReleaseAge` 延迟保护。放行该包（pnpm 会记录到 `minimumReleaseAgeExclude`）或等过这个时间窗口。
- **官方 profile 下品牌重复或冲突。** 内置的 `ui-brand-official` 只在 `DSH_CLIENT_BUILD_PROFILE === 'official'` 时占用同样的插槽。本地构建的 profile 不是 official，因此不会冲突；若你确实在跑 official profile，请二选一关闭。
- **标题行出现两个标题（品牌标题与官方标题并排）。** 说明当前 Harness 又改掉了标题行的 CSS Module 局部名，插件按设计退化而不是报错。提 issue 时附上 Harness 版本和那个 `<hash>_xxx` 局部名即可。
- **隐藏的页签或按钮又出现了。** 观察者会在重挂载后重新应用；只有类名后缀与本地化文案**同时**变化时插件才放弃隐藏（宁可保持可见，也不误隐藏别的元素）。

## 隐私与作用域

插件不发起任何网络请求、不读取会话内容、不上报遥测。它只做三件事：注册插槽占位、读写 `dsh-brand-deepseek` 设置命名空间、在会话页头部按设置隐藏两个 DOM 元素（轨迹页签、Session 日志按钮）。设置值保存在 Harness 的 profile 设置里，不离开本机。隐藏元素只影响渲染，轨迹数据与导出功能不受影响。

## 许可证

MIT —— 详见 `LICENSE`。

侧边栏的鲸鱼标志与 `DeepSeek` 字标复制自 DeepSeek 官网（deepseek.com）页头品牌 SVG，未作修改；DeepSeek 名称与标志是 DeepSeek（杭州深度求索人工智能基础技术研究有限公司）的商标，此处仅用于在插件里呈现官方产品的观感，MIT 许可证只覆盖本插件源码、不涉及这些标志。上游版权说明与商标声明见 `NOTICE`。
