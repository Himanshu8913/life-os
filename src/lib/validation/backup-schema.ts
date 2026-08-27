import { z } from 'zod'
import {
  BACKUP_VERSION,
  GOAL_CATEGORIES,
  GOAL_STATUSES,
  HABIT_FREQUENCIES,
  LIFE_ATTRIBUTES,
  PRIORITIES,
  QUEST_STATUSES,
  QUEST_TYPES,
  TIMELINE_EVENT_TYPES,
} from '@/types/enums'

const isoDateSchema = z.string().datetime({ offset: true }).or(z.string().datetime())

const milestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  completed: z.boolean(),
  completedAt: isoDateSchema.optional(),
  order: z.number().int().nonnegative(),
})

const attributeRewardSchema = z.object({
  attribute: z.enum(LIFE_ATTRIBUTES),
  amount: z.number(),
})

const profileSchema = z.object({
  id: z.literal('default'),
  displayName: z.string().min(1),
  totalXp: z.number().nonnegative(),
  attributes: z.object({
    discipline: z.number().min(0).max(100),
    creativity: z.number().min(0).max(100),
    fitness: z.number().min(0).max(100),
    learning: z.number().min(0).max(100),
    social: z.number().min(0).max(100),
    finance: z.number().min(0).max(100),
  }),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
})

const questSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(QUEST_TYPES),
  status: z.enum(QUEST_STATUSES),
  priority: z.enum(PRIORITIES),
  xpReward: z.number().nonnegative(),
  attributeRewards: z.array(attributeRewardSchema).optional(),
  createdAt: isoDateSchema,
  completedAt: isoDateSchema.optional(),
  dueDate: isoDateSchema.optional(),
  goalId: z.string().optional(),
  habitId: z.string().optional(),
  milestones: z.array(milestoneSchema).optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

const goalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(GOAL_CATEGORIES),
  status: z.enum(GOAL_STATUSES),
  targetDate: isoDateSchema.optional(),
  progress: z.number().min(0).max(100),
  milestones: z.array(milestoneSchema),
  linkedQuestIds: z.array(z.string()),
  createdAt: isoDateSchema,
  completedAt: isoDateSchema.optional(),
})

const habitSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(HABIT_FREQUENCIES),
  target: z.number().positive(),
  currentStreak: z.number().nonnegative(),
  longestStreak: z.number().nonnegative(),
  createdAt: isoDateSchema,
  archivedAt: isoDateSchema.optional(),
})

const habitCompletionSchema = z.object({
  id: z.string().min(1),
  habitId: z.string().min(1),
  completedAt: isoDateSchema,
  note: z.string().optional(),
})

const timelineEventSchema = z.object({
  id: z.string().min(1),
  type: z.enum(TIMELINE_EVENT_TYPES),
  title: z.string().min(1),
  description: z.string().optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  createdAt: isoDateSchema,
})

const achievementSchema = z.object({
  id: z.string().min(1),
  definitionId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  unlockedAt: isoDateSchema,
  hidden: z.boolean(),
})

const focusSessionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  durationMinutes: z.number().positive(),
  startedAt: isoDateSchema,
  completedAt: isoDateSchema.optional(),
  xpEarned: z.number().nonnegative().optional(),
})

const reflectionSchema = z.object({
  id: z.string().min(1),
  weekStart: isoDateSchema,
  wentWell: z.string(),
  wentPoorly: z.string(),
  proudOf: z.string(),
  nextWeekFocus: z.string(),
  createdAt: isoDateSchema,
})

const moodEntrySchema = z.object({
  id: z.string().min(1),
  mood: z.number().min(1).max(10),
  energy: z.number().min(1).max(10),
  focus: z.number().min(1).max(10),
  note: z.string().optional(),
  loggedAt: isoDateSchema,
})

const settingsSchema = z.object({
  id: z.literal('default'),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  reducedMotion: z.boolean(),
  seedDataLoaded: z.boolean(),
  onboardingCompleted: z.boolean().optional(),
  focusAreas: z.array(z.enum(GOAL_CATEGORIES)).optional(),
  notificationsEnabled: z.boolean().optional(),
  notificationsQuestReminders: z.boolean().optional(),
  notificationsAchievements: z.boolean().optional(),
  weekStartDay: z.union([z.literal(0), z.literal(1)]).optional(),
})

export const backupSchema = z.object({
  version: z.literal(BACKUP_VERSION),
  exportedAt: isoDateSchema,
  profile: profileSchema,
  quests: z.array(questSchema),
  goals: z.array(goalSchema),
  habits: z.array(habitSchema),
  habitCompletions: z.array(habitCompletionSchema),
  timeline: z.array(timelineEventSchema),
  achievements: z.array(achievementSchema),
  reflections: z.array(reflectionSchema),
  focusSessions: z.array(focusSessionSchema),
  moodEntries: z.array(moodEntrySchema),
  settings: settingsSchema,
})

export type ValidatedBackup = z.infer<typeof backupSchema>

/**
 * Validates imported backup JSON against the Life OS schema.
 *
 * @param data - Parsed JSON object from a backup file.
 * @returns Discriminated result with parsed backup or Zod error details.
 */
export function validateBackup(data: unknown):
  | { success: true; data: ValidatedBackup }
  | { success: false; error: string } {
  const result = backupSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const message = result.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ')
  return { success: false, error: message }
}
