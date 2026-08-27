import type { QuestType } from '@/types'

/** Default XP rewards by quest type (PLAN §38). */
export const DEFAULT_XP_BY_TYPE: Record<QuestType, number> = {
  DAILY: 25,
  SIDE: 50,
  MAIN: 200,
  EPIC: 500,
}

/**
 * Returns the default XP reward for a quest type.
 *
 * @param type - Quest classification.
 */
export function getDefaultXpForType(type: QuestType): number {
  return DEFAULT_XP_BY_TYPE[type]
}
