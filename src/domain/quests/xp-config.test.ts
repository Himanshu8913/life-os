import { describe, expect, it } from 'vitest'
import { getDefaultXpForType, DEFAULT_XP_BY_TYPE } from '@/domain/quests/xp-config'

describe('xp-config', () => {
  it('defines defaults per PLAN', () => {
    expect(DEFAULT_XP_BY_TYPE.DAILY).toBe(25)
    expect(DEFAULT_XP_BY_TYPE.SIDE).toBe(50)
    expect(DEFAULT_XP_BY_TYPE.MAIN).toBe(200)
    expect(DEFAULT_XP_BY_TYPE.EPIC).toBe(500)
  })

  it('getDefaultXpForType returns configured value', () => {
    expect(getDefaultXpForType('MAIN')).toBe(200)
  })
})
