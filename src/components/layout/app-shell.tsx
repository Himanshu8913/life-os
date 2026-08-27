import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Swords,
  Target,
  Repeat,
  Clock,
  Settings,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { AnimatedPage } from '@/components/layout/animated-page'
import { QuestCompletionToast } from '@/components/quests/quest-completion-toast'
import { GoalCompletionToast } from '@/components/goals/goal-completion-toast'
import { HabitCompletionToast } from '@/components/habits/habit-completion-toast'
import { useMotionConfig } from '@/hooks/use-motion'

const navItems = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.quests, label: 'Quests', icon: Swords },
  { to: ROUTES.goals, label: 'Goals', icon: Target },
  { to: ROUTES.habits, label: 'Habits', icon: Repeat },
  { to: ROUTES.timeline, label: 'Timeline', icon: Clock },
  { to: ROUTES.settings, label: 'Settings', icon: Settings },
] as const

function NavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: typeof LayoutDashboard
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
          whileHover={reducedMotion ? undefined : { x: 4 }}
          transition={{ duration: 0.15 }}
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
          <Icon className="relative z-10 h-4 w-4" aria-hidden />
          <span className="relative z-10 font-medium">{label}</span>
        </motion.div>
      )}
    </NavLink>
  )
}

export function AppShell() {
  const location = useLocation()

  return (
    <div className="mesh-bg flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-10 flex w-60 flex-col border-r border-border/80 bg-surface/70 backdrop-blur-xl">
        <div className="border-b border-border/80 px-6 py-7">
          <motion.p
            className="text-xs font-semibold tracking-[0.28em] text-muted uppercase"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Life OS
          </motion.p>
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
          {navItems.map(({ to, label, icon }, index) => (
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
                end={to === ROUTES.dashboard}
              />
            </motion.div>
          ))}
        </nav>
      </aside>

      <main className="ml-60 flex-1">
        <div className="mx-auto max-w-5xl px-8 py-10">
          <AnimatePresence mode="wait">
            <AnimatedPage key={location.pathname}>
              <Outlet />
            </AnimatedPage>
          </AnimatePresence>
        </div>
      </main>
      <QuestCompletionToast />
      <GoalCompletionToast />
      <HabitCompletionToast />
    </div>
  )
}
