import { describe, expect, it } from 'vitest'
import { buildDailyMissionBoard } from '@/domain/daily-missions/build-daily-mission-board'
import { DAILY_MISSION_BONUS_XP } from '@/domain/daily-missions/mission-definitions'

describe('buildDailyMissionBoard', () => {
  const baseInput = {
    quests: [],
    habitCompletions: [],
    moodEntries: [],
    focusSessions: [],
    date: new Date('2026-08-29T12:00:00'),
    missionDate: '2026-08-29',
    rewardedIds: [] as string[],
  }

  it('marks all missions incomplete when no activity', () => {
    const board = buildDailyMissionBoard(baseInput)
    expect(board.completedCount).toBe(0)
    expect(board.allComplete).toBe(false)
    expect(board.bonusAvailable).toBe(false)
  })

  it('detects bonus availability when all missions complete', () => {
    const board = buildDailyMissionBoard({
      ...baseInput,
      quests: [
        {
          id: 'q1',
          title: 'A',
          type: 'DAILY',
          status: 'COMPLETED',
          priority: 'MEDIUM',
          xpReward: 25,
          createdAt: '2026-08-29T08:00:00.000Z',
          completedAt: '2026-08-29T08:00:00.000Z',
        },
        {
          id: 'q2',
          title: 'B',
          type: 'SIDE',
          status: 'COMPLETED',
          priority: 'MEDIUM',
          xpReward: 50,
          createdAt: '2026-08-29T09:00:00.000Z',
          completedAt: '2026-08-29T09:00:00.000Z',
        },
      ],
      moodEntries: [
        {
          id: 'm1',
          mood: 4,
          energy: 4,
          focus: 4,
          loggedAt: '2026-08-29T10:00:00.000Z',
        },
      ],
      habitCompletions: [
        {
          id: 'h1',
          habitId: 'habit-1',
          completedAt: '2026-08-29T11:00:00.000Z',
        },
      ],
      focusSessions: [
        {
          id: 'f1',
          title: 'Focus',
          durationMinutes: 25,
          startedAt: '2026-08-29T11:30:00.000Z',
          completedAt: '2026-08-29T11:55:00.000Z',
          xpEarned: 50,
        },
      ],
    })

    expect(board.completedCount).toBe(4)
    expect(board.allComplete).toBe(true)
    expect(board.bonusAvailable).toBe(true)
    expect(board.totalXpAvailable).toBe(50 + 15 + 20 + 50 + DAILY_MISSION_BONUS_XP)
  })
})
