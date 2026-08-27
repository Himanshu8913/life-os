import { GOAL_CATEGORY_META } from '@/domain/goals/category-meta'
import { inferHabitCategory } from '@/domain/life-map/infer-habit-category'
import { getEventXp } from '@/domain/timeline/event-meta'
import { getLocalDateKey, previousDateKey } from '@/lib/dates/date-utils'
import type {
  FocusSession,
  Goal,
  Habit,
  HabitCompletion,
  Quest,
  TimelineEvent,
} from '@/types'
import type { GoalCategory } from '@/types/enums'

export interface NamedMetric {
  label: string
  value: number
}

export interface ObservatoryMetrics {
  questCompletionRate: number
  goalCompletionRate: number
  totalQuestsCompleted: number
  totalGoalsCompleted: number
  totalHabitsCompleted: number
  totalMilestonesCompleted: number
  totalXpEarned: number
  averageDailyActivity: number
  mostActiveCategory: NamedMetric | null
  mostConsistentHabit: NamedMetric | null
  mostProductiveDay: NamedMetric | null
  mostActiveHour: NamedMetric | null
  longestMomentum: NamedMetric | null
  weeklyActivity: { week: string; label: string; count: number }[]
  monthlyActivity: { month: string; label: string; count: number }[]
  xpByCategory: { category: string; xp: number }[]
  activityByDayOfWeek: { day: string; count: number }[]
  activityByHour: { hour: string; count: number }[]
}

export interface ObservatoryInput {
  quests: Quest[]
  goals: Goal[]
  habits: Habit[]
  habitCompletions: HabitCompletion[]
  events: TimelineEvent[]
  totalXp: number
  focusSessions: FocusSession[]
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

function getQuestCategory(quest: Quest, goalsById: Map<string, Goal>): GoalCategory {
  if (quest.goalId) {
    const goal = goalsById.get(quest.goalId)
    if (goal) return goal.category
  }
  const tagMatch = quest.tags?.join(' ').toLowerCase() ?? ''
  if (tagMatch.includes('fitness')) return 'FITNESS'
  if (tagMatch.includes('learn')) return 'LEARNING'
  return 'OTHER'
}

function getEventCategory(
  event: TimelineEvent,
  goalsById: Map<string, Goal>,
  habitsById: Map<string, Habit>,
): GoalCategory | null {
  if (event.type === 'WORKOUT') return 'FITNESS'
  if (event.type === 'READING') return 'LEARNING'
  const goalId = event.metadata?.goalId
  if (typeof goalId === 'string') {
    const goal = goalsById.get(goalId)
    if (goal) return goal.category
  }
  if (event.type === 'HABIT_COMPLETED' && typeof event.metadata?.habitId === 'string') {
    const habit = habitsById.get(event.metadata.habitId)
    if (habit) return inferHabitCategory(habit.name)
  }
  if (event.type === 'QUEST_COMPLETED' && typeof event.metadata?.questId === 'string') {
    return null
  }
  return null
}

function getWeekStartKey(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return getLocalDateKey(d)
}

function shiftMonthKey(monthKey: string, delta: number): string {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, {
    month: 'short',
    year: '2-digit',
  })
}

