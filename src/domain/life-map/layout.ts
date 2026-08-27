import type { GoalCategory } from '@/types'

/** Life areas displayed on the map (PLAN §17). */
export const LIFE_MAP_CATEGORIES: GoalCategory[] = [
  'WORK',
  'LEARNING',
  'FITNESS',
  'FINANCE',
  'RELATIONSHIPS',
  'PERSONAL',
  'CREATIVE',
]

/** Radial layout angle per category (radians, 0 = top). */
export const LIFE_MAP_ANGLES: Record<GoalCategory, number> = {
  WORK: -Math.PI / 2,
  LEARNING: -Math.PI / 6,
  FITNESS: Math.PI / 6,
  FINANCE: Math.PI / 2,
  RELATIONSHIPS: (5 * Math.PI) / 6,
  PERSONAL: (7 * Math.PI) / 6,
  CREATIVE: (-5 * Math.PI) / 6,
  TRAVEL: Math.PI / 3,
  OTHER: 0,
}

export function getNodePosition(
  angle: number,
  radius: number,
  centerX: number,
  centerY: number,
): { x: number; y: number } {
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
  }
}
