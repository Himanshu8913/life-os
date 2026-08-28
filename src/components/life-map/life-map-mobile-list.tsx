import { motion } from 'framer-motion'
import { GOAL_CATEGORY_META } from '@/domain/goals/category-meta'
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
        const meta = GOAL_CATEGORY_META[area.category]
        return (
          <motion.li key={area.category} variants={fadeUp}>
            <button
              type="button"
              onClick={() => onSelectCategory(area.category)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selected
                  ? `${meta.border} ${meta.bg}`
                  : 'border-border/70 bg-surface/50 hover:border-border'
              }`}
              style={
                selected
                  ? { boxShadow: `0 0 24px ${meta.hex}33` }
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${meta.bg} ring-1 ${meta.border}`}
                    aria-hidden
                  >
                    {area.icon}
                  </span>
                  <div>
                    <p className={`font-medium ${selected ? meta.color : ''}`}>
                      {area.label}
                    </p>
                    <p className="text-xs text-muted">
                      {area.stats.activeGoals} goals · {area.stats.activeQuests}{' '}
                      quests
                    </p>
                  </div>
                </div>
                <span className="font-mono text-sm" style={{ color: meta.hex }}>
                  {area.stats.progressScore}%
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar
                  value={area.stats.progressScore}
                  color={`linear-gradient(90deg, ${meta.hex}, ${meta.hex}88)`}
                />
              </div>
            </button>
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
