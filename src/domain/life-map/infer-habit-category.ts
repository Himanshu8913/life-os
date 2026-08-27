import type { GoalCategory } from '@/types'

const KEYWORDS: Partial<Record<GoalCategory, string[]>> = {
  FITNESS: ['workout', 'run', 'gym', 'exercise', 'walk', 'yoga', 'fitness', 'train'],
  LEARNING: ['read', 'study', 'learn', 'book', 'course', 'practice'],
  FINANCE: ['budget', 'save', 'invest', 'money', 'finance'],
  RELATIONSHIPS: ['call', 'family', 'friend', 'social', 'connect'],
  CREATIVE: ['write', 'draw', 'design', 'create', 'art', 'music'],
  WORK: ['work', 'code', 'ship', 'build', 'project'],
  PERSONAL: ['meditate', 'journal', 'sleep', 'mindful'],
}

/**
 * Infers a life area for a habit from its name (habits have no category field).
 */
export function inferHabitCategory(name: string): GoalCategory {
  const lower = name.toLowerCase()
  for (const [category, words] of Object.entries(KEYWORDS) as [GoalCategory, string[]][]) {
    if (words.some((w) => lower.includes(w))) return category
  }
  return 'PERSONAL'
}