function formatWeekLabel(weekKey: string): string {
  const [y, m, d] = weekKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function findPeakHourWindow(events: TimelineEvent[]): NamedMetric | null {
  if (events.length === 0) return null
  const hourCounts = Array.from({ length: 24 }, () => 0)
  for (const event of events) {
    hourCounts[new Date(event.createdAt).getHours()]++
  }

  let bestStart = 0
  let bestSum = 0
  for (let h = 0; h <= 21; h++) {
    const sum = hourCounts[h] + hourCounts[h + 1] + hourCounts[h + 2]
    if (sum > bestSum) {
      bestSum = sum
      bestStart = h
    }
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    label: `${pad(bestStart)}:00 – ${pad(bestStart + 3)}:00`,
    value: bestSum,
  }
}

function maxEntry(counts: Map<string, number>): NamedMetric | null {
  let best: NamedMetric | null = null
  for (const [label, value] of counts) {
    if (!best || value > best.value) best = { label, value }
  }
  return best
}

/**
 * Computes all Observatory metrics deterministically from local data (PLAN §19–20).
 */
export function calculateObservatoryMetrics(
  input: ObservatoryInput,
  reference = new Date(),
): ObservatoryMetrics {
  const goalsById = new Map(input.goals.map((g) => [g.id, g]))
  const habitsById = new Map(input.habits.map((h) => [h.id, h]))

  const countableQuests = input.quests.filter((q) => q.status !== 'CANCELLED')
  const completedQuests = countableQuests.filter((q) => q.status === 'COMPLETED')
  const questCompletionRate =
    countableQuests.length > 0
      ? Math.round((completedQuests.length / countableQuests.length) * 100)
      : 0

  const countableGoals = input.goals.filter((g) => g.status !== 'CANCELLED')
  const completedGoals = countableGoals.filter((g) => g.status === 'COMPLETED')
  const goalCompletionRate =
    countableGoals.length > 0
      ? Math.round((completedGoals.length / countableGoals.length) * 100)
      : 0

  const totalMilestonesCompleted = input.goals
    .flatMap((g) => g.milestones)
    .filter((m) => m.completed).length

  const categoryCounts = new Map<string, number>()
  for (const event of input.events) {
    const cat = getEventCategory(event, goalsById, habitsById)
    if (cat) {
      const label = GOAL_CATEGORY_META[cat].label
      categoryCounts.set(label, (categoryCounts.get(label) ?? 0) + 1)
    }
  }
  for (const quest of completedQuests) {
    const cat = getQuestCategory(quest, goalsById)
    const label = GOAL_CATEGORY_META[cat].label
    categoryCounts.set(label, (categoryCounts.get(label) ?? 0) + 1)
  }

  const dayOfWeekCounts = new Map<string, number>()
  for (const name of DAY_NAMES) dayOfWeekCounts.set(name, 0)
  for (const event of input.events) {
    const name = DAY_NAMES[new Date(event.createdAt).getDay()]
    dayOfWeekCounts.set(name, (dayOfWeekCounts.get(name) ?? 0) + 1)
  }

  const hourCounts = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${String(hour).padStart(2, '0')}:00`,
    count: 0,
  }))
  for (const event of input.events) {
    hourCounts[new Date(event.createdAt).getHours()].count++
  }

  const activeHabits = input.habits.filter((h) => !h.archivedAt)
  const mostConsistent = activeHabits.reduce<Habit | null>(
    (best, h) => (!best || h.currentStreak > best.currentStreak ? h : best),
    null,
  )
  const longestStreakHabit = activeHabits.reduce<Habit | null>(
    (best, h) => (!best || h.longestStreak > best.longestStreak ? h : best),
    null,
  )

  const xpByCategoryMap = new Map<string, number>()
  for (const quest of completedQuests) {
    const cat = getQuestCategory(quest, goalsById)
    const label = GOAL_CATEGORY_META[cat].label
    xpByCategoryMap.set(label, (xpByCategoryMap.get(label) ?? 0) + quest.xpReward)
  }
  for (const session of input.focusSessions) {
    if (session.xpEarned) {
      xpByCategoryMap.set('Focus', (xpByCategoryMap.get('Focus') ?? 0) + session.xpEarned)
    }
  }
  for (const event of input.events) {
    const xp = getEventXp(event)
    if (xp > 0 && event.type === 'HABIT_COMPLETED') {
      xpByCategoryMap.set('Habits', (xpByCategoryMap.get('Habits') ?? 0) + xp)
    }
  }

  const refKey = getLocalDateKey(reference)
  const activeDays = new Set(input.events.map((e) => getLocalDateKey(new Date(e.createdAt))))
  const thirtyDayKeys = new Set<string>()
  let cursor = refKey
  for (let i = 0; i < 30; i++) {
    thirtyDayKeys.add(cursor)
    cursor = previousDateKey(cursor)
  }
  let activityInWindow = 0
  for (const key of thirtyDayKeys) {
    if (activeDays.has(key)) activityInWindow++
  }
  const averageDailyActivity = Math.round((activityInWindow / 30) * 10) / 10

  const weeklyActivity: ObservatoryMetrics['weeklyActivity'] = []
  let weekCursor = getWeekStartKey(reference)
  for (let i = 0; i < 8; i++) {
    const count = input.events.filter(
      (e) => getWeekStartKey(new Date(e.createdAt)) === weekCursor,
    ).length
    weeklyActivity.unshift({
      week: weekCursor,
      label: formatWeekLabel(weekCursor),
      count,
    })
    const [y, m, d] = weekCursor.split('-').map(Number)
    const prev = new Date(y, m - 1, d)
    prev.setDate(prev.getDate() - 7)
    weekCursor = getWeekStartKey(prev)
  }

  const currentMonth = `${reference.getFullYear()}-${String(reference.getMonth() + 1).padStart(2, '0')}`
  const monthlyActivity: ObservatoryMetrics['monthlyActivity'] = []
  for (let i = 5; i >= 0; i--) {
    const monthKey = shiftMonthKey(currentMonth, -i)
    const count = input.events.filter((e) =>
      getLocalDateKey(new Date(e.createdAt)).startsWith(monthKey),
    ).length
    monthlyActivity.push({
      month: monthKey,
      label: formatMonthLabel(monthKey),
      count,
    })
  }

  return {
    questCompletionRate,
    goalCompletionRate,
    totalQuestsCompleted: completedQuests.length,
    totalGoalsCompleted: completedGoals.length,
    totalHabitsCompleted: input.habitCompletions.length,
    totalMilestonesCompleted,
    totalXpEarned: input.totalXp,
    averageDailyActivity,
    mostActiveCategory: maxEntry(categoryCounts),
    mostConsistentHabit: mostConsistent
      ? { label: mostConsistent.name, value: mostConsistent.currentStreak }
      : null,
    mostProductiveDay: maxEntry(dayOfWeekCounts),
    mostActiveHour: findPeakHourWindow(input.events),
    longestMomentum: longestStreakHabit
      ? { label: longestStreakHabit.name, value: longestStreakHabit.longestStreak }
      : null,
    weeklyActivity,
    monthlyActivity,
    xpByCategory: [...xpByCategoryMap.entries()]
      .map(([category, xp]) => ({ category, xp }))
      .sort((a, b) => b.xp - a.xp),
    activityByDayOfWeek: DAY_NAMES.map((day) => ({
      day: day.slice(0, 3),
      count: dayOfWeekCounts.get(day) ?? 0,
    })),
    activityByHour: hourCounts.slice(6, 23),
  }
}
