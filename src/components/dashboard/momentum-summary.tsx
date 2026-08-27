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
    <motion.div variants={fadeUp} className="rounded-xl border border-border bg-surface/60 p-5">
      <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
        <TrendingUp className="h-3.5 w-3.5 text-accent" />
        Momentum
      </div>
      <p className="mt-3 text-2xl font-semibold">
        <span className="font-mono text-accent">{momentum.completedDays}</span>
        <span className="text-base font-normal text-foreground-secondary">
          {' '}
          productive days
        </span>
      </p>
      <p className="text-sm text-muted">in the last {momentum.windowDays} days</p>
      <div className="mt-4">
        <ProgressBar value={momentum.score} label={`${momentum.score}% momentum`} />
      </div>
      {topStreak > 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-orange-400">
          <Flame className="h-4 w-4" />
          Best streak: {topStreak} days
        </p>
      )}
    </motion.div>
  )
}
