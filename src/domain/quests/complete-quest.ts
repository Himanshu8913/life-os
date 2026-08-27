import { calculateLevel } from '@/domain/progression/calculate-level'
import {
  buildCompletionProfileUpdate,
  type QuestCompletionResult,
} from '@/domain/quests/quest-utils'
import { getOrCreateProfile, updateProfile } from '@/db/repositories/profile-repository'
import {
  getQuestById,
  updateQuest,
} from '@/db/repositories/quest-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import type { Quest } from '@/types'

export type { QuestCompletionResult }

/**
 * Marks a quest complete, awards XP, updates attributes, and logs timeline events.
 *
 * Side effects (all persisted to IndexedDB):
 * - Quest status → COMPLETED
 * - Profile totalXp + attribute rewards
 * - Timeline: QUEST_COMPLETED (+ LEVEL_UP if threshold crossed)
 *
 * @param questId - ID of the quest to complete.
 * @throws When quest is not found or already completed.
 */
export async function completeQuest(questId: string): Promise<QuestCompletionResult & { quest: Quest }> {
  const quest = await getQuestById(questId)
  if (!quest) throw new Error(`Quest not found: ${questId}`)
  if (quest.status === 'COMPLETED') {
    throw new Error(`Quest already completed: ${quest.title}`)
  }
  if (quest.status === 'CANCELLED' || quest.status === 'ARCHIVED') {
    throw new Error(`Cannot complete ${quest.status.toLowerCase()} quest`)
  }

  const profile = await getOrCreateProfile()
  const previousLevel = calculateLevel(profile.totalXp)
  const newLevel = calculateLevel(profile.totalXp + quest.xpReward)

  const completion = buildCompletionProfileUpdate(
    profile,
    quest,
    previousLevel,
    newLevel,
  )

  const completedAt = new Date().toISOString()
  const completedQuest = await updateQuest(questId, {
    status: 'COMPLETED',
    completedAt,
    milestones: quest.milestones?.map((m) => ({
      ...m,
      completed: true,
      completedAt: m.completedAt ?? completedAt,
    })),
  })

  await updateProfile({
    totalXp: completion.profile.totalXp,
    attributes: completion.profile.attributes,
  })

  await addTimelineEvent({
    type: 'QUEST_COMPLETED',
    title: `Completed: ${quest.title}`,
    description: `+${completion.xpGained} XP`,
    metadata: {
      questId: quest.id,
      questType: quest.type,
      xpGained: completion.xpGained,
    },
  })

  if (completion.leveledUp) {
    await addTimelineEvent({
      type: 'LEVEL_UP',
      title: `Level ${completion.newLevel}`,
      description: `You reached level ${completion.newLevel}!`,
      metadata: { level: completion.newLevel },
    })
  }

  return { ...completion, quest: completedQuest }
}
