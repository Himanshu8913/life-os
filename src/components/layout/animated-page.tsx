import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeIn } from '@/hooks/use-motion'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Initializing Life OS' }: LoadingScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <motion.div
          className="h-16 w-16 rounded-full border border-border"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-accent/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_var(--color-accent)]" />
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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
