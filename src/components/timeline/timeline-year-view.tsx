import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { YearSummary } from '@/domain/timeline/year-summary'
import { getEventMeta } from '@/domain/timeline/event-meta'
import { useMotionConfig } from '@/hooks/use-motion'

interface TimelineYearViewProps {
  summary: YearSummary
  onPrevYear: () => void
  onNextYear: () => void
  onSelectMonth: (monthKey: string) => void
}

export function TimelineYearView({
  summary,
  onPrevYear,
  onNextYear,
  onSelectMonth,
}: TimelineYearViewProps) {
  const { reducedMotion } = useMotionConfig()
  const maxEvents = Math.max(...summary.months.map((m) => m.eventCount), 1)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevYear}
          className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground"
          aria-label="Previous year"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h2 className="font-mono text-3xl font-bold">{summary.year}</h2>
          <p className="mt-1 text-sm text-muted">
            {summary.totalEvents} events
          </p>
        </div>
        <button
          type="button"
          onClick={onNextYear}
          className="rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground"
          aria-label="Next year"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
        {summary.months.map((month, i) => {
          const intensity = month.eventCount / maxEvents
          return (
            <motion.button
              key={month.monthKey}
              type="button"
              onClick={() => onSelectMonth(month.monthKey)}
              className="group flex flex-col items-center rounded-xl border border-border/60 bg-surface/40 p-3 transition-colors hover:border-accent/40 hover:bg-surface/80"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className="text-[10px] font-semibold tracking-widest text-muted">
                {month.shortLabel}
              </span>
              <div
                className="mt-2 h-10 w-full rounded-md"
                style={{
                  background: `color-mix(in srgb, var(--color-accent) ${Math.round(intensity * 70 + 10)}%, transparent)`,
                }}
                aria-hidden
              />
              <span className="mt-2 font-mono text-sm font-medium">
                {month.eventCount}
              </span>
              <span className="text-[10px] text-muted">
                {month.activeDays}d active
              </span>
              {month.highlights.length > 0 && (
                <div className="mt-2 flex gap-0.5" aria-hidden>
                  {month.highlights.slice(0, 3).map((h) => (
                    <span key={h.id} className="text-[10px]">
                      {getEventMeta(h.type).icon}
                    </span>
                  ))}
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Click a month to open its snapshot
      </p>
    </div>
  )
}
