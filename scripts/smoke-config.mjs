/**
 * Smoke test (DOM): mount the client apply() on a jsdom document with a fake
 * settings form, and verify the plugin's configuration plumbing:
 *  - the form is addressed by the Host entry id (`brand-deepseek`), not by the
 *    package name — the loader row id is what the settings registry keys on;
 *  - the accepted section drives the runtime (brand color + hero sheet + the
 *    two harness-chrome toggles);
 *  - a toggle writes through `form.set` and adopts the accepted section, and a
 *    pushed section (another page, or the profile patch) is adopted with no
 *    write at all;
 *  - a refused write and a non-writable page (non-loopback, memory mode) never
 *    pretend to persist: the page keeps showing the accepted section, reports
 *    that it is not writable, and no write is attempted.
 */
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { JSDOM } = require('jsdom')

const code = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')

const CHROME_HTML = `
<div id="tabs" role="tablist">
  <button type="button" role="tab" class="Gvuf8a_tab">对话</button>
  <button type="button" role="tab" class="Gvuf8a_tab">轨迹</button>
</div>
<div class="Gvuf8a_headerUtilities">
  <button type="button" class="Gvuf8a_sessionLogButton">Session 日志</button>
</div>
`

const COLOR_VAR = '--dsh-brand-deepseek-color'
const HERO_STYLE_ID = 'dsh-brand-deepseek-hero-style'
const ENTRY_ID = 'brand-deepseek'

const assert = (condition, message) => {
  if (!condition) throw new Error('assertion failed: ' + message)
}

const settle = () => new Promise(resolve => setTimeout(resolve, 30))

/**
 * Fake `ctx.configForms.get()` form: the accepted section, its subscribers, and
 * the write log the assertions read. `accept: false` mirrors a Host refusal.
 */
function createForm({ value, status = 'ready', writable = true, mode = 'host', accept = true }) {
  const listeners = new Set()
  let snapshot = {
    status,
    value,
    base: undefined,
    user: undefined,
    revision: value === undefined ? undefined : 1,
    writable,
    mode,
  }
  const form = {
    setCalls: [],
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    /** Simulate an accepted section arriving from the Host (read or write). */
    push: (next) => {
      snapshot = { ...snapshot, status: 'ready', value: next, revision: (snapshot.revision ?? 0) + 1 }
      for (const listener of listeners) listener()
    },
    set: async (field, next) => {
      form.setCalls.push([field, next])
      if (!accept) return false
      form.push({ ...snapshot.value, [field]: next })
      return true
    },
    unset: async () => true,
    mutate: async () => true,
  }
  return form
}

