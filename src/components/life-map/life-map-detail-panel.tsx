import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LifeAreaNode } from '@/domain/life-map/build-life-map'
import { ProgressBar } from '@/components/ui/progress-bar'
import { ROUTES } from '@/lib/constants'
import { useMotionConfig } from '@/hooks/use-motion'

interface LifeMapDetailPanelProps {
  area: LifeAreaNode | null
  onClose: () => void
}

export function LifeMapDetailPanel({ area, onClose }: LifeMapDetailPanelProps) {
  const { reducedMotion } = useMotionConfig()

  return (
    <AnimatePresence>
      {area && (
        <motion.aside
          key={area.category}
          layout
          className="glass-panel-elevated p-5"
          initial={reducedMotion ? false : { opacity: 0, x: 20, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0, x: 12, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl" aria-hidden>
                {area.icon}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{area.label}</h2>
              <p className="text-sm text-muted">
                {area.stats.progressScore}% overall progress
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-muted hover:bg-surface hover:text-foreground"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4">
            <ProgressBar value={area.stats.progressScore} />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border/60 bg-surface/50 p-3">
              <dt className="text-xs text-muted">Active goals</dt>
              <dd className="font-mono text-lg font-semibold">
                {area.stats.activeGoals}
              </dd>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface/50 p-3">
              <dt className="text-xs text-muted">Active quests</dt>
              <dd className="font-mono text-lg font-semibold">
                {area.stats.activeQuests}
              </dd>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface/50 p-3">
              <dt className="text-xs text-muted">Habit momentum</dt>
              <dd className="font-mono text-lg font-semibold">
                {area.stats.habitMomentum}%
              </dd>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface/50 p-3">
              <dt className="text-xs text-muted">Recent activity</dt>
              <dd className="font-mono text-lg font-semibold">
                {area.stats.recentActivityCount}
              </dd>
            </div>
          </dl>

          {area.goals.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Goals
              </p>
              <ul className="mt-2 space-y-1">
                {area.goals.map((goal) => (
                  <li key={goal.id} className="truncate text-sm">
                    {goal.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {area.quests.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Quests
              </p>
              <ul className="mt-2 space-y-1">
                {area.quests.map((quest) => (
                  <li key={quest.id} className="truncate text-sm">
                    {quest.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {area.recentEvents.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Recent activity
              </p>
              <ul className="mt-2 space-y-1">
                {area.recentEvents.map((event) => (
                  <li key={event.id} className="truncate text-sm text-foreground-secondary">
                    {event.title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 flex gap-2">
            <Link
              to={ROUTES.goals}
              className="text-xs text-accent hover:underline"
            >
              View goals
            </Link>
            <Link
              to={ROUTES.quests}
              className="text-xs text-accent hover:underline"
            >
              View quests
            </Link>
            <Link
              to={ROUTES.timeline}
              className="text-xs text-accent hover:underline"
            >
              Timeline
            </Link>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
