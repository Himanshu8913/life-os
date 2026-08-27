import { AnimatePresence, motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useEffect } from 'react'
import { useAchievementStore } from '@/stores/achievement-store'
import { useMotionConfig } from '@/hooks/use-motion'

export function AchievementUnlockToast() {
  const queue = useAchievementStore((s) => s.unlockQueue)
  const dismiss = useAchievementStore((s) => s.dismissUnlockToast)
  const toast = queue[0]
  const { reducedMotion } = useMotionConfig()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismiss, 4500)
    return () => clearTimeout(timer)
  }, [toast, dismiss])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="fixed bottom-8 left-8 z-[115] max-w-sm"
          initial={reducedMotion ? false : { opacity: 0, x: -24, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, x: -12, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-surface-elevated/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20"
                animate={reducedMotion ? undefined : { rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.6 }}
              >
                <Trophy className="h-5 w-5 text-amber-400" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs font-medium tracking-widest text-amber-400/90 uppercase">
                  Achievement Unlocked
                </p>
                <p className="mt-0.5 font-semibold">{toast.title}</p>
                <p className="mt-1 text-sm text-foreground-secondary">
                  {toast.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
