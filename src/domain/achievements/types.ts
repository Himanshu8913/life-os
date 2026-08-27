export interface AchievementStats {
  totalCompletedQuests: number
  totalCompletedGoals: number
  totalCompletedMilestones: number
  totalCompletedFocusSessions: number
  currentLevel: number
  longestStreak: number
  returnedAfterBreak: boolean
  daysUsingApp: number
  unlockedDefinitionIds: Set<string>
}

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  hidden: boolean
  check: (stats: AchievementStats) => boolean
}
