import type { MoodEntry } from '@/types'

/**
 * @returns true when a mood entry exists for the local calendar day.
 */
export function hasCheckedInToday(
  entries: MoodEntry[],
  now: Date = new Date(),
): boolean {
  const today = formatLocalDate(now)
  return entries.some((e) => formatLocalDate(new Date(e.loggedAt)) === today)
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
