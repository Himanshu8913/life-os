import { describe, expect, it } from 'vitest'
import {
  calculateAggregateMomentum,
  calculateMomentum,
  MOMENTUM_WINDOW_DAYS,
} from '@/domain/momentum/momentum'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

describe('calculateMomentum', () => {
  it('returns 0 with no completions', () => {
    const result = calculateMomentum([])
    expect(result.score).toBe(0)
    expect(result.completedDays).toBe(0)
    expect(result.windowDays).toBe(MOMENTUM_WINDOW_DAYS)
  })

  it('counts unique days in window', () => {
    const timestamps = Array.from({ length: 10 }, (_, i) => daysAgo(i))
    const result = calculateMomentum(timestamps)
    expect(result.completedDays).toBe(10)
    expect(result.score).toBeCloseTo((10 / 21) * 100, 0)
  })

  it('ignores completions outside window', () => {
    const result = calculateMomentum([daysAgo(30)])
    expect(result.completedDays).toBe(0)
  })
})

describe('calculateAggregateMomentum', () => {
  it('averages across habits', () => {
    const completions = [
      { habitId: 'a', completedAt: daysAgo(0) },
      { habitId: 'b', completedAt: daysAgo(0) },
    ]
    const result = calculateAggregateMomentum(completions, ['a', 'b'])
    expect(result.score).toBeGreaterThan(0)
  })
})
