import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/page-header'
import { AnimatedCard } from '@/components/ui/animated-card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useGoalStore } from '@/stores/goal-store'

export function GoalsPage() {
  const goals = useGoalStore((s) => s.goals)
  const activeGoal = goals.find((g) => g.status === 'ACTIVE')
  const { initial } = useMotionConfig()

  return (
    <div>
      <PageHeader
        title="Goals"
        description="Long-term outcomes with milestones."
      />
      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        {activeGoal && (
          <AnimatedCard elevated>
            <motion.div variants={fadeUp}>
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Active Goal
              </p>
              <h2 className="mt-2 text-xl font-semibold">{activeGoal.title}</h2>
              <div className="mt-4">
                <ProgressBar value={activeGoal.progress} label="Progress" />
              </div>
            </motion.div>
          </AnimatedCard>
        )}
        <AnimatedCard className="border-dashed">
          <motion.div variants={fadeUp}>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              Phase 4 · Coming next
            </p>
            <p className="mt-2 text-sm text-foreground-secondary">
              Full goal management UI arrives in the next step.
            </p>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  )
}
