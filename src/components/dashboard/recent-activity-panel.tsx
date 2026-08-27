import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { fadeUp } from '@/hooks/use-motion'
import type { TimelineEvent } from '@/types'

const EVENT_ICONS: Record<string, string> = {
  QUEST_COMPLETED: '⚔',
  GOAL_CREATED: '🎯',
  GOAL_COMPLETED: '🏆',
  MILESTONE_COMPLETED: '◆',
  HABIT_COMPLETED: '🔥',
  LEVEL_UP: '✦',
  ACHIEVEMENT_UNLOCKED: '★',
}

interface RecentActivityPanelProps {
  events: TimelineEvent[]
}

export function RecentActivityPanel({ events }: RecentActivityPanelProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
          <Activity className="h-3.5 w-3.5" />
          Recent Activity
        </div>
        <Link to={ROUTES.timeline} className="text-xs text-accent hover:underline">
          Timeline
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {events.slice(0, 6).map((event, i) => (
          <motion.li
            key={event.id}
            className="flex items-start gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <span className="mt-0.5 text-sm" aria-hidden>
              {EVENT_ICONS[event.type] ?? '·'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{event.title}</p>
              {event.description && (
                <p className="truncate text-xs text-accent">{event.description}</p>
              )}
            </div>
            <time className="shrink-0 text-xs text-muted">
              {new Date(event.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </motion.li>
        ))}
        {events.length === 0 && (
          <li className="text-sm text-foreground-secondary">No activity yet.</li>
        )}
      </ul>
    </motion.div>
  )
}
