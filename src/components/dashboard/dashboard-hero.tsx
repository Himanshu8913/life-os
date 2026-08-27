import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { ProgressBar } from '@/components/ui/progress-bar'
import type { LevelProgress } from '@/domain/progression/calculate-level'
import { fadeUp, useMotionConfig } from '@/hooks/use-motion'

interface DashboardHeroProps {
  greeting: string
  dateLine: string
  displayName: string
  level: number
  totalXp: number
  xp: LevelProgress
}

export function DashboardHero({
  greeting,
  dateLine,
  displayName,
  level,
  totalXp,
  xp,
}: DashboardHeroProps) {
  const { reducedMotion, initial } = useMotionConfig()
  const xpSpan = xp.xpForNextLevel - xp.xpForCurrentLevel

  return (
    <motion.section
      initial={initial}
      animate="visible"
      variants={fadeUp}
      className="glass-panel-elevated relative overflow-hidden p-6 md:p-8"
    >
      <div
        className="animate-pulse-glow pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 45%, transparent), transparent 70%)',
        }}
        aria-hidden
      />
      <div
        className="animate-float-delayed pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full opacity-20"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-success) 50%, transparent), transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative">
        <motion.p
          className="text-xs font-semibold tracking-[0.35em] text-muted uppercase"
          initial={reducedMotion ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
        >
          {greeting}
        </motion.p>
        <motion.p
          className="mt-1 text-xs tracking-[0.15em] text-foreground-secondary"
          initial={reducedMotion ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {dateLine}
        </motion.p>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <motion.div
              className="flex items-center gap-2"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 400 }}
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium tracking-[0.2em] text-accent uppercase">
                Level {level}
              </span>
            </motion.div>
            <motion.p
              className="mt-3 text-gradient-accent font-mono text-4xl font-bold tracking-tight md:text-5xl"
              key={displayName}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              {displayName}
            </motion.p>
          </div>
          <motion.div
            className="text-right"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {totalXp.toLocaleString()}
            </p>
            <p className="text-xs text-muted">total XP</p>
          </motion.div>
        </div>

        <motion.div
          className="mt-6 max-w-xl"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <ProgressBar
            value={xp.currentXp}
            max={xpSpan}
            label={`${xp.currentXp.toLocaleString()} / ${xpSpan.toLocaleString()} XP to level ${level + 1}`}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}
