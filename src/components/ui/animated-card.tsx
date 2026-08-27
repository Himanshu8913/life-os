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
          : { y: -2, transition: { duration: 0.2 } }
      }
      className={`rounded-xl border border-border p-5 backdrop-blur-sm transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${
        elevated
          ? 'bg-surface-elevated/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
          : 'bg-surface/60'
      } ${className}`}
    >
      {children}
    </motion.div>
  )
}
