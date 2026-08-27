import { generateId } from '@/lib/ids/generate-id'
import { createGoal } from '@/db/repositories/goal-repository'
import { createHabit } from '@/db/repositories/habit-repository'
import { createQuest } from '@/db/repositories/quest-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import { updateProfile } from '@/db/repositories/profile-repository'
import {
  getOrCreateSettings,
  markSeedDataLoaded,
} from '@/db/repositories/settings-repository'

/**
 * Populates the database with demo quests, goals, and habits for first-time users.
 *
 * No-op when seed data was already loaded (tracked in settings).
 */
export async function seedDemoData(): Promise<void> {
  const settings = await getOrCreateSettings()
  if (settings.seedDataLoaded) return

  const goal = await createGoal({
    title: 'Launch Life OS',
    description: 'Build and ship the personal operating system MVP.',
    category: 'CREATIVE',
    status: 'ACTIVE',
    targetDate: new Date(Date.now() + 90 * 86_400_000).toISOString(),
    progress: 33,
    milestones: [
      { id: generateId(), title: 'Plan', completed: true, order: 0, completedAt: new Date().toISOString() },
      { id: generateId(), title: 'Foundation', completed: true, order: 1, completedAt: new Date().toISOString() },
      { id: generateId(), title: 'Data Layer', completed: false, order: 2 },
      { id: generateId(), title: 'Quest System', completed: false, order: 3 },
      { id: generateId(), title: 'Launch', completed: false, order: 4 },
    ],
    linkedQuestIds: [],
  })

  await createQuest({
    title: 'Read 20 pages',
    type: 'DAILY',
    status: 'TODO',
    priority: 'MEDIUM',
    xpReward: 50,
    goalId: goal.id,
    tags: ['learning'],
  })

  await createQuest({
    title: 'Morning workout',
    type: 'DAILY',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    xpReward: 100,
    attributeRewards: [{ attribute: 'fitness', amount: 2 }],
    tags: ['fitness'],
  })

  await createQuest({
    title: 'Build side project',
    type: 'MAIN',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    xpReward: 200,
    goalId: goal.id,
    milestones: [
      { id: generateId(), title: 'Research', completed: true, order: 0 },
      { id: generateId(), title: 'Design', completed: true, order: 1 },
      { id: generateId(), title: 'MVP', completed: false, order: 2 },
    ],
  })

  await createHabit({
    name: 'Workout',
    description: 'Move your body daily',
    frequency: 'DAILY',
    target: 1,
  })

  await createHabit({
    name: 'Read',
    description: 'Read something meaningful',
    frequency: 'DAILY',
    target: 1,
  })

  await updateProfile({
    displayName: 'Commander',
    totalXp: 240,
    attributes: {
      discipline: 62,
      creativity: 71,
      fitness: 58,
      learning: 74,
      social: 55,
      finance: 60,
    },
  })

  await addTimelineEvent({
    type: 'GOAL_CREATED',
    title: 'Goal created: Launch Life OS',
    description: 'A new main quest line begins.',
  })

  await addTimelineEvent({
    type: 'CUSTOM',
    title: 'Life OS initialized',
    description: 'Your personal command center is online.',
  })

  await markSeedDataLoaded()
}
