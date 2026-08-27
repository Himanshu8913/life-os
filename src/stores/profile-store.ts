import { create } from 'zustand'
import type { FocusSession, MoodEntry, UserProfile } from '@/types'
import { updateProfile as updateProfileRepo } from '@/db/repositories/profile-repository'

interface ProfileState {
  profile: UserProfile | null
  focusSessions: FocusSession[]
  moodEntries: MoodEntry[]
  setProfile: (profile: UserProfile) => void
  setFocusSessions: (sessions: FocusSession[]) => void
  setMoodEntries: (entries: MoodEntry[]) => void
  updateProfile: (updates: Partial<Omit<UserProfile, 'id'>>) => Promise<void>
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  focusSessions: [],
  moodEntries: [],
  setProfile: (profile) => set({ profile }),
  setFocusSessions: (focusSessions) => set({ focusSessions }),
  setMoodEntries: (moodEntries) => set({ moodEntries }),
  updateProfile: async (updates) => {
    const updated = await updateProfileRepo(updates)
    set({ profile: updated })
  },
}))
