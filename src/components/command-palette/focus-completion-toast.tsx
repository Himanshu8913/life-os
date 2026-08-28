import { AnimatePresence, motion } from 'framer-motion'
import { Timer, X } from 'lucide-react'
import { useAutoDismiss } from '@/hooks/use-auto-dismiss'
import { useMotionConfig } from '@/hooks/use-motion'
import { useFocusStore } from '@/stores/focus-store'

export function FocusCompletionToast() {
  const toast = useFocusStore((s) => s.toast)
  const dismissToast = useFocusStore((s) => s.dismissToast)
  const { reducedMotion } = useMotionConfig()

  useAutoDismiss(toast?.id, dismissToast)

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-6 right-6 z-[110] max-w-sm rounded-xl border border-accent/30 bg-surface-elevated p-4 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          initial={reducedMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, x: 16 }}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-accent" aria-hidden />
              <p className="text-sm font-semibold">Focus complete</p>
            </div>
            <button
              type="button"
              onClick={dismissToast}
              className="rounded p-1 text-muted hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-sm text-foreground-secondary">
            {toast.minutes} minutes on &ldquo;{toast.title}&rdquo;
          </p>
          <p className="mt-1 font-mono text-sm text-accent">
            +{toast.xpGained} XP
            {toast.leveledUp && ` · Level ${toast.newLevel}`}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
