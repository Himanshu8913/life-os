import { create } from 'zustand'
import type { Quest } from '@/types'

interface QuestState {
  quests: Quest[]
  setQuests: (quests: Quest[]) => void
}

export const useQuestStore = create<QuestState>((set) => ({
  quests: [],
  setQuests: (quests) => set({ quests }),
}))
