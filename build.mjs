/**
 * Build entry: delegates to the tsdown CLI so the multi-file client source
 * bundles into the single `lib/client.js` the harness module loader expects.
 * `tsdown` resolves from the project's own node_modules (devDependency); when
 * running from this checkout without `pnpm install`, a symlink to the harness
 * checkout's tsdown satisfies the same resolution.
 */
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const pkgDir = dirname(require.resolve('tsdown/package.json'))
const cli = join(pkgDir, 'dist', 'run.mjs')

const result = spawnSync(process.execPath, [cli], { stdio: 'inherit' })
if (result.error !== undefined) throw result.error
process.exit(result.status ?? 1)
