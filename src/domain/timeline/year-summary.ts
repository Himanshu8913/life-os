import { getLocalDateKey } from '@/lib/dates/date-utils'
import type { TimelineEvent } from '@/types'
import type { TimelineEventType } from '@/types/enums'

const HIGHLIGHT_TYPES: TimelineEventType[] = [
  'GOAL_COMPLETED',
  'ACHIEVEMENT_UNLOCKED',
  'LEVEL_UP',
]

export interface YearMonthBucket {
  month: number
  monthKey: string
  shortLabel: string
  eventCount: number
  activeDays: number
  highlights: TimelineEvent[]
}

export interface YearSummary {
  year: number
  months: YearMonthBucket[]
  totalEvents: number
}

const MONTH_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
] as const

/**
 * Builds a yearly overview with per-month activity (PLAN §30).
 */
export function buildYearSummary(
  events: TimelineEvent[],
  year: number,
): YearSummary {
  const yearEvents = events.filter(
    (e) => new Date(e.createdAt).getFullYear() === year,
  )

  const months: YearMonthBucket[] = []

  for (let month = 1; month <= 12; month++) {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`
    const monthEvents = yearEvents.filter((e) =>
      getLocalDateKey(new Date(e.createdAt)).startsWith(monthKey),
    )
    const activeDays = new Set(
      monthEvents.map((e) => getLocalDateKey(new Date(e.createdAt))),
    ).size
    const highlights = monthEvents.filter((e) =>
      HIGHLIGHT_TYPES.includes(e.type),
    )

    months.push({
      month,
      monthKey,
      shortLabel: MONTH_SHORT[month - 1],
      eventCount: monthEvents.length,
      activeDays,
      highlights,
    })
  }

  return {
    year,
    months,
    totalEvents: yearEvents.length,
  }
}

export function getAvailableYears(events: TimelineEvent[]): number[] {
  const years = new Set(events.map((e) => new Date(e.createdAt).getFullYear()))
  if (years.size === 0) years.add(new Date().getFullYear())
  return [...years].sort((a, b) => b - a)
}
