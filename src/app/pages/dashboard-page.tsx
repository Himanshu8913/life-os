import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useSettingsStore } from '@/stores/settings-store'

/**
 * Returns a time-of-day greeting based on the device's local clock.
 *
 * Uses fixed hour boundaries (no external APIs):
 * - 00:00–04:59 → Good Night
 * - 05:00–11:59 → Good Morning
 * - 12:00–16:59 → Good Afternoon
 * - 17:00–20:59 → Good Evening
 * - 21:00–23:59 → Good Night
 *
 * @returns The greeting string for the current local hour.
 */
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 5) return 'Good Night'
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  if (hour < 21) return 'Good Evening'
  return 'Good Night'
}

export function DashboardPage() {
  const isDbReady = useSettingsStore((s) => s.isDbReady)
  const now = new Date()

  return (
    <div>
      <PageHeader
        title={getGreeting()}
        description={now.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card elevated>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            Level
          </p>
          <p className="mt-2 font-mono text-3xl font-semibold">1</p>
          <div className="mt-4">
            <ProgressBar value={0} max={500} label="0 / 500 XP" />
          </div>
        </Card>

        <Card elevated>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            System Status
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground-secondary">Database</dt>
              <dd className={isDbReady ? 'text-success' : 'text-warning'}>
                {isDbReady ? 'Ready' : 'Initializing…'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground-secondary">Phase</dt>
              <dd>Foundation</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
