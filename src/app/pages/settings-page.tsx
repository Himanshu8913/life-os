import { PageHeader } from '@/components/layout/page-header'
import { Card } from '@/components/ui/card'
import { useSettingsStore } from '@/stores/settings-store'

export function SettingsPage() {
  const { accentColor, reducedMotion, setAccentColor, setReducedMotion } =
    useSettingsStore()

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Customize your Life OS experience."
      />

      <div className="space-y-4">
        <Card>
          <label className="block text-sm font-medium" htmlFor="accent-color">
            Accent Color
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="accent-color"
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
            />
            <span className="font-mono text-sm text-foreground-secondary">
              {accentColor}
            </span>
          </div>
        </Card>

        <Card>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            Reduce motion
          </label>
        </Card>
      </div>
    </div>
  )
}
