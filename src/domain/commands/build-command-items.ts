import type { LucideIcon } from 'lucide-react'
import {
  Download,
  LayoutDashboard,
  Repeat,
  Swords,
  Target,
  Clock,
  Settings,
  Sparkles,
  CheckCircle2,
  Smile,
  Timer,
  Dumbbell,
  BookOpen,
  Map,
  Telescope,
  Trophy,
} from 'lucide-react'
import { fuzzyMatch, fuzzyScore } from '@/domain/commands/fuzzy-match'
import { parseCommand, resolveNavigationDestination } from '@/domain/commands/parse-command'
import { COMMAND_DESTINATIONS } from '@/lib/commands/navigation'
import type { Goal, Habit, Quest } from '@/types'

export type CommandGroup =
  | 'Suggested'
  | 'Actions'
  | 'Navigate'
  | 'Quests'
  | 'Habits'
  | 'Goals'

export interface CommandItem {
  id: string
  label: string
  description?: string
  group: CommandGroup
  icon: LucideIcon
  keywords?: string[]
  score: number
}

interface BuildItemsInput {
  query: string
  quests: Quest[]
  goals: Goal[]
  habits: Habit[]
}

function staticActions(): Omit<CommandItem, 'score'>[] {
  return [
    {
      id: 'add-quest',
      label: 'Add quest',
      description: 'Create a new quest',
      group: 'Actions',
      icon: Swords,
      keywords: ['new', 'create', 'quest'],
    },
    {
      id: 'add-goal',
      label: 'Add goal',
      description: 'Create a new goal',
      group: 'Actions',
      icon: Target,
      keywords: ['new', 'create', 'goal'],
    },
    {
      id: 'add-habit',
      label: 'Add habit',
      description: 'Create a new habit',
      group: 'Actions',
      icon: Repeat,
      keywords: ['new', 'create', 'habit'],
    },
    {
      id: 'export',
      label: 'Export data',
      description: 'Download life-os-backup.json',
      group: 'Actions',
      icon: Download,
      keywords: ['backup', 'download'],
    },
    {
      id: 'focus-default',
      label: 'Start focus session',
      description: 'focus 25m',
      group: 'Actions',
      icon: Timer,
      keywords: ['focus', 'pomodoro', 'timer'],
    },
    {
      id: 'mood-prompt',
      label: 'Log mood',
      description: 'mood happy',
      group: 'Actions',
      icon: Smile,
      keywords: ['mood', 'feeling', 'check-in'],
    },
  ]
}

function staticNavigation(): Omit<CommandItem, 'score'>[] {
  return [
    { id: 'nav-dashboard', label: 'Open Dashboard', group: 'Navigate', icon: LayoutDashboard, keywords: ['home'] },
    { id: 'nav-quests', label: 'Open Quests', group: 'Navigate', icon: Swords, keywords: ['quest'] },
    { id: 'nav-goals', label: 'Open Goals', group: 'Navigate', icon: Target, keywords: ['goal'] },
    { id: 'nav-habits', label: 'Open Habits', group: 'Navigate', icon: Repeat, keywords: ['habit'] },
    { id: 'nav-timeline', label: 'Open Timeline', group: 'Navigate', icon: Clock, keywords: ['activity', 'history'] },
    { id: 'nav-settings', label: 'Open Settings', group: 'Navigate', icon: Settings, keywords: ['preferences'] },
    { id: 'nav-observatory', label: 'Open Observatory', group: 'Navigate', icon: Telescope, keywords: ['analytics', 'stats'] },
    { id: 'nav-life-map', label: 'Open Life Map', group: 'Navigate', icon: Map, keywords: ['map', 'visualization'] },
    { id: 'nav-achievements', label: 'Open Achievements', group: 'Navigate', icon: Trophy, keywords: ['badges'] },
  ]
}

