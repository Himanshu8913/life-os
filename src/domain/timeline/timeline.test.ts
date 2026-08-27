import { describe, expect, it } from 'vitest'
import { filterTimelineEvents } from '@/domain/timeline/filter-events'
import { groupEventsByDate } from '@/domain/timeline/group-events'
import { buildMonthSummary } from '@/domain/timeline/month-summary'
import { buildYearSummary } from '@/domain/timeline/year-summary'
import type { TimelineEvent } from '@/types'

function event(
  overrides: Partial<TimelineEvent> & Pick<TimelineEvent, 'type' | 'title'>,
): TimelineEvent {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('groupEventsByDate', () => {
  it('groups events by local day', () => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const events = [
      event({ type: 'CUSTOM', title: 'A', createdAt: today.toISOString() }),
      event({ type: 'CUSTOM', title: 'B', createdAt: yesterday.toISOString() }),
    ]

    const groups = groupEventsByDate(events, today)
    expect(groups).toHaveLength(2)
    expect(groups[0].label).toBe('Today')
    expect(groups[0].events).toHaveLength(1)
  })
})

describe('filterTimelineEvents', () => {
  const events = [
    event({ type: 'QUEST_COMPLETED', title: 'Quest' }),
    event({ type: 'HABIT_COMPLETED', title: 'Habit' }),
  ]

  it('filters by type', () => {
    const filtered = filterTimelineEvents(events, {
      types: ['QUEST_COMPLETED'],
      dateRange: 'all',
    })
    expect(filtered).toHaveLength(1)
    expect(filtered[0].title).toBe('Quest')
  })
})

describe('buildMonthSummary', () => {
  it('aggregates monthly stats', () => {
    const monthKey = '2026-08'
    const events = [
      event({
        type: 'QUEST_COMPLETED',
        title: 'Q',
        createdAt: '2026-08-15T10:00:00.000Z',
        metadata: { xpGained: 50 },
      }),
      event({
        type: 'HABIT_COMPLETED',
        title: 'H',
        createdAt: '2026-08-16T10:00:00.000Z',
      }),
    ]

    const summary = buildMonthSummary(events, monthKey)
    expect(summary.questsCompleted).toBe(1)
    expect(summary.habitsCompleted).toBe(1)
    expect(summary.xpEarned).toBe(50)
  })
})

describe('buildYearSummary', () => {
  it('builds 12 month buckets', () => {
    const summary = buildYearSummary([], 2026)
    expect(summary.months).toHaveLength(12)
    expect(summary.months[0].shortLabel).toBe('JAN')
  })
})
