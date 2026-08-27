import { create } from 'zustand'
import type { Habit, HabitCompletion } from '@/types'

interface HabitState {
  habits: Habit[]
  completions: HabitCompletion[]
  setHabits: (habits: Habit[], completions: HabitCompletion[]) => void
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  completions: [],
  setHabits: (habits, completions) => set({ habits, completions }),
}))
