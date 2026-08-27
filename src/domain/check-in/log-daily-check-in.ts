import { createMoodEntry } from '@/db/repositories/mood-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import type { MoodEntry } from '@/types'

const MOOD_LABELS = ['', 'Awful', 'Low', 'Okay', 'Good', 'Great'] as const

export interface LogDailyCheckInInput {
  mood: number
  energy: number
  focus: number
  note?: string
}

export interface LogDailyCheckInResult {
  entry: MoodEntry
}

/**
 * Logs a full mood / energy / focus check-in (scales 1–5).
 */
export async function logDailyCheckIn(
  input: LogDailyCheckInInput,
): Promise<LogDailyCheckInResult> {
  const { mood, energy, focus, note } = input

  if (
    [mood, energy, focus].some((v) => !Number.isInteger(v) || v < 1 || v > 5)
  ) {
    throw new Error('Mood, energy, and focus must be integers from 1 to 5.')
  }

  const entry = await createMoodEntry({
    mood,
    energy,
    focus,
    note: note?.trim() || undefined,
  })

  await addTimelineEvent({
    type: 'MOOD_LOGGED',
    title: `Check-in: ${MOOD_LABELS[mood]} mood`,
    metadata: { mood, energy, focus },
  })

  return { entry }
}
