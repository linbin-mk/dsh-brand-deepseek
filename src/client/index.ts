/**
 * dsh-brand-deepseek client half: sidebar brand override plus its settings
 * page.
 *
 * Feature 1 (brand override): fills the `sidebar.brand.mark` and
 * `sidebar.brand.name` slots with the official DeepSeek logo (whale mark +
 * wordmark). The brand fill follows the plugin-managed color variable
 * (`--dsh-brand-deepseek-color`, official DeepSeek blue by default).
 *
 * Feature 2 (hero headline): while the "会话页标题" toggle is on, the
 * blank-session hero (the title row above the chat box) becomes the DeepSeek
 * brand headline — whale mark + 想从哪里开始? — replacing the official
 * default (fish mark + 探索未至之境 + 预览版 badge) through the shipped
 * `conversation.hero.brand.mark` slot plus an injected sheet (see hero.tsx).
 *
 * Feature 3 (settings page): registers a `settings.section` navigation entry
 * inside the Settings panel (bottom left), modeled on the workspace-prompt
 * plugin. The page offers:
 *  - a custom-style toggle — off unregisters the brand slots entirely, so the
 *    shell fallback (official default brand, `DSH Local Build`) renders;
 *  - a "会话页标题" toggle — controls the DeepSeek hero headline independently;
 *  - two harness-chrome toggles — the 轨迹 / Trajectory view tab and the
 *    Session 日志 / Session log header button, hidden and re-shown in the DOM
 *    (see visibility.ts; no harness source touched);
 *  - ten selectable brand colors (the current scheme is the default). All
 *    settings persist through the Host settings RPC (`dsh-brand-deepseek`
 *    namespace) and apply immediately.
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { ClientRemote } from '@deepseek-ai/dsh-api-remotes/client'
import type { SettingsPathOpView } from '@deepseek-ai/dsh-settings/types'
// Type-only: the settings slot declarations (`settings.section`) and the locale
// Context merge (`ctx.locale.bind`). Cross-plugin collaboration goes through
// the service, never a value import (client bundle purity gate).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
// Type-only: pulls the `ctx.remote` (remotes) and `ctx.slots` (ui-renderer)
// Context merges into this program, and the conversation hero slot declarations
// (`conversation.hero.brand.mark`) into the slot registry's key domain.
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { BrandMark, BrandName } from './brand'
import { HERO_CSS, HeroHeadlineMark } from './hero'
import { BrandStyleSection, type BrandStyleSectionInjected } from './BrandStyleSection'
import { brandStyle, DEFAULT_BRAND_COLOR } from './stores'
import type { PersistedBrandStyle } from './stores'
import { createVisibilityController } from './visibility'
import { en, zh, type BrandStyleKey } from './locales'

export const inject = ['slots', 'remote', 'remote.settings', 'locale']

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    'dsh-brand-deepseek': BrandStyleKey
  }
}

/** Settings namespace holding the persisted brand style. */
const NAMESPACE = 'dsh-brand-deepseek'

/** Document-root color variable the brand SVGs fill from. */
const COLOR_VAR = '--dsh-brand-deepseek-color'

/** DOM id of the injected hero-headline sheet. */
const HERO_STYLE_ID = 'dsh-brand-deepseek-hero-style'

/** The settings Remote face the plugin reads and writes through. */
type SettingsApi = ClientRemote['settings']

/** Read the persisted brand style; the defaults keep today's look. */
function defaultsOf(stored: unknown): PersistedBrandStyle {
  const value = (stored ?? {}) as {
    enabled?: unknown
    hero?: unknown
    trajectoryTab?: unknown
    sessionLogButton?: unknown
    color?: unknown
  }
  return {
    enabled: typeof value.enabled === 'boolean' ? value.enabled : true,
    hero: typeof value.hero === 'boolean' ? value.hero : true,
    trajectoryTab: typeof value.trajectoryTab === 'boolean' ? value.trajectoryTab : true,
    sessionLogButton: typeof value.sessionLogButton === 'boolean' ? value.sessionLogButton : true,
    color: typeof value.color === 'string' && value.color.length > 0 ? value.color : DEFAULT_BRAND_COLOR,
  }
}

