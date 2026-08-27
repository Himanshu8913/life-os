import { create } from 'zustand'
import type { AppSettings } from '@/types'
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
  isHydrated: boolean
  isDbReady: boolean
  setAccentColor: (color: string) => void
  setReducedMotion: (value: boolean) => void
  setHydrated: (value: boolean) => void
  setDbReady: (value: boolean) => void
  hydrateFromDb: (settings: AppSettings) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  accentColor: '#6366f1',
  reducedMotion: false,
  isHydrated: false,
  isDbReady: false,
  setHydrated: (isHydrated) => set({ isHydrated }),
  setDbReady: (isDbReady) => set({ isDbReady }),
  hydrateFromDb: (settings) =>
    set({
      accentColor: settings.accentColor,
      reducedMotion: settings.reducedMotion,
    }),
  setAccentColor: (accentColor) => {
    set({ accentColor })
    void updateSettingsRepo({ accentColor })
  },
  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion })
    void updateSettingsRepo({ reducedMotion })
  },
}))
