import { describe, expect, it } from 'vitest'
import { DB_NAME, ROUTES } from '@/lib/constants'

describe('constants', () => {
  it('defines the database name', () => {
    expect(DB_NAME).toBe('life-os')
  })

  it('defines all primary routes', () => {
    expect(ROUTES.dashboard).toBe('/')
    expect(ROUTES.quests).toBe('/quests')
    expect(ROUTES.goals).toBe('/goals')
    expect(ROUTES.habits).toBe('/habits')
    expect(ROUTES.timeline).toBe('/timeline')
    expect(ROUTES.settings).toBe('/settings')
  })
})
