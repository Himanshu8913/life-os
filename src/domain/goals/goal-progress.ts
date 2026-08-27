import type { Goal, Milestone } from '@/types'

/**
 * Computes goal progress from completed milestones (PLAN §14).
 *
 * @param milestones - Goal milestones; empty array yields 0%.
 * @returns Progress percentage 0–100.
 */
export function calculateGoalProgress(milestones: Milestone[]): number {
  if (!milestones.length) return 0
  const completed = milestones.filter((m) => m.completed).length
  return Math.round((completed / milestones.length) * 1000) / 10
}

/**
 * Applies milestone-based progress to a goal object.
 *
 * @param goal - Goal to derive progress for.
 */
export function withComputedProgress(goal: Goal): Goal {
  return {
    ...goal,
    progress: calculateGoalProgress(goal.milestones),
  }
}

/**
 * Returns whether every milestone on the goal is completed.
 */
export function areAllMilestonesComplete(goal: Goal): boolean {
  if (!goal.milestones.length) return false
  return goal.milestones.every((m) => m.completed)
}

/**
 * Reorders milestones by moving one item up or down.
 *
 * @param milestones - Current milestone list.
 * @param milestoneId - ID of the milestone to move.
 * @param direction - `-1` for up, `+1` for down.
 */
export function reorderMilestones(
  milestones: Milestone[],
  milestoneId: string,
  direction: -1 | 1,
): Milestone[] {
  const sorted = [...milestones].sort((a, b) => a.order - b.order)
  const index = sorted.findIndex((m) => m.id === milestoneId)
  if (index < 0) return milestones
  const target = index + direction
  if (target < 0 || target >= sorted.length) return milestones

  const next = [...sorted]
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next.map((m, order) => ({ ...m, order }))
}
