English | [简体中文](https://github.com/linbin-mk/dsh-brand-deepseek/blob/main/README.md)

# dsh-brand-deepseek

[![npm version](https://img.shields.io/npm/v/@linbin-mk/dsh-brand-deepseek)](https://www.npmjs.com/package/@linbin-mk/dsh-brand-deepseek)
[![publish workflow](https://github.com/linbin-mk/dsh-brand-deepseek/actions/workflows/publish.yml/badge.svg)](https://github.com/linbin-mk/dsh-brand-deepseek/actions/workflows/publish.yml)
[![license](https://img.shields.io/npm/l/@linbin-mk/dsh-brand-deepseek)](LICENSE)
[![Node](https://img.shields.io/node/v/@linbin-mk/dsh-brand-deepseek)](package.json)
[![platform](https://img.shields.io/badge/platform-Web%20client-lightgrey)](#requirements)

`dsh-brand-deepseek` is a **third-party, self-contained** DeepSeek Harness client plugin. It replaces the Web client sidebar brand with the official DeepSeek look — whale mark plus `deepseek` wordmark — and, when enabled, the blank-session hero headline above the chat box with the official title (whale mark + 想从哪里开始?). It overrides the shell's `DSH Local Build` fallback entirely through the documented slot system, so the harness source never has to be patched.

It fills two single slots: `sidebar.brand.mark` (the whale mark) and `sidebar.brand.name` (the `deepseek` wordmark); the hero headline goes through the `conversation.hero.brand.mark` slot plus one scoped style sheet.

## Features

- **Sidebar brand** — the official DeepSeek whale mark and wordmark, filled with the official DeepSeek blue by default.
- **Hero headline** — when on, the blank-session title row above the chat box becomes the DeepSeek brand title (whale mark + 想从哪里开始?), with the official default headline (探索未至之境 + the 预览版 badge) hidden and the row re-centered; when off, the official headline returns.
- **Brand style settings page** (**Settings → Brand style**, bottom left):
  - a **custom style** toggle — off restores the official default brand (`DSH 本地构建` / `DSH Local Build` + build-version badge): the brand slots are unregistered, so the shell fallback renders;
  - a **hero headline** toggle — switches the blank-session title row independently (defaults to on);
  - **trajectory tab** and **session log button** toggles — show or hide those two pieces of harness chrome in the conversation header (both default to on). Implemented purely at the DOM level: no harness source is touched and the data behind them (trajectory records, export) is unaffected;
  - **ten brand colors** (the current scheme — official DeepSeek blue — is the default). Choices apply immediately and are written back to the Host configuration, so they survive reloads.
- **Live preview** — the settings preview panel mirrors both states; with the custom style off it renders the shell fallback (fish mark, localized label and the build-version badge).

## Requirements

- Node.js `^22.19` or `>=24`
- DeepSeek Harness `0.1.7-alpha.1` or a compatible `0.1.7` prerelease, on a **Web profile** that provides `ctx.slots`, `ctx.configForms` and `ctx.locale`
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
dsh plugin --profile web-brand add ./linbin-mk-dsh-brand-deepseek-0.1.4.tgz
```

Remove it from the same profile:

```sh
dsh plugin --profile web-brand remove @linbin-mk/dsh-brand-deepseek
```

## Settings

The host half declares the brand style as this plugin's Cordis `Config`: all five fields are `.volatile()`, so every one of them is live-editable, with the defaults below. The settings namespace is the loader row id `brand-deepseek` from `cordis.patch.yml` — **deliberately not the package name**, which is the loader identity (`@linbin-mk/dsh-brand-deepseek`); renaming the package does not invalidate existing settings. The client half reads and writes that row's configuration form through `ctx.configForms.get('brand-deepseek')`, and the harness settings domain owns revision fencing and write serialization, so changes take effect immediately with no restart. On a non-loopback page (settings stay process-local) every write control is disabled instead of pretending to save.

| Setting | Default | Effect |
| --- | --- | --- |
| `enabled` | `true` | Master switch for the custom brand. Off unregisters the brand slots, returning the sidebar to the shell's official default brand. |
| `hero` | `true` | Whether the blank-session title row uses the DeepSeek brand title. |
| `trajectoryTab` | `true` | Whether the conversation header's "Trajectory" tab is visible (trajectory data is unaffected). |
| `sessionLogButton` | `true` | Whether the conversation header's "Session log" button is visible (export still works). |
| `color` | `#4176e6` | Brand color, one of ten; official blue is the default. |

## How it works

- The **host half** (`lib/index.js`) does two things: it declares the brand-style Cordis `Config` (five `.volatile()` fields — the whole of the `brand-deepseek` settings namespace) and registers `{ auto: false }` for its own row, since the plugin ships its own settings page and the sidebar Plugins list must not generate a second one.
- The **client half** (`lib/client.js`) is a CJS bundle built by tsdown that self-registers through `window.__ModuleLoader__.load({ id, factory })`. The `id` must equal the **package name** — the harness keys its client module table by entry name, and a mismatch makes the row unresolvable and takes the whole GUI down while `--dump-config` still looks fine. `tsdown.config.ts` derives the id from `package.json#name` and `scripts/smoke-client.mjs` re-asserts the equality, so a rename cannot drift silently.
- The **hero style sheet** targets the harness's CSS-module locals by their `<hash>_<local>` shape, scoped to the conversation shell's `[data-composer-seat]` and anchored on the hero's own `_fishHitbox` descendant, so the shared `.headline` locals of other modules (ContextMeter, ApprovalPanel) are never touched. The official default title is hidden under **every** local it has shipped with — `_headlineText` in `0.1.5-rc.1` and the `_titleGroup` wrapper (title plus badge) introduced in `0.1.5-rc.2`; on a harness that never had a given local the matching selector is simply a no-op. Should those names change again, the plugin degrades to the brand title rendering next to the official one instead of erroring or taking the page down.
- The **two harness-chrome toggles** locate elements by class-name suffix with the localized label as a fallback, and a `MutationObserver` re-applies the state after React remounts the header. If both the class and the label change, the element stays visible rather than being hidden by mistake.

## Build and verify

```sh
pnpm install
pnpm build         # src/ -> lib/ (lib/ is committed; installs need no build step)
pnpm build:check   # rebuild and assert lib/ matches what is committed
pnpm test          # four smoke tests
npx tsc -p tsconfig.json --noEmit   # type check (build.mjs does not run tsc)
```

`pnpm test` runs `scripts/smoke-client.mjs` (loads `lib/client.js` the way the browser loader does, asserting bundle id == package name plus the export and `inject` contract), `scripts/smoke-host.mjs` (loads `lib/index.js` and asserts all five fields are volatile with the documented defaults, and that the host half registers `{ auto: false }` for its **own fiber**), `scripts/smoke-visibility.mjs` (mounts `apply()` on a jsdom document and verifies that both persisted toggles drive the DOM, including the observer re-apply after a remount and the label fallback locator) and `scripts/smoke-config.mjs` (mounts `apply()` over a fake configuration form and verifies that the form is fetched by the `brand-deepseek` row id, that the accepted section drives the runtime, that toggles write through `form.set`, and that a refused write or a non-writable page never pretends to save). jsdom is a development dependency of this package only; the plugin never needs it at runtime.

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
- **The brand is duplicated or conflicting under an official profile.** The in-box `ui-brand-official` package only fills the same slots when `DSH_CLIENT_BUILD_PROFILE === 'official'`. A local build profile is not official, so there is no conflict; if you do run an official profile, disable one of the two.
- **Two headlines show at once (brand title next to the official one).** That means the current harness renamed the hero's CSS-module locals again, and the plugin degrades by design instead of erroring. Include your harness version and the `<hash>_xxx` local name in the issue.
- **A hidden tab or button reappears.** The observer re-applies after a remount; the plugin only gives up when the class suffix **and** the localized label both change (staying visible beats hiding the wrong element).

## Privacy and scope

The plugin makes no network requests, reads no conversation content and reports no telemetry. It does three things only: register slot occupants, read and write the `brand-deepseek` configuration row, and hide two DOM elements in the conversation header (the trajectory tab and the session log button) according to your settings. Values live in the harness profile configuration and never leave the machine. Hiding affects rendering only — trajectory data and export are untouched.

## License

MIT — see `LICENSE`.

The sidebar whale mark and the `DeepSeek` wordmark are copied unmodified from the brand SVG in the header of the DeepSeek website (deepseek.com). The DeepSeek name and marks are trademarks of DeepSeek (Hangzhou DeepSeek Artificial Intelligence Basic Technology Research Co., Ltd.); they appear here only to render the look of the official product inside the plugin, and the MIT license covers this plugin's source code only, not those marks. Upstream copyright and trademark notices are in `NOTICE`.
