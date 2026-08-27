import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { FocusSession } from '@/types'

export async function getAllFocusSessions(): Promise<FocusSession[]> {
  return db.focusSessions.orderBy('startedAt').reverse().toArray()
}

export async function createFocusSession(
  data: Omit<FocusSession, 'id'>,
): Promise<FocusSession> {
  const session: FocusSession = {
    ...data,
    id: generateId(),
  }
  await db.focusSessions.add(session)
  return session
}

export async function updateFocusSession(
  id: string,
  updates: Partial<Omit<FocusSession, 'id'>>,
): Promise<FocusSession> {
  const existing = await db.focusSessions.get(id)
  if (!existing) throw new Error(`Focus session not found: ${id}`)
  const updated = { ...existing, ...updates }
  await db.focusSessions.put(updated)
  return updated
}

export async function deleteFocusSession(id: string): Promise<void> {
  await db.focusSessions.delete(id)
}
