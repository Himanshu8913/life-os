import { updateProfile } from '@/db/repositories/profile-repository'
import { updateSettings } from '@/db/repositories/settings-repository'
import type { GoalCategory } from '@/types'

export interface CompleteOnboardingResult {
  displayName: string
  focusAreas: GoalCategory[]
}

/**
 * Persists onboarding choices: display name and focus areas.
 */
export async function completeOnboarding(
  displayName: string,
  focusAreas: GoalCategory[],
): Promise<CompleteOnboardingResult> {
  const trimmed = displayName.trim()
  if (!trimmed) {
    throw new Error('Display name is required.')
  }

  await updateProfile({ displayName: trimmed })
  await updateSettings({ onboardingCompleted: true, focusAreas })

  return { displayName: trimmed, focusAreas }
}
