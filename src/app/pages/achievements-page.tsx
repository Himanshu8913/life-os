import { motion } from 'framer-motion'
import { Lock, Trophy } from 'lucide-react'
import { ACHIEVEMENT_DEFINITIONS } from '@/domain/achievements/definitions'
import { PageHeader } from '@/components/layout/page-header'
import { AnimatedCard } from '@/components/ui/animated-card'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useAchievementStore } from '@/stores/achievement-store'

export function AchievementsPage() {
  const achievements = useAchievementStore((s) => s.achievements)
  const { initial, reducedMotion } = useMotionConfig()

  const unlockedByDefId = new Map(
    achievements.map((a) => [a.definitionId, a]),
  )
  const unlockedCount = achievements.length
  const totalCount = ACHIEVEMENT_DEFINITIONS.length

  return (
    <div>
      <PageHeader
        title="Achievements"
        description="Long-term milestones that mark your journey."
      />

      <motion.div
        className="mb-6 rounded-xl border border-border bg-surface/60 px-5 py-4"
        initial={initial}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          Progress
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold">
          {unlockedCount}
          <span className="text-foreground-secondary"> / {totalCount}</span>
        </p>
      </motion.div>

      <motion.div
        className="grid gap-3 sm:grid-cols-2"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        {ACHIEVEMENT_DEFINITIONS.map((definition, index) => {
          const unlocked = unlockedByDefId.get(definition.id)
          const isHidden = definition.hidden && !unlocked

          return (
            <AnimatedCard key={definition.id} delay={index * 0.03}>
              <motion.div
                variants={fadeUp}
                className={`flex gap-4 ${!unlocked ? 'opacity-80' : ''}`}
              >
                <motion.div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                    unlocked
                      ? 'border-amber-500/40 bg-amber-500/15'
                      : 'border-border bg-surface'
                  }`}
                  animate={
                    unlocked && !reducedMotion
                      ? { scale: [1, 1.04, 1] }
                      : undefined
                  }
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {unlocked ? (
                    <Trophy className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted" />
                  )}
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {isHidden ? '???' : definition.title}
                  </p>
                  <p className="mt-1 text-sm text-foreground-secondary">
                    {isHidden
                      ? 'Hidden achievement'
                      : definition.description}
                  </p>
                  {unlocked && (
                    <p className="mt-2 text-xs text-muted">
                      Unlocked{' '}
                      {new Date(unlocked.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatedCard>
          )
        })}
      </motion.div>
    </div>
  )
}
