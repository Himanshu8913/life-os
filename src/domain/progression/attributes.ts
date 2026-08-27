import type { AttributeReward, LifeAttributeKey } from '@/types'

const ATTRIBUTE_MAX = 100
const ATTRIBUTE_MIN = 0

/** Default attribute rewards for focus session completion (PLAN §27). */
export const FOCUS_ATTRIBUTE_REWARDS: AttributeReward[] = [
  { attribute: 'discipline', amount: 2 },
]

/**
 * Applies attribute rewards to a profile, clamping each attribute to 0–100.
 */
export function applyAttributeRewards(
  attributes: Record<LifeAttributeKey, number>,
  rewards: AttributeReward[] | undefined,
): Record<LifeAttributeKey, number> {
  if (!rewards?.length) return attributes

  const next = { ...attributes }
  for (const { attribute, amount } of rewards) {
    next[attribute] = Math.min(
      ATTRIBUTE_MAX,
      Math.max(ATTRIBUTE_MIN, next[attribute] + amount),
    )
  }
  return next
}
