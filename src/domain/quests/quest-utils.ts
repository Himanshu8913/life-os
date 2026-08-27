import type { Quest, UserProfile } from '@/types'
import { applyAttributeRewards } from '@/domain/progression/attributes'

export { applyAttributeRewards }

/**
 * Computes milestone completion percentage for quests with objectives.
 *
 * @param quest - Quest possibly containing milestones.
 * @returns 0–100 progress, or 100 when quest is completed without milestones.
 */
export function calculateQuestProgress(quest: Quest): number {
  if (quest.status === 'COMPLETED') return 100
  if (!quest.milestones?.length) return 0
  const done = quest.milestones.filter((m) => m.completed).length
  return Math.round((done / quest.milestones.length) * 100)
}

export interface QuestCompletionResult {
  xpGained: number
  leveledUp: boolean
  previousLevel: number
  newLevel: number
  profile: UserProfile
  quest: Quest
}

/**
 * Pure helper: computes post-completion profile state before persistence.
 *
 * @param profile - Current user profile.
 * @param quest - Quest being completed.
 * @param previousLevel - Level before XP gain.
 * @param newLevel - Level after XP gain.
 */
export function buildCompletionProfileUpdate(
  profile: UserProfile,
  quest: Quest,
  previousLevel: number,
  newLevel: number,
): Pick<QuestCompletionResult, 'xpGained' | 'leveledUp' | 'previousLevel' | 'newLevel' | 'profile'> {
  const xpGained = quest.xpReward
  return {
    xpGained,
    leveledUp: newLevel > previousLevel,
    previousLevel,
    newLevel,
    profile: {
      ...profile,
      totalXp: profile.totalXp + xpGained,
      attributes: applyAttributeRewards(profile.attributes, quest.attributeRewards),
      updatedAt: new Date().toISOString(),
    },
  }
}
