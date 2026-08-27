import { getEventXp } from '@/domain/timeline/event-meta'
import { formatMonthLabel, getMonthKey } from '@/domain/timeline/group-events'
import { getLocalDateKey } from '@/lib/dates/date-utils'
import type { TimelineEvent } from '@/types'
import type { TimelineEventType } from '@/types/enums'

const MAJOR_EVENT_TYPES: TimelineEventType[] = [
  'GOAL_COMPLETED',
  'ACHIEVEMENT_UNLOCKED',
  'LEVEL_UP',
  'QUEST_COMPLETED',
]

export interface MonthSummary {
  monthKey: string
  label: string
  questsCompleted: number
  goalsCompleted: number
  habitsCompleted: number
  milestonesCompleted: number
  achievementsUnlocked: number
  reflections: number
  xpEarned: number
  majorEvents: TimelineEvent[]
  events: TimelineEvent[]
}

function countByType(events: TimelineEvent[], type: TimelineEventType): number {
  return events.filter((e) => e.type === type).length
}

/**
 * Builds a monthly historical snapshot (PLAN §31).
 */
export function buildMonthSummary(
  events: TimelineEvent[],
  monthKey: string,
): MonthSummary {
  const monthEvents = events
    .filter((e) => getLocalDateKey(new Date(e.createdAt)).startsWith(monthKey))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  const majorEvents = monthEvents.filter((e) =>
    MAJOR_EVENT_TYPES.includes(e.type),
  )

  return {
    monthKey,
    label: formatMonthLabel(monthKey),
    questsCompleted: countByType(monthEvents, 'QUEST_COMPLETED'),
    goalsCompleted: countByType(monthEvents, 'GOAL_COMPLETED'),
    habitsCompleted: countByType(monthEvents, 'HABIT_COMPLETED'),
    milestonesCompleted: countByType(monthEvents, 'MILESTONE_COMPLETED'),
    achievementsUnlocked: countByType(monthEvents, 'ACHIEVEMENT_UNLOCKED'),
    reflections: countByType(monthEvents, 'REFLECTION'),
    xpEarned: monthEvents.reduce((sum, e) => sum + getEventXp(e), 0),
    majorEvents,
    events: monthEvents,
  }
}

export function getDefaultMonthKey(reference = new Date()): string {
  return getMonthKey(reference)
}

export function shiftMonthKey(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return getMonthKey(date)
}
