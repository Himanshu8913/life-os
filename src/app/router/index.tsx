import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { ROUTES } from '@/lib/constants'
import { DashboardPage } from '@/app/pages/dashboard-page'
import { QuestsPage } from '@/app/pages/quests-page'
import { GoalsPage } from '@/app/pages/goals-page'
import { HabitsPage } from '@/app/pages/habits-page'
import { AchievementsPage } from '@/app/pages/achievements-page'
import { TimelinePage } from '@/app/pages/timeline-page'
import { LifeMapPage } from '@/app/pages/life-map-page'
import { ObservatoryPage } from '@/app/pages/observatory-page'
import { ReflectionPage } from '@/app/pages/reflection-page'
import { ProfilePage } from '@/app/pages/profile-page'
import { FocusPage } from '@/app/pages/focus-page'
import { SettingsPage } from '@/app/pages/settings-page'
import { RouteErrorFallback } from '@/components/layout/error-boundary'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteErrorFallback />,
    children: [
      { path: ROUTES.dashboard, element: <DashboardPage /> },
      { path: ROUTES.quests, element: <QuestsPage /> },
      { path: ROUTES.goals, element: <GoalsPage /> },
      { path: ROUTES.habits, element: <HabitsPage /> },
      { path: ROUTES.timeline, element: <TimelinePage /> },
      { path: ROUTES.achievements, element: <AchievementsPage /> },
      { path: ROUTES.lifeMap, element: <LifeMapPage /> },
      { path: ROUTES.observatory, element: <ObservatoryPage /> },
      { path: ROUTES.reflection, element: <ReflectionPage /> },
      { path: ROUTES.profile, element: <ProfilePage /> },
      { path: ROUTES.focus, element: <FocusPage /> },
      { path: ROUTES.settings, element: <SettingsPage /> },
    ],
  },
])
