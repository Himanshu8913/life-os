import { db } from '@/db/database'
import type { AppSettings } from '@/types'

const DEFAULT_SETTINGS: AppSettings = {
  id: 'default',
  accentColor: '#818cf8',
  reducedMotion: false,
  seedDataLoaded: false,
  onboardingCompleted: false,
  focusAreas: [],
  notificationsEnabled: true,
  notificationsQuestReminders: true,
  notificationsAchievements: true,
  weekStartDay: 1,
  dailyMissionDate: '',
  dailyMissionRewardedIds: [],
}

export function normalizeSettings(settings: Partial<AppSettings> & { id: 'default' }): AppSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    id: 'default',
    onboardingCompleted: settings.onboardingCompleted ?? true,
    focusAreas: settings.focusAreas ?? [],
    notificationsEnabled: settings.notificationsEnabled ?? true,
    notificationsQuestReminders: settings.notificationsQuestReminders ?? true,
    notificationsAchievements: settings.notificationsAchievements ?? true,
    weekStartDay: settings.weekStartDay ?? 1,
    dailyMissionDate: settings.dailyMissionDate ?? '',
    dailyMissionRewardedIds: settings.dailyMissionRewardedIds ?? [],
  }
}

export async function getOrCreateSettings(): Promise<AppSettings> {
  const existing = await db.settings.get('default')
  if (existing) return normalizeSettings(existing)
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
  const updated = normalizeSettings({ ...settings, ...updates })
  await db.settings.put(updated)
  return updated
}

export async function markSeedDataLoaded(): Promise<void> {
  await updateSettings({ seedDataLoaded: true })
}
