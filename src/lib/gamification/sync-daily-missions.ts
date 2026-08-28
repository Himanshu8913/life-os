import {
  awardDailyMissionRewards,
  type DailyMissionRewardResult,
} from '@/domain/daily-missions/award-mission-rewards'
import { buildDailyMissionBoard } from '@/domain/daily-missions/build-daily-mission-board'
import type { DailyMissionActivityInput } from '@/domain/daily-missions/calculate-mission-progress'
import { getOrCreateSettings } from '@/db/repositories/settings-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { getLocalDateKey } from '@/lib/dates/date-utils'
import { syncGamificationAfterAction } from '@/lib/gamification/sync-gamification'
import { useHabitStore } from '@/stores/habit-store'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimelineStore } from '@/stores/timeline-store'

export type { DailyMissionActivityInput, DailyMissionRewardResult }

export function collectDailyMissionActivity(): DailyMissionActivityInput {
  const quests = useQuestStore.getState().quests
  const habitCompletions = useHabitStore.getState().completions
  const { moodEntries, focusSessions } = useProfileStore.getState()

  return {
    quests,
    habitCompletions,
    moodEntries,
    focusSessions,
  }
}

/**
 * Awards pending daily mission XP and refreshes related stores.
 */
export async function syncDailyMissions(
  activity: DailyMissionActivityInput = collectDailyMissionActivity(),
): Promise<DailyMissionRewardResult> {
  const result = await awardDailyMissionRewards(activity)

  if (result.xpAwarded > 0) {
    useProfileStore.getState().setProfile(result.profile)
    const events = await getAllTimelineEvents()
    useTimelineStore.getState().setEvents(events)
    await syncGamificationAfterAction({
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
    })
  }

  return result
}

/**
 * Builds the mission board without awarding XP (display-only).
 */
export async function getDailyMissionBoard(
  activity: DailyMissionActivityInput = collectDailyMissionActivity(),
) {
  const today = getLocalDateKey(activity.date)
  const settings = await getOrCreateSettings()
  const rewardedIds =
    settings.dailyMissionDate === today
      ? (settings.dailyMissionRewardedIds ?? [])
      : []

  return buildDailyMissionBoard({
    ...activity,
    missionDate: settings.dailyMissionDate ?? '',
    rewardedIds,
  })
}
