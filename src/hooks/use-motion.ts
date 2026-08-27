import { useMemo } from 'react'
import { useSettingsStore } from '@/stores/settings-store'
import type { Transition, Variants } from 'framer-motion'

const spring: Transition = { type: 'spring', stiffness: 380, damping: 32 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: spring },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: spring },
}

/**
 * Returns Framer Motion props that respect the user's reduced-motion preference.
 */
export function useMotionConfig() {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)
  return useMemo(
    () => ({
      reducedMotion,
      transition: reducedMotion ? ({ duration: 0 } as Transition) : spring,
      initial: reducedMotion ? false : ('hidden' as const),
    }),
    [reducedMotion],
  )
}
