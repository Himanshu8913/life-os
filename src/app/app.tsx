import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { initDatabase } from '@/db/database'
import { router } from '@/app/router'
import { useSettingsStore } from '@/stores/settings-store'

/**
 * Root application component.
 *
 * Responsibilities:
 * 1. Sync the user accent color to the CSS `--color-accent` custom property.
 * 2. Bootstrap IndexedDB on mount and publish readiness to the settings store.
 *
 * The bootstrap effect is cancellation-safe — state is not updated after unmount.
 */
export function App() {
  const setDbReady = useSettingsStore((s) => s.setDbReady)
  const setHydrated = useSettingsStore((s) => s.setHydrated)
  const accentColor = useSettingsStore((s) => s.accentColor)

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', accentColor)
  }, [accentColor])

  useEffect(() => {
    let cancelled = false

    /** Opens IndexedDB and updates store flags; skipped if the component unmounts mid-flight. */
    async function bootstrap() {
      try {
        await initDatabase()
        if (!cancelled) setDbReady(true)
      } catch (error) {
        console.error('Failed to initialize database:', error)
      } finally {
        if (!cancelled) setHydrated(true)
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [setDbReady, setHydrated])

  return <RouterProvider router={router} />
}
