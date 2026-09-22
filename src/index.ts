/**
 * dsh-brand-deepseek host half.
 *
 * The browser presentation ships through `exports["./client"]`. This host half
 * declares the plugin's Cordis Config — whose loader entry id
 * (`brand-deepseek`) is the settings namespace the browser half addresses
 * through `ctx.configForms` — and keeps the sidebar Plugins list from
 * auto-generating a second page for a plugin that already ships its own
 * Settings section.
 */

import type { Context, Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
// Type-only: the `ctx.settings` Context merge (`SettingsForms.configure`).
import type {} from '@deepseek-ai/dsh-settings'
import type { BrandStyleSettings } from './settings'

/**
 * Live brand-style configuration: the {@link BrandStyleSettings} document with
 * every field as a live reference, so the Settings page edits it without a
 * plugin reload.
 */
export type Config = { [K in keyof BrandStyleSettings]: Volatile<BrandStyleSettings[K]> }

/** Config schema; the defaults match the plugin's shipped look. */
export const Config = z.object({
  enabled: z.boolean().default(true).volatile(),
  hero: z.boolean().default(true).volatile(),
  trajectoryTab: z.boolean().default(true).volatile(),
  sessionLogButton: z.boolean().default(true).volatile(),
  color: z.string().default('#4176e6').volatile(),
})

/**
 * Host plugin body: declare this instance's settings presentation. The client
 * ships the Settings page, so the registry generates none of its own.
 * @param ctx - host plugin context.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (child) => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber))
  })
}
