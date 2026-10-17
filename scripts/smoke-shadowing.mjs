/**
 * Smoke test (real slot registry): the plugin's brand contribution must SHADOW
 * a shipped occupant, never clash with it.
 *
 * The slot registry keeps one occupant per cell at each priority and renders the
 * LOWEST; a second registration into an occupied `single` slot at the SAME
 * priority throws. `@deepseek-ai/dsh-client-ui-brand-official` occupies
 * `sidebar.brand.mark` and `sidebar.brand.name` at the default priority 0, and
 * its published bundle compiles the build-profile gate away, so it registers in
 * every official client build. A priority-0 registration from this plugin would
 * therefore throw on activation there and leave the brand unapplied.
 *
 * This smoke wires the plugin's built bundle to the REAL published `SlotCore`
 * (`@deepseek-ai/dsh-client-ui-slots`) and to the REAL published
 * `@deepseek-ai/dsh-client-ui-brand-official` bundle as the shipped occupant,
 * then asserts:
 *  - that shipped bundle registers its two occupants at priority 0 (the premise
 *    that makes this plugin's priority load-bearing);
 *  - the plugin's registrations coexist with them and win both cells, and its
 *    hero occupant and Settings section land as before;
 *  - the clash the plugin avoids is real (a same-priority second registration
 *    throws);
 *  - turning the custom style off hands both cells back to the shipped
 *    occupant — the documented "official default brand" fallback;
 *  - a build without that occupant still renders the plugin's brand.
 *
 * The winning mark is rendered too, so the assertion is about the DeepSeek
 * whale the user sees, not only about registry bookkeeping.
 */
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { createRequire } from 'node:module'
import { SlotCore } from '@deepseek-ai/dsh-client-ui-slots'

const require = createRequire(import.meta.url)
const { JSDOM } = require('jsdom')

const code = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')

/** The shipped occupant this plugin has to coexist with. */
const OFFICIAL_BRAND = '@deepseek-ai/dsh-client-ui-brand-official'

const ENTRY_ID = 'brand-deepseek'
const BRAND_SLOTS = ['sidebar.brand.mark', 'sidebar.brand.name']
const HERO_SLOT = 'conversation.hero.brand.mark'
const SECTION_SLOT = 'settings.section'

const assert = (condition, message) => {
  if (!condition) throw new Error('assertion failed: ' + message)
}

const settle = () => new Promise(resolve => setTimeout(resolve, 30))

/** The browser module-table shim every client bundle is materialized with. */
const nodeShim = (spec) => {
  if (spec === 'react/jsx-runtime') return require('react/jsx-runtime')
  if (spec === 'react') return require('react')
  if (spec === '@deepseek-ai/dsh-client-ui-primitives') return new Proxy({}, { get: () => () => null })
  throw new Error('unexpected require: ' + spec)
}

/**
 * Load one client bundle exactly as the browser module loader does: run its
 * `window.__ModuleLoader__.load` registration, then materialize the factory.
 * @param file - built bundle path.
 * @returns the bundle's exports.
 */
function loadBundle(file) {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  })
  let registration
  dom.window.__ModuleLoader__ = { load: (row) => { registration = row } }
  runInNewContext(readFileSync(file, 'utf8'), {
    window: dom.window,
    document: dom.window.document,
    MutationObserver: dom.window.MutationObserver,
    queueMicrotask: dom.window.queueMicrotask,
    console,
  })
  const module = { exports: {} }
  return registration.factory(nodeShim, module, module.exports)
}

/**
 * Fresh registry with the declarations the shell provides: the brand slots are
 * `single`/root, the Settings page seat is a `list`/root slot.
 * @returns the core plus the declaration registration keeping the children alive.
 */
function createRegistry() {
  const core = new SlotCore()
  const declaration = core.register({
    name: 'root',
    children: {
      'sidebar.brand.mark': { kind: 'single', scope: 'root' },
      'sidebar.brand.name': { kind: 'single', scope: 'root' },
      'conversation.hero.brand.mark': { kind: 'single', scope: 'root' },
      'settings.section': { kind: 'list', scope: 'root' },
    },
  }, () => null)
  return { core, declaration }
}

