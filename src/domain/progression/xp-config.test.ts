import { describe, expect, it } from 'vitest'
import { getDefaultXpForType, getFocusXp, XP_REWARDS } from '@/domain/progression/xp-config'

describe('xp-config', () => {
  it('returns quest XP by type', () => {
    expect(getDefaultXpForType('DAILY')).toBe(XP_REWARDS.quest.DAILY)
    expect(getDefaultXpForType('MAIN')).toBe(XP_REWARDS.quest.MAIN)
  })

  it('returns higher XP for long focus sessions', () => {
    expect(getFocusXp(30)).toBe(XP_REWARDS.focusDefault)
    expect(getFocusXp(60)).toBe(XP_REWARDS.focusLong)
  })
})
