import { getEventMeta } from '@/domain/timeline/event-meta'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { fadeUp } from '@/hooks/use-motion'
import type { TimelineEvent } from '@/types'

interface RecentActivityPanelProps {
  events: TimelineEvent[]
}

export function RecentActivityPanel({ events }: RecentActivityPanelProps) {
  return (
    <motion.div variants={fadeUp} className="glass-panel p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-cyan-300 uppercase">
          <Activity className="h-3.5 w-3.5" />
          Recent Activity
        </div>
        <Link to={ROUTES.timeline} className="text-xs text-cyan-400 hover:underline">
          Timeline
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {events.slice(0, 6).map((event, i) => {
          const meta = getEventMeta(event.type)
          return (
            <motion.li
              key={event.id}
              className="flex items-start gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-elevated/80 text-sm ring-1 ring-border/50"
                aria-hidden
              >
                {meta.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{event.title}</p>
                {event.description && (
                  <p className="truncate text-xs text-violet-300">
                    {event.description}
                  </p>
                )}
              </div>
              <time className="shrink-0 text-xs text-muted">
                {new Date(event.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </motion.li>
          )
        })}
        {events.length === 0 && (
          <li className="text-sm text-foreground-secondary">No activity yet.</li>
        )}
      </ul>
    </motion.div>
  )
}
