import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMotionConfig, scaleIn } from '@/hooks/use-motion'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  elevated?: boolean
  delay?: number
}

export function AnimatedCard({
  children,
  className = '',
  elevated = false,
  delay = 0,
}: AnimatedCardProps) {
  const { reducedMotion, transition, initial } = useMotionConfig()

  return (
    <motion.div
      variants={scaleIn}
      initial={initial}
      animate="visible"
      transition={reducedMotion ? { duration: 0 } : { ...transition, delay }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -3,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }
      }
      className={`relative overflow-hidden rounded-xl border p-5 backdrop-blur-md transition-[box-shadow,border-color] duration-300 hover:border-accent/20 hover:shadow-[var(--shadow-card-hover)] ${
        elevated
          ? 'glass-panel-elevated'
          : 'border-border/80 bg-surface/55 shadow-[var(--shadow-card)]'
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      {children}
    </motion.div>
  )
}
