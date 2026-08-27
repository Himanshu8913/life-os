import { create } from 'zustand'

/**
 * Global application settings and bootstrap state.
 *
 * `isHydrated` becomes true after the DB bootstrap attempt finishes (success or failure).
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
}

export const useSettingsStore = create<SettingsState>((set) => ({
  accentColor: '#6366f1',
  reducedMotion: false,
  isHydrated: false,
  isDbReady: false,
  setAccentColor: (accentColor) => set({ accentColor }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setHydrated: (isHydrated) => set({ isHydrated }),
  setDbReady: (isDbReady) => set({ isDbReady }),
}))
