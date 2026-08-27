import { describe, expect, it } from 'vitest'
import {
  applyAttributeRewards,
  buildCompletionProfileUpdate,
  calculateQuestProgress,
} from '@/domain/quests/quest-utils'
import type { Quest, UserProfile } from '@/types'

const baseProfile: UserProfile = {
  id: 'default',
  displayName: 'Test',
  totalXp: 400,
  attributes: {
    discipline: 50,
    creativity: 50,
    fitness: 50,
    learning: 50,
    social: 50,
    finance: 50,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const baseQuest: Quest = {
  id: 'q1',
  title: 'Workout',
  type: 'DAILY',
  status: 'TODO',
  priority: 'HIGH',
  xpReward: 100,
  attributeRewards: [{ attribute: 'fitness', amount: 2 }],
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('calculateQuestProgress', () => {
  it('returns 0 when no milestones and not completed', () => {
    expect(calculateQuestProgress(baseQuest)).toBe(0)
  })

  it('returns milestone completion percentage', () => {
    const quest: Quest = {
      ...baseQuest,
      milestones: [
        { id: '1', title: 'A', completed: true, order: 0 },
        { id: '2', title: 'B', completed: false, order: 1 },
      ],
    }
    expect(calculateQuestProgress(quest)).toBe(50)
  })

  it('returns 100 when quest is completed', () => {
    expect(
      calculateQuestProgress({ ...baseQuest, status: 'COMPLETED' }),
    ).toBe(100)
  })
})

describe('applyAttributeRewards', () => {
  it('clamps attributes to 100', () => {
    const result = applyAttributeRewards(baseProfile.attributes, [
      { attribute: 'fitness', amount: 60 },
    ])
    expect(result.fitness).toBe(100)
  })

  it('returns unchanged attributes when no rewards', () => {
    expect(applyAttributeRewards(baseProfile.attributes, undefined)).toEqual(
      baseProfile.attributes,
    )
  })
})

describe('buildCompletionProfileUpdate', () => {
  it('adds XP and applies attribute rewards', () => {
    const result = buildCompletionProfileUpdate(baseProfile, baseQuest, 1, 1)
    expect(result.xpGained).toBe(100)
    expect(result.profile.totalXp).toBe(500)
    expect(result.profile.attributes.fitness).toBe(52)
    expect(result.leveledUp).toBe(false)
  })

  it('detects level up', () => {
    const result = buildCompletionProfileUpdate(baseProfile, baseQuest, 1, 2)
    expect(result.leveledUp).toBe(true)
    expect(result.newLevel).toBe(2)
  })
})
