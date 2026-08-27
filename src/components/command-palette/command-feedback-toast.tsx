import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { useMotionConfig } from '@/hooks/use-motion'
import { useCommandPaletteStore } from '@/stores/command-palette-store'

export function CommandFeedbackToast() {
  const feedback = useCommandPaletteStore((s) => s.feedback)
  const clearFeedback = useCommandPaletteStore((s) => s.clearFeedback)
  const { reducedMotion } = useMotionConfig()

  useEffect(() => {
    if (!feedback) return
    const id = window.setTimeout(clearFeedback, 4000)
    return () => window.clearTimeout(id)
  }, [feedback, clearFeedback])

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-3 rounded-xl border border-border bg-surface-elevated px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
          role="status"
        >
          <Sparkles className="h-4 w-4 text-accent" aria-hidden />
          <p className="text-sm">{feedback}</p>
          <button
            type="button"
            onClick={clearFeedback}
            className="rounded p-1 text-muted hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
