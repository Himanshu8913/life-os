import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { Reflection } from '@/types'

export async function getAllReflections(): Promise<Reflection[]> {
  return db.reflections.orderBy('createdAt').reverse().toArray()
}

export async function getReflectionByWeekStart(
  weekStart: string,
): Promise<Reflection | undefined> {
  return db.reflections.where('weekStart').equals(weekStart).first()
}

export async function saveReflection(
  data: Omit<Reflection, 'id' | 'createdAt'>,
): Promise<Reflection> {
  const reflection: Reflection = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  await db.reflections.add(reflection)
  return reflection
}

export async function updateReflection(
  id: string,
  updates: Partial<Omit<Reflection, 'id' | 'createdAt'>>,
): Promise<Reflection> {
  const existing = await db.reflections.get(id)
  if (!existing) throw new Error(`Reflection not found: ${id}`)
  const updated = { ...existing, ...updates }
  await db.reflections.put(updated)
  return updated
}
