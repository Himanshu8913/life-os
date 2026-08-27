/**
 * Generates a URL-safe unique identifier for entity primary keys.
 *
 * @returns A random UUID v4 string.
 */
export function generateId(): string {
  return crypto.randomUUID()
}
