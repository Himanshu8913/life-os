import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useMotionConfig } from '@/hooks/use-motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'md' | 'lg'
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const { reducedMotion } = useMotionConfig()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const widthClass = size === 'lg' ? 'max-w-xl' : 'max-w-lg'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`relative z-10 w-full ${widthClass} rounded-xl border border-border bg-surface-elevated p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]`}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id="modal-title" className="text-lg font-semibold">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-foreground-secondary hover:bg-surface hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
