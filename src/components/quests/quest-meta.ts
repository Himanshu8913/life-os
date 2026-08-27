import type { QuestType } from '@/types'

export const QUEST_TYPE_META: Record<
  QuestType,
  { label: string; icon: string; color: string }
> = {
  DAILY: { label: 'Daily Quest', icon: '☀', color: 'text-amber-400' },
  SIDE: { label: 'Side Quest', icon: '◇', color: 'text-sky-400' },
  MAIN: { label: 'Main Quest', icon: '⚔', color: 'text-accent' },
  EPIC: { label: 'Epic Quest', icon: '✦', color: 'text-violet-400' },
}

export const PRIORITY_META = {
  LOW: { label: 'Low', className: 'text-muted' },
  MEDIUM: { label: 'Medium', className: 'text-foreground-secondary' },
  HIGH: { label: 'High', className: 'text-warning' },
  URGENT: { label: 'Urgent', className: 'text-danger' },
} as const

export const STATUS_META = {
  TODO: { label: 'To Do', className: 'bg-surface-elevated text-foreground-secondary' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-accent/15 text-accent' },
  COMPLETED: { label: 'Completed', className: 'bg-success/15 text-success' },
  ARCHIVED: { label: 'Archived', className: 'bg-muted/20 text-muted' },
  CANCELLED: { label: 'Cancelled', className: 'bg-danger/15 text-danger' },
} as const
