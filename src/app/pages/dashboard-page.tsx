import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Check, Sparkles, Swords } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { AnimatedCard } from '@/components/ui/animated-card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { QUEST_TYPE_META } from '@/components/quests/quest-meta'
import { calculateGoalProgress } from '@/domain/goals/goal-progress'
import { ROUTES } from '@/lib/constants'
import {
  calculateLevel,
  calculateXpProgress,
} from '@/domain/progression/calculate-level'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useGoalStore } from '@/stores/goal-store'
import { useHabitStore } from '@/stores/habit-store'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimelineStore } from '@/stores/timeline-store'

/**
 * Returns a time-of-day greeting based on the device's local clock.
 *
 * @returns The greeting string for the current local hour.
 */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 5) return 'Good Night'
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  if (hour < 21) return 'Good Evening'
  return 'Good Night'
}

export function DashboardPage() {
  const profile = useProfileStore((s) => s.profile)
  const quests = useQuestStore((s) => s.quests)
  const completeQuest = useQuestStore((s) => s.completeQuest)
  const goals = useGoalStore((s) => s.goals)
  const habits = useHabitStore((s) => s.habits)
  const events = useTimelineStore((s) => s.events)
  const { initial, reducedMotion } = useMotionConfig()
  const [completingId, setCompletingId] = useState<string | null>(null)

  const totalXp = profile?.totalXp ?? 0
  const xp = calculateXpProgress(totalXp)
  const level = calculateLevel(totalXp)
  const activeQuests = quests.filter((q) =>
    ['TODO', 'IN_PROGRESS'].includes(q.status),
  )
  const todayQuests = quests.filter(
    (q) =>
      q.type === 'DAILY' && ['TODO', 'IN_PROGRESS'].includes(q.status),
  )
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE')
  const now = new Date()

  async function handleQuickComplete(questId: string) {
    setCompletingId(questId)
    try {
      await completeQuest(questId)
    } finally {
      setCompletingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title={getGreeting()}
        description={now.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      />

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <AnimatedCard elevated className="md:col-span-2 lg:col-span-1" delay={0}>
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Level {level}
            </div>
            <p className="mt-3 font-mono text-4xl font-semibold tabular-nums">
              {profile?.displayName ?? '—'}
            </p>
            <div className="mt-5">
              <ProgressBar
                value={xp.currentXp}
                max={xp.xpForNextLevel - xp.xpForCurrentLevel}
                label={`${totalXp.toLocaleString()} XP · ${Math.round(xp.progressPercent)}% to next`}
              />
            </div>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.05}>
          <motion.div variants={fadeUp} className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Active Quests
              </p>
              <p className="mt-2 font-mono text-3xl font-semibold">
                {activeQuests.length}
              </p>
            </div>
            <Swords className="h-5 w-5 text-accent/70" />
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
          <motion.div variants={fadeUp}>
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
          </motion.div>
        </AnimatedCard>

        <AnimatedCard elevated className="md:col-span-2" delay={0.15}>
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Today&apos;s Quests
              </p>
              <Link
                to={ROUTES.quests}
                className="text-xs text-accent hover:underline"
              >
                View all
              </Link>
            </div>
            <ul className="mt-4 space-y-2">
              {todayQuests.length === 0 ? (
                <li className="text-sm text-foreground-secondary">
                  No daily quests.{' '}
                  <Link to={ROUTES.quests} className="text-accent hover:underline">
                    Add one
                  </Link>
                </li>
              ) : (
                todayQuests.map((quest, i) => (
                  <motion.li
                    key={quest.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-surface/50 px-3 py-2.5"
                    initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{quest.title}</p>
                      <p className="text-xs text-accent font-mono">
                        +{quest.xpReward} XP
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleQuickComplete(quest.id)}
                      disabled={completingId === quest.id}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated text-foreground-secondary transition-colors hover:border-accent hover:bg-accent/20 hover:text-accent disabled:opacity-50"
                      aria-label={`Complete ${quest.title}`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </motion.li>
                ))
              )}
            </ul>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.2}>
          <motion.div variants={fadeUp}>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              Habits
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold">
              {habits.filter((h) => !h.archivedAt).length}
            </p>
            <p className="mt-1 text-xs text-foreground-secondary">
              tracked daily
            </p>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard elevated className="md:col-span-2" delay={0.25}>
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
              <Activity className="h-3.5 w-3.5" />
              Recent Activity
            </div>
            <ul className="mt-4 space-y-3">
              {events.slice(0, 4).map((event, i) => (
                <motion.li
                  key={event.id}
                  className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <span className="text-sm">{event.title}</span>
                  <span className="text-xs text-muted">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </motion.li>
              ))}
              {events.length === 0 && (
                <li className="text-sm text-foreground-secondary">
                  No activity yet.
                </li>
              )}
            </ul>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.3}>
          <motion.div variants={fadeUp}>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              Quest Types
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              {(['DAILY', 'SIDE', 'MAIN', 'EPIC'] as const).map((type) => (
                <div key={type} className="flex justify-between">
                  <dt className="text-foreground-secondary">
                    {QUEST_TYPE_META[type].icon} {QUEST_TYPE_META[type].label}
                  </dt>
                  <dd className="font-mono">
                    {quests.filter((q) => q.type === type).length}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  )
}
