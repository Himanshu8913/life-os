import { calculateLevel } from '@/domain/progression/calculate-level'
import { HABIT_COMPLETION_XP } from '@/domain/habits/xp-config'
import { calculateStreakStats } from '@/domain/momentum/streak'
import {
  addHabitCompletion,
  getHabitById,
  getHabitCompletions,
  removeHabitCompletion,
  updateHabit,
} from '@/db/repositories/habit-repository'
import { getOrCreateProfile, updateProfile } from '@/db/repositories/profile-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import { getLocalDateKey } from '@/lib/dates/date-utils'
import type { Habit, HabitCompletion } from '@/types'

export interface HabitToggleResult {
  habit: Habit
  completion: HabitCompletion | null
  completed: boolean
  xpGained: number
  profileTotalXp: number
  leveledUp: boolean
  newLevel: number
}

function getTodayCompletion(
  completions: HabitCompletion[],
  habitId: string,
): HabitCompletion | undefined {
  const today = getLocalDateKey()
  return completions.find(
    (c) => c.habitId === habitId && getLocalDateKey(new Date(c.completedAt)) === today,
  )
}

async function syncStreaks(habitId: string): Promise<Habit> {
  const completions = await getHabitCompletions(habitId)
  const timestamps = completions.map((c) => c.completedAt)
  const { currentStreak, longestStreak } = calculateStreakStats(timestamps)
  return updateHabit(habitId, { currentStreak, longestStreak })
}

/**
 * Logs today's completion for a habit, awards XP, and updates streaks.
 *
 * @throws If habit not found or already completed today.
 */
export async function completeHabitToday(habitId: string): Promise<HabitToggleResult> {
  const habit = await getHabitById(habitId)
  if (!habit) throw new Error(`Habit not found: ${habitId}`)
  if (habit.archivedAt) throw new Error('Cannot complete archived habit')

  const allCompletions = await getHabitCompletions(habitId)
  if (getTodayCompletion(allCompletions, habitId)) {
    throw new Error(`Habit already completed today: ${habit.name}`)
  }

  const completion = await addHabitCompletion(habitId)
  const updatedHabit = await syncStreaks(habitId)

  const profile = await getOrCreateProfile()
  const previousLevel = calculateLevel(profile.totalXp)
  const updatedProfile = await updateProfile({
    totalXp: profile.totalXp + HABIT_COMPLETION_XP,
  })
  const newLevel = calculateLevel(updatedProfile.totalXp)

  await addTimelineEvent({
    type: 'HABIT_COMPLETED',
    title: `Habit: ${habit.name}`,
    description: `+${HABIT_COMPLETION_XP} XP`,
    metadata: { habitId, xpGained: HABIT_COMPLETION_XP },
  })

  if (newLevel > previousLevel) {
    await addTimelineEvent({
      type: 'LEVEL_UP',
      title: `Level ${newLevel}`,
      metadata: { level: newLevel },
    })
  }

  return {
    habit: updatedHabit,
    completion,
    completed: true,
    xpGained: HABIT_COMPLETION_XP,
    profileTotalXp: updatedProfile.totalXp,
    leveledUp: newLevel > previousLevel,
    newLevel,
  }
}

/**
 * Removes today's completion for a habit and recalculates streaks.
 *
 * Does not deduct XP (keeps progression forgiving).
 */
export async function uncompleteHabitToday(habitId: string): Promise<HabitToggleResult> {
  const habit = await getHabitById(habitId)
  if (!habit) throw new Error(`Habit not found: ${habitId}`)

  const allCompletions = await getHabitCompletions(habitId)
  const todayCompletion = getTodayCompletion(allCompletions, habitId)
  if (!todayCompletion) {
    throw new Error(`Habit not completed today: ${habit.name}`)
  }

  await removeHabitCompletion(todayCompletion.id)
  const updatedHabit = await syncStreaks(habitId)
  const profile = await getOrCreateProfile()

  return {
    habit: updatedHabit,
    completion: null,
    completed: false,
    xpGained: 0,
    profileTotalXp: profile.totalXp,
    leveledUp: false,
    newLevel: calculateLevel(profile.totalXp),
  }
}

/**
 * Toggles today's completion on or off.
 */
export async function toggleHabitToday(habitId: string): Promise<HabitToggleResult> {
  const allCompletions = await getHabitCompletions(habitId)
  const todayDone = getTodayCompletion(allCompletions, habitId)
  if (todayDone) return uncompleteHabitToday(habitId)
  return completeHabitToday(habitId)
}

/** @returns Whether the habit has a completion logged for today. */
export function isHabitCompletedToday(
  completions: HabitCompletion[],
  habitId: string,
): boolean {
  return getTodayCompletion(completions, habitId) !== undefined
}