/**
 * Client plugin body: locale dictionaries, the persisted brand-style wiring
 * (brand slot registration + color variable), and the settings page entry.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register('dsh-brand-deepseek', { zh, en }), 'dsh-brand-deepseek: dictionaries')

  const api = ctx.remote.settings
  const t = ctx.locale.bind('dsh-brand-deepseek')

  // The brand slot contribution, installable/removable at runtime so the
  // settings toggle can hand the sidebar back to the official default brand.
  let brandDispose: (() => void) | undefined
  const installBrand = (): void => {
    if (brandDispose !== undefined) return
    brandDispose = ctx.slots.inject('sidebar.brand.mark', () =>
      ctx.slots.inject('sidebar.brand.name', function* () {
        yield ctx.slots.register({ name: 'sidebar.brand.mark' }, BrandMark)
        yield ctx.slots.register({ name: 'sidebar.brand.name' }, BrandName)
      }))
  }
  const uninstallBrand = (): void => {
    brandDispose?.()
    brandDispose = undefined
  }

  // The hero-headline contribution: the shipped hero brand-mark slot occupant
  // (whale + title) plus the sheet that hides the official headline/badge and
  // centers the new row. Installable/removable at runtime like the brand.
  let heroDispose: (() => void) | undefined
  const installHero = (): void => {
    if (heroDispose !== undefined) return
    heroDispose = ctx.slots.inject('conversation.hero.brand.mark', () =>
      ctx.slots.register({
        name: 'conversation.hero.brand.mark',
        locale: 'dsh-brand-deepseek',
      }, HeroHeadlineMark))
  }
  const uninstallHero = (): void => {
    heroDispose?.()
    heroDispose = undefined
  }

  /** Mount/remove the sheet rewriting the hero headline row (feature on/off). */
  const applyHeroStyle = (on: boolean): void => {
    if (typeof document === 'undefined') return
    const existing = document.getElementById(HERO_STYLE_ID)
    if (on) {
      if (existing === null) {
        const tag = document.createElement('style')
        tag.id = HERO_STYLE_ID
        tag.textContent = HERO_CSS
        document.head.appendChild(tag)
      }
    } else {
      existing?.remove()
    }
  }

  /** Point the brand SVGs at the selected color. */
  const applyBrandColor = (color: string): void => {
    if (typeof document === 'undefined') return
    document.documentElement.style.setProperty(COLOR_VAR, color)
  }

  // Show/hide of two pieces of harness chrome (轨迹 view tab, Session 日志
  // button) — pure DOM, installed by this plugin without harness edits.
  const visibility = createVisibilityController()
  visibility.start()

  /** Reconcile the runtime with one persisted style (idempotent). */
  const applyState = (state: PersistedBrandStyle): void => {
    if (state.enabled) installBrand()
    else uninstallBrand()
    if (state.hero) installHero()
    else uninstallHero()
    applyHeroStyle(state.hero)
    applyBrandColor(state.color)
    visibility.setTrajectoryTab(state.trajectoryTab)
    visibility.setSessionLogButton(state.sessionLogButton)
  }

  const readPersisted = async (): Promise<PersistedBrandStyle> => {
    const response = await api.describe()
    if (!response.ok) throw new Error(response.error.message)
    const namespace = response.value.namespaces.find(view => view.ns === NAMESPACE)
    return defaultsOf(namespace?.value)
  }

  const mutate = async (ops: SettingsPathOpView[]): Promise<void> => {
    const response = await api.mutate(NAMESPACE, ops, undefined)
    if (!response.ok) {
      throw new Error(response.error.message)
    }
  }

  const currentOf = (): PersistedBrandStyle => {
    const current = brandStyle.getSnapshot()
    return {
      enabled: current.enabled,
      hero: current.hero,
      trajectoryTab: current.trajectoryTab,
      sessionLogButton: current.sessionLogButton,
      color: current.color,
    }
  }

  brandStyle.handlers = {
    load: async () => {
      const state = await readPersisted()
      applyState(state)
      return state
    },
    setEnabled: async (enabled) => {
      await mutate([{ op: 'set', path: ['enabled'], value: enabled }])
      applyState({ ...currentOf(), enabled })
    },
    setHero: async (hero) => {
      await mutate([{ op: 'set', path: ['hero'], value: hero }])
      applyState({ ...currentOf(), hero })
    },
    setTrajectoryTab: async (trajectoryTab) => {
      await mutate([{ op: 'set', path: ['trajectoryTab'], value: trajectoryTab }])
      applyState({ ...currentOf(), trajectoryTab })
    },
    setSessionLogButton: async (sessionLogButton) => {
      await mutate([{ op: 'set', path: ['sessionLogButton'], value: sessionLogButton }])
      applyState({ ...currentOf(), sessionLogButton })
    },
    setColor: async (color) => {
      await mutate([{ op: 'set', path: ['color'], value: color }])
      applyState({ ...currentOf(), color })
    },
  }

  // Apply the persisted style at activation (default: DeepSeek brand on).
  void brandStyle.refresh()

  // Drop the color variable, the hero sheet, and the chrome hider when the
  // plugin unloads.
  ctx.effect(() => () => {
    visibility.dispose()
    if (typeof document === 'undefined') return
    document.documentElement.style.removeProperty(COLOR_VAR)
    document.getElementById(HERO_STYLE_ID)?.remove()
  }, 'dsh-brand-deepseek: style cleanup')

  // Settings navigation row: `settings.section` is declared by the settings
  // shell (ui-settings-general, shipped with the web app), so this registration
  // adds one more page to the settings panel without touching shell code.
  const sectionInjected: BrandStyleSectionInjected = {
    hooks: { brandStyle },
    refresh: () => brandStyle.refresh(),
    setEnabled: (enabled) => brandStyle.setEnabled(enabled),
    setHero: (hero) => brandStyle.setHero(hero),
    setTrajectoryTab: (visible) => brandStyle.setTrajectoryTab(visible),
    setSessionLogButton: (visible) => brandStyle.setSessionLogButton(visible),
    setColor: (color) => brandStyle.setColor(color),
  }
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'brand-deepseek',
    order: 17,
    label: () => t('settings.nav'),
    locale: 'dsh-brand-deepseek',
    inject: () => sectionInjected,
  }, BrandStyleSection))
}
