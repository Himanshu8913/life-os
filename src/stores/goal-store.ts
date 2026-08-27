import { create } from 'zustand'
import type { Goal } from '@/types'

interface GoalState {
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  setGoals: (goals) => set({ goals }),
}))
