import { create } from 'zustand'
import {
  addMilestone,
  completeGoal,
  completeMilestone,
  linkQuestToGoal,
  removeMilestone,
} from '@/domain/goals/goal-actions'
import {
  calculateGoalProgress,
  reorderMilestones,
  withComputedProgress,
} from '@/domain/goals/goal-progress'
import {
  createGoal as createGoalRepo,
  deleteGoal as deleteGoalRepo,
  getAllGoals,
  updateGoal as updateGoalRepo,
} from '@/db/repositories/goal-repository'
import { updateQuest } from '@/db/repositories/quest-repository'
import { addTimelineEvent, getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { syncGamificationAfterAction } from '@/lib/gamification/sync-gamification'
import { generateId } from '@/lib/ids/generate-id'
import { useProfileStore } from '@/stores/profile-store'
import { useQuestStore } from '@/stores/quest-store'
import { useTimelineStore } from '@/stores/timeline-store'
import type { Goal, GoalCategory, GoalStatus, Milestone } from '@/types'

export interface GoalToast {
  id: string
  title: string
  xpGained: number
  leveledUp: boolean
  newLevel: number
  kind: 'milestone' | 'goal'
}

export interface CreateGoalInput {
  title: string
  description?: string
  category: GoalCategory
  targetDate?: string
  milestoneTitles?: string[]
}

interface GoalState {
  goals: Goal[]
  selectedGoalId: string | null
  toast: GoalToast | null
  setGoals: (goals: Goal[]) => void
  selectGoal: (id: string | null) => void
  dismissToast: () => void
  refreshGoals: () => Promise<void>
  addGoal: (input: CreateGoalInput) => Promise<Goal>
  editGoal: (
    id: string,
    updates: Partial<Omit<Goal, 'id' | 'createdAt'>>,
  ) => Promise<Goal>
  removeGoal: (id: string) => Promise<void>
  archiveGoal: (id: string) => Promise<void>
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>
  reorderMilestone: (
    goalId: string,
    milestoneId: string,
    direction: -1 | 1,
  ) => Promise<void>
  createMilestone: (goalId: string, title: string) => Promise<void>
  deleteMilestone: (goalId: string, milestoneId: string) => Promise<void>
  finishGoal: (goalId: string) => Promise<void>
  attachQuest: (goalId: string, questId: string) => Promise<void>
  detachQuest: (goalId: string, questId: string) => Promise<void>
}

async function syncAfterXp(totalXp: number) {
  const profile = useProfileStore.getState().profile
  if (profile) {
    useProfileStore.getState().setProfile({ ...profile, totalXp })
  }
  const events = await getAllTimelineEvents()
  useTimelineStore.getState().setEvents(events)
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  selectedGoalId: null,
  toast: null,
  setGoals: (goals) => set({ goals }),
  selectGoal: (selectedGoalId) => set({ selectedGoalId }),
  dismissToast: () => set({ toast: null }),

  refreshGoals: async () => {
    set({ goals: await getAllGoals() })
  },

  addGoal: async (input) => {
    const milestones: Milestone[] = (input.milestoneTitles ?? [])
      .map((title) => title.trim())
      .filter(Boolean)
      .map((title, order) => ({
        id: generateId(),
        title,
        completed: false,
        order,
      }))

    let goal = await createGoalRepo({
      title: input.title.trim(),
      description: input.description?.trim(),
      category: input.category,
      status: 'ACTIVE',
      targetDate: input.targetDate,
      progress: 0,
      milestones,
      linkedQuestIds: [],
    })

    goal = withComputedProgress(goal)
    if (goal.progress !== 0 || milestones.length === 0) {
      goal = await updateGoalRepo(goal.id, { progress: goal.progress })
    }

    await addTimelineEvent({
      type: 'GOAL_CREATED',
      title: `Goal created: ${goal.title}`,
      metadata: { goalId: goal.id },
    })
    await syncAfterXp(useProfileStore.getState().profile?.totalXp ?? 0)

    set({ goals: [goal, ...get().goals] })
    return goal
  },

  editGoal: async (id, updates) => {
    const payload = { ...updates }
    if (payload.milestones) {
      payload.progress = calculateGoalProgress(payload.milestones)
    }
    const updated = await updateGoalRepo(id, payload)
    set({ goals: get().goals.map((g) => (g.id === id ? updated : g)) })
    return updated
  },

  removeGoal: async (id) => {
    await deleteGoalRepo(id)
    set({
      goals: get().goals.filter((g) => g.id !== id),
      selectedGoalId: get().selectedGoalId === id ? null : get().selectedGoalId,
    })
  },

  archiveGoal: async (id) => {
    const updated = await updateGoalRepo(id, { status: 'ARCHIVED' as GoalStatus })
    set({ goals: get().goals.map((g) => (g.id === id ? updated : g)) })
  },

  toggleMilestone: async (goalId, milestoneId) => {
    const goal = get().goals.find((g) => g.id === goalId)
    const milestone = goal?.milestones.find((m) => m.id === milestoneId)
    const completed = !milestone?.completed

    const result = await completeMilestone(goalId, milestoneId, completed)
    set({
      goals: get().goals.map((g) => (g.id === goalId ? result.goal : g)),
      toast:
        result.xpGained > 0
          ? {
              id: crypto.randomUUID(),
              title: result.goalCompleted
                ? result.goal.title
                : (milestone?.title ?? 'Milestone'),
              xpGained: result.xpGained,
              leveledUp: result.leveledUp,
              newLevel: result.newLevel,
              kind: result.goalCompleted ? 'goal' : 'milestone',
            }
          : get().toast,
    })
    if (result.xpGained > 0) {
      await syncAfterXp(result.profileTotalXp)
      await syncGamificationAfterAction({
        leveledUp: result.leveledUp,
        newLevel: result.newLevel,
      })
    } else {
      const events = await getAllTimelineEvents()
      useTimelineStore.getState().setEvents(events)
    }
  },

  reorderMilestone: async (goalId, milestoneId, direction) => {
    const goal = get().goals.find((g) => g.id === goalId)
    if (!goal) return
    const milestones = reorderMilestones(goal.milestones, milestoneId, direction)
    const updated = await updateGoalRepo(goalId, { milestones })
    set({ goals: get().goals.map((g) => (g.id === goalId ? updated : g)) })
  },

  createMilestone: async (goalId, title) => {
    const updated = await addMilestone(goalId, title)
    set({ goals: get().goals.map((g) => (g.id === goalId ? updated : g)) })
  },

  deleteMilestone: async (goalId, milestoneId) => {
    const updated = await removeMilestone(goalId, milestoneId)
    set({ goals: get().goals.map((g) => (g.id === goalId ? updated : g)) })
  },

  finishGoal: async (goalId) => {
    const result = await completeGoal(goalId)
    set({
      goals: get().goals.map((g) => (g.id === goalId ? result.goal : g)),
      toast: {
        id: crypto.randomUUID(),
        title: result.goal.title,
        xpGained: result.xpGained,
        leveledUp: result.leveledUp,
        newLevel: result.newLevel,
        kind: 'goal',
      },
    })
    await syncAfterXp(result.profileTotalXp)
    await syncGamificationAfterAction({
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
    })
  },

  attachQuest: async (goalId, questId) => {
    const goal = await linkQuestToGoal(goalId, questId)
    await updateQuest(questId, { goalId })
    set({ goals: get().goals.map((g) => (g.id === goalId ? goal : g)) })
    useQuestStore.getState().setQuests(
      useQuestStore.getState().quests.map((q) =>
        q.id === questId ? { ...q, goalId } : q,
      ),
    )
  },

  detachQuest: async (goalId, questId) => {
    const goal = get().goals.find((g) => g.id === goalId)
    if (!goal) return
    const linkedQuestIds = goal.linkedQuestIds.filter((id) => id !== questId)
    const updated = await updateGoalRepo(goalId, { linkedQuestIds })
    await updateQuest(questId, { goalId: undefined })
    set({ goals: get().goals.map((g) => (g.id === goalId ? updated : g)) })
    useQuestStore.getState().setQuests(
      useQuestStore.getState().quests.map((q) =>
        q.id === questId ? { ...q, goalId: undefined } : q,
      ),
    )
  },
}))
