import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { easeOut, fadeIn } from '@/hooks/use-motion'
import { useMotionConfig } from '@/hooks/use-motion'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Initializing Life OS' }: LoadingScreenProps) {
  const { reducedMotion } = useMotionConfig()

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          className="h-16 w-16 rounded-full border border-border/80"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-accent/20"
          animate={
            reducedMotion
              ? undefined
              : { scale: [1, 1.18, 1], opacity: [0.35, 0.75, 0.35] }
          }
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="h-3 w-3 rounded-full bg-accent glow-accent"
            animate={reducedMotion ? undefined : { scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
      <motion.p
        className="mt-8 text-xs font-medium tracking-[0.25em] text-muted uppercase"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        {message}
      </motion.p>
    </motion.div>
  )
}

interface AnimatedPageProps {
  children: ReactNode
  className?: string
}

export function AnimatedPage({ children, className = '' }: AnimatedPageProps) {
  const { reducedMotion, pageTransition } = useMotionConfig()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      transition={easeOut}
    >
      {children}
    </motion.div>
  )
}
