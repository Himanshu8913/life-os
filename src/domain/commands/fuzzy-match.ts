/**
 * Scores how well `query` matches `target` (higher is better, 0 = no match).
 */
export function fuzzyScore(query: string, target: string): number {
  const q = query.trim().toLowerCase()
  const t = target.trim().toLowerCase()
  if (!q) return 1
  if (!t) return 0

  if (t === q) return 200
  if (t.startsWith(q)) return 150 - (t.length - q.length) * 0.1
  const idx = t.indexOf(q)
  if (idx >= 0) return 120 - idx * 0.5

  let qi = 0
  let score = 40
  let lastMatch = -1
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      if (lastMatch === i - 1) score += 2
      lastMatch = i
      qi++
    }
  }
  if (qi === q.length) return score - (t.length - q.length) * 0.2
  return 0
}

export interface FuzzyMatch<T> {
  item: T
  score: number
}

/**
 * Returns items sorted by fuzzy match score (best first), filtered to score > 0.
 */
export function fuzzyMatch<T>(
  query: string,
  items: T[],
  getLabel: (item: T) => string,
  limit = 8,
): FuzzyMatch<T>[] {
  if (!query.trim()) return []

  return items
    .map((item) => ({
      item,
      score: fuzzyScore(query, getLabel(item)),
    }))
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * Picks the single best fuzzy match, or null if none score above the threshold.
 */
export function findBestMatch<T>(
  query: string,
  items: T[],
  getLabel: (item: T) => string,
  minScore = 30,
): T | null {
  const [best] = fuzzyMatch(query, items, getLabel, 1)
  if (!best || best.score < minScore) return null
  return best.item
}
