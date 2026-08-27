import Dexie, { type EntityTable } from 'dexie'

export interface MetaRecord {
  key: string
  value: string
}

/**
 * Dexie database for Life OS local persistence.
 *
 * Schema version 1 stores only a `meta` table for bootstrap flags.
 * Entity tables (quests, goals, habits, etc.) are added in Phase 1 migrations.
 */
class LifeOSDatabase extends Dexie {
  meta!: EntityTable<MetaRecord, 'key'>

  constructor() {
    super('life-os')
    this.version(1).stores({
      meta: 'key',
    })
  }
}

export const db = new LifeOSDatabase()

/**
 * Opens the IndexedDB connection and records first-run initialization.
 *
 * Idempotent — safe to call on every app mount. Writes an `initialized`
 * timestamp to `meta` only when the database has never been opened before.
 *
 * @throws When Dexie cannot open or write to IndexedDB (e.g. private browsing quota).
 */
export async function initDatabase(): Promise<void> {
  await db.open()
  const existing = await db.meta.get('initialized')
  if (!existing) {
    await db.meta.put({
      key: 'initialized',
      value: new Date().toISOString(),
    })
  }
}

/**
 * Returns whether the database has completed its first-run initialization.
 *
 * @returns `true` if the `initialized` meta record exists and is readable.
 */
export async function isDatabaseReady(): Promise<boolean> {
  try {
    await db.meta.get('initialized')
    return true
  } catch {
    return false
  }
}
