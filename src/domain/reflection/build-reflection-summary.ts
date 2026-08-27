import { isDateInWeek, formatWeekLabel } from '@/domain/reflection/week-utils'
import type { Goal, HabitCompletion, Quest, Reflection, TimelineEvent } from '@/types'

export interface ReflectionSummaryStat {
  label: string
  value: string
}

export interface ReflectionSummary {
  weekLabel: string
  headline: string
  stats: ReflectionSummaryStat[]
  biggestWin: string
  nextFocus: string
}

export interface ReflectionSummaryInput {
  reflection: Reflection
  events: TimelineEvent[]
  quests: Quest[]
  goals: Goal[]
  habitCompletions: HabitCompletion[]
}

function countEventsInWeek(
  events: TimelineEvent[],
  weekStart: string,
  type: TimelineEvent['type'],
): number {
  return events.filter(
    (e) => e.type === type && isDateInWeek(e.createdAt, weekStart),
  ).length
}

function sumReadingMinutes(events: TimelineEvent[], weekStart: string): number {
  return events
    .filter((e) => e.type === 'READING' && isDateInWeek(e.createdAt, weekStart))
    .reduce((sum, e) => {
      const minutes = e.metadata?.minutes
      return sum + (typeof minutes === 'number' ? minutes : 30)
    }, 0)
}

function pickHeadline(
  questsCompleted: number,
  milestones: number,
  habitLogs: number,
): string {
  if (questsCompleted >= 5 || milestones >= 1) return 'YOU MOVED FORWARD.'
  if (questsCompleted === 0 && habitLogs === 0) return 'A QUIET WEEK.'
  return 'STEADY PROGRESS.'
}

/**
 * Builds a deterministic weekly summary card (PLAN §22) — no AI.
 */
export function buildReflectionSummary(input: ReflectionSummaryInput): ReflectionSummary {
  const { reflection, events, habitCompletions } = input
  const weekStart = reflection.weekStart

  const questsCompleted = countEventsInWeek(events, weekStart, 'QUEST_COMPLETED')
  const workouts = countEventsInWeek(events, weekStart, 'WORKOUT')
  const milestones = countEventsInWeek(events, weekStart, 'MILESTONE_COMPLETED')
  const goalsCompleted = countEventsInWeek(events, weekStart, 'GOAL_COMPLETED')
  const readingMinutes = sumReadingMinutes(events, weekStart)

  const habitLogs = habitCompletions.filter((c) =>
    isDateInWeek(c.completedAt, weekStart),
  ).length

  const majorMilestones = milestones + goalsCompleted

  const stats: ReflectionSummaryStat[] = [
    { label: 'quests completed', value: String(questsCompleted) },
    { label: 'workouts', value: String(workouts) },
  ]

  if (readingMinutes > 0) {
    const hours = Math.round((readingMinutes / 60) * 10) / 10
    stats.push({
      label: 'learning',
      value: hours >= 1 ? `${hours} hours` : `${readingMinutes} min`,
    })
  }

  if (majorMilestones > 0) {
    stats.push({
      label: 'major milestones',
      value: String(majorMilestones),
    })
  }

  if (habitLogs > 0) {
    stats.push({ label: 'habit logs', value: String(habitLogs) })
  }

  const biggestWin =
    reflection.proudOf.trim() ||
    reflection.wentWell.trim().split(/[.!?]/)[0]?.trim() ||
    'Showing up matters.'

  const nextFocus =
    reflection.nextWeekFocus.trim() || 'Keep building momentum.'

  return {
    weekLabel: formatWeekLabel(weekStart),
    headline: pickHeadline(questsCompleted, majorMilestones, habitLogs),
    stats,
    biggestWin,
    nextFocus,
  }
}
