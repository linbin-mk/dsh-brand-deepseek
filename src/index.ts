/**
 * dsh-brand-deepseek host half.
 *
 * The browser presentation ships through `exports["./client"]`; this host
 * apply registers the `dsh-brand-deepseek` settings namespace so the client
 * half's `settings.describe`/`settings.mutate` RPC calls are accepted and
 * persisted (the client owns the actual read/write of the brand style).
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type { SettingsNamespace } from '@deepseek-ai/dsh-settings'

export const inject = ['settings']

/** Settings namespace holding the persisted brand style. */
const NS = 'dsh-brand-deepseek' as SettingsNamespace

/** Persisted brand-style document shape (defaults match the current look). */
interface BrandStyleConfig {
  enabled: boolean
  hero: boolean
  trajectoryTab: boolean
  sessionLogButton: boolean
  color: string
}

/** Host plugin body — registers the namespace, nothing else. */
export function apply(ctx: Context): void {
  ctx.effect(() => {
    const scope = ctx.settings.register<BrandStyleConfig>(NS, z.object({
      enabled: z.boolean().default(true),
      hero: z.boolean().default(true),
      trajectoryTab: z.boolean().default(true),
      sessionLogButton: z.boolean().default(true),
      color: z.string().default('#4176e6'),
    }), {
      base: {
        enabled: true,
        hero: true,
        trajectoryTab: true,
        sessionLogButton: true,
        color: '#4176e6',
      },
    })
    // The registration is an effect on this fiber; the returned scope merely
    // pins the composition so the closure stays alive for the plugin lifetime.
    return () => { void scope }
  }, 'dsh-brand-deepseek: settings namespace')
}
