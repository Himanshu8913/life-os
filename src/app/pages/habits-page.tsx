import { motion } from 'framer-motion'
import { Plus, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { HabitCard } from '@/components/habits/habit-card'
import { HabitFormModal } from '@/components/habits/habit-form-modal'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import {
  calculateAggregateMomentum,
  MOMENTUM_WINDOW_DAYS,
} from '@/domain/momentum/momentum'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useHabitStore } from '@/stores/habit-store'
import type { Habit } from '@/types'

type Tab = 'active' | 'archived'

export function HabitsPage() {
  const habits = useHabitStore((s) => s.habits)
  const completions = useHabitStore((s) => s.completions)
  const [tab, setTab] = useState<Tab>('active')
  const [formOpen, setFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const { initial } = useMotionConfig()

  const activeHabits = habits.filter((h) => !h.archivedAt)
  const archivedHabits = habits.filter((h) => h.archivedAt)
  const displayed = tab === 'active' ? activeHabits : archivedHabits

  const aggregateMomentum = useMemo(
    () =>
      calculateAggregateMomentum(
        completions,
        activeHabits.map((h) => h.id),
      ),
    [completions, activeHabits],
  )

  const completedToday = activeHabits.filter((h) =>
    completions.some(
      (c) =>
        c.habitId === h.id &&
        new Date(c.completedAt).toDateString() === new Date().toDateString(),
    ),
  ).length

  return (
    <div>
      <PageHeader title="Habits" description="Recurring behaviors and momentum.">
        <Button onClick={() => { setEditingHabit(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4" />
          New Habit
        </Button>
      </PageHeader>

      <motion.div
        className="mb-6 grid gap-4 sm:grid-cols-3"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <AnimatedCard delay={0}>
          <motion.div variants={fadeUp}>
            <p className="text-xs tracking-widest text-muted uppercase">Today</p>
            <p className="mt-1 font-mono text-3xl font-semibold">
              {completedToday}/{activeHabits.length}
            </p>
            <p className="text-xs text-foreground-secondary">habits completed</p>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.05} className="sm:col-span-2">
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 text-xs tracking-widest text-muted uppercase">
              <TrendingUp className="h-3.5 w-3.5" />
              Overall Momentum · {MOMENTUM_WINDOW_DAYS} days
            </div>
            <div className="mt-3">
              <ProgressBar
                value={aggregateMomentum.score}
                label={`${aggregateMomentum.completedDays} avg active days · ${aggregateMomentum.score}%`}
              />
            </div>
          </motion.div>
        </AnimatedCard>
      </motion.div>

      <div className="mb-4 flex gap-2">
        {(['active', 'archived'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${
              tab === t
                ? 'bg-accent text-white'
                : 'bg-surface text-foreground-secondary hover:text-foreground'
            }`}
          >
            {t} ({t === 'active' ? activeHabits.length : archivedHabits.length})
          </button>
        ))}
      </div>

      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
        key={tab}
      >
        {displayed.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-foreground-secondary">
              {tab === 'active' ? 'No habits yet.' : 'No archived habits.'}
            </p>
            {tab === 'active' && (
              <Button
                className="mt-4"
                variant="secondary"
                onClick={() => setFormOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create a habit
              </Button>
            )}
          </div>
        ) : (
          displayed.map((habit, index) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              completions={completions}
              index={index}
              onEdit={() => {
                setEditingHabit(habit)
                setFormOpen(true)
              }}
            />
          ))
        )}
      </motion.div>

      <HabitFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingHabit(null)
        }}
        habit={editingHabit}
      />
    </div>
  )
}
