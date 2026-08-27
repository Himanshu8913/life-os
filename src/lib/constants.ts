export const DB_NAME = 'life-os'
export const DB_VERSION = 1

export const ROUTES = {
  dashboard: '/',
  quests: '/quests',
  goals: '/goals',
  habits: '/habits',
  timeline: '/timeline',
  settings: '/settings',
} as const

export type RouteKey = keyof typeof ROUTES
