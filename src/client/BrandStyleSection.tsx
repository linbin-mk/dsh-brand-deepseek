/**
 * Settings page for the dsh-brand-deepseek plugin: the custom brand style.
 *
 * Registered by the client plugin body as a `settings.section` contribution,
 * so it appears as its own navigation row inside the Settings panel (bottom
 * left). The page offers:
 *  - a custom-style toggle — off restores the official default brand (the
 *    plugin stops overriding the sidebar brand slots, so the shell fallback
 *    renders);
 *  - a 会话页标题 toggle — independently switches the blank-session hero
 *    headline between the DeepSeek brand title (whale + 想从哪里开始?) and
 *    the official default (探索未至之境 + 预览版 badge);
 *  - 轨迹页签 and Session 日志按钮 toggles — show/hide two pieces of harness
 *    chrome (the trajectory view tab and the session-log header button),
 *    implemented at the DOM level only, never touching harness source;
 *  - ten selectable brand colors (the current scheme — official DeepSeek
 *    blue — is the default). Choosing one applies and persists immediately.
 *
 * The official default brand preview mirrors the current shell fallback
 * (ui-sidebar): fish mark + localized local-build label + the build-version
 * badge, stacked like the sidebar. The build version is a build-time define
 * with no client runtime API, so the preview reads the badge the sidebar
 * itself renders (custom style off leaves the fallback in the DOM); when it
 * is not present (collapsed sidebar, older harness), the preview degrades to
 * the label alone. The hero headline preview mirrors both hero states below
 * the sidebar preview.
 *
 * The page remounts on every visit (the settings shell renders only the
 * active section), so it always starts from a fresh adoption of the accepted
 * Config section. Writes go through the plugin's Config form, owned by the
 * apply half; every control is disabled while a write is in flight and when
 * the Host document cannot accept writes from this page (a non-loopback page
 * keeps no durable settings).
 */

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { FishLogo } from '@deepseek-ai/dsh-client-ui-primitives'
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { BrandMark, BrandName } from './brand'
import { BRAND_COLORS } from './stores'
import type { BrandStyleState } from './stores'

/**
 * The sidebar's local-build badge format (ui-sidebar `localBuildVersion()`):
 * `<version>-<commit7>` optionally `-dirty`, e.g. `0.1.2-alpha.1-cd5ef81`.
 */
const LOCAL_BUILD_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?-[0-9a-f]{7,40}(?:-dirty)?$/

/**
 * Read the build-version badge the sidebar's official default brand renders.
 * The string is the exact badge text (version + commit) shown when the
 * custom style is off; undefined when the fallback is not in the document.
 */
function readDefaultBuildVersion(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    const text = (node.nodeValue ?? '').trim()
    if (LOCAL_BUILD_VERSION_PATTERN.test(text)) return text
  }
  return undefined
}

/** Registrant-side business face for the brand-style settings page. */
export interface BrandStyleSectionInjected {
  hooks: { brandStyle: HostObservable<BrandStyleState> }
  /** Reload the persisted style (and re-apply it). */
  refresh: () => Promise<void>
  /** Persist and apply the custom-style toggle. */
  setEnabled: (enabled: boolean) => Promise<void>
  /** Persist and apply the hero-headline toggle. */
  setHero: (hero: boolean) => Promise<void>
  /** Persist and apply the trajectory-tab show/hide toggle. */
  setTrajectoryTab: (visible: boolean) => Promise<void>
  /** Persist and apply the session-log-button show/hide toggle. */
  setSessionLogButton: (visible: boolean) => Promise<void>
  /** Persist and apply the selected brand color. */
  setColor: (color: string) => Promise<void>
}

/** Component props composed by the slot machinery for the section entry. */
export type BrandStyleSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'dsh-brand-deepseek'>
  & InjectFace<BrandStyleSectionInjected>

/** Shared card chrome (design tokens with neutral fallbacks). */
const card: CSSProperties = {
  border: '1px solid var(--dsw-alias-border-l2, #d0d5dd)',
  borderRadius: 8,
  padding: 14,
  marginTop: 14,
}

const title: CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
  color: 'var(--dsw-alias-label-primary, #101828)',
}

const hint: CSSProperties = {
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--dsw-alias-label-secondary, #475467)',
  marginTop: 4,
}

