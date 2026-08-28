import { create } from 'zustand'
import { toggleHabitToday } from '@/domain/habits/habit-actions'
import {
  createHabit as createHabitRepo,
  deleteHabit as deleteHabitRepo,
  getAllHabits,
  getHabitCompletions,
  updateHabit as updateHabitRepo,
} from '@/db/repositories/habit-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { syncGamificationAfterAction } from '@/lib/gamification/sync-gamification'
import { useProfileStore } from '@/stores/profile-store'
import { useTimelineStore } from '@/stores/timeline-store'
import { useDailyMissionStore } from '@/stores/daily-mission-store'
import type { Habit, HabitCompletion, HabitFrequency } from '@/types'

export interface HabitToast {
  id: string
  habitName: string
  xpGained: number
  leveledUp: boolean
  newLevel: number
  completed: boolean
}

export interface CreateHabitInput {
  name: string
  description?: string
  frequency?: HabitFrequency
  target?: number
}

interface HabitState {
  habits: Habit[]
  completions: HabitCompletion[]
  toast: HabitToast | null
  setHabits: (habits: Habit[], completions: HabitCompletion[]) => void
  dismissToast: () => void
  refreshHabits: () => Promise<void>
  addHabit: (input: CreateHabitInput) => Promise<Habit>
  editHabit: (
    id: string,
    updates: Partial<Omit<Habit, 'id' | 'createdAt'>>,
  ) => Promise<Habit>
  removeHabit: (id: string) => Promise<void>
  archiveHabit: (id: string) => Promise<void>
  toggleToday: (habitId: string) => Promise<void>
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  completions: [],
  toast: null,
  setHabits: (habits, completions) => set({ habits, completions }),
  dismissToast: () => set({ toast: null }),

  refreshHabits: async () => {
    const [habits, completions] = await Promise.all([
      getAllHabits(),
      getHabitCompletions(),
    ])
    set({ habits, completions })
  },

  addHabit: async (input) => {
    const habit = await createHabitRepo({
      name: input.name.trim(),
      description: input.description?.trim(),
      frequency: input.frequency ?? 'DAILY',
      target: input.target ?? 1,
    })
    set({ habits: [habit, ...get().habits] })
    return habit
  },

  editHabit: async (id, updates) => {
    const updated = await updateHabitRepo(id, updates)
    set({ habits: get().habits.map((h) => (h.id === id ? updated : h)) })
    return updated
  },

  removeHabit: async (id) => {
    await deleteHabitRepo(id)
    set({
      habits: get().habits.filter((h) => h.id !== id),
      completions: get().completions.filter((c) => c.habitId !== id),
    })
  },

  archiveHabit: async (id) => {
    const updated = await updateHabitRepo(id, {
      archivedAt: new Date().toISOString(),
    })
    set({ habits: get().habits.map((h) => (h.id === id ? updated : h)) })
  },

  toggleToday: async (habitId) => {
    const result = await toggleHabitToday(habitId)
    const completions = await getHabitCompletions()

    set({
      habits: get().habits.map((h) => (h.id === habitId ? result.habit : h)),
      completions,
      toast:
        result.xpGained > 0
          ? {
              id: crypto.randomUUID(),
              habitName: result.habit.name,
              xpGained: result.xpGained,
              leveledUp: result.leveledUp,
              newLevel: result.newLevel,
              completed: true,
            }
          : null,
    })

    if (result.xpGained > 0) {
      const profile = useProfileStore.getState().profile
      if (profile) {
        useProfileStore.getState().setProfile({
          ...profile,
          totalXp: result.profileTotalXp,
        })
      }
    }

    const events = await getAllTimelineEvents()
    useTimelineStore.getState().setEvents(events)

    if (result.xpGained > 0) {
      await syncGamificationAfterAction({
        leveledUp: result.leveledUp,
        newLevel: result.newLevel,
      })
    }

    await useDailyMissionStore.getState().sync()
  },
}))
