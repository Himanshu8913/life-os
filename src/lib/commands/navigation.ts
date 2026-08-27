import { ROUTES } from '@/lib/constants'

export const COMMAND_DESTINATIONS: Record<
  string,
  { path: string | null; label: string }
> = {
  dashboard: { path: ROUTES.dashboard, label: 'Dashboard' },
  quests: { path: ROUTES.quests, label: 'Quests' },
  goals: { path: ROUTES.goals, label: 'Goals' },
  habits: { path: ROUTES.habits, label: 'Habits' },
  timeline: { path: ROUTES.timeline, label: 'Timeline' },
  settings: { path: ROUTES.settings, label: 'Settings' },
  observatory: { path: null, label: 'Observatory' },
  'life-map': { path: ROUTES.lifeMap, label: 'Life Map' },
  achievements: { path: ROUTES.achievements, label: 'Achievements' },
}
