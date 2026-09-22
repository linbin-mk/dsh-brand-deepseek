/**
 * Blank-session hero headline (the title row above the chat box) in the
 * DeepSeek brand look: whale mark + "想从哪里开始?".
 *
 * The harness ships one hero hook — the `conversation.hero.brand.mark` slot —
 * whose official default fallback is the fish mark + the localized headline
 * ("探索未至之境") + the 预览版 badge. The DeepSeek look needs three things
 * that slot alone cannot express:
 *  - the whale mark in the brand color (this occupant provides it);
 *  - the replacement title text (this occupant provides it too);
 *  - hiding the default title/badge and centering the new row in the slot's
 *    place (the injected {@link HERO_CSS} does it).
 *
 * The sheet targets the shipped ui-conversation CSS-module classes by their
 * stable `<hash>_<local>` shape and is scoped to the Conversation shell's
 * composer seat (`[data-composer-seat]`, the hero's mounting parent), so the
 * shared `.headline` locals of other modules (ContextMeter, ApprovalPanel)
 * are never touched. It is installed exactly while the feature is on — a
 * future harness that renames the locals degrades to the official headline
 * (with the whale + title still rendered) instead of breaking.
 */

import type { HeroBrandMarkOwnerProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { BrandMark } from './brand'

/** Composed props of the hero-headline mark occupant. */
export type HeroHeadlineMarkProps = HeroBrandMarkOwnerProps & PropsLocale<'dsh-brand-deepseek'>

/**
 * Sheet turning the hosted hero headline row into the DeepSeek look while the
 * feature is on: the row drops its fixed 34px/auto/auto grid for a centered
 * flex row, the default text spans hide, and the mark slot's hitbox box
 * dissolves so the occupant's whale + title flow directly into the row.
 * The container rule anchors on the hitbox (`:has([class*='_fishHitbox'])`),
 * the hero-headline row's own unique descendant, so the shared `.headline`
 * locals of other modules (ContextMeter, ApprovalPanel — which also render
 * inside the composer seat during a takeover) are never touched.
 *
 * The default title is hidden through every local it has shipped under: the
 * dedicated `_headlineText` span of 0.1.5-rc.1 and the `_titleGroup` wrapper
 * (title + badge) that replaced it in 0.1.5-rc.2. Each selector is a no-op on
 * the harness versions that never had that local, so both stay listed.
 */
export const HERO_CSS = `
[data-composer-seat] [class*='_headlineText'],
[data-composer-seat] [class*='_titleGroup'],
[data-composer-seat] [class*='_previewBadge'] {
  display: none;
}
[data-composer-seat] [class*='_headline']:has([class*='_fishHitbox']) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
[data-composer-seat] [class*='_fishHitbox'] {
  display: contents;
}
`

/** Title style mirroring the hosted hero headline (26/32 wt500 inherited). */
const TITLE_STYLE = {
  fontSize: 26,
  lineHeight: '32px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  color: 'var(--dsw-alias-label-primary)',
} as const

/**
 * The official DeepSeek hero headline occupant: the whale mark (brand color)
 * followed by the brand title, centered by {@link HERO_CSS}.
 * @param props - host request mark size/class plus the injected locale seat.
 * @returns the whale + title row fragment.
 */
export function HeroHeadlineMark({ size, className, t }: HeroHeadlineMarkProps) {
  return (
    <>
      <BrandMark size={size} className={className} />
      <span style={TITLE_STYLE}>{t('hero.title')}</span>
    </>
  )
}
