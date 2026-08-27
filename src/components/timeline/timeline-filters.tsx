import type { DateRangePreset } from '@/domain/timeline/filter-events'
import { TIMELINE_EVENT_META } from '@/domain/timeline/event-meta'
import { TIMELINE_EVENT_TYPES, type TimelineEventType } from '@/types/enums'

interface TimelineFiltersBarProps {
  selectedTypes: TimelineEventType[]
  dateRange: DateRangePreset
  onTypesChange: (types: TimelineEventType[]) => void
  onDateRangeChange: (range: DateRangePreset) => void
}

const DATE_RANGES: { id: DateRangePreset; label: string }[] = [
  { id: 'all', label: 'All time' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: 'month', label: 'This month' },
]

export function TimelineFiltersBar({
  selectedTypes,
  dateRange,
  onTypesChange,
  onDateRangeChange,
}: TimelineFiltersBarProps) {
  function toggleType(type: TimelineEventType) {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypesChange([...selectedTypes, type])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {DATE_RANGES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onDateRangeChange(id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              dateRange === id
                ? 'bg-accent text-white'
                : 'bg-surface text-foreground-secondary hover:bg-surface-elevated'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onTypesChange([])}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            selectedTypes.length === 0
              ? 'bg-surface-elevated text-foreground'
              : 'text-muted hover:text-foreground-secondary'
          }`}
        >
          All types
        </button>
        {TIMELINE_EVENT_TYPES.map((type) => {
          const meta = TIMELINE_EVENT_META[type]
          const active = selectedTypes.includes(type)
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                active
                  ? 'bg-surface-elevated text-foreground'
                  : 'text-muted hover:text-foreground-secondary'
              }`}
            >
              <span aria-hidden>{meta.icon} </span>
              {meta.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
