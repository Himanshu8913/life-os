import { PageHeader } from '@/components/layout/page-header'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export function GoalsPage() {
  return (
    <div>
      <PageHeader
        title="Goals"
        description="Long-term outcomes with milestones."
      />
      <PlaceholderPage
        title="Goal System"
        description="Define goals, break them into milestones, and track progress."
      />
    </div>
  )
}