/** One full boot: fresh jsdom + bundle registration + apply, given a form. */
async function boot(form, { url = 'http://localhost/' } = {}) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>${CHROME_HTML}</body></html>`, {
    url,
    pretendToBeVisual: true,
  })
  const { window } = dom

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

  const registrations = []
  let requestedEntryId
  let disposals = 0
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
      inject: (_name, factory) => {
        factory()
        return () => { disposals += 1 }
      },
      register: (options, component) => {
        registrations.push({ options, component })
        return () => { disposals += 1 }
      },
    },
    configForms: {
      get: (entryId) => {
        requestedEntryId = entryId
        return form
      },
    },
  }
  out.apply(ctx)
  await settle() // let brandStyle.refresh() settle

  const section = registrations.find(row => row.options.name === 'settings.section')
  return {
    window,
    requestedEntryId,
    disposals: () => disposals,
    face: section.options.inject(),
    pageState: () => section.options.inject().hooks.brandStyle.getSnapshot(),
  }
}

const colorVarOf = (document) => document.documentElement.style.getPropertyValue(COLOR_VAR)
const heroSheetOf = (document) => document.getElementById(HERO_STYLE_ID)
const trajectoryTabOf = (document) =>
  [...document.querySelectorAll('[role="tablist"] button[role="tab"]')]
    .find(button => button.textContent.trim() === '轨迹')
const sessionLogButtonOf = (document) => document.querySelector('.Gvuf8a_sessionLogButton')

// 1. The accepted section drives the runtime, and the form is keyed by entry id.
{
  const form = createForm({
    value: { enabled: true, hero: false, trajectoryTab: false, sessionLogButton: false, color: '#123456' },
  })
  const { window, requestedEntryId, face, pageState } = await boot(form)
  assert(requestedEntryId === ENTRY_ID, `configForms should be addressed by the entry id, got ${String(requestedEntryId)}`)
  assert(colorVarOf(window.document) === '#123456', 'the accepted color should be applied')
  assert(heroSheetOf(window.document) === null, 'the hero sheet should be absent while the hero is off')
  assert(trajectoryTabOf(window.document).style.display === 'none', 'the trajectory tab should be hidden')
  assert(sessionLogButtonOf(window.document).style.display === 'none', 'the session log button should be hidden')
  assert(pageState().color === '#123456', 'the settings page should show the accepted color')
  assert(pageState().writable === true, 'a loopback page with a ready form is writable')
  assert(form.setCalls.length === 0, 'activating the plugin should not write')
  assert(typeof face.setColor === 'function', 'the section should be registered with its write face')
}

// 2. Toggles write through the form and adopt what the Host accepted.
{
  const form = createForm({
    value: { enabled: true, hero: false, trajectoryTab: false, sessionLogButton: false, color: '#123456' },
  })
  const { window, face, disposals } = await boot(form)

  await face.setColor('#10b981')
  assert(form.setCalls.at(-1).join('=') === 'color=#10b981', 'setColor should write the color field')
  assert(colorVarOf(window.document) === '#10b981', 'the accepted color should reach the runtime')

  await face.setHero(true)
  assert(form.setCalls.at(-1).join('=') === 'hero=true', 'setHero should write the hero field')
  assert(heroSheetOf(window.document) !== null, 'the hero sheet should be installed once the hero is on')

  await face.setTrajectoryTab(true)
  assert(trajectoryTabOf(window.document).style.display !== 'none', 'the trajectory tab should be shown again')

  await face.setSessionLogButton(true)
  assert(sessionLogButtonOf(window.document).style.display !== 'none', 'the session log button should be shown again')

  const before = disposals()
  await face.setEnabled(false)
  assert(form.setCalls.at(-1).join('=') === 'enabled=false', 'setEnabled should write the enabled field')
  assert(disposals() > before, 'turning the custom style off should release the brand contribution')
}

// 3. A section pushed by the Host (another page, or the profile patch) is adopted.
{
  const form = createForm({
    value: { enabled: true, hero: true, trajectoryTab: true, sessionLogButton: true, color: '#123456' },
  })
  const { window } = await boot(form)
  const writes = form.setCalls.length
  form.push({ enabled: true, hero: true, trajectoryTab: true, sessionLogButton: true, color: '#8b5cf6' })
  await settle()
  assert(colorVarOf(window.document) === '#8b5cf6', 'a pushed section should be adopted')
  assert(form.setCalls.length === writes, 'adopting a pushed section should not write')
}

// 4. A refused write leaves the accepted section standing.
{
  const form = createForm({
    value: { enabled: true, hero: true, trajectoryTab: true, sessionLogButton: true, color: '#123456' },
    accept: false,
  })
  const { window, face, pageState } = await boot(form)
  await face.setColor('#10b981')
  assert(form.setCalls.length === 1, 'the refused write should still be attempted once')
  assert(colorVarOf(window.document) === '#123456', 'a refused write must not be shown as applied')
  assert(pageState().color === '#123456', 'the page should keep the accepted color after a refusal')
  assert(pageState().busy === false, 'the page should settle after a refusal')
}

// 5. A non-writable page (non-loopback, memory mode) applies defaults and never writes.
{
  const form = createForm({ value: undefined, status: 'unavailable', writable: false, mode: 'memory' })
  const { window, face, pageState } = await boot(form, { url: 'http://192.168.1.5:3080/' })
  assert(colorVarOf(window.document) === '#4176e6', 'the schema defaults should apply while no section can be read')
  assert(heroSheetOf(window.document) !== null, 'the default hero look should apply')
  assert(pageState().writable === false, 'the settings page should see the form as not writable')
  await face.setEnabled(false)
  assert(form.setCalls.length === 0, 'a non-writable page must not write')
  assert(colorVarOf(window.document) === '#4176e6', 'a non-writable page must not change the runtime')
}

console.log('CONFIG SMOKE OK')
