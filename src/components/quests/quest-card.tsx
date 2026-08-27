import { motion } from 'framer-motion'
import { Archive, Check, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import {
  PRIORITY_META,
  QUEST_TYPE_META,
  STATUS_META,
} from '@/components/quests/quest-meta'
import { calculateQuestProgress } from '@/domain/quests/quest-utils'
import { useMotionConfig } from '@/hooks/use-motion'
import { useQuestStore } from '@/stores/quest-store'
import type { Quest } from '@/types'

interface QuestCardProps {
  quest: Quest
  onEdit: (quest: Quest) => void
  index?: number
}

export function QuestCard({ quest, onEdit, index = 0 }: QuestCardProps) {
  const completeQuest = useQuestStore((s) => s.completeQuest)
  const archiveQuest = useQuestStore((s) => s.archiveQuest)
  const removeQuest = useQuestStore((s) => s.removeQuest)
  const { reducedMotion } = useMotionConfig()
  const [completing, setCompleting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const meta = QUEST_TYPE_META[quest.type]
  const progress = calculateQuestProgress(quest)
  const isActive = ['TODO', 'IN_PROGRESS'].includes(quest.status)
  const canComplete = isActive && !completing

  async function handleComplete() {
    if (!canComplete) return
    setCompleting(true)
    try {
      await completeQuest(quest.id)
      setJustCompleted(true)
    } catch (error) {
      console.error(error)
    } finally {
      setCompleting(false)
    }
  }

  return (
    <motion.article
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: justCompleted ? 1.02 : 1,
      }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 380, damping: 30 }}
      className={`group relative overflow-hidden rounded-xl border border-border bg-surface/70 p-5 backdrop-blur-sm transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${
        quest.status === 'COMPLETED' ? 'opacity-75' : ''
      }`}
    >
      {justCompleted && (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-accent/10"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${meta.color}`} aria-hidden>
              {meta.icon}
            </span>
            <span className="text-xs font-medium tracking-widest text-muted uppercase">
              {meta.label}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_META[quest.status].className}`}
            >
              {STATUS_META[quest.status].label}
            </span>
          </div>
          <h3
            className={`mt-2 text-lg font-semibold tracking-tight ${
              quest.status === 'COMPLETED' ? 'line-through text-foreground-secondary' : ''
            }`}
          >
            {quest.title}
          </h3>
          {quest.description && (
            <p className="mt-1 text-sm text-foreground-secondary line-clamp-2">
              {quest.description}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-semibold text-accent">
            +{quest.xpReward} XP
          </p>
          <p className={`mt-0.5 text-xs ${PRIORITY_META[quest.priority].className}`}>
            {PRIORITY_META[quest.priority].label}
          </p>
        </div>
      </div>

      {quest.milestones && quest.milestones.length > 0 && (
        <div className="mt-4">
          <ProgressBar value={progress} label="Objectives" />
          <ul className="mt-3 space-y-1.5">
            {quest.milestones
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((m) => (
                <li
                  key={m.id}
                  className={`flex items-center gap-2 text-sm ${
                    m.completed ? 'text-foreground-secondary line-through' : ''
                  }`}
                >
                  <span className={m.completed ? 'text-success' : 'text-muted'}>
                    {m.completed ? '✓' : '○'}
                  </span>
                  {m.title}
                </li>
              ))}
          </ul>
        </div>
      )}

      {quest.tags && quest.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {quest.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface-elevated px-2 py-0.5 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        {canComplete && (
          <Button size="sm" onClick={() => void handleComplete()} disabled={completing}>
            <Check className="h-3.5 w-3.5" />
            {completing ? 'Completing…' : 'Complete'}
          </Button>
        )}
        {isActive && (
          <Button size="sm" variant="secondary" onClick={() => onEdit(quest)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
        {isActive && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => void archiveQuest(quest.id)}
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="text-danger hover:text-danger"
          onClick={() => {
            if (window.confirm(`Delete "${quest.title}"?`)) {
              void removeQuest(quest.id)
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.article>
  )
}
