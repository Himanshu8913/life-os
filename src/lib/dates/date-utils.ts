/**
 * Returns a local-calendar date key (`YYYY-MM-DD`) for grouping completions by day.
 *
 * @param date - Date to format; defaults to now.
 */
export function getLocalDateKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Steps a date key backward by one calendar day.
 */
export function previousDateKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() - 1)
  return getLocalDateKey(date)
}

/**
 * @returns Unique local date keys from completion timestamps, sorted descending.
 */
export function uniqueCompletionDays(completedAtTimestamps: string[]): string[] {
  const keys = new Set(completedAtTimestamps.map((ts) => getLocalDateKey(new Date(ts))))
  return [...keys].sort((a, b) => b.localeCompare(a))
}
