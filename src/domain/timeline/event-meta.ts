import type { TimelineEventType } from '@/types/enums'

export interface TimelineEventMeta {
  icon: string
  label: string
  accentClass: string
}

export const TIMELINE_EVENT_META: Record<TimelineEventType, TimelineEventMeta> = {
  QUEST_COMPLETED: { icon: '⚔', label: 'Quest', accentClass: 'text-accent' },
  GOAL_CREATED: { icon: '🎯', label: 'Goal created', accentClass: 'text-sky-400' },
  GOAL_COMPLETED: { icon: '🏆', label: 'Goal', accentClass: 'text-amber-400' },
  MILESTONE_COMPLETED: { icon: '◆', label: 'Milestone', accentClass: 'text-violet-400' },
  HABIT_COMPLETED: { icon: '🔥', label: 'Habit', accentClass: 'text-orange-400' },
  WORKOUT: { icon: '🏋', label: 'Workout', accentClass: 'text-emerald-400' },
  READING: { icon: '📚', label: 'Reading', accentClass: 'text-cyan-400' },
  REFLECTION: { icon: '📝', label: 'Reflection', accentClass: 'text-indigo-400' },
  ACHIEVEMENT_UNLOCKED: { icon: '★', label: 'Achievement', accentClass: 'text-amber-400' },
  LEVEL_UP: { icon: '✦', label: 'Level up', accentClass: 'text-success' },
  MOOD_LOGGED: { icon: '🙂', label: 'Mood', accentClass: 'text-pink-400' },
  CUSTOM: { icon: '·', label: 'Event', accentClass: 'text-foreground-secondary' },
}

export function getEventMeta(type: TimelineEventType): TimelineEventMeta {
  return TIMELINE_EVENT_META[type]
}

/** Extracts XP from event metadata when present. */
export function getEventXp(event: { metadata?: Record<string, string | number | boolean> }): number {
  if (!event.metadata) return 0
  const xp = event.metadata.xpGained ?? event.metadata.xp
  return typeof xp === 'number' ? xp : 0
}
