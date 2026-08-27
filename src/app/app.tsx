import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { RouterProvider } from 'react-router-dom'
import { initDatabase } from '@/db/database'
import { hydrateStores } from '@/db/hydrate'
import { router } from '@/app/router'
import { LoadingScreen } from '@/components/layout/animated-page'
import { useSettingsStore } from '@/stores/settings-store'

/**
 * Root application component.
 *
 * Bootstraps IndexedDB, hydrates Zustand stores, and syncs accent color to CSS.
 */
export function App() {
  const { isHydrated, accentColor, setDbReady, setHydrated } = useSettingsStore()

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', accentColor)
  }, [accentColor])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        await initDatabase()
        if (!cancelled) setDbReady(true)
        await hydrateStores()
      } catch (error) {
        console.error('Failed to initialize Life OS:', error)
      } finally {
        if (!cancelled) setHydrated(true)
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [setDbReady, setHydrated])

  return (
    <>
      <AnimatePresence>
        {!isHydrated && <LoadingScreen key="loading" />}
      </AnimatePresence>
      {isHydrated && <RouterProvider router={router} />}
    </>
  )
}
