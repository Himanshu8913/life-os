import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useQuestStore } from '@/stores/quest-store'
import { useMotionConfig } from '@/hooks/use-motion'

export function QuestCompletionToast() {
  const toast = useQuestStore((s) => s.completionToast)
  const dismiss = useQuestStore((s) => s.dismissCompletionToast)
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
          className="fixed bottom-8 right-8 z-50 min-w-[280px]"
          initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20"
                animate={reducedMotion ? undefined : { scale: [1, 1.15, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="h-5 w-5 text-accent" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs font-medium tracking-widest text-muted uppercase">
                  Quest Complete
                </p>
                <p className="mt-0.5 font-medium">{toast.questTitle}</p>
                <motion.p
                  className="mt-1 font-mono text-lg font-semibold text-accent"
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  +{toast.xpGained} XP
                </motion.p>
                {toast.leveledUp && (
                  <motion.div
                    className="mt-2 flex items-center gap-1.5 text-sm text-success"
                    initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Level {toast.newLevel}!
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
