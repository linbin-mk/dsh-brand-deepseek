/**
 * Runtime show/hide for two pieces of harness chrome the plugin controls
 * without touching harness source:
 *  - the "轨迹 / Trajectory" conversation view tab (ui-trajectory registers it
 *    as a `conversation.view` slot occupant);
 *  - the "Session 日志 / Session log" header button (ui-session-log-export's
 *    `conversation.session.header.utilities` occupant).
 *
 * Both are foreign slot occupants, and the slot registry only ever adds
 * occupants — there is no API to unregister another plugin's entry — so the
 * controller hides the rendered elements. Hiding means an inline
 * `display: none` (inline style wins over every class rule), and a
 * MutationObserver watches the document because React recreates these nodes
 * whenever the session header / view tablist remounts (session switch,
 * locale change, view change…), which would otherwise restore the element.
 *
 * Locators favor the harness CSS-module local names (`<hash>_<local>` shape,
 * stable suffix across builds) plus the localized labels as a fallback, so a
 * future harness that renames a class degrades to "the element stays
 * visible" instead of harming anything.
 */

/** Localized labels of the trajectory view tab (ui-trajectory `view.trajectory`). */
const TRAJECTORY_TAB_LABELS = new Set(['轨迹', 'Trajectory'])

/** Localized labels of the session-log button (ui-session-log-export `header.action`). */
const SESSION_LOG_LABELS = new Set(['Session 日志', 'Session log'])

/** Collapse whitespace the way rendered button text compares. */
function normalizedTextOf(element: Element): string {
  return (element.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** Buttons inside `scope` whose whole text is one of `labels`. */
function buttonsByLabel(scope: ParentNode, labels: ReadonlySet<string>): Element[] {
  const found: Element[] = []
  for (const candidate of scope.querySelectorAll('button')) {
    if (labels.has(normalizedTextOf(candidate))) found.push(candidate)
  }
  return found
}

/**
 * The trajectory view tab: the one tab button inside a tablist whose label is
 * 轨迹/Trajectory. The label is the only stable hook — the tab button shares
 * its CSS-module local (`tab`) with every other view tab, and no other
 * tablist in the app (trajectory detail tabs, settings plugins tabs, cordis
 * source tabs) carries this label.
 */
function trajectoryTabElements(): Element[] {
  const found: Element[] = []
  for (const tablist of document.querySelectorAll('[role="tablist"]')) {
    found.push(...buttonsByLabel(tablist, TRAJECTORY_TAB_LABELS))
  }
  return found
}

/**
 * The session-log header button: the `_sessionLogButton` CSS-module local is
 * unique to it (primary); the label inside the `_headerUtilities` band, then
 * the label anywhere in the document, are the renamed-class fallbacks.
 */
function sessionLogButtonElements(): Element[] {
  const byClass = document.querySelectorAll('[class*="_sessionLogButton"]')
  if (byClass.length > 0) return [...byClass]
  const found: Element[] = []
  for (const band of document.querySelectorAll('[class*="_headerUtilities"]')) {
    found.push(...buttonsByLabel(band, SESSION_LOG_LABELS))
  }
  if (found.length === 0) found.push(...buttonsByLabel(document, SESSION_LOG_LABELS))
  return found
}

/** Show/hide targets of the visibility controller. */
export interface VisibilityState {
  /** Show the 轨迹 / Trajectory view tab. */
  trajectoryTab: boolean
  /** Show the Session 日志 / Session log header button. */
  sessionLogButton: boolean
}

/** Live show/hide controller for the two harness chrome targets. */
export interface VisibilityController {
  /** Start the document watcher (idempotent); elements are applied on start. */
  start(): void
  /** Show/hide the trajectory view tab, applying immediately. */
  setTrajectoryTab(visible: boolean): void
  /** Show/hide the session-log header button, applying immediately. */
  setSessionLogButton(visible: boolean): void
  /** Stop watching and restore every element this controller hid. */
  dispose(): void
}

/**
 * Create the controller. Before {@link VisibilityController.start} the
 * element hooks are inert; `dispose` restores the hidden elements, so a
 * plugin unload leaves the harness chrome exactly as it was.
 */
export function createVisibilityController(): VisibilityController {
  let observer: MutationObserver | undefined
  let scanScheduled = false
  let showTrajectoryTab = true
  let showSessionLogButton = true
  // Elements this controller hid; tracked so showing restores only what we
  // changed. Strong Set is fine — the handful of chrome elements live for the
  // app lifetime, and dispose empties it.
  const hidden = new Set<Element>()

  const applyTo = (element: Element, visible: boolean): void => {
    const style = (element as HTMLElement).style
    if (visible) {
      if (hidden.delete(element)) style.removeProperty('display')
    } else if (!hidden.has(element)) {
      hidden.add(element)
      style.setProperty('display', 'none')
    }
  }

  const scan = (): void => {
    if (typeof document === 'undefined') return
    for (const element of trajectoryTabElements()) applyTo(element, showTrajectoryTab)
    for (const element of sessionLogButtonElements()) applyTo(element, showSessionLogButton)
  }

  // Coalesce bursty mutation batches into one scan per microtask.
  const scheduleScan = (): void => {
    if (scanScheduled) return
    scanScheduled = true
    queueMicrotask(() => {
      scanScheduled = false
      scan()
    })
  }

  return {
    start() {
      if (observer !== undefined || typeof document === 'undefined') return
      observer = new MutationObserver(scheduleScan)
      observer.observe(document.documentElement, { childList: true, subtree: true })
      scheduleScan()
    },
    setTrajectoryTab(visible) {
      showTrajectoryTab = visible
      scan()
    },
    setSessionLogButton(visible) {
      showSessionLogButton = visible
      scan()
    },
    dispose() {
      observer?.disconnect()
      observer = undefined
      for (const element of hidden) (element as HTMLElement).style.removeProperty('display')
      hidden.clear()
    },
  }
}
