import { motion } from 'framer-motion'
import type { ObservatoryMetrics } from '@/domain/analytics/calculate-observatory-metrics'
import { AnimatedCard } from '@/components/ui/animated-card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'

interface ObservatoryStatsProps {
  metrics: ObservatoryMetrics
}

export function ObservatoryStats({ metrics }: ObservatoryStatsProps) {
  const { initial } = useMotionConfig()

  const stats = [
    { label: 'Quests completed', value: metrics.totalQuestsCompleted },
    { label: 'Goals completed', value: metrics.totalGoalsCompleted },
    { label: 'Habit logs', value: metrics.totalHabitsCompleted },
    { label: 'Milestones', value: metrics.totalMilestonesCompleted },
    { label: 'Total XP', value: metrics.totalXpEarned.toLocaleString() },
    {
      label: 'Avg daily activity',
      value: `${metrics.averageDailyActivity} days/30d`,
    },
  ]

  return (
    <motion.div
      className="grid gap-4 lg:grid-cols-2"
      variants={staggerContainer}
      initial={initial}
      animate="visible"
    >
      <AnimatedCard elevated delay={0}>
        <motion.div variants={fadeUp}>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            Completion rates
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Quests</span>
                <span className="font-mono text-accent">{metrics.questCompletionRate}%</span>
              </div>
              <ProgressBar value={metrics.questCompletionRate} />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span>Goals</span>
                <span className="font-mono text-accent">{metrics.goalCompletionRate}%</span>
              </div>
              <ProgressBar value={metrics.goalCompletionRate} />
            </div>
          </div>
        </motion.div>
      </AnimatedCard>

      <AnimatedCard delay={0.05}>
        <motion.div variants={fadeUp}>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            Totals
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {stats.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-border/60 bg-surface/50 p-3"
              >
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-1 font-mono text-lg font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </AnimatedCard>
    </motion.div>
  )
}
