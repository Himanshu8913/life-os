import { parseMoodValue } from '@/domain/commands/parse-command'
import { createMoodEntry } from '@/db/repositories/mood-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import type { MoodEntry } from '@/types'

const MOOD_LABELS = ['', 'Awful', 'Low', 'Okay', 'Good', 'Great'] as const

export interface LogMoodResult {
  entry: MoodEntry
  label: string
}

/**
 * Logs a mood check-in from a text label or numeric value (1–5).
 */
export async function logMood(label: string): Promise<LogMoodResult> {
  const mood = parseMoodValue(label)
  if (mood === null) {
    throw new Error(`Unknown mood: "${label}". Try happy, neutral, or 1–5.`)
  }

  const entry = await createMoodEntry({
    mood,
    energy: mood,
    focus: 3,
    note: label.trim(),
  })

  await addTimelineEvent({
    type: 'MOOD_LOGGED',
    title: `Mood logged: ${MOOD_LABELS[mood]}`,
    metadata: { mood, label: label.trim() },
  })

  return { entry, label: MOOD_LABELS[mood] }
}
