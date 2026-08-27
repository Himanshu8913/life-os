import { calculateLevel } from '@/domain/progression/calculate-level'
import { getAllAchievements } from '@/db/repositories/achievement-repository'
import { getAllFocusSessions } from '@/db/repositories/focus-repository'
import { getAllGoals } from '@/db/repositories/goal-repository'
import { getAllHabits } from '@/db/repositories/habit-repository'
import { getOrCreateProfile } from '@/db/repositories/profile-repository'
import { getAllQuests } from '@/db/repositories/quest-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import type { AchievementStats } from '@/domain/achievements/types'

const MS_PER_DAY = 86_400_000

/**
 * Gathers deterministic stats from local data for achievement rule evaluation.
 */
export async function buildAchievementStats(): Promise<AchievementStats> {
  const [
    quests,
    goals,
    habits,
    focusSessions,
    profile,
    achievements,
    events,
  ] = await Promise.all([
    getAllQuests(),
    getAllGoals(),
    getAllHabits(),
    getAllFocusSessions(),
    getOrCreateProfile(),
    getAllAchievements(),
    getAllTimelineEvents(),
  ])

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  let returnedAfterBreak = false
  if (sortedEvents.length >= 2) {
    const latest = new Date(sortedEvents[0].createdAt).getTime()
    const previous = new Date(sortedEvents[1].createdAt).getTime()
    returnedAfterBreak = (latest - previous) / MS_PER_DAY >= 7
  }

  const daysUsingApp = Math.floor(
    (Date.now() - new Date(profile.createdAt).getTime()) / MS_PER_DAY,
  )

  return {
    totalCompletedQuests: quests.filter((q) => q.status === 'COMPLETED').length,
    totalCompletedGoals: goals.filter((g) => g.status === 'COMPLETED').length,
    totalCompletedMilestones: goals
      .flatMap((g) => g.milestones)
      .filter((m) => m.completed).length,
    totalCompletedFocusSessions: focusSessions.filter((s) => s.completedAt).length,
    currentLevel: calculateLevel(profile.totalXp),
    longestStreak: habits.reduce((max, h) => Math.max(max, h.longestStreak), 0),
    returnedAfterBreak,
    daysUsingApp,
    unlockedDefinitionIds: new Set(achievements.map((a) => a.definitionId)),
  }
}
