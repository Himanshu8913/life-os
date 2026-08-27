import { create } from 'zustand'

interface GamificationState {
  levelUp: { id: string; level: number } | null
  showLevelUp: (level: number) => void
  dismissLevelUp: () => void
}

export const useGamificationStore = create<GamificationState>((set) => ({
  levelUp: null,
  showLevelUp: (level) =>
    set({ levelUp: { id: crypto.randomUUID(), level } }),
  dismissLevelUp: () => set({ levelUp: null }),
}))
