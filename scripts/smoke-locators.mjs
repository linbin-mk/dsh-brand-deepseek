/**
 * Smoke test (locator contract): the DOM hooks this plugin's runtime targets
 * have no type coverage — the harness exposes them as rendered markup, not as
 * exports — so a harness release can rename one silently and degrade a feature
 * without failing anything else. This smoke keeps the per-release check honest:
 * every live hook must appear in the published bundle of the package that
 * renders it, and every hook the plugin's own sources target must be listed
 * here (live or legacy), so a new selector cannot be added without a contract
 * entry.
 *
 * Live hooks are the strings the plugin matches: CSS-module local names in the
 * `<hash>_<local>` shape (`_fishHitbox`, `_moreButton`, …), the composer-seat
 * attribute, the tab role the trajectory tab is found through, and the
 * localized control labels used as fallbacks.
 *
 * Legacy hooks are historical no-ops the sources keep on purpose: the harness
 * versions that never had them ignore the selector, and the current bundles no
 * longer carry them. They are listed as legacy rather than deleted so the
 * sources stay readable against those versions.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/**
 * Live locator table: each hook must be present in the client bundle of the
 * package that renders it (resolved through the package's own `./client`
 * export, i.e. exactly what a browser plugin row loads).
 */
const LIVE = [
  {
    package: '@deepseek-ai/dsh-client-ui-conversation',
    hooks: [
      // Hero-headline sheet (see src/client/hero.tsx).
      'data-composer-seat', '_headline', '_titleGroup', '_previewBadge', '_fishHitbox',
      // Conversation header band and view tablist (see src/client/visibility.ts).
      '_headerUtilities', 'tablist', 'role: "tab"',
    ],
  },
  {
    package: '@deepseek-ai/dsh-session-log-export',
    hooks: [
      // Header more-actions button holding the Session log download.
      '_moreButton', '更多操作', 'More actions',
    ],
  },
  {
    package: '@deepseek-ai/dsh-client-ui-trajectory',
    hooks: [
      // Localized label of the trajectory view tab, the plugin's only stable hook.
      '轨迹', 'Trajectory',
    ],
  },
]

/** Hooks the sources keep as no-ops or fallbacks for harness versions that shipped them. */
const LEGACY = {
  // 0.1.5-rc.1's dedicated title local; 0.1.5-rc.2 replaced it with _titleGroup.
  '_headlineText': '@deepseek-ai/dsh-client-ui-conversation',
  // The dedicated Session log text button session-log-export replaced with the
  // more-actions menu in 0.1.5-alpha.2; the labels stay recognized.
  'Session 日志': '@deepseek-ai/dsh-session-log-export',
  'Session log': '@deepseek-ai/dsh-session-log-export',
}

/** Plugin sources whose selectors and fallback labels this table must cover. */
const SOURCES = ['src/client/hero.tsx', 'src/client/visibility.ts']

/** Hooks the sources target that are not `class*='_local'` selectors. */
const NON_CLASS_HOOKS = ['data-composer-seat', 'tablist', '轨迹', 'Trajectory', '更多操作', 'More actions', 'Session 日志', 'Session log']

const assert = (condition, message) => {
  if (!condition) throw new Error('assertion failed: ' + message)
}

const sourceText = SOURCES
  .map(file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'))
  .join('\n')

// 1. Every live hook is still rendered by the package that owns it.
const failures = []
for (const { package: name, hooks } of LIVE) {
  const bundle = require.resolve(`${name}/client`)
  const text = readFileSync(bundle, 'utf8')
  for (const hook of hooks) {
    if (!text.includes(hook)) failures.push(`${name}: "${hook}" is gone from ${bundle}`)
  }
}
assert(failures.length === 0, `the published harness bundles no longer carry a locator this plugin targets:\n  ${failures.join('\n  ')}`)

// 2. The table covers the sources: a selector or label added to the plugin
//    without a contract entry fails here instead of drifting silently.
const declared = new Set([...LIVE.flatMap(entry => entry.hooks), ...Object.keys(LEGACY)])
const targeted = new Set()
for (const match of sourceText.matchAll(/class\*=\[?['"]_([A-Za-z][\w-]*)['"]/g)) targeted.add(`_${match[1]}`)
for (const hook of NON_CLASS_HOOKS) {
  assert(sourceText.includes(hook), `the locator table lists "${hook}" but no source targets it any more`)
  targeted.add(hook)
}
const undeclared = [...targeted].filter(hook => !declared.has(hook))
assert(undeclared.length === 0, `these hooks need a locator-table entry (live or legacy): ${undeclared.join(', ')}`)

// 3. Legacy hooks stay documented: they must still be named in the sources.
for (const hook of Object.keys(LEGACY)) {
  assert(sourceText.includes(hook), `legacy hook "${hook}" is listed but no longer appears in the sources`)
}

console.log(`LOCATOR SMOKE OK (${declared.size} hooks over ${new Set(LIVE.map(entry => entry.package)).size} packages)`)
