import dayjs from 'dayjs'

export const isDark = useDark()

/**
 * Credit to [@hooray](https://github.com/hooray)
 * @see https://github.com/vuejs/vitepress/pull/2347
 */
export function toggleDark(event: MouseEvent) {
  // @ts-expect-error experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }

  const x = (100 * event.clientX) / innerWidth
  const y = (100 * event.clientY) / innerHeight
  const maxRadius = (
    100 * Math.hypot(
      Math.max(event.clientX, innerWidth - event.clientX),
      Math.max(event.clientY, innerHeight - event.clientY),
    )
  ) / (Math.hypot(innerWidth, innerHeight) / Math.SQRT2)

  document.documentElement.style.setProperty('--switch-x', `${x}%`)
  document.documentElement.style.setProperty('--switch-y', `${y}%`)
  document.documentElement.style.setProperty('--switch-r', `${maxRadius}%`)

  document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
}

export function formatDate(d: string | Date, onlyDate = true) {
  const date = dayjs(d)
  if (onlyDate || date.year() === dayjs().year())
    return date.format('MMM D')
  return date.format('MMM D, YYYY')
}

export function formatListDate(d: string | Date, onlyDate = false) {
  const date = dayjs(d)
  if (onlyDate)
    return date.format('MM-DD')
  return date.format('YYYY-MM-DD')
}
