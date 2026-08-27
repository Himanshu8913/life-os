import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/page-header'
import { AnimatedCard } from '@/components/ui/animated-card'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useQuestStore } from '@/stores/quest-store'

export function QuestsPage() {
  const quests = useQuestStore((s) => s.quests)
  const { initial } = useMotionConfig()

  return (
    <div>
      <PageHeader
        title="Quests"
        description="Missions and tasks that drive your progress."
      />
      <motion.div variants={staggerContainer} initial={initial} animate="visible">
        <AnimatedCard className="border-dashed">
          <motion.div variants={fadeUp}>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              Phase 3 · Coming next
            </p>
            <h2 className="mt-2 text-lg font-medium">Quest System UI</h2>
            <p className="mt-2 text-sm text-foreground-secondary">
              {quests.length} quests loaded from your local database. Full create,
              complete, and XP flows arrive in the next step.
            </p>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  )
}
