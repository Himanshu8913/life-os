import { calculateLevel } from '@/domain/progression/calculate-level'
import {
  GOAL_COMPLETION_XP,
  MILESTONE_COMPLETION_XP,
} from '@/domain/goals/xp-config'
import {
  areAllMilestonesComplete,
  calculateGoalProgress,
  withComputedProgress,
} from '@/domain/goals/goal-progress'
import { getOrCreateProfile, updateProfile } from '@/db/repositories/profile-repository'
import {
  getGoalById,
  updateGoal,
} from '@/db/repositories/goal-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import { generateId } from '@/lib/ids/generate-id'
import type { Goal, Milestone } from '@/types'

export interface MilestoneCompletionResult {
  goal: Goal
  xpGained: number
  goalCompleted: boolean
  profileTotalXp: number
  leveledUp: boolean
  newLevel: number
}

/**
 * Toggles a milestone's completion state and recalculates goal progress.
 *
 * Awards milestone XP on completion. Auto-completes the goal when all
 * milestones are done, awarding additional goal completion XP.
 */
export async function completeMilestone(
  goalId: string,
  milestoneId: string,
  completed = true,
): Promise<MilestoneCompletionResult> {
  const goal = await getGoalById(goalId)
  if (!goal) throw new Error(`Goal not found: ${goalId}`)

  const milestone = goal.milestones.find((m) => m.id === milestoneId)
  if (!milestone) throw new Error(`Milestone not found: ${milestoneId}`)

  const profile = await getOrCreateProfile()
  const baseLevel = calculateLevel(profile.totalXp)

  if (milestone.completed === completed) {
    return {
      goal,
      xpGained: 0,
      goalCompleted: false,
      profileTotalXp: profile.totalXp,
      leveledUp: false,
      newLevel: baseLevel,
    }
  }

  if (goal.status !== 'ACTIVE' && goal.status !== 'COMPLETED') {
    throw new Error('Cannot update milestones on inactive goal')
  }

  const now = new Date().toISOString()
  const milestones: Milestone[] = goal.milestones.map((m) =>
    m.id === milestoneId
      ? { ...m, completed, completedAt: completed ? now : undefined }
      : m,
  )

  let xpGained = completed ? MILESTONE_COMPLETION_XP : 0
  let goalCompleted = false
  let updatedGoal: Goal

  if (completed) {
    await addTimelineEvent({
      type: 'MILESTONE_COMPLETED',
      title: `Milestone: ${milestone.title}`,
      description: `+${MILESTONE_COMPLETION_XP} XP`,
      metadata: { goalId, milestoneId },
    })
  }

  if (completed && areAllMilestonesComplete({ ...goal, milestones })) {
    updatedGoal = await updateGoal(goalId, {
      milestones,
      progress: 100,
      status: 'COMPLETED',
      completedAt: now,
    })
    await addTimelineEvent({
      type: 'GOAL_COMPLETED',
      title: `Goal completed: ${goal.title}`,
      description: `+${GOAL_COMPLETION_XP} XP`,
      metadata: { goalId },
    })
    xpGained += GOAL_COMPLETION_XP
    goalCompleted = true
  } else if (!completed && goal.status === 'COMPLETED') {
    updatedGoal = await updateGoal(goalId, {
      milestones,
      progress: calculateGoalProgress(milestones),
      status: 'ACTIVE',
      completedAt: undefined,
    })
  } else {
    updatedGoal = await updateGoal(goalId, {
      milestones,
      progress: calculateGoalProgress(milestones),
    })
  }

  updatedGoal = withComputedProgress(updatedGoal)

  let profileTotalXp = profile.totalXp
  let leveledUp = false
  let newLevel = baseLevel

  if (xpGained > 0) {
    const previousLevel = calculateLevel(profile.totalXp)
    const updatedProfile = await updateProfile({
      totalXp: profile.totalXp + xpGained,
    })
    profileTotalXp = updatedProfile.totalXp
    newLevel = calculateLevel(updatedProfile.totalXp)
    leveledUp = newLevel > previousLevel

    if (leveledUp) {
      await addTimelineEvent({
        type: 'LEVEL_UP',
        title: `Level ${newLevel}`,
        description: `You reached level ${newLevel}!`,
        metadata: { level: newLevel },
      })
    }
  }

  return {
    goal: updatedGoal,
    xpGained,
    goalCompleted,
    profileTotalXp,
    leveledUp,
    newLevel,
  }
}

/**
 * Marks a goal as completed, awards XP, and logs timeline events.
 */
export async function completeGoal(goalId: string): Promise<MilestoneCompletionResult> {
  const goal = await getGoalById(goalId)
  if (!goal) throw new Error(`Goal not found: ${goalId}`)
  if (goal.status === 'COMPLETED') {
    throw new Error(`Goal already completed: ${goal.title}`)
  }

  const profile = await getOrCreateProfile()
  const now = new Date().toISOString()
  const milestones = goal.milestones.map((m) => ({
    ...m,
    completed: true,
    completedAt: m.completedAt ?? now,
  }))

  const updatedGoal = await updateGoal(goalId, {
    milestones,
    status: 'COMPLETED',
    completedAt: now,
    progress: 100,
  })

  await addTimelineEvent({
    type: 'GOAL_COMPLETED',
    title: `Goal completed: ${goal.title}`,
    description: `+${GOAL_COMPLETION_XP} XP`,
    metadata: { goalId },
  })

  const previousLevel = calculateLevel(profile.totalXp)
  const updatedProfile = await updateProfile({
    totalXp: profile.totalXp + GOAL_COMPLETION_XP,
  })
  const newLevel = calculateLevel(updatedProfile.totalXp)
  const leveledUp = newLevel > previousLevel

  if (leveledUp) {
    await addTimelineEvent({
      type: 'LEVEL_UP',
      title: `Level ${newLevel}`,
      metadata: { level: newLevel },
    })
  }

  return {
    goal: updatedGoal,
    xpGained: GOAL_COMPLETION_XP,
    goalCompleted: true,
    profileTotalXp: updatedProfile.totalXp,
    leveledUp,
    newLevel,
  }
}

/** Adds a new milestone to an active goal. */
export async function addMilestone(goalId: string, title: string): Promise<Goal> {
  const goal = await getGoalById(goalId)
  if (!goal) throw new Error(`Goal not found: ${goalId}`)

  const milestone: Milestone = {
    id: generateId(),
    title: title.trim(),
    completed: false,
    order: goal.milestones.length,
  }

  const milestones = [...goal.milestones, milestone]
  return updateGoal(goalId, {
    milestones,
    progress: calculateGoalProgress(milestones),
  })
}

/** Removes a milestone and reindexes remaining items. */
export async function removeMilestone(
  goalId: string,
  milestoneId: string,
): Promise<Goal> {
  const goal = await getGoalById(goalId)
  if (!goal) throw new Error(`Goal not found: ${goalId}`)

  const milestones = goal.milestones
    .filter((m) => m.id !== milestoneId)
    .map((m, order) => ({ ...m, order }))

  return updateGoal(goalId, {
    milestones,
    progress: calculateGoalProgress(milestones),
  })
}

/** Links a quest to a goal (bidirectional list on goal). */
export async function linkQuestToGoal(
  goalId: string,
  questId: string,
): Promise<Goal> {
  const goal = await getGoalById(goalId)
  if (!goal) throw new Error(`Goal not found: ${goalId}`)

  const linkedQuestIds = goal.linkedQuestIds.includes(questId)
    ? goal.linkedQuestIds
    : [...goal.linkedQuestIds, questId]

  return updateGoal(goalId, { linkedQuestIds })
}
