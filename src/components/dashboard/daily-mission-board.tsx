import { motion } from 'framer-motion'
import { Check, Sparkles, Target } from 'lucide-react'
import { useEffect } from 'react'
import type { DailyMissionBoardItem } from '@/domain/daily-missions/build-daily-mission-board'
import { AnimatedCard } from '@/components/ui/animated-card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useDailyMissionStore } from '@/stores/daily-mission-store'

function MissionRow({ mission }: { mission: DailyMissionBoardItem }) {
  const { reducedMotion } = useMotionConfig()
  const progress =
    mission.target > 0 ? (mission.current / mission.target) * 100 : 0

  return (
    <motion.li
      variants={fadeUp}
      className={`flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors ${
        mission.complete
          ? 'border-emerald-400/30 bg-emerald-400/10'
          : 'border-border/60 bg-surface/40'
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${
          mission.complete ? 'bg-emerald-400/20' : 'bg-surface-elevated/80'
        }`}
        aria-hidden
      >
        {mission.complete ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          mission.icon
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={`text-sm font-medium ${
                mission.complete ? 'text-emerald-200' : ''
              }`}
            >
              {mission.label}
            </p>
            <p className="text-xs text-muted">{mission.description}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] ${
              mission.rewarded
                ? 'bg-emerald-400/20 text-emerald-300'
                : 'bg-violet-400/15 text-violet-300'
            }`}
          >
            {mission.rewarded ? '✓ ' : '+'}
            {mission.xpReward} XP
          </span>
        </div>

        {!mission.complete && (
          <div className="mt-2">
            <ProgressBar
              value={progress}
              color={`linear-gradient(90deg, #a78bfa, #818cf8)`}
            />
            <p className="mt-1 text-[10px] text-muted">
              {mission.current} / {mission.target}
            </p>
          </div>
        )}
      </div>

      {!reducedMotion && mission.complete && !mission.rewarded && (
        <motion.span
          className="text-xs text-emerald-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Done!
        </motion.span>
      )}
    </motion.li>
  )
}

export function DailyMissionBoard() {
  const board = useDailyMissionStore((s) => s.board)
  const refresh = useDailyMissionStore((s) => s.refresh)
  const { initial } = useMotionConfig()

  useEffect(() => {
    void refresh()
  }, [refresh])

  if (!board) return null

  const missionProgress =
    board.totalCount > 0
      ? (board.completedCount / board.totalCount) * 100
      : 0

  return (
    <AnimatedCard elevated delay={0.02}>
      <motion.div variants={fadeUp}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest text-violet-300 uppercase">
              <Target className="h-3.5 w-3.5" />
              Today&apos;s Mission
            </p>
            <p className="mt-1 text-sm text-foreground-secondary">
              Complete missions for bonus XP — resets at midnight.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-semibold text-gradient-accent">
              {board.totalXpEarnedToday}
              <span className="text-sm text-muted">
                {' '}
                / {board.totalXpAvailable} XP
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar value={missionProgress} />
          <p className="mt-1 text-xs text-muted">
            {board.completedCount} of {board.totalCount} missions complete
          </p>
        </div>

        <motion.ul
          className="mt-4 space-y-2"
          variants={staggerContainer}
          initial={initial}
          animate="visible"
        >
          {board.missions.map((mission) => (
            <MissionRow key={mission.id} mission={mission} />
          ))}
        </motion.ul>

        <div
          className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 ${
            board.allComplete
              ? 'border-amber-400/40 bg-gradient-to-r from-amber-400/15 via-fuchsia-400/10 to-violet-400/15'
              : 'border-border/60 bg-surface/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles
              className={`h-4 w-4 ${
                board.allComplete ? 'text-amber-300' : 'text-muted'
              }`}
            />
            <div>
              <p className="text-sm font-medium">Daily bonus</p>
              <p className="text-xs text-muted">
                {board.allComplete
                  ? board.bonusRewarded
                    ? 'Bonus claimed!'
                    : 'All missions complete — bonus earned!'
                  : 'Complete every mission above'}
              </p>
            </div>
          </div>
          <span
            className={`font-mono text-sm font-semibold ${
              board.bonusRewarded ? 'text-emerald-400' : 'text-amber-300'
            }`}
          >
            {board.bonusRewarded ? '✓' : '+'}
            {board.bonusXp} XP
          </span>
        </div>
      </motion.div>
    </AnimatedCard>
  )
}
