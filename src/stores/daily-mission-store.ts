import { create } from 'zustand'
import type { DailyMissionBoard } from '@/domain/daily-missions/build-daily-mission-board'
import {
  collectDailyMissionActivity,
  getDailyMissionBoard,
  syncDailyMissions,
} from '@/lib/gamification/sync-daily-missions'

export interface DailyMissionToast {
  id: string
  xpAwarded: number
  labels: string[]
}

interface DailyMissionState {
  board: DailyMissionBoard | null
  toast: DailyMissionToast | null
  refresh: () => Promise<void>
  sync: () => Promise<void>
  dismissToast: () => void
}

export const useDailyMissionStore = create<DailyMissionState>((set) => ({
  board: null,
  toast: null,

  refresh: async () => {
    const board = await getDailyMissionBoard(collectDailyMissionActivity())
    set({ board })
  },

  sync: async () => {
    const result = await syncDailyMissions(collectDailyMissionActivity())
    set({ board: result.board })
    if (result.xpAwarded > 0) {
      set({
        toast: {
          id: crypto.randomUUID(),
          xpAwarded: result.xpAwarded,
          labels: result.rewardedLabels,
        },
      })
    }
  },

  dismissToast: () => set({ toast: null }),
}))
