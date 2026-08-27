import { describe, expect, it } from 'vitest'
import { ACHIEVEMENT_DEFINITIONS } from '@/domain/achievements/definitions'
import type { AchievementStats } from '@/domain/achievements/types'

function baseStats(overrides: Partial<AchievementStats> = {}): AchievementStats {
  return {
    totalCompletedQuests: 0,
    totalCompletedGoals: 0,
    totalCompletedMilestones: 0,
    totalCompletedFocusSessions: 0,
    currentLevel: 1,
    longestStreak: 0,
    returnedAfterBreak: false,
    daysUsingApp: 0,
    unlockedDefinitionIds: new Set(),
    ...overrides,
  }
}

describe('achievement definitions', () => {
  it('unlocks FIRST_STEP after one quest', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === 'FIRST_STEP')!
    expect(def.check(baseStats({ totalCompletedQuests: 1 }))).toBe(true)
    expect(def.check(baseStats())).toBe(false)
  })

  it('unlocks LEVEL_10 at level 10', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === 'LEVEL_10')!
    expect(def.check(baseStats({ currentLevel: 10 }))).toBe(true)
    expect(def.check(baseStats({ currentLevel: 9 }))).toBe(false)
  })

  it('unlocks COMEBACK after a long break', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === 'COMEBACK')!
    expect(def.check(baseStats({ returnedAfterBreak: true }))).toBe(true)
  })

  it('unlocks DEEP_WORK after 50 focus sessions', () => {
    const def = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === 'DEEP_WORK')!
    expect(def.check(baseStats({ totalCompletedFocusSessions: 50 }))).toBe(true)
  })
})
