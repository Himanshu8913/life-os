import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MonthSummary } from '@/domain/timeline/month-summary'
import { getEventMeta } from '@/domain/timeline/event-meta'
import { AnimatedCard } from '@/components/ui/animated-card'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'

interface TimelineMonthViewProps {
  summary: MonthSummary
  onPrevMonth: () => void
  onNextMonth: () => void
  onSelectEvent: (eventId: string) => void
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-surface/50 px-3 py-2.5 text-center">
      <p className="font-mono text-xl font-semibold">{value}</p>
      <p className="mt-0.5 text-[11px] text-muted">{label}</p>
    </div>
  )
}

export function TimelineMonthView({
  summary,
  onPrevMonth,
  onNextMonth,
  onSelectEvent,
}: TimelineMonthViewProps) {
  const { initial } = useMotionConfig()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold">{summary.label}</h2>
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <motion.div
        className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <AnimatedCard delay={0}>
          <motion.div variants={fadeUp}>
            <StatCard label="Quests" value={summary.questsCompleted} />
          </motion.div>
        </AnimatedCard>
        <AnimatedCard delay={0.03}>
          <motion.div variants={fadeUp}>
            <StatCard label="Habits" value={summary.habitsCompleted} />
          </motion.div>
        </AnimatedCard>
        <AnimatedCard delay={0.06}>
          <motion.div variants={fadeUp}>
            <StatCard label="Milestones" value={summary.milestonesCompleted} />
          </motion.div>
        </AnimatedCard>
        <AnimatedCard delay={0.09}>
          <motion.div variants={fadeUp}>
            <StatCard label="XP earned" value={summary.xpEarned} />
          </motion.div>
        </AnimatedCard>
      </motion.div>

      <AnimatedCard elevated delay={0.1}>
        <motion.div variants={fadeUp}>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            Major events
          </p>
          <ul className="mt-4 space-y-2">
            {summary.majorEvents.length === 0 ? (
              <li className="text-sm text-foreground-secondary">
                No major events this month.
              </li>
            ) : (
              summary.majorEvents.map((event) => {
                const meta = getEventMeta(event.type)
                return (
                  <li key={event.id}>
                    <button
                      type="button"
                      onClick={() => onSelectEvent(event.id)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-surface/80"
                    >
                      <span className={meta.accentClass}>{meta.icon}</span>
                      <span className="flex-1 truncate text-sm">{event.title}</span>
                      <time className="text-xs text-muted">
                        {new Date(event.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </motion.div>
      </AnimatedCard>
    </div>
  )
}
