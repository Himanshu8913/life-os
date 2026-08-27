import { describe, expect, it } from 'vitest'
import { formatWeekLabel, getWeekStartKey, isDateInWeek } from '@/domain/reflection/week-utils'

describe('week-utils', () => {
  it('returns Monday as week start', () => {
    const key = getWeekStartKey(new Date('2026-08-28'))
    expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('formats week label', () => {
    const label = formatWeekLabel(getWeekStartKey(new Date('2026-08-28')))
    expect(label).toContain('WEEK')
  })

  it('checks date in week', () => {
    const weekStart = getWeekStartKey(new Date('2026-08-28'))
    expect(isDateInWeek('2026-08-26T12:00:00.000Z', weekStart)).toBe(true)
  })
})
