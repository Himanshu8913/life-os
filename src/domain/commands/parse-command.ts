import type { ParsedCommand } from '@/domain/commands/types'

const NAV_ALIASES: Record<string, string> = {
  dashboard: 'dashboard',
  home: 'dashboard',
  quests: 'quests',
  quest: 'quests',
  goals: 'goals',
  goal: 'goals',
  habits: 'habits',
  habit: 'habits',
  timeline: 'timeline',
  activity: 'timeline',
  settings: 'settings',
  observatory: 'observatory',
  'life map': 'life-map',
  lifemap: 'life-map',
  achievements: 'achievements',
}

function parseMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d+)\s*m(?:in(?:ute)?s?)?$/i)
  if (!match) return null
  const minutes = Number.parseInt(match[1], 10)
  return Number.isFinite(minutes) && minutes > 0 ? minutes : null
}

function extractQuotedTitle(input: string): string | null {
  const quoted = input.match(/^["'](.+)["']$/)
  if (quoted) return quoted[1].trim()
  return input.trim() || null
}

/**
 * Deterministic command parser (PLAN §26). No AI — pattern matching only.
 */
export function parseCommand(raw: string): ParsedCommand | null {
  const input = raw.trim()
  if (!input) return null
  const lower = input.toLowerCase()

  const completeMatch = input.match(/^complete\s+(.+)$/i)
  if (completeMatch) {
    const title = extractQuotedTitle(completeMatch[1])
    if (title) return { kind: 'complete-quest', title }
  }

  const moodMatch = input.match(/^mood\s+(.+)$/i)
  if (moodMatch) {
    return { kind: 'mood', label: moodMatch[1].trim() }
  }

  const focusMatch =
    input.match(/^focus(?:\s+session)?(?:\s+(\d+)\s*m(?:in(?:ute)?s?)?)?(?:\s+(.+))?$/i) ??
    input.match(/^start\s+focus(?:\s+session)?(?:\s+(\d+)\s*m(?:in(?:ute)?s?)?)?(?:\s+(.+))?$/i)
  if (focusMatch) {
    const minutes = focusMatch[1] ? Number.parseInt(focusMatch[1], 10) : 25
    const title = focusMatch[2]?.trim()
    if (Number.isFinite(minutes) && minutes > 0) {
      return { kind: 'focus', minutes, title: title || undefined }
    }
  }

  const activityMatch = input.match(/^(workout|read(?:ing)?)\s+(\d+)\s*m(?:in(?:ute)?s?)?$/i)
  if (activityMatch) {
    const minutes = Number.parseInt(activityMatch[2], 10)
    const verb = activityMatch[1].toLowerCase()
    const activity = verb.startsWith('read') ? 'reading' : 'workout'
    if (Number.isFinite(minutes) && minutes > 0) {
      return { kind: 'activity', activity, minutes }
    }
  }

  const createMatch = lower.match(/^(?:add|new|create)\s+(?:a\s+)?(quest|goal|habit)s?$/)
  if (createMatch) {
    const entity = createMatch[1]
    if (entity === 'quest') return { kind: 'action', action: 'add-quest' }
    if (entity === 'goal') return { kind: 'action', action: 'add-goal' }
    return { kind: 'action', action: 'add-habit' }
  }

  const logHabitMatch =
    input.match(/^log\s+habit\s+(.+)$/i) ?? input.match(/^habit\s+log\s+(.+)$/i)
  if (logHabitMatch) {
    return { kind: 'log-habit', name: logHabitMatch[1].trim() }
  }

  if (lower === 'export' || lower === 'export data') {
    return { kind: 'action', action: 'export' }
  }

  const navMatch = input.match(/^(?:open|go\s+to)\s+(.+)$/i)
  if (navMatch) {
    return { kind: 'navigate', destination: navMatch[1].trim().toLowerCase() }
  }

  const directNav = NAV_ALIASES[lower]
  if (directNav) {
    return { kind: 'navigate', destination: directNav }
  }

  const durationOnly = parseMinutes(input)
  if (durationOnly) {
    return { kind: 'focus', minutes: durationOnly }
  }

  return null
}

export function resolveNavigationDestination(destination: string): string | null {
  const key = destination.trim().toLowerCase()
  return NAV_ALIASES[key] ?? null
}

export function parseMoodValue(label: string): number | null {
  const trimmed = label.trim().toLowerCase()
  const numeric = Number.parseInt(trimmed, 10)
  if (Number.isFinite(numeric) && numeric >= 1 && numeric <= 5) {
    return numeric
  }

  const moodMap: Record<string, number> = {
    awful: 1,
    terrible: 1,
    sad: 1,
    depressed: 1,
    bad: 2,
    low: 2,
    unhappy: 2,
    meh: 3,
    okay: 3,
    ok: 3,
    neutral: 3,
    fine: 4,
    good: 4,
    happy: 4,
    great: 5,
    amazing: 5,
    excellent: 5,
    ecstatic: 5,
  }

  return moodMap[trimmed] ?? null
}
