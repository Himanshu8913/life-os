import { PageHeader } from '@/components/layout/page-header'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export function QuestsPage() {
  return (
    <div>
      <PageHeader
        title="Quests"
        description="Missions and tasks that drive your progress."
      />
      <PlaceholderPage
        title="Quest System"
        description="Create, complete, and earn XP from daily, side, main, and epic quests."
      />
    </div>
  )
}