function scoreItem(
  query: string,
  item: Omit<CommandItem, 'score'>,
): CommandItem {
  const haystack = [item.label, item.description, ...(item.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
  const score = fuzzyScore(query, haystack) || fuzzyScore(query, item.label)
  return { ...item, score: query.trim() ? score : 1 }
}

/**
 * Builds filtered command palette items from query + live app data.
 */
export function buildCommandItems({
  query,
  quests,
  goals,
  habits,
}: BuildItemsInput): CommandItem[] {
  const q = query.trim()
  const parsed = parseCommand(q)
  const items: CommandItem[] = []

  if (parsed) {
    switch (parsed.kind) {
      case 'complete-quest': {
        const matches = fuzzyMatch(parsed.title, quests, (quest) => quest.title, 5)
        for (const { item: quest, score } of matches) {
          if (!['TODO', 'IN_PROGRESS'].includes(quest.status)) continue
          items.push({
            id: `complete-${quest.id}`,
            label: `Complete "${quest.title}"`,
            description: `+${quest.xpReward} XP`,
            group: 'Suggested',
            icon: CheckCircle2,
            score: score + 100,
          })
        }
        break
      }
      case 'log-habit': {
        const active = habits.filter((h) => !h.archivedAt)
        const matches = fuzzyMatch(parsed.name, active, (h) => h.name, 5)
        for (const { item: habit, score } of matches) {
          items.push({
            id: `habit-${habit.id}`,
            label: `Log habit: ${habit.name}`,
            group: 'Suggested',
            icon: Repeat,
            score: score + 100,
          })
        }
        break
      }
      case 'mood':
        items.push({
          id: 'mood-run',
          label: `Log mood: ${parsed.label}`,
          group: 'Suggested',
          icon: Smile,
          score: 200,
        })
        break
      case 'focus':
        items.push({
          id: 'focus-run',
          label: `Start focus: ${parsed.minutes}m`,
          description: parsed.title,
          group: 'Suggested',
          icon: Timer,
          score: 200,
        })
        break
      case 'activity': {
        const icon = parsed.activity === 'workout' ? Dumbbell : BookOpen
        items.push({
          id: `activity-${parsed.activity}`,
          label: `Log ${parsed.activity}: ${parsed.minutes}m`,
          group: 'Suggested',
          icon,
          score: 200,
        })
        break
      }
      case 'navigate': {
        const dest = resolveNavigationDestination(parsed.destination)
        if (dest) {
          const meta = COMMAND_DESTINATIONS[dest]
          items.push({
            id: `nav-parsed-${dest}`,
            label: `Open ${meta.label}`,
            group: 'Suggested',
            icon: Sparkles,
            score: 200,
          })
        }
        break
      }
      case 'action': {
        const actionMap: Record<string, Omit<CommandItem, 'score'>> = {
          'add-quest': {
            id: 'add-quest',
            label: 'Add quest',
            group: 'Suggested',
            icon: Swords,
          },
          'add-goal': {
            id: 'add-goal',
            label: 'Add goal',
            group: 'Suggested',
            icon: Target,
          },
          'add-habit': {
            id: 'add-habit',
            label: 'Add habit',
            group: 'Suggested',
            icon: Repeat,
          },
          export: {
            id: 'export',
            label: 'Export data',
            group: 'Suggested',
            icon: Download,
          },
        }
        const mapped = actionMap[parsed.action]
        if (mapped) items.push({ ...mapped, score: 200 })
        break
      }
    }
  }

  const staticPool = [...staticActions(), ...staticNavigation()]
  for (const item of staticPool) {
    const scored = scoreItem(q, item)
    if (!q || scored.score > 0) {
      items.push(scored)
    }
  }

  const activeQuests = quests.filter((q) =>
    ['TODO', 'IN_PROGRESS'].includes(q.status),
  )
  for (const { item: quest, score } of fuzzyMatch(q, activeQuests, (x) => x.title, 4)) {
    items.push({
      id: `complete-${quest.id}`,
      label: `Complete "${quest.title}"`,
      description: `+${quest.xpReward} XP`,
      group: 'Quests',
      icon: CheckCircle2,
      score,
    })
  }

  const activeHabits = habits.filter((h) => !h.archivedAt)
  for (const { item: habit, score } of fuzzyMatch(q, activeHabits, (h) => h.name, 3)) {
    items.push({
      id: `habit-${habit.id}`,
      label: `Log habit: ${habit.name}`,
      group: 'Habits',
      icon: Repeat,
      score,
    })
  }

  const activeGoals = goals.filter((g) => g.status === 'ACTIVE')
  for (const { item: goal, score } of fuzzyMatch(q, activeGoals, (g) => g.title, 3)) {
    items.push({
      id: `goal-${goal.id}`,
      label: `Open goal: ${goal.title}`,
      group: 'Goals',
      icon: Target,
      score,
    })
  }

  const seen = new Set<string>()
  return items
    .filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
}
