import { ACHIEVEMENT_DEFINITIONS } from '@/domain/achievements/definitions'
import { buildAchievementStats } from '@/domain/achievements/build-stats'
import {
  getAchievementByDefinitionId,
  unlockAchievement,
} from '@/db/repositories/achievement-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import type { Achievement } from '@/types'

/**
 * Evaluates achievement rules and unlocks any newly earned achievements.
 */
export async function checkAndUnlockAchievements(): Promise<Achievement[]> {
  const stats = await buildAchievementStats()
  const newlyUnlocked: Achievement[] = []

  for (const definition of ACHIEVEMENT_DEFINITIONS) {
    if (stats.unlockedDefinitionIds.has(definition.id)) continue
    if (!definition.check(stats)) continue

    const existing = await getAchievementByDefinitionId(definition.id)
    if (existing) continue

    const achievement = await unlockAchievement({
      definitionId: definition.id,
      title: definition.title,
      description: definition.description,
      hidden: definition.hidden,
    })

    await addTimelineEvent({
      type: 'ACHIEVEMENT_UNLOCKED',
      title: `Achievement: ${definition.title}`,
      description: definition.description,
      metadata: { achievementId: achievement.id, definitionId: definition.id },
    })

    newlyUnlocked.push(achievement)
    stats.unlockedDefinitionIds.add(definition.id)
  }

  return newlyUnlocked
}
