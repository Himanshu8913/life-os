import { create } from 'zustand'
import type { TimelineEvent } from '@/types'

interface TimelineState {
  events: TimelineEvent[]
  setEvents: (events: TimelineEvent[]) => void
}

export const useTimelineStore = create<TimelineState>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
}))
