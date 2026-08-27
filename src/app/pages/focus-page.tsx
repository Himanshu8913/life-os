import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useFocusStore } from '@/stores/focus-store'

const DURATION_PRESETS = [25, 50, 90] as const

export function FocusPage() {
  const start = useFocusStore((s) => s.start)
  const active = useFocusStore((s) => s.active)
  const { initial } = useMotionConfig()

  const [minutes, setMinutes] = useState<number>(25)
  const [title, setTitle] = useState('')
  const [starting, setStarting] = useState(false)

  async function handleStart() {
    setStarting(true)
    try {
      await start(minutes, title.trim() || 'Focus session')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Focus"
        description="Distraction-free deep work. Start a timer and stay in the zone."
      />

      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <AnimatedCard elevated delay={0}>
          <motion.div variants={fadeUp} className="text-center">
            <Timer className="mx-auto h-12 w-12 text-accent" aria-hidden />
            <p className="mt-4 text-xs font-medium tracking-widest text-muted uppercase">
              Duration
            </p>
            <div className="mt-3 flex justify-center gap-2">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMinutes(preset)}
                  aria-pressed={minutes === preset}
                  className={`rounded-lg border px-4 py-2 font-mono text-sm transition-colors ${
                    minutes === preset
                      ? 'border-accent bg-accent/15 text-foreground'
                      : 'border-border text-foreground-secondary hover:border-accent/40'
                  }`}
                >
                  {preset}m
                </button>
              ))}
            </div>

            <label htmlFor="focus-title" className="mt-8 block text-left text-sm font-medium">
              Session title
            </label>
            <input
              id="focus-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you working on?"
              className="mt-2 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm outline-none focus:border-accent"
            />

            <Button
              className="mt-6 w-full"
              onClick={() => void handleStart()}
              disabled={starting || Boolean(active)}
            >
              {active ? 'Session in progress' : starting ? 'Starting…' : 'Start focus'}
            </Button>

            {active && (
              <p className="mt-3 text-sm text-foreground-secondary">
                A focus overlay is active. Complete or cancel it from the timer.
              </p>
            )}
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.05}>
          <motion.div variants={fadeUp}>
            <p className="text-sm text-foreground-secondary">
              You can also start focus from the{' '}
              <button
                type="button"
                className="text-accent hover:underline"
                onClick={() => {
                  document.dispatchEvent(
                    new KeyboardEvent('keydown', {
                      key: 'k',
                      metaKey: true,
                      bubbles: true,
                    }),
                  )
                }}
              >
                command palette
              </button>{' '}
              with <kbd className="rounded border border-border px-1 font-mono text-xs">⌘K</kbd>.
            </p>
            <Link
              to={ROUTES.dashboard}
              className="mt-4 inline-block text-sm text-accent hover:underline"
            >
              Back to dashboard
            </Link>
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  )
}
