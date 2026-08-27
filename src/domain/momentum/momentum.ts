import { getLocalDateKey, previousDateKey } from '@/lib/dates/date-utils'

/** Rolling window for momentum score (PLAN §11). */
export const MOMENTUM_WINDOW_DAYS = 21

export interface MomentumScore {
  /** 0–100 percentage of active days in the window. */
  score: number
  completedDays: number
  windowDays: number
}

/**
 * Computes momentum as completion frequency over a rolling window.
 *
 * Example: 18 completions in 21 days → ~86% momentum.
 *
 * @param completedAtTimestamps - ISO completion timestamps.
 * @param windowDays - Lookback period (default 21).
 * @param referenceDate - End of window (default today).
 */
export function calculateMomentum(
  completedAtTimestamps: string[],
  windowDays = MOMENTUM_WINDOW_DAYS,
  referenceDate = new Date(),
): MomentumScore {
  const endKey = getLocalDateKey(referenceDate)
  const windowKeys = new Set<string>()
  let cursor = endKey
  for (let i = 0; i < windowDays; i++) {
    windowKeys.add(cursor)
    cursor = previousDateKey(cursor)
  }

  const completionDays = new Set(
    completedAtTimestamps.map((ts) => getLocalDateKey(new Date(ts))),
  )

  let completedDays = 0
  for (const key of windowKeys) {
    if (completionDays.has(key)) completedDays++
  }

  const score =
    windowDays > 0
      ? Math.round((completedDays / windowDays) * 1000) / 10
      : 0

  return { score, completedDays, windowDays }
}

/**
 * Aggregates momentum across multiple habits (average score).
 */
export function calculateAggregateMomentum(
  habitCompletions: { habitId: string; completedAt: string }[],
  habitIds: string[],
  windowDays = MOMENTUM_WINDOW_DAYS,
): MomentumScore {
  if (!habitIds.length) {
    return { score: 0, completedDays: 0, windowDays }
  }

  const scores = habitIds.map((habitId) => {
    const timestamps = habitCompletions
      .filter((c) => c.habitId === habitId)
      .map((c) => c.completedAt)
    return calculateMomentum(timestamps, windowDays)
  })

  const avgScore =
    Math.round(
      (scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10,
    ) / 10
  const avgDays =
    Math.round(
      scores.reduce((sum, s) => sum + s.completedDays, 0) / scores.length,
    )

  return {
    score: avgScore,
    completedDays: avgDays,
    windowDays,
  }
}
