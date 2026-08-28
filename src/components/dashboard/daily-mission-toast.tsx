import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useMotionConfig } from '@/hooks/use-motion'
import { useDailyMissionStore } from '@/stores/daily-mission-store'

export function DailyMissionToast() {
  const toast = useDailyMissionStore((s) => s.toast)
  const dismiss = useDailyMissionStore((s) => s.dismissToast)
  const { reducedMotion } = useMotionConfig()

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-violet-400/40 bg-surface-elevated/95 p-4 shadow-[var(--shadow-card-hover)] backdrop-blur-xl"
          initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
          role="status"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-vivid">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Mission complete!</p>
              <p className="mt-0.5 text-xs text-foreground-secondary">
                {toast.labels.join(' · ')}
              </p>
              <p className="mt-1 font-mono text-sm text-violet-300">
                +{toast.xpAwarded} XP
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-md p-1 text-muted hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
