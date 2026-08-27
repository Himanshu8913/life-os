import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import type { TimelineEventType } from '@/types'

export interface LogActivityResult {
  type: TimelineEventType
  title: string
  minutes: number
}

/**
 * Records a workout or reading session on the timeline (PLAN §26).
 */
export async function logActivity(
  activity: 'workout' | 'reading',
  minutes: number,
): Promise<LogActivityResult> {
  const type: TimelineEventType = activity === 'workout' ? 'WORKOUT' : 'READING'
  const label = activity === 'workout' ? 'Workout' : 'Reading'
  const title = `${label} — ${minutes}m`

  await addTimelineEvent({
    type,
    title,
    metadata: { minutes, activity },
  })

  return { type, title, minutes }
}
