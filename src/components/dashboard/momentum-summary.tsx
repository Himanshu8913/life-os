import { motion } from 'framer-motion'
import { Flame, TrendingUp } from 'lucide-react'
import { ProgressBar } from '@/components/ui/progress-bar'
import type { MomentumScore } from '@/domain/momentum/momentum'
import { fadeUp } from '@/hooks/use-motion'

interface MomentumSummaryProps {
  momentum: MomentumScore
  topStreak: number
}

export function MomentumSummary({ momentum, topStreak }: MomentumSummaryProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="glass-panel relative overflow-hidden p-5"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(251, 146, 60, 0.6), transparent 70%)',
        }}
        aria-hidden
      />
      <div className="relative flex items-center gap-2 text-xs font-medium tracking-widest text-orange-300 uppercase">
        <TrendingUp className="h-3.5 w-3.5" />
        Momentum
      </div>
      <p className="relative mt-3 text-2xl font-semibold">
        <span className="text-gradient-warm font-mono">
          {momentum.completedDays}
        </span>
        <span className="text-base font-normal text-foreground-secondary">
          {' '}
          productive days
        </span>
      </p>
      <p className="relative text-sm text-muted">
        in the last {momentum.windowDays} days
      </p>
      <div className="relative mt-4">
        <ProgressBar
          value={momentum.score}
          label={`${momentum.score}% momentum`}
          color="linear-gradient(90deg, #fb923c, #fbbf24, #34d399)"
        />
      </div>
      {topStreak > 0 && (
        <p className="relative mt-3 flex items-center gap-1.5 text-sm text-orange-400">
          <Flame className="h-4 w-4" />
          Best streak: {topStreak} days
        </p>
      )}
    </motion.div>
  )
}
