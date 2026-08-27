import { calculateGoalProgress } from '@/domain/goals/goal-progress'
import { inferHabitCategory } from '@/domain/life-map/infer-habit-category'
import {
  LIFE_MAP_ANGLES,
  LIFE_MAP_CATEGORIES,
} from '@/domain/life-map/layout'
import { calculateMomentum } from '@/domain/momentum/momentum'
import { GOAL_CATEGORY_META } from '@/domain/goals/category-meta'
import type {
  Goal,
  Habit,
  HabitCompletion,
  Quest,
  TimelineEvent,
} from '@/types'
import type { GoalCategory } from '@/types/enums'

export interface LifeAreaStats {
  activeGoals: number
  completedGoals: number
  activeQuests: number
  completedQuests: number
  habitMomentum: number
  recentActivityCount: number
  progressScore: number
  avgGoalProgress: number
}

export interface LifeAreaNode {
  category: GoalCategory
  label: string
  icon: string
  angle: number
  stats: LifeAreaStats
  goals: Goal[]
  quests: Quest[]
  recentEvents: TimelineEvent[]
}

export interface LifeMapCenter {
  label: string
  level: number
  activeAreas: number
  totalProgress: number
}

export interface LifeMapData {
  center: LifeMapCenter
  areas: LifeAreaNode[]
}

export interface BuildLifeMapInput {
  goals: Goal[]
  quests: Quest[]
  habits: Habit[]
  habitCompletions: HabitCompletion[]
  events: TimelineEvent[]
  displayName: string
  level: number
}

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
): GoalCategory | null {
  if (event.type === 'WORKOUT') return 'FITNESS'
  if (event.type === 'READING') return 'LEARNING'
  const goalId = event.metadata?.goalId
  if (typeof goalId === 'string') {
    const goal = goalsById.get(goalId)
    if (goal) return goal.category
  }
  const habitId = event.metadata?.habitId
  if (typeof habitId === 'string' && event.type === 'HABIT_COMPLETED') {
    return null
  }
  return null
}

function computeProgressScore(
  avgGoalProgress: number,
  activeGoals: number,
  completedQuests: number,
  totalQuests: number,
  habitMomentum: number,
): number {
  const parts: number[] = []
  if (activeGoals > 0) parts.push(avgGoalProgress)
  if (totalQuests > 0) parts.push((completedQuests / totalQuests) * 100)
  if (habitMomentum > 0) parts.push(habitMomentum)
  if (parts.length === 0) return 0
  return Math.round(parts.reduce((sum, v) => sum + v, 0) / parts.length)
}

/**
 * Derives the Life Map visualization from existing store data (PLAN §18).
 * No duplicate state — pure function over goals, quests, habits, and timeline.
 */
export function buildLifeMap(input: BuildLifeMapInput): LifeMapData {
  const goalsById = new Map(input.goals.map((g) => [g.id, g]))
  const activeHabits = input.habits.filter((h) => !h.archivedAt)

  const habitsByCategory = new Map<GoalCategory, Habit[]>()
  for (const habit of activeHabits) {
    const cat = inferHabitCategory(habit.name)
    const list = habitsByCategory.get(cat) ?? []
    list.push(habit)
    habitsByCategory.set(cat, list)
  }

  const thirtyDaysAgo = Date.now() - 30 * 86_400_000
  const recentEvents = input.events.filter(
    (e) => new Date(e.createdAt).getTime() >= thirtyDaysAgo,
  )

  const areas: LifeAreaNode[] = LIFE_MAP_CATEGORIES.map((category) => {
    const categoryGoals = input.goals.filter((g) => g.category === category)
    const activeGoals = categoryGoals.filter((g) => g.status === 'ACTIVE')
    const completedGoals = categoryGoals.filter((g) => g.status === 'COMPLETED')

    const categoryQuests = input.quests.filter(
      (q) => getQuestCategory(q, goalsById) === category,
    )
    const activeQuests = categoryQuests.filter((q) =>
      ['TODO', 'IN_PROGRESS'].includes(q.status),
    )
    const completedQuests = categoryQuests.filter((q) => q.status === 'COMPLETED')

    const areaHabits = habitsByCategory.get(category) ?? []
    const habitIds = areaHabits.map((h) => h.id)
    const completions = input.habitCompletions.filter((c) =>
      habitIds.includes(c.habitId),
    )
    const habitMomentum =
      habitIds.length > 0
        ? Math.round(
            habitIds.reduce((sum, id) => {
              const timestamps = completions
                .filter((c) => c.habitId === id)
                .map((c) => c.completedAt)
              return sum + calculateMomentum(timestamps).score
            }, 0) / habitIds.length,
          )
        : 0

    const areaRecentEvents = recentEvents.filter((e) => {
      const cat = getEventCategory(e, goalsById)
      if (cat === category) return true
      if (e.type === 'HABIT_COMPLETED' && typeof e.metadata?.habitId === 'string') {
        const habit = activeHabits.find((h) => h.id === e.metadata?.habitId)
        if (habit && inferHabitCategory(habit.name) === category) return true
      }
      if (e.type === 'QUEST_COMPLETED') {
        const questId = e.metadata?.questId
        if (typeof questId === 'string') {
          const quest = input.quests.find((q) => q.id === questId)
          if (quest && getQuestCategory(quest, goalsById) === category) return true
        }
      }
      return categoryGoals.some((g) => e.title.includes(g.title))
    })

    const avgGoalProgress =
      activeGoals.length > 0
        ? Math.round(
            activeGoals.reduce(
              (sum, g) => sum + calculateGoalProgress(g.milestones),
              0,
            ) / activeGoals.length,
          )
        : 0

    const meta = GOAL_CATEGORY_META[category]
    const stats: LifeAreaStats = {
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      activeQuests: activeQuests.length,
      completedQuests: completedQuests.length,
      habitMomentum,
      recentActivityCount: areaRecentEvents.length,
      avgGoalProgress,
      progressScore: computeProgressScore(
        avgGoalProgress,
        activeGoals.length,
        completedQuests.length,
        categoryQuests.length,
        habitMomentum,
      ),
    }

    return {
      category,
      label: meta.label,
      icon: meta.icon,
      angle: LIFE_MAP_ANGLES[category],
      stats,
      goals: activeGoals.slice(0, 5),
      quests: activeQuests.slice(0, 5),
      recentEvents: areaRecentEvents.slice(0, 5),
    }
  })

  const activeAreas = areas.filter(
    (a) =>
      a.stats.activeGoals > 0 ||
      a.stats.activeQuests > 0 ||
      a.stats.habitMomentum > 0,
  ).length

  const totalProgress =
    areas.length > 0
      ? Math.round(
          areas.reduce((sum, a) => sum + a.stats.progressScore, 0) / areas.length,
        )
      : 0

  return {
    center: {
      label: input.displayName,
      level: input.level,
      activeAreas,
      totalProgress,
    },
    areas,
  }
}
