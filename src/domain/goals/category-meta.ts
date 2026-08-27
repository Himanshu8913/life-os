import type { GoalCategory } from '@/types'

export const GOAL_CATEGORY_META: Record<
  GoalCategory,
  { label: string; icon: string }
> = {
  WORK: { label: 'Work', icon: '💼' },
  LEARNING: { label: 'Learning', icon: '📚' },
  FITNESS: { label: 'Fitness', icon: '🏋' },
  FINANCE: { label: 'Finance', icon: '💰' },
  RELATIONSHIPS: { label: 'Relationships', icon: '🤝' },
  PERSONAL: { label: 'Personal', icon: '✦' },
  CREATIVE: { label: 'Creative', icon: '🎨' },
  TRAVEL: { label: 'Travel', icon: '✈' },
  OTHER: { label: 'Other', icon: '○' },
}
