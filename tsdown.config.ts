import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

/**
 * The client module table is keyed by entry name, which must equal the package
 * name; deriving it here keeps the bundle and the manifest from drifting apart
 * on a rename (`scripts/smoke-client.mjs` asserts the same equality).
 */
const { name: packageName } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { name: string }

/**
 * Dual build:
 *  - the host half (`src/index.ts` -> `lib/index.js`) stays ESM for the Node
 *    Cordis loader, with the private `@deepseek-ai` peer packages external;
 *  - the client half (`src/client/index.ts` -> `lib/client.js`) is emitted as a
 *    CJS bundle wrapped in `window.__ModuleLoader__.load({ id, factory })`, the
 *    exact shape the web client-modules loader expects for a third-party plugin
 *    (it injects the bundle as a classic script with a `require` shim that
 *    answers the runtime externals from the module table).
 *
 * The client bundle keeps every `@deepseek-ai/*` and React specifier external:
 * type-only imports are erased before resolution, and the few value imports
 * (ui-primitives, react/jsx-runtime) resolve from the web seed table.
 */

const PEER_EXTERNALS = [/^@deepseek-ai\//, 'react', 'react-dom', 'react/jsx-runtime']

export default defineConfig([
  {
    name: 'host',
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    platform: 'node',
    outDir: 'lib',
    dts: false,
    clean: false,
    install: false,
    deps: { neverBundle: PEER_EXTERNALS },
    outExtensions: () => ({ js: '.js' }),
  },
  {
    name: 'client',
    entry: { client: 'src/client/index.ts' },
    format: 'cjs',
    platform: 'browser',
    outDir: 'lib',
    dts: false,
    clean: false,
    install: false,
    deps: { neverBundle: PEER_EXTERNALS },
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(packageName)}, factory: (require) => {`,
      intro: 'var module = { exports: {} }; var exports = module.exports;',
      footer: 'return module.exports; } });',
    },
  },
])
