/**
 * Smoke test (DOM): load lib/client.js as the browser module loader would,
 * mount its apply() on a jsdom document that mirrors the harness chrome
 * (conversation header tablist with 对话/轨迹 tabs, header utilities band with
 * the icon-only 更多操作 menu button that holds the Session log download), and
 * verify the two persisted show/hide toggles drive the DOM — including the
 * MutationObserver re-apply after a remount, the aria-label fallback locator,
 * and the pre-0.1.5 text button whose label still locates the control.
 *
 * jsdom is a devDependency of this package (it is only needed by this script,
 * never by the plugin at runtime).
 */
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { JSDOM } = require('jsdom')

const code = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')

/** Harness chrome as the rc.2 web client renders it. */
function headerHtml({ label = '更多操作' } = {}) {
  return `
<div id="header">
  <div class="Gvuf8a_headerActions"></div>
  <div class="Gvuf8a_headerUtilities">
    <button type="button" class="Gvuf8a_moreButton" aria-label="${label}" aria-haspopup="menu" aria-expanded="false"></button>
  </div>
</div>
<div id="tabs" class="Gvuf8a_tabs" role="tablist">
  <button type="button" role="tab" class="Gvuf8a_tab">对话</button>
  <button type="button" role="tab" class="Gvuf8a_tab">轨迹</button>
</div>
`
}

const HEADER_HTML = headerHtml()

/** The same chrome as harness versions before 0.1.5-alpha.2 rendered it. */
const LEGACY_HEADER_HTML = `
<div id="header">
  <div class="Gvuf8a_headerUtilities">
    <button type="button" class="Gvuf8a_sessionLogButton">
      <span>Session 日志</span>
    </button>
  </div>
</div>
<div id="tabs" class="Gvuf8a_tabs" role="tablist">
  <button type="button" role="tab" class="Gvuf8a_tab">轨迹</button>
</div>
`

/** One full boot: fresh jsdom + bundle registration + apply, given persisted values. */
async function boot(persisted, { header = HEADER_HTML, renamedClass = null } = {}) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>${header}</body></html>`, {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  })
  const { window } = dom
  if (renamedClass !== null) {
    window.document.querySelector(renamedClass.from).className = renamedClass.to
  }

  let registration
  window.__ModuleLoader__ = { load: (row) => { registration = row } }
  runInNewContext(code, { window, document: window.document, MutationObserver: window.MutationObserver, queueMicrotask: window.queueMicrotask, console })

  const nodeShim = (spec) => {
    if (spec === 'react/jsx-runtime') return require('react/jsx-runtime')
    if (spec === 'react') return require('react')
    if (spec === '@deepseek-ai/dsh-client-ui-primitives') return new Proxy({}, { get: () => () => null })
    throw new Error('unexpected require: ' + spec)
  }
  const module = { exports: {} }
  const out = registration.factory(nodeShim, module, module.exports)

  const ctx = {
    effect: (callback) => {
      const dispose = callback()
      return typeof dispose === 'function' ? dispose : () => {}
    },
    locale: {
      register: () => {},
      bind: () => (key) => key,
    },
    slots: {
      inject: () => () => {},
      register: () => () => {},
    },
    // The plugin reads its configuration through the settings domain's shared
    // form, keyed by the Host entry id.
    configForms: {
      get: () => ({
        getSnapshot: () => ({
          status: 'ready',
          value: persisted,
          base: undefined,
          user: undefined,
          revision: 1,
          writable: true,
          mode: 'host',
        }),
        subscribe: () => () => {},
        set: async () => true,
        unset: async () => true,
        mutate: async () => true,
      }),
    },
  }
  out.apply(ctx)
  await new Promise(resolve => setTimeout(resolve, 30)) // let brandStyle.refresh() settle
  return dom
}

const assert = (condition, message) => {
  if (!condition) throw new Error('assertion failed: ' + message)
}

const trajectoryTabOf = (document) =>
  [...document.querySelectorAll('[role="tablist"] button[role="tab"]')]
    .find(button => button.textContent.trim() === '轨迹')
const sessionLogButtonOf = (document) =>
  document.querySelector('.Gvuf8a_moreButton')
    ?? [...document.querySelectorAll('.Gvuf8a_headerUtilities button')]
      .find(button => (button.getAttribute('aria-label') ?? button.textContent).includes('更多操作'))

// 1. Persisted hidden: both chrome pieces get display:none.
{
  const { window } = await boot({ enabled: true, hero: false, trajectoryTab: false, sessionLogButton: false, color: '#4176e6' })
  assert(trajectoryTabOf(window.document).style.display === 'none', 'trajectory tab should be hidden')
  assert(sessionLogButtonOf(window.document).style.display === 'none', 'session log button should be hidden')
}

// 2. Persisted visible: no inline display is applied.
{
  const { window } = await boot({ enabled: true, hero: false, trajectoryTab: true, sessionLogButton: true, color: '#4176e6' })
  assert(trajectoryTabOf(window.document).style.display !== 'none', 'trajectory tab should stay visible')
  assert(sessionLogButtonOf(window.document).style.display !== 'none', 'session log button should stay visible')
}

// 3. Re-render (React remounts the header) while hidden: the observer re-hides.
{
  const { window } = await boot({ enabled: true, hero: false, trajectoryTab: false, sessionLogButton: false, color: '#4176e6' })
  const tablist = window.document.querySelector('[role="tablist"]')
  const oldTab = trajectoryTabOf(window.document)
  const freshTab = oldTab.cloneNode(true)
  oldTab.remove()
  tablist.appendChild(freshTab)
  await new Promise(resolve => setTimeout(resolve, 30))
  assert(freshTab.style.display === 'none', 'observer should re-hide a remounted tab')
}

// 4. More-actions locator fallback (class renamed away from the local): the
//    aria-label inside the header utilities band still hides it.
{
  const { window } = await boot(
    { enabled: true, hero: false, trajectoryTab: true, sessionLogButton: false, color: '#4176e6' },
    { renamedClass: { from: '.Gvuf8a_moreButton', to: 'Renamed_moreActions' } },
  )
  const button = window.document.querySelector('.Gvuf8a_headerUtilities button')
  assert(button.style.display === 'none', 'aria-label fallback should hide the more-actions button')
}

// 5. Pre-0.1.5 chrome (dedicated text button, no more-actions button): still hidden.
{
  const { window } = await boot(
    { enabled: true, hero: false, trajectoryTab: true, sessionLogButton: false, color: '#4176e6' },
    { header: LEGACY_HEADER_HTML },
  )
  const button = window.document.querySelector('.Gvuf8a_sessionLogButton')
  assert(button.style.display === 'none', 'legacy session-log label should hide the text button')
}

// 6. More-actions locator primary path (label renamed away): the CSS-module
//    local alone hides it.
{
  const { window } = await boot(
    { enabled: true, hero: false, trajectoryTab: true, sessionLogButton: false, color: '#4176e6' },
    { header: headerHtml({ label: '其他操作' }) },
  )
  const button = window.document.querySelector('.Gvuf8a_moreButton')
  assert(button.style.display === 'none', 'class local should hide the more-actions button')
}

console.log('VISIBILITY SMOKE OK')
