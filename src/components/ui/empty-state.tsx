import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className="rounded-xl border border-dashed border-border py-16 text-center"
      role="status"
    >
      {icon && (
        <div className="mb-4 flex justify-center text-muted" aria-hidden>
          {icon}
        </div>
      )}
      <p className="text-xs font-medium tracking-widest text-muted uppercase">
        {title}
      </p>
      <p className="mt-2 text-sm text-foreground-secondary">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-4" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
