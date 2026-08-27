import { PageHeader } from '@/components/layout/page-header'
import { PlaceholderPage } from '@/components/layout/placeholder-page'

export function TimelinePage() {
  return (
    <div>
      <PageHeader
        title="Timeline"
        description="Your life's activity history."
      />
      <PlaceholderPage
        title="Life Timeline"
        description="Every meaningful action creates an immutable event."
      />
    </div>
  )
}
