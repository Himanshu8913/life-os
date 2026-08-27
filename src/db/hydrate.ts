import { getAllAchievements } from '@/db/repositories/achievement-repository'
import { getAllGoals } from '@/db/repositories/goal-repository'
import { getAllHabits, getHabitCompletions } from '@/db/repositories/habit-repository'
import { getOrCreateProfile } from '@/db/repositories/profile-repository'
import { getAllQuests } from '@/db/repositories/quest-repository'
import { getAllReflections } from '@/db/repositories/reflection-repository'
import { getOrCreateSettings } from '@/db/repositories/settings-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { seedDemoData } from '@/db/seed'
import { db } from '@/db/database'
import { useAchievementStore } from '@/stores/achievement-store'
import { useGoalStore } from '@/stores/goal-store'
import { useHabitStore } from '@/stores/habit-store'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useReflectionStore } from '@/stores/reflection-store'
import { useSettingsStore } from '@/stores/settings-store'
import { useTimelineStore } from '@/stores/timeline-store'

/**
 * Loads all persisted data into Zustand stores and seeds demo content on first run.
 */
export async function hydrateStores(): Promise<void> {
  await getOrCreateProfile()
  await getOrCreateSettings()
  await seedDemoData()

  const [
    profile,
    settings,
    quests,
    goals,
    habits,
    habitCompletions,
    timeline,
    achievements,
    reflections,
    focusSessions,
    moodEntries,
  ] = await Promise.all([
    getOrCreateProfile(),
    getOrCreateSettings(),
    getAllQuests(),
    getAllGoals(),
    getAllHabits(),
    getHabitCompletions(),
    getAllTimelineEvents(),
    getAllAchievements(),
    getAllReflections(),
    db.focusSessions.toArray(),
    db.moodEntries.toArray(),
  ])

  useProfileStore.getState().setProfile(profile)
  useSettingsStore.getState().hydrateFromDb(settings)
  useQuestStore.getState().setQuests(quests)
  useGoalStore.getState().setGoals(goals)
  useHabitStore.getState().setHabits(habits, habitCompletions)
  useTimelineStore.getState().setEvents(timeline)
  useAchievementStore.getState().setAchievements(achievements)
  useReflectionStore.getState().setReflections(reflections)

  useProfileStore.getState().setFocusSessions(focusSessions)
  useProfileStore.getState().setMoodEntries(moodEntries)
}

/**
 * Re-reads all tables from IndexedDB into stores (after import/reset).
 */
export async function reloadStores(): Promise<void> {
  await hydrateStores()
}
