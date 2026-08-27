import { Card } from '@/components/ui/card'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Card className="border-dashed">
      <p className="text-xs font-medium tracking-widest text-muted uppercase">
        Coming in a future step
      </p>
      <h2 className="mt-2 text-lg font-medium">{title}</h2>
      <p className="mt-2 text-sm text-foreground-secondary">{description}</p>
    </Card>
  )
}
