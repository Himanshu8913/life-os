import { create } from 'zustand'
import { buildReflectionSummary, type ReflectionSummary } from '@/domain/reflection/build-reflection-summary'
import { getWeekStartKey } from '@/domain/reflection/week-utils'
import {
  getAllReflections,
  getReflectionByWeekStart,
  saveReflection,
  updateReflection,
} from '@/db/repositories/reflection-repository'
import { addTimelineEvent, getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { useGoalStore } from '@/stores/goal-store'
import { useHabitStore } from '@/stores/habit-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimelineStore } from '@/stores/timeline-store'
import type { Reflection } from '@/types'

export interface SubmitReflectionInput {
  wentWell: string
  wentPoorly: string
  proudOf: string
  nextWeekFocus: string
  weekStart?: string
}

interface ReflectionState {
  reflections: Reflection[]
  lastSummary: ReflectionSummary | null
  setReflections: (reflections: Reflection[]) => void
  submitReflection: (input: SubmitReflectionInput) => Promise<ReflectionSummary>
  getSummaryForReflection: (reflection: Reflection) => ReflectionSummary
  clearLastSummary: () => void
}

export const useReflectionStore = create<ReflectionState>((set, get) => ({
  reflections: [],
  lastSummary: null,
  setReflections: (reflections) => set({ reflections }),

  getSummaryForReflection: (reflection) => {
    const events = useTimelineStore.getState().events
    const quests = useQuestStore.getState().quests
    const goals = useGoalStore.getState().goals
    const habitCompletions = useHabitStore.getState().completions
    return buildReflectionSummary({
      reflection,
      events,
      quests,
      goals,
      habitCompletions,
    })
  },

  submitReflection: async (input) => {
    const weekStart = input.weekStart ?? getWeekStartKey()
    const payload = {
      weekStart,
      wentWell: input.wentWell.trim(),
      wentPoorly: input.wentPoorly.trim(),
      proudOf: input.proudOf.trim(),
      nextWeekFocus: input.nextWeekFocus.trim(),
    }

    const existing = await getReflectionByWeekStart(weekStart)
    const reflection = existing
      ? await updateReflection(existing.id, payload)
      : await saveReflection(payload)

    await addTimelineEvent({
      type: 'REFLECTION',
      title: 'Weekly reflection submitted',
      description: payload.proudOf || payload.wentWell,
      metadata: { reflectionId: reflection.id, weekStart },
    })

    const reflections = await getAllReflections()
    const events = await getAllTimelineEvents()
    useTimelineStore.getState().setEvents(events)

    const summary = get().getSummaryForReflection(reflection)
    set({ reflections, lastSummary: summary })
    return summary
  },

  clearLastSummary: () => set({ lastSummary: null }),
}))
