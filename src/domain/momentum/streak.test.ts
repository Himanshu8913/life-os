import { describe, expect, it } from 'vitest'
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateStreakStats,
} from '@/domain/momentum/streak'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

describe('calculateCurrentStreak', () => {
  it('returns 0 with no completions', () => {
    expect(calculateCurrentStreak([])).toBe(0)
  })

  it('counts consecutive days including today', () => {
    expect(
      calculateCurrentStreak([daysAgo(0), daysAgo(1), daysAgo(2)]),
    ).toBe(3)
  })

  it('counts from yesterday when today is missed', () => {
    expect(calculateCurrentStreak([daysAgo(1), daysAgo(2)])).toBe(2)
  })

  it('returns 0 when last completion was 2+ days ago', () => {
    expect(calculateCurrentStreak([daysAgo(3), daysAgo(4)])).toBe(0)
  })
})

describe('calculateLongestStreak', () => {
  it('finds longest run', () => {
    const timestamps = [
      daysAgo(10),
      daysAgo(9),
      daysAgo(8),
      daysAgo(1),
      daysAgo(0),
    ]
    expect(calculateLongestStreak(timestamps)).toBe(3)
  })
})

describe('calculateStreakStats', () => {
  it('ensures longest is at least current', () => {
    const stats = calculateStreakStats([daysAgo(0), daysAgo(1)])
    expect(stats.currentStreak).toBe(2)
    expect(stats.longestStreak).toBeGreaterThanOrEqual(2)
  })
})
