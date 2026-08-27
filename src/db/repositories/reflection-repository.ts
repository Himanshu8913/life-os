import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { Reflection } from '@/types'

export async function getAllReflections(): Promise<Reflection[]> {
  return db.reflections.orderBy('createdAt').reverse().toArray()
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
