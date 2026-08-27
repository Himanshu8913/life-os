import { motion } from 'framer-motion'
import type { LifeAreaNode } from '@/domain/life-map/build-life-map'
import { ProgressBar } from '@/components/ui/progress-bar'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import type { GoalCategory } from '@/types'

interface LifeMapMobileListProps {
  areas: LifeAreaNode[]
  selectedCategory: GoalCategory | null
  onSelectCategory: (category: GoalCategory) => void
}

export function LifeMapMobileList({
  areas,
  selectedCategory,
  onSelectCategory,
}: LifeMapMobileListProps) {
  const { initial } = useMotionConfig()

  return (
    <motion.ul
      className="space-y-2 md:hidden"
      variants={staggerContainer}
      initial={initial}
      animate="visible"
    >
      {areas.map((area) => {
        const selected = selectedCategory === area.category
        return (
          <motion.li key={area.category} variants={fadeUp}>
            <button
              type="button"
              onClick={() => onSelectCategory(area.category)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                selected
                  ? 'border-accent/50 bg-accent/10'
                  : 'border-border bg-surface/60 hover:border-accent/30'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden>
                    {area.icon}
                  </span>
                  <div>
                    <p className="font-medium">{area.label}</p>
                    <p className="text-xs text-muted">
                      {area.stats.activeGoals} goals · {area.stats.activeQuests}{' '}
                      quests
                    </p>
                  </div>
                </div>
                <span className="font-mono text-sm text-accent">
                  {area.stats.progressScore}%
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar value={area.stats.progressScore} />
              </div>
            </button>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
