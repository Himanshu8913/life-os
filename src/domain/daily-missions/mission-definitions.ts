export const DAILY_MISSION_BONUS_ID = 'daily_bonus'

export const DAILY_MISSION_BONUS_XP = 100

export type DailyMissionType =
  | 'quest_count'
  | 'check_in'
  | 'habit_count'
  | 'focus_session'

export interface DailyMissionDefinition {
  id: string
  label: string
  description: string
  type: DailyMissionType
  target: number
  xpReward: number
  icon: string
}

/** Fixed daily missions — reset at local midnight. */
export const DAILY_MISSION_DEFINITIONS: DailyMissionDefinition[] = [
  {
    id: 'quests',
    label: 'Complete 2 quests',
    description: 'Finish any two quests today',
    type: 'quest_count',
    target: 2,
    xpReward: 50,
    icon: '⚔',
  },
  {
    id: 'check_in',
    label: 'Log your check-in',
    description: 'Record mood, energy, and focus',
    type: 'check_in',
    target: 1,
    xpReward: 15,
    icon: '✦',
  },
  {
    id: 'habit',
    label: 'Complete 1 habit',
    description: 'Check off a habit for today',
    type: 'habit_count',
    target: 1,
    xpReward: 20,
    icon: '🔥',
  },
  {
    id: 'focus',
    label: 'Finish a focus session',
    description: 'Complete a focus timer',
    type: 'focus_session',
    target: 1,
    xpReward: 50,
    icon: '⏱',
  },
]

export function getTotalMissionXp(): number {
  return (
    DAILY_MISSION_DEFINITIONS.reduce((sum, m) => sum + m.xpReward, 0) +
    DAILY_MISSION_BONUS_XP
  )
}
