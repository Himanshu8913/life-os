import { getLocalDateKey } from '@/lib/dates/date-utils'

/**
 * Returns Monday 00:00 local time for the week containing `date`.
 */
export function getWeekStart(date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setHours(0, 0, 0, 0)
  d.setDate(diff)
  return d
}

export function getWeekStartKey(date = new Date()): string {
  return getLocalDateKey(getWeekStart(date))
}

/** ISO week number and the ISO week-year. */
export function getISOWeek(date = new Date()): { week: number; year: number } {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const weekYear = d.getFullYear()
  const jan4 = new Date(weekYear, 0, 4)
  const week =
    1 +
    Math.round(
      ((d.getTime() - getWeekStart(jan4).getTime()) / 86_400_000 -
        3 +
        ((jan4.getDay() + 6) % 7)) /
        7,
    )
  return { week, year: weekYear }
}

export function formatWeekLabel(weekStartKey: string): string {
  const [y, m, d] = weekStartKey.split('-').map(Number)
  const { week, year } = getISOWeek(new Date(y, m - 1, d))
  return `WEEK ${week} · ${year}`
}

export function isDateInWeek(isoDate: string, weekStartKey: string): boolean {
  const start = new Date(`${weekStartKey}T00:00:00`)
  const end = new Date(start)
  end.setDate(end.getDate() + 7)
  const t = new Date(isoDate).getTime()
  return t >= start.getTime() && t < end.getTime()
}
