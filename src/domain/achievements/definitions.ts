import type { AchievementDefinition } from '@/domain/achievements/types'

/** Data-driven achievement catalog (PLAN §23–24). */
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'FIRST_STEP',
    title: 'First Step',
    description: 'Complete your first quest.',
    hidden: false,
    check: (s) => s.totalCompletedQuests >= 1,
  },
  {
    id: 'BUILDER',
    title: 'Builder',
    description: 'Complete your first goal.',
    hidden: false,
    check: (s) => s.totalCompletedGoals >= 1,
  },
  {
    id: 'CONSISTENCY',
    title: 'Consistency',
    description: 'Maintain a 30-day habit streak.',
    hidden: false,
    check: (s) => s.longestStreak >= 30,
  },
  {
    id: 'COMEBACK',
    title: 'Comeback',
    description: 'Return after a 7+ day break.',
    hidden: true,
    check: (s) => s.returnedAfterBreak,
  },
  {
    id: 'DEEP_WORK',
    title: 'Deep Work',
    description: 'Complete 50 focus sessions.',
    hidden: false,
    check: (s) => s.totalCompletedFocusSessions >= 50,
  },
  {
    id: 'MILESTONE',
    title: 'Milestone',
    description: 'Complete 10 goal milestones.',
    hidden: false,
    check: (s) => s.totalCompletedMilestones >= 10,
  },
  {
    id: 'LEVEL_10',
    title: 'Level 10',
    description: 'Reach level 10.',
    hidden: false,
    check: (s) => s.currentLevel >= 10,
  },
  {
    id: 'LEVEL_25',
    title: 'Level 25',
    description: 'Reach level 25.',
    hidden: false,
    check: (s) => s.currentLevel >= 25,
  },
  {
    id: 'CENTURY',
    title: 'Century',
    description: 'Complete 100 quests.',
    hidden: true,
    check: (s) => s.totalCompletedQuests >= 100,
  },
  {
    id: 'YEAR_ONE',
    title: '365',
    description: 'Use Life OS for one year.',
    hidden: false,
    check: (s) => s.daysUsingApp >= 365,
  },
]
