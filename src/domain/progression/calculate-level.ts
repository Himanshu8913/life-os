/** XP required to reach each level (index = level - 1). Level 1 starts at 0 XP. */
export const LEVEL_THRESHOLDS = [
  0, 500, 1000, 1750, 2750, 4000, 5500, 7250, 9250, 11500,
  14000, 16750, 19750, 23000, 26500, 30250, 34250, 38500, 43000, 47750,
  52750, 58000, 63500, 69250, 75250,
] as const

export interface LevelProgress {
  level: number
  currentXp: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  progressPercent: number
}

/**
 * Derives the player's level from cumulative XP.
 *
 * Level is never stored as source of truth — always computed from `totalXp`.
 *
 * @param totalXp - Lifetime XP earned.
 * @returns Current level (minimum 1).
 */
export function calculateLevel(totalXp: number): number {
  let level = 1
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
      break
    }
  }
  if (totalXp >= LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]) {
    const lastThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
    const extraLevels = Math.floor((totalXp - lastThreshold) / 5000)
    level = LEVEL_THRESHOLDS.length + extraLevels
  }
  return level
}

/**
 * Computes XP progress within the current level for UI display.
 *
 * @param totalXp - Lifetime XP earned.
 * @returns Level, bounds, and fill percentage for progress bars.
 */
export function calculateXpProgress(totalXp: number): LevelProgress {
  const level = calculateLevel(totalXp)
  const xpForCurrentLevel = LEVEL_THRESHOLDS[level - 1] ?? 0
  const xpForNextLevel =
    LEVEL_THRESHOLDS[level] ?? xpForCurrentLevel + 5000
  const span = xpForNextLevel - xpForCurrentLevel
  const currentXp = totalXp - xpForCurrentLevel
  const progressPercent =
    span > 0 ? Math.min(100, (currentXp / span) * 100) : 100

  return {
    level,
    currentXp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent,
  }
}
