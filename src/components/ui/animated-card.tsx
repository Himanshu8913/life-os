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
      className={`relative overflow-hidden ${
        elevated ? 'glass-panel-elevated' : 'glass-panel'
      } p-5 transition-[box-shadow] duration-300 hover:shadow-[var(--shadow-card-hover)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-60"
        aria-hidden
      />
      {children}
    </motion.div>
  )
}
