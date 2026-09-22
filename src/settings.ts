/**
 * Brand-style configuration shared by the plugin's two faces.
 *
 * The host half declares its Cordis Config as the volatile projection of this
 * shape, and the loader row id becomes the settings namespace; the client half
 * addresses that entry's live form through {@link BRAND_DEEPSEEK_ENTRY_ID}.
 * The module carries no imports of its own, so the client bundle inlines
 * declarations plus one string constant and nothing else.
 */

/** Loader entry id (`cordis.patch.yml`) owning the brand-style settings. */
export const BRAND_DEEPSEEK_ENTRY_ID = 'brand-deepseek'

/** Durable brand-style document the settings page edits. */
export interface BrandStyleSettings {
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
}
