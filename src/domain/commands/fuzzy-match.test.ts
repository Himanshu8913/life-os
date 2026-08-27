import { describe, expect, it } from 'vitest'
import { fuzzyMatch, fuzzyScore, findBestMatch } from '@/domain/commands/fuzzy-match'

describe('fuzzyScore', () => {
  it('returns higher score for prefix matches', () => {
    expect(fuzzyScore('bu', 'Build MVP')).toBeGreaterThan(fuzzyScore('mvp', 'Build MVP'))
  })

  it('returns 0 for no match', () => {
    expect(fuzzyScore('xyz', 'Build MVP')).toBe(0)
  })
})

describe('fuzzyMatch', () => {
  const items = ['Morning Run', 'Read 30 pages', 'Build MVP']

  it('returns ranked matches', () => {
    const results = fuzzyMatch('build', items, (s) => s)
    expect(results).toHaveLength(1)
    expect(results[0].item).toBe('Build MVP')
  })

  it('returns empty for blank query', () => {
    expect(fuzzyMatch('', items, (s) => s)).toEqual([])
  })
})

describe('findBestMatch', () => {
  it('finds closest quest title', () => {
    const quests = [{ title: 'Build MVP' }, { title: 'Morning workout' }]
    const match = findBestMatch('build mvp', quests, (q) => q.title)
    expect(match?.title).toBe('Build MVP')
  })
})
