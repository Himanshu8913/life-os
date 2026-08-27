import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMotionConfig } from '@/hooks/use-motion'
import { useFocusStore } from '@/stores/focus-store'

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function FocusOverlay() {
  const { reducedMotion } = useMotionConfig()
  const active = useFocusStore((s) => s.active)
  const complete = useFocusStore((s) => s.complete)
  const cancel = useFocusStore((s) => s.cancel)

  const [remaining, setRemaining] = useState(0)
  const [paused, setPaused] = useState(false)
  const [pausedAt, setPausedAt] = useState<number | null>(null)

  useEffect(() => {
    if (!active) {
      setPaused(false)
      setPausedAt(null)
      return
    }
    setRemaining(active.endsAt - Date.now())
  }, [active])

  useEffect(() => {
    if (!active || paused) return

    const tick = () => {
      const left = active.endsAt - Date.now()
      setRemaining(left)
      if (left <= 0) {
        void complete()
      }
    }

    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [active, paused, complete])

  const togglePause = () => {
    if (!active) return
    if (paused && pausedAt !== null) {
      const pauseDuration = Date.now() - pausedAt
      useFocusStore.setState({
        active: {
          ...active,
          endsAt: active.endsAt + pauseDuration,
        },
      })
      setPausedAt(null)
      setPaused(false)
    } else {
      setPausedAt(Date.now())
      setPaused(true)
    }
  }

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
        >
          <button
            type="button"
            onClick={() => void cancel()}
            className="absolute top-6 right-6 rounded-md p-2 text-muted hover:bg-surface hover:text-foreground"
            aria-label="Cancel focus session"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.p
            className="text-xs font-semibold tracking-[0.35em] text-accent uppercase"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Focus
          </motion.p>

          <motion.p
            className="mt-6 font-mono text-6xl font-light tabular-nums tracking-tight"
            key={Math.floor(remaining / 1000)}
            initial={reducedMotion ? false : { scale: 0.98 }}
            animate={{ scale: 1 }}
          >
            {formatTime(remaining)}
          </motion.p>

          <p className="mt-4 max-w-md text-center text-lg text-foreground-secondary">
            {active.title}
          </p>

          <div className="mt-10 flex gap-3">
            <Button variant="secondary" onClick={togglePause}>
              {paused ? (
                <>
                  <Play className="h-4 w-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              )}
            </Button>
            <Button onClick={() => void complete()}>Complete early</Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
