import {
  getLocalDateKey,
  previousDateKey,
  uniqueCompletionDays,
} from '@/lib/dates/date-utils'

/**
 * Counts consecutive completion days ending today or yesterday.
 *
 * If today is not completed, the streak still counts from yesterday
 * (standard streak grace — missing today doesn't break until tomorrow).
 *
 * @param completedAtTimestamps - ISO timestamps of habit completions.
 */
export function calculateCurrentStreak(completedAtTimestamps: string[]): number {
  const days = uniqueCompletionDays(completedAtTimestamps)
  if (!days.length) return 0

  const daySet = new Set(days)
  const today = getLocalDateKey()
  const yesterday = previousDateKey(today)

  let cursor: string | null = null
  if (daySet.has(today)) cursor = today
  else if (daySet.has(yesterday)) cursor = yesterday
  else return 0

  let streak = 0
  while (cursor && daySet.has(cursor)) {
    streak++
    cursor = previousDateKey(cursor)
  }
  return streak
}

/**
 * Returns the longest run of consecutive completion days in history.
 *
 * @param completedAtTimestamps - ISO timestamps of habit completions.
 */
export function calculateLongestStreak(completedAtTimestamps: string[]): number {
  const days = uniqueCompletionDays(completedAtTimestamps)
  if (!days.length) return 0

  const ascending = [...days].sort((a, b) => a.localeCompare(b))
  let longest = 1
  let current = 1

  for (let i = 1; i < ascending.length; i++) {
    const [py, pm, pd] = ascending[i - 1].split('-').map(Number)
    const nextDay = new Date(py, pm - 1, pd)
    nextDay.setDate(nextDay.getDate() + 1)
    const expected = getLocalDateKey(nextDay)

    if (ascending[i] === expected) {
      current++
    } else {
      current = 1
    }
    longest = Math.max(longest, current)
  }

  return longest
}

export interface StreakStats {
  currentStreak: number
  longestStreak: number
}

/**
 * Derives current and longest streak from raw completion timestamps.
 */
export function calculateStreakStats(
  completedAtTimestamps: string[],
): StreakStats {
  const currentStreak = calculateCurrentStreak(completedAtTimestamps)
  const longestStreak = Math.max(
    calculateLongestStreak(completedAtTimestamps),
    currentStreak,
  )
  return { currentStreak, longestStreak }
}
