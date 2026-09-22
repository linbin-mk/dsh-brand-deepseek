/**
 * Smoke test (host): load lib/index.js as the Cordis loader does and assert the
 * Config contract the settings registry depends on — the five brand-style
 * fields, the shipped defaults, and every field volatile so the browser half
 * can edit it live through the entry's configuration form.
 *
 * The settings presentation is asserted too: the plugin ships its own Settings
 * section, so the host half must register `{ auto: false }` for its OWN fiber
 * (the entry's fiber), or the sidebar Plugins list generates a second page.
 */
const plugin = await import('../lib/index.js')

const assert = (condition, message) => {
  if (!condition) throw new Error('assertion failed: ' + message)
}

assert(typeof plugin.apply === 'function', 'apply missing')

const FIELDS = ['enabled', 'hero', 'trajectoryTab', 'sessionLogButton', 'color']
const DEFAULTS = {
  enabled: true,
  hero: true,
  trajectoryTab: true,
  sessionLogButton: true,
  color: '#4176e6',
}

const resolved = plugin.Config({})
for (const field of FIELDS) {
  assert(typeof resolved[field]?.get === 'function', `${field} should be a live reference`)
  assert(resolved[field].get() === DEFAULTS[field], `${field} default should be ${JSON.stringify(DEFAULTS[field])}`)
}

const schema = plugin.Config
for (const field of FIELDS) {
  assert(schema.dict[field]?.meta?.volatile === true, `${field} should be volatile`)
}

// Fake Cordis context: `ctx.inject` activates the settings dependency once the
// service is available, and `child.effect` runs the registration immediately.
const injections = []
const presentations = []
const fiber = { uid: 1 }
const child = {
  effect: (callback) => {
    const dispose = callback()
    return typeof dispose === 'function' ? dispose : () => {}
  },
  settings: {
    configure: (presentation, owner) => {
      presentations.push([presentation, owner])
      return () => {}
    },
  },
}
const ctx = {
  fiber,
  inject: (services, callback) => {
    injections.push(services)
    callback(child)
  },
}
plugin.apply(ctx)

assert(injections.length === 1, 'apply should inject exactly once')
assert(injections[0].join(',') === 'settings', 'apply should require the settings service')
assert(presentations.length === 1, 'apply should configure one settings presentation')
assert(presentations[0][0].auto === false, 'the auto-generated settings page should be off')
assert(presentations[0][1] === fiber, 'the presentation should be owned by the plugin fiber')

console.log('HOST SMOKE OK')
