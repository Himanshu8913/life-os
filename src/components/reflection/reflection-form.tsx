import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Textarea } from '@/components/ui/form-field'
import { getWeekStartKey } from '@/domain/reflection/week-utils'
import type { Reflection } from '@/types'

export interface ReflectionFormValues {
  wentWell: string
  wentPoorly: string
  proudOf: string
  nextWeekFocus: string
}

interface ReflectionFormProps {
  initial?: Reflection | null
  onSubmit: (values: ReflectionFormValues) => Promise<void>
  saving?: boolean
}

const QUESTIONS = [
  { id: 'wentWell', label: 'What went well?', placeholder: 'Wins, progress, moments that felt good…' },
  { id: 'wentPoorly', label: "What didn't go well?", placeholder: 'Challenges, friction, things to improve…' },
  { id: 'proudOf', label: 'What are you proud of?', placeholder: 'Your biggest win this week…' },
  { id: 'nextWeekFocus', label: 'What matters next week?', placeholder: 'One priority to carry forward…' },
] as const

export function ReflectionForm({ initial, onSubmit, saving }: ReflectionFormProps) {
  const [wentWell, setWentWell] = useState('')
  const [wentPoorly, setWentPoorly] = useState('')
  const [proudOf, setProudOf] = useState('')
  const [nextWeekFocus, setNextWeekFocus] = useState('')

  useEffect(() => {
    if (!initial) return
    setWentWell(initial.wentWell)
    setWentPoorly(initial.wentPoorly)
    setProudOf(initial.proudOf)
    setNextWeekFocus(initial.nextWeekFocus)
  }, [initial])

  const values: Record<(typeof QUESTIONS)[number]['id'], string> = {
    wentWell,
    wentPoorly,
    proudOf,
    nextWeekFocus,
  }

  const setters: Record<(typeof QUESTIONS)[number]['id'], (v: string) => void> = {
    wentWell: setWentWell,
    wentPoorly: setWentPoorly,
    proudOf: setProudOf,
    nextWeekFocus: setNextWeekFocus,
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({ wentWell, wentPoorly, proudOf, nextWeekFocus })
  }

  const weekStart = initial?.weekStart ?? getWeekStartKey()

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      <p className="text-xs text-muted">
        Week of {new Date(`${weekStart}T12:00:00`).toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>

      {QUESTIONS.map(({ id, label, placeholder }) => (
        <Field key={id} label={label} htmlFor={id}>
          <Textarea
            id={id}
            value={values[id]}
            onChange={(e) => setters[id](e.target.value)}
            placeholder={placeholder}
            rows={3}
            required={id === 'wentWell' || id === 'nextWeekFocus'}
          />
        </Field>
      ))}

      <Button type="submit" disabled={saving} className="w-full sm:w-auto">
        {saving ? 'Saving…' : initial ? 'Update reflection' : 'Submit reflection'}
      </Button>
    </form>
  )
}
