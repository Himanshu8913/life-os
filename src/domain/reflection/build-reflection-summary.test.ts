import { describe, expect, it } from 'vitest'
import { buildReflectionSummary } from '@/domain/reflection/build-reflection-summary'
import { getWeekStartKey } from '@/domain/reflection/week-utils'
import type { Reflection, TimelineEvent } from '@/types'

const weekStart = getWeekStartKey(new Date('2026-08-28'))

const reflection: Reflection = {
  id: 'r1',
  weekStart,
  wentWell: 'Shipped features.',
  wentPoorly: 'Sleep was inconsistent.',
  proudOf: 'Shipped the MVP.',
  nextWeekFocus: 'Launch.',
  createdAt: '2026-08-28T12:00:00.000Z',
}

describe('buildReflectionSummary', () => {
  it('generates summary with activity stats', () => {
    const events: TimelineEvent[] = [
      {
        id: 'e1',
        type: 'QUEST_COMPLETED',
        title: 'Q',
        createdAt: '2026-08-26T10:00:00.000Z',
      },
      {
        id: 'e2',
        type: 'WORKOUT',
        title: 'W',
        createdAt: '2026-08-27T10:00:00.000Z',
        metadata: { minutes: 45 },
      },
    ]

    const summary = buildReflectionSummary({
      reflection,
      events,
      quests: [],
      goals: [],
      habitCompletions: [],
    })

    expect(summary.weekLabel).toMatch(/WEEK \d+ · \d+/)
    expect(summary.stats[0].value).toBe('1')
    expect(summary.biggestWin).toBe('Shipped the MVP.')
    expect(summary.nextFocus).toBe('Launch.')
  })

  it('uses proudOf for biggest win', () => {
    const summary = buildReflectionSummary({
      reflection,
      events: [],
      quests: [],
      goals: [],
      habitCompletions: [],
    })
    expect(summary.biggestWin).toBe('Shipped the MVP.')
  })
})
