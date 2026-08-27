import { db } from '@/db/database'
import type { LifeAttributeKey, UserProfile } from '@/types'

const DEFAULT_ATTRIBUTES: Record<LifeAttributeKey, number> = {
  discipline: 50,
  creativity: 50,
  fitness: 50,
  learning: 50,
  social: 50,
  finance: 50,
}

/**
 * @returns The singleton user profile, creating defaults if none exists.
 */
export async function getOrCreateProfile(): Promise<UserProfile> {
  const existing = await db.profile.get('default')
  if (existing) return existing

  const now = new Date().toISOString()
  const profile: UserProfile = {
    id: 'default',
    displayName: 'Commander',
    totalXp: 0,
    attributes: { ...DEFAULT_ATTRIBUTES },
    createdAt: now,
    updatedAt: now,
  }
  await db.profile.put(profile)
  return profile
}

export async function getProfile(): Promise<UserProfile | undefined> {
  return db.profile.get('default')
}

export async function updateProfile(
  updates: Partial<Omit<UserProfile, 'id'>>,
): Promise<UserProfile> {
  const profile = await getOrCreateProfile()
  const updated: UserProfile = {
    ...profile,
    ...updates,
    id: 'default',
    updatedAt: new Date().toISOString(),
  }
  await db.profile.put(updated)
  return updated
}

export async function addXp(amount: number): Promise<UserProfile> {
  const profile = await getOrCreateProfile()
  return updateProfile({ totalXp: profile.totalXp + amount })
}
