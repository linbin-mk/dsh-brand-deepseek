/**
 * Smoke test: load lib/client.js exactly as the web module loader does, then
 * assert the registration contract the harness boot graph depends on.
 *
 * The id assertion is deliberately derived from package.json rather than a
 * literal: the client module table is keyed by entry name == package name, and
 * a hardcoded copy would stay green through a rename that breaks the boot.
 */
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { createRequire } from 'node:module'

const nodeRequire = createRequire(import.meta.url)

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const code = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
let registration
const window = { __ModuleLoader__: { load: (r) => { registration = r } } }
runInNewContext(code, { window, console })

if (!registration) throw new Error('no registration captured')
const stubComponents = new Proxy({}, { get: () => () => null })
const shim = (spec) => {
  if (spec === 'react/jsx-runtime') return nodeRequire('react/jsx-runtime')
  if (spec === 'react') return nodeRequire('react')
  // The primitives package is browser-only (CSS imports); a stub suffices —
  // its members are only referenced at render time, never at factory time.
  if (spec === '@deepseek-ai/dsh-client-ui-primitives') return stubComponents
  throw new Error('unexpected require: ' + spec)
}
const module = { exports: {} }
const out = registration.factory(shim, module, module.exports)

console.log('id:', registration.id)
console.log('exports keys:', Object.keys(out))
console.log('inject:', JSON.stringify(out.inject))
if (registration.id !== manifest.name) {
  throw new Error(`bundle id ${registration.id} does not match package name ${manifest.name}`)
}
if (typeof out.apply !== 'function') throw new Error('apply missing')
if (out.inject.join(',') !== 'slots,remote,remote.settings,locale') throw new Error('inject mismatch')
console.log('SMOKE OK')
