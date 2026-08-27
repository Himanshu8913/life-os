import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/page-header'
import { TimelineEventDetail } from '@/components/timeline/timeline-event-detail'
import { TimelineFeed } from '@/components/timeline/timeline-feed'
import { TimelineFiltersBar } from '@/components/timeline/timeline-filters'
import { TimelineMonthView } from '@/components/timeline/timeline-month-view'
import { TimelineYearView } from '@/components/timeline/timeline-year-view'
import {
  DEFAULT_TIMELINE_FILTERS,
  filterTimelineEvents,
  type DateRangePreset,
} from '@/domain/timeline/filter-events'
import { groupEventsByDate } from '@/domain/timeline/group-events'
import {
  buildMonthSummary,
  getDefaultMonthKey,
  shiftMonthKey,
} from '@/domain/timeline/month-summary'
import {
  buildYearSummary,
  getAvailableYears,
} from '@/domain/timeline/year-summary'
import { staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useTimelineStore } from '@/stores/timeline-store'
import type { TimelineEventType } from '@/types/enums'

type ViewMode = 'feed' | 'month' | 'year'

const VIEW_TABS: { id: ViewMode; label: string }[] = [
  { id: 'feed', label: 'Feed' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
]

export function TimelinePage() {
  const events = useTimelineStore((s) => s.events)
  const { initial } = useMotionConfig()

  const [view, setView] = useState<ViewMode>('feed')
  const [types, setTypes] = useState<TimelineEventType[]>([])
  const [dateRange, setDateRange] = useState<DateRangePreset>('all')
  const [monthKey, setMonthKey] = useState(getDefaultMonthKey)
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      filterTimelineEvents(events, {
        ...DEFAULT_TIMELINE_FILTERS,
        types,
        dateRange: view === 'feed' ? dateRange : 'all',
        monthKey: view === 'month' ? monthKey : undefined,
      }),
    [events, types, dateRange, view, monthKey],
  )

  const groups = useMemo(() => groupEventsByDate(filtered), [filtered])
  const monthSummary = useMemo(
    () => buildMonthSummary(events, monthKey),
    [events, monthKey],
  )
  const yearSummary = useMemo(
    () => buildYearSummary(events, year),
    [events, year],
  )
  const availableYears = useMemo(() => getAvailableYears(events), [events])

  const selectedEvent =
    events.find((e) => e.id === selectedEventId) ?? null

  function openMonthFromYear(key: string) {
    setMonthKey(key)
    setView('month')
  }

  return (
    <div>
      <PageHeader
        title="Timeline"
        description="Your life's activity history — every meaningful action, preserved."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {VIEW_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === id
                ? 'bg-accent text-white shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]'
                : 'bg-surface text-foreground-secondary hover:bg-surface-elevated'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial={initial}
        animate="visible"
        className="space-y-6"
      >
        {view === 'feed' && (
          <>
            <TimelineFiltersBar
              selectedTypes={types}
              dateRange={dateRange}
              onTypesChange={setTypes}
              onDateRangeChange={setDateRange}
            />
            <TimelineFeed
              groups={groups}
              onSelectEvent={(e) => setSelectedEventId(e.id)}
            />
          </>
        )}

        {view === 'month' && (
          <TimelineMonthView
            summary={monthSummary}
            onPrevMonth={() => setMonthKey((k) => shiftMonthKey(k, -1))}
            onNextMonth={() => setMonthKey((k) => shiftMonthKey(k, 1))}
            onSelectEvent={setSelectedEventId}
          />
        )}

        {view === 'year' && (
          <TimelineYearView
            summary={yearSummary}
            onPrevYear={() => {
              const idx = availableYears.indexOf(year)
              const next = availableYears[Math.min(idx + 1, availableYears.length - 1)]
              if (next !== undefined) setYear(next)
            }}
            onNextYear={() => {
              const idx = availableYears.indexOf(year)
              const next = availableYears[Math.max(idx - 1, 0)]
              if (next !== undefined) setYear(next)
            }}
            onSelectMonth={openMonthFromYear}
          />
        )}
      </motion.div>

      <TimelineEventDetail
        event={selectedEvent}
        onClose={() => setSelectedEventId(null)}
      />
    </div>
  )
}
