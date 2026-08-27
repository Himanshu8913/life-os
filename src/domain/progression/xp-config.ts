import type { QuestType } from '@/types'

/**
 * Central XP reward configuration (PLAN §38).
 * All domain actions should reference values from this module.
 */
export const XP_REWARDS = {
  quest: {
    DAILY: 25,
    SIDE: 50,
    MAIN: 200,
    EPIC: 500,
  } satisfies Record<QuestType, number>,
  habit: 20,
  milestone: 50,
  goal: 500,
  focusDefault: 50,
  focusLong: 100,
  focusLongMinutes: 60,
} as const

export function getDefaultXpForType(type: QuestType): number {
  return XP_REWARDS.quest[type]
}

export function getFocusXp(minutes: number): number {
  return minutes >= XP_REWARDS.focusLongMinutes
    ? XP_REWARDS.focusLong
    : XP_REWARDS.focusDefault
}
