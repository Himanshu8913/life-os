import { describe, expect, it } from 'vitest'
import { buildLifeMap } from '@/domain/life-map/build-life-map'
import { inferHabitCategory } from '@/domain/life-map/infer-habit-category'
import type { Goal, Quest } from '@/types'

const baseGoal = (overrides: Partial<Goal>): Goal => ({
  id: 'g1',
  title: 'Test Goal',
  category: 'WORK',
  status: 'ACTIVE',
  progress: 50,
  milestones: [
    { id: 'm1', title: 'A', completed: true, order: 0 },
    { id: 'm2', title: 'B', completed: false, order: 1 },
  ],
  linkedQuestIds: [],
  createdAt: new Date().toISOString(),
  ...overrides,
})

describe('inferHabitCategory', () => {
  it('maps fitness habits', () => {
    expect(inferHabitCategory('Morning workout')).toBe('FITNESS')
  })

  it('maps reading to learning', () => {
    expect(inferHabitCategory('Read daily')).toBe('LEARNING')
  })
})

describe('buildLifeMap', () => {
  it('derives work area stats from goals and quests', () => {
    const goals = [baseGoal({ category: 'WORK' })]
    const quests: Quest[] = [
      {
        id: 'q1',
        title: 'Ship feature',
        type: 'MAIN',
        status: 'TODO',
        priority: 'HIGH',
        xpReward: 100,
        goalId: 'g1',
        createdAt: new Date().toISOString(),
      },
    ]

    const map = buildLifeMap({
      goals,
      quests,
      habits: [],
      habitCompletions: [],
      events: [],
      displayName: 'Commander',
      level: 3,
    })

    const work = map.areas.find((a) => a.category === 'WORK')!
    expect(work.stats.activeGoals).toBe(1)
    expect(work.stats.activeQuests).toBe(1)
    expect(work.stats.progressScore).toBeGreaterThan(0)
    expect(map.center.label).toBe('Commander')
  })

  it('returns seven life area nodes', () => {
    const map = buildLifeMap({
      goals: [],
      quests: [],
      habits: [],
      habitCompletions: [],
      events: [],
      displayName: 'You',
      level: 1,
    })
    expect(map.areas).toHaveLength(7)
  })
})
