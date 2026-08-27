import { motion } from 'framer-motion'
import { LIFE_ATTRIBUTES, type LifeAttributeKey } from '@/types/enums'
import { fadeUp, useMotionConfig } from '@/hooks/use-motion'

const ATTRIBUTE_LABELS: Record<LifeAttributeKey, string> = {
  discipline: 'Discipline',
  creativity: 'Creativity',
  fitness: 'Fitness',
  learning: 'Learning',
  social: 'Social',
  finance: 'Finance',
}

interface LifeAttributesPanelProps {
  attributes: Record<LifeAttributeKey, number>
}

export function LifeAttributesPanel({ attributes }: LifeAttributesPanelProps) {
  const { reducedMotion, initial } = useMotionConfig()

  return (
    <motion.div
      initial={initial}
      animate="visible"
      variants={fadeUp}
      className="rounded-xl border border-border bg-surface/60 p-5 backdrop-blur-sm"
    >
      <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
        Life Attributes
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {LIFE_ATTRIBUTES.map((key, i) => (
          <motion.div
            key={key}
            initial={reducedMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-foreground-secondary">
                {ATTRIBUTE_LABELS[key]}
              </span>
              <span className="font-mono text-foreground">{attributes[key]}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
              <motion.div
                className="h-full rounded-full bg-accent/80"
                initial={reducedMotion ? false : { width: 0 }}
                animate={{ width: `${attributes[key]}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
