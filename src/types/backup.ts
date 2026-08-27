import type { BACKUP_VERSION } from './enums'
import type {
  Achievement,
  AppSettings,
  FocusSession,
  Goal,
  Habit,
  HabitCompletion,
  MoodEntry,
  Quest,
  Reflection,
  TimelineEvent,
  UserProfile,
} from './entities'

export interface LifeOSBackup {
  version: typeof BACKUP_VERSION
  exportedAt: string
  profile: UserProfile
  quests: Quest[]
  goals: Goal[]
  habits: Habit[]
  habitCompletions: HabitCompletion[]
  timeline: TimelineEvent[]
  achievements: Achievement[]
  reflections: Reflection[]
  focusSessions: FocusSession[]
  moodEntries: MoodEntry[]
  settings: AppSettings
}
