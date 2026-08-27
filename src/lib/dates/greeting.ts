/**
 * Returns a time-of-day greeting based on the device's local clock (PLAN §5.2).
 *
 * @param date - Reference time; defaults to now.
 */
export function getGreeting(date = new Date()): string {
  const hour = date.getHours()
  if (hour < 5) return 'Good Night'
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  if (hour < 21) return 'Good Evening'
  return 'Good Night'
}

/**
 * Formats the dashboard date line: `WEDNESDAY · 26 AUGUST 2026`.
 */
export function formatDashboardDate(date = new Date()): string {
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()
  const year = date.getFullYear()
  return `${weekday} · ${day} ${month} ${year}`
}
