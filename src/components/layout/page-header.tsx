import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeDown, fadeUp } from '@/hooks/use-motion'
import { useMotionConfig } from '@/hooks/use-motion'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  const { initial, reducedMotion } = useMotionConfig()

  if (reducedMotion) {
    return (
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-foreground-secondary">
              {description}
            </p>
          )}
        </div>
        {children}
      </header>
    )
  }

  return (
    <motion.header
      className="mb-8 flex items-start justify-between gap-4"
      initial={initial}
      animate="visible"
      variants={fadeDown}
    >
      <div>
        <motion.h1
          className="text-2xl font-semibold tracking-tight"
          variants={fadeUp}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            className="mt-1 text-sm text-foreground-secondary"
            variants={fadeUp}
          >
            {description}
          </motion.p>
        )}
      </div>
      {children && (
        <motion.div variants={fadeUp}>{children}</motion.div>
      )}
    </motion.header>
  )
}
