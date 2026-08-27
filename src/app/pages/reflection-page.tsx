import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/page-header'
import { ReflectionForm } from '@/components/reflection/reflection-form'
import { ReflectionHistory } from '@/components/reflection/reflection-history'
import { ReflectionSummaryCard } from '@/components/reflection/reflection-summary-card'
import { AnimatedCard } from '@/components/ui/animated-card'
import { getWeekStartKey } from '@/domain/reflection/week-utils'
import { staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useReflectionStore } from '@/stores/reflection-store'

export function ReflectionPage() {
  const reflections = useReflectionStore((s) => s.reflections)
  const lastSummary = useReflectionStore((s) => s.lastSummary)
  const submitReflection = useReflectionStore((s) => s.submitReflection)
  const getSummaryForReflection = useReflectionStore((s) => s.getSummaryForReflection)
  const clearLastSummary = useReflectionStore((s) => s.clearLastSummary)
  const { initial } = useMotionConfig()

  const [saving, setSaving] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const weekStart = getWeekStartKey()
  const currentWeekReflection = useMemo(
    () => reflections.find((r) => r.weekStart === weekStart) ?? null,
    [reflections, weekStart],
  )

  const displaySummary =
    lastSummary ??
    (currentWeekReflection
      ? getSummaryForReflection(currentWeekReflection)
      : null)

  async function handleSubmit(values: {
    wentWell: string
    wentPoorly: string
    proudOf: string
    nextWeekFocus: string
  }) {
    setSaving(true)
    try {
      clearLastSummary()
      await submitReflection(values)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Reflection"
        description="A weekly pause to notice what moved you forward — summary built from your answers and activity."
      />

      <motion.div
        className="grid gap-8 lg:grid-cols-2"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <AnimatedCard elevated delay={0}>
          <h2 className="mb-5 text-sm font-medium">This week</h2>
          <ReflectionForm
            initial={currentWeekReflection}
            onSubmit={handleSubmit}
            saving={saving}
          />
        </AnimatedCard>

        <div className="space-y-6">
          {displaySummary && (
            <ReflectionSummaryCard summary={displaySummary} />
          )}
          {!displaySummary && (
            <div className="rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-sm text-foreground-secondary">
                Submit your reflection to generate a weekly summary card.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <section className="mt-10">
        <h2 className="mb-4 text-sm font-medium tracking-widest text-muted uppercase">
          History
        </h2>
        <ReflectionHistory
          reflections={reflections}
          getSummary={getSummaryForReflection}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </section>
    </div>
  )
}
