import { create } from 'zustand'
import { completeQuest as completeQuestDomain } from '@/domain/quests/complete-quest'
import { getDefaultXpForType } from '@/domain/quests/xp-config'
import {
  createQuest as createQuestRepo,
  deleteQuest as deleteQuestRepo,
  getAllQuests,
  updateQuest as updateQuestRepo,
} from '@/db/repositories/quest-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { useProfileStore } from '@/stores/profile-store'
import { useTimelineStore } from '@/stores/timeline-store'
import type { Priority, Quest, QuestStatus, QuestType } from '@/types'

export interface CreateQuestInput {
  title: string
  description?: string
  type: QuestType
  priority: Priority
  xpReward?: number
  dueDate?: string
  tags?: string[]
  notes?: string
}

export interface QuestCompletionToast {
  id: string
  xpGained: number
  leveledUp: boolean
  newLevel: number
  questTitle: string
}

interface QuestState {
  quests: Quest[]
  completionToast: QuestCompletionToast | null
  setQuests: (quests: Quest[]) => void
  refreshQuests: () => Promise<void>
  addQuest: (input: CreateQuestInput) => Promise<Quest>
  editQuest: (
    id: string,
    updates: Partial<Omit<Quest, 'id' | 'createdAt'>>,
  ) => Promise<Quest>
  removeQuest: (id: string) => Promise<void>
  completeQuest: (id: string) => Promise<void>
  archiveQuest: (id: string) => Promise<void>
  dismissCompletionToast: () => void
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  completionToast: null,
  setQuests: (quests) => set({ quests }),

  refreshQuests: async () => {
    const quests = await getAllQuests()
    set({ quests })
  },

  addQuest: async (input) => {
    const quest = await createQuestRepo({
      title: input.title,
      description: input.description,
      type: input.type,
      status: 'TODO',
      priority: input.priority,
      xpReward: input.xpReward ?? getDefaultXpForType(input.type),
      dueDate: input.dueDate,
      tags: input.tags,
      notes: input.notes,
    })
    set({ quests: [quest, ...get().quests] })
    return quest
  },

  editQuest: async (id, updates) => {
    const updated = await updateQuestRepo(id, updates)
    set({
      quests: get().quests.map((q) => (q.id === id ? updated : q)),
    })
    return updated
  },

  removeQuest: async (id) => {
    await deleteQuestRepo(id)
    set({ quests: get().quests.filter((q) => q.id !== id) })
  },

  completeQuest: async (id) => {
    const result = await completeQuestDomain(id)
    set({
      quests: get().quests.map((q) => (q.id === id ? result.quest : q)),
      completionToast: {
        id: crypto.randomUUID(),
        xpGained: result.xpGained,
        leveledUp: result.leveledUp,
        newLevel: result.newLevel,
        questTitle: result.quest.title,
      },
    })
    useProfileStore.getState().setProfile(result.profile)
    const events = await getAllTimelineEvents()
    useTimelineStore.getState().setEvents(events)
  },

  archiveQuest: async (id) => {
    const updated = await updateQuestRepo(id, { status: 'ARCHIVED' as QuestStatus })
    set({
      quests: get().quests.map((q) => (q.id === id ? updated : q)),
    })
  },

  dismissCompletionToast: () => set({ completionToast: null }),
}))
