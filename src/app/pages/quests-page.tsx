import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Plus, Swords } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { QuestCard } from '@/components/quests/quest-card'
import { QuestFormModal } from '@/components/quests/quest-form-modal'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useQuestStore } from '@/stores/quest-store'
import type { Quest } from '@/types'

type FilterTab = 'active' | 'daily' | 'main' | 'completed' | 'all'

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'daily', label: 'Daily' },
  { id: 'main', label: 'Main' },
  { id: 'completed', label: 'Completed' },
  { id: 'all', label: 'All' },
]

function filterQuests(quests: Quest[], tab: FilterTab): Quest[] {
  switch (tab) {
    case 'active':
      return quests.filter((q) => ['TODO', 'IN_PROGRESS'].includes(q.status))
    case 'daily':
      return quests.filter((q) => q.type === 'DAILY')
    case 'main':
      return quests.filter((q) => q.type === 'MAIN' || q.type === 'EPIC')
    case 'completed':
      return quests.filter((q) => q.status === 'COMPLETED')
    default:
      return quests
  }
}

export function QuestsPage() {
  const quests = useQuestStore((s) => s.quests)
  const [tab, setTab] = useState<FilterTab>('active')
  const [formOpen, setFormOpen] = useState(false)
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null)
  const { initial } = useMotionConfig()

  const filtered = useMemo(() => filterQuests(quests, tab), [quests, tab])

  function openCreate() {
    setEditingQuest(null)
    setFormOpen(true)
  }

  function openEdit(quest: Quest) {
    setEditingQuest(quest)
    setFormOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Quests"
        description="Missions and tasks that drive your progress."
      >
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Quest
        </Button>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-accent text-white shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_40%,transparent)]'
                : 'bg-surface text-foreground-secondary hover:bg-surface-elevated hover:text-foreground'
            }`}
          >
            {label}
            <span className="ml-1.5 font-mono text-xs opacity-70">
              {filterQuests(quests, id).length}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
        key={tab}
      >
        {filtered.length === 0 ? (
          <motion.div variants={fadeUp}>
            <EmptyState
              title="No quests yet"
              description="Your first quest starts here."
              actionLabel="Create quest"
              onAction={openCreate}
              icon={<Swords className="h-8 w-8" />}
            />
          </motion.div>
        ) : (
          filtered.map((quest, index) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={index}
              onEdit={openEdit}
            />
          ))
        )}
      </motion.div>

      <QuestFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingQuest(null)
        }}
        quest={editingQuest}
      />
    </div>
  )
}
