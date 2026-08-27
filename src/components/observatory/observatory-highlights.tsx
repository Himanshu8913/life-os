import { motion } from 'framer-motion'
import type { ObservatoryMetrics } from '@/domain/analytics/calculate-observatory-metrics'
import { AnimatedCard } from '@/components/ui/animated-card'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'

interface ObservatoryHighlightsProps {
  metrics: ObservatoryMetrics
}

function HighlightCard({
  title,
  label,
  value,
  delay,
}: {
  title: string
  label: string | null
  value: string
  delay: number
}) {
  return (
    <AnimatedCard delay={delay}>
      <motion.div variants={fadeUp}>
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          {title}
        </p>
        <p className="mt-2 text-lg font-semibold">{label ?? '—'}</p>
        <p className="mt-1 font-mono text-sm text-accent">{value}</p>
      </motion.div>
    </AnimatedCard>
  )
}

export function ObservatoryHighlights({ metrics }: ObservatoryHighlightsProps) {
  const { initial } = useMotionConfig()

  const items = [
    {
      title: 'Most active area',
      label: metrics.mostActiveCategory?.label ?? null,
      value: metrics.mostActiveCategory
        ? `${metrics.mostActiveCategory.value} events`
        : 'No data yet',
    },
    {
      title: 'Most consistent habit',
      label: metrics.mostConsistentHabit?.label ?? null,
      value: metrics.mostConsistentHabit
        ? `${metrics.mostConsistentHabit.value} day streak`
        : 'No habits yet',
    },
    {
      title: 'Most productive day',
      label: metrics.mostProductiveDay?.label ?? null,
      value: metrics.mostProductiveDay
        ? `${metrics.mostProductiveDay.value} events`
        : 'No data yet',
    },
    {
      title: 'Most active time',
      label: metrics.mostActiveHour?.label ?? null,
      value: metrics.mostActiveHour
        ? `${metrics.mostActiveHour.value} events`
        : 'No data yet',
    },
    {
      title: 'Longest momentum',
      label: metrics.longestMomentum?.label ?? null,
      value: metrics.longestMomentum
        ? `${metrics.longestMomentum.value} days`
        : 'No data yet',
    },
  ]

  return (
    <motion.div
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      variants={staggerContainer}
      initial={initial}
      animate="visible"
    >
      {items.map((item, i) => (
        <HighlightCard key={item.title} {...item} delay={i * 0.04} />
      ))}
    </motion.div>
  )
}
