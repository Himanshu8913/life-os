import type {
  GoalCategory,
  GoalStatus,
  HabitFrequency,
  LifeAttributeKey,
  Priority,
  QuestStatus,
  QuestType,
  TimelineEventType,
} from './enums'

export interface AttributeReward {
  attribute: LifeAttributeKey
  amount: number
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt?: string
  order: number
}

export interface UserProfile {
  id: 'default'
  displayName: string
  totalXp: number
  attributes: Record<LifeAttributeKey, number>
  createdAt: string
  updatedAt: string
}

export interface Quest {
  id: string
  title: string
  description?: string
  type: QuestType
  status: QuestStatus
  priority: Priority
  xpReward: number
  attributeRewards?: AttributeReward[]
  createdAt: string
  completedAt?: string
  dueDate?: string
  goalId?: string
  habitId?: string
  milestones?: Milestone[]
  tags?: string[]
  notes?: string
}

export interface Goal {
  id: string
  title: string
  description?: string
  category: GoalCategory
  status: GoalStatus
  targetDate?: string
  progress: number
  milestones: Milestone[]
  linkedQuestIds: string[]
  createdAt: string
  completedAt?: string
}

export interface Habit {
  id: string
  name: string
  description?: string
  frequency: HabitFrequency
  target: number
  currentStreak: number
  longestStreak: number
  createdAt: string
  archivedAt?: string
}

export interface HabitCompletion {
  id: string
  habitId: string
  completedAt: string
  note?: string
}

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description?: string
  metadata?: Record<string, string | number | boolean>
  createdAt: string
}

export interface Achievement {
  id: string
  definitionId: string
  title: string
  description: string
  unlockedAt: string
  hidden: boolean
}

export interface FocusSession {
  id: string
  title: string
  durationMinutes: number
  startedAt: string
  completedAt?: string
  xpEarned?: number
}

export interface Reflection {
  id: string
  weekStart: string
  wentWell: string
  wentPoorly: string
  proudOf: string
  nextWeekFocus: string
  createdAt: string
}

export interface MoodEntry {
  id: string
  mood: number
  energy: number
  focus: number
  note?: string
  loggedAt: string
}

export interface AppSettings {
  id: 'default'
  accentColor: string
  reducedMotion: boolean
  seedDataLoaded: boolean
}

export interface LifeArea {
  id: string
  name: string
  category: GoalCategory
  score: number
}
