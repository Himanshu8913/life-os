import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/form-field'
import { Modal } from '@/components/ui/modal'
import type { CreateGoalInput } from '@/stores/goal-store'
import { useGoalStore } from '@/stores/goal-store'
import type { Goal, GoalCategory } from '@/types'
import { GOAL_CATEGORIES } from '@/types/enums'
import { GOAL_CATEGORY_META } from '@/components/goals/goal-meta'

interface GoalFormModalProps {
  open: boolean
  onClose: () => void
  goal?: Goal | null
}

export function GoalFormModal({ open, onClose, goal }: GoalFormModalProps) {
  const addGoal = useGoalStore((s) => s.addGoal)
  const editGoal = useGoalStore((s) => s.editGoal)
  const isEdit = Boolean(goal)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<GoalCategory>('PERSONAL')
  const [targetDate, setTargetDate] = useState('')
  const [milestonesText, setMilestonesText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (goal) {
      setTitle(goal.title)
      setDescription(goal.description ?? '')
      setCategory(goal.category)
      setTargetDate(goal.targetDate?.slice(0, 10) ?? '')
      setMilestonesText(goal.milestones.map((m) => m.title).join('\n'))
    } else {
      setTitle('')
      setDescription('')
      setCategory('PERSONAL')
      setTargetDate('')
      setMilestonesText('')
    }
  }, [open, goal])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const milestoneTitles = milestonesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)

      if (isEdit && goal) {
        const existing = goal.milestones
        const milestones = milestoneTitles.map((t, order) => {
          const match = existing.find((m) => m.title === t)
          return match ?? {
            id: crypto.randomUUID(),
            title: t,
            completed: false,
            order,
          }
        })
        await editGoal(goal.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
          milestones,
        })
      } else {
        const input: CreateGoalInput = {
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
          milestoneTitles,
        }
        await addGoal(input)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Goal' : 'New Goal'}
      size="lg"
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <Field label="Title" htmlFor="goal-title">
          <Input
            id="goal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to achieve?"
            required
            autoFocus
          />
        </Field>

        <Field label="Description" htmlFor="goal-desc">
          <Textarea
            id="goal-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why does this matter?"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="goal-category">
            <Select
              id="goal-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as GoalCategory)}
            >
              {GOAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {GOAL_CATEGORY_META[c].icon} {GOAL_CATEGORY_META[c].label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Target Date" htmlFor="goal-target">
            <Input
              id="goal-target"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </Field>
        </div>

        {!isEdit && (
          <Field label="Milestones" htmlFor="goal-milestones">
            <Textarea
              id="goal-milestones"
              value={milestonesText}
              onChange={(e) => setMilestonesText(e.target.value)}
              placeholder={'One milestone per line\ne.g.\nResearch\nDesign\nLaunch'}
              className="min-h-[120px] font-mono text-xs"
            />
          </Field>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
