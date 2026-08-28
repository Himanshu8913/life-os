import {
  calculateMissionCounts,
  getMissionCurrentValue,
  isMissionComplete,
  type DailyMissionActivityInput,
} from '@/domain/daily-missions/calculate-mission-progress'
import {
  DAILY_MISSION_BONUS_ID,
  DAILY_MISSION_BONUS_XP,
  DAILY_MISSION_DEFINITIONS,
} from '@/domain/daily-missions/mission-definitions'
import { getLocalDateKey } from '@/lib/dates/date-utils'

export interface DailyMissionBoardItem {
  id: string
  label: string
  description: string
  icon: string
  xpReward: number
  current: number
  target: number
  complete: boolean
  rewarded: boolean
}

export interface DailyMissionBoard {
  date: string
  missions: DailyMissionBoardItem[]
  completedCount: number
  totalCount: number
  allComplete: boolean
  bonusXp: number
  bonusRewarded: boolean
  bonusAvailable: boolean
  totalXpAvailable: number
  totalXpEarnedToday: number
}

export interface BuildDailyMissionBoardInput extends DailyMissionActivityInput {
  rewardedIds: string[]
  missionDate: string
}

/**
 * Builds the dashboard daily mission board from activity and reward state.
 */
export function buildDailyMissionBoard(
  input: BuildDailyMissionBoardInput,
): DailyMissionBoard {
  const today = getLocalDateKey(input.date)
  const rewardedIds =
    input.missionDate === today ? new Set(input.rewardedIds) : new Set<string>()

  const counts = calculateMissionCounts(input)

  const missions: DailyMissionBoardItem[] = DAILY_MISSION_DEFINITIONS.map(
    (definition) => {
      const current = getMissionCurrentValue(definition, counts)
      const complete = isMissionComplete(definition, counts)
      return {
        id: definition.id,
        label: definition.label,
        description: definition.description,
        icon: definition.icon,
        xpReward: definition.xpReward,
        current: Math.min(current, definition.target),
        target: definition.target,
        complete,
        rewarded: rewardedIds.has(definition.id),
      }
    },
  )

  const completedCount = missions.filter((m) => m.complete).length
  const allComplete = completedCount === missions.length
  const bonusRewarded = rewardedIds.has(DAILY_MISSION_BONUS_ID)

  const totalXpEarnedToday = missions
    .filter((m) => m.rewarded)
    .reduce((sum, m) => sum + m.xpReward, 0) + (bonusRewarded ? DAILY_MISSION_BONUS_XP : 0)

  const totalXpAvailable =
    DAILY_MISSION_DEFINITIONS.reduce((sum, m) => sum + m.xpReward, 0) +
    DAILY_MISSION_BONUS_XP

  return {
    date: today,
    missions,
    completedCount,
    totalCount: missions.length,
    allComplete,
    bonusXp: DAILY_MISSION_BONUS_XP,
    bonusRewarded,
    bonusAvailable: allComplete && !bonusRewarded,
    totalXpAvailable,
    totalXpEarnedToday,
  }
}
