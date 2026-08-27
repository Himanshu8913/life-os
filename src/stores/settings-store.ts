import { create } from 'zustand'
import type { AppSettings, GoalCategory } from '@/types'
import { updateSettings as updateSettingsRepo } from '@/db/repositories/settings-repository'

/**
 * Global application settings and bootstrap state.
 *
 * `isHydrated` becomes true after the DB bootstrap attempt finishes.
 * `isDbReady` is true only when IndexedDB initialized successfully.
 */
export interface SettingsState {
  accentColor: string
  reducedMotion: boolean
  onboardingCompleted: boolean
  focusAreas: GoalCategory[]
  notificationsEnabled: boolean
  notificationsQuestReminders: boolean
  notificationsAchievements: boolean
  weekStartDay: 0 | 1
  isHydrated: boolean
  isDbReady: boolean
  setAccentColor: (color: string) => void
  setReducedMotion: (value: boolean) => void
  setNotificationsEnabled: (value: boolean) => void
  setNotificationsQuestReminders: (value: boolean) => void
  setNotificationsAchievements: (value: boolean) => void
  setWeekStartDay: (value: 0 | 1) => void
  setOnboardingCompleted: (value: boolean, focusAreas?: GoalCategory[]) => void
  setHydrated: (value: boolean) => void
  setDbReady: (value: boolean) => void
  hydrateFromDb: (settings: AppSettings) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  accentColor: '#6366f1',
  reducedMotion: false,
  onboardingCompleted: true,
  focusAreas: [],
  notificationsEnabled: true,
  notificationsQuestReminders: true,
  notificationsAchievements: true,
  weekStartDay: 1,
  isHydrated: false,
  isDbReady: false,
  setHydrated: (isHydrated) => set({ isHydrated }),
  setDbReady: (isDbReady) => set({ isDbReady }),
  hydrateFromDb: (settings) =>
    set({
      accentColor: settings.accentColor,
      reducedMotion: settings.reducedMotion,
      onboardingCompleted: settings.onboardingCompleted ?? true,
      focusAreas: settings.focusAreas ?? [],
      notificationsEnabled: settings.notificationsEnabled ?? true,
      notificationsQuestReminders: settings.notificationsQuestReminders ?? true,
      notificationsAchievements: settings.notificationsAchievements ?? true,
      weekStartDay: settings.weekStartDay ?? 1,
    }),
  setAccentColor: (accentColor) => {
    set({ accentColor })
    void updateSettingsRepo({ accentColor })
  },
  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion })
    void updateSettingsRepo({ reducedMotion })
  },
  setNotificationsEnabled: (notificationsEnabled) => {
    set({ notificationsEnabled })
    void updateSettingsRepo({ notificationsEnabled })
  },
  setNotificationsQuestReminders: (notificationsQuestReminders) => {
    set({ notificationsQuestReminders })
    void updateSettingsRepo({ notificationsQuestReminders })
  },
  setNotificationsAchievements: (notificationsAchievements) => {
    set({ notificationsAchievements })
    void updateSettingsRepo({ notificationsAchievements })
  },
  setWeekStartDay: (weekStartDay) => {
    set({ weekStartDay })
    void updateSettingsRepo({ weekStartDay })
  },
  setOnboardingCompleted: (onboardingCompleted, focusAreas) => {
    set({
      onboardingCompleted,
      ...(focusAreas !== undefined ? { focusAreas } : {}),
    })
    void updateSettingsRepo({
      onboardingCompleted,
      ...(focusAreas !== undefined ? { focusAreas } : {}),
    })
  },
}))
