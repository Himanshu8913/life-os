import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/page-header'
import { LifeMapCanvas } from '@/components/life-map/life-map-canvas'
import { LifeMapDetailPanel } from '@/components/life-map/life-map-detail-panel'
import { LifeMapMobileList } from '@/components/life-map/life-map-mobile-list'
import { buildLifeMap } from '@/domain/life-map/build-life-map'
import { calculateLevel } from '@/domain/progression/calculate-level'
import { staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useGoalStore } from '@/stores/goal-store'
import { useHabitStore } from '@/stores/habit-store'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimelineStore } from '@/stores/timeline-store'
import type { GoalCategory } from '@/types'

export function LifeMapPage() {
  const profile = useProfileStore((s) => s.profile)
  const goals = useGoalStore((s) => s.goals)
  const quests = useQuestStore((s) => s.quests)
  const habits = useHabitStore((s) => s.habits)
  const habitCompletions = useHabitStore((s) => s.completions)
  const events = useTimelineStore((s) => s.events)
  const { initial } = useMotionConfig()

  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | null>(
    null,
  )

  const mapData = useMemo(
    () =>
      buildLifeMap({
        goals,
        quests,
        habits,
        habitCompletions,
        events,
        displayName: profile?.displayName ?? 'You',
        level: calculateLevel(profile?.totalXp ?? 0),
      }),
    [goals, quests, habits, habitCompletions, events, profile],
  )

  const selectedArea =
    mapData.areas.find((a) => a.category === selectedCategory) ?? null

  return (
    <div>
      <PageHeader
        title="Life Map"
        description="Your life areas at a glance — derived from goals, quests, and habits."
      />

      <motion.div
        className="mb-4 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 px-4 py-3 text-sm text-foreground-secondary"
        initial={initial}
        animate={{ opacity: 1 }}
      >
        <span className="text-gradient-accent font-mono font-semibold">
          {mapData.center.totalProgress}%
        </span>{' '}
        average progress across {mapData.center.activeAreas} active areas
      </motion.div>

      <motion.div
        className="grid gap-6 lg:grid-cols-[1fr_300px]"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <div className="space-y-4">
          <div className="hidden md:block">
            <LifeMapCanvas
              center={mapData.center}
              areas={mapData.areas}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          <LifeMapMobileList
            areas={mapData.areas}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <LifeMapDetailPanel
            area={selectedArea}
            onClose={() => setSelectedCategory(null)}
          />
          {!selectedArea && (
            <p className="hidden text-sm text-muted lg:block">
              Select a life area to see goals, quests, and recent activity.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
