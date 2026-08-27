import { describe, expect, it } from 'vitest'
import { validateBackup } from '@/lib/validation/backup-schema'
import { BACKUP_VERSION } from '@/types/enums'

const validBackup = {
  version: BACKUP_VERSION,
  exportedAt: '2026-08-26T00:00:00.000Z',
  profile: {
    id: 'default' as const,
    displayName: 'Test',
    totalXp: 0,
    attributes: {
      discipline: 50,
      creativity: 50,
      fitness: 50,
      learning: 50,
      social: 50,
      finance: 50,
    },
    createdAt: '2026-08-26T00:00:00.000Z',
    updatedAt: '2026-08-26T00:00:00.000Z',
  },
  quests: [],
  goals: [],
  habits: [],
  habitCompletions: [],
  timeline: [],
  achievements: [],
  reflections: [],
  focusSessions: [],
  moodEntries: [],
  settings: {
    id: 'default' as const,
    accentColor: '#6366f1',
    reducedMotion: false,
    seedDataLoaded: false,
  },
}

describe('validateBackup', () => {
  it('accepts a valid backup', () => {
    const result = validateBackup(validBackup)
    expect(result.success).toBe(true)
  })

  it('rejects wrong schema version', () => {
    const result = validateBackup({ ...validBackup, version: 99 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('version')
    }
  })

  it('rejects invalid profile XP', () => {
    const result = validateBackup({
      ...validBackup,
      profile: { ...validBackup.profile, totalXp: -1 },
    })
    expect(result.success).toBe(false)
  })

  it('rejects malformed accent color', () => {
    const result = validateBackup({
      ...validBackup,
      settings: { ...validBackup.settings, accentColor: 'red' },
    })
    expect(result.success).toBe(false)
  })
})
