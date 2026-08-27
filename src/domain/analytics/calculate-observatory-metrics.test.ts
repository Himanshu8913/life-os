import { describe, expect, it } from 'vitest'
import { calculateObservatoryMetrics } from '@/domain/analytics/calculate-observatory-metrics'
import type { Goal, Quest, TimelineEvent } from '@/types'

const ref = new Date('2026-08-28T12:00:00')

function event(overrides: Partial<TimelineEvent>): TimelineEvent {
  return {
    id: 'e1',
    type: 'CUSTOM',
    title: 'Test',
    createdAt: '2026-08-28T10:00:00.000Z',
    ...overrides,
  }
}

describe('calculateObservatoryMetrics', () => {
  it('computes quest completion rate', () => {
    const quests: Quest[] = [
      {
        id: 'q1',
        title: 'Done',
        type: 'SIDE',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        xpReward: 50,
        createdAt: ref.toISOString(),
      },
      {
        id: 'q2',
        title: 'Todo',
        type: 'DAILY',
        status: 'TODO',
        priority: 'LOW',
        xpReward: 25,
        createdAt: ref.toISOString(),
      },
    ]

    const metrics = calculateObservatoryMetrics(
      {
        quests,
        goals: [],
        habits: [],
        habitCompletions: [],
        events: [],
        totalXp: 100,
        focusSessions: [],
      },
      ref,
    )

    expect(metrics.questCompletionRate).toBe(50)
    expect(metrics.totalQuestsCompleted).toBe(1)
    expect(metrics.totalXpEarned).toBe(100)
  })

  it('finds most productive day of week', () => {
    const events: TimelineEvent[] = [
      event({ createdAt: '2026-08-24T10:00:00.000Z' }),
      event({ createdAt: '2026-08-25T10:00:00.000Z' }),
      event({ createdAt: '2026-08-25T14:00:00.000Z' }),
    ]

    const metrics = calculateObservatoryMetrics(
      {
        quests: [],
        goals: [],
        habits: [],
        habitCompletions: [],
        events,
        totalXp: 0,
        focusSessions: [],
      },
      ref,
    )

    expect(metrics.mostProductiveDay?.value).toBeGreaterThanOrEqual(2)
    expect(metrics.weeklyActivity).toHaveLength(8)
    expect(metrics.monthlyActivity).toHaveLength(6)
  })

  it('aggregates milestones from goals', () => {
    const goals: Goal[] = [
      {
        id: 'g1',
        title: 'G',
        category: 'WORK',
        status: 'ACTIVE',
        progress: 50,
        milestones: [
          { id: 'm1', title: 'A', completed: true, order: 0 },
          { id: 'm2', title: 'B', completed: false, order: 1 },
        ],
        linkedQuestIds: [],
        createdAt: ref.toISOString(),
      },
    ]

    const metrics = calculateObservatoryMetrics(
      {
        quests: [],
        goals,
        habits: [],
        habitCompletions: [],
        events: [],
        totalXp: 0,
        focusSessions: [],
      },
      ref,
    )

    expect(metrics.totalMilestonesCompleted).toBe(1)
  })
})
