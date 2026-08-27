import { motion } from 'framer-motion'
import { formatWeekLabel } from '@/domain/reflection/week-utils'
import { AnimatedCard } from '@/components/ui/animated-card'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import type { Reflection } from '@/types'
import type { ReflectionSummary } from '@/domain/reflection/build-reflection-summary'

interface ReflectionHistoryProps {
  reflections: Reflection[]
  getSummary: (reflection: Reflection) => ReflectionSummary
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function ReflectionHistory({
  reflections,
  getSummary,
  selectedId,
  onSelect,
}: ReflectionHistoryProps) {
  const { initial } = useMotionConfig()

  if (reflections.length === 0) {
    return (
      <p className="text-sm text-foreground-secondary">
        No past reflections yet. Submit your first weekly check-in above.
      </p>
    )
  }

  return (
    <motion.ul
      className="space-y-2"
      variants={staggerContainer}
      initial={initial}
      animate="visible"
    >
      {reflections.map((reflection, i) => {
        const summary = getSummary(reflection)
        const selected = selectedId === reflection.id
        return (
          <motion.li key={reflection.id} variants={fadeUp}>
            <button
              type="button"
              onClick={() => onSelect(selected ? null : reflection.id)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                selected
                  ? 'border-accent/50 bg-accent/10'
                  : 'border-border bg-surface/50 hover:border-accent/30'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-widest text-muted uppercase">
                    {formatWeekLabel(reflection.weekStart)}
                  </p>
                  <p className="mt-1 text-sm font-medium">{summary.headline}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-foreground-secondary">
                    {reflection.proudOf || reflection.wentWell}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-muted">
                  {new Date(reflection.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </button>
            {selected && (
              <AnimatedCard delay={i * 0.02} className="mt-2">
                <motion.div variants={fadeUp} className="space-y-3 text-sm">
                  <p>
                    <span className="text-muted">Went well: </span>
                    {reflection.wentWell || '—'}
                  </p>
                  <p>
                    <span className="text-muted">Didn&apos;t go well: </span>
                    {reflection.wentPoorly || '—'}
                  </p>
                  <p>
                    <span className="text-muted">Proud of: </span>
                    {reflection.proudOf || '—'}
                  </p>
                  <p>
                    <span className="text-muted">Next week: </span>
                    {reflection.nextWeekFocus || '—'}
                  </p>
                </motion.div>
              </AnimatedCard>
            )}
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
