import { motion } from 'framer-motion'
import { GOAL_CATEGORY_META, GOAL_STATUS_META } from '@/components/goals/goal-meta'
import { calculateGoalProgress } from '@/domain/goals/goal-progress'
import { ProgressBar } from '@/components/ui/progress-bar'
import type { Goal } from '@/types'

interface GoalCardProps {
  goal: Goal
  selected: boolean
  onSelect: () => void
  index?: number
}

export function GoalCard({ goal, selected, onSelect, index = 0 }: GoalCardProps) {
  const category = GOAL_CATEGORY_META[goal.category]
  const progress = calculateGoalProgress(goal.milestones)
  const completedMilestones = goal.milestones.filter((m) => m.completed).length

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected
          ? 'border-accent bg-accent/5 shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]'
          : 'border-border bg-surface/60 hover:border-border hover:bg-surface-elevated/60'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">
          {category.icon} {category.label}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${GOAL_STATUS_META[goal.status].className}`}
        >
          {GOAL_STATUS_META[goal.status].label}
        </span>
      </div>
      <h3 className="mt-2 font-semibold leading-snug">{goal.title}</h3>
      {goal.milestones.length > 0 && (
        <div className="mt-3">
          <ProgressBar value={progress} />
          <p className="mt-1.5 text-xs text-muted">
            {completedMilestones} / {goal.milestones.length} milestones
          </p>
        </div>
      )}
      {goal.targetDate && (
        <p className="mt-2 text-xs text-foreground-secondary">
          Due {new Date(goal.targetDate).toLocaleDateString()}
        </p>
      )}
    </motion.button>
  )
}
