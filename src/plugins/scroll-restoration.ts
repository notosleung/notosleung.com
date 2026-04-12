import type { Router, RouterScrollBehavior } from 'vue-router'

const DEFAULT_SCROLL_KEY_PREFIX = 'vue-router:scroll:'
const BOTTOM_EPSILON = 2
const RESTORE_RETRY_DELAYS = [0, 32, 96, 180, 320, 520, 820, 1200]
const SAVE_INTERVAL_MS = 120

export interface ScrollRestorationOptions {
  keyPrefix?: string
}

interface ScrollSnapshot {
  top: number
  atBottom: boolean
}

function getScrollKey(fullPath: string, keyPrefix: string) {
  return `${keyPrefix}${fullPath}`
}

function getCurrentFullPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function getMaxScrollTop() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
}

function parseSnapshot(raw: string | null): ScrollSnapshot {
  if (!raw)
    return { top: 0, atBottom: false }

  try {
    const parsed = JSON.parse(raw) as Partial<ScrollSnapshot>
    const top = Number(parsed.top)
    return {
      top: Number.isFinite(top) ? top : 0,
      atBottom: Boolean(parsed.atBottom),
    }
  }
  catch {
    // Backward compatibility: old value was plain numeric string.
    const legacyTop = Number(raw)
    return {
      top: Number.isFinite(legacyTop) ? legacyTop : 0,
      atBottom: false,
    }
  }
}

function restoreScroll(snapshot: ScrollSnapshot) {
  const top = snapshot.atBottom ? getMaxScrollTop() : snapshot.top
  window.scrollTo({ left: 0, top: Number.isFinite(top) ? top : 0 })
}

function saveScrollSnapshot(fullPath: string, keyPrefix: string) {
  const maxScrollTop = getMaxScrollTop()
  const atBottom = maxScrollTop - window.scrollY <= BOTTOM_EPSILON
  const snapshot: ScrollSnapshot = {
    top: window.scrollY,
    atBottom,
  }

  window.sessionStorage.setItem(getScrollKey(fullPath, keyPrefix), JSON.stringify(snapshot))
}

export function createScrollBehavior(options: ScrollRestorationOptions = {}): RouterScrollBehavior {
  const keyPrefix = options.keyPrefix ?? DEFAULT_SCROLL_KEY_PREFIX

  return (to, _from, savedPosition) => {
    if (savedPosition)
      return savedPosition

    if (typeof window === 'undefined')
      return { left: 0, top: 0 }

    const raw = window.sessionStorage.getItem(getScrollKey(to.fullPath, keyPrefix))
    const snapshot = parseSnapshot(raw)
    const top = snapshot.atBottom ? getMaxScrollTop() : snapshot.top

    return {
      left: 0,
      top: Number.isFinite(top) ? top : 0,
    }
  }
}

export const scrollBehavior: RouterScrollBehavior = createScrollBehavior()

export function setupScrollRestoration(router: Router, options: ScrollRestorationOptions = {}) {
  const keyPrefix = options.keyPrefix ?? DEFAULT_SCROLL_KEY_PREFIX

  const saveByRouter = () => {
    saveScrollSnapshot(router.currentRoute.value.fullPath, keyPrefix)
  }

  const saveByLocation = () => {
    saveScrollSnapshot(getCurrentFullPath(), keyPrefix)
  }

  let scrollRafId = 0
  let lastSavedAt = 0
  const onScroll = () => {
    if (scrollRafId)
      return

    scrollRafId = window.requestAnimationFrame(() => {
      scrollRafId = 0
      const now = performance.now()
      if (now - lastSavedAt < SAVE_INTERVAL_MS)
        return

      lastSavedAt = now
      saveByLocation()
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pagehide', saveByLocation)
  window.addEventListener('beforeunload', saveByLocation)

  router.beforeEach(() => {
    saveByRouter()
  })

  router.isReady().then(() => {
    const fullPath = router.currentRoute.value.fullPath
    const raw = window.sessionStorage.getItem(getScrollKey(fullPath, keyPrefix))
    const snapshot = parseSnapshot(raw)

    // Retry restoration to handle late-loading content (e.g. images/markdown assets).
    RESTORE_RETRY_DELAYS.forEach((delay) => {
      window.setTimeout(() => {
        window.requestAnimationFrame(() => restoreScroll(snapshot))
      }, delay)
    })

    window.addEventListener('load', () => {
      window.requestAnimationFrame(() => restoreScroll(snapshot))
    }, { once: true })
  })
}
