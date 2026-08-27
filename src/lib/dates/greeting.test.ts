import { describe, expect, it } from 'vitest'
import { formatDashboardDate, getGreeting } from '@/lib/dates/greeting'

describe('getGreeting', () => {
  it('returns Good Morning for morning hours', () => {
    const date = new Date(2026, 0, 1, 9, 0, 0)
    expect(getGreeting(date)).toBe('Good Morning')
  })

  it('returns Good Afternoon for afternoon', () => {
    const date = new Date(2026, 0, 1, 14, 0, 0)
    expect(getGreeting(date)).toBe('Good Afternoon')
  })

  it('returns Good Evening for evening', () => {
    const date = new Date(2026, 0, 1, 19, 0, 0)
    expect(getGreeting(date)).toBe('Good Evening')
  })

  it('returns Good Night for late night', () => {
    const date = new Date(2026, 0, 1, 2, 0, 0)
    expect(getGreeting(date)).toBe('Good Night')
  })
})

describe('formatDashboardDate', () => {
  it('formats as uppercase with middle dot', () => {
    const date = new Date(2026, 7, 26, 12, 0, 0)
    expect(formatDashboardDate(date)).toBe('WEDNESDAY · 26 AUGUST 2026')
  })
})
