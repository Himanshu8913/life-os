import { hasCheckedInToday } from '@/domain/check-in/has-checked-in-today'
import type { DailyMissionDefinition } from '@/domain/daily-missions/mission-definitions'
import { getLocalDateKey } from '@/lib/dates/date-utils'
import type {
  FocusSession,
  HabitCompletion,
  MoodEntry,
  Quest,
} from '@/types'

export interface DailyMissionActivityInput {
  quests: Quest[]
  habitCompletions: HabitCompletion[]
  moodEntries: MoodEntry[]
  focusSessions: FocusSession[]
  date?: Date
}

export interface DailyMissionCounts {
  questsCompleted: number
  habitsCompleted: number
  checkedIn: boolean
  focusSessionsCompleted: number
}

export function calculateMissionCounts(
  input: DailyMissionActivityInput,
): DailyMissionCounts {
  const today = getLocalDateKey(input.date ?? new Date())

  const questsCompleted = input.quests.filter(
    (q) =>
      q.status === 'COMPLETED' &&
      q.completedAt &&
      getLocalDateKey(new Date(q.completedAt)) === today,
  ).length

  const habitsCompleted = input.habitCompletions.filter(
    (c) => getLocalDateKey(new Date(c.completedAt)) === today,
  ).length

  const checkedIn = hasCheckedInToday(input.moodEntries, input.date)

  const focusSessionsCompleted = input.focusSessions.filter(
    (s) =>
      s.completedAt &&
      getLocalDateKey(new Date(s.completedAt)) === today,
  ).length

  return {
    questsCompleted,
    habitsCompleted,
    checkedIn,
    focusSessionsCompleted,
  }
}

export function getMissionCurrentValue(
  definition: DailyMissionDefinition,
  counts: DailyMissionCounts,
): number {
  switch (definition.type) {
    case 'quest_count':
      return counts.questsCompleted
    case 'check_in':
      return counts.checkedIn ? 1 : 0
    case 'habit_count':
      return counts.habitsCompleted
    case 'focus_session':
      return counts.focusSessionsCompleted
  }
}

export function isMissionComplete(
  definition: DailyMissionDefinition,
  counts: DailyMissionCounts,
): boolean {
  return getMissionCurrentValue(definition, counts) >= definition.target
}
