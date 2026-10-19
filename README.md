[English](https://github.com/linbin-mk/dsh-brand-deepseek/blob/main/README.en.md) | 简体中文

# dsh-brand-deepseek

[![npm 版本](https://img.shields.io/npm/v/@linbin-mk/dsh-brand-deepseek)](https://www.npmjs.com/package/@linbin-mk/dsh-brand-deepseek)
[![发布流水线](https://github.com/linbin-mk/dsh-brand-deepseek/actions/workflows/publish.yml/badge.svg)](https://github.com/linbin-mk/dsh-brand-deepseek/actions/workflows/publish.yml)
[![许可证](https://img.shields.io/npm/l/@linbin-mk/dsh-brand-deepseek)](LICENSE)
[![Node](https://img.shields.io/node/v/@linbin-mk/dsh-brand-deepseek)](package.json)
[![平台](https://img.shields.io/badge/platform-Web%20%E5%AE%A2%E6%88%B7%E7%AB%AF-lightgrey)](#要求)

`dsh-brand-deepseek` 是一个**纯第三方、自包含**的 DeepSeek Harness 客户端插件：通过 Harness 已公开的插槽系统，把 Web 客户端的侧边栏品牌与会话页标题替换成 DeepSeek 官方样式，**不需要改动 Harness 源码**。

- **侧边栏品牌** —— 鲸鱼标志加 `deepseek` 字标，默认填充官方 DeepSeek 蓝，另有 9 种颜色可选。
- **会话页标题** —— 空白会话页聊天框上方的标题行改为「鲸鱼标志 + 想从哪里开始?」，官方默认标题（探索未至之境 + 预览版徽章）隐藏。
- **随时可退回** —— 左下角 **设置 → 品牌样式** 可单独开关两处品牌；关闭后恢复 Harness 官方默认品牌（`DSH 本地构建` + 构建版本徽章）。

## 效果预览

![启用 dsh-brand-deepseek 后的 DeepSeek Harness Web 客户端：侧边栏是鲸鱼标志与 deepseek 字标，空白会话页标题是鲸鱼标志与「想从哪里开始?」](https://raw.githubusercontent.com/linbin-mk/dsh-brand-deepseek/main/docs/images/overview.png)

未启用（或关闭「自定义样式」）时，侧边栏显示 Harness 自带的 `DSH 本地构建` 品牌与构建版本徽章：

| 默认外观 | 启用插件后 |
| --- | --- |
| ![默认的 DSH 本地构建侧边栏品牌与构建版本徽章](https://raw.githubusercontent.com/linbin-mk/dsh-brand-deepseek/main/docs/images/sidebar-before.png) | ![DeepSeek 鲸鱼标志与 deepseek 字标](https://raw.githubusercontent.com/linbin-mk/dsh-brand-deepseek/main/docs/images/sidebar-after.png) |

「设置 → 品牌样式」里可以分别开关自定义样式、会话页标题、轨迹页签与更多操作按钮，并从 10 种品牌颜色中选择：

![品牌样式设置页：四个开关、十种品牌颜色与实时预览](https://raw.githubusercontent.com/linbin-mk/dsh-brand-deepseek/main/docs/images/settings.png)

插件只占用 `sidebar.brand.mark`、`sidebar.brand.name` 与 `conversation.hero.brand.mark` 三个公开插槽，并以低于默认值的优先级注册，在官方构建里压过内置的 `ui-brand-official` 占位；具体机制见[工作原理](#工作原理)。

## 功能

- **侧边栏品牌** —— 官方 DeepSeek 鲸鱼标志与字标，默认填充官方 DeepSeek 蓝。
- **会话页标题行** —— 开启后，空白会话聊天框上方的标题行改为 DeepSeek 品牌标题（鲸鱼标志 + 想从哪里开始?），官方默认标题（探索未至之境 + 预览版徽章）被隐藏、整行居中；关闭后回到官方默认标题。
- **品牌样式设置页**（左下角**设置 → 品牌样式**）：
  - **自定义样式**开关 —— 关闭即恢复官方默认品牌（`DSH 本地构建` / `DSH Local Build` + 构建版本徽章）：品牌插槽整体注销，由外壳回退渲染；
  - **会话页标题**开关 —— 独立切换标题行（默认开启）；
  - **轨迹页签**与 **更多操作按钮**开关 —— 独立显示/隐藏会话页头部这两处外壳元素（默认都开启），纯 DOM 层操作，不影响背后的轨迹数据与导出功能（「下载 Session 日志」就在「更多操作」菜单里）；
  - **十种品牌颜色**可选（当前配色 = 官方 DeepSeek 蓝，为默认项），选择后立即生效并写回 Host 配置，刷新后仍在。
- **实时预览** —— 设置页的预览区跟随两个状态渲染：自定义样式关闭时展示当前外壳回退品牌（鱼形标志、本地化标签与构建版本徽章）。
- **插件清单里的展示信息** —— 包内自带 `icon.svg`（品牌鲸鱼标志）与 `locale/en.json`、`locale/zh.json` 两份 `meta.title`/`meta.description`。Harness 的插件管理器、bundle 详情与**设置 → 插件**清单在**不激活插件**的前提下读取它们，因此插件行显示的是带图标的中英文名称与能力说明，而不是包名回退文本和默认占位图。见[工作原理](#工作原理)。

## 要求

- Node.js `^22.19` 或 `>=24`
- DeepSeek Harness `0.2.1-rc.2` 或兼容的 `0.2.1` 预发布版本，以及提供 `ctx.slots`、`ctx.configForms` 与 `ctx.locale` 的 **Web profile**
- 包内声明 `engines.dsh = ^0.2.1-rc.2`：Harness 的插件兼容性预检在**不加载插件代码**的前提下读取它（声明了 `engines.dsh` 时以它为准，`peerDependencies` 不再参与判定），版本不符时会给出明确的不兼容提示，而不是等到运行期出错
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
dsh plugin --profile web-brand add ./linbin-mk-dsh-brand-deepseek-0.5.1.tgz
```

从同一个 profile 移除插件：

```sh
dsh plugin --profile web-brand remove @linbin-mk/dsh-brand-deepseek
```

## 设置

Host 半侧把品牌样式声明成本插件的 Cordis `Config`：五个字段全部 `.volatile()`，因此都是可在运行时改写的活配置，默认值如下。设置命名空间就是 `cordis.patch.yml` 里的 loader 行 id `brand-deepseek`——它与包名（加载标识 `@linbin-mk/dsh-brand-deepseek`）**故意不同**，改包名不会让已有设置失效。客户端半侧通过 `ctx.configForms.get('brand-deepseek')` 读写该行的配置表单，写入由 Harness 的设置域做修订号保护与串行化，因此修改立即生效、无需重启 Harness。从 DSH `0.2.1-rc.2` 起所有已认证浏览器都通过 Host 配置文档持久化（客户端上「进程内存储」的 memory 模式已从 `ConfigFormSnapshot` 删除），因此只有当 Host 文档明确不接受写入或当前页面读不到该命名空间时，写入控件才整体禁用、不会假装已保存。

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| `enabled` | `true` | 自定义品牌样式总开关。关闭后品牌插槽被注销，侧边栏回到外壳的官方默认品牌。 |
| `hero` | `true` | 空白会话页标题行是否使用 DeepSeek 品牌标题。 |
| `trajectoryTab` | `true` | 会话页头部的「轨迹」页签是否可见（轨迹数据不受影响）。 |
| `sessionLogButton` | `true` | 会话页头部的「更多操作」菜单按钮是否可见（「下载 Session 日志」在该菜单里；导出功能不受影响）。 |
| `color` | `#4176e6` | 品牌颜色，十选一，官方蓝为默认。 |

## 工作原理

- **Host 半侧**（`lib/index.js`）只做两件事：声明品牌样式的 Cordis `Config`（五个 `.volatile()` 字段，即设置命名空间 `brand-deepseek` 的全部内容），并为自己这一行声明 `{ auto: false }`——本插件自带设置页，不需要侧边栏「插件」列表再自动生成一个。
- **目标版本声明** —— `package.json` 的 `engines.dsh` 声明本插件面向的 DSH 范围（`^0.2.1-rc.2`，与 DSH peer 依赖同一行）；`scripts/smoke-client.mjs` 断言两者一致，避免「依赖升了、声明没升」的漂移。Harness 的插件兼容性预检读取该字段时不需要加载插件代码。
- **品牌插槽的优先级（压过而不是抢占）** —— 插槽注册表对同一个 `single` 单元只允许**每个优先级**一个占位，并渲染优先级**最低**的那个；在同一优先级重复注册会抛错。内置的 `@deepseek-ai/dsh-client-ui-brand-official` 以默认优先级 `0` 占用 `sidebar.brand.mark` 与 `sidebar.brand.name`，且它发布出去的 bundle 已经把 `DSH_CLIENT_BUILD_PROFILE` 构建开关**编译掉**了，所以**每个 official 构建都会真正注册这两个占位**。本插件若按默认优先级注册，就会在 official 构建里被注册表拒绝（`single slot "…" already has a registration at priority 0`）：品牌留在内置占位上，设置页每次读取都报这个错。因此三个品牌插槽统一用 `priority: -1` 注册：自定义样式开启时稳稳压过内置占位，关闭时注销自身、把同一个单元**交还**给内置占位（没有内置占位的本地构建则回退到外壳品牌）。
- **客户端半侧**（`lib/client.js`）是一个由 tsdown 打包、以 `window.__ModuleLoader__.load({ id, factory })` 自注册的 CJS bundle。`id` 必须等于**包名**——Harness 用入口名索引客户端模块表，名字不一致时该行解析失败、整个 GUI 起不来（而 `--dump-config` 仍显示正常）。`tsdown.config.ts` 直接从 `package.json` 取 `name` 写进 banner，`scripts/smoke-client.mjs` 再断言一次两者相等，因此重命名不会静默漂移。
- **插件清单的展示信息**由 `readPluginMeta`（`dsh-app-boot`）在不执行插件代码的前提下读取：`./locale/*.json`（先 `en.json`，再枚举同目录的语言文件）提供 `meta.title`/`meta.description`，`./icon` 提供图标。二者都走 Node 的 ESM 解析器，因此必须同时出现在 `exports`（解析器可见）与 `files`（打包带上）里；`scripts/smoke-metadata.mjs` 会按同样的规则解析并校验文本、语言 id 文件名、图标格式与 256 KiB 上限，并断言图标画的就是侧边栏那位占位渲染的同一条鲸鱼路径。
- **标题行样式**按 CSS Module 的 `<hash>_<local>` 形状匹配 Harness 的局部类名，并用会话外壳的 `[data-composer-seat]` 限定作用域、锚定在标题行自己的 `_fishHitbox` 后代上，因此不会波及其他模块（ContextMeter、ApprovalPanel）的同名 `.headline`。官方默认标题按它用过的**每个**局部名隐藏——`0.1.5-rc.1` 的 `_headlineText`，以及 `0.1.5-rc.2` 起包裹标题与徽章的 `_titleGroup`；没出现过该局部名的版本上，对应选择器只是空操作。`0.2.1-rc.2` 上已逐个核对：`[data-composer-seat]`、`_headline`、`_fishHitbox`、`_titleGroup`、`_previewBadge` 都还在（发布包里生成的类名形如 `pXSMma_titleGroup`），`_headlineText` 已不存在，只剩历史兼容的空操作选择器。`scripts/smoke-locators.mjs` 现在把这套核对自动化：每个在用定位点都必须在对应包的已发布 bundle 里出现，且插件源码里新出现的定位点必须先在表里登记。
- **两个外壳开关**（轨迹页签、头部「更多操作」菜单按钮）按类名后缀定位元素、用本地化文案（含 `aria-label`）兜底，并用 `MutationObserver` 在 React 重挂载后重新应用；若两者都改名，元素保持可见，而不是误隐藏。轨迹页签是 `[role="tablist"]` 里文案为「轨迹 / Trajectory」的按钮（未变）；「更多操作」按钮用 `_moreButton` 局部名（`0.2.1-rc.2` 客户端里唯一），兜底匹配 `aria-label`「更多操作 / More actions」——`0.1.5-alpha.2` 之前它是带「Session 日志 / Session log」文案的独立按钮，那条文案仍被识别。

## 构建与验证

```sh
pnpm install
pnpm build         # src/ -> lib/（lib/ 已提交，安装后无需构建）
pnpm build:check   # 重新构建并断言 lib/ 与提交内容一致
pnpm test          # 七个冒烟测试
npx tsc -p tsconfig.json --noEmit   # 类型检查（build.mjs 不跑 tsc）
```

`pnpm test` 依次跑：`scripts/smoke-client.mjs`（按浏览器加载器的真实方式加载 `lib/client.js`，断言 bundle id == 包名、导出与 `inject` 契约）、`scripts/smoke-host.mjs`（加载 `lib/index.js`，断言五个字段都是 volatile、默认值正确，且 Host 半侧以**自己的 fiber** 注册 `{ auto: false }`）、`scripts/smoke-visibility.mjs`（在 jsdom 里按 `0.2.1-rc.2` 的真实头部标记挂载 `apply()`，验证两个持久化开关驱动 DOM，包括重挂载后的观察者补偿、`aria-label` 兜底定位，以及 `0.1.5-alpha.2` 之前那个「Session 日志」文字按钮仍被识别）、`scripts/smoke-config.mjs`（用假的配置表单挂载 `apply()`，验证按行 id `brand-deepseek` 取表单、读到的配置驱动运行时、开关经 `form.set` 写回、Host 拒绝写入或页面不可写时不假装已保存）、`scripts/smoke-shadowing.mjs`（用**真实**的 `@deepseek-ai/dsh-client-ui-slots` 注册表预置内置品牌占位，验证本插件压过它而不是抛错、关掉自定义样式后交还给它、同优先级注册确实会抛错，且没有内置占位的构建里仍然渲染鲸鱼标志）、`scripts/smoke-locators.mjs`（对已发布的 `-ui-conversation`、`-ui-trajectory`、`dsh-session-log-export` bundle 逐个校验在用的类名/文案定位点，并要求源码里的每个定位点都已在表里登记）与 `scripts/smoke-metadata.mjs`（按 Harness 的解析规则校验 `./locale/*.json` 与 `./icon`，含语言 id 文件名、非空标题描述、图标格式与 256 KiB 上限、`exports`/`files` 双声明，以及图标与侧边栏同一条鲸鱼路径）。jsdom 只是本包的开发依赖，运行时不需要。

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
- **官方 profile 下的品牌。** 内置的 `ui-brand-official` 在 official 构建里确实注册同样两个侧边栏插槽（它发布出去的 bundle 已经编译掉构建开关）。本插件用 `priority: -1` 注册，所以开启时**压过**它、关闭时把插槽交还给它——不再有「同优先级抢占而抛错」的风险。想让别的插件再压过本插件，用比 `-1` 更低的优先级注册即可。
- **标题行出现两个标题（品牌标题与官方标题并排）。** 说明当前 Harness 又改掉了标题行的 CSS Module 局部名，插件按设计退化而不是报错。提 issue 时附上 Harness 版本和那个 `<hash>_xxx` 局部名即可。
- **隐藏的页签或按钮又出现了。** 观察者会在重挂载后重新应用；只有类名后缀与本地化文案（含 `aria-label`）**同时**变化时插件才放弃隐藏（宁可保持可见，也不误隐藏别的元素）。

## 隐私与作用域

插件不发起任何网络请求、不读取会话内容、不上报遥测。它只做三件事：注册插槽占位、读写本插件 `brand-deepseek` 这一行的配置、在会话页头部按设置隐藏两个 DOM 元素（轨迹页签、头部「更多操作」菜单按钮）。设置值保存在 Harness 的 profile 配置里，不离开本机。隐藏元素只影响渲染，轨迹数据与「下载 Session 日志」功能不受影响。

## 许可证

MIT —— 详见 `LICENSE`。

侧边栏的鲸鱼标志与 `DeepSeek` 字标复制自 DeepSeek 官网（deepseek.com）页头品牌 SVG，未作修改；DeepSeek 名称与标志是 DeepSeek（杭州深度求索人工智能基础技术研究有限公司）的商标，此处仅用于在插件里呈现官方产品的观感，MIT 许可证只覆盖本插件源码、不涉及这些标志。上游版权说明与商标声明见 `NOTICE`。
