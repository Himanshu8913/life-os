import { getLocalDateKey } from '@/lib/dates/date-utils'
import type { TimelineEvent } from '@/types'
import type { TimelineEventType } from '@/types/enums'

export type DateRangePreset = 'all' | '7d' | '30d' | 'month'

export interface TimelineFilters {
  types: TimelineEventType[]
  dateRange: DateRangePreset
  /** YYYY-MM — used when viewing month tab */
  monthKey?: string
}

export const DEFAULT_TIMELINE_FILTERS: TimelineFilters = {
  types: [],
  dateRange: 'all',
}

function getRangeStart(preset: DateRangePreset, reference = new Date()): string | null {
  if (preset === 'all') return null
  const start = new Date(reference)
  if (preset === '7d') start.setDate(start.getDate() - 6)
  else if (preset === '30d') start.setDate(start.getDate() - 29)
  else if (preset === 'month') start.setDate(1)
  return getLocalDateKey(start)
}

/**
 * Filters timeline events by type and date range.
 */
export function filterTimelineEvents(
  events: TimelineEvent[],
  filters: TimelineFilters,
  reference = new Date(),
): TimelineEvent[] {
  const rangeStart = getRangeStart(filters.dateRange, reference)
  const todayKey = getLocalDateKey(reference)

  return events.filter((event) => {
    if (filters.types.length > 0 && !filters.types.includes(event.type)) {
      return false
    }

    const eventKey = getLocalDateKey(new Date(event.createdAt))

    if (filters.monthKey) {
      if (!eventKey.startsWith(filters.monthKey)) return false
    }

    if (rangeStart && (eventKey < rangeStart || eventKey > todayKey)) {
      return false
    }

    return true
  })
}
