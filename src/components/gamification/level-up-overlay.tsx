import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { useGamificationStore } from '@/stores/gamification-store'
import { useMotionConfig } from '@/hooks/use-motion'

export function LevelUpOverlay() {
  const levelUp = useGamificationStore((s) => s.levelUp)
  const dismiss = useGamificationStore((s) => s.dismissLevelUp)
  const { reducedMotion } = useMotionConfig()

  useEffect(() => {
    if (!levelUp) return
    const timer = setTimeout(dismiss, 3500)
    return () => clearTimeout(timer)
  }, [levelUp, dismiss])

  return (
    <AnimatePresence>
      {levelUp && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            className="pointer-events-none text-center"
            initial={reducedMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reducedMotion ? undefined : { scale: 1.05, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            <motion.div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-accent/40 bg-accent/20 shadow-[0_0_60px_var(--color-accent)]"
              animate={reducedMotion ? undefined : { scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <TrendingUp className="h-10 w-10 text-accent" />
            </motion.div>
            <p className="mt-8 text-xs font-semibold tracking-[0.4em] text-accent uppercase">
              Level Up
            </p>
            <motion.p
              className="mt-3 font-mono text-7xl font-bold tracking-tight"
              key={levelUp.level}
              initial={reducedMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {levelUp.level}
            </motion.p>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-foreground-secondary">
              <Sparkles className="h-4 w-4 text-accent" />
              New powers unlocked
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
