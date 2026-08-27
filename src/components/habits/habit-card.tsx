import { motion } from 'framer-motion'
import { Archive, Flame, Pencil, Trash2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { isHabitCompletedToday } from '@/domain/habits/habit-actions'
import { calculateMomentum } from '@/domain/momentum/momentum'
import { useMotionConfig } from '@/hooks/use-motion'
import { useHabitStore } from '@/stores/habit-store'
import type { Habit, HabitCompletion } from '@/types'

interface HabitCardProps {
  habit: Habit
  completions: HabitCompletion[]
  onEdit: () => void
  index?: number
}

export function HabitCard({
  habit,
  completions,
  onEdit,
  index = 0,
}: HabitCardProps) {
  const toggleToday = useHabitStore((s) => s.toggleToday)
  const archiveHabit = useHabitStore((s) => s.archiveHabit)
  const removeHabit = useHabitStore((s) => s.removeHabit)
  const { reducedMotion } = useMotionConfig()

  const habitCompletions = completions.filter((c) => c.habitId === habit.id)
  const doneToday = isHabitCompletedToday(completions, habit.id)
  const momentum = calculateMomentum(
    habitCompletions.map((c) => c.completedAt),
  )
  const isArchived = Boolean(habit.archivedAt)

  return (
    <motion.article
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border border-border bg-surface/70 p-5 backdrop-blur-sm ${
        isArchived ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <motion.button
          type="button"
          disabled={isArchived}
          onClick={() => void toggleToday(habit.id)}
          whileTap={reducedMotion ? undefined : { scale: 0.92 }}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            doneToday
              ? 'border-success bg-success/20 text-success shadow-[0_0_20px_rgba(34,197,94,0.25)]'
              : 'border-border bg-surface-elevated text-muted hover:border-accent hover:text-accent'
          }`}
          aria-label={doneToday ? `Undo ${habit.name}` : `Complete ${habit.name}`}
        >
          {doneToday ? '✓' : '○'}
        </motion.button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">{habit.name}</h3>
              {habit.description && (
                <p className="mt-0.5 text-sm text-foreground-secondary">
                  {habit.description}
                </p>
              )}
            </div>
            <span className="shrink-0 rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400">
              {habit.frequency.toLowerCase()}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-surface-elevated/60 px-3 py-2">
              <p className="flex items-center gap-1 text-[10px] tracking-widest text-muted uppercase">
                <Flame className="h-3 w-3" />
                Streak
              </p>
              <p className="mt-0.5 font-mono text-xl font-semibold">
                {habit.currentStreak}
              </p>
            </div>
            <div className="rounded-lg bg-surface-elevated/60 px-3 py-2">
              <p className="text-[10px] tracking-widest text-muted uppercase">
                Best
              </p>
              <p className="mt-0.5 font-mono text-xl font-semibold">
                {habit.longestStreak}
              </p>
            </div>
            <div className="rounded-lg bg-surface-elevated/60 px-3 py-2">
              <p className="flex items-center gap-1 text-[10px] tracking-widest text-muted uppercase">
                <TrendingUp className="h-3 w-3" />
                21d
              </p>
              <p className="mt-0.5 font-mono text-xl font-semibold">
                {momentum.completedDays}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar
              value={momentum.score}
              label={`Momentum · ${momentum.completedDays}/${momentum.windowDays} days`}
            />
          </div>

          {!isArchived && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={onEdit}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void archiveHabit(habit.id)}
              >
                <Archive className="h-3.5 w-3.5" />
                Archive
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-danger hover:text-danger"
                onClick={() => {
                  if (window.confirm(`Delete "${habit.name}"?`)) {
                    void removeHabit(habit.id)
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
