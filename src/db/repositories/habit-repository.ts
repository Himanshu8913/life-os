import { db } from '@/db/database'
import { generateId } from '@/lib/ids/generate-id'
import type { Habit, HabitCompletion } from '@/types'

export async function getAllHabits(): Promise<Habit[]> {
  return db.habits.orderBy('createdAt').reverse().toArray()
}

export async function getHabitById(id: string): Promise<Habit | undefined> {
  return db.habits.get(id)
}

export async function createHabit(
  data: Omit<Habit, 'id' | 'createdAt' | 'currentStreak' | 'longestStreak'>,
): Promise<Habit> {
  const habit: Habit = {
    ...data,
    id: generateId(),
    currentStreak: 0,
    longestStreak: 0,
    createdAt: new Date().toISOString(),
  }
  await db.habits.add(habit)
  return habit
}

export async function updateHabit(
  id: string,
  updates: Partial<Omit<Habit, 'id' | 'createdAt'>>,
): Promise<Habit> {
  const existing = await db.habits.get(id)
  if (!existing) throw new Error(`Habit not found: ${id}`)
  const updated = { ...existing, ...updates }
  await db.habits.put(updated)
  return updated
}

export async function deleteHabit(id: string): Promise<void> {
  await db.habits.delete(id)
}

export async function getHabitCompletions(
  habitId?: string,
): Promise<HabitCompletion[]> {
  if (habitId) {
    return db.habitCompletions.where('habitId').equals(habitId).toArray()
  }
  return db.habitCompletions.orderBy('completedAt').reverse().toArray()
}

export async function addHabitCompletion(
  habitId: string,
  note?: string,
): Promise<HabitCompletion> {
  const completion: HabitCompletion = {
    id: generateId(),
    habitId,
    completedAt: new Date().toISOString(),
    note,
  }
  await db.habitCompletions.add(completion)
  return completion
}
