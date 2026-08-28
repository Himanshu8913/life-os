import { calculateLevel } from '@/domain/progression/calculate-level'
import {
  buildDailyMissionBoard,
  type DailyMissionBoard,
} from '@/domain/daily-missions/build-daily-mission-board'
import {
  calculateMissionCounts,
  isMissionComplete,
  type DailyMissionActivityInput,
} from '@/domain/daily-missions/calculate-mission-progress'
import {
  DAILY_MISSION_BONUS_ID,
  DAILY_MISSION_BONUS_XP,
  DAILY_MISSION_DEFINITIONS,
} from '@/domain/daily-missions/mission-definitions'
import { getOrCreateProfile, updateProfile } from '@/db/repositories/profile-repository'
import {
  getOrCreateSettings,
  updateSettings,
} from '@/db/repositories/settings-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import { getLocalDateKey } from '@/lib/dates/date-utils'
import type { UserProfile } from '@/types'

export interface DailyMissionRewardResult {
  board: DailyMissionBoard
  xpAwarded: number
  rewardedLabels: string[]
  profile: UserProfile
  leveledUp: boolean
  newLevel: number
}

function getRewardedIdsForToday(
  missionDate: string | undefined,
  rewardedIds: string[] | undefined,
  today: string,
): string[] {
  if (missionDate !== today) return []
  return rewardedIds ?? []
}

/**
 * Awards XP for newly completed daily missions and the all-complete bonus.
 */
export async function awardDailyMissionRewards(
  activity: DailyMissionActivityInput,
): Promise<DailyMissionRewardResult> {
  const today = getLocalDateKey(activity.date)
  const settings = await getOrCreateSettings()
  const rewardedIds = getRewardedIdsForToday(
    settings.dailyMissionDate,
    settings.dailyMissionRewardedIds,
    today,
  )
  const rewardedSet = new Set(rewardedIds)

  const counts = calculateMissionCounts(activity)
  const profile = await getOrCreateProfile()
  const previousLevel = calculateLevel(profile.totalXp)

  let xpAwarded = 0
  const rewardedLabels: string[] = []
  const newlyRewarded: string[] = []

  for (const definition of DAILY_MISSION_DEFINITIONS) {
    if (rewardedSet.has(definition.id)) continue
    if (!isMissionComplete(definition, counts)) continue

    xpAwarded += definition.xpReward
    rewardedLabels.push(definition.label)
    newlyRewarded.push(definition.id)
    rewardedSet.add(definition.id)
  }

  const allMissionsComplete = DAILY_MISSION_DEFINITIONS.every((d) =>
    isMissionComplete(d, counts),
  )
  if (
    allMissionsComplete &&
    !rewardedSet.has(DAILY_MISSION_BONUS_ID)
  ) {
    xpAwarded += DAILY_MISSION_BONUS_XP
    rewardedLabels.push('Daily bonus')
    newlyRewarded.push(DAILY_MISSION_BONUS_ID)
    rewardedSet.add(DAILY_MISSION_BONUS_ID)
  }

  let updatedProfile = profile
  if (xpAwarded > 0) {
    updatedProfile = await updateProfile({
      totalXp: profile.totalXp + xpAwarded,
    })

    for (const label of rewardedLabels) {
      await addTimelineEvent({
        type: 'CUSTOM',
        title: `Daily mission: ${label}`,
        description: 'Mission reward earned',
        metadata: { dailyMission: true, label },
      })
    }

    const newLevel = calculateLevel(updatedProfile.totalXp)
    if (newLevel > previousLevel) {
      await addTimelineEvent({
        type: 'LEVEL_UP',
        title: `Level ${newLevel} reached`,
        metadata: { level: newLevel },
      })
    }
  }

  if (newlyRewarded.length > 0 || settings.dailyMissionDate !== today) {
    await updateSettings({
      dailyMissionDate: today,
      dailyMissionRewardedIds: [...rewardedSet],
    })
  }

  const board = buildDailyMissionBoard({
    ...activity,
    missionDate: today,
    rewardedIds: [...rewardedSet],
  })

  const newLevel = calculateLevel(updatedProfile.totalXp)

  return {
    board,
    xpAwarded,
    rewardedLabels,
    profile: updatedProfile,
    leveledUp: newLevel > previousLevel,
    newLevel,
  }
}
