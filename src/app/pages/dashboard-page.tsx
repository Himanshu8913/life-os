import { motion } from 'framer-motion'
import { Activity, Database, Sparkles, Swords, Target } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { AnimatedCard } from '@/components/ui/animated-card'
import { ProgressBar } from '@/components/ui/progress-bar'
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
  const goals = useGoalStore((s) => s.goals)
  const habits = useHabitStore((s) => s.habits)
  const events = useTimelineStore((s) => s.events)
  const { initial } = useMotionConfig()

  const totalXp = profile?.totalXp ?? 0
  const xp = calculateXpProgress(totalXp)
  const level = calculateLevel(totalXp)
  const activeQuests = quests.filter((q) =>
    ['TODO', 'IN_PROGRESS'].includes(q.status),
  )
  const activeGoals = goals.filter((g) => g.status === 'ACTIVE')
  const now = new Date()

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
          <motion.div variants={fadeUp} className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Active Goals
              </p>
              <p className="mt-2 font-mono text-3xl font-semibold">
                {activeGoals.length}
              </p>
            </div>
            <Target className="h-5 w-5 text-accent/70" />
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.15}>
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

        <AnimatedCard elevated className="md:col-span-2" delay={0.2}>
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
                  transition={{ delay: 0.25 + i * 0.06 }}
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

        <AnimatedCard delay={0.25}>
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted uppercase">
              <Database className="h-3.5 w-3.5 text-success" />
              System
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground-secondary">Database</dt>
                <dd className="text-success">Synced</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-secondary">Quests</dt>
                <dd className="font-mono">{quests.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-secondary">Timeline</dt>
                <dd className="font-mono">{events.length}</dd>
              </div>
            </dl>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  )
}
