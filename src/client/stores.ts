/** Live state and the shared observable of the brand-style settings page. */

import type { BrandStyleKey } from './locales'

/**
 * Current (default) brand color: the official DeepSeek blue. Persisted style
 * falls back to it, and it is the pre-selected palette option.
 */
export const DEFAULT_BRAND_COLOR = '#4176e6'

/** One selectable brand color on the Settings → 品牌样式 page. */
export interface BrandColorOption {
  /** Stable option id (also the settings-stored hex value). */
  id: string
  /** Hex color applied to the brand mark and wordmark. */
  value: string
  /** Locale key of the display name. */
  nameKey: BrandStyleKey
}

/** The 10 selectable brand colors; the first is the current scheme (default). */
export const BRAND_COLORS: readonly BrandColorOption[] = [
  { id: 'official', value: '#4176e6', nameKey: 'color.official' },
  { id: 'deep', value: '#1d4ed8', nameKey: 'color.deep' },
  { id: 'sky', value: '#0ea5e9', nameKey: 'color.sky' },
  { id: 'emerald', value: '#10b981', nameKey: 'color.emerald' },
  { id: 'teal', value: '#0d9488', nameKey: 'color.teal' },
  { id: 'amber', value: '#f59e0b', nameKey: 'color.amber' },
  { id: 'orange', value: '#f97316', nameKey: 'color.orange' },
  { id: 'pink', value: '#ec4899', nameKey: 'color.pink' },
  { id: 'violet', value: '#8b5cf6', nameKey: 'color.violet' },
  { id: 'graphite', value: '#1f2937', nameKey: 'color.graphite' },
]

/** Live state of the brand-style settings page and of the applied style. */
export interface BrandStyleState {
  /** Whether the custom brand style (DeepSeek brand) is applied. */
  enabled: boolean
  /** Whether the blank-session hero headline uses the DeepSeek brand look. */
  hero: boolean
  /** Whether the 轨迹 / Trajectory conversation view tab is shown. */
  trajectoryTab: boolean
  /** Whether the Session 日志 / Session log header button is shown. */
  sessionLogButton: boolean
  /** Currently selected brand color (hex). */
  color: string
  /** Whether a read or write operation is in flight. */
  busy: boolean
  /** Error message of the last failed operation, if any. */
  error: string | null
}

/** Persisted brand-style view. */
export interface PersistedBrandStyle {
  enabled: boolean
  hero: boolean
  trajectoryTab: boolean
  sessionLogButton: boolean
  color: string
}

/** Data verbs for the settings page, owned by the plugin apply (holds ctx). */
export interface BrandStyleHandlers {
  /** Read the persisted style and apply its side effects (slots + color). */
  load: () => Promise<PersistedBrandStyle>
  /** Persist the enabled flag, then apply its side effects. */
  setEnabled: (enabled: boolean) => Promise<void>
  /** Persist the hero-headline flag, then apply its side effects. */
  setHero: (hero: boolean) => Promise<void>
  /** Persist the trajectory-tab flag, then apply its side effects. */
  setTrajectoryTab: (visible: boolean) => Promise<void>
  /** Persist the session-log flag, then apply its side effects. */
  setSessionLogButton: (visible: boolean) => Promise<void>
  /** Persist the color, then apply its side effects. */
  setColor: (color: string) => Promise<void>
}

function messageOf(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}

/**
 * Module-level observable backing the Settings → 品牌样式 page, mirroring the
 * workspace-prompt plugin's pattern: `settings.section` renders through the
 * root-scoped slot machinery, so the apply half (which owns `ctx`) writes the
 * read/write handlers here and the section reads state via React's
 * {@link useSyncExternalStore}.
 */
export class BrandStyleObservable {
  private readonly listeners = new Set<() => void>()
  private state: BrandStyleState = {
    enabled: true,
    hero: true,
    trajectoryTab: true,
    sessionLogButton: true,
    color: DEFAULT_BRAND_COLOR,
    busy: false,
    error: null,
  }
  /** Set by the apply half at activation; undefined only before first activation. */
  handlers: BrandStyleHandlers | undefined

  getSnapshot = (): BrandStyleState => this.state

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /**
   * Reload the persisted style. The load handler also applies the side
   * effects (brand slot registration and the color variable), so both the
   * boot refresh and every page visit converge on the persisted state.
   */
  refresh = async (): Promise<void> => {
    const load = this.handlers?.load
    if (load === undefined) return
    this.state = { ...this.state, busy: true, error: null }
    this.emit()
    try {
      const { enabled, hero, trajectoryTab, sessionLogButton, color } = await load()
      this.state = {
        ...this.state,
        enabled,
        hero,
        trajectoryTab,
        sessionLogButton,
        color,
        busy: false,
        error: null,
      }
    } catch (cause) {
      this.state = { ...this.state, busy: false, error: messageOf(cause) }
    }
    this.emit()
  }

  /** Persist and apply the custom-style toggle. */
  setEnabled = async (enabled: boolean): Promise<void> => {
    const handler = this.handlers?.setEnabled
    if (handler === undefined) return
    this.state = { ...this.state, busy: true, error: null }
    this.emit()
    try {
      await handler(enabled)
      this.state = { ...this.state, enabled, busy: false, error: null }
    } catch (cause) {
      this.state = { ...this.state, busy: false, error: messageOf(cause) }
    }
    this.emit()
  }

  /** Persist and apply the hero-headline toggle. */
  setHero = async (hero: boolean): Promise<void> => {
    const handler = this.handlers?.setHero
    if (handler === undefined) return
    this.state = { ...this.state, busy: true, error: null }
    this.emit()
    try {
      await handler(hero)
      this.state = { ...this.state, hero, busy: false, error: null }
    } catch (cause) {
      this.state = { ...this.state, busy: false, error: messageOf(cause) }
    }
    this.emit()
  }

  /** Persist and apply the trajectory-tab toggle. */
  setTrajectoryTab = async (visible: boolean): Promise<void> => {
    const handler = this.handlers?.setTrajectoryTab
    if (handler === undefined) return
    this.state = { ...this.state, busy: true, error: null }
    this.emit()
    try {
      await handler(visible)
      this.state = { ...this.state, trajectoryTab: visible, busy: false, error: null }
    } catch (cause) {
      this.state = { ...this.state, busy: false, error: messageOf(cause) }
    }
    this.emit()
  }

  /** Persist and apply the session-log toggle. */
  setSessionLogButton = async (visible: boolean): Promise<void> => {
    const handler = this.handlers?.setSessionLogButton
    if (handler === undefined) return
    this.state = { ...this.state, busy: true, error: null }
    this.emit()
    try {
      await handler(visible)
      this.state = { ...this.state, sessionLogButton: visible, busy: false, error: null }
    } catch (cause) {
      this.state = { ...this.state, busy: false, error: messageOf(cause) }
    }
    this.emit()
  }

  /** Persist and apply the selected brand color. */
  setColor = async (color: string): Promise<void> => {
    const handler = this.handlers?.setColor
    if (handler === undefined) return
    this.state = { ...this.state, busy: true, error: null }
    this.emit()
    try {
      await handler(color)
      this.state = { ...this.state, color, busy: false, error: null }
    } catch (cause) {
      this.state = { ...this.state, busy: false, error: messageOf(cause) }
    }
    this.emit()
  }

  private emit(): void {
    for (const listener of this.listeners) listener()
  }
}

/** Single instance shared by the apply half (writer) and the section (reader). */
export const brandStyle = new BrandStyleObservable()
