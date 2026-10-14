/**
 * Smoke test (plugin display metadata): the Harness Plugin Manager, bundle
 * details, and the Settings plugin inventory read a plugin's title,
 * description, and icon WITHOUT activating it — through the exported
 * `./locale/*.json` dictionaries, the exported `./icon` resource, and the
 * manifest's `files` list. `readPluginMeta` (dsh-app-boot) resolves each
 * specifier through the Node ESM resolver, so a missing export, a malformed
 * dictionary, or a resource left out of the published tarball degrades the row
 * to a package-name fallback and generic artwork with no error at runtime.
 *
 * This smoke asserts the contract for the artifacts this repo ships:
 *  - `locale/en.json` exists and every sibling `.json` uses a language-id
 *    filename, shares the English directory, and carries non-empty
 *    `meta.title`/`meta.description`;
 *  - `./icon` resolves to an accepted image inside the package, within the
 *    256 KiB limit, drawing the same whale the plugin puts in the sidebar;
 *  - `files` (what npm packs) and `exports` (what the resolver sees) both carry
 *    the icon and every dictionary;
 *  - the runtime exports the loader depends on are untouched.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Harness rule: locale filenames are language ids (`en`, `zh`, `pt-BR`). */
const LANGUAGE_ID = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/u
/** Harness rule: icons are SVG, PNG, JPEG, or WebP up to 256 KiB. */
const ICON_MEDIA_TYPES = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp'])
const MAX_ICON_BYTES = 256 * 1024

const assert = (condition, message) => {
  if (!condition) throw new Error('assertion failed: ' + message)
}

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const packageRoot = fileURLToPath(new URL('..', import.meta.url))

/** Resolve one exported specifier the way the Harness resolver does. */
const resolveInPackage = (specifier) => {
  let url
  try {
    url = import.meta.resolve(`${manifest.name}/${specifier}`)
  } catch (cause) {
    throw new Error(`exports["${specifier}"] does not resolve: ${cause.message}`)
  }
  const file = fileURLToPath(url)
  const local = relative(packageRoot, file)
  assert(!isAbsolute(local) && local !== '..' && !local.startsWith(`..${sep}`), `${specifier} must resolve inside the package, got ${file}`)
  return file
}

// 1. Dictionaries: English exists, every sibling is a language id with display text.
const english = resolveInPackage('locale/en.json')
const localeDirectory = dirname(english)
const languages = new Map()
for (const entry of readdirSync(localeDirectory, { withFileTypes: true })) {
  if (!entry.name.endsWith('.json')) continue
  const language = entry.name.slice(0, -5)
  assert(LANGUAGE_ID.test(language), `${entry.name} must use a language id as its filename`)
  assert(!languages.has(language), `locale/${entry.name} duplicates language ${language}`)
  const file = resolveInPackage(`locale/${entry.name}`)
  assert(dirname(file) === localeDirectory, `locale/${entry.name} must share the English locale directory`)
  const parsed = JSON.parse(readFileSync(file, 'utf8'))
  const title = parsed?.meta?.title
  const description = parsed?.meta?.description
  assert(typeof title === 'string' && title.trim() !== '', `locale/${entry.name}: meta.title must be a non-empty string`)
  assert(typeof description === 'string' && description.trim() !== '', `locale/${entry.name}: meta.description must be a non-empty string`)
  languages.set(language, { title, description })
}
assert(languages.has('en'), 'locale/en.json (the dictionary the Harness reads first) must exist')
assert(languages.has('zh'), 'locale/zh.json must ship for the plugin\'s Chinese audience')

// 2. Icon: an accepted image inside the package, drawing the sidebar whale.
const icon = resolveInPackage('icon')
const extension = extname(icon).toLowerCase()
assert(ICON_MEDIA_TYPES.has(extension), `icon.svg must be SVG, PNG, JPEG, or WebP, got ${extension}`)
const iconBytes = statSync(icon).size
assert(iconBytes <= MAX_ICON_BYTES, `the icon must stay within 256 KiB, got ${iconBytes} bytes`)
const iconText = readFileSync(icon, 'utf8')
assert(iconText.includes('<svg') && iconText.includes('<path'), 'the icon must be a rendered SVG image, not an empty or placeholder file')

// The icon and the sidebar mark are one artwork: the occupant's whale path.
const brandSource = readFileSync(new URL('../src/client/brand.tsx', import.meta.url), 'utf8')
const whalePath = brandSource.match(/const WHALE_PATH =\s*\n?\s*'([^']+)'/)?.[1]
assert(whalePath !== undefined, 'src/client/brand.tsx should declare the whale path')
assert(iconText.includes(whalePath), 'the icon must draw the same whale mark the sidebar occupant renders')

// 3. Packaging: both the tarball (`files`) and the resolver (`exports`) carry them.
const files = manifest.files ?? []
assert(files.includes('icon.svg'), 'package.json files must ship icon.svg')
assert(files.includes('locale/*.json'), 'package.json files must ship locale/*.json')
assert(manifest.exports?.['./icon'] === './icon.svg', 'package.json must export ./icon')
assert(manifest.exports?.['./locale/*.json'] === './locale/*.json', 'package.json must export ./locale/*.json')

// 4. The loader contract the plugin already shipped with stays intact.
assert(manifest.exports?.['.']?.default === './lib/index.js', 'the host half must stay exported at "."')
assert(manifest.exports?.['./client']?.default === './lib/client.js', 'the browser half must stay exported at "./client"')
assert(manifest.exports?.['./cordis.patch.yml'] === './cordis.patch.yml', 'the bundle patch must stay exported')
assert(files.includes('cordis.patch.yml'), 'package.json files must ship cordis.patch.yml')

console.log(`METADATA SMOKE OK (${[...languages.keys()].join(', ')}; icon ${(iconBytes / 1024).toFixed(1)} KiB)`)
