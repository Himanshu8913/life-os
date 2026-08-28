import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Flame } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import { DailyCheckIn } from '@/components/check-in/daily-check-in'
import { DailyMissionBoard } from '@/components/dashboard/daily-mission-board'
import { DashboardHero } from '@/components/dashboard/dashboard-hero'
import { LifeAttributesPanel } from '@/components/dashboard/life-attributes-panel'
import { MomentumSummary } from '@/components/dashboard/momentum-summary'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentActivityPanel } from '@/components/dashboard/recent-activity-panel'
import { AnimatedCard } from '@/components/ui/animated-card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { calculateGoalProgress } from '@/domain/goals/goal-progress'
import { isHabitCompletedToday } from '@/domain/habits/habit-actions'
import {
  calculateAggregateMomentum,
} from '@/domain/momentum/momentum'
import {
  calculateLevel,
  calculateXpProgress,
} from '@/domain/progression/calculate-level'
import { formatDashboardDate, getGreeting } from '@/lib/dates/greeting'
import { ROUTES } from '@/lib/constants'
import { staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useCommandPaletteStore } from '@/stores/command-palette-store'
import { useDailyMissionStore } from '@/stores/daily-mission-store'
import { useGoalStore } from '@/stores/goal-store'
import { useHabitStore } from '@/stores/habit-store'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimelineStore } from '@/stores/timeline-store'
import type { LifeAttributeKey } from '@/types/enums'

const DEFAULT_ATTRIBUTES: Record<LifeAttributeKey, number> = {
  discipline: 50,
  creativity: 50,
  fitness: 50,
  learning: 50,
  social: 50,
  finance: 50,
}

