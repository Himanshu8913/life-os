import { Modal } from '@/components/ui/modal'
import { getEventMeta, getEventXp } from '@/domain/timeline/event-meta'
import type { TimelineEvent } from '@/types'

interface TimelineEventDetailProps {
  event: TimelineEvent | null
  onClose: () => void
}

export function TimelineEventDetail({ event, onClose }: TimelineEventDetailProps) {
  if (!event) return null

  const meta = getEventMeta(event.type)
  const xp = getEventXp(event)
  const created = new Date(event.createdAt)

  return (
    <Modal open={Boolean(event)} onClose={onClose} title={event.title} size="lg">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${meta.accentClass}`} aria-hidden>
            {meta.icon}
          </span>
          <div>
            <p className="text-sm font-medium">{meta.label}</p>
            <time className="text-xs text-muted">
              {created.toLocaleString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </time>
          </div>
        </div>

        {event.description && (
          <p className="text-sm text-foreground-secondary">{event.description}</p>
        )}

        {xp > 0 && (
          <p className="font-mono text-lg font-semibold text-accent">+{xp} XP</p>
        )}

        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <div className="rounded-lg border border-border bg-surface/50 p-4">
            <p className="mb-2 text-xs font-medium tracking-widest text-muted uppercase">
              Details
            </p>
            <dl className="space-y-2">
              {Object.entries(event.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 text-sm">
                  <dt className="text-foreground-secondary">{key}</dt>
                  <dd className="font-mono text-right">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </Modal>
  )
}
