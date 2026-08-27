import { checkAndUnlockAchievements } from '@/domain/achievements/check-achievements'
import { getAllAchievements } from '@/db/repositories/achievement-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { useAchievementStore } from '@/stores/achievement-store'
import { useGamificationStore } from '@/stores/gamification-store'
import { useTimelineStore } from '@/stores/timeline-store'

export interface GamificationEvent {
  leveledUp: boolean
  newLevel: number
}

/**
 * Runs achievement checks and triggers level-up UI after an XP-earning action.
 */
export async function syncGamificationAfterAction(
  event: GamificationEvent,
): Promise<void> {
  const unlocked = await checkAndUnlockAchievements()
  const achievements = await getAllAchievements()
  useAchievementStore.getState().setAchievements(achievements)

  if (unlocked.length > 0) {
    useAchievementStore.getState().queueUnlockToasts(unlocked)
    const events = await getAllTimelineEvents()
    useTimelineStore.getState().setEvents(events)
  }

  if (event.leveledUp) {
    useGamificationStore.getState().showLevelUp(event.newLevel)
  }
}
