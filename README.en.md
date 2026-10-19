English | [简体中文](https://github.com/linbin-mk/dsh-brand-deepseek/blob/main/README.md)

# dsh-brand-deepseek

[![npm version](https://img.shields.io/npm/v/@linbin-mk/dsh-brand-deepseek)](https://www.npmjs.com/package/@linbin-mk/dsh-brand-deepseek)
[![publish workflow](https://github.com/linbin-mk/dsh-brand-deepseek/actions/workflows/publish.yml/badge.svg)](https://github.com/linbin-mk/dsh-brand-deepseek/actions/workflows/publish.yml)
[![license](https://img.shields.io/npm/l/@linbin-mk/dsh-brand-deepseek)](LICENSE)
[![Node](https://img.shields.io/node/v/@linbin-mk/dsh-brand-deepseek)](package.json)
[![platform](https://img.shields.io/badge/platform-Web%20client-lightgrey)](#requirements)

`dsh-brand-deepseek` is a **third-party, self-contained** DeepSeek Harness client plugin: through the harness's documented slot system it gives the Web client the official DeepSeek brand in the sidebar and above the chat box, **without patching the harness source**.

- **Sidebar brand** — the whale mark plus the `deepseek` wordmark, filled with the official DeepSeek blue by default; nine more colors are available.
- **Hero headline** — a blank session's title row above the chat box becomes whale mark + 想从哪里开始?, with the official default headline (探索未至之境 + the 预览版 badge) hidden.
- **Always reversible** — **Settings → Brand style** toggles each piece independently; turning it off restores the harness default brand (`DSH 本地构建` + build-version badge).

## Screenshots

![The DeepSeek Harness Web client with dsh-brand-deepseek enabled: the DeepSeek whale and wordmark in the sidebar, and 想从哪里开始? above the composer](https://raw.githubusercontent.com/linbin-mk/dsh-brand-deepseek/main/docs/images/overview.png)

Without the plugin (or with "Custom style" off), the sidebar shows the harness's built-in `DSH 本地构建` brand and build-version badge:

| Default | With the plugin |
| --- | --- |
| ![The default DSH 本地构建 sidebar brand with its build-version badge](https://raw.githubusercontent.com/linbin-mk/dsh-brand-deepseek/main/docs/images/sidebar-before.png) | ![The DeepSeek whale mark and deepseek wordmark](https://raw.githubusercontent.com/linbin-mk/dsh-brand-deepseek/main/docs/images/sidebar-after.png) |

**Settings → Brand style** toggles the custom style, the hero headline, the trajectory tab and the more-actions button, and offers ten brand colors:

![The Brand style settings page with four toggles, ten brand colors and a live preview](https://raw.githubusercontent.com/linbin-mk/dsh-brand-deepseek/main/docs/images/settings.png)

The plugin only fills the three public slots `sidebar.brand.mark`, `sidebar.brand.name` and `conversation.hero.brand.mark`, registering below the default priority so it shadows the shipped `ui-brand-official` occupant in an official build; see [How it works](#how-it-works).

## Features

- **Sidebar brand** — the official DeepSeek whale mark and wordmark, filled with the official DeepSeek blue by default.
- **Hero headline** — when on, the blank-session title row above the chat box becomes the DeepSeek brand title (whale mark + 想从哪里开始?), with the official default headline (探索未至之境 + the 预览版 badge) hidden and the row re-centered; when off, the official headline returns.
- **Brand style settings page** (**Settings → Brand style**, bottom left):
  - a **custom style** toggle — off restores the official default brand (`DSH 本地构建` / `DSH Local Build` + build-version badge): the brand slots are unregistered, so the shell fallback renders;
  - a **hero headline** toggle — switches the blank-session title row independently (defaults to on);
  - **trajectory tab** and **more actions button** toggles — show or hide those two pieces of harness chrome in the conversation header (both default to on). Implemented purely at the DOM level: no harness source is touched and the data behind them (trajectory records, session-log export — the "Download session log" entry lives in that menu) is unaffected;
  - **ten brand colors** (the current scheme — official DeepSeek blue — is the default). Choices apply immediately and are written back to the Host configuration, so they survive reloads.
- **Live preview** — the settings preview panel mirrors both states; with the custom style off it renders the shell fallback (fish mark, localized label and the build-version badge).
- **Display metadata in the plugin lists** — the package ships `icon.svg` (the brand whale mark) plus `locale/en.json` and `locale/zh.json` with `meta.title`/`meta.description`. The Harness Plugin Manager, bundle details and the **Settings → Plugins** inventory read them **without activating the plugin**, so the row shows a localized name and capability description with its own icon instead of a package-name fallback and generic artwork. See [How it works](#how-it-works).

## Requirements

- Node.js `^22.19` or `>=24`
- DeepSeek Harness `0.2.1-rc.2` or a compatible `0.2.1` prerelease, on a **Web profile** that provides `ctx.slots`, `ctx.configForms` and `ctx.locale`
- The package declares `engines.dsh = ^0.2.1-rc.2`: the harness plugin-compatibility preflight reads it **without loading plugin code** (when `engines.dsh` is present it decides alone and `peerDependencies` are ignored), so a version mismatch surfaces as an explicit incompatibility warning instead of a runtime failure
- The client modules the plugin declares (`@deepseek-ai/dsh-client-ui-primitives`, `-ui-sidebar`, `-ui-settings`, `-ui-renderer`, `-locale`, `dsh-api-remotes`) — the default Web profile already ships them
- No path dependency on a Harness checkout

## Install

Install the published package into a custom Web profile. The package declares `dsh.bundle`, so `dsh plugin add` also inserts the `brand-deepseek` row automatically:

```sh
dsh --profile web-brand --from-default-profile web --dump-config
dsh plugin --profile web-brand add @linbin-mk/dsh-brand-deepseek
dsh --profile web-brand
```

Or install a locally built tarball:

```sh
pnpm install
pnpm build
pnpm test
npm pack
dsh plugin --profile web-brand add ./linbin-mk-dsh-brand-deepseek-0.5.1.tgz
```

Remove it from the same profile:

```sh
dsh plugin --profile web-brand remove @linbin-mk/dsh-brand-deepseek
```

## Settings

The host half declares the brand style as this plugin's Cordis `Config`: all five fields are `.volatile()`, so every one of them is live-editable, with the defaults below. The settings namespace is the loader row id `brand-deepseek` from `cordis.patch.yml` — **deliberately not the package name**, which is the loader identity (`@linbin-mk/dsh-brand-deepseek`); renaming the package does not invalidate existing settings. The client half reads and writes that row's configuration form through `ctx.configForms.get('brand-deepseek')`, and the harness settings domain owns revision fencing and write serialization, so changes take effect immediately with no restart. Since DSH `0.2.1-rc.2` every authenticated browser persists through the Host configuration document (the client-side in-process "memory" mode was removed from `ConfigFormSnapshot`), so write controls are disabled — instead of pretending to save — only when the Host document does not accept writes or the page cannot read the namespace.

| Setting | Default | Effect |
| --- | --- | --- |
| `enabled` | `true` | Master switch for the custom brand. Off unregisters the brand slots, returning the sidebar to the shell's official default brand. |
| `hero` | `true` | Whether the blank-session title row uses the DeepSeek brand title. |
| `trajectoryTab` | `true` | Whether the conversation header's "Trajectory" tab is visible (trajectory data is unaffected). |
| `sessionLogButton` | `true` | Whether the conversation header's "More actions" menu button is visible (it holds "Download session log"; export still works). |
| `color` | `#4176e6` | Brand color, one of ten; official blue is the default. |

## How it works

- The **host half** (`lib/index.js`) does two things: it declares the brand-style Cordis `Config` (five `.volatile()` fields — the whole of the `brand-deepseek` settings namespace) and registers `{ auto: false }` for its own row, since the plugin ships its own settings page and the sidebar Plugins list must not generate a second one.
- **Declared target** — `package.json#engines.dsh` states the DSH range this plugin targets (`^0.2.1-rc.2`, the same line as the DSH peer dependencies); `scripts/smoke-client.mjs` asserts the two agree, so a dependency bump cannot drift away from the declaration. The harness compatibility preflight reads that field without loading any plugin code.
- **Brand-slot priority (shadow, do not compete)** — the slot registry allows one occupant per cell **per priority** and renders the **lowest**; a second registration at the same priority throws. The shipped `@deepseek-ai/dsh-client-ui-brand-official` occupies `sidebar.brand.mark` and `sidebar.brand.name` at the default priority `0`, and its published bundle has the `DSH_CLIENT_BUILD_PROFILE` build switch **compiled away**, so it really does register those occupants in every official build. A default-priority registration here would be rejected there (`single slot "…" already has a registration at priority 0`): the shipped brand would stay in place and the settings page would report that failure on every read. All three brand slots therefore register with `priority: -1`: while the custom style is on they shadow the shipped occupant, and turning it off disposes them and **hands the same cell back** to it (or, in a build without one, to the shell fallback).
- The **client half** (`lib/client.js`) is a CJS bundle built by tsdown that self-registers through `window.__ModuleLoader__.load({ id, factory })`. The `id` must equal the **package name** — the harness keys its client module table by entry name, and a mismatch makes the row unresolvable and takes the whole GUI down while `--dump-config` still looks fine. `tsdown.config.ts` derives the id from `package.json#name` and `scripts/smoke-client.mjs` re-asserts the equality, so a rename cannot drift silently.
- **Plugin-list display metadata** is read by `readPluginMeta` (`dsh-app-boot`) without executing plugin code: `./locale/*.json` (`en.json` first, then every sibling language file) supplies `meta.title`/`meta.description`, and `./icon` supplies the icon. Both go through Node's ESM resolver, so they must appear in `exports` (visible to the resolver) **and** `files` (carried into the tarball); `scripts/smoke-metadata.mjs` resolves them by the same rules and checks the text, the language-id filenames, the icon format and 256 KiB limit, and that the icon draws the very whale path the sidebar occupant renders.
- The **hero style sheet** targets the harness's CSS-module locals by their `<hash>_<local>` shape, scoped to the conversation shell's `[data-composer-seat]` and anchored on the hero's own `_fishHitbox` descendant, so the shared `.headline` locals of other modules (ContextMeter, ApprovalPanel) are never touched. The official default title is hidden under **every** local it has shipped with — `_headlineText` in `0.1.5-rc.1` and the `_titleGroup` wrapper (title plus badge) introduced in `0.1.5-rc.2`; on a harness that never had a given local the matching selector is simply a no-op. Every one of them was re-checked against `0.2.1-rc.2`: `[data-composer-seat]`, `_headline`, `_fishHitbox`, `_titleGroup` and `_previewBadge` are all still there (the published bundle generates names such as `pXSMma_titleGroup`), while `_headlineText` is gone and survives only as a no-op for older harnesses. `scripts/smoke-locators.mjs` now automates that re-check: every live locator must appear in the published bundle of the package that renders it, and every locator the sources target must be listed there.
- The **two harness-chrome toggles** (the trajectory tab and the header "More actions" menu button) locate elements by class-name suffix with the localized label — including `aria-label` — as a fallback, and a `MutationObserver` re-applies the state after React remounts the header. If both the class and the label change, the element stays visible rather than being hidden by mistake. The trajectory tab is the `[role="tablist"]` button labelled 轨迹 / Trajectory (unchanged); the more-actions button carries the `_moreButton` local (the only one in the `0.2.1-rc.2` client) and falls back to the accessible name 更多操作 / More actions — before `0.1.5-alpha.2` it was a dedicated text button reading Session 日志 / Session log, and that label is still recognized.

## Build and verify

```sh
pnpm install
pnpm build         # src/ -> lib/ (lib/ is committed; installs need no build step)
pnpm build:check   # rebuild and assert lib/ matches what is committed
pnpm test          # seven smoke tests
npx tsc -p tsconfig.json --noEmit   # type check (build.mjs does not run tsc)
```

`pnpm test` runs `scripts/smoke-client.mjs` (loads `lib/client.js` the way the browser loader does, asserting bundle id == package name plus the export and `inject` contract), `scripts/smoke-host.mjs` (loads `lib/index.js` and asserts all five fields are volatile with the documented defaults, and that the host half registers `{ auto: false }` for its **own fiber**), `scripts/smoke-visibility.mjs` (mounts `apply()` on a jsdom document carrying the real `0.2.1-rc.2` header markup and verifies that both persisted toggles drive the DOM, including the observer re-apply after a remount, the `aria-label` fallback locator, and the pre-`0.1.5-alpha.2` "Session log" text button still being recognized), `scripts/smoke-config.mjs` (mounts `apply()` over a fake configuration form and verifies that the form is fetched by the `brand-deepseek` row id, that the accepted section drives the runtime, that toggles write through `form.set`, and that a refused write or a non-writable page never pretends to save), `scripts/smoke-shadowing.mjs` (wires the bundle to the **real** `@deepseek-ai/dsh-client-ui-slots` registry with the shipped brand occupants pre-registered, and verifies that the plugin shadows them instead of throwing, hands the cells back when the custom style is turned off, that the same-priority clash it avoids really throws, and that a build without those occupants still renders the whale), `scripts/smoke-locators.mjs` (checks every live class/label locator against the published `-ui-conversation`, `-ui-trajectory` and `dsh-session-log-export` bundles, and requires an entry for every locator the sources target) and `scripts/smoke-metadata.mjs` (checks `./locale/*.json` and `./icon` by the harness's own resolution rules: language-id filenames, non-empty title and description, icon format and 256 KiB limit, `exports`/`files` declarations, and the shared whale path). jsdom is a development dependency of this package only; the plugin never needs it at runtime.

## Troubleshooting

- **The sidebar does not change.** First confirm the plugin row is still installed (this only covers the host half; a client-half failure surfaces in the browser console):

  ```sh
  dsh --profile web-brand --dump-config | grep -A 2 brand-deepseek
  ```

  Then open the browser console: client bundle loading errors are printed there.
- **The page shows `Failed to load plugins`.** The harness indexes its client module table by **package name**, and the bundle's registered `id` must be that same string. This repository pins the constraint with a build-time derivation plus a smoke-test assertion; if you rename the package in a fork, rebuild `lib/` (`pnpm build`) rather than editing `lib/client.js` by hand.
- **`dsh plugin add` returns 404 right after a release.** A brand-new version takes a few minutes to appear on the registry's read path; `dist-tags` and metadata usually appear first. Retry later — do not republish.
- **`ERR_PNPM_FETCH_404` when installing through a mirror.** Mirrors such as npmmirror sync new versions on their own schedule. Add `--registry=https://registry.npmjs.org` to that command, or wait for the mirror.
- **pnpm refuses or questions a just-published version.** That is pnpm's `minimumReleaseAge` delay. Allow the package (pnpm records it in `minimumReleaseAgeExclude`) or wait out the window.
- **Brand conflict under an official profile.** The in-box `ui-brand-official` package really does occupy those two sidebar slots in an official build (its published bundle has the build switch compiled away). This plugin registers at `priority: -1`, so it **shadows** that occupant while enabled and hands the cells back to it when you turn the custom style off — the same-priority clash that would otherwise throw cannot happen. To shadow this plugin in turn, register below `-1`.
- **Two headlines show at once (brand title next to the official one).** That means the current harness renamed the hero's CSS-module locals again, and the plugin degrades by design instead of erroring. Include your harness version and the `<hash>_xxx` local name in the issue.
- **A hidden tab or button reappears.** The observer re-applies after a remount; the plugin only gives up when the class suffix **and** the localized label (including `aria-label`) both change (staying visible beats hiding the wrong element).

## Privacy and scope

The plugin makes no network requests, reads no conversation content and reports no telemetry. It does three things only: register slot occupants, read and write the `brand-deepseek` configuration row, and hide two DOM elements in the conversation header (the trajectory tab and the header "More actions" menu button) according to your settings. Values live in the harness profile configuration and never leave the machine. Hiding affects rendering only — trajectory data and "Download session log" are untouched.

## License

MIT — see `LICENSE`.

The sidebar whale mark and the `DeepSeek` wordmark are copied unmodified from the brand SVG in the header of the DeepSeek website (deepseek.com). The DeepSeek name and marks are trademarks of DeepSeek (Hangzhou DeepSeek Artificial Intelligence Basic Technology Research Co., Ltd.); they appear here only to render the look of the official product inside the plugin, and the MIT license covers this plugin's source code only, not those marks. Upstream copyright and trademark notices are in `NOTICE`.
