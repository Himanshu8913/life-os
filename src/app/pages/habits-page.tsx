import { PageHeader } from '@/components/layout/page-header'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export function HabitsPage() {
  return (
    <div>
      <PageHeader
        title="Habits"
        description="Recurring behaviors and momentum."
      />
      <PlaceholderPage
        title="Habit System"
        description="Track habits, streaks, and momentum over time."
      />
    </div>
  )
}
