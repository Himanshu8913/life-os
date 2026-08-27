import { describe, expect, it, vi, beforeEach } from 'vitest'
import { logDailyCheckIn } from '@/domain/check-in/log-daily-check-in'

vi.mock('@/db/repositories/mood-repository', () => ({
  createMoodEntry: vi.fn(async (data) => ({
    id: 'mood-1',
    loggedAt: '2026-08-28T12:00:00.000Z',
    ...data,
  })),
}))

vi.mock('@/db/repositories/timeline-repository', () => ({
  addTimelineEvent: vi.fn(async () => undefined),
}))

describe('logDailyCheckIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a mood entry and timeline event', async () => {
    const result = await logDailyCheckIn({ mood: 4, energy: 3, focus: 5 })
    expect(result.entry.mood).toBe(4)
    expect(result.entry.energy).toBe(3)
    expect(result.entry.focus).toBe(5)
  })

  it('rejects out-of-range values', async () => {
    await expect(
      logDailyCheckIn({ mood: 0, energy: 3, focus: 3 }),
    ).rejects.toThrow(/1 to 5/)
  })
})
