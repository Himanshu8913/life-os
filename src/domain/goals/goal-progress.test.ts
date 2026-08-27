import { describe, expect, it } from 'vitest'
import {
  areAllMilestonesComplete,
  calculateGoalProgress,
  reorderMilestones,
} from '@/domain/goals/goal-progress'
import type { Goal, Milestone } from '@/types'

const milestones: Milestone[] = [
  { id: '1', title: 'A', completed: true, order: 0 },
  { id: '2', title: 'B', completed: false, order: 1 },
  { id: '3', title: 'C', completed: false, order: 2 },
]

describe('calculateGoalProgress', () => {
  it('returns 0 for empty milestones', () => {
    expect(calculateGoalProgress([])).toBe(0)
  })

  it('returns correct percentage', () => {
    expect(calculateGoalProgress(milestones)).toBe(33.3)
  })

  it('returns 100 when all complete', () => {
    const allDone = milestones.map((m) => ({ ...m, completed: true }))
    expect(calculateGoalProgress(allDone)).toBe(100)
  })
})

describe('areAllMilestonesComplete', () => {
  const goal: Goal = {
    id: 'g1',
    title: 'Test',
    category: 'PERSONAL',
    status: 'ACTIVE',
    progress: 0,
    milestones,
    linkedQuestIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
  }

  it('returns false when milestones remain', () => {
    expect(areAllMilestonesComplete(goal)).toBe(false)
  })

  it('returns true when all milestones done', () => {
    expect(
      areAllMilestonesComplete({
        ...goal,
        milestones: milestones.map((m) => ({ ...m, completed: true })),
      }),
    ).toBe(true)
  })
})

describe('reorderMilestones', () => {
  it('moves a milestone down', () => {
    const result = reorderMilestones(milestones, '1', 1)
    expect(result.find((m) => m.id === '1')?.order).toBe(1)
    expect(result.find((m) => m.id === '2')?.order).toBe(0)
  })

  it('does not move past bounds', () => {
    expect(reorderMilestones(milestones, '1', -1)).toEqual(milestones)
  })
})
