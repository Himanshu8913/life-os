import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { Achievement } from '@/types'

export async function getAllAchievements(): Promise<Achievement[]> {
  return db.achievements.orderBy('unlockedAt').reverse().toArray()
}

export async function getAchievementByDefinitionId(
  definitionId: string,
): Promise<Achievement | undefined> {
  return db.achievements.where('definitionId').equals(definitionId).first()
}

export async function unlockAchievement(
  data: Omit<Achievement, 'id' | 'unlockedAt'>,
): Promise<Achievement> {
  const achievement: Achievement = {
    ...data,
    id: generateId(),
    unlockedAt: new Date().toISOString(),
  }
  await db.achievements.add(achievement)
  return achievement
}
