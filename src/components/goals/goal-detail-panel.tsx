import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/form-field'
import { ProgressBar } from '@/components/ui/progress-bar'
import { GOAL_CATEGORY_META, GOAL_STATUS_META } from '@/components/goals/goal-meta'
import { calculateGoalProgress } from '@/domain/goals/goal-progress'
import { useMotionConfig } from '@/hooks/use-motion'
import { useGoalStore } from '@/stores/goal-store'
import { useQuestStore } from '@/stores/quest-store'
import type { Goal } from '@/types'

interface GoalDetailPanelProps {
  goal: Goal
  onEdit: () => void
}

export function GoalDetailPanel({ goal, onEdit }: GoalDetailPanelProps) {
  const {
    toggleMilestone,
    reorderMilestone,
    createMilestone,
    deleteMilestone,
    finishGoal,
    attachQuest,
    detachQuest,
    archiveGoal,
    removeGoal,
  } = useGoalStore()
  const quests = useQuestStore((s) => s.quests)
  const { reducedMotion } = useMotionConfig()

  const [newMilestone, setNewMilestone] = useState('')
  const [showLinkQuest, setShowLinkQuest] = useState(false)

  const category = GOAL_CATEGORY_META[goal.category]
  const progress = calculateGoalProgress(goal.milestones)
  const linkedQuests = quests.filter(
    (q) => q.goalId === goal.id || goal.linkedQuestIds.includes(q.id),
  )
  const unlinkableQuests = quests.filter(
    (q) => !q.goalId && !goal.linkedQuestIds.includes(q.id) && q.status !== 'COMPLETED',
  )
  const isActive = goal.status === 'ACTIVE'
  const sortedMilestones = [...goal.milestones].sort((a, b) => a.order - b.order)

  async function handleAddMilestone() {
    if (!newMilestone.trim()) return
    await createMilestone(goal.id, newMilestone)
    setNewMilestone('')
  }

  return (
    <motion.div
      layout={!reducedMotion}
      className="rounded-xl border border-border bg-surface-elevated/80 p-6 backdrop-blur-sm"
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{category.icon}</span>
            <span className="uppercase tracking-widest">{category.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${GOAL_STATUS_META[goal.status].className}`}
            >
              {GOAL_STATUS_META[goal.status].label}
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">{goal.title}</h2>
          {goal.description && (
            <p className="mt-2 text-sm text-foreground-secondary">{goal.description}</p>
          )}
          {goal.targetDate && (
            <p className="mt-2 text-xs text-muted">
              Target:{' '}
              {new Date(goal.targetDate).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isActive && (
            <Button size="sm" variant="secondary" onClick={onEdit}>
              Edit
            </Button>
          )}
          {isActive && goal.milestones.length > 0 && progress < 100 && (
            <Button size="sm" onClick={() => void finishGoal(goal.id)}>
              <Check className="h-3.5 w-3.5" />
              Complete Goal
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar value={progress} label={`${progress}% complete`} />
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-medium tracking-widest text-muted uppercase">
          Milestones
        </h3>
        <ul className="mt-3 space-y-2">
          {sortedMilestones.map((milestone, index) => (
            <motion.li
              key={milestone.id}
              layout={!reducedMotion}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-surface/50 px-3 py-2"
            >
              <button
                type="button"
                disabled={!isActive}
                onClick={() => void toggleMilestone(goal.id, milestone.id)}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  milestone.completed
                    ? 'border-success bg-success/20 text-success'
                    : 'border-border hover:border-accent hover:text-accent'
                }`}
                aria-label={`Toggle ${milestone.title}`}
              >
                {milestone.completed ? <Check className="h-3.5 w-3.5" /> : null}
              </button>
              <span
                className={`min-w-0 flex-1 text-sm ${
                  milestone.completed ? 'text-foreground-secondary line-through' : ''
                }`}
              >
                {milestone.title}
              </span>
              {isActive && (
                <div className="flex shrink-0 gap-0.5">
                  <button
                    type="button"
                    className="rounded p-1 text-muted hover:text-foreground"
                    onClick={() => void reorderMilestone(goal.id, milestone.id, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 text-muted hover:text-foreground"
                    onClick={() => void reorderMilestone(goal.id, milestone.id, 1)}
                    disabled={index === sortedMilestones.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 text-muted hover:text-danger"
                    onClick={() => void deleteMilestone(goal.id, milestone.id)}
                    aria-label="Delete milestone"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </motion.li>
          ))}
          {sortedMilestones.length === 0 && (
            <li className="text-sm text-foreground-secondary">No milestones yet.</li>
          )}
        </ul>

        {isActive && (
          <div className="mt-3 flex gap-2">
            <Input
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="Add milestone…"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void handleAddMilestone()
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => void handleAddMilestone()}
              disabled={!newMilestone.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-border/60 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium tracking-widest text-muted uppercase">
            Linked Quests
          </h3>
          {isActive && unlinkableQuests.length > 0 && (
            <button
              type="button"
              className="text-xs text-accent hover:underline"
              onClick={() => setShowLinkQuest(!showLinkQuest)}
            >
              {showLinkQuest ? 'Cancel' : 'Link quest'}
            </button>
          )}
        </div>

        {showLinkQuest && (
          <ul className="mt-2 space-y-1 rounded-lg border border-border/60 p-2">
            {unlinkableQuests.map((q) => (
              <li key={q.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-surface"
                  onClick={() => {
                    void attachQuest(goal.id, q.id)
                    setShowLinkQuest(false)
                  }}
                >
                  <ChevronRight className="h-3.5 w-3.5 text-accent" />
                  {q.title}
                </button>
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-3 space-y-2">
          {linkedQuests.map((q) => (
            <li
              key={q.id}
              className="flex items-center justify-between rounded-lg bg-surface/50 px-3 py-2 text-sm"
            >
              <span>{q.title}</span>
              {isActive && (
                <button
                  type="button"
                  className="text-xs text-muted hover:text-danger"
                  onClick={() => void detachQuest(goal.id, q.id)}
                >
                  Unlink
                </button>
              )}
            </li>
          ))}
          {linkedQuests.length === 0 && (
            <li className="text-sm text-foreground-secondary">No linked quests.</li>
          )}
        </ul>
      </div>

      {isActive && (
        <div className="mt-6 flex gap-2 border-t border-border/60 pt-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void archiveGoal(goal.id)}
          >
            Archive
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-danger hover:text-danger"
            onClick={() => {
              if (window.confirm(`Delete goal "${goal.title}"?`)) {
                void removeGoal(goal.id)
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      )}
    </motion.div>
  )
}
