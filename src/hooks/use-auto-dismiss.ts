import { useEffect } from 'react'

const DEFAULT_TOAST_DURATION_MS = 4000

/**
 * Auto-dismisses after a delay. Re-runs when `key` changes (e.g. new toast id).
 */
export function useAutoDismiss(
  key: string | null | undefined | false,
  onDismiss: () => void,
  delayMs = DEFAULT_TOAST_DURATION_MS,
) {
  useEffect(() => {
    if (!key) return
    const id = window.setTimeout(onDismiss, delayMs)
    return () => window.clearTimeout(id)
  }, [key, onDismiss, delayMs])
}
