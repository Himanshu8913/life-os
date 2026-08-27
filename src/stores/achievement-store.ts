import { create } from 'zustand'
import type { Achievement } from '@/types'

interface AchievementState {
  achievements: Achievement[]
  setAchievements: (achievements: Achievement[]) => void
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [],
  setAchievements: (achievements) => set({ achievements }),
}))
