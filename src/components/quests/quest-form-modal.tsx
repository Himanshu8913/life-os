import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/form-field'
import { Modal } from '@/components/ui/modal'
import { getDefaultXpForType } from '@/domain/quests/xp-config'
import { useQuestStore, type CreateQuestInput } from '@/stores/quest-store'
import type { Priority, Quest, QuestType } from '@/types'
import { PRIORITIES, QUEST_TYPES } from '@/types/enums'

interface QuestFormModalProps {
  open: boolean
  onClose: () => void
  quest?: Quest | null
}

export function QuestFormModal({ open, onClose, quest }: QuestFormModalProps) {
  const addQuest = useQuestStore((s) => s.addQuest)
  const editQuest = useQuestStore((s) => s.editQuest)
  const isEdit = Boolean(quest)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<QuestType>('SIDE')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [xpReward, setXpReward] = useState(getDefaultXpForType('SIDE'))
  const [dueDate, setDueDate] = useState('')
  const [tags, setTags] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<Quest['status']>('TODO')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (quest) {
      setTitle(quest.title)
      setDescription(quest.description ?? '')
      setType(quest.type)
      setPriority(quest.priority)
      setXpReward(quest.xpReward)
      setDueDate(quest.dueDate?.slice(0, 10) ?? '')
      setTags(quest.tags?.join(', ') ?? '')
      setNotes(quest.notes ?? '')
      setStatus(quest.status)
    } else {
      setTitle('')
      setDescription('')
      setType('SIDE')
      setPriority('MEDIUM')
      setXpReward(getDefaultXpForType('SIDE'))
      setDueDate('')
      setTags('')
      setNotes('')
      setStatus('TODO')
    }
  }, [open, quest])

  function handleTypeChange(next: QuestType) {
    setType(next)
    if (!isEdit) setXpReward(getDefaultXpForType(next))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      if (isEdit && quest) {
        await editQuest(quest.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          type,
          priority,
          xpReward,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          tags: tagList.length ? tagList : undefined,
          notes: notes.trim() || undefined,
          status,
        })
      } else {
        const input: CreateQuestInput = {
          title: title.trim(),
          description: description.trim() || undefined,
          type,
          priority,
          xpReward,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          tags: tagList.length ? tagList : undefined,
          notes: notes.trim() || undefined,
        }
        await addQuest(input)
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
      title={isEdit ? 'Edit Quest' : 'New Quest'}
      size="lg"
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <Field label="Title" htmlFor="quest-title">
          <Input
            id="quest-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            autoFocus
          />
        </Field>

        <Field label="Description" htmlFor="quest-desc">
          <Textarea
            id="quest-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details…"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type" htmlFor="quest-type">
            <Select
              id="quest-type"
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as QuestType)}
            >
              {QUEST_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Priority" htmlFor="quest-priority">
            <Select
              id="quest-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="XP Reward" htmlFor="quest-xp">
            <Input
              id="quest-xp"
              type="number"
              min={0}
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
            />
          </Field>

          <Field label="Due Date" htmlFor="quest-due">
            <Input
              id="quest-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Field>
        </div>

        {isEdit && (
          <Field label="Status" htmlFor="quest-status">
            <Select
              id="quest-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Quest['status'])}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
              <option value="CANCELLED">Cancelled</option>
            </Select>
          </Field>
        )}

        <Field label="Tags" htmlFor="quest-tags">
          <Input
            id="quest-tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="learning, fitness (comma separated)"
          />
        </Field>

        <Field label="Notes" htmlFor="quest-notes">
          <Textarea
            id="quest-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Private notes…"
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Quest'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
