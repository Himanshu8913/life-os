import { getLocalDateKey } from '@/lib/dates/date-utils'
import type { TimelineEvent } from '@/types'

export interface TimelineDateGroup {
  dateKey: string
  label: string
  events: TimelineEvent[]
}

function formatGroupLabel(dateKey: string, reference = new Date()): string {
  const todayKey = getLocalDateKey(reference)
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)

  const yesterday = new Date(reference)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = getLocalDateKey(yesterday)

  if (dateKey === todayKey) return 'Today'
  if (dateKey === yesterdayKey) return 'Yesterday'

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== reference.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Groups timeline events by local calendar day, newest days first.
 */
export function groupEventsByDate(
  events: TimelineEvent[],
  reference = new Date(),
): TimelineDateGroup[] {
  const map = new Map<string, TimelineEvent[]>()

  for (const event of events) {
    const key = getLocalDateKey(new Date(event.createdAt))
    const bucket = map.get(key) ?? []
    bucket.push(event)
    map.set(key, bucket)
  }

  return [...map.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, dayEvents]) => ({
      dateKey,
      label: formatGroupLabel(dateKey, reference),
      events: dayEvents.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }))
}

export function getMonthKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function parseMonthKey(monthKey: string): { year: number; month: number } {
  const [year, month] = monthKey.split('-').map(Number)
  return { year, month }
}

export function formatMonthLabel(monthKey: string): string {
  const { year, month } = parseMonthKey(monthKey)
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}
