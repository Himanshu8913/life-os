import { create } from 'zustand'
import type { Achievement } from '@/types'

interface AchievementState {
  achievements: Achievement[]
  unlockQueue: Achievement[]
  setAchievements: (achievements: Achievement[]) => void
  queueUnlockToasts: (achievements: Achievement[]) => void
  dismissUnlockToast: () => void
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  unlockQueue: [],
  setAchievements: (achievements) => set({ achievements }),
  queueUnlockToasts: (achievements) =>
    set({ unlockQueue: [...get().unlockQueue, ...achievements] }),
  dismissUnlockToast: () =>
    set((state) => ({ unlockQueue: state.unlockQueue.slice(1) })),
}))