/**
 * Fake `ctx.configForms.get()` form mirroring the Host contract: the accepted
 * section, its subscribers, and the write log. `accept: false` is a refusal.
 */
function createForm({ value, accept = true } = {}) {
  const listeners = new Set()
  let snapshot = {
    status: 'ready', value, base: undefined, user: undefined,
    revision: value === undefined ? undefined : 1, writable: true,
  }
  const form = {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    push: (next) => {
      snapshot = { ...snapshot, status: 'ready', value: next, revision: (snapshot.revision ?? 0) + 1 }
      for (const listener of listeners) listener()
    },
    set: async (field, next) => {
      if (!accept) return false
      form.push({ ...snapshot.value, [field]: next })
      return true
    },
    unset: async () => true,
    mutate: async () => true,
  }
  return form
}

/**
 * Run one plugin activation against a real registry.
 * @param options - whether the shipped official occupant is composed, and the accepted section.
 * @returns the registry, the shipped occupants' components, and the Settings page face.
 */
async function boot({ shipped = false, value } = {}) {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  })
  const { window } = dom

  let registration
  window.__ModuleLoader__ = { load: (row) => { registration = row } }
  runInNewContext(code, {
    window,
    document: window.document,
    MutationObserver: window.MutationObserver,
    queueMicrotask: window.queueMicrotask,
    console,
  })

  const module = { exports: {} }
  const out = registration.factory(nodeShim, module, module.exports)

  const { core } = createRegistry()

  /** Real slot service over the real core: `register` forwards options verbatim. */
  const slots = {
    // Every slot above is declared before apply runs, so the declaration wait
    // resolves immediately; generator callbacks (the brand pair) are drained
    // the way the runtime's declaration effect drains them.
    inject: (_name, callback) => {
      const result = callback()
      const disposers = []
      if (result !== undefined && typeof result.next === 'function') {
        for (let step = result.next(); step.done !== true; step = result.next()) disposers.push(step.value)
      } else if (typeof result === 'function') disposers.push(result)
      return () => { for (const dispose of disposers.reverse()) dispose() }
    },
    register: (options, component) => core.register(options, component),
  }

  /** Components the shipped occupant registered, captured before this plugin runs. */
  const shippedOccupants = {}
  if (shipped) {
    const official = loadBundle(require.resolve(`${OFFICIAL_BRAND}/client`))
    official.apply({ slots })
    for (const slot of BRAND_SLOTS) {
      const registered = core.entries(slot)
      assert(registered.length === 1, `the shipped ${OFFICIAL_BRAND} bundle should occupy ${slot} at priority 0`)
      assert(registered[0].options.priority === undefined, `the shipped ${slot} occupant should sit at the default priority`)
      shippedOccupants[slot] = registered[0].component
    }
  }

  const form = createForm({ value })
  const ctx = {
    effect: (callback) => {
      const dispose = callback()
      return typeof dispose === 'function' ? dispose : () => {}
    },
    locale: {
      register: () => {},
      bind: () => (key) => key,
    },
    slots,
    configForms: {
      get: (entryId) => {
        assert(entryId === ENTRY_ID, `configForms should be addressed by the entry id, got ${String(entryId)}`)
        return form
      },
    },
  }
  out.apply(ctx)
  await settle()

  const section = core.entries(SECTION_SLOT).find(entry => entry.options.id === ENTRY_ID)
  assert(section !== undefined, 'the Settings section should be registered')
  return { window, core, form, shippedOccupants, face: section.inject() }
}

/** The rendered React element of one slot's winning occupant. */
const winnerElement = (core, slot) => {
  const winner = core.entriesOfSlot(slot)[0]
  assert(winner !== undefined, `${slot} should have a winning occupant`)
  // `t` is the locale seat the renderer injects; the brand mark ignores it.
  return { entry: winner, element: winner.component({ size: 20, t: (key) => key }) }
}

