import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings, User } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { LifeAttributesPanel } from '@/components/dashboard/life-attributes-panel'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { GOAL_CATEGORY_META } from '@/domain/goals/category-meta'
import {
  calculateLevel,
  calculateXpProgress,
} from '@/domain/progression/calculate-level'
import { ROUTES } from '@/lib/constants'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useSettingsStore } from '@/stores/settings-store'
import type { LifeAttributeKey } from '@/types/enums'

const DEFAULT_ATTRIBUTES: Record<LifeAttributeKey, number> = {
  discipline: 50,
  creativity: 50,
  fitness: 50,
  learning: 50,
  social: 50,
  finance: 50,
}

export function ProfilePage() {
  const profile = useProfileStore((s) => s.profile)
  const focusSessions = useProfileStore((s) => s.focusSessions)
  const updateProfile = useProfileStore((s) => s.updateProfile)
  const quests = useQuestStore((s) => s.quests)
  const focusAreas = useSettingsStore((s) => s.focusAreas)
  const weekStartDay = useSettingsStore((s) => s.weekStartDay)
  const setWeekStartDay = useSettingsStore((s) => s.setWeekStartDay)
  const { initial } = useMotionConfig()

  const [name, setName] = useState(profile?.displayName ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const totalXp = profile?.totalXp ?? 0
  const level = calculateLevel(totalXp)
  const xp = calculateXpProgress(totalXp)
  const attributes = profile?.attributes ?? DEFAULT_ATTRIBUTES
  const completedQuests = quests.filter((q) => q.status === 'COMPLETED').length
  const focusMinutes = focusSessions.reduce(
    (sum, s) => sum + s.durationMinutes,
    0,
  )

  async function handleSaveName() {
    const trimmed = name.trim()
    if (!trimmed || trimmed === profile?.displayName) return
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile({ displayName: trimmed })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your identity, stats, and preferences."
      >
        <Link to={ROUTES.settings}>
          <Button variant="secondary" size="sm">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </PageHeader>

      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <AnimatedCard elevated delay={0}>
          <motion.div variants={fadeUp} className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent"
              aria-hidden
            >
              <User className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="display-name" className="text-sm font-medium">
                Display name
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  id="display-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setSaved(false)
                  }}
                  className="min-w-[12rem] flex-1 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <Button
                  size="sm"
                  onClick={() => void handleSaveName()}
                  disabled={saving || !name.trim()}
                >
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
              {saved && (
                <p className="mt-2 text-xs text-success">Name updated.</p>
              )}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 border-t border-border pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-widest text-muted uppercase">
                  Level {level}
                </p>
                <p className="mt-1 font-mono text-2xl text-accent">
                  {totalXp.toLocaleString()} XP
                </p>
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar value={xp.progressPercent} />
              <p className="mt-1 text-xs text-foreground-secondary">
                {xp.currentXp} / {xp.xpForNextLevel - xp.xpForCurrentLevel} XP to
                level {level + 1}
              </p>
            </div>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.05}>
          <motion.div variants={fadeUp}>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              Stats
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-foreground-secondary">Quests done</dt>
                <dd className="mt-1 font-mono text-lg">{completedQuests}</dd>
              </div>
              <div>
                <dt className="text-xs text-foreground-secondary">Focus sessions</dt>
                <dd className="mt-1 font-mono text-lg">{focusSessions.length}</dd>
              </div>
              <div>
                <dt className="text-xs text-foreground-secondary">Focus minutes</dt>
                <dd className="mt-1 font-mono text-lg">{focusMinutes}</dd>
              </div>
            </dl>
          </motion.div>
        </AnimatedCard>

        {focusAreas.length > 0 && (
          <AnimatedCard delay={0.1}>
            <motion.div variants={fadeUp}>
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Focus areas
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {focusAreas.map((category) => (
                  <li
                    key={category}
                    className="rounded-full border border-border px-3 py-1 text-sm"
                  >
                    <span aria-hidden>{GOAL_CATEGORY_META[category].icon}</span>{' '}
                    {GOAL_CATEGORY_META[category].label}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatedCard>
        )}

        <AnimatedCard delay={0.15}>
          <motion.div variants={fadeUp}>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">
              Preferences
            </p>
            <label className="mt-4 flex items-center justify-between gap-4 text-sm">
              <span>Week starts on</span>
              <select
                value={weekStartDay}
                onChange={(e) =>
                  setWeekStartDay(Number(e.target.value) as 0 | 1)
                }
                className="rounded-lg border border-border bg-surface-elevated px-2 py-1.5 text-sm"
              >
                <option value={1}>Monday</option>
                <option value={0}>Sunday</option>
              </select>
            </label>
          </motion.div>
        </AnimatedCard>

        <LifeAttributesPanel attributes={attributes} />
      </motion.div>
    </div>
  )
}
