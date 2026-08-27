import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { MoodEntry } from '@/types'

export async function getAllMoodEntries(): Promise<MoodEntry[]> {
  return db.moodEntries.orderBy('loggedAt').reverse().toArray()
}

export async function createMoodEntry(
  data: Omit<MoodEntry, 'id' | 'loggedAt'>,
): Promise<MoodEntry> {
  const entry: MoodEntry = {
    ...data,
    id: generateId(),
    loggedAt: new Date().toISOString(),
  }
  await db.moodEntries.add(entry)
  return entry
}
