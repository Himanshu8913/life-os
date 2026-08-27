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
      className="relative overflow-hidden rounded-2xl border border-border bg-surface-elevated/80 p-6 backdrop-blur-md md:p-8"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 40%, transparent), transparent 70%)',
        }}
      />

      <div className="relative">
        <p className="text-xs font-semibold tracking-[0.35em] text-muted uppercase">
          {greeting}
        </p>
        <p className="mt-1 text-xs tracking-[0.15em] text-foreground-secondary">
          {dateLine}
        </p>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium tracking-[0.25em] text-accent uppercase">
                Level {level}
              </span>
            </div>
            <motion.p
              className="mt-2 font-mono text-4xl font-bold tracking-tight md:text-5xl"
              key={displayName}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {displayName}
            </motion.p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {totalXp.toLocaleString()}
            </p>
            <p className="text-xs text-muted">total XP</p>
          </div>
        </div>

        <div className="mt-6 max-w-xl">
          <ProgressBar
            value={xp.currentXp}
            max={xpSpan}
            label={`${xp.currentXp.toLocaleString()} / ${xpSpan.toLocaleString()} XP to level ${level + 1}`}
          />
        </div>
      </div>
    </motion.section>
  )
}
