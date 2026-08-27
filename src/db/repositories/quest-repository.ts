import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { Quest, QuestStatus } from '@/types'

export async function getAllQuests(): Promise<Quest[]> {
  return db.quests.orderBy('createdAt').reverse().toArray()
}

export async function getQuestById(id: string): Promise<Quest | undefined> {
  return db.quests.get(id)
}

export async function createQuest(
  data: Omit<Quest, 'id' | 'createdAt'>,
): Promise<Quest> {
  const quest: Quest = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  await db.quests.add(quest)
  return quest
}

export async function updateQuest(
  id: string,
  updates: Partial<Omit<Quest, 'id' | 'createdAt'>>,
): Promise<Quest> {
  const existing = await db.quests.get(id)
  if (!existing) throw new Error(`Quest not found: ${id}`)
  const updated = { ...existing, ...updates }
  await db.quests.put(updated)
  return updated
}

export async function deleteQuest(id: string): Promise<void> {
  await db.quests.delete(id)
}

export async function getQuestsByStatus(status: QuestStatus): Promise<Quest[]> {
  return db.quests.where('status').equals(status).toArray()
}
