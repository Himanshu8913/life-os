import { parseCommand, resolveNavigationDestination } from '@/domain/commands/parse-command'
import { logActivity } from '@/domain/commands/log-activity'
import { logMood } from '@/domain/commands/log-mood'
import type { CommandItem } from '@/domain/commands/build-command-items'
import { COMMAND_DESTINATIONS } from '@/lib/commands/navigation'
import { downloadBackup } from '@/lib/export/backup'
import { getAllMoodEntries } from '@/db/repositories/mood-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { useCommandPaletteStore } from '@/stores/command-palette-store'
import { useFocusStore } from '@/stores/focus-store'
import { useGoalStore } from '@/stores/goal-store'
import { useHabitStore } from '@/stores/habit-store'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimelineStore } from '@/stores/timeline-store'

interface ExecuteContext {
  navigate: (path: string) => void
}

function getNavKey(itemId: string): string | null {
  if (itemId.startsWith('nav-parsed-')) return itemId.slice('nav-parsed-'.length)
  if (itemId.startsWith('nav-')) return itemId.slice('nav-'.length)
  return null
}

function navigateToDestination(
  key: string,
  navigate: ExecuteContext['navigate'],
): void {
  const dest = COMMAND_DESTINATIONS[key]
  if (!dest) return
  const palette = useCommandPaletteStore.getState()
  if (dest.path) navigate(dest.path)
  else palette.showFeedback(`${dest.label} — coming in a future update.`)
}

/**
 * Runs a command palette item or parsed query action.
 */
export async function executeCommandItem(
  item: CommandItem,
  query: string,
  ctx: ExecuteContext,
): Promise<void> {
  const { navigate } = ctx
  const palette = useCommandPaletteStore.getState()
  const parsed = parseCommand(query.trim())

  if (item.id === 'add-quest') {
    palette.openModal('quest')
    return
  }
  if (item.id === 'add-goal') {
    palette.openModal('goal')
    return
  }
  if (item.id === 'add-habit') {
    palette.openModal('habit')
    return
  }
  if (item.id === 'export') {
    await downloadBackup()
    palette.showFeedback('Backup downloaded.')
    return
  }
  if (item.id === 'focus-default') {
    await useFocusStore.getState().start(25)
    return
  }
  if (item.id === 'mood-prompt') {
    palette.showFeedback('Type a mood, e.g. mood happy or mood 4')
    return
  }
  if (item.id === 'focus-run' && parsed?.kind === 'focus') {
    await useFocusStore.getState().start(parsed.minutes, parsed.title)
    return
  }
  if (item.id === 'mood-run' && parsed?.kind === 'mood') {
    const result = await logMood(parsed.label)
    const [events, entries] = await Promise.all([
      getAllTimelineEvents(),
      getAllMoodEntries(),
    ])
    useTimelineStore.getState().setEvents(events)
    useProfileStore.getState().setMoodEntries(entries)
    palette.showFeedback(`Mood logged: ${result.label}`)
    return
  }
  if (item.id.startsWith('activity-') && parsed?.kind === 'activity') {
    await logActivity(parsed.activity, parsed.minutes)
    const events = await getAllTimelineEvents()
    useTimelineStore.getState().setEvents(events)
    palette.showFeedback(`Logged ${parsed.activity} (${parsed.minutes}m)`)
    return
  }
  if (item.id.startsWith('complete-')) {
    const questId = item.id.replace('complete-', '')
    await useQuestStore.getState().completeQuest(questId)
    return
  }
  if (item.id.startsWith('habit-')) {
    const habitId = item.id.replace('habit-', '')
    await useHabitStore.getState().toggleToday(habitId)
    return
  }
  if (item.id.startsWith('goal-')) {
    const goalId = item.id.replace('goal-', '')
    useGoalStore.getState().selectGoal(goalId)
    navigate('/goals')
    return
  }
  if (item.id.startsWith('nav-')) {
    const key =
      getNavKey(item.id) ??
      (parsed?.kind === 'navigate'
        ? resolveNavigationDestination(parsed.destination)
        : null)
    if (key) navigateToDestination(key, navigate)
  }
}
