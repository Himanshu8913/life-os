export const QUEST_TYPES = ['DAILY', 'SIDE', 'MAIN', 'EPIC'] as const
export type QuestType = (typeof QUEST_TYPES)[number]

export const QUEST_STATUSES = [
  'TODO',
  'IN_PROGRESS',
  'COMPLETED',
  'ARCHIVED',
  'CANCELLED',
] as const
export type QuestStatus = (typeof QUEST_STATUSES)[number]

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
export type Priority = (typeof PRIORITIES)[number]

export const GOAL_CATEGORIES = [
  'WORK',
  'LEARNING',
  'FITNESS',
  'FINANCE',
  'RELATIONSHIPS',
  'PERSONAL',
  'CREATIVE',
  'TRAVEL',
  'OTHER',
] as const
export type GoalCategory = (typeof GOAL_CATEGORIES)[number]

export const GOAL_STATUSES = [
  'ACTIVE',
  'COMPLETED',
  'ARCHIVED',
  'CANCELLED',
] as const
export type GoalStatus = (typeof GOAL_STATUSES)[number]

export const HABIT_FREQUENCIES = ['DAILY', 'WEEKLY', 'CUSTOM'] as const
export type HabitFrequency = (typeof HABIT_FREQUENCIES)[number]

export const TIMELINE_EVENT_TYPES = [
  'QUEST_COMPLETED',
  'GOAL_CREATED',
  'GOAL_COMPLETED',
  'MILESTONE_COMPLETED',
  'HABIT_COMPLETED',
  'WORKOUT',
  'READING',
  'REFLECTION',
  'ACHIEVEMENT_UNLOCKED',
  'LEVEL_UP',
  'MOOD_LOGGED',
  'CUSTOM',
] as const
export type TimelineEventType = (typeof TIMELINE_EVENT_TYPES)[number]

export const LIFE_ATTRIBUTES = [
  'discipline',
  'creativity',
  'fitness',
  'learning',
  'social',
  'finance',
] as const
export type LifeAttributeKey = (typeof LIFE_ATTRIBUTES)[number]

export const BACKUP_VERSION = 1 as const
