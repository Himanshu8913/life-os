import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { TimelineEvent, TimelineEventType } from '@/types'

export async function getAllTimelineEvents(): Promise<TimelineEvent[]> {
  return db.timelineEvents.orderBy('createdAt').reverse().toArray()
}

export async function addTimelineEvent(
  data: Omit<TimelineEvent, 'id' | 'createdAt'>,
): Promise<TimelineEvent> {
  const event: TimelineEvent = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  await db.timelineEvents.add(event)
  return event
}

export async function getTimelineEventsByType(
  type: TimelineEventType,
): Promise<TimelineEvent[]> {
  return db.timelineEvents.where('type').equals(type).toArray()
}
