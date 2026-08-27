import { useState } from 'react'
import { motion } from 'framer-motion'
import { completeOnboarding } from '@/domain/onboarding/complete-onboarding'
import { ONBOARDING_FOCUS_AREAS } from '@/domain/onboarding/onboarding-focus-areas'
import { GOAL_CATEGORY_META } from '@/domain/goals/category-meta'
import { Button } from '@/components/ui/button'
import { useMotionConfig } from '@/hooks/use-motion'
import type { GoalCategory } from '@/types'
import { useProfileStore } from '@/stores/profile-store'
import { useSettingsStore } from '@/stores/settings-store'

export function OnboardingFlow() {
  const { reducedMotion } = useMotionConfig()
  const profile = useProfileStore((s) => s.profile)
  const setProfile = useProfileStore((s) => s.setProfile)
  const setOnboardingCompleted = useSettingsStore((s) => s.setOnboardingCompleted)

  const [name, setName] = useState(profile?.displayName ?? '')
  const [focusAreas, setFocusAreas] = useState<GoalCategory[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function toggleArea(category: GoalCategory) {
    setFocusAreas((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await completeOnboarding(name, focusAreas)
      if (profile) {
        setProfile({ ...profile, displayName: result.displayName })
      }
      setOnboardingCompleted(true, result.focusAreas)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save onboarding.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <motion.form
        onSubmit={(e) => void handleSubmit(e)}
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-xl"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs font-semibold tracking-[0.28em] text-muted uppercase">
          Welcome to Life OS
        </p>
        <h1 id="onboarding-title" className="mt-2 text-2xl font-semibold">
          Let&apos;s set up your command center
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          No account needed — everything stays on this device.
        </p>

        <div className="mt-8">
          <label htmlFor="onboarding-name" className="text-sm font-medium">
            What should we call you?
          </label>
          <input
            id="onboarding-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            autoFocus
            className="mt-2 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <fieldset className="mt-8">
          <legend className="text-sm font-medium">
            Choose your focus areas
          </legend>
          <p className="mt-1 text-xs text-foreground-secondary">
            Pick any that matter to you right now.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {ONBOARDING_FOCUS_AREAS.map((category) => {
              const meta = GOAL_CATEGORY_META[category]
              const selected = focusAreas.includes(category)
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleArea(category)}
                  aria-pressed={selected}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    selected
                      ? 'border-accent bg-accent/10 text-foreground'
                      : 'border-border text-foreground-secondary hover:border-accent/40'
                  }`}
                >
                  <span aria-hidden>{meta.icon}</span>
                  {meta.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        {error && (
          <p className="mt-4 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="mt-8 w-full"
          disabled={submitting || !name.trim()}
        >
          {submitting ? 'Saving…' : 'Enter Life OS'}
        </Button>
      </motion.form>
    </div>
  )
}
