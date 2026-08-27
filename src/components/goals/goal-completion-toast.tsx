import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Target, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useGoalStore } from '@/stores/goal-store'
import { useMotionConfig } from '@/hooks/use-motion'

export function GoalCompletionToast() {
  const toast = useGoalStore((s) => s.toast)
  const dismiss = useGoalStore((s) => s.dismissToast)
  const { reducedMotion } = useMotionConfig()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismiss, 4000)
    return () => clearTimeout(timer)
  }, [toast, dismiss])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-8 left-1/2 z-50 min-w-[280px] -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-24"
          initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                {toast.kind === 'goal' ? (
                  <Target className="h-5 w-5 text-accent" />
                ) : (
                  <Sparkles className="h-5 w-5 text-accent" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium tracking-widest text-muted uppercase">
                  {toast.kind === 'goal' ? 'Goal Complete' : 'Milestone Complete'}
                </p>
                <p className="mt-0.5 font-medium">{toast.title}</p>
                <p className="mt-1 font-mono text-lg font-semibold text-accent">
                  +{toast.xpGained} XP
                </p>
                {toast.leveledUp && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-success">
                    <TrendingUp className="h-4 w-4" />
                    Level {toast.newLevel}!
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
