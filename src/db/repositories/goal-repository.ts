import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { Goal } from '@/types'

export async function getAllGoals(): Promise<Goal[]> {
  return db.goals.orderBy('createdAt').reverse().toArray()
}

export async function getGoalById(id: string): Promise<Goal | undefined> {
  return db.goals.get(id)
}

export async function createGoal(
  data: Omit<Goal, 'id' | 'createdAt'>,
): Promise<Goal> {
  const goal: Goal = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  await db.goals.add(goal)
  return goal
}

export async function updateGoal(
  id: string,
  updates: Partial<Omit<Goal, 'id' | 'createdAt'>>,
): Promise<Goal> {
  const existing = await db.goals.get(id)
  if (!existing) throw new Error(`Goal not found: ${id}`)
  const updated = { ...existing, ...updates }
  await db.goals.put(updated)
  return updated
}

export async function deleteGoal(id: string): Promise<void> {
  await db.goals.delete(id)
}
