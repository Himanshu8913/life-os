import { motion } from 'framer-motion'
import type { TimelineDateGroup } from '@/domain/timeline/group-events'
import { TimelineEventRow } from '@/components/timeline/timeline-event-row'
import type { TimelineEvent } from '@/types'

interface TimelineFeedProps {
  groups: TimelineDateGroup[]
  onSelectEvent: (event: TimelineEvent) => void
}

export function TimelineFeed({ groups, onSelectEvent }: TimelineFeedProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center">
        <p className="text-sm text-foreground-secondary">
          No events match your filters.
        </p>
        <p className="mt-1 text-xs text-muted">
          Complete quests, habits, and goals to build your history.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.dateKey}>
          <motion.h3
            className="mb-3 text-xs font-semibold tracking-[0.25em] text-muted uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {group.label}
          </motion.h3>
          <ul className="space-y-2">
            {group.events.map((event, i) => (
              <li key={event.id}>
                <TimelineEventRow
                  event={event}
                  onSelect={onSelectEvent}
                  index={i}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