export function DashboardPage() {
  const profile = useProfileStore((s) => s.profile)
  const quests = useQuestStore((s) => s.quests)
  const completeQuest = useQuestStore((s) => s.completeQuest)
  const goals = useGoalStore((s) => s.goals)
  const habits = useHabitStore((s) => s.habits)
  const habitCompletions = useHabitStore((s) => s.completions)
  const toggleHabit = useHabitStore((s) => s.toggleToday)
  const events = useTimelineStore((s) => s.events)
  const { initial, reducedMotion } = useMotionConfig()

  const [completingId, setCompletingId] = useState<string | null>(null)
  const [togglingHabitId, setTogglingHabitId] = useState<string | null>(null)
  const openModal = useCommandPaletteStore((s) => s.openModal)
  const syncMissions = useDailyMissionStore((s) => s.sync)

  useEffect(() => {
    void syncMissions()
  }, [syncMissions])

  const now = useMemo(() => new Date(), [])
  const totalXp = profile?.totalXp ?? 0
  const xp = calculateXpProgress(totalXp)
  const level = calculateLevel(totalXp)
  const attributes = profile?.attributes ?? DEFAULT_ATTRIBUTES

  const activeQuests = quests.filter((q) =>
    ['TODO', 'IN_PROGRESS'].includes(q.status),
  )
  const todayQuests = quests.filter(
    (q) =>
      q.type === 'DAILY' && ['TODO', 'IN_PROGRESS'].includes(q.status),
  )
  const activeHabits = habits.filter((h) => !h.archivedAt)
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE')

  const habitMomentum = calculateAggregateMomentum(
    habitCompletions,
    activeHabits.map((h) => h.id),
  )
  const topStreak = activeHabits.reduce(
    (max, h) => Math.max(max, h.currentStreak),
    0,
  )

  async function handleQuickComplete(questId: string) {
    setCompletingId(questId)
    try {
      await completeQuest(questId)
    } finally {
      setCompletingId(null)
    }
  }

  async function handleHabitToggle(habitId: string) {
    setTogglingHabitId(habitId)
    try {
      await toggleHabit(habitId)
    } finally {
      setTogglingHabitId(null)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardHero
        greeting={getGreeting(now)}
        dateLine={formatDashboardDate(now)}
        displayName={profile?.displayName ?? 'Commander'}
        level={level}
        totalXp={totalXp}
        xp={xp}
      />

      <QuickActions
        onNewQuest={() => openModal('quest')}
        onNewGoal={() => openModal('goal')}
        onNewHabit={() => openModal('habit')}
      />

      <DailyMissionBoard />

      <DailyCheckIn />

      <motion.div
        className="grid gap-4 lg:grid-cols-3"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <div className="space-y-4 lg:col-span-2">
          <AnimatedCard elevated delay={0}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Today
              </p>
              <Link to={ROUTES.quests} className="text-xs text-accent hover:underline">
                All quests
              </Link>
            </div>
            <ul className="mt-4 space-y-2">
              {todayQuests.length === 0 && activeQuests.length === 0 ? (
                <li className="text-sm text-foreground-secondary">
                  Nothing on the board.{' '}
                  <button
                    type="button"
                    className="text-accent hover:underline"
                    onClick={() => openModal('quest')}
                  >
                    Add a quest
                  </button>
                </li>
              ) : (
                (todayQuests.length > 0 ? todayQuests : activeQuests.slice(0, 5)).map(
                  (quest, i) => (
                    <motion.li
                      key={quest.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface/50 px-3 py-2.5"
                      initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.04 }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{quest.title}</p>
                        <p className="font-mono text-xs text-accent">
                          +{quest.xpReward} XP
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleQuickComplete(quest.id)}
                        disabled={completingId === quest.id}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:bg-accent/20 hover:text-accent disabled:opacity-50"
                        aria-label={`Complete ${quest.title}`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </motion.li>
                  ),
                )
              )}
            </ul>
          </AnimatedCard>

          <AnimatedCard delay={0.05}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Active Goals
              </p>
              <Link to={ROUTES.goals} className="text-xs text-accent hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-3 space-y-2">
              {activeGoals.length === 0 ? (
                <li className="text-sm text-foreground-secondary">No active goals.</li>
              ) : (
                activeGoals.slice(0, 3).map((goal) => (
                  <li key={goal.id}>
                    <Link
                      to={ROUTES.goals}
                      className="block rounded-lg border border-border/60 bg-surface/50 p-3 transition-colors hover:border-accent/40"
                    >
                      <p className="text-sm font-medium">{goal.title}</p>
                      <div className="mt-2">
                        <ProgressBar
                          value={calculateGoalProgress(goal.milestones)}
                        />
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </AnimatedCard>

          <AnimatedCard delay={0.1}>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                Habits
              </p>
              <Link to={ROUTES.habits} className="text-xs text-accent hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-3 space-y-2">
              {activeHabits.length === 0 ? (
                <li className="text-sm text-foreground-secondary">No habits yet.</li>
              ) : (
                activeHabits.slice(0, 4).map((habit, i) => {
                  const done = isHabitCompletedToday(habitCompletions, habit.id)
                  return (
                    <motion.li
                      key={habit.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface/50 px-3 py-2"
                      initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.04 }}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm ${done ? 'text-foreground-secondary line-through' : 'font-medium'}`}
                        >
                          {habit.name}
                        </p>
                        <p className="text-xs text-muted">
                          🔥 {habit.currentStreak} day streak
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleHabitToggle(habit.id)}
                        disabled={togglingHabitId === habit.id}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          done
                            ? 'border-success bg-success/20 text-success'
                            : 'border-border hover:border-accent hover:text-accent'
                        }`}
                        aria-label={`Toggle ${habit.name}`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </motion.li>
                  )
                })
              )}
            </ul>
          </AnimatedCard>
        </div>

        <div className="space-y-4">
          <LifeAttributesPanel attributes={attributes} />
          <MomentumSummary momentum={habitMomentum} topStreak={topStreak} />
          <RecentActivityPanel events={events} />
        </div>
      </motion.div>

    </div>
  )
}