/**
 * The shell's official default brand (ui-sidebar `.localBuildBrand` /
 * `.localBuildTitle` / `.buildVersion`): stacked label + version badge,
 * height-matched to the fish mark.
 */
const defaultBrandStack: CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: 1,
  height: 24,
  whiteSpace: 'nowrap',
}

const defaultBrandTitle: CSSProperties = {
  fontSize: 12,
  lineHeight: '13px',
  fontWeight: 600,
  letterSpacing: 0,
  color: 'var(--dsw-alias-label-primary, #101828)',
}

const defaultBuildVersion: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 10,
  padding: '0 3px',
  borderRadius: 2,
  color: 'var(--dsw-alias-label-primary-inverted, #ffffff)',
  background: 'var(--dsw-alias-label-primary, #101828)',
  fontFamily: 'var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace)',
  fontSize: 6,
  fontWeight: 500,
  lineHeight: '10px',
  whiteSpace: 'nowrap',
}

/** The official default hero title/badge chrome (mirrored from HeroShell). */
const heroTitleDefault: CSSProperties = {
  fontSize: 26,
  lineHeight: '32px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  color: 'var(--dsw-alias-label-primary, #101828)',
}

/** DeepSeek brand hero title (the toggle-on look). */
const heroTitleBrand: CSSProperties = {
  ...heroTitleDefault,
  fontWeight: 600,
}

/** The official 预览版 pill (mirrored from HeroShell `.previewBadge`). */
const heroBadge: CSSProperties = {
  padding: '1px 7px 0',
  border: '1px solid var(--dsw-alias-interactive-bg-hover, #e4e7ec)',
  borderRadius: 24,
  background: 'var(--dsw-alias-state-business-tertiary, #eef2ff)',
  color: 'var(--dsw-alias-label-primary-bluish, #2e4fd8)',
  fontFamily: 'var(--ds-font-family-code, ui-monospace, SFMono-Regular, Menlo, monospace)',
  fontSize: 12,
  lineHeight: '18px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

/** Toggle track + knob, mirroring the design language's switch look. */
function Switch({ checked, disabled, onToggle }: {
  checked: boolean
  disabled: boolean
  onToggle: () => void
}): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      style={{
        position: 'relative',
        width: 40,
        height: 22,
        borderRadius: 11,
        border: 'none',
        cursor: disabled ? 'default' : 'pointer',
        flexShrink: 0,
        background: checked
          ? 'var(--dsw-alias-button-info-fill, #4176e6)'
          : 'var(--dsw-alias-border-l4, #98a2b3)',
        transition: 'background 0.15s ease',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: 9,
          background: '#ffffff',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
          transition: 'left 0.15s ease',
        }}
      />
    </button>
  )
}

/**
 * Render the brand-style settings page.
 * @param props - composed slot props (client plugin registration).
 * @returns the page element tree.
 */
