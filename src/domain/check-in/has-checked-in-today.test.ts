import { describe, expect, it } from 'vitest'
import { hasCheckedInToday } from '@/domain/check-in/has-checked-in-today'
import type { MoodEntry } from '@/types'

describe('hasCheckedInToday', () => {
  const now = new Date('2026-08-28T12:00:00')

  it('returns true when an entry exists for today', () => {
    const entries: MoodEntry[] = [
      {
        id: '1',
        mood: 4,
        energy: 3,
        focus: 3,
        loggedAt: '2026-08-28T08:00:00.000Z',
      },
    ]
    expect(hasCheckedInToday(entries, now)).toBe(true)
  })

  it('returns false when only past entries exist', () => {
    const entries: MoodEntry[] = [
      {
        id: '1',
        mood: 4,
        energy: 3,
        focus: 3,
        loggedAt: '2026-08-27T08:00:00.000Z',
      },
    ]
    expect(hasCheckedInToday(entries, now)).toBe(false)
  })

  it('returns false for empty entries', () => {
    expect(hasCheckedInToday([], now)).toBe(false)
  })
})
