import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/form-field'
import { Modal } from '@/components/ui/modal'
import { useHabitStore, type CreateHabitInput } from '@/stores/habit-store'
import type { Habit, HabitFrequency } from '@/types'
import { HABIT_FREQUENCIES } from '@/types/enums'

interface HabitFormModalProps {
  open: boolean
  onClose: () => void
  habit?: Habit | null
}

export function HabitFormModal({ open, onClose, habit }: HabitFormModalProps) {
  const addHabit = useHabitStore((s) => s.addHabit)
  const editHabit = useHabitStore((s) => s.editHabit)
  const isEdit = Boolean(habit)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState<HabitFrequency>('DAILY')
  const [target, setTarget] = useState(1)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (habit) {
      setName(habit.name)
      setDescription(habit.description ?? '')
      setFrequency(habit.frequency)
      setTarget(habit.target)
    } else {
      setName('')
      setDescription('')
      setFrequency('DAILY')
      setTarget(1)
    }
  }, [open, habit])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      if (isEdit && habit) {
        await editHabit(habit.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          frequency,
          target,
        })
      } else {
        const input: CreateHabitInput = {
          name: name.trim(),
          description: description.trim() || undefined,
          frequency,
          target,
        }
        await addHabit(input)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Habit' : 'New Habit'}>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <Field label="Name" htmlFor="habit-name">
          <Input
            id="habit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Workout, Read, Meditate"
            required
            autoFocus
          />
        </Field>

        <Field label="Description" htmlFor="habit-desc">
          <Textarea
            id="habit-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Frequency" htmlFor="habit-freq">
            <Select
              id="habit-freq"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
            >
              {HABIT_FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f.charAt(0) + f.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Daily Target" htmlFor="habit-target">
            <Input
              id="habit-target"
              type="number"
              min={1}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !name.trim()}>
            {saving ? 'Saving…' : isEdit ? 'Save' : 'Create Habit'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