export function BrandStyleSection({
  useBrandStyle, refresh, setEnabled, setHero, setTrajectoryTab, setSessionLogButton, setColor, t,
}: BrandStyleSectionProps): JSX.Element {
  const state = useBrandStyle(value => value)

  // The section mounts on each visit to the settings page: start from a fresh read.
  useEffect(() => { void refresh() }, [refresh])

  // Version badge of the official default brand (ui-sidebar renders it only
  // in the DOM while the custom style is off). Read after commit — the
  // sidebar fallback re-renders in the same pass as this toggle — with a
  // short retry for safety; degrade to the label alone when absent.
  const [defaultVersion, setDefaultVersion] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (state.enabled) {
      setDefaultVersion(undefined)
      return
    }
    let cancelled = false
    const read = (): void => { if (!cancelled) setDefaultVersion(readDefaultBuildVersion()) }
    read()
    const timer = window.setTimeout(read, 50)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [state.enabled])

  const disabled = state.busy || !state.writable

  return (
    <div>
      <h2>{t('settings.title')}</h2>
      <p>{t('settings.intro')}</p>

      {state.error !== null && (
        <div role="alert" style={{ color: 'var(--dsw-alias-fg-danger, #c0392b)', marginTop: 12 }}>
          {t('settings.error').replace('{message}', state.error)}
        </div>
      )}

      {/* Custom-style toggle. */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={title}>{t('settings.enabled.label')}</div>
            <div style={hint}>{t('settings.enabled.hint')}</div>
          </div>
          <Switch
            checked={state.enabled}
            disabled={disabled}
            onToggle={() => { void setEnabled(!state.enabled) }}
          />
        </div>
      </div>

      {/* Hero-headline toggle (independent of the custom-style master). */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={title}>{t('settings.hero.label')}</div>
            <div style={hint}>{t('settings.hero.hint')}</div>
          </div>
          <Switch
            checked={state.hero}
            disabled={disabled}
            onToggle={() => { void setHero(!state.hero) }}
          />
        </div>
      </div>

      {/* 轨迹 view tab show/hide (harness chrome, DOM-level only). */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={title}>{t('settings.trajectoryTab.label')}</div>
            <div style={hint}>{t('settings.trajectoryTab.hint')}</div>
          </div>
          <Switch
            checked={state.trajectoryTab}
            disabled={disabled}
            onToggle={() => { void setTrajectoryTab(!state.trajectoryTab) }}
          />
        </div>
      </div>

      {/* Session 日志 button show/hide (harness chrome, DOM-level only). */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={title}>{t('settings.sessionLogButton.label')}</div>
            <div style={hint}>{t('settings.sessionLogButton.hint')}</div>
          </div>
          <Switch
            checked={state.sessionLogButton}
            disabled={disabled}
            onToggle={() => { void setSessionLogButton(!state.sessionLogButton) }}
          />
        </div>
      </div>

      {/* The 10 color choices (only meaningful while the custom style is on). */}
      <div style={{ ...card, opacity: state.enabled ? 1 : 0.55 }}>
        <div style={title}>{t('settings.colors.label')}</div>
        <div style={hint}>{t('settings.colors.hint')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
          {BRAND_COLORS.map(option => {
            const selected = state.enabled && state.color.toLowerCase() === option.value.toLowerCase()
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                aria-label={t(option.nameKey)}
                disabled={disabled || !state.enabled}
                onClick={() => { void setColor(option.value) }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  width: 64,
                  padding: '6px 2px',
                  border: 'none',
                  borderRadius: 8,
                  background: selected ? 'var(--dsw-alias-interactive-bg-active, rgba(0,0,0,0.06))' : 'transparent',
                  cursor: disabled || !state.enabled ? 'default' : 'pointer',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: option.value,
                    color: '#ffffff',
                    fontSize: 15,
                    boxShadow: selected
                      ? `0 0 0 2px var(--dsw-alias-bg-overlay, #ffffff), 0 0 0 4px ${option.value}`
                      : '0 0 0 1px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  {selected ? '✓' : ''}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    lineHeight: 1.3,
                    textAlign: 'center',
                    color: 'var(--dsw-alias-label-secondary, #475467)',
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {t(option.nameKey)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Live preview of the sidebar brand and the hero headline. */}
      <div style={card}>
        <div style={title}>{t('settings.preview.label')}</div>
        <div style={hint}>
          {state.enabled ? t('settings.preview.on') : t('settings.preview.off')}
        </div>
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 12,
            minHeight: 32,
          }}
        >
          {state.enabled
            ? (
              <>
                <BrandMark size={24} />
                <BrandName size={22} />
              </>
            )
            : (
              <>
                <FishLogo size={24} />
                <span style={defaultBrandStack}>
                  <span style={defaultBrandTitle}>{t('brand.localBuild')}</span>
                  {defaultVersion !== undefined && (
                    <span style={defaultBuildVersion}>{defaultVersion}</span>
                  )}
                </span>
              </>
            )}
        </div>

        {/* Hero headline: the DeepSeek brand title (whale + 想从哪里开始?) or
            the official default (fish + 探索未至之境 + 预览版 pill). */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid var(--dsw-alias-border-l2, #d0d5dd)',
          }}
        >
          <div
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: 'var(--dsw-alias-label-secondary, #475467)',
              marginBottom: 8,
            }}
          >
            {t('settings.preview.hero.label')}
          </div>
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              minHeight: 40,
            }}
          >
            {state.hero
              ? (
                <>
                  <BrandMark size={34} />
                  <span style={heroTitleBrand}>{t('hero.title')}</span>
                </>
              )
              : (
                <>
                  <FishLogo size={34} />
                  <span style={heroTitleDefault}>{t('brand.heroDefaultTitle')}</span>
                  <span style={heroBadge}>{t('brand.heroDefaultBadge')}</span>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
