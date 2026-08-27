import { AnimatePresence, motion } from 'framer-motion'
import { Flame, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useHabitStore } from '@/stores/habit-store'
import { useMotionConfig } from '@/hooks/use-motion'

export function HabitCompletionToast() {
  const toast = useHabitStore((s) => s.toast)
  const dismiss = useHabitStore((s) => s.dismissToast)
  const { reducedMotion } = useMotionConfig()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismiss, 3500)
    return () => clearTimeout(timer)
  }, [toast, dismiss])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-24 left-1/2 z-50 min-w-[260px] -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-8 sm:bottom-8"
          initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          <div className="rounded-xl border border-border bg-surface-elevated/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-widest text-muted uppercase">
                  {toast.completed ? 'Habit Done' : 'Undone'}
                </p>
                <p className="font-medium">{toast.habitName}</p>
                {toast.xpGained > 0 && (
                  <p className="font-mono text-sm font-semibold text-accent">
                    +{toast.xpGained} XP
                  </p>
                )}
                {toast.leveledUp && (
                  <p className="flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    Level {toast.newLevel}!
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
