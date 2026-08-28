import { motion } from 'framer-motion'
import { LIFE_ATTRIBUTES, type LifeAttributeKey } from '@/types/enums'
import { ATTRIBUTE_COLORS } from '@/lib/colors/attribute-colors'
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
      className="glass-panel p-5"
    >
      <p className="text-xs font-medium tracking-[0.2em] text-violet-300 uppercase">
        Life Attributes
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {LIFE_ATTRIBUTES.map((key, i) => {
          const { hex, className } = ATTRIBUTE_COLORS[key]
          return (
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
                <span className="font-mono" style={{ color: hex }}>
                  {attributes[key]}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-elevated/80 ring-1 ring-border/40">
                <motion.div
                  className={`h-full rounded-full ${className}`}
                  style={{ boxShadow: `0 0 12px ${hex}55` }}
                  initial={reducedMotion ? false : { width: 0 }}
                  animate={{ width: `${attributes[key]}%` }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
