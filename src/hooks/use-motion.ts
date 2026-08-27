import { useMemo } from 'react'
import { useSettingsStore } from '@/stores/settings-store'
import type { Transition, Variants } from 'framer-motion'

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
}

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
}

export const easeOut: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
}

const spring = springSnappy

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: spring },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: springSoft },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: spring },
}

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: springSnappy },
}

export const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: springSoft },
}

export const pageTransition = {
  initial: { opacity: 0, y: 18, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)' },
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
      softTransition: reducedMotion ? ({ duration: 0 } as Transition) : springSoft,
      initial: reducedMotion ? false : ('hidden' as const),
      pageTransition: reducedMotion
        ? { initial: false, animate: {}, exit: {} }
        : pageTransition,
    }),
    [reducedMotion],
  )
}
