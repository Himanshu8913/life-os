import Dexie, { type EntityTable } from 'dexie'
import type {
  Achievement,
  AppSettings,
  FocusSession,
  Goal,
  Habit,
  HabitCompletion,
  MoodEntry,
  Quest,
  Reflection,
  TimelineEvent,
  UserProfile,
} from '@/types'

export interface MetaRecord {
  key: string
  value: string
}

/**
 * Dexie database for Life OS local persistence.
 *
 * Schema v2 adds all core entity tables. v1 only had `meta` for bootstrap flags.
 */
class LifeOSDatabase extends Dexie {
  meta!: EntityTable<MetaRecord, 'key'>
  profile!: EntityTable<UserProfile, 'id'>
  quests!: EntityTable<Quest, 'id'>
  goals!: EntityTable<Goal, 'id'>
  habits!: EntityTable<Habit, 'id'>
  habitCompletions!: EntityTable<HabitCompletion, 'id'>
  timelineEvents!: EntityTable<TimelineEvent, 'id'>
  achievements!: EntityTable<Achievement, 'id'>
  focusSessions!: EntityTable<FocusSession, 'id'>
  reflections!: EntityTable<Reflection, 'id'>
  moodEntries!: EntityTable<MoodEntry, 'id'>
  settings!: EntityTable<AppSettings, 'id'>

  constructor() {
    super('life-os')

    this.version(1).stores({
      meta: 'key',
    })

    this.version(2).stores({
      meta: 'key',
      profile: 'id',
      quests: 'id, status, type, goalId, createdAt',
      goals: 'id, status, category, createdAt',
      habits: 'id, archivedAt, createdAt',
      habitCompletions: 'id, habitId, completedAt',
      timelineEvents: 'id, type, createdAt',
      achievements: 'id, definitionId, unlockedAt',
      focusSessions: 'id, startedAt',
      reflections: 'id, weekStart, createdAt',
      moodEntries: 'id, loggedAt',
      settings: 'id',
    })
  }
}

export const db = new LifeOSDatabase()

/**
 * Opens the IndexedDB connection and records first-run initialization.
 *
 * @throws When Dexie cannot open or write to IndexedDB.
 */
export async function initDatabase(): Promise<void> {
  await db.open()
  const existing = await db.meta.get('initialized')
  if (!existing) {
    await db.meta.put({
      key: 'initialized',
      value: new Date().toISOString(),
    })
  }
}

/**
 * @returns `true` if the `initialized` meta record exists and is readable.
 */
export async function isDatabaseReady(): Promise<boolean> {
  try {
    await db.meta.get('initialized')
    return true
  } catch {
    return false
  }
}

/**
 * Clears every entity table while preserving the bootstrap meta flag.
 */
export async function clearAllTables(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.profile,
      db.quests,
      db.goals,
      db.habits,
      db.habitCompletions,
      db.timelineEvents,
      db.achievements,
      db.focusSessions,
      db.reflections,
      db.moodEntries,
      db.settings,
    ],
    async () => {
      await Promise.all([
        db.profile.clear(),
        db.quests.clear(),
        db.goals.clear(),
        db.habits.clear(),
        db.habitCompletions.clear(),
        db.timelineEvents.clear(),
        db.achievements.clear(),
        db.focusSessions.clear(),
        db.reflections.clear(),
        db.moodEntries.clear(),
        db.settings.clear(),
      ])
    },
  )
}
