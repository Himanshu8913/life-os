import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Swords,
  Target,
  Repeat,
  Clock,
  Settings,
  Command,
  Trophy,
  Map,
  Telescope,
  BookOpen,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { AnimatedPage } from '@/components/layout/animated-page'
import { AchievementUnlockToast } from '@/components/gamification/achievement-unlock-toast'
import { LevelUpOverlay } from '@/components/gamification/level-up-overlay'
import { CommandFeedbackToast } from '@/components/command-palette/command-feedback-toast'
import { CommandPalette } from '@/components/command-palette/command-palette'
import { FocusCompletionToast } from '@/components/command-palette/focus-completion-toast'
import { FocusOverlay } from '@/components/command-palette/focus-overlay'
import { DailyMissionToast } from '@/components/dashboard/daily-mission-toast'
import { GoalFormModal } from '@/components/goals/goal-form-modal'
import { HabitFormModal } from '@/components/habits/habit-form-modal'
import { QuestCompletionToast } from '@/components/quests/quest-completion-toast'
import { GoalCompletionToast } from '@/components/goals/goal-completion-toast'
import { HabitCompletionToast } from '@/components/habits/habit-completion-toast'
import { QuestFormModal } from '@/components/quests/quest-form-modal'
import { useMotionConfig } from '@/hooks/use-motion'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'
import { useCommandPaletteStore } from '@/stores/command-palette-store'
import { useSettingsStore } from '@/stores/settings-store'

const navItems = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard, color: 'text-violet-400' },
  { to: ROUTES.quests, label: 'Quests', icon: Swords, color: 'text-orange-400' },
  { to: ROUTES.goals, label: 'Goals', icon: Target, color: 'text-emerald-400' },
  { to: ROUTES.habits, label: 'Habits', icon: Repeat, color: 'text-cyan-400' },
  { to: ROUTES.achievements, label: 'Achievements', icon: Trophy, color: 'text-amber-400' },
  { to: ROUTES.lifeMap, label: 'Life Map', icon: Map, color: 'text-rose-400' },
  { to: ROUTES.observatory, label: 'Observatory', icon: Telescope, color: 'text-sky-400' },
  { to: ROUTES.reflection, label: 'Reflection', icon: BookOpen, color: 'text-fuchsia-400' },
  { to: ROUTES.timeline, label: 'Timeline', icon: Clock, color: 'text-indigo-400' },
  { to: ROUTES.settings, label: 'Settings', icon: Settings, color: 'text-slate-400' },
] as const

function NavItem({
  to,
  label,
  icon: Icon,
  color,
  end,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  color: string
  end?: boolean
}) {
  const { reducedMotion } = useMotionConfig()

  return (
    <NavLink to={to} end={end} className="block">
      {({ isActive }) => (
        <motion.div
          className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
            isActive
              ? 'text-foreground'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
          whileHover={reducedMotion ? undefined : { x: 4, scale: 1.01 }}
          whileTap={reducedMotion ? undefined : { scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          {isActive && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 rounded-lg bg-surface-elevated shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
          )}
          {isActive && (
            <motion.div
              layoutId="nav-glow"
              className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]"
            />
          )}
          <Icon className={`relative z-10 h-4 w-4 ${isActive ? color : `${color} opacity-70`}`} aria-hidden />
          <span className="relative z-10 font-medium">{label}</span>
        </motion.div>
      )}
    </NavLink>
  )
}

export function AppShell() {
  const location = useLocation()
  const openPalette = useCommandPaletteStore((s) => s.open)
  const activeModal = useCommandPaletteStore((s) => s.activeModal)
  const closeModal = useCommandPaletteStore((s) => s.closeModal)
  const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted)

  return (
    <div className="mesh-bg flex min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-10 flex w-60 flex-col border-r border-border/60 bg-surface/50 backdrop-blur-2xl">
        <div className="border-b border-border/60 px-6 py-7">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="h-2 w-2 rounded-full bg-gradient-vivid glow-accent" aria-hidden />
            <p className="text-gradient-accent text-xs font-semibold tracking-[0.28em] uppercase">
              Life OS
            </p>
          </motion.div>
          <motion.p
            className="mt-1.5 text-sm text-foreground-secondary"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            Personal Command Center
          </motion.p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Main">
          {navItems.map(({ to, label, icon, color }, index) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index + 0.2 }}
            >
              <NavItem
                to={to}
                label={label}
                icon={icon}
                color={color}
                end={to === ROUTES.dashboard}
              />
            </motion.div>
          ))}
        </nav>
        <div className="border-t border-border/60 p-3">
          <motion.button
            type="button"
            onClick={openPalette}
            whileHover={{ scale: 1.01, borderColor: 'color-mix(in srgb, var(--color-accent) 40%, transparent)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/60 bg-surface/40 px-3 py-2.5 text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <Command className="h-4 w-4" aria-hidden />
              Commands
            </span>
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted">
              ⌘K
            </kbd>
          </motion.button>
        </div>
      </aside>

      <main id="main-content" className="ml-60 flex-1" tabIndex={-1}>
        <div className="mx-auto max-w-5xl px-8 py-10">
          <AnimatePresence mode="wait">
            <AnimatedPage key={location.pathname}>
              <Outlet />
            </AnimatedPage>
          </AnimatePresence>
        </div>
      </main>
      <CommandPalette />
      <FocusOverlay />
      <QuestFormModal
        open={activeModal === 'quest'}
        onClose={closeModal}
      />
      <GoalFormModal
        open={activeModal === 'goal'}
        onClose={closeModal}
      />
      <HabitFormModal
        open={activeModal === 'habit'}
        onClose={closeModal}
      />
      <QuestCompletionToast />
      <GoalCompletionToast />
      <HabitCompletionToast />
      <FocusCompletionToast />
      <CommandFeedbackToast />
      <LevelUpOverlay />
      <AchievementUnlockToast />
      <DailyMissionToast />
      {!onboardingCompleted && <OnboardingFlow />}
    </div>
  )
}
