import { motion } from 'framer-motion'
import { getEventMeta, getEventXp } from '@/domain/timeline/event-meta'
import type { TimelineEvent } from '@/types'

interface TimelineEventRowProps {
  event: TimelineEvent
  onSelect: (event: TimelineEvent) => void
  index?: number
}

export function TimelineEventRow({
  event,
  onSelect,
  index = 0,
}: TimelineEventRowProps) {
  const meta = getEventMeta(event.type)
  const xp = getEventXp(event)

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(event)}
      className="flex w-full items-start gap-3 rounded-lg border border-border/50 bg-surface/40 px-3 py-3 text-left transition-colors hover:border-accent/30 hover:bg-surface/80"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <span className={`mt-0.5 text-base ${meta.accentClass}`} aria-hidden>
        {meta.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{event.title}</p>
        {event.description && (
          <p className="mt-0.5 text-xs text-foreground-secondary">
            {event.description}
          </p>
        )}
        <p className="mt-1 text-[11px] tracking-wide text-muted uppercase">
          {meta.label}
          {xp > 0 && (
            <span className="ml-2 font-mono text-accent normal-case">
              +{xp} XP
            </span>
          )}
        </p>
      </div>
      <time className="shrink-0 text-xs text-muted">
        {new Date(event.createdAt).toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })}
      </time>
    </motion.button>
  )
}
