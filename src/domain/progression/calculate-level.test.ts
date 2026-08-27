import { describe, expect, it } from 'vitest'
import {
  calculateLevel,
  calculateXpProgress,
} from '@/domain/progression/calculate-level'

describe('calculateLevel', () => {
  it('returns level 1 for zero XP', () => {
    expect(calculateLevel(0)).toBe(1)
  })

  it('returns level 2 at 500 XP', () => {
    expect(calculateLevel(500)).toBe(2)
  })

  it('returns level 3 at 1000 XP', () => {
    expect(calculateLevel(1000)).toBe(3)
  })
})

describe('calculateXpProgress', () => {
  it('computes progress within current level', () => {
    const progress = calculateXpProgress(240)
    expect(progress.level).toBe(1)
    expect(progress.currentXp).toBe(240)
    expect(progress.progressPercent).toBeCloseTo(48, 0)
  })

  it('starts next level at threshold', () => {
    const progress = calculateXpProgress(500)
    expect(progress.level).toBe(2)
    expect(progress.currentXp).toBe(0)
  })
})
