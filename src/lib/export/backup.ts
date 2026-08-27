import { BACKUP_VERSION } from '@/types/enums'
import type { LifeOSBackup } from '@/types/backup'
import type { TimelineEvent } from '@/types'
import { clearAllTables, db } from '@/db/database'
import { getOrCreateProfile } from '@/db/repositories/profile-repository'
import { getOrCreateSettings, normalizeSettings } from '@/db/repositories/settings-repository'
import { getAllAchievements } from '@/db/repositories/achievement-repository'
import { getAllGoals } from '@/db/repositories/goal-repository'
import { getAllHabits, getHabitCompletions } from '@/db/repositories/habit-repository'
import { getAllQuests } from '@/db/repositories/quest-repository'
import { getAllReflections } from '@/db/repositories/reflection-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { validateBackup } from '@/lib/validation/backup-schema'

/**
 * Serializes all local Life OS data into a versioned backup object.
 */
export async function exportAllData(): Promise<LifeOSBackup> {
  const [
    profile,
    quests,
    goals,
    habits,
    habitCompletions,
    timeline,
    achievements,
    reflections,
    focusSessions,
    moodEntries,
    settings,
  ] = await Promise.all([
    getOrCreateProfile(),
    getAllQuests(),
    getAllGoals(),
    getAllHabits(),
    getHabitCompletions(),
    getAllTimelineEvents(),
    getAllAchievements(),
    getAllReflections(),
    db.focusSessions.toArray(),
    db.moodEntries.toArray(),
    getOrCreateSettings(),
  ])

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    profile,
    quests,
    goals,
    habits,
    habitCompletions,
    timeline,
    achievements,
    reflections,
    focusSessions,
    moodEntries,
    settings,
  }
}

/**
 * Triggers a browser download of `life-os-backup.json`.
 */
export async function downloadBackup(): Promise<void> {
  const backup = await exportAllData()
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'life-os-backup.json'
  anchor.click()
  URL.revokeObjectURL(url)
}

/**
 * Validates and replaces all local data with an imported backup.
 *
 * @param raw - Parsed JSON from a backup file.
 * @throws When validation fails or IndexedDB write fails.
 */
export async function importAllData(raw: unknown): Promise<void> {
  const result = validateBackup(raw)
  if (!result.success) {
    throw new Error(result.error)
  }

  const backup = result.data

  await clearAllTables()
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
      await db.profile.put(backup.profile)
      await db.settings.put(normalizeSettings(backup.settings))
      await db.quests.bulkPut(backup.quests)
      await db.goals.bulkPut(backup.goals)
      await db.habits.bulkPut(backup.habits)
      await db.habitCompletions.bulkPut(backup.habitCompletions)
      await db.timelineEvents.bulkPut(backup.timeline as TimelineEvent[])
      await db.achievements.bulkPut(backup.achievements)
      await db.reflections.bulkPut(backup.reflections)
      await db.focusSessions.bulkPut(backup.focusSessions)
      await db.moodEntries.bulkPut(backup.moodEntries)
    },
  )
}

/**
 * Wipes all entity data and restores default profile + settings.
 */
export async function resetAllData(): Promise<void> {
  await clearAllTables()
  await getOrCreateProfile()
  await getOrCreateSettings()
}
