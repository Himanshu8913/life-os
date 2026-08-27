import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { GoalCard } from '@/components/goals/goal-card'
import { GoalDetailPanel } from '@/components/goals/goal-detail-panel'
import { GoalFormModal } from '@/components/goals/goal-form-modal'
import { Button } from '@/components/ui/button'
import { staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useGoalStore } from '@/stores/goal-store'
import type { Goal, GoalStatus } from '@/types'

type FilterTab = 'active' | 'completed' | 'archived' | 'all'

const TABS: { id: FilterTab; label: string; statuses?: GoalStatus[] }[] = [
  { id: 'active', label: 'Active', statuses: ['ACTIVE'] },
  { id: 'completed', label: 'Completed', statuses: ['COMPLETED'] },
  { id: 'archived', label: 'Archived', statuses: ['ARCHIVED', 'CANCELLED'] },
  { id: 'all', label: 'All' },
]

function filterGoals(goals: Goal[], tab: FilterTab): Goal[] {
  const config = TABS.find((t) => t.id === tab)
  if (!config?.statuses) return goals
  return goals.filter((g) => config.statuses!.includes(g.status))
}

export function GoalsPage() {
  const goals = useGoalStore((s) => s.goals)
  const selectedGoalId = useGoalStore((s) => s.selectedGoalId)
  const selectGoal = useGoalStore((s) => s.selectGoal)
  const [tab, setTab] = useState<FilterTab>('active')
  const [formOpen, setFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const { initial } = useMotionConfig()

  const filtered = useMemo(() => filterGoals(goals, tab), [goals, tab])
  const selectedGoal =
    goals.find((g) => g.id === selectedGoalId) ?? filtered[0] ?? null

  function openCreate() {
    setEditingGoal(null)
    setFormOpen(true)
  }

  function openEdit(goal: Goal) {
    setEditingGoal(goal)
    setFormOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Goals"
        description="Long-term outcomes with milestones."
      >
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id)
              selectGoal(null)
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-accent text-white shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]'
                : 'bg-surface text-foreground-secondary hover:bg-surface-elevated hover:text-foreground'
            }`}
          >
            {label}
            <span className="ml-1.5 font-mono text-xs opacity-70">
              {filterGoals(goals, id).length}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        className="grid gap-6 lg:grid-cols-5"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
        key={tab}
      >
        <div className="space-y-3 lg:col-span-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm text-foreground-secondary">No goals here yet.</p>
              <Button className="mt-4" variant="secondary" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Create a goal
              </Button>
            </div>
          ) : (
            filtered.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                index={index}
                selected={selectedGoal?.id === goal.id}
                onSelect={() => selectGoal(goal.id)}
              />
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          {selectedGoal ? (
            <GoalDetailPanel
              goal={selectedGoal}
              onEdit={() => openEdit(selectedGoal)}
            />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-border text-sm text-foreground-secondary">
              Select a goal to view details
            </div>
          )}
        </div>
      </motion.div>

      <GoalFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingGoal(null)
        }}
        goal={editingGoal}
      />
    </div>
  )
}
