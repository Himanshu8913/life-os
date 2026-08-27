import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Swords,
  Target,
  Repeat,
  Clock,
  Settings,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'

const navItems = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.quests, label: 'Quests', icon: Swords },
  { to: ROUTES.goals, label: 'Goals', icon: Target },
  { to: ROUTES.habits, label: 'Habits', icon: Repeat },
  { to: ROUTES.timeline, label: 'Timeline', icon: Clock },
  { to: ROUTES.settings, label: 'Settings', icon: Settings },
] as const

export function AppShell() {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-10 flex w-56 flex-col border-r border-border bg-surface">
        <div className="border-b border-border px-5 py-6">
          <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
            Life OS
          </p>
          <p className="mt-1 text-sm text-foreground-secondary">
            Personal Command Center
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.dashboard}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-surface-elevated text-foreground'
                    : 'text-foreground-secondary hover:bg-surface-elevated/50 hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="ml-56 flex-1">
        <div className="mx-auto max-w-5xl px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
