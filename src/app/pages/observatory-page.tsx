import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Telescope } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { ObservatoryCharts } from '@/components/observatory/observatory-charts'
import { ObservatoryHighlights } from '@/components/observatory/observatory-highlights'
import { ObservatoryStats } from '@/components/observatory/observatory-stats'
import { calculateObservatoryMetrics } from '@/domain/analytics/calculate-observatory-metrics'
import { useMotionConfig } from '@/hooks/use-motion'
import { useGoalStore } from '@/stores/goal-store'
import { useHabitStore } from '@/stores/habit-store'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimelineStore } from '@/stores/timeline-store'

export function ObservatoryPage() {
  const profile = useProfileStore((s) => s.profile)
  const focusSessions = useProfileStore((s) => s.focusSessions)
  const goals = useGoalStore((s) => s.goals)
  const quests = useQuestStore((s) => s.quests)
  const habits = useHabitStore((s) => s.habits)
  const habitCompletions = useHabitStore((s) => s.completions)
  const events = useTimelineStore((s) => s.events)
  const { initial } = useMotionConfig()

  const metrics = useMemo(
    () =>
      calculateObservatoryMetrics({
        quests,
        goals,
        habits,
        habitCompletions,
        events,
        totalXp: profile?.totalXp ?? 0,
        focusSessions,
      }),
    [quests, goals, habits, habitCompletions, events, profile, focusSessions],
  )

  return (
    <div>
      <PageHeader
        title="Observatory"
        description="Long-term insights from your recorded activity — no external data, no judgments."
      />

      <motion.div
        className="mb-6 flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3"
        initial={initial}
        animate={{ opacity: 1 }}
      >
        <Telescope className="h-5 w-5 text-accent" aria-hidden />
        <p className="text-sm text-foreground-secondary">
          All metrics are computed locally from your quests, goals, habits, and timeline.
        </p>
      </motion.div>

      <div className="space-y-8">
        <ObservatoryHighlights metrics={metrics} />
        <ObservatoryStats metrics={metrics} />
        <ObservatoryCharts metrics={metrics} />
      </div>
    </div>
  )
}
