import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMotionConfig, scaleIn } from '@/hooks/use-motion'
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
  const { initial, reducedMotion } = useMotionConfig()

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border border-dashed border-border/80 bg-surface/30 py-16 text-center"
      role="status"
      variants={scaleIn}
      initial={initial}
      animate="visible"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse at center, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 70%)',
        }}
      />
      <div className="relative">
        {icon && (
          <motion.div
            className="mb-4 flex justify-center text-muted"
            aria-hidden
            animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {icon}
          </motion.div>
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
    </motion.div>
  )
}