/**
 * Whether a rendered element tree draws the DeepSeek whale mark. Function
 * components are invoked (they are pure and shallow here) because the hero
 * occupant returns a fragment holding the mark as an unrendered element.
 */
const drawsDeepSeekMark = (node, depth = 0) => {
  if (depth > 4 || node === null || node === undefined || typeof node !== 'object') return false
  if (Array.isArray(node)) return node.some(child => drawsDeepSeekMark(child, depth + 1))
  if (node.type === 'svg' && node.props?.['aria-label'] === 'DeepSeek') return true
  if (typeof node.type === 'function') {
    const props = { ...node.props, t: node.props?.t ?? (key => key) }
    return drawsDeepSeekMark(node.type(props), depth + 1)
  }
  return drawsDeepSeekMark(node.props?.children, depth + 1)
}

// 1. With the shipped occupant already in place, the plugin shadows instead of clashing.
{
  const { core, face, shippedOccupants } = await boot({
    shipped: true,
    value: { enabled: true, hero: true, trajectoryTab: true, sessionLogButton: true, color: '#123456' },
  })

  for (const slot of BRAND_SLOTS) {
    const { entry, element } = winnerElement(core, slot)
    assert(entry.options.priority === -1, `${slot} should be registered below the shipped occupant`)
    assert(entry.component !== shippedOccupants[slot], `${slot} should render this plugin's occupant`)
    assert(drawsDeepSeekMark(element), `${slot} should render the DeepSeek mark`)
  }

  // The hero occupant renders the mark plus its brand title, so compare the row.
  const hero = winnerElement(core, HERO_SLOT)
  assert(hero.entry.options.priority === -1, `${HERO_SLOT} should be shadowing-ranked like the brand slots`)
  assert(drawsDeepSeekMark(hero.element), 'the hero winner should draw the DeepSeek mark')

  // The raw ledger keeps both occupants: the shipped one is shadowed, not evicted.
  assert(core.entries('sidebar.brand.mark').length === 2, 'the shipped occupant should stay registered underneath')

  // No registration failed: a rejected one would land in the page's error state.
  assert(face.hooks.brandStyle.getSnapshot().error === null,
    `no brand registration should have failed, got: ${String(face.hooks.brandStyle.getSnapshot().error)}`)

  // Turning the custom style off releases both cells back to the shipped occupant.
  await face.setEnabled(false)
  for (const slot of BRAND_SLOTS) {
    const winner = core.entriesOfSlot(slot)[0]
    assert(winner.component === shippedOccupants[slot],
      `turning the custom style off should hand ${slot} back to the shipped occupant`)
  }
}

// 2. A same-priority registration is the clash this plugin's priority avoids.
{
  const { core } = await boot({
    shipped: true,
    value: { enabled: true, hero: true, trajectoryTab: true, sessionLogButton: true, color: '#123456' },
  })
  let failure
  try {
    core.register({ name: 'sidebar.brand.mark' }, () => null)
  } catch (error) {
    failure = error
  }
  assert(failure instanceof Error, 'a second priority-0 registration into a single slot should throw')
  assert(/already has a registration/.test(failure.message), `the clash should name the occupant, got: ${failure.message}`)
}

// 3. Without the shipped occupant (a local build) the plugin's brand is the only one — and renders.
{
  const { core } = await boot({
    shipped: false,
    value: { enabled: true, hero: true, trajectoryTab: true, sessionLogButton: true, color: '#123456' },
  })
  const { element } = winnerElement(core, 'sidebar.brand.mark')
  assert(drawsDeepSeekMark(element), 'a build without the shipped occupant should render the plugin mark')
  assert(core.entries('sidebar.brand.mark').length === 1, 'a build without the shipped occupant holds one registration')
}

console.log('SHADOWING SMOKE OK')
