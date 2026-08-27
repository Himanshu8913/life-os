import { db } from '@/db/database'
import type { AppSettings } from '@/types'

const DEFAULT_SETTINGS: AppSettings = {
  id: 'default',
  accentColor: '#6366f1',
  reducedMotion: false,
  seedDataLoaded: false,
}

export async function getOrCreateSettings(): Promise<AppSettings> {
  const existing = await db.settings.get('default')
  if (existing) return existing
  await db.settings.put(DEFAULT_SETTINGS)
  return DEFAULT_SETTINGS
}

export async function getSettings(): Promise<AppSettings | undefined> {
  return db.settings.get('default')
}

export async function updateSettings(
  updates: Partial<Omit<AppSettings, 'id'>>,
): Promise<AppSettings> {
  const settings = await getOrCreateSettings()
  const updated: AppSettings = { ...settings, ...updates, id: 'default' }
  await db.settings.put(updated)
  return updated
}

export async function markSeedDataLoaded(): Promise<void> {
  await updateSettings({ seedDataLoaded: true })
}
