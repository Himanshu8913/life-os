import { useEffect } from 'react'
import { useCommandPaletteStore } from '@/stores/command-palette-store'

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

/**
 * Registers the global ⌘K / Ctrl+K shortcut to open the command palette.
 */
export function useCommandPaletteShortcut() {
  const toggle = useCommandPaletteStore((s) => s.toggle)
  const close = useCommandPaletteStore((s) => s.close)
  const isOpen = useCommandPaletteStore((s) => s.isOpen)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggle()
        return
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle, close, isOpen])
}

export function shouldIgnorePaletteKeys(target: EventTarget | null): boolean {
  return isEditableTarget(target)
}
