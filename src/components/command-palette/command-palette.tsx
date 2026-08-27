import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import {
  buildCommandItems,
  type CommandItem,
} from '@/domain/commands/build-command-items'
import { executeCommandItem } from '@/lib/commands/execute-command'
import { useCommandPaletteShortcut } from '@/hooks/use-command-palette-shortcut'
import { useMotionConfig } from '@/hooks/use-motion'
import { useCommandPaletteStore } from '@/stores/command-palette-store'
import { useGoalStore } from '@/stores/goal-store'
import { useHabitStore } from '@/stores/habit-store'
import { useQuestStore } from '@/stores/quest-store'

function CommandRow({
  item,
  selected,
  onSelect,
  onHover,
}: {
  item: CommandItem
  selected: boolean
  onSelect: () => void
  onHover: () => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
        selected
          ? 'bg-accent/15 text-foreground'
          : 'text-foreground-secondary hover:bg-surface hover:text-foreground'
      }`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 ${selected ? 'text-accent' : 'text-muted'}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{item.label}</p>
        {item.description && (
          <p className="truncate text-xs text-muted">{item.description}</p>
        )}
      </div>
      {item.group === 'Suggested' && (
        <span className="shrink-0 rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-accent uppercase">
          Match
        </span>
      )}
    </button>
  )
}

export function CommandPalette() {
  useCommandPaletteShortcut()
  const navigate = useNavigate()
  const { reducedMotion } = useMotionConfig()
  const isOpen = useCommandPaletteStore((s) => s.isOpen)
  const close = useCommandPaletteStore((s) => s.close)

  const quests = useQuestStore((s) => s.quests)
  const goals = useGoalStore((s) => s.goals)
  const habits = useHabitStore((s) => s.habits)

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [running, setRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const items = useMemo(
    () => buildCommandItems({ query, quests, goals, habits }),
    [query, quests, goals, habits],
  )

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    setSelectedIndex((i) => Math.min(i, Math.max(0, items.length - 1)))
  }, [items.length])

  const runItem = useCallback(
    async (item: CommandItem) => {
      if (running) return
      setRunning(true)
      close()
      try {
        await executeCommandItem(item, query, { navigate })
      } finally {
        setRunning(false)
        setQuery('')
      }
    },
    [running, close, query, navigate],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && items[selectedIndex]) {
      e.preventDefault()
      void runItem(items[selectedIndex])
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.15 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close command palette"
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98, y: -4 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                autoComplete="off"
                spellCheck={false}
                aria-autocomplete="list"
                aria-controls="command-palette-list"
              />
              <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline">
                esc
              </kbd>
            </div>

            <ul
              id="command-palette-list"
              role="listbox"
              className="max-h-80 overflow-y-auto p-2"
            >
              {items.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted">
                  No matching commands
                </li>
              ) : (
                items.map((item, index) => (
                  <li key={item.id}>
                    <CommandRow
                      item={item}
                      selected={index === selectedIndex}
                      onHover={() => setSelectedIndex(index)}
                      onSelect={() => void runItem(item)}
                    />
                  </li>
                ))
              )}
            </ul>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted">
              <span>↑↓ navigate</span>
              <span>↵ run</span>
              <span className="hidden sm:inline">⌘K toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
