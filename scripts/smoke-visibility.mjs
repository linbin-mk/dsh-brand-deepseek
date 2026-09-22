/**
 * Smoke test (DOM): load lib/client.js as the browser module loader would,
 * mount its apply() on a jsdom document that mirrors the harness chrome
 * (conversation header tablist with 对话/轨迹 tabs, header utilities band with
 * the Session 日志 button), and verify the two persisted show/hide toggles
 * drive the DOM — including the MutationObserver re-apply after a remount,
 * and the label fallback locator.
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

const HEADER_HTML = `
<div id="header">
  <div class="Gvuf8a_headerActions"></div>
  <div class="Gvuf8a_headerUtilities">
    <button type="button" class="Gvuf8a_sessionLogButton" disabled="false">
      <span>Session 日志</span>
    </button>
  </div>
</div>
<div id="tabs" class="Gvuf8a_tabs" role="tablist">
  <button type="button" role="tab" class="Gvuf8a_tab">对话</button>
  <button type="button" role="tab" class="Gvuf8a_tab">轨迹</button>
</div>
`

/** One full boot: fresh jsdom + bundle registration + apply, given persisted values. */
async function boot(persisted, { renameSessionLogClass = false } = {}) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>${HEADER_HTML}</body></html>`, {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  })
  const { window } = dom
  if (renameSessionLogClass) {
    const button = window.document.querySelector('.Gvuf8a_sessionLogButton')
    button.className = 'Renamed_sessionLogButton'
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
  document.querySelector('.Gvuf8a_sessionLogButton')
    ?? [...document.querySelectorAll('.Gvuf8a_headerUtilities button')]
      .find(button => button.textContent.includes('Session 日志'))

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

// 4. Session-log label fallback locator (class renamed): still hidden.
{
  const { window } = await boot(
    { enabled: true, hero: false, trajectoryTab: true, sessionLogButton: false, color: '#4176e6' },
    { renameSessionLogClass: true },
  )
  const button = [...window.document.querySelectorAll('.Gvuf8a_headerUtilities button')]
    .find(b => b.textContent.includes('Session 日志'))
  assert(button.style.display === 'none', 'label fallback should hide the session log button')
}

console.log('VISIBILITY SMOKE OK')
