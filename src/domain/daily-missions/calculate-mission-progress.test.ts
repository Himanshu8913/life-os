import { describe, expect, it } from 'vitest'
import {
  calculateMissionCounts,
  isMissionComplete,
} from '@/domain/daily-missions/calculate-mission-progress'
import { DAILY_MISSION_DEFINITIONS } from '@/domain/daily-missions/mission-definitions'
import type { Quest } from '@/types'

const today = '2026-08-29T10:00:00.000Z'
const todayDate = new Date(today)

function quest(overrides: Partial<Quest> = {}): Quest {
  return {
    id: 'q1',
    title: 'Test',
    type: 'DAILY',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    xpReward: 25,
    createdAt: today,
    completedAt: today,
    ...overrides,
  }
}

describe('calculateMissionCounts', () => {
  it('counts quests completed today', () => {
    const counts = calculateMissionCounts({
      quests: [
        quest(),
        quest({ id: 'q2', completedAt: '2026-08-28T10:00:00.000Z' }),
      ],
      habitCompletions: [],
      moodEntries: [],
      focusSessions: [],
      date: todayDate,
    })
    expect(counts.questsCompleted).toBe(1)
  })

  it('detects check-in today', () => {
    const counts = calculateMissionCounts({
      quests: [],
      habitCompletions: [],
      moodEntries: [
        {
          id: 'm1',
          mood: 4,
          energy: 3,
          focus: 3,
          loggedAt: today,
        },
      ],
      focusSessions: [],
      date: todayDate,
    })
    expect(counts.checkedIn).toBe(true)
  })
})

describe('isMissionComplete', () => {
  it('requires two quests for quest mission', () => {
    const definition = DAILY_MISSION_DEFINITIONS.find((d) => d.id === 'quests')!
    expect(
      isMissionComplete(definition, {
        questsCompleted: 1,
        habitsCompleted: 0,
        checkedIn: false,
        focusSessionsCompleted: 0,
      }),
    ).toBe(false)
    expect(
      isMissionComplete(definition, {
        questsCompleted: 2,
        habitsCompleted: 0,
        checkedIn: false,
        focusSessionsCompleted: 0,
      }),
    ).toBe(true)
  })
})
