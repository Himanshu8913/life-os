export { GOAL_CATEGORY_META } from '@/domain/goals/category-meta'

export const GOAL_STATUS_META = {
  ACTIVE: { label: 'Active', className: 'bg-accent/15 text-accent' },
  COMPLETED: { label: 'Completed', className: 'bg-success/15 text-success' },
  ARCHIVED: { label: 'Archived', className: 'bg-muted/20 text-muted' },
  CANCELLED: { label: 'Cancelled', className: 'bg-danger/15 text-danger' },
} as const
