import { motion } from 'framer-motion'
import { useMotionConfig } from '@/hooks/use-motion'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  className = '',
}: ProgressBarProps) {
  const { reducedMotion } = useMotionConfig()
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex justify-between text-xs text-foreground-secondary">
          <span>{label}</span>
          <span className="font-mono">{Math.round(percent)}%</span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated/80 ring-1 ring-border/50"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <motion.div
          className="relative h-full rounded-full bg-gradient-to-r from-accent/80 via-accent to-accent/90"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 120, damping: 22 }
          }
        >
          {!reducedMotion && percent > 0 && (
            <div
              className="absolute inset-0 animate-shimmer rounded-full opacity-40"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
              }}
              aria-hidden
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}
