import { calculateLevel } from '@/domain/progression/calculate-level'
import { getFocusXp } from '@/domain/progression/xp-config'
import {
  applyAttributeRewards,
  FOCUS_ATTRIBUTE_REWARDS,
} from '@/domain/progression/attributes'
import { db } from '@/db/database'
import {
  createFocusSession,
  updateFocusSession,
} from '@/db/repositories/focus-repository'
import { getOrCreateProfile, updateProfile } from '@/db/repositories/profile-repository'
import { addTimelineEvent } from '@/db/repositories/timeline-repository'
import type { FocusSession } from '@/types'

export interface StartFocusResult {
  session: FocusSession
}

export interface CompleteFocusResult {
  session: FocusSession
  xpGained: number
  leveledUp: boolean
  newLevel: number
  profileTotalXp: number
}

/**
 * Starts a focus session and persists it to IndexedDB.
 */
export async function startFocusSession(
  minutes: number,
  title = 'Focus session',
): Promise<StartFocusResult> {
  const session = await createFocusSession({
    title: title.trim() || 'Focus session',
    durationMinutes: minutes,
    startedAt: new Date().toISOString(),
  })
  return { session }
}

/**
 * Completes an active focus session, awards XP, and logs timeline events.
 */
export async function completeFocusSession(
  sessionId: string,
): Promise<CompleteFocusResult> {
  const profile = await getOrCreateProfile()
  const previousLevel = calculateLevel(profile.totalXp)

  const existing = await db.focusSessions.get(sessionId)
  if (!existing) throw new Error(`Focus session not found: ${sessionId}`)

  const xp = getFocusXp(existing.durationMinutes)
  const completedAt = new Date().toISOString()
  const newTotalXp = profile.totalXp + xp
  const newLevel = calculateLevel(newTotalXp)

  const session = await updateFocusSession(sessionId, {
    completedAt,
    xpEarned: xp,
  })

  await updateProfile({
    totalXp: newTotalXp,
    attributes: applyAttributeRewards(profile.attributes, FOCUS_ATTRIBUTE_REWARDS),
  })

  await addTimelineEvent({
    type: 'CUSTOM',
    title: `Focus complete: ${session.title}`,
    description: `${session.durationMinutes} minutes · +${xp} XP`,
    metadata: {
      focusSessionId: session.id,
      minutes: session.durationMinutes,
      xp,
    },
  })

  if (newLevel > previousLevel) {
    await addTimelineEvent({
      type: 'LEVEL_UP',
      title: `Level ${newLevel} reached`,
      metadata: { level: newLevel },
    })
  }

  return {
    session,
    xpGained: xp,
    leveledUp: newLevel > previousLevel,
    newLevel,
    profileTotalXp: newTotalXp,
  }
}
