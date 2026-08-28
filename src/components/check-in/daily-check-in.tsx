import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { hasCheckedInToday } from '@/domain/check-in/has-checked-in-today'
import { logDailyCheckIn } from '@/domain/check-in/log-daily-check-in'
import { getAllMoodEntries } from '@/db/repositories/mood-repository'
import { getAllTimelineEvents } from '@/db/repositories/timeline-repository'
import { Button } from '@/components/ui/button'
import { AnimatedCard } from '@/components/ui/animated-card'
import { fadeUp } from '@/hooks/use-motion'
import { useProfileStore } from '@/stores/profile-store'
import { useTimelineStore } from '@/stores/timeline-store'
import { useDailyMissionStore } from '@/stores/daily-mission-store'

const MOOD_EMOJI = ['', '😞', '😕', '😐', '🙂', '🤩'] as const

interface ScaleRowProps {
  label: string
  value: number
  onChange: (value: number) => void
  options: readonly string[]
}

function ScaleRow({ label, value, onChange, options }: ScaleRowProps) {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-muted uppercase">
        {label}
      </p>
      <div className="mt-2 flex gap-1" role="group" aria-label={label}>
        {options.map((option, index) => {
          const level = index + 1
          const selected = value === level
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              aria-pressed={selected}
              aria-label={`${label} ${level} of 5`}
              className={`flex h-10 flex-1 items-center justify-center rounded-lg border text-sm transition-colors ${
                selected
                  ? 'border-accent bg-accent/15 text-foreground'
                  : 'border-border text-foreground-secondary hover:border-accent/40'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DailyCheckIn() {
  const moodEntries = useProfileStore((s) => s.moodEntries)
  const setMoodEntries = useProfileStore((s) => s.setMoodEntries)
  const setEvents = useTimelineStore((s) => s.setEvents)

  const [mood, setMood] = useState(3)
  const [energy, setEnergy] = useState(3)
  const [focus, setFocus] = useState(3)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(() => hasCheckedInToday(moodEntries))

  if (done) {
    return (
      <AnimatedCard delay={0}>
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 text-sm text-foreground-secondary"
        >
          <Check className="h-4 w-4 text-success" aria-hidden />
          Check-in logged for today. See you tomorrow.
        </motion.div>
      </AnimatedCard>
    )
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      await logDailyCheckIn({ mood, energy, focus })
      const [entries, events] = await Promise.all([
        getAllMoodEntries(),
        getAllTimelineEvents(),
      ])
      setMoodEntries(entries)
      setEvents(events)
      setDone(true)
      await useDailyMissionStore.getState().sync()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatedCard elevated delay={0}>
      <motion.div variants={fadeUp}>
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          How are you today?
        </p>
        <p className="mt-1 text-sm text-foreground-secondary">
          Quick mood, energy, and focus check-in.
        </p>

        <div className="mt-5 space-y-5">
          <ScaleRow
            label="Mood"
            value={mood}
            onChange={setMood}
            options={MOOD_EMOJI.slice(1)}
          />
          <ScaleRow
            label="Energy"
            value={energy}
            onChange={setEnergy}
            options={['1', '2', '3', '4', '5']}
          />
          <ScaleRow
            label="Focus"
            value={focus}
            onChange={setFocus}
            options={['1', '2', '3', '4', '5']}
          />
        </div>

        <Button
          className="mt-6 w-full sm:w-auto"
          onClick={() => void handleSubmit()}
          disabled={submitting}
        >
          {submitting ? 'Saving…' : 'Log check-in'}
        </Button>
      </motion.div>
    </AnimatedCard>
  )
}
