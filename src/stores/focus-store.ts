import { create } from 'zustand'
import {
  completeFocusSession,
  startFocusSession,
} from '@/domain/focus/focus-actions'
import {
  deleteFocusSession,
  getAllFocusSessions,
} from '@/db/repositories/focus-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { syncGamificationAfterAction } from '@/lib/gamification/sync-gamification'
import { useProfileStore } from '@/stores/profile-store'
import { useTimelineStore } from '@/stores/timeline-store'
import { useDailyMissionStore } from '@/stores/daily-mission-store'

export interface ActiveFocus {
  sessionId: string
  title: string
  durationMinutes: number
  endsAt: number
}

export interface FocusToast {
  id: string
  title: string
  minutes: number
  xpGained: number
  leveledUp: boolean
  newLevel: number
}

interface FocusState {
  active: ActiveFocus | null
  toast: FocusToast | null
  start: (minutes: number, title?: string) => Promise<void>
  complete: () => Promise<void>
  cancel: () => Promise<void>
  dismissToast: () => void
}

export const useFocusStore = create<FocusState>((set, get) => ({
  active: null,
  toast: null,

  start: async (minutes, title) => {
    const { session } = await startFocusSession(minutes, title)
    const sessions = await getAllFocusSessions()
    useProfileStore.getState().setFocusSessions(sessions)
    set({
      active: {
        sessionId: session.id,
        title: session.title,
        durationMinutes: session.durationMinutes,
        endsAt: Date.now() + session.durationMinutes * 60_000,
      },
    })
  },

  complete: async () => {
    const { active } = get()
    if (!active) return

    const result = await completeFocusSession(active.sessionId)
    const profile = useProfileStore.getState().profile
    if (profile) {
      useProfileStore.getState().setProfile({
        ...profile,
        totalXp: result.profileTotalXp,
      })
    }
    const [sessions, events] = await Promise.all([
      getAllFocusSessions(),
      getAllTimelineEvents(),
    ])
    useProfileStore.getState().setFocusSessions(sessions)
    useTimelineStore.getState().setEvents(events)

    await syncGamificationAfterAction({
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
    })

    await useDailyMissionStore.getState().sync()

    set({
      active: null,
      toast: {
        id: crypto.randomUUID(),
        title: result.session.title,
        minutes: result.session.durationMinutes,
        xpGained: result.xpGained,
        leveledUp: result.leveledUp,
        newLevel: result.newLevel,
      },
    })
  },

  cancel: async () => {
    const { active } = get()
    if (!active) return
    await deleteFocusSession(active.sessionId)
    const sessions = await getAllFocusSessions()
    useProfileStore.getState().setFocusSessions(sessions)
    set({ active: null })
  },

  dismissToast: () => set({ toast: null }),
}))
